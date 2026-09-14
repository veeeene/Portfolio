import { supabase } from "./supabase";

/**
 * Hybrid Supabase + localStorage CMS store.
 * - Saves instantly to localStorage for 0ms lag.
 * - Syncs asynchronously to Supabase cloud database.
 * - On page load, syncFromSupabase() fetches the latest cloud data for all visitors.
 * - Falls back to static data from resume.ts if no override exists.
 */

const PREFIX = "portfolio_cms_";

export const cms = {
  /** Read data, falling back to the static default if no override exists */
  getData<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  /** Save an override to localStorage and sync to Supabase */
  setData<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new Event("portfolio_cms_updated"));

    // Async sync to Supabase
    if (supabase) {
      supabase
        .from("portfolio_content")
        .upsert({
          id: key,
          content: value,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn(`Supabase sync error for ${key}:`, error.message);
        });
    }
  },

  /** Remove an override so the section falls back to static data */
  resetData(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PREFIX + key);
    window.dispatchEvent(new Event("portfolio_cms_updated"));

    if (supabase) {
      supabase
        .from("portfolio_content")
        .delete()
        .eq("id", key)
        .then(({ error }) => {
          if (error) console.warn(`Supabase delete error for ${key}:`, error.message);
        });
    }
  },

  /** Store a raw string (e.g. image URL) directly */
  setRaw(key: string, value: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(PREFIX + key, value);
    window.dispatchEvent(new Event("portfolio_cms_updated"));

    if (supabase) {
      supabase
        .from("portfolio_content")
        .upsert({
          id: key,
          content: { raw: value },
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn(`Supabase sync error for raw ${key}:`, error.message);
        });
    }
  },

  /** Read a raw string value */
  getRaw(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PREFIX + key);
  },

  /**
   * Fetch all cloud overrides from Supabase and sync them to local cache.
   * Called once when the application loads.
   */
  async syncFromSupabase(): Promise<boolean> {
    if (!supabase || typeof window === "undefined") return false;

    try {
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("id, content");

      if (error || !data) {
        console.warn("Supabase fetch error:", error?.message);
        return false;
      }

      let updated = false;
      for (const row of data) {
        const key = PREFIX + row.id;
        if (row.content && typeof row.content === "object" && "raw" in row.content) {
          localStorage.setItem(key, String((row.content as Record<string, unknown>).raw));
          updated = true;
        } else if (row.content !== undefined) {
          localStorage.setItem(key, JSON.stringify(row.content));
          updated = true;
        }
      }

      if (updated) {
        window.dispatchEvent(new Event("portfolio_cms_updated"));
      }
      return true;
    } catch (err) {
      console.error("Failed to sync from Supabase:", err);
      return false;
    }
  },

  /** Export all CMS overrides as a JSON string (for backup or copy-to-code) */
  exportAll(): string {
    if (typeof window === "undefined") return "{}";
    const result: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        const cleanKey = k.replace(PREFIX, "");
        try {
          result[cleanKey] = JSON.parse(localStorage.getItem(k) || "null");
        } catch {
          result[cleanKey] = localStorage.getItem(k);
        }
      }
    }
    return JSON.stringify(result, null, 2);
  },
};

/** CMS keys — use these constants everywhere to avoid typos */
export const CMS_KEYS = {
  projects: "projects",
  certifications: "certifications",
  experiences: "experiences",
  skills: "skills",
  hero: "hero",
  stats: "stats",
  profileImage: "profile_image",
} as const;

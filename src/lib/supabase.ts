import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads an image file to Supabase Storage bucket 'portfolio-media'
 * and returns the public HTTPS URL.
 */
export async function uploadMediaToSupabase(
  file: File,
  folder: "projects" | "profile" | "certificates" = "projects"
): Promise<string | null> {
  if (!supabase) return null;

  try {
    const ext = file.name.split(".").pop() || "png";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase upload error:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(filename);

    return data?.publicUrl || null;
  } catch (err) {
    console.error("Failed to upload media to Supabase:", err);
    return null;
  }
}

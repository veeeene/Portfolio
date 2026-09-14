/**
 * Lightweight client-side auth for admin CMS.
 * Uses SHA-256 (Web Crypto API) to verify the password.
 * Session is stored in sessionStorage (clears when tab closes).
 *
 * DEFAULT PASSWORD: justine2026
 * To change: run `auth.generateHash("newpassword")` in the browser console,
 * then paste the result into STORED_HASH below.
 */

const STORED_HASH =
  "40cc562f2d4df3944735467a0005cc25007fffa5c904f6326961cb2d36c11245";

const SESSION_KEY = "portfolio_admin_session";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const auth = {
  /** Hash a plaintext password — call in console to get a new hash */
  async generateHash(password: string): Promise<string> {
    return sha256(password);
  },

  /** Verify password and start session */
  async login(password: string): Promise<boolean> {
    const hash = await sha256(password);
    if (hash === STORED_HASH) {
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  },

  /** Clear session */
  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },

  /** Check if currently logged in */
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  },
};

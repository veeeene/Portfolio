"use client";

import React, { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

export type Theme = "system" | "light" | "dark";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "dark" || stored === "light" || stored === "system") {
        setThemeState(stored);
        applyTheme(stored, false);
      } else {
        applyTheme("system", false);
      }
    } catch {
      applyTheme("system", false);
    }
  }, []);

  const applyTheme = (targetTheme: Theme, animate = true) => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark =
      targetTheme === "dark" || (targetTheme === "system" && mq.matches);

    if (animate) {
      root.classList.add("theme-anim");
    }

    root.classList.toggle("dark", isDark);

    if (animate) {
      setTimeout(() => {
        root.classList.remove("theme-anim");
      }, 520);
    }
  };

  const handleSetTheme = (newTheme: Theme, e?: React.MouseEvent) => {
    sound.play("toggle");
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}

    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const isTargetDark =
      newTheme === "dark" || (newTheme === "system" && mq.matches);

    // If current DOM state already matches target theme, just return
    if (root.classList.contains("dark") === isTargetDark) return;

    // View Transitions API circular reveal if available
    if (
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? window.innerHeight / 2;
      const r = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const vt = (document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void> };
      }).startViewTransition(() => {
        applyTheme(newTheme, false);
      });

      vt.ready.then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${r}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 540,
            easing: "cubic-bezier(.32,.08,.24,1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      }).catch(() => {
        applyTheme(newTheme, true);
      });
    } else {
      applyTheme(newTheme, true);
    }
  };

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 p-0.5 dark:border-gray-800">
        <div className="h-5 w-5 rounded-full" />
        <div className="h-5 w-5 rounded-full" />
        <div className="h-5 w-5 rounded-full" />
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-white p-0.5 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* System option */}
      <button
        type="button"
        onClick={(e) => handleSetTheme("system", e)}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          theme === "system"
            ? "bg-gray-100 text-ink dark:bg-gray-800"
            : "text-gray-400 hover:text-ink"
        }`}
        title="System theme"
        aria-label="System theme"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 stroke-current" strokeWidth="1.7">
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M9 21h6M12 17v4" strokeLinecap="round" />
        </svg>
      </button>

      {/* Light option */}
      <button
        type="button"
        onClick={(e) => handleSetTheme("light", e)}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          theme === "light"
            ? "bg-gray-100 text-ink dark:bg-gray-800"
            : "text-gray-400 hover:text-ink"
        }`}
        title="Light theme"
        aria-label="Light theme"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 stroke-current" strokeWidth="1.7">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dark option */}
      <button
        type="button"
        onClick={(e) => handleSetTheme("dark", e)}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          theme === "dark"
            ? "bg-gray-100 text-ink dark:bg-gray-800"
            : "text-gray-400 hover:text-ink"
        }`}
        title="Dark theme"
        aria-label="Dark theme"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 stroke-current" strokeWidth="1.7">
          <path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

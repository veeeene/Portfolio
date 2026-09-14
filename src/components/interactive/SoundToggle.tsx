"use client";

import React, { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(sound.isEnabled());
  }, []);

  const handleToggle = () => {
    const newState = sound.toggle();
    setEnabled(newState);
  };

  if (!mounted) {
    return <div className="h-[28px] w-[28px] rounded-full border border-gray-200 dark:border-gray-800" />;
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable interface sounds" : "Enable interface sounds"}
      title={enabled ? "Sounds on" : "Sounds off"}
      className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-ink dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-ink"
    >
      {enabled ? (
        <svg className="h-3.5 w-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.7">
          <path d="M5 10v4h3l4 3V7L8 10H5zM16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.7">
          <path d="M5 10v4h3l4 3V7L8 10H5zM16 10l5 5M21 10l-5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

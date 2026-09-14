"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RESUME_DATA } from "@/data/resume";
import { ThemeToggle } from "../interactive/ThemeToggle";
import { SoundToggle } from "../interactive/SoundToggle";
import { sound } from "@/lib/sound";

interface SidebarProps {
  onOpenCommandK: () => void;
}

export function Sidebar({ onOpenCommandK }: SidebarProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent || ""));
  }, []);

  const navLinks = [
    { label: "01 — projects", href: "#projects" },
    { label: "02 — experience", href: "#experience" },
    { label: "03 — stack", href: "#stack" },
    { label: "04 — activity", href: "#activity" },
    { label: "05 — certifications", href: "#certifications" },
    { label: "06 — education", href: "#education" },
    { label: "07 — reference", href: "#reference" },
  ];

  return (
    <nav className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-gray-200 bg-white px-7 py-8 lg:flex dark:border-gray-800 dark:bg-[#0c0c0f]">
      {/* Pixel Brand Logo */}
      <Link
        href="#top"
        onClick={() => sound.play("tick")}
        className="shrink-0 font-pixel text-[15px] leading-none tracking-tight text-ink transition-opacity hover:opacity-60"
      >
        {RESUME_DATA.pixelName}
      </Link>

      {/* Nav Link Groups */}
      <div className="mt-9 flex flex-1 flex-col gap-4 overflow-y-auto font-mono text-[13px]">
        <div className="flex flex-col gap-2.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => sound.play("tick")}
              className="relative inline-flex w-fit items-center gap-2 text-gray-500 transition-colors hover:text-ink dark:text-gray-400 dark:hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-800" />

        <div className="flex flex-col gap-2.5 text-[12px]">
          <a
            href={RESUME_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.play("tick")}
            className="relative inline-flex w-fit items-center gap-1.5 text-gray-500 transition-colors hover:text-ink dark:text-gray-400 dark:hover:text-ink"
          >
            github ↗
          </a>
          <a
            href={`mailto:${RESUME_DATA.email}`}
            onClick={() => sound.play("tick")}
            className="relative inline-flex w-fit items-center gap-1.5 text-gray-500 transition-colors hover:text-ink dark:text-gray-400 dark:hover:text-ink"
          >
            email ↗
          </a>
        </div>
      </div>

      {/* Command Palette Trigger */}
      <button
        type="button"
        onClick={() => {
          sound.play("open");
          onOpenCommandK();
        }}
        className="mt-6 inline-flex w-fit items-center gap-2 font-mono text-[12px] text-gray-400 transition-colors hover:text-ink dark:text-gray-500 dark:hover:text-ink"
      >
        <span>Ask / Search</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            {isMac ? "⌘" : "Alt"}
          </kbd>
          <span className="font-mono text-[10px] text-gray-400">+</span>
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            K
          </kbd>
        </span>
      </button>

      {/* Live Presence Indicator */}
      <div className="mt-4 border-y border-gray-200 py-3.5 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <p className="font-mono text-[10.5px] text-gray-400 dark:text-gray-500">
            <b className="font-bold text-ink">1</b> person viewing now
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 shrink-0">
        <div className="mb-4 flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle />
        </div>
        <p className="font-mono text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
          Available for roles & collabs
        </p>
        <a
          href={`mailto:${RESUME_DATA.email}`}
          onClick={() => sound.play("tick")}
          className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-[11.5px] text-ink transition-colors hover:text-gray-500 dark:text-ink dark:hover:text-gray-400"
        >
          {RESUME_DATA.email}
        </a>
      </div>
    </nav>
  );
}

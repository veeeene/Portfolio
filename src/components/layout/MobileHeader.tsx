"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RESUME_DATA } from "@/data/resume";
import { ThemeToggle } from "../interactive/ThemeToggle";
import { SoundToggle } from "../interactive/SoundToggle";
import { sound } from "@/lib/sound";

interface MobileHeaderProps {
  onOpenCommandK: () => void;
}

export function MobileHeader({ onOpenCommandK }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    sound.play(isOpen ? "close" : "open");
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  };

  const closeMenu = () => {
    sound.play("close");
    setIsOpen(false);
    document.body.style.overflow = "";
  };

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
    <>
      {/* Sticky Mobile Top Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 px-6 py-3 backdrop-blur-md lg:hidden dark:border-gray-800/80 dark:bg-[#0c0c0f]/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="#top"
            onClick={() => sound.play("tick")}
            className="font-pixel text-[14px] text-ink"
          >
            {RESUME_DATA.pixelName}
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="-mr-1 p-1 text-gray-700 transition-colors hover:text-ink dark:text-gray-300 dark:hover:text-ink"
          >
            {isOpen ? (
              <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Full-Screen Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white px-7 py-8 lg:hidden dark:bg-[#0c0c0f]">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <span className="font-pixel text-[14px] text-ink">{RESUME_DATA.pixelName}</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="-mr-1 p-1 text-gray-700 hover:text-ink dark:text-gray-300 dark:hover:text-ink"
            >
              <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto font-mono text-[16px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-1 text-gray-600 transition-colors hover:text-ink dark:text-gray-400 dark:hover:text-ink"
              >
                {link.label}
              </a>
            ))}

            <div className="my-3 h-px bg-gray-200 dark:bg-gray-800" />

            <div className="flex flex-col gap-3 text-[14px]">
              <a
                href={RESUME_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-ink dark:text-gray-400 dark:hover:text-ink"
              >
                github ↗
              </a>
              <a
                href={`mailto:${RESUME_DATA.email}`}
                className="text-gray-600 hover:text-ink dark:text-gray-400 dark:hover:text-ink"
              >
                email ↗
              </a>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <SoundToggle />
              </div>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setTimeout(onOpenCommandK, 200);
                }}
                className="font-mono text-[13px] text-gray-500 hover:text-ink dark:text-gray-400 dark:hover:text-ink"
              >
                Ask / Search ⌘K
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useEffect, useState, useRef } from "react";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";

interface CommandKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandKModal({ isOpen, onClose }: CommandKModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.altKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          sound.play("close");
          onClose();
        } else {
          sound.play("open");
          // Parent triggers open
        }
      }
      if (e.key === "Escape" && isOpen) {
        sound.play("close");
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = RESUME_DATA.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCerts = RESUME_DATA.certifications.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const quickNav = [
    { label: "Hero & Intro", href: "#top" },
    { label: "Featured 3D Projects Deck", href: "#projects" },
    { label: "All Projects Archive", href: "#all-projects" },
    { label: "Experience Timeline", href: "#experience" },
    { label: "Tech Stack & Skills", href: "#stack" },
    { label: "GitHub Activity & Heatmap", href: "#activity" },
    { label: "Certifications", href: "#certifications" },
    { label: "Education (BulSU)", href: "#education" },
    { label: "Character Reference", href: "#reference" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => {
          sound.play("close");
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-bryl-modal transition-all dark:border-gray-800 dark:bg-[#121215]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3.5 dark:border-gray-800">
          <svg
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              sound.play("tick");
            }}
            placeholder="Search projects, skills, certifications, or sections..."
            className="flex-1 bg-transparent font-mono text-[13.5px] text-ink outline-none placeholder:text-gray-400"
          />
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 dark:border-gray-800">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <a
                    key={p.id}
                    href={`#all-projects`}
                    onClick={() => {
                      sound.play("tick");
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div>
                      <span className="font-medium text-ink">{p.title}</span>
                      <span className="ml-2 font-mono text-[11px] text-gray-400">
                        {p.tags.slice(0, 3).join(", ")}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-gray-400">jump ↵</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Results */}
          {filteredCerts.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                Certifications
              </div>
              <div className="space-y-1">
                {filteredCerts.map((c) => (
                  <a
                    key={c.id}
                    href="#certifications"
                    onClick={() => {
                      sound.play("tick");
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="font-medium text-ink">{c.title}</span>
                    <span className="font-mono text-[11px] text-gray-400">{c.issuer}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Links */}
          <div>
            <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1">
              {quickNav.map((nav) => (
                <a
                  key={nav.href}
                  href={nav.href}
                  onClick={() => {
                    sound.play("tick");
                    onClose();
                  }}
                  className="rounded-lg px-3 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-100 hover:text-ink dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-ink"
                >
                  {nav.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-right font-mono text-[10.5px] text-gray-400 dark:border-gray-800 dark:bg-gray-900/40">
          <span>Tip: Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
}

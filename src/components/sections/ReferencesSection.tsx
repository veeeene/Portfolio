"use client";

import React from "react";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";

export function ReferencesSection() {
  const ref = RESUME_DATA.reference;

  return (
    <section id="reference" className="py-14 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          07 — endorsement & reference
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          character
        </span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-bryl-card dark:border-gray-800 dark:bg-[#121215]">
        <blockquote className="font-serif text-[17px] italic leading-relaxed text-gray-700 dark:text-gray-200">
          &ldquo;{ref.quote}&rdquo;
        </blockquote>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800/80">
          <div>
            <div className="text-[14px] font-semibold text-ink">
              {ref.name}
            </div>
            <div className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
              {ref.title} · {ref.company}
            </div>
          </div>

          <a
            href={`tel:${ref.contact}`}
            onClick={() => sound.play("tick")}
            className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-500 transition-colors hover:border-gray-400 hover:text-ink dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-600"
          >
            Contact: {ref.contact}
          </a>
        </div>
      </div>
    </section>
  );
}

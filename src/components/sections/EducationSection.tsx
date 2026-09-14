"use client";

import React from "react";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";

export function EducationSection() {
  return (
    <section id="education" className="py-14 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          06 — education & academics
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          degrees
        </span>
      </div>

      <div className="space-y-4">
        {RESUME_DATA.education.map((edu, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-[#121215] dark:hover:border-gray-700"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-ink">
                {edu.degree}
              </h3>
              <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                {edu.period}
              </span>
            </div>

            {edu.major && (
              <p className="mt-1 font-mono text-[12px] text-gray-500 dark:text-gray-400">
                {edu.major}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 font-mono text-[11.5px] text-gray-400">
              <span className="text-ink dark:text-gray-300">{edu.school}</span>
              <span>·</span>
              <span>{edu.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

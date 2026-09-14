"use client";

import React from "react";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";

export function StatsGrid() {
  return (
    <section className="grid grid-cols-2 divide-x divide-y divide-gray-200 border-t border-b border-gray-200 sm:grid-cols-4 sm:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
      {RESUME_DATA.stats.map((stat, i) => {
        const isExternal = Boolean(stat.external);
        const Component = isExternal ? "a" : "a";
        const extraProps = isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {};

        return (
          <div
            key={stat.label}
            className={`py-6 ${
              i % 2 === 0 ? "pr-5 sm:px-5 sm:pl-0" : "pl-5 sm:px-5"
            } ${i === 3 ? "sm:pr-0" : ""}`}
          >
            <Component
              href={stat.href}
              {...extraProps}
              onClick={() => sound.play("tick")}
              className="group block text-left"
            >
              <div className="flex items-center gap-1">
                <span className="font-pixel text-lg leading-none text-ink">
                  {stat.value}
                </span>
                <svg
                  className="h-3 w-3 -translate-y-0.5 text-gray-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-0.5 group-hover:text-ink dark:text-gray-700 dark:group-hover:text-ink"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5 11L11 5M11 5H6M11 5V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 transition-colors group-hover:text-ink dark:text-gray-400 dark:group-hover:text-ink">
                {stat.label}
              </div>
            </Component>
          </div>
        );
      })}
    </section>
  );
}

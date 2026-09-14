"use client";

import React, { useState, useEffect } from "react";
import { RESUME_DATA } from "@/data/resume";
import { auth } from "@/lib/auth";
import { cms, CMS_KEYS } from "@/lib/cms";
import { X } from "lucide-react";

type SkillsData = typeof RESUME_DATA.skills;

const CATEGORIES: { key: keyof SkillsData; label: string }[] = [
  { key: "frontend", label: "Frontend & Frameworks" },
  { key: "backend", label: "Backend & Database" },
  { key: "system", label: "System Development" },
  { key: "tools", label: "Tools & Workflow" },
];

export function TechStackSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [skills, setSkills] = useState<SkillsData>(RESUME_DATA.skills);
  const [addingTo, setAddingTo] = useState<keyof SkillsData | null>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    setSkills(cms.getData(CMS_KEYS.skills, RESUME_DATA.skills));

    const handleAuthChange = () => setIsAdmin(auth.isLoggedIn());
    const handleSync = () => setSkills(cms.getData(CMS_KEYS.skills, RESUME_DATA.skills));
    window.addEventListener("portfolio:auth-change", handleAuthChange);
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => {
      window.removeEventListener("portfolio:auth-change", handleAuthChange);
      window.removeEventListener("portfolio_cms_updated", handleSync);
    };
  }, []);

  const saveSkills = (updated: SkillsData) => {
    cms.setData(CMS_KEYS.skills, updated);
    setSkills(updated);
  };

  const handleAddSkill = (category: keyof SkillsData) => {
    if (!newSkill.trim()) return;
    const updated = {
      ...skills,
      [category]: [...skills[category], newSkill.trim()],
    };
    saveSkills(updated);
    setNewSkill("");
    setAddingTo(null);
  };

  const handleDeleteSkill = (category: keyof SkillsData, item: string) => {
    const updated = {
      ...skills,
      [category]: skills[category].filter((s) => s !== item),
    };
    saveSkills(updated);
  };

  return (
    <section id="stack" className="py-14 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          03 — tech stack &amp; capabilities
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          skills
        </span>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills[key].map((item) => (
                <span
                  key={item}
                  className="group/tag relative rounded-md border border-gray-200 bg-white px-2.5 py-1 font-mono text-[12px] text-gray-600 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  {item}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteSkill(key, item)}
                      className="absolute -top-1.5 -right-1.5 hidden group-hover/tag:flex w-4 h-4 items-center justify-center bg-red-500 text-white rounded-full text-[8px]"
                    >
                      <X size={8} />
                    </button>
                  )}
                </span>
              ))}

              {/* Admin: inline add input */}
              {isAdmin && addingTo === key ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSkill(key);
                      if (e.key === "Escape") setAddingTo(null);
                    }}
                    placeholder="Skill name…"
                    className="h-7 w-28 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 font-mono text-[11px] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-ink"
                  />
                  <button
                    onClick={() => handleAddSkill(key)}
                    className="h-7 px-2 rounded-md bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[10px]"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setAddingTo(null)}
                    className="h-7 px-2 rounded-md border border-gray-200 dark:border-gray-700 font-mono text-[10px] text-gray-400"
                  >
                    ✕
                  </button>
                </div>
              ) : isAdmin ? (
                <button
                  onClick={() => setAddingTo(key)}
                  className="rounded-md border border-dashed border-gray-300 dark:border-gray-700 px-2.5 py-1 font-mono text-[11px] text-gray-400 hover:border-ink dark:hover:border-white hover:text-ink dark:hover:text-white transition-colors"
                >
                  + Add
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

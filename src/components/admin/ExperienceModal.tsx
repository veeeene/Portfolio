"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ExperienceItem } from "@/data/resume";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExperienceItem) => void;
  initial?: ExperienceItem | null;
}

const EMPTY: ExperienceItem = {
  year: "",
  role: "",
  organization: "",
  type: "project",
};

export function ExperienceModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: ExperienceModalProps) {
  const [form, setForm] = useState<ExperienceItem>(EMPTY);

  useEffect(() => {
    setForm(initial ?? EMPTY);
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const set = (k: keyof ExperienceItem, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-[#111114] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
              {initial ? "Edit Experience" : "Add Experience"}
            </p>
            <h2 className="font-sans text-base font-semibold text-ink dark:text-white">
              {initial ? initial.role : "New Entry"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Role / Title">
            <input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="Full-Stack Developer"
              className={inputCls}
            />
          </Field>

          <Field label="Organization">
            <input
              value={form.organization}
              onChange={(e) => set("organization", e.target.value)}
              placeholder="TaLE-Know LMS"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year">
              <input
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2026"
                className={inputCls}
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) =>
                  set("type", e.target.value as ExperienceItem["type"])
                }
                className={`${inputCls} cursor-pointer`}
              >
                <option value="project">Project</option>
                <option value="work">Work</option>
                <option value="education">Education</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-ink dark:hover:text-white hover:border-ink dark:hover:border-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.role.trim()}
            className="flex-1 h-10 bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0c0c0f] text-ink dark:text-white text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

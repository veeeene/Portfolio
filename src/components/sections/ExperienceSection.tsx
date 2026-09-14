"use client";

import React, { useState, useEffect } from "react";
import { RESUME_DATA, type ExperienceItem } from "@/data/resume";
import { auth } from "@/lib/auth";
import { cms, CMS_KEYS } from "@/lib/cms";
import { EditButton, AddButton, DeleteButton } from "@/components/admin/AdminButtons";
import { ExperienceModal } from "@/components/admin/ExperienceModal";

export function ExperienceSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(RESUME_DATA.experiences);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    setExperiences(cms.getData(CMS_KEYS.experiences, RESUME_DATA.experiences));

    const handleAuthChange = () => setIsAdmin(auth.isLoggedIn());
    const handleSync = () => setExperiences(cms.getData(CMS_KEYS.experiences, RESUME_DATA.experiences));
    window.addEventListener("portfolio:auth-change", handleAuthChange);
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => {
      window.removeEventListener("portfolio:auth-change", handleAuthChange);
      window.removeEventListener("portfolio_cms_updated", handleSync);
    };
  }, []);

  const saveExperiences = (updated: ExperienceItem[]) => {
    cms.setData(CMS_KEYS.experiences, updated);
    setExperiences(updated);
  };

  const handleSave = (item: ExperienceItem) => {
    if (editingIndex !== null) {
      const updated = [...experiences];
      updated[editingIndex] = item;
      saveExperiences(updated);
    } else {
      saveExperiences([item, ...experiences]);
    }
    setEditingIndex(null);
  };

  const handleDelete = (idx: number) => {
    if (confirm("Delete this experience entry?")) {
      saveExperiences(experiences.filter((_, i) => i !== idx));
    }
  };

  return (
    <section id="experience" className="py-14">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          02 — experience &amp; background
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          timeline
        </span>
      </div>

      <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {experiences.map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-12 items-baseline gap-3 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-900/40"
          >
            <div className="col-span-2 font-mono text-[11px] text-gray-400 dark:text-gray-500">
              {item.year}
            </div>
            <div className="col-span-10 sm:col-span-5 text-[14px] font-medium text-ink">
              {item.role}
            </div>
            <div className="col-span-10 sm:col-span-3 text-[13px] text-gray-500 sm:text-right dark:text-gray-400">
              {item.organization}
            </div>
            {/* Admin controls */}
            {isAdmin && (
              <div className="col-span-2 flex items-center gap-1 justify-end">
                <EditButton
                  label="Edit"
                  onClick={() => {
                    setEditingItem(item);
                    setEditingIndex(idx);
                    setModalOpen(true);
                  }}
                />
                <DeleteButton onClick={() => handleDelete(idx)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Admin: Add entry */}
      {isAdmin && (
        <AddButton
          label="Add Experience"
          onClick={() => {
            setEditingItem(null);
            setEditingIndex(null);
            setModalOpen(true);
          }}
        />
      )}

      <ExperienceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingItem}
      />
    </section>
  );
}

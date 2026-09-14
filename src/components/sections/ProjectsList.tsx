"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RESUME_DATA, type Project } from "@/data/resume";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import { cms, CMS_KEYS } from "@/lib/cms";
import { EditButton, AddButton, DeleteButton } from "@/components/admin/AdminButtons";
import { ProjectModal } from "@/components/admin/ProjectModal";

export function ProjectsList() {
  const [expandedId, setExpandedId] = useState<string | null>("taleknow");
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(RESUME_DATA.projects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    setProjects(cms.getData(CMS_KEYS.projects, RESUME_DATA.projects));

    const handleAuthChange = () => {
      setIsAdmin(auth.isLoggedIn());
    };
    const handleSync = () => {
      setProjects(cms.getData(CMS_KEYS.projects, RESUME_DATA.projects));
    };
    window.addEventListener("portfolio:auth-change", handleAuthChange);
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => {
      window.removeEventListener("portfolio:auth-change", handleAuthChange);
      window.removeEventListener("portfolio_cms_updated", handleSync);
    };
  }, []);

  const saveProjects = (updated: Project[]) => {
    cms.setData(CMS_KEYS.projects, updated);
    setProjects(updated);
  };

  const handleSave = (project: Project) => {
    const exists = projects.find((p) => p.id === project.id);
    if (exists) {
      saveProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      saveProjects([...projects, project]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this project?")) {
      saveProjects(projects.filter((p) => p.id !== id));
    }
  };

  const toggleExpand = (id: string) => {
    sound.play("tick");
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="all-projects" className="py-14 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          project archive &amp; technical breakdowns
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          {projects.length} works
        </span>
      </div>

      <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id;
          return (
            <article key={project.id} className="py-5 transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-900/40">
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(project.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(project.id);
                  }
                }}
                className="flex cursor-pointer items-baseline justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[15px] font-medium text-ink transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                      {project.title}
                    </h4>
                    <span className="font-mono text-[10.5px] text-gray-400">
                      — {project.role}
                    </span>
                  </div>
                  <p className="mt-1 text-[13.5px] text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 font-mono text-[12px] text-gray-400">
                  <span>{project.period}</span>
                  <span className="text-gray-300 dark:text-gray-700">
                    {isExpanded ? "−" : "+"}
                  </span>
                </div>
              </div>

              {/* Admin controls */}
              {isAdmin && (
                <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <EditButton
                    label="Edit"
                    onClick={() => {
                      setEditingProject(project);
                      setModalOpen(true);
                    }}
                  />
                  <DeleteButton onClick={() => handleDelete(project.id)} />
                </div>
              )}

              {/* Expandable Technical Bullet Points */}
              {isExpanded && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 font-sans text-[13.5px] dark:border-gray-800 dark:bg-gray-900/60">
                  {project.image && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={360}
                        unoptimized
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="font-mono text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                    Key Contributions &amp; Architecture:
                  </div>
                  <ul className="space-y-1.5 pl-4 text-gray-600 list-disc dark:text-gray-300">
                    {project.details.map((detail, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-gray-200 bg-white px-2 py-0.5 font-mono text-[10px] text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.play("tick");
                        }}
                        className="inline-flex items-center gap-1 font-mono text-[12px] font-medium text-ink transition-opacity hover:opacity-75"
                      >
                        visit live site ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Admin: Add project */}
      {isAdmin && (
        <AddButton
          label="Add Project"
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
        />
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingProject}
      />
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RESUME_DATA, Project } from "@/data/resume";
import { sound } from "@/lib/sound";
import { cms, CMS_KEYS } from "@/lib/cms";

export function ProjectsDeck() {
  const [projects, setProjects] = useState<Project[]>(RESUME_DATA.projects);
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    setProjects(cms.getData(CMS_KEYS.projects, RESUME_DATA.projects));
    const handleSync = () => {
      setProjects(cms.getData(CMS_KEYS.projects, RESUME_DATA.projects));
    };
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => window.removeEventListener("portfolio_cms_updated", handleSync);
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  const handleCardClick = (index: number) => {
    if (index !== centerIndex) {
      sound.play("tick");
      setCenterIndex(index);
    }
  };

  const getPositionClass = (index: number) => {
    const total = featuredProjects.length;
    if (index === centerIndex) return "is-center";
    if (index === (centerIndex - 1 + total) % total) return "is-left";
    return "is-right";
  };

  return (
    <section id="projects" className="py-14">
      {/* Section Header */}
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          01 — featured projects
        </h2>
        <a
          href="#all-projects"
          onClick={() => sound.play("tick")}
          className="font-mono text-[11px] uppercase tracking-wider text-gray-500 transition-colors hover:text-ink dark:text-gray-400 dark:hover:text-ink"
        >
          all projects ({RESUME_DATA.projects.length}) ↓
        </a>
      </div>

      {/* 3D Rotating Fan / Deck */}
      <div className="deck-container">
        {featuredProjects.map((project: Project, index: number) => {
          const posClass = getPositionClass(index);
          const isCenter = posClass === "is-center";

          return (
            <article
              key={project.id}
              role="button"
              tabIndex={0}
              aria-label={`Show ${project.title}`}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              className={`deck-card ${posClass} rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#121215]`}
            >
              {/* Badges / Header */}
              <div className="flex flex-wrap items-center gap-1.5">
                {project.award && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white dark:bg-white dark:text-black font-semibold">
                    ★ {project.award}
                  </span>
                )}
                <span className="rounded-full border border-gray-200 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  {project.role.split("&")[0]}
                </span>
              </div>

              {/* Project Title & Image Thumbnail */}
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-pixel text-xs text-gray-400">
                      {project.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-pixel text-base leading-tight text-ink">
                    {project.title}
                  </h3>
                  <div className="mt-0.5 font-mono text-[11px] text-gray-400">
                    {project.period}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-[13px] leading-relaxed text-gray-600 line-clamp-2 dark:text-gray-300">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-gray-200 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && isCenter && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.play("tick");
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-ink transition-opacity hover:opacity-70 dark:text-white"
                  >
                    visit ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Helper text */}
      <div className="mt-3 text-center font-mono text-[11px] text-gray-400 dark:text-gray-500">
        click back cards to shuffle deck
      </div>
    </section>
  );
}

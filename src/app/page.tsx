"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HalftoneBackdrop } from "@/components/layout/HalftoneBackdrop";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Hero } from "@/components/sections/Hero";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { ProjectsDeck } from "@/components/sections/ProjectsDeck";
import { ProjectsList } from "@/components/sections/ProjectsList";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { CommandKModal } from "@/components/interactive/CommandKModal";
import { LoginModal } from "@/components/admin/LoginModal";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import { cms } from "@/lib/cms";

export default function Home() {
  const [isCommandKOpen, setIsCommandKOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Detect double-Ctrl (within 400ms) to open login modal
  useEffect(() => {
    let lastCtrl = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        const now = Date.now();
        if (now - lastCtrl < 400) {
          setIsLoginOpen(true);
        }
        lastCtrl = now;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync admin state and fetch latest Supabase CMS content on mount
  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    cms.syncFromSupabase();
  }, []);

  const handleLogin = useCallback(() => {
    setIsAdmin(true);
    // Notify all sections that auth state changed
    window.dispatchEvent(new Event("portfolio:auth-change"));
  }, []);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    window.dispatchEvent(new Event("portfolio:auth-change"));
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink dark:bg-[#0c0c0f] dark:text-[#f4f4f5]">
      {/* Background Halftone Grid */}
      <HalftoneBackdrop />

      {/* Navigation */}
      <Sidebar onOpenCommandK={() => setIsCommandKOpen(true)} />
      <MobileHeader onOpenCommandK={() => setIsCommandKOpen(true)} />

      {/* Main Content Area — Offset to clear the 14rem (56) sidebar */}
      <main id="top" className="relative z-10 lg:pl-56">
        <div className="mx-auto max-w-2xl px-6 pb-24">
          {/* Hero Bio Section */}
          <Hero />

          {/* Impact Stats Grid */}
          <StatsGrid />

          {/* Halftone subtle divider */}
          <div
            aria-hidden="true"
            className="halftone halftone-wide mask-fade-x my-6 h-6 w-full opacity-[0.22]"
          />

          {/* 3D Projects Showcase Deck */}
          <ProjectsDeck />

          {/* Full Projects Archive */}
          <ProjectsList />

          {/* Experience Timeline */}
          <ExperienceSection />

          {/* Categorized Tech Stack */}
          <TechStackSection />

          {/* GitHub Contributions & Activity Heatmap */}
          <GitHubActivity />

          {/* Certifications & Badges */}
          <CertificationsSection />

          {/* Education */}
          <EducationSection />

          {/* Character Reference */}
          <ReferencesSection />

          {/* Minimalist Footer */}
          <footer className="mt-16 border-t border-gray-200 pt-8 pb-12 font-mono text-[11px] text-gray-400 dark:border-gray-800 dark:text-gray-500">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                © {new Date().getFullYear()} {RESUME_DATA.name}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#top"
                  onClick={() => sound.play("tick")}
                  className="hover:text-ink dark:hover:text-white"
                >
                  back to top ↑
                </a>
                <span>·</span>
                <a
                  href={RESUME_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink dark:hover:text-white"
                >
                  github
                </a>
                <span>·</span>
                {/* Hidden admin login link */}
                <button
                  id="admin-login-trigger"
                  onClick={() => setIsLoginOpen(true)}
                  className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer hover:text-ink dark:hover:text-white"
                  title="Admin"
                >
                  ·
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* ⌘K / Alt+K Command Palette */}
      <CommandKModal
        isOpen={isCommandKOpen}
        onClose={() => setIsCommandKOpen(false)}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Admin Toolbar (only visible when logged in) */}
      {isAdmin && <AdminToolbar onLogout={handleLogout} />}
    </div>
  );
}

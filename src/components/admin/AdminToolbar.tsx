"use client";

import React from "react";
import { Shield, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";

interface AdminToolbarProps {
  onLogout: () => void;
}

export function AdminToolbar({ onLogout }: AdminToolbarProps) {
  const handleLogout = () => {
    auth.logout();
    onLogout();
  };

  return (
    <div
      id="admin-toolbar"
      className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 bg-ink dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 dark:border-black/10"
      style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
    >
      {/* Badge */}
      <div className="flex items-center gap-1.5 mr-2">
        <Shield size={12} className="text-green-400 dark:text-green-600" />
        <span className="text-[10px] uppercase tracking-widest font-mono text-white/70 dark:text-black/60">
          Admin Mode
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20 dark:bg-black/20" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Logout from admin"
        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 dark:text-black/60 hover:text-white dark:hover:text-black transition-colors px-2 py-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
      >
        <LogOut size={11} />
        Logout
      </button>
    </div>
  );
}

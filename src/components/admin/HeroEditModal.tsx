"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { cms, CMS_KEYS } from "@/lib/cms";
import { RESUME_DATA } from "@/data/resume";
import { uploadMediaToSupabase, isSupabaseConfigured } from "@/lib/supabase";

type HeroData = {
  role: string;
  pixelName: string;
  aboutLead: string;
  aboutSecondary: string;
  github: string;
  email: string;
  location: string;
};

const DEFAULT: HeroData = {
  role: RESUME_DATA.role,
  pixelName: RESUME_DATA.pixelName,
  aboutLead: RESUME_DATA.aboutLead,
  aboutSecondary: RESUME_DATA.aboutSecondary,
  github: RESUME_DATA.github,
  email: RESUME_DATA.email,
  location: RESUME_DATA.location,
};

interface HeroEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HeroData) => void;
  onImageSave: (dataUrl: string | null) => void;
  initial: HeroData;
  currentImage: string | null;
}

export function HeroEditModal({
  isOpen,
  onClose,
  onSave,
  onImageSave,
  initial,
  currentImage,
}: HeroEditModalProps) {
  const [form, setForm] = useState<HeroData>(initial);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initial);
    setImagePreview(currentImage);
  }, [initial, currentImage, isOpen]);

  if (!isOpen) return null;

  const set = (k: keyof HeroData, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (isSupabaseConfigured) {
      const publicUrl = await uploadMediaToSupabase(file, "profile");
      if (publicUrl) {
        setImagePreview(publicUrl);
        return;
      }
    }

    // Warn if image is very large (>2MB) for localStorage fallback
    if (file.size > 2 * 1024 * 1024) {
      if (!confirm(`This image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Large images are stored in localStorage which has a ~5MB limit. Continue?`)) return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    onSave(form);
    onImageSave(imagePreview); // null = revert to placeholder
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#111114] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
              Edit Hero Section
            </p>
            <h2 className="font-sans text-base font-semibold text-ink dark:text-white">
              Identity &amp; Bio
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
          {/* ── Profile Image Upload ── */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
              Profile Image
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="relative shrink-0 w-20 h-20 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-900">
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      title="Remove photo"
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                    <svg viewBox="0 0 40 40" fill="currentColor" className="w-10 h-10 opacity-40">
                      <circle cx="20" cy="14" r="7" />
                      <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragging
                    ? "border-ink dark:border-white bg-gray-50 dark:bg-white/5"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <Upload size={16} className="text-gray-400" />
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 text-center">
                  {isDragging ? "Drop here" : "Click or drag photo"}
                </p>
                <p className="font-mono text-[8px] text-gray-300 dark:text-gray-600">
                  JPG, PNG, WEBP
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {imagePreview && (
              <p className="mt-1.5 font-mono text-[9px] text-green-500">
                ✓ Custom photo set — will display on your portfolio
              </p>
            )}
          </div>

          {/* ── Text Fields ── */}
          <Field label="Role / Title (shown above name)">
            <input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="Full-Stack Developer & IT Student"
              className={inputCls}
            />
          </Field>

          <Field label="Display Name (pixel font heading)">
            <input
              value={form.pixelName}
              onChange={(e) => set("pixelName", e.target.value)}
              placeholder="Justine Veneracion"
              className={inputCls}
            />
          </Field>

          <Field label="Lead Bio Paragraph">
            <textarea
              value={form.aboutLead}
              onChange={(e) => set("aboutLead", e.target.value)}
              rows={3}
              placeholder="I'm a full-stack developer and IT student…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Secondary Bio Paragraph">
            <textarea
              value={form.aboutSecondary}
              onChange={(e) => set("aboutSecondary", e.target.value)}
              rows={3}
              placeholder="Currently focused on modern React/Next.js…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="GitHub URL">
              <input
                value={form.github}
                onChange={(e) => set("github", e.target.value)}
                placeholder="https://github.com/veeeene"
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@email.com"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Bulacan, Philippines"
              className={inputCls}
            />
          </Field>
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
            disabled={!form.pixelName.trim()}
            className="flex-1 h-10 bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            Save Hero
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0c0c0f] text-ink dark:text-white text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Hook: load/save hero data ────────────────────────────────────────────────
export function useHeroData() {
  const [data, setData] = useState<HeroData>(DEFAULT);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setData(cms.getData(CMS_KEYS.hero, DEFAULT));
    setProfileImage(cms.getRaw(CMS_KEYS.profileImage));

    const handleSync = () => {
      setData(cms.getData(CMS_KEYS.hero, DEFAULT));
      setProfileImage(cms.getRaw(CMS_KEYS.profileImage));
    };
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => window.removeEventListener("portfolio_cms_updated", handleSync);
  }, []);

  const save = (updated: HeroData) => {
    cms.setData(CMS_KEYS.hero, updated);
    setData(updated);
  };

  const saveImage = (dataUrl: string | null) => {
    if (dataUrl) {
      cms.setRaw(CMS_KEYS.profileImage, dataUrl);
    } else {
      cms.resetData(CMS_KEYS.profileImage);
    }
    setProfileImage(dataUrl);
  };

  return { data, save, profileImage, saveImage };
}

// ─── Admin Auth Hook ──────────────────────────────────────────────────────────
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    const handler = () => setIsAdmin(auth.isLoggedIn());
    window.addEventListener("portfolio:auth-change", handler);
    return () => window.removeEventListener("portfolio:auth-change", handler);
  }, []);
  return isAdmin;
}

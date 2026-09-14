"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import type { Project } from "@/data/resume";
import { uploadMediaToSupabase, isSupabaseConfigured } from "@/lib/supabase";

function compressImage(file: File, maxWidth = 960, maxHeight = 600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initial?: Project | null;
}

const EMPTY: Project = {
  id: "",
  title: "",
  role: "",
  period: "",
  description: "",
  tags: [],
  link: "",
  github: "",
  featured: false,
  award: "",
  image: "",
  details: [],
};

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: ProjectModalProps) {
  const [form, setForm] = useState<Project>(EMPTY);
  const [tagsRaw, setTagsRaw] = useState("");
  const [detailsRaw, setDetailsRaw] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      if (isSupabaseConfigured) {
        const publicUrl = await uploadMediaToSupabase(file, "projects");
        if (publicUrl) {
          set("image", publicUrl);
          return;
        }
      }

      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => set("image", e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        const compressed = await compressImage(file);
        set("image", compressed);
      }
    } catch (err) {
      console.error("Failed to process image", err);
    }
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

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setTagsRaw(initial.tags.join(", "));
      setDetailsRaw(initial.details.join("\n"));
    } else {
      setForm(EMPTY);
      setTagsRaw("");
      setDetailsRaw("");
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const project: Project = {
      ...form,
      id: form.id || form.title.toLowerCase().replace(/\s+/g, "-"),
      tags: tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      details: detailsRaw
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
    };
    onSave(project);
    onClose();
  };

  const set = (k: keyof Project, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

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
              {initial ? "Edit Project" : "Add Project"}
            </p>
            <h2 className="font-sans text-base font-semibold text-ink dark:text-white">
              {initial ? initial.title : "New Project"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="TaLE-Know: Gamified LMS"
              className={inputCls}
            />
          </Field>

          {/* Project Cover Image */}
          <Field label="Project Cover / Screenshot">
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                {/* Thumbnail Preview */}
                <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0f] shrink-0 flex items-center justify-center">
                  {form.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          set("image", "");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        title="Remove image"
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <Trash2 size={10} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                      <ImageIcon size={22} className="opacity-40" />
                      <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400 mt-1">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDragging
                      ? "border-ink dark:border-white bg-gray-50 dark:bg-white/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Upload size={14} className="text-gray-400" />
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400 text-center">
                    {isDragging ? "Drop here" : "Click or drag photo"}
                  </p>
                  <p className="font-mono text-[8px] text-gray-400 dark:text-gray-600">
                    JPG, PNG, WEBP, SVG
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

              {/* Or paste image URL / path */}
              <input
                value={form.image ?? ""}
                onChange={(e) => set("image", e.target.value)}
                placeholder="Or paste image URL (https://... or /images/projects/...)"
                className={`${inputCls} text-[11px] h-8`}
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <input
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Full-Stack Developer"
                className={inputCls}
              />
            </Field>
            <Field label="Period">
              <input
                value={form.period}
                onChange={(e) => set("period", e.target.value)}
                placeholder="September 2026"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Short Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="A brief one-liner about the project..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Tags (comma-separated)">
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="Next.js, React, Supabase"
              className={inputCls}
            />
          </Field>

          <Field label="Bullet Points (one per line)">
            <textarea
              value={detailsRaw}
              onChange={(e) => setDetailsRaw(e.target.value)}
              rows={4}
              placeholder="Managed team Git repository...&#10;Built authentication system..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Live URL">
              <input
                value={form.link ?? ""}
                onChange={(e) => set("link", e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
            <Field label="GitHub URL">
              <input
                value={form.github ?? ""}
                onChange={(e) => set("github", e.target.value)}
                placeholder="https://github.com/..."
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Award Badge">
              <input
                value={form.award ?? ""}
                onChange={(e) => set("award", e.target.value)}
                placeholder="#1 Capstone LMS"
                className={inputCls}
              />
            </Field>
            <Field label="Featured">
              <div className="flex items-center h-10 gap-2">
                <input
                  type="checkbox"
                  id="proj-featured"
                  checked={form.featured ?? false}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="w-4 h-4 accent-ink rounded"
                />
                <label
                  htmlFor="proj-featured"
                  className="font-mono text-[11px] text-gray-500"
                >
                  Show in featured deck
                </label>
              </div>
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-ink dark:hover:text-white hover:border-ink dark:hover:border-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="flex-1 h-10 bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            Save Project
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

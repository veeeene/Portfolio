"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import type { Certification } from "@/data/resume";
import { uploadMediaToSupabase, isSupabaseConfigured } from "@/lib/supabase";

function compressImage(file: File, maxWidth = 1200, maxHeight = 900, quality = 0.85): Promise<string> {
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

interface CertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: Certification) => void;
  initial?: Certification | null;
}

const EMPTY: Certification = {
  id: "",
  title: "",
  issuer: "",
  year: "",
  verified: true,
  link: "",
  image: "",
};

export function CertModal({ isOpen, onClose, onSave, initial }: CertModalProps) {
  const [form, setForm] = useState<Certification>(EMPTY);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(initial ?? EMPTY);
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const set = (k: keyof Certification, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      if (isSupabaseConfigured) {
        const publicUrl = await uploadMediaToSupabase(file, "certificates");
        if (publicUrl) {
          set("image", publicUrl);
          setUploading(false);
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
      console.error("Failed to process certificate image", err);
    } finally {
      setUploading(false);
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

  const handleSave = () => {
    onSave({
      ...form,
      id: form.id || form.title.toLowerCase().replace(/\s+/g, "-"),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#111114] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
              {initial ? "Edit Certification" : "Add Certification"}
            </p>
            <h2 className="font-sans text-base font-semibold text-ink dark:text-white">
              {initial ? initial.title : "New Certification"}
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
          {/* Certificate Image Dropzone & Preview */}
          <Field label="Certificate Image / Badge (Optional)">
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                {/* Image Preview Thumbnail */}
                <div className="relative w-28 h-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0c0c0f] overflow-hidden flex items-center justify-center shrink-0">
                  {form.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Certificate Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => set("image", "")}
                        title="Remove image"
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                      <ImageIcon size={18} />
                      <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400">
                        No image
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
                    {uploading ? "Uploading to Cloud..." : isDragging ? "Drop here" : "Click or drag cert"}
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

              {/* Or paste direct URL */}
              <input
                value={form.image ?? ""}
                onChange={(e) => set("image", e.target.value)}
                placeholder="Or paste certificate image URL (https://...)"
                className={`${inputCls} text-[11px] h-8`}
              />
            </div>
          </Field>

          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="HTML Essentials"
              className={inputCls}
            />
          </Field>

          <Field label="Issuer">
            <input
              value={form.issuer}
              onChange={(e) => set("issuer", e.target.value)}
              placeholder="Cisco Networking Academy"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year">
              <input
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2025"
                className={inputCls}
              />
            </Field>
            <Field label="Verified">
              <div className="flex items-center h-10 gap-2">
                <input
                  type="checkbox"
                  id="cert-verified"
                  checked={form.verified ?? false}
                  onChange={(e) => set("verified", e.target.checked)}
                  className="w-4 h-4 accent-ink rounded"
                />
                <label
                  htmlFor="cert-verified"
                  className="font-mono text-[11px] text-gray-500 cursor-pointer"
                >
                  Verified
                </label>
              </div>
            </Field>
          </div>

          <Field label="Verify Link (optional)">
            <input
              value={form.link ?? ""}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://..."
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
            disabled={!form.title.trim()}
            className="flex-1 h-10 bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            Save Cert
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

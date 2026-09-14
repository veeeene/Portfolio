"use client";

import React, { useState } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { HeroEditModal, useHeroData, useIsAdmin } from "@/components/admin/HeroEditModal";
import { EditButton } from "@/components/admin/AdminButtons";

export function Hero() {
  const { data, save, profileImage, saveImage } = useHeroData();
  const isAdmin = useIsAdmin();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-16">
      {/* Admin edit button — top-right of section */}
      {isAdmin && (
        <div className="absolute top-3 right-0 z-10">
          <EditButton label="Edit Hero" onClick={() => setModalOpen(true)} />
        </div>
      )}

      <div className="grid gap-9 sm:grid-cols-[16rem_1fr] sm:items-start sm:gap-10">
        {/* Profile Column */}
        <div className="reveal d1 mx-auto w-full max-w-[16rem] sm:mx-0">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-bryl-card transition-all duration-300 hover:shadow-bryl-card-hover dark:border-gray-800 dark:bg-gray-900">

            {profileImage ? (
              /* Custom uploaded photo stored as base64 */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt={data.pixelName}
                className="block h-auto w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              /* Default SVG placeholder — replace by uploading via admin Edit Hero */
              <Image
                src="/images/profile-placeholder.svg"
                alt={data.pixelName}
                width={320}
                height={320}
                priority
                className="block h-auto w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}

            {/* Admin camera overlay hint */}
            {isAdmin && (
              <button
                onClick={() => setModalOpen(true)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/0 hover:bg-black/40 transition-all duration-200 group/img opacity-0 hover:opacity-100"
                title="Change profile photo"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 drop-shadow"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white drop-shadow">
                  Change Photo
                </span>
              </button>
            )}

            {/* Subtle inner hairline border */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[5px] rounded-xl border border-gray-200/60 dark:border-gray-800/60"
            />
          </div>
        </div>

        {/* Text Column */}
        <div>
          {/* Role label */}
          <div className="reveal d2 font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {data.role}
          </div>

          {/* Pixel name heading */}
          <h1 className="reveal d2 mt-2 font-pixel text-3xl leading-none text-ink sm:text-[2.6rem]">
            {data.pixelName}
          </h1>

          {/* Lead bio */}
          <p className="reveal d3 mt-5 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
            {data.aboutLead}
          </p>

          {/* Secondary bio */}
          <p className="reveal d4 mt-4 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
            {data.aboutSecondary}
          </p>

          {/* Social and Quick Links */}
          <div className="reveal d5 mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-gray-500 dark:text-gray-400">
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.play("tick")}
              className="transition-colors hover:text-ink"
            >
              github ↗
            </a>
            <a
              href={`mailto:${data.email}`}
              onClick={() => sound.play("tick")}
              className="transition-colors hover:text-ink"
            >
              email ↗
            </a>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-gray-400 dark:text-gray-500">{data.location}</span>
          </div>
        </div>
      </div>

      {/* Hero edit modal */}
      <HeroEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={save}
        onImageSave={saveImage}
        initial={data}
        currentImage={profileImage}
      />
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Eye, X } from "lucide-react";
import { RESUME_DATA, type Certification } from "@/data/resume";
import { auth } from "@/lib/auth";
import { cms, CMS_KEYS } from "@/lib/cms";
import { EditButton, AddButton, DeleteButton } from "@/components/admin/AdminButtons";
import { CertModal } from "@/components/admin/CertModal";

export function CertificationsSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [certs, setCerts] = useState<Certification[]>(RESUME_DATA.certifications);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [activePreviewCert, setActivePreviewCert] = useState<Certification | null>(null);

  useEffect(() => {
    setIsAdmin(auth.isLoggedIn());
    setCerts(cms.getData(CMS_KEYS.certifications, RESUME_DATA.certifications));

    const handleAuthChange = () => setIsAdmin(auth.isLoggedIn());
    const handleSync = () => setCerts(cms.getData(CMS_KEYS.certifications, RESUME_DATA.certifications));
    window.addEventListener("portfolio:auth-change", handleAuthChange);
    window.addEventListener("portfolio_cms_updated", handleSync);
    return () => {
      window.removeEventListener("portfolio:auth-change", handleAuthChange);
      window.removeEventListener("portfolio_cms_updated", handleSync);
    };
  }, []);

  const saveCerts = (updated: Certification[]) => {
    cms.setData(CMS_KEYS.certifications, updated);
    setCerts(updated);
  };

  const handleSave = (cert: Certification) => {
    const exists = certs.find((c) => c.id === cert.id);
    if (exists) {
      saveCerts(certs.map((c) => (c.id === cert.id ? cert : c)));
    } else {
      saveCerts([...certs, cert]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this certification?")) {
      saveCerts(certs.filter((c) => c.id !== id));
    }
  };

  return (
    <section id="certifications" className="py-14 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          05 — certifications &amp; training
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          credentials
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="group relative flex flex-col h-full rounded-xl bg-gradient-to-b from-gray-50 to-white p-4 text-center shadow-bryl-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-bryl-card-hover dark:from-[#18181b] dark:to-[#121215] dark:border dark:border-gray-800"
          >
            {/* Inset hairline frame border */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[5px] rounded-lg border border-gray-200/70 dark:border-gray-800/80"
            />

            {/* Top Area: Image preview or Badge Frame (always consistent height) */}
            <div className="relative w-full shrink-0">
              {cert.image ? (
                <div
                  onClick={() => setActivePreviewCert(cert)}
                  className="relative w-full h-36 mb-3 rounded-lg overflow-hidden border border-gray-200/80 dark:border-gray-800 bg-gray-100 dark:bg-[#0c0c0f] cursor-pointer group/img"
                  title="Click to view full certificate"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 text-white font-mono text-[10px] uppercase tracking-wider">
                      <Eye size={12} /> View
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-36 mb-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0c0c0f]/60 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white font-mono text-xs font-bold text-ink shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:text-white">
                    {cert.issuer.includes("Cisco")
                      ? "CSC"
                      : cert.issuer.includes("Azure")
                      ? "AZ"
                      : cert.issuer.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Middle Content Area: Title & Issuer taking remaining flex space */}
            <div className="relative flex flex-1 flex-col items-center justify-start w-full">
              <h3 className="text-[13px] font-semibold leading-snug text-ink dark:text-white px-1 line-clamp-2 min-h-[2.4rem] flex items-center justify-center">
                {cert.title}
              </h3>

              <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-wider text-gray-400 dark:text-gray-400 line-clamp-3">
                {cert.issuer}
              </p>
            </div>

            {/* Bottom Pinned Area: Verified Stamp & Action Buttons (strictly aligned across all cards) */}
            <div className="relative mt-auto pt-4 w-full flex flex-col items-center shrink-0">
              {/* Verified Laurel Stamp */}
              <div className="flex items-center justify-center gap-1.5 text-gray-400 transition-colors group-hover:text-ink dark:text-gray-500 dark:group-hover:text-white mb-3">
                <svg viewBox="0 0 13 22" fill="currentColor" aria-hidden="true" className="h-[14px] w-auto shrink-0">
                  <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 5) rotate(46)" />
                  <path d="M0 -4.3C2.3 -2.8 2.3 2.8 0 4.3C-2.3 2.8 -2.3 -2.8 0 -4.3Z" transform="translate(4.6 11) rotate(14)" />
                  <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 17) rotate(-30)" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
                  {cert.year} · {cert.verified ? "Verified" : "Completed"}
                </span>
                <span className="inline-flex -scale-x-100">
                  <svg viewBox="0 0 13 22" fill="currentColor" aria-hidden="true" className="h-[14px] w-auto shrink-0">
                    <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 5) rotate(46)" />
                    <path d="M0 -4.3C2.3 -2.8 2.3 2.8 0 4.3C-2.3 2.8 -2.3 -2.8 0 -4.3Z" transform="translate(4.6 11) rotate(14)" />
                    <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 17) rotate(-30)" />
                  </svg>
                </span>
              </div>

              {/* Action Links & Admin Controls Footer */}
              <div className="w-full pt-2.5 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-center gap-3 min-h-[30px]">
                {cert.image && (
                  <button
                    type="button"
                    onClick={() => setActivePreviewCert(cert)}
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500 hover:text-ink dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <Eye size={11} />
                    <span>View Cert</span>
                  </button>
                )}

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500 hover:text-ink dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink size={11} />
                    <span>Credential</span>
                  </a>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <EditButton
                      label="Edit"
                      onClick={() => {
                        setEditingCert(cert);
                        setModalOpen(true);
                      }}
                    />
                    <DeleteButton onClick={() => handleDelete(cert.id)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin: Add certification */}
      {isAdmin && (
        <AddButton
          label="Add Certification"
          onClick={() => {
            setEditingCert(null);
            setModalOpen(true);
          }}
        />
      )}

      {/* Admin Edit Modal */}
      <CertModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingCert}
      />

      {/* Fullscreen Certificate Lightbox Modal */}
      {activePreviewCert && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setActivePreviewCert(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col gap-4 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  {activePreviewCert.issuer} · {activePreviewCert.year}
                </p>
                <h3 className="font-sans text-lg font-semibold text-ink dark:text-white">
                  {activePreviewCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewCert(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Certificate Image View */}
            {activePreviewCert.image && (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0f] flex items-center justify-center max-h-[60vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePreviewCert.image}
                  alt={activePreviewCert.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain"
                />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
              <span className="font-mono text-[11px] text-gray-400">
                {activePreviewCert.verified ? "✓ Official Verified Credential" : "Completed Training"}
              </span>
              {activePreviewCert.link && (
                <a
                  href={activePreviewCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink dark:bg-white text-white dark:text-black font-mono text-[11px] uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink size={12} />
                  Verify Credential
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

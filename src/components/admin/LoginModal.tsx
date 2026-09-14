"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleClose = useCallback(() => {
    setPassword("");
    setError("");
    setLoading(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    const success = await auth.login(password);
    if (success) {
      setPassword("");
      onLogin();
      onClose();
    } else {
      setError("Incorrect password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword("");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-sm mx-4 bg-white dark:bg-[#111114] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-8 transition-transform ${shake ? "animate-shake" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink dark:bg-white rounded-lg flex items-center justify-center">
              <Lock size={14} className="text-white dark:text-black" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                Admin Access
              </p>
              <h2 className="font-sans text-sm font-semibold text-ink dark:text-white leading-none mt-0.5">
                Portfolio CMS
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0c0c0f] text-ink dark:text-white text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-white/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full h-11 bg-ink dark:bg-white text-white dark:text-black font-semibold font-mono text-[11px] uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {loading ? "Verifying..." : "Login →"}
          </button>
        </form>

        <p className="mt-4 font-mono text-[10px] text-gray-400 text-center">
          Admin controls are only visible to you
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}

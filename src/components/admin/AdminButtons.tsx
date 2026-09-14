"use client";

import React from "react";
import { Pencil } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  label?: string;
}

export function EditButton({ onClick, label = "Edit" }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-ink dark:hover:border-white hover:text-ink dark:hover:text-white bg-white dark:bg-[#0c0c0f] transition-all hover:scale-105 active:scale-95"
    >
      <Pencil size={9} />
      {label}
    </button>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export function AddButton({ onClick, label = "Add Item" }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full mt-4 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:border-ink dark:hover:border-white hover:text-ink dark:hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all hover:bg-gray-50 dark:hover:bg-white/5"
    >
      <span className="text-base leading-none">+</span>
      {label}
    </button>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Delete"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[9px] uppercase tracking-widest text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-all hover:scale-105 active:scale-95"
    >
      ✕ Delete
    </button>
  );
}

"use client";

import React from "react";

export function HalftoneBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top right ambient halftone field with radial mask */}
      <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[70vh] w-[65vw] opacity-[0.16]" />

      {/* Bottom left subtle halftone field */}
      <div className="halftone mask-bl absolute bottom-0 left-0 h-[60vh] w-[55vw] opacity-[0.13]" />

      {/* Center ambient glow */}
      <div className="halftone mask-circle absolute left-1/2 top-1/3 h-[40vh] w-[40vw] -translate-x-1/2 opacity-[0.06]" />
    </div>
  );
}

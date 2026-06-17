"use client";

import { useRef, useEffect } from "react";
import { engine } from "@/lib/engine";

/**
 * Thin gold line that draws left→right as you scroll past it.
 * No dot, no fixed elements — just a subtle horizontal connector.
 */
export default function SectionBridge() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      const el = wrapRef.current;
      if (!el || !lineRef.current) return;
      const r  = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when element at bottom of viewport, 1 when at top
      const p  = Math.max(0, Math.min(1, 1 - r.top / vh));
      lineRef.current.style.transform = `scaleX(${p})`;
      lineRef.current.style.opacity   = p > 0 && p < 1 ? String(p * 0.6) : "0";
    });
    return unsub;
  }, []);

  return (
    <div ref={wrapRef} className="relative h-px overflow-hidden bg-white/[0.03]">
      <div
        ref={lineRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent origin-left"
        style={{ transform: "scaleX(0)", opacity: 0 }}
      />
    </div>
  );
}

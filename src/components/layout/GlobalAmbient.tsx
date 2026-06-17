"use client";

import { useEffect, useRef } from "react";
import { engine } from "@/lib/engine";

export default function GlobalAmbient() {
  const barRef  = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const bgRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    // Cache the active circuit glow colour. Reading getComputedStyle every
    // frame forces a style recalc (jank); instead we read it once and refresh
    // only when the theme actually changes via a MutationObserver.
    let glowRgb = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-glow-rgb").trim() || "212,175,55";
    const obs = new MutationObserver(() => {
      glowRgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-glow-rgb").trim() || "212,175,55";
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    let lastBgP = -1;

    const unsub = engine.subscribe(({ p }) => {
      // ① Top progress bar — the only ambient element shown on mobile
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      // Mobile stops here: line, dot, word and breathing glow are all hidden.
      if (mobile) return;

      // ② Left vertical line fills
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${p})`;
        lineRef.current.style.opacity   = p > 0.005 ? "1" : "0";
      }

      // ③ Gold dot travels down the line
      if (dotRef.current) {
        dotRef.current.style.top     = `${p * 96 + 2}%`;
        dotRef.current.style.opacity = p > 0.01 && p < 0.99 ? "0.9" : "0";
      }

      // ④ Ambient gradient breathes — only repaint on a meaningful scroll
      //    delta so we aren't recomposing a full-screen layer every frame.
      if (bgRef.current && Math.abs(p - lastBgP) > 0.004) {
        lastBgP = p;
        const x = 25 + p * 50;
        const y = 15 + p * 70;
        const intensity = 0.016 + Math.sin(p * Math.PI) * 0.024;
        bgRef.current.style.background =
          `radial-gradient(ellipse 60% 50% at ${x}% ${y}%, rgba(${glowRgb},${intensity}) 0%, transparent 70%)`;
      }
    });

    return () => { unsub(); obs.disconnect(); };
  }, []);

  return (
    <>
      {/* Top gold progress bar */}
      <div className="fixed top-0 left-0 right-0 h-px z-[80] pointer-events-none">
        <div className="absolute inset-0 bg-white/[0.04]" />
        <div ref={barRef}
          className="h-full bg-[#D4AF37] origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }} />
      </div>

      {/* Left vertical line + traveling dot */}
      <div className="fixed left-0 top-0 bottom-0 w-px z-[70] pointer-events-none hidden lg:block">
        <div className="absolute inset-0 bg-white/[0.03]" />
        <div ref={lineRef}
          className="absolute top-0 left-0 right-0 origin-top will-change-transform"
          style={{
            height: "100%",
            transform: "scaleY(0)",
            opacity: 0,
            background: "linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0.4) 60%, rgba(212,175,55,0.1))",
            transition: "opacity 0.3s",
          }} />
        <div ref={dotRef}
          className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#D4AF37]"
          style={{
            opacity: 0,
            boxShadow: "0 0 10px #D4AF37, 0 0 20px rgba(212,175,55,0.4)",
            transition: "top 0.08s linear, opacity 0.4s",
          }} />
      </div>

      {/* Breathing ambient light — hidden on mobile */}
      <div ref={bgRef}
        className="mobile-hide-ambient fixed inset-0 pointer-events-none z-0 will-change-[background]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 25% 15%, rgba(212,175,55,0.016) 0%, transparent 70%)" }} />
    </>
  );
}

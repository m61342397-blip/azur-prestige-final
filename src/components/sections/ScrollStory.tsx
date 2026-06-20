"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { engine } from "@/lib/engine";

// Couleur dorée par mot (structurel, non traduit).
const GOLD = [true, false, true, false];

export default function ScrollStory() {
  const t = useTranslations("ScrollStory");
  const words = (t.raw("words") as { w: string; sub: string }[]);

  const [sectionHeight, setSectionHeight] = useState(`${words.length * 110}vh`);
  const secRef     = useRef<HTMLDivElement>(null);
  const wordsRef   = useRef<HTMLDivElement[]>([]);
  const subsRef    = useRef<HTMLParagraphElement[]>([]);
  const dotRefs    = useRef<HTMLDivElement[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      const mult = window.innerWidth <= 768 ? 50 : 110;
      setSectionHeight(`${words.length * mult}vh`);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;

    // Subscribe to the shared scroll engine — one RAF drives the whole site,
    // so this section's timing stays in lockstep with every other section.
    const unsub = engine.subscribe(() => {
      const sec = secRef.current;
      if (!sec) return;

      const rect  = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const raw   = -rect.top;
      const p     = Math.max(0, Math.min(1, raw / total));
      const mobile = isMobile();

      const stepIdx = Math.min(words.length - 1, Math.floor(p * words.length));
      if (counterRef.current) counterRef.current.textContent = `0${stepIdx + 1}`;

      if (lineRef.current) lineRef.current.style.transform = `scaleX(${p})`;

      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        d.style.background = i <= stepIdx ? "#D4AF37" : "rgba(255,255,255,0.12)";
        d.style.transform  = mobile ? "scale(1)" : i === stepIdx ? "scale(1.5)" : "scale(1)";
      });

      const step = 1 / words.length;
      words.forEach((_, i) => {
        const wEl = wordsRef.current[i];
        const sEl = subsRef.current[i];
        if (!wEl || !sEl) return;

        if (mobile) {
          const visible = i === stepIdx;
          wEl.style.opacity   = visible ? "1" : "0";
          wEl.style.transform = "translateY(0) scale(1)";
          wEl.style.filter    = "none";
          sEl.style.opacity   = visible ? "1" : "0";
          sEl.style.transform = "translateY(0)";
          return;
        }

        const lp     = Math.max(0, Math.min(1, (p - i * step) / step));
        const enter  = Math.min(1, lp * 3.5);
        const exit   = Math.max(0, (lp - 0.66) / 0.34);
        const alpha  = Math.max(0, enter - exit * 1.5);
        const y      = (1 - enter) * 75 - exit * 55;
        const sc     = 0.88 + enter * 0.12 - exit * 0.04;
        const blur   = (1 - enter) * 8 + exit * 4;

        wEl.style.opacity   = String(alpha);
        wEl.style.transform = `translateY(${y}px) scale(${sc})`;
        wEl.style.filter    = `blur(${blur}px)`;

        sEl.style.opacity   = String(Math.max(0, alpha - 0.15));
        sEl.style.transform = `translateY(${y + 30}px)`;
      });
    });

    return unsub;
  }, []);

  return (
    <section ref={secRef} style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[#060606]">

        {/* Horizontal progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.04] overflow-hidden">
          <div ref={lineRef} className="h-full bg-[#D4AF37] origin-left" style={{ transform: "scaleX(0)" }} />
        </div>

        {/* Top-right step counter */}
        <div className="absolute top-10 right-10 lg:right-16 flex items-baseline gap-2">
          <span ref={counterRef}
            className="font-light text-[#D4AF37]"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3.5rem)", opacity: 0.5 }}>
            01
          </span>
          <span className="text-white/15 text-xs tracking-widest">/ 04</span>
        </div>

        {/* Progress dots — bottom center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {words.map((_, i) => (
            <div key={i} ref={el => { if (el) dotRefs.current[i] = el; }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.12)" }} />
          ))}
        </div>

        {/* Word layers — stacked, each absolutely positioned */}
        <div className="relative w-full text-center px-6">
          {words.map((item, i) => (
            <div key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              {/* No opacity here — the inner <h2> and <p> carry their own
                  engine-driven opacity. An opacity:0 wrapper would mask them
                  permanently since their opacity is never multiplied back up. */}
              <h2
                ref={el => { if (el) wordsRef.current[i] = el; }}
                className="font-light leading-none tracking-[-0.02em] will-change-transform"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(4.5rem,14vw,15rem)",
                  opacity: 0,
                }}
              >
                {/* Colour lives on the span: the global `h1..h5 !important`
                    rule would otherwise force these words to the (dark) circuit
                    --text-primary, making them invisible on the #060606 bg. */}
                <span style={{ color: GOLD[i] ? "#D4AF37" : "#FFFFFF" }}>{item.w}</span>
              </h2>
              <p
                ref={el => { if (el) subsRef.current[i] = el; }}
                className="mt-6 text-base lg:text-xl font-light"
                style={{ letterSpacing: "0.04em", opacity: 0, color: "#C0C0C0" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

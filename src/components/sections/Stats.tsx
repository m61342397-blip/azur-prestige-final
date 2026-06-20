"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { engine, Engine } from "@/lib/engine";

// Valeurs numériques (non traduites) ; libellés/suffixes viennent des messages.
const VALUES = [24, 3, 15000, 4.9];

export default function Stats() {
  const t = useTranslations("Stats");
  const locale = useLocale();
  const items = (t.raw("items") as { suffix: string; label: string; desc: string }[])
    .map((m, i) => ({ ...m, value: VALUES[i] }));

  const secRef   = useRef<HTMLDivElement>(null);
  const rowRef   = useRef<HTMLDivElement>(null);
  const numsRef  = useRef<HTMLSpanElement[]>([]);
  const lineRef  = useRef<HTMLDivElement>(null);
  const fired    = useRef([false,false,false,false]);

  // Refs lues dans l'effet (deps vides) : la langue est figée pour le rendu.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      const el = secRef.current;
      if (!el) return;

      const p = Engine.elVisible(el, 1.05, 0.1);
      const ep = Engine.ease(p);

      // Row emerges
      if (rowRef.current) {
        rowRef.current.style.opacity   = String(ep);
        rowRef.current.style.transform = `translateY(${(1 - ep) * 55}px)`;
      }

      // Gold accent line grows left→right
      if (lineRef.current)
        lineRef.current.style.transform = `scaleX(${p})`;

      // Per-item counters
      VALUES.forEach((value, i) => {
        const lp = Engine.band(p, i * 0.08, i * 0.08 + 0.45);
        if (lp > 0.3 && !fired.current[i]) {
          fired.current[i] = true;
          const numEl = numsRef.current[i];
          if (!numEl) return;

          const suffix = itemsRef.current[i].suffix;
          const finalText = value === 4.9
            ? value.toFixed(1) + suffix
            : Math.round(value).toLocaleString(locale) + suffix;

          // Mobile: no count-up animation — show the final value directly.
          if (window.innerWidth <= 768) {
            numEl.textContent = finalText;
            return;
          }

          import("animejs").then(({ animate }) => {
            const obj = { v: 0 };
            animate(obj, {
              v: value, duration: 1800, ease: "outExpo",
              onUpdate: () => {
                numEl.textContent = value === 4.9
                  ? obj.v.toFixed(1) + suffix
                  : Math.round(obj.v).toLocaleString(locale) + suffix;
              },
            });
          });
        }
      });
    });
    return unsub;
  }, []);

  return (
    <section ref={secRef} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-12 right-12 h-px overflow-hidden">
        <div ref={lineRef} className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-transparent origin-left"
          style={{ transform: "scaleX(0)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={rowRef} className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6" style={{ opacity: 1 }}>
          {items.map((s, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="font-light text-white leading-none tracking-tight"
                style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
                <span ref={el => { if (el) numsRef.current[i] = el; }}>0{s.suffix}</span>
              </div>
              <div className="text-[#D4AF37] text-sm uppercase font-light" style={{ letterSpacing: "0.2em" }}>{s.label}</div>
              <div className="text-[#8A8A8A] text-sm font-light leading-relaxed hidden lg:block">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

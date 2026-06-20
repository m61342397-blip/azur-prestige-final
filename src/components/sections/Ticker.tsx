"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function Ticker() {
  const t = useTranslations("Ticker");
  const words = t.raw("items") as string[];
  // Intercale un séparateur « · » entre chaque libellé.
  const items = words.flatMap((w) => [w, "·"]);
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-white/[0.06] py-4 overflow-hidden select-none relative">
      {/* Soft edge fades so the ticker dissolves into the active theme bg */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--theme-bg, #050505), transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--theme-bg, #050505), transparent)" }} />
      <div ref={trackRef} className="flex whitespace-nowrap" style={{ animation: "ticker 22s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} className={`inline-block px-4 text-[11px] tracking-[0.25em] uppercase font-light ${
            item === "·" ? "text-[#D4AF37]" : "text-[#707070]"
          }`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

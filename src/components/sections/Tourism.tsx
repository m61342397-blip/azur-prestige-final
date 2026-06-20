"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { engine, Engine } from "@/lib/engine";
import ContactChoice from "@/components/ui/ContactChoice";

// Habillage visuel par circuit (couleurs, glow, image) — non traduit.
// Les textes (name, subtitle, desc, monuments, duration, whatsapp) viennent
// des messages, fusionnés par index.
const STYLES = [
  { pageBg: "#F5E6D3", textPrimary: "#2A1505", textSecondary: "#5C3010", textMuted: "#8A5030", borderColor: "rgba(42,21,5,0.15)", accent: "#C17A3A", pageGlow: "193,122,58", glowPos: "80% 20%", image: "/images/tourisme/marseille.jpg" },
  { pageBg: "#F5E6D3", textPrimary: "#2A1505", textSecondary: "#5C3010", textMuted: "#8A5030", borderColor: "rgba(42,21,5,0.15)", accent: "#B87030", pageGlow: "184,112,48", glowPos: "20% 40%", image: "/images/tourisme/marseille-notre-dame.jpg" },
  { pageBg: "#E0F4F4", textPrimary: "#012A2A", textSecondary: "#0A4040", textMuted: "#2A6060", borderColor: "rgba(1,42,42,0.15)", accent: "#0097A7", pageGlow: "0,151,167", glowPos: "60% 30%", image: "/images/tourisme/cassis.jpg" },
  { pageBg: "#F5EDD0", textPrimary: "#2A1A00", textSecondary: "#4A3010", textMuted: "#7A5A20", borderColor: "rgba(42,26,0,0.15)", accent: "#8B6914", pageGlow: "180,140,40", glowPos: "30% 60%", image: "/images/tourisme/aix.jpg" },
  { pageBg: "#EDE0F5", textPrimary: "#1A0A2A", textSecondary: "#3A1A5A", textMuted: "#6A4A8A", borderColor: "rgba(26,10,42,0.15)", accent: "#7B1FA2", pageGlow: "123,31,162", glowPos: "70% 25%", image: "/images/tourisme/valensole.jpg" },
];

type CircuitText = { name: string; subtitle: string; desc: string; monuments: string[]; duration: string; whatsapp: string };

export default function Tourism() {
  const t = useTranslations("Tourism");
  const circuits = STYLES.map((s, i) => ({ ...s, ...(t.raw("circuits") as CircuitText[])[i] }));

  const [active, setActive] = useState(0);
  const secRef  = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Apply theme to full page
  const applyTheme = (i: number) => {
    const c = circuits[i];
    const root = document.documentElement;

    // CSS custom properties — cascade to Nav, GlobalAmbient, scrollbar
    root.style.setProperty("--theme-glow-rgb", c.pageGlow);
    root.style.setProperty("--theme-accent", c.accent);
    root.style.setProperty("--theme-bg", c.pageBg);
    root.style.setProperty("--theme-text", c.textPrimary);
    root.style.setProperty("--theme-text-muted", c.textSecondary);
    root.style.setProperty("--theme-nav-link", c.textSecondary);
    root.style.setProperty("--text-primary", c.textPrimary);
    root.style.setProperty("--text-secondary", c.textSecondary);
    root.style.setProperty("--text-muted", c.textMuted);

    const hex = c.pageBg.replace("#", "");
    root.style.setProperty(
      "--theme-bg-rgb",
      `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`
    );

    // Body + html background and text color
    document.body.style.backgroundColor = c.pageBg;
    document.body.style.color = c.textPrimary;
    root.style.background = c.pageBg;

    // Global glow overlay — layered halos for total, dramatic theme change
    const id = "azur-theme-glow";
    let el = document.getElementById(id) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.style.cssText = [
        "position:fixed",
        "inset:0",
        "pointer-events:none",
        "z-index:1",
        "transition:background 1.5s ease",
      ].join(";");
      document.body.appendChild(el);
    }
    const [gpx, gpy] = c.glowPos.split(" ").map(v => parseInt(v));
    el.style.background = [
      `radial-gradient(ellipse 90% 70% at ${c.glowPos}, rgba(${c.pageGlow},0.28) 0%, transparent 65%)`,
      `radial-gradient(ellipse 65% 50% at ${100 - gpx}% ${100 - gpy}%, rgba(${c.pageGlow},0.16) 0%, transparent 60%)`,
      `radial-gradient(ellipse 80% 30% at 50% 100%, rgba(${c.pageGlow},0.20) 0%, transparent 55%)`,
      `radial-gradient(ellipse 55% 22% at 50% 0%, rgba(${c.pageGlow},0.12) 0%, transparent 50%)`,
    ].join(",");
  };

  useEffect(() => {
    applyTheme(0);
    return () => {
      document.body.style.backgroundColor = "#050505";
      document.body.style.color = "#ffffff";
      document.documentElement.style.background = "#050505";
      const r = document.documentElement;
      r.style.setProperty("--text-primary", "#ffffff");
      r.style.setProperty("--text-secondary", "#A1A1AA");
      r.style.setProperty("--text-muted", "#707070");
      const el = document.getElementById("azur-theme-glow");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (headRef.current) {
        const p = Engine.ease(Engine.elVisible(headRef.current, 1.05, 0.5));
        headRef.current.style.opacity   = String(p);
        headRef.current.style.transform = `translateY(${(1 - p) * 40}px)`;
      }
      if (infoRef.current) {
        const p = Engine.ease(Engine.elVisible(infoRef.current, 1.0, 0.25));
        infoRef.current.style.opacity   = String(p);
        infoRef.current.style.transform = `translateX(${(1 - p) * 40}px)`;
      }
      if (tabsRef.current) {
        const p = Engine.ease(Engine.elVisible(tabsRef.current, 1.02, 0.55));
        tabsRef.current.style.opacity = String(p);
      }
    });
    return unsub;
  }, []);

  const switchDest = (i: number) => {
    applyTheme(i);

    // Simple, quick opacity fade on every circuit change (desktop & mobile) —
    // far less intrusive than the previous top-to-bottom clip-path swipe.
    const el = imgRef.current;
    if (!el) { setActive(i); return; }
    el.style.transition = "opacity 0.25s ease";
    el.style.opacity = "0";
    setTimeout(() => {
      setActive(i);
      if (imgRef.current) imgRef.current.style.opacity = "1";
    }, 180);
  };

  const d = circuits[active];

  return (
    <section id="tourisme" ref={secRef} className="py-24 lg:py-36 border-t relative z-10"
      style={{ borderColor: d.borderColor }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headRef} className="mb-14" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: d.accent }} />
            <span className="text-xs tracking-[0.35em] uppercase font-light" style={{ color: d.accent }}>
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="font-light leading-tight"
            style={{ color: d.textPrimary, fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)" }}>
            {t("titleLine1")}<br />
            <span style={{ color: d.textSecondary }}>{t("titleLine2")}</span>
          </h2>
          <p className="text-base font-light leading-relaxed mt-6 max-w-2xl"
            style={{ color: d.textMuted }}>
            {t("intro")}
          </p>
        </div>

        {/* Circuit tabs */}
        <div ref={tabsRef} className="flex gap-0 mb-14 flex-wrap border-b" style={{ opacity: 1, borderColor: d.borderColor }}>
          {circuits.map((c, i) => (
            <button key={i} onClick={() => switchDest(i)}
              className="px-5 py-3 text-sm font-light tracking-[0.1em] uppercase transition-all duration-500 relative"
              style={{ color: active === i ? d.textPrimary : d.textMuted }}>
              {c.name}
              {active === i && (
                <div className="absolute bottom-0 left-0 right-0 h-px transition-colors duration-500"
                  style={{ background: d.accent }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden relative"
            style={{ background: `rgba(${d.pageGlow},0.08)`, border: `1px solid rgba(${d.pageGlow},0.2)` }}>
            <div ref={imgRef} className="w-full h-full" style={{ clipPath: "inset(0 0 0% 0)" }}>
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 pointer-events-none transition-colors duration-1000"
              style={{ background: `linear-gradient(to top, rgba(${d.pageGlow},0.30) 0%, transparent 50%)` }} />
          </div>

          {/* Info */}
          <div ref={infoRef} style={{ opacity: 1 }}>
            <div className="text-xs uppercase tracking-[0.3em] font-light mb-2"
              style={{ color: d.accent }}>
              {d.subtitle}
            </div>
            <h3 className="font-light mb-5"
              style={{ color: d.textPrimary, fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,3vw,3rem)" }}>
              {d.name}
            </h3>
            <p className="font-light leading-relaxed mb-8"
              style={{ color: d.textMuted, fontSize: "clamp(1rem,1.2vw,1.1rem)" }}>
              {d.desc}
            </p>

            {/* Monuments */}
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: d.textMuted }}>{t("programLabel")}</p>
              <div className="space-y-2">
                {d.monuments.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 font-light"
                    style={{ color: d.textSecondary, fontSize: "clamp(0.85rem,1vw,0.95rem)" }}>
                    <div className="w-px h-4 mt-0.5 flex-shrink-0 transition-colors duration-700"
                      style={{ background: d.accent }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Durée */}
            <div className="flex items-center gap-3 mb-6">
              <Clock size={14} style={{ color: d.accent }} />
              <span className="font-light" style={{ color: d.textSecondary, fontSize: "clamp(0.9rem,1.1vw,1rem)" }}>
                {d.duration}
              </span>
            </div>

            {/* Tarif sur devis */}
            <div className="p-5 mb-8 transition-colors duration-700"
              style={{ border: `1px solid rgba(${d.pageGlow},0.22)`, background: `rgba(${d.pageGlow},0.07)` }}>
              <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: d.textMuted }}>{t("tarifLabel")}</p>
              <p className="font-light text-base" style={{ color: d.textSecondary }}>
                {t("tarifText")}
              </p>
              <p className="text-[10px] pt-2 font-light" style={{ color: d.textMuted }}>
                {t("tarifNote")}
              </p>
            </div>

            {/* Bouton WhatsApp — choix entre les deux chauffeurs au clic */}
            <ContactChoice
              mode="whatsapp"
              align="left"
              waText={d.whatsapp}
              wrapperClassName="relative inline-block"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-[0.1em] uppercase transition-all duration-500"
              style={{ background: d.accent, color: "#ffffff" }}
              trigger={<>
                <MessageCircle size={14} />
                {t("cta")}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </>}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

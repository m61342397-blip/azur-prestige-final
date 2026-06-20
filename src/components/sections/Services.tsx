"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plane, Train, Briefcase, Camera, Star, Navigation, HeartPulse, ShieldCheck, type LucideIcon } from "lucide-react";
import { engine, Engine } from "@/lib/engine";

// Icônes (non traduites), dans l'ordre des libellés du fichier de messages.
const ICONS: LucideIcon[] = [Camera, Plane, Train, HeartPulse, Briefcase, Star, Navigation];

export default function Services() {
  const t = useTranslations("Services");
  const services = (t.raw("items") as { subtitle: string; desc: string; tag: string }[])
    .map((m, i) => ({ ...m, icon: ICONS[i] }));

  const secRef    = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const divRef    = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      // Header
      if (headRef.current) {
        const p  = Engine.elVisible(headRef.current, 1.05, 0.5);
        const ep = Engine.ease(p);
        headRef.current.style.opacity   = String(ep);
        headRef.current.style.transform = `translateY(${(1 - ep) * 45}px)`;
      }

      // Accent divider
      if (divRef.current) {
        const p = Engine.elVisible(divRef.current, 1.0, 0.75);
        divRef.current.style.transform = `scaleX(${p})`;
      }

      // Cards — staggered by column so rows arrive in waves
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const col  = i % 3;
        const base = Engine.elVisible(card, 1.1, 0.35);
        // Each column slightly delayed
        const p  = Engine.clamp(base - col * 0.06);
        const ep = Engine.ease(p);
        card.style.opacity   = String(ep);
        card.style.transform = `translateY(${(1 - ep) * 52}px)`;
      });
    });
    return unsub;
  }, []);

  return (
    <section id="services" ref={secRef} className="py-24 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div ref={headRef} className="mb-16 lg:mb-20" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">{t("eyebrow")}</span>
          </div>
          <h2 className="font-light leading-tight text-white" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)" }}>
            {t("titleLine1")}<br /><span className="text-[#A1A1AA]">{t("titleLine2")}</span>
          </h2>
          <div className="mt-8 inline-flex items-start gap-3 border border-[#D4AF37]/30 px-4 py-3 bg-[#D4AF37]/[0.04]">
            <ShieldCheck size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-[#A1A1AA] text-sm font-light leading-relaxed">
              <span className="text-white">{t("licenceStrong")}</span>{t("licenceText")}
            </p>
          </div>
        </div>

        <div className="mb-10 h-px overflow-hidden bg-white/[0.04]">
          <div ref={divRef} className="h-full bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37]/20 to-transparent origin-left"
            style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/[0.04]">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className={`group bg-transparent p-8 lg:p-10 flex flex-col gap-6 hover:bg-white/[0.02] transition-colors duration-500 relative ${
                  i === services.length - 1 && services.length % 2 !== 0 ? 'md:col-span-2' : ''
                }`}
              >
                {s.tag && (
                  <div className="absolute top-6 right-6 text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase border border-[#D4AF37]/25 px-2 py-1">
                    {s.tag}
                  </div>
                )}
                <div className="w-9 h-9 flex items-center justify-center border border-white/[0.08] group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                  <Icon size={16} className="text-[#D4AF37]" />
                </div>
                  <p className="text-[#D4AF37] text-[10px] uppercase font-light" style={{ letterSpacing: "0.25em" }}>{s.subtitle}</p>
                <p className="text-[#8A8A8A] text-base font-light leading-relaxed flex-1">{s.desc}</p>
                {/* Hover underline */}
                <div className="h-px bg-white/[0.04] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

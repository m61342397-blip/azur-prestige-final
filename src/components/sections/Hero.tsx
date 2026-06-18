"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { engine } from "@/lib/engine";

export default function Hero() {
  const bgRef      = useRef<HTMLDivElement>(null);  // parallax image
  const overlayRef = useRef<HTMLDivElement>(null);  // darkens on scroll
  const headRef    = useRef<HTMLDivElement>(null);  // title block lifts
  const ctaRef     = useRef<HTMLDivElement>(null);  // cta lifts
  const barRef     = useRef<HTMLDivElement>(null);  // bottom bar lifts
  const lineRef    = useRef<HTMLDivElement>(null);  // gold vertical line
  const w1Ref      = useRef<HTMLSpanElement>(null);
  const w2Ref      = useRef<HTMLSpanElement>(null);
  const eyeRef     = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const imgWrap    = useRef<HTMLDivElement>(null);

  // ── Cinematic entrance ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { animate } = await import("animejs");
      animate(imgWrap.current!,  { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], duration: 900, ease: "cubicBezier(0.77,0,0.175,1)" });
      animate(lineRef.current!,  { scaleY: [0, 1], duration: 550, delay: 250, ease: "cubicBezier(0.77,0,0.175,1)" });
      animate(eyeRef.current!,   { opacity: [0, 1], translateY: [16, 0], duration: 380, delay: 380, ease: "outExpo" });
      animate(w1Ref.current!,    { translateY: ["108%", "0%"], duration: 600, delay: 480, ease: "cubicBezier(0.77,0,0.175,1)" });
      animate(w2Ref.current!,    { translateY: ["108%", "0%"], duration: 600, delay: 560, ease: "cubicBezier(0.77,0,0.175,1)" });
      animate(subRef.current!,   { opacity: [0, 1], translateY: [20, 0], duration: 420, delay: 680, ease: "outExpo" });
      animate(ctaRef.current!,   { opacity: [0, 1], translateY: [16, 0], duration: 380, delay: 780, ease: "outExpo" });
      animate(barRef.current!,   { opacity: [0, 1], duration: 320, delay: 950, ease: "outExpo" });
    })();
  }, []);

  // ── Scroll-driven: every pixel moves something ──────────────────
  useEffect(() => {
    const unsub = engine.subscribe(({ y, p: globalP }) => {
      const vh = window.innerHeight;
      // Hero-local progress: 0 at top → 1 when hero fully scrolled past
      const lp = Math.min(1, y / (vh * 1.1));

      // Image parallax — slides up 30% of its scroll depth
      if (bgRef.current)
        bgRef.current.style.transform = `translateY(${lp * 28}%)`;

      // Overlay darkens
      if (overlayRef.current)
        overlayRef.current.style.opacity = String(0.52 + lp * 0.38);

      // Title rises and fades
      if (headRef.current) {
        headRef.current.style.transform = `translateY(${-lp * 90}px)`;
        headRef.current.style.opacity   = String(Math.max(0, 1 - lp * 1.6));
      }

      // CTA fades out faster
      if (ctaRef.current) {
        ctaRef.current.style.transform = `translateY(${-lp * 60}px)`;
        ctaRef.current.style.opacity   = String(Math.max(0, 1 - lp * 2.2));
      }

      // Bottom bar lifts
      if (barRef.current) {
        barRef.current.style.transform = `translateY(${-lp * 40}px)`;
        barRef.current.style.opacity   = String(Math.max(0, 1 - lp * 2.5));
      }

      // Gold line opacity breathes slightly with global progress
      if (lineRef.current)
        lineRef.current.style.opacity = String(Math.max(0, 1 - lp * 2));
    });
    return unsub;
  }, []);

  return (
    <section className="relative h-[110vh] flex flex-col justify-center overflow-hidden">
      {/* BG image — lives in oversized wrapper for parallax headroom */}
      <div ref={imgWrap} className="absolute inset-0" style={{ clipPath: "inset(0 0 100% 0)" }}>
        <div ref={bgRef}
          className="responsive-bg absolute inset-[-30%] bg-cover bg-center will-change-transform"
          style={{
            "--bg-desktop": "url('/images/tourisme/marseille-vieux-port-hero.jpg')",
            "--bg-mobile":  "url('/images/tourisme/marseille-vieux-port-hero.jpg')",
          } as React.CSSProperties} />
      </div>

      {/* Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-transparent will-change-[opacity]" style={{ opacity: 0.52 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/25" />

      {/* Gold vertical accent line */}
      <div className="absolute left-[9vw] top-0 bottom-0 hidden lg:block">
        <div ref={lineRef} className="w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent origin-top will-change-transform"
          style={{ transform: "scaleY(0)" }} />
      </div>

      {/* ── Main content ── */}
      <div ref={headRef} className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-20 w-full will-change-transform"
        style={{ textShadow: "0 2px 28px rgba(0,0,0,0.55)" }}>
        <div ref={eyeRef} className="flex items-center gap-3 mb-8" style={{ opacity: 0 }}>
          <div className="w-5 h-px bg-[#D4AF37]" />
          <span className="text-[10px] tracking-[0.45em] uppercase font-light" style={{ color: "#D4AF37" }}>Tourisme Accompagné · Marseille</span>
        </div>

        <h1 className="font-light leading-[0.85] tracking-[-0.02em] mb-10"
          style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(4rem,11vw,11rem)" }}>
          <div className="overflow-hidden mb-1">
            <span ref={w1Ref} className="block" style={{ transform: "translateY(108%)", color: "#ffffff" }}>Marseille.</span>
          </div>
          <div className="overflow-hidden">
            <span ref={w2Ref} className="block text-[#D4AF37]" style={{ transform: "translateY(108%)", color: "#D4AF37" }}>Sans attente.</span>
          </div>
        </h1>

        <p ref={subRef} className="text-lg lg:text-xl font-light leading-relaxed max-w-lg mb-12" style={{ opacity: 0, color: "#C8C8C8" }}>
          Votre chauffeur reste à vos côtés toute la journée.<br />
          Marseille, Provence, Calanques — découverte complète,<br />
          de A à Z, à votre rythme.
        </p>

        <div ref={ctaRef} className="flex items-center gap-4 flex-wrap" style={{ opacity: 0 }}>
          <a href="tel:+33666323817"
            className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-4 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300">
            Réserver maintenant <ArrowRight size={14} />
          </a>
          <a href="#services"
            className="border border-white/30 px-8 py-4 text-sm font-light tracking-[0.1em] uppercase hover:border-[#D4AF37] hover:bg-white/10 transition-all duration-300"
            style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            Découvrir
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div ref={barRef} className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.08] bg-black/55 backdrop-blur-md" style={{ opacity: 0, textShadow: "0 1px 12px rgba(0,0,0,0.85)" }}>
        <div className="max-w-[1400px] mx-auto px-8 lg:px-20 flex items-center divide-x divide-white/[0.06]">
          {["Tourisme Privé · ~ 6 à 8h", "Aéroport Marseille-Provence", "Gare Saint-Charles", "Conventionné & agréé par l'État"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-6 py-4 first:pl-0">
              <MapPin size={12} className="text-[#D4AF37] shrink-0" />
              <span className="text-[11px] tracking-wide font-light whitespace-nowrap" style={{ color: "#B8B8B8" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

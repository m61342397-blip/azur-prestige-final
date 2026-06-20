"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Phone } from "lucide-react";
import { engine, Engine } from "@/lib/engine";
import ContactChoice from "@/components/ui/ContactChoice";
import { Link } from "@/i18n/navigation";

export default function ReservationCTA() {
  const t = useTranslations("ReservationCTA");
  const secRef   = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const tagsRef  = useRef<HTMLDivElement>(null);
  const bgRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      const el = secRef.current;
      if (!el) return;

      if (bgRef.current) {
        const p = Engine.elVisible(el, 1.1, -0.1);
        bgRef.current.style.transform = `translateY(${(0.5 - p) * 18}%)`;
      }
      if (titleRef.current) {
        const p = Engine.ease(Engine.elVisible(titleRef.current, 1.0, 0.3));
        titleRef.current.style.opacity   = String(p);
        titleRef.current.style.transform = `translateY(${(1 - p) * 50}px)`;
      }
      if (ctaRef.current) {
        const p = Engine.ease(Engine.elVisible(ctaRef.current, 0.95, 0.25));
        ctaRef.current.style.opacity   = String(p);
        ctaRef.current.style.transform = `translateY(${(1 - p) * 30}px)`;
      }
      if (tagsRef.current) {
        const p = Engine.ease(Engine.elVisible(tagsRef.current, 0.9, 0.2));
        tagsRef.current.style.opacity = String(p);
      }
    });
    return unsub;
  }, []);

  const tags = t.raw("tags") as string[];

  return (
    <section id="reservation" ref={secRef} className="relative py-32 lg:py-48 overflow-hidden border-t border-white/[0.04]">
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="responsive-bg absolute inset-[-20%] bg-cover bg-center will-change-transform"
          style={{
            "--bg-desktop": "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format')",
            "--bg-mobile":  "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format')",
            opacity: 0.08,
          } as React.CSSProperties} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]/60" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <h2 ref={titleRef}
          className="font-light leading-tight mb-12"
          style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,7vw,8rem)", opacity: 0, color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>{t("titleLine1")}</span><br />
          <span style={{ color: "#D4AF37" }}>{t("titleLine2")}</span>
        </h2>

        <div ref={ctaRef} className="flex items-center justify-center gap-4 flex-wrap mb-12" style={{ opacity: 1 }}>
          {/* Primary: online reservation form */}
          <Link href="/reservation"
            className="group flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-10 py-5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-white transition-colors duration-300">
            {t("bookOnline")}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <ContactChoice
            mode="call"
            align="center"
            className="flex items-center gap-3 px-10 py-5 text-sm font-light tracking-[0.12em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
            style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}
            trigger={<><Phone size={14} /> {t("call")}</>}
          />
          <ContactChoice
            mode="whatsapp"
            align="center"
            className="px-10 py-5 text-sm font-light tracking-[0.12em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
            style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}
            trigger={<>{t("whatsapp")}</>}
          />
        </div>

        <div ref={tagsRef} className="flex items-center justify-center gap-6 flex-wrap" style={{ opacity: 1 }}>
          {tags.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: "#ffffff" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

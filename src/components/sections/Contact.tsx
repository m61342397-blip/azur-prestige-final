"use client";

import { useRef, useEffect } from "react";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { engine, Engine } from "@/lib/engine";
import ContactChoice from "@/components/ui/ContactChoice";

// Numéros (jamais traduits).
const PHONES = ["+33 6 66 32 38 17", "+33 6 22 84 52 40"];

export default function Contact() {
  const t = useTranslations("Contact");
  const channels = [
    { icon: Phone,         label: t("labelPhone"),    values: PHONES,                       sub: t("subPhone") },
    { icon: MessageCircle, label: t("labelWhatsapp"), values: PHONES,                       sub: t("subWhatsapp") },
    { icon: Mail,          label: t("labelEmail"),    values: ["contact@azurprestige.eu"],  sub: t("subEmail") },
    { icon: Clock,         label: t("labelHours"),    values: [t("hoursValue")],            sub: t("subHours") },
  ];

  const secRef    = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<HTMLDivElement[]>([]);
  const formRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (headRef.current) {
        const p = Engine.ease(Engine.elVisible(headRef.current, 1.05, 0.5));
        headRef.current.style.opacity   = String(p);
        headRef.current.style.transform = `translateY(${(1 - p) * 40}px)`;
      }
      cardsRef.current.forEach((c, i) => {
        if (!c) return;
        const p = Engine.ease(Engine.clamp(Engine.elVisible(c, 1.05, 0.35) - i * 0.04));
        c.style.opacity   = String(p);
        c.style.transform = `translateY(${(1 - p) * 35}px)`;
      });
      if (formRef.current) {
        const p = Engine.ease(Engine.elVisible(formRef.current, 1.0, 0.2));
        formRef.current.style.opacity   = String(p);
        formRef.current.style.transform = `translateX(${(1 - p) * 40}px)`;
      }
    });
    return unsub;
  }, []);

  const input = "w-full bg-transparent border border-white/[0.07] text-white placeholder-[#707070] px-4 py-3 text-sm font-light focus:outline-none focus:border-[#D4AF37]/40 transition-colors duration-300";

  return (
    <section id="contact" ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={headRef} className="mb-16" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4AF37]" /><span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">{t("eyebrow")}</span></div>
          <h2 className="font-light leading-tight" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,5rem)", color: "var(--text-primary)" }}>
            {t("titleLine1")}<br /><span style={{ color: "var(--text-secondary)" }}>{t("titleLine2")}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Channels */}
          <div className="grid grid-cols-2 gap-4">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <div key={i} ref={el => { if (el) cardsRef.current[i] = el; }}
                  className="contact-card p-6 flex flex-col gap-4"
                  style={{ opacity: 1 }}>
                  <div className="w-9 h-9 flex items-center justify-center"
                    style={{ border: "1px solid rgba(var(--theme-glow-rgb),0.35)", background: "rgba(var(--theme-glow-rgb),0.08)" }}>
                    <Icon size={15} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.25em] uppercase font-light mb-1" style={{ color: "var(--text-secondary)" }}>{ch.label}</div>
                    {ch.values.map((v) => (
                      <div key={v} className="text-sm font-light" style={{ color: "var(--text-primary)" }}>{v}</div>
                    ))}
                    <div className="text-[11px] font-light mt-1" style={{ color: "var(--text-secondary)" }}>{ch.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form — framed as a card matching the info blocks (theme-accent
              border + faint tint), adapts across all 5 circuit themes. */}
          <div ref={formRef} className="p-6 lg:p-8"
            style={{
              opacity: 1,
              border: "1px solid rgba(var(--theme-glow-rgb),0.28)",
              background: "rgba(var(--theme-glow-rgb),0.06)",
            }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className={input} placeholder={t("firstName")} />
                <input className={input} placeholder={t("lastName")} />
              </div>
              <input className={input} placeholder={t("phone")} type="tel" />
              <input className={input} placeholder={t("email")} type="email" />
              <input className={input} placeholder={t("trip")} />
              <textarea className={input + " resize-none"} rows={4} placeholder={t("message")} />
              <ContactChoice
                mode="call"
                align="center"
                wrapperClassName="relative w-full"
                className="flex items-center justify-center gap-3 w-full bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300"
                trigger={<>{t("send")}</>}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

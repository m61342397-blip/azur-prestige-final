"use client";

import { useRef, useEffect } from "react";
import { engine, Engine } from "@/lib/engine";

// Real client photos (taken on tour) for the destinations we have them for —
// labelled neutrally, without the exact pickup location. Remaining slots keep
// temporary Provence landscapes for destinations without a client photo yet.
const slots = [
  { label: "Prise en charge croisière",  src: "/images/clients/client-groupe-1.jpg",       aspect: "aspect-[4/3]", pos: "center 20%" },
  { label: "Valensole · Lavande",    src: "/images/tourisme/valensole.jpg",            aspect: "aspect-[3/4]" },
  { label: "Vue panoramique Marseille",  src: "/images/clients/client-groupe-3.jpg",       aspect: "aspect-[4/3]" },
  { label: "Excursion en famille",       src: "/images/clients/client-groupe-2.jpg",       aspect: "aspect-[3/4]" },
  { label: "Notre-Dame de la Garde", src: "/images/tourisme/marseille-notre-dame.jpg", aspect: "aspect-[4/3]" },
  { label: "Calanques · Panorama",   src: "/images/tourisme/calanques.jpg",            aspect: "aspect-[4/3]" },
];

export default function ClientPhotos() {
  const headRef  = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (headRef.current) {
        const p = Engine.ease(Engine.elVisible(headRef.current, 1.05, 0.5));
        headRef.current.style.opacity   = String(p);
        headRef.current.style.transform = `translateY(${(1 - p) * 40}px)`;
      }
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const col = i % 3;
        const p   = Engine.ease(Engine.clamp(Engine.elVisible(card, 1.1, 0.3) - col * 0.05));
        card.style.opacity   = String(p);
        card.style.transform = `translateY(${(1 - p) * 45}px)`;
      });
    });
    return unsub;
  }, []);

  return (
    <section className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div ref={headRef} className="mb-16" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Photos clients</span>
          </div>
          <h2 className="font-light leading-tight text-white"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)" }}>
            Ils ont vécu<br /><span className="text-[#A1A1AA]">l'expérience.</span>
          </h2>
          <p className="text-[#8A8A8A] text-base font-light leading-relaxed mt-6 max-w-xl">
            Photos à venir — nos clients partagent leurs souvenirs de Provence.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.04]">
          {slots.map((slot, i) => (
            <div
              key={i}
              ref={el => { if (el) cardsRef.current[i] = el; }}
              className={`${slot.aspect} bg-transparent relative group overflow-hidden`}
              style={{ opacity: 1 }}>

              {/* Landscape photo */}
              <img
                src={slot.src}
                alt={slot.label}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: (slot as { pos?: string }).pos ?? "center" }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Bottom gradient for label legibility */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

              {/* Hover border accent */}
              <div className="absolute inset-0 pointer-events-none border border-white/[0.06] group-hover:border-[#D4AF37]/30 transition-colors duration-500" />

              {/* Caption — forced white (the global `color: inherit` rule would
                  otherwise tint it to the dark theme colour on the dark band). */}
              <span className="absolute bottom-3 left-4 right-4 text-[10px] tracking-[0.25em] uppercase font-light"
                style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {slot.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { engine, Engine } from "@/lib/engine";

const testimonials = [
  { quote: "Circuit privé aux Calanques avec notre famille. Le chauffeur connaissait chaque détail de la région et est resté avec nous toute la journée. Une expérience mémorable.", name: "Alexandra M.", role: "Directrice commerciale, Paris", rating: 5 },
  { quote: "Journée accompagnée à Marseille : Vieux-Port, MuCEM, Bonne Mère… Notre chauffeur nous a guidés, attendu pendant le déjeuner et raconté l'histoire de chaque lieu. Parfait.", name: "James & Sarah T.", role: "Touristes, Londres", rating: 5 },
  { quote: "Escapade à Cassis et Aix avec un chauffeur discret et attentionné. Pas de stress, pas de limite de temps — exactement ce qu'on cherchait pour découvrir la Provence.", name: "Laurent V.", role: "CEO, Groupe immobilier Marseille", rating: 5 },
];

export default function Testimonials() {
  const secRef   = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
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
        const base = Engine.elVisible(card, 1.1, 0.3);
        const p    = Engine.ease(Engine.clamp(base - col * 0.05));
        card.style.opacity   = String(p);
        card.style.transform = `translateY(${(1 - p) * 45}px)`;
      });
    });
    return unsub;
  }, []);

  return (
    <section ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={headRef} className="mb-16" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4AF37]" /><span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Avis clients</span></div>
          <h2 className="font-light leading-tight text-white" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)" }}>
            Ils nous font<br /><span className="text-[#A1A1AA]">confiance.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
          {testimonials.map((t, i) => (
            <div key={i} ref={el => { if (el) cardsRef.current[i] = el; }}
              className="bg-transparent p-8 flex flex-col gap-6 hover:bg-white/[0.015] transition-colors duration-500"
              style={{ opacity: 1 }}>
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                ))}
              </div>
              <p className="text-[#8A8A8A] text-base font-light leading-relaxed flex-1 italic">"{t.quote}"</p>
              <div>
                <div className="text-white text-sm font-light">{t.name}</div>
                <div className="text-[#A1A1AA] text-[11px] font-light tracking-wide mt-1">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

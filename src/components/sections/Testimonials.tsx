"use client";

import { useRef, useEffect, useState } from "react";
import { engine, Engine } from "@/lib/engine";

type Avis = { id: string; nom: string; note: number; commentaire: string };

export default function Testimonials() {
  const secRef   = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const [avis, setAvis] = useState<Avis[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/avis")
      .then((r) => r.json())
      .then((j) => setAvis(Array.isArray(j.avis) ? j.avis : []))
      .catch(() => setAvis([]))
      .finally(() => setLoaded(true));
  }, []);

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
  }, [avis]);

  return (
    <section ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={headRef} className="mb-16" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4AF37]" /><span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Avis clients</span></div>
          <h2 className="font-light leading-tight text-white" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)" }}>
            Ils nous font<br /><span className="text-[#A1A1AA]">confiance.</span>
          </h2>
        </div>

        {loaded && avis.length === 0 ? (
          <div className="border border-white/[0.06] py-16 px-8 text-center">
            <p className="text-[#8A8A8A] text-base font-light leading-relaxed mb-6">
              Aucun avis pour le moment.<br />Soyez le premier à partager votre expérience.
            </p>
            <a href="/laisser-un-avis"
              className="inline-block bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300">
              Laisser un avis
            </a>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
              {avis.map((t, i) => (
                <div key={t.id} ref={el => { if (el) cardsRef.current[i] = el; }}
                  className="bg-transparent p-8 flex flex-col gap-6 hover:bg-white/[0.015] transition-colors duration-500"
                  style={{ opacity: 1 }}>
                  <div className="flex gap-1">
                    {[...Array(t.note)].map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-[#8A8A8A] text-base font-light leading-relaxed flex-1 italic">&ldquo;{t.commentaire}&rdquo;</p>
                  <div>
                    <div className="text-white text-sm font-light">{t.nom}</div>
                    <div className="text-[#A1A1AA] text-[11px] font-light tracking-wide mt-1">Client vérifié</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lien discret vers le formulaire d'avis */}
            <div className="mt-12 text-center">
              <a href="/laisser-un-avis"
                className="inline-block text-[#707070] text-xs font-light uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors duration-300 border-b border-white/[0.08] hover:border-[#D4AF37] pb-1">
                Laisser un avis
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

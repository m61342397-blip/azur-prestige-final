"use client";

import { useRef, useState, useEffect } from "react";
import { MapPin, ArrowRight, Phone } from "lucide-react";
import { engine, Engine } from "@/lib/engine";

const popularRoutes = [
  { from: "Aéroport MP",        to: "Centre Marseille",  time: "~ 35 min" },
  { from: "Gare Saint-Charles", to: "Vieux-Port",         time: "~ 10 min" },
  { from: "Marseille",          to: "Aix-en-Provence",   time: "~ 40 min" },
  { from: "Marseille",          to: "Cassis",             time: "~ 30 min" },
  { from: "Marseille",          to: "Nice",               time: "~ 2h30"   },
  { from: "Aéroport MP",        to: "Cassis",             time: "~ 50 min" },
];

export default function Calculator() {
  const secRef   = useRef<HTMLDivElement>(null);
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("");
  const [to,   setTo]   = useState("");
  const [vehicle, setVehicle] = useState("berline");

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (leftRef.current) {
        const p  = Engine.elVisible(leftRef.current, 1.05, 0.3);
        const ep = Engine.ease(p);
        leftRef.current.style.opacity   = String(ep);
        leftRef.current.style.transform = `translateY(${(1 - ep) * 45}px)`;
      }
      if (rightRef.current) {
        const p  = Engine.elVisible(rightRef.current, 1.0, 0.2);
        const ep = Engine.ease(p);
        rightRef.current.style.opacity   = String(ep);
        rightRef.current.style.transform = `translateX(${(1 - ep) * 45}px)`;
      }
    });
    return unsub;
  }, []);

  const input = "w-full bg-transparent border border-white/[0.08] text-[color:var(--text-primary)] placeholder-[#A1A1AA] px-4 py-3 text-base font-light focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300";

  return (
    <section id="calculateur" ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">

          {/* Left */}
          <div ref={leftRef} style={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Estimez votre trajet</span>
            </div>
            <h2 className="font-light leading-tight mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,4.5vw,5rem)", color: "var(--text-primary)" }}>
              Votre trajet,<br /><span style={{ color: "var(--text-secondary)" }}>sur devis.</span>
            </h2>
            <p className="font-light leading-relaxed mb-12 text-base" style={{ color: "var(--text-secondary)" }}>
              Décrivez votre projet — circuit touristique, transfert ou mise à disposition.
              Nous vous répondons avec un devis personnalisé, sans engagement.
            </p>

            {/* Form */}
            <div className="space-y-4 mb-8">
              <div className="relative">
                <MapPin size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input className={input + " pl-10"} placeholder="Départ — adresse ou lieu"
                  value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50" />
                <input className={input + " pl-10"} placeholder="Destination"
                  value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <select className={input + " cursor-pointer"} value={vehicle} onChange={e => setVehicle(e.target.value)}
                style={{ background: "transparent" }}>
                <option value="berline">Berline — 1 à 4 passagers</option>
                <option value="van">Van — 1 à 6 passagers</option>
                <option value="grandvan">Grand Van — 1 à 8 passagers</option>
              </select>
            </div>

            <div className="flex gap-3">
              <a href="tel:+33666323817"
                className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300">
                <Phone size={14} /> Obtenir un devis
              </a>
              <a href="https://wa.me/33666323817" target="_blank" rel="noopener noreferrer"
                className="border border-white/[0.08] text-[#8A8A8A] px-6 py-4 text-sm font-light hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right — popular routes */}
          <div ref={rightRef} style={{ opacity: 1 }}>
            <div className="text-[#707070] text-[10px] tracking-[0.35em] uppercase font-light mb-6">Trajets populaires</div>
            <div className="space-y-px">
              {popularRoutes.map((r, i) => (
                <div key={i}
                  className="group flex items-center justify-between gap-4 border border-white/[0.04] p-5 hover:border-[#D4AF37]/20 hover:bg-white/[0.015] transition-all duration-300 cursor-pointer"
                  onClick={() => { setFrom(r.from); setTo(r.to); }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                      <div className="w-px h-3 bg-[#D4AF37]/20" />
                      <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
                    </div>
                    <div>
                      <div className="text-[#8A8A8A] text-xs font-light">{r.from}</div>
                      <div className="text-white text-base font-light">{r.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[#D4AF37] text-base font-light tracking-wide">
                        Prix sur devis
                      </div>
                      <div className="text-[#A1A1AA] text-[11px] tracking-wide">{r.time}</div>
                    </div>
                    <ArrowRight size={13} className="text-[#707070] group-hover:text-[#D4AF37] transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

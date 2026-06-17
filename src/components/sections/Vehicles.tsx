"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Luggage } from "lucide-react";
import { engine, Engine } from "@/lib/engine";

function VehicleSilhouette({ type, capacity }: { type: string; capacity: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div
        className="text-[clamp(5rem,12vw,10rem)] font-light leading-none"
        style={{ fontFamily: "var(--font-serif)", color: "rgba(212,175,55,0.08)" }}
      >
        {capacity.split("–")[1]?.trim() ?? capacity}
      </div>
      <div className="text-[#D4AF37] text-xs tracking-[0.45em] uppercase font-light">
        {type}
      </div>
    </div>
  );
}

const vehicles = [
  { type: "Berline",   capacity: "4 places", luggage: "3 bagages",  comfort: "Première Classe", variant: "berline" as const,
    desc: "Idéale pour couples et petits groupes. Confort premium pour vos circuits touristiques et transferts." },
  { type: "Van",       capacity: "6 places", luggage: "6 bagages",  comfort: "Confort +",       variant: "van" as const,
    desc: "Espace généreux pour familles et groupes. Parfait pour les journées tourisme accompagné en Provence." },
  { type: "Grand Van", capacity: "8 places", luggage: "10 bagages", comfort: "Prestige",        variant: "grandvan" as const,
    desc: "Capacité maximale pour grands groupes. Idéal pour circuits en délégation ou sorties entre amis." },
];

export default function Vehicles() {
  const [sel, setSel] = useState(0);
  const secRef   = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const tabsRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const infoRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (headRef.current) {
        const p  = Engine.elVisible(headRef.current, 1.05, 0.5);
        const ep = Engine.ease(p);
        headRef.current.style.opacity   = String(ep);
        headRef.current.style.transform = `translateY(${(1 - ep) * 40}px)`;
      }
      if (tabsRef.current) {
        const p  = Engine.elVisible(tabsRef.current, 1.02, 0.55);
        tabsRef.current.style.opacity = String(Engine.ease(p));
      }
      if (imgRef.current) {
        const p = Engine.elVisible(imgRef.current, 1.1, 0.15);
        imgRef.current.style.opacity = String(Engine.ease(p));
      }
      if (infoRef.current) {
        const p  = Engine.elVisible(infoRef.current, 1.05, 0.25);
        const ep = Engine.ease(p);
        infoRef.current.style.opacity   = String(ep);
        infoRef.current.style.transform = `translateX(${(1 - ep) * 40}px)`;
      }
    });
    return unsub;
  }, []);

  const v = vehicles[sel];

  return (
    <section id="vehicules" ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div ref={headRef} className="mb-14" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Flotte</span>
          </div>
          <h2 className="font-light leading-tight" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem,5.5vw,5.5rem)", color: "var(--text-primary)" }}>
            Votre véhicule,<br /><span style={{ color: "var(--text-secondary)" }}>votre confort.</span>
          </h2>
        </div>

        <div ref={tabsRef} className="flex gap-0 mb-14 border-b border-white/[0.04]" style={{ opacity: 1 }}>
          {vehicles.map((veh, i) => (
            <button key={i} onClick={() => setSel(i)}
              className="px-8 py-4 text-base font-light tracking-[0.18em] uppercase transition-all duration-300 relative"
              style={{ color: sel === i ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {veh.type}
              {sel === i && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]" />}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/3] flex items-center justify-center">
            <VehicleSilhouette type={v.type} capacity={v.capacity} />
          </div>

          <div ref={infoRef} style={{ opacity: 1 }}>
            <div className="flex items-center gap-5 mb-8 flex-wrap">
              <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <Users size={14} className="text-[#D4AF37]" />
                <span className="text-base font-light">{v.capacity}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <Luggage size={14} className="text-[#D4AF37]" />
                <span className="text-base font-light">{v.luggage}</span>
              </div>
              <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.22em] border border-[#D4AF37]/25 px-3 py-1 font-light">{v.comfort}</span>
            </div>
            <p className="font-light leading-relaxed mb-10 text-lg" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
            <a href="#contact"
              className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-4 text-base font-medium tracking-[0.12em] uppercase hover:bg-white transition-colors duration-300">
              Demander un devis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

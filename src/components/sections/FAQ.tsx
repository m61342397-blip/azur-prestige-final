"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { engine, Engine } from "@/lib/engine";

const faqs = [
  { q: "Comment réserver un taxi à Marseille ?", a: "Par téléphone, WhatsApp ou formulaire en ligne. Confirmation immédiate par SMS avec le nom et le numéro du chauffeur." },
  { q: "Quels sont vos tarifs pour l'aéroport ?", a: "Tarif fixe depuis l'aéroport Marseille-Provence : 65€ vers le centre-ville. Pas de supplément en cas de retard de vol." },
  { q: "Êtes-vous disponibles la nuit et le week-end ?", a: "Oui, 24h/7j et 365 jours par an. Nos tarifs ne changent pas selon l'heure ou le jour." },
  { q: "Proposez-vous des contrats entreprise ?", a: "Oui, facturation mensuelle, chauffeur dédié sur demande, reporting des courses. Contactez-nous pour un devis." },
  { q: "Puis-je réserver pour un groupe ?", a: "Oui, notre Van (6 passagers) et Grand Van (8 passagers) sont disponibles pour groupes, avec grande soute à bagages." },
  { q: "Comment fonctionne le suivi de vol ?", a: "Nous surveillons votre vol en temps réel. Si votre avion a du retard, votre chauffeur adapte son heure d'arrivée automatiquement." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const secRef   = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (headRef.current) {
        const p = Engine.ease(Engine.elVisible(headRef.current, 1.05, 0.5));
        headRef.current.style.opacity   = String(p);
        headRef.current.style.transform = `translateY(${(1 - p) * 40}px)`;
      }
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const p = Engine.ease(Engine.elVisible(item, 1.05, 0.4));
        const delayed = Engine.ease(Engine.clamp(p - i * 0.03));
        item.style.opacity   = String(delayed);
        item.style.transform = `translateY(${(1 - delayed) * 30}px)`;
      });
    });
    return unsub;
  }, []);

  return (
    <section id="faq" ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div ref={headRef} style={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4AF37]" /><span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">FAQ</span></div>
            <h2 className="font-light leading-tight text-white" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,4rem)" }}>
              Questions<br /><span className="text-[#A1A1AA]">fréquentes.</span>
            </h2>
          </div>
          <div className="space-y-px">
            {faqs.map((faq, i) => (
              <div key={i} ref={el => { if (el) itemsRef.current[i] = el; }}
                className="border-b border-white/[0.04]" style={{ opacity: 1 }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                  <span className={`text-sm font-light leading-relaxed transition-colors duration-300 ${open === i ? "text-white" : "text-[#8A8A8A] group-hover:text-white"}`}>
                    {faq.q}
                  </span>
                  <div className="shrink-0 w-6 h-6 border border-white/[0.08] flex items-center justify-center group-hover:border-[#D4AF37]/30 transition-colors duration-300">
                    {open === i ? <Minus size={12} className="text-[#D4AF37]" /> : <Plus size={12} className="text-[#A1A1AA]" />}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-[#A1A1AA] text-sm font-light leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, MapPin, Calendar, Clock, Users, Luggage, Car, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import { engine, Engine } from "@/lib/engine";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import ContactChoice from "@/components/ui/ContactChoice";

const vehicules = [
  { id: "berline",  label: "Berline",   cap: "1–4 passagers", bag: "3 bagages"  },
  { id: "van",      label: "Van",       cap: "1–6 passagers", bag: "6 bagages"  },
  { id: "grandvan", label: "Grand Van", cap: "1–8 passagers", bag: "10 bagages" },
];

type Step = 1 | 2 | 3;
type Status = "idle" | "loading" | "success" | "error";

export default function Reservation() {
  const [step,   setStep]   = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error,  setError]  = useState("");
  const [refId,  setRefId]  = useState("");

  const [form, setForm] = useState({
    prenom: "", nom: "", telephone: "", email: "",
    date_course: "", heure_course: "",
    depart: "", destination: "",
    nb_passagers: "1", nb_bagages: "0",
    vehicule: "berline", message: "",
  });

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      if (!headerRef.current) return;
      const p = Engine.ease(Engine.elVisible(headerRef.current, 1.05, 0.5));
      headerRef.current.style.opacity   = String(p);
      headerRef.current.style.transform = `translateY(${(1 - p) * 25}px)`;
    });
    return unsub;
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const today = new Date().toISOString().split("T")[0];
  const canNext1 = form.prenom && form.nom && form.telephone && form.email;
  const canNext2 = form.date_course && form.heure_course && form.depart && form.destination;
  const vLabel = vehicules.find(v => v.id === form.vehicule)?.label ?? "";

  const inp = "w-full bg-transparent border border-white/[0.08] text-white placeholder-[#444] px-4 py-3.5 text-sm font-light focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300";
  const lbl = "block text-[#707070] text-[10px] uppercase tracking-[0.25em] font-light mb-2";

  const handleSubmit = async () => {
    setStatus("loading");
    setError("");
    try {
      const res  = await fetch("/api/reservation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      setRefId(json.id);
      setStatus("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur. Appelez-nous directement.");
      setStatus("error");
    }
  };

  if (status === "success") return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient /><Navigation />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-lg w-full">
          <CheckCircle size={52} className="text-[#D4AF37] mx-auto mb-8" />
          <h1 className="font-light text-white mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3.5rem)" }}>
            Réservation envoyée !
          </h1>
          <p className="text-[#A1A1AA] font-light mb-2">
            Référence : <span className="text-white font-medium">{refId}</span>
          </p>
          <p className="text-[#A1A1AA] font-light leading-relaxed mb-10">
            Un email de confirmation a été envoyé à <span className="text-white">{form.email}</span>.<br />
            Nous confirmons la prise en charge sous 30 minutes.
          </p>
          <div className="border border-white/[0.06] divide-y divide-white/[0.04] mb-10 text-left">
            {[
              { l: "Date",        v: new Date(form.date_course).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" }) },
              { l: "Heure",       v: form.heure_course },
              { l: "Départ",      v: form.depart },
              { l: "Destination", v: form.destination },
              { l: "Véhicule",    v: vLabel },
            ].map(({ l, v }) => (
              <div key={l} className="flex gap-4 px-5 py-3">
                <span className="text-[#707070] text-[10px] uppercase tracking-[0.2em] w-28 shrink-0 pt-0.5">{l}</span>
                <span className="text-[#A1A1AA] text-sm font-light">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/" className="border border-white/[0.08] text-[#A1A1AA] px-8 py-3.5 text-sm font-light tracking-[0.1em] uppercase hover:border-[#D4AF37]/40 hover:text-white transition-all duration-300">← Accueil</a>
            <ContactChoice
              mode="call"
              align="center"
              direction="up"
              className="bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300"
              trigger={<>Nous appeler</>}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );

  return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient /><Navigation />
      <div className="max-w-[820px] mx-auto px-6 lg:px-12 pt-32 pb-24">

        {/* Header */}
        <div ref={headerRef} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Réservation en ligne</span>
          </div>
          <h1 className="font-light leading-tight text-white mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}>
            Réservez votre<br /><span className="text-[#D4AF37]">taxi en ligne.</span>
          </h1>
          <p className="text-[#A1A1AA] font-light leading-relaxed max-w-lg">
            Confirmation par email sous 30 minutes. Paiement sur place auprès du chauffeur.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-12">
          {[{ n: 1, label: "Coordonnées" }, { n: 2, label: "Trajet" }, { n: 3, label: "Confirmation" }].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-light transition-all duration-300 ${step === s.n ? "bg-[#D4AF37] text-[#050505]" : step > s.n ? "border border-[#D4AF37] text-[#D4AF37]" : "border border-white/[0.1] text-[#444]"}`}>
                  {step > s.n ? "✓" : `0${s.n}`}
                </div>
                <span className={`text-xs font-light uppercase tracking-[0.15em] hidden sm:block transition-colors duration-300 ${step === s.n ? "text-white" : step > s.n ? "text-[#D4AF37]" : "text-[#444]"}`}>{s.label}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-white/[0.06] mx-4" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="border border-white/[0.06]">

          {/* Étape 1 */}
          {step === 1 && (
            <div className="p-8 lg:p-10">
              <h2 className="text-white font-light mb-8 text-lg">Vos coordonnées</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className={lbl}>Prénom *</label><input className={inp} placeholder="Jean" value={form.prenom} onChange={e => set("prenom", e.target.value)} /></div>
                <div><label className={lbl}>Nom *</label><input className={inp} placeholder="Dupont" value={form.nom} onChange={e => set("nom", e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className={lbl}>Téléphone *</label><input className={inp} placeholder="+33 6 00 00 00 00" type="tel" value={form.telephone} onChange={e => set("telephone", e.target.value)} /></div>
                <div><label className={lbl}>Email *</label><input className={inp} placeholder="jean@email.com" type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="p-8 lg:p-10">
              <h2 className="text-white font-light mb-8 text-lg">Votre trajet</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className={lbl}><Calendar size={10} className="inline mr-1" />Date *</label><input className={inp} type="date" min={today} value={form.date_course} onChange={e => set("date_course", e.target.value)} /></div>
                <div><label className={lbl}><Clock size={10} className="inline mr-1" />Heure *</label><input className={inp} type="time" value={form.heure_course} onChange={e => set("heure_course", e.target.value)} /></div>
              </div>
              <div className="space-y-5 mb-5">
                <div><label className={lbl}>Départ *</label><AddressAutocomplete placeholder="Ex : Aéroport Marseille-Provence, Terminal 1" value={form.depart} onChange={v => set("depart", v)} icon="depart" /></div>
                <div><label className={lbl}>Destination *</label><AddressAutocomplete placeholder="Ex : 10 rue de la République, Marseille" value={form.destination} onChange={v => set("destination", v)} icon="arrivee" /></div>
              </div>
              <div className="grid grid-cols-3 gap-5 mb-5">
                <div><label className={lbl}><Users size={10} className="inline mr-1" />Passagers</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.nb_passagers} onChange={e => set("nb_passagers", e.target.value)}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div><label className={lbl}><Luggage size={10} className="inline mr-1" />Bagages</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.nb_bagages} onChange={e => set("nb_bagages", e.target.value)}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div><label className={lbl}><Car size={10} className="inline mr-1" />Véhicule</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.vehicule} onChange={e => set("vehicule", e.target.value)}>
                    {vehicules.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={lbl}>Message (optionnel)</label><textarea className={inp + " resize-none"} rows={3} placeholder="Siège enfant, numéro de vol, instructions..." value={form.message} onChange={e => set("message", e.target.value)} /></div>
            </div>
          )}

          {/* Étape 3 */}
          {step === 3 && (
            <div className="p-8 lg:p-10">
              <h2 className="text-white font-light mb-8 text-lg">Récapitulatif</h2>
              <div className="border border-white/[0.06] divide-y divide-white/[0.04] mb-8">
                {[
                  { l: "Nom",         v: `${form.prenom} ${form.nom}` },
                  { l: "Téléphone",   v: form.telephone },
                  { l: "Email",       v: form.email },
                  { l: "Date",        v: new Date(form.date_course).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) },
                  { l: "Heure",       v: form.heure_course },
                  { l: "Départ",      v: form.depart },
                  { l: "Destination", v: form.destination },
                  { l: "Véhicule",    v: vLabel },
                  { l: "Passagers",   v: form.nb_passagers },
                  { l: "Bagages",     v: form.nb_bagages },
                  ...(form.message ? [{ l: "Message", v: form.message }] : []),
                ].map(({ l, v }) => (
                  <div key={l} className="flex gap-4 px-5 py-3.5">
                    <span className="text-[#707070] text-[10px] uppercase tracking-[0.2em] w-32 shrink-0 pt-0.5">{l}</span>
                    <span className="text-[#A1A1AA] text-sm font-light">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] p-5 mb-6">
                <p className="text-[#A1A1AA] text-sm font-light leading-relaxed">
                  <span className="text-[#D4AF37]">Paiement sur place</span> — espèces ou CB auprès du chauffeur. Annulation gratuite jusqu'à 24h avant.
                </p>
              </div>
              {status === "error" && (
                <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/[0.05] p-4 mb-6">
                  <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm font-light">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="border-t border-white/[0.06] px-8 lg:px-10 py-6 flex items-center justify-between">
            {step > 1
              ? <button onClick={() => setStep(s => (s - 1) as Step)} className="text-[#707070] text-sm font-light uppercase tracking-[0.15em] hover:text-white transition-colors">← Retour</button>
              : <a href="/" className="text-[#707070] text-sm font-light uppercase tracking-[0.15em] hover:text-white transition-colors">← Accueil</a>
            }
            {step < 3
              ? <button onClick={() => setStep(s => (s + 1) as Step)} disabled={step === 1 ? !canNext1 : !canNext2}
                  className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  Continuer <ArrowRight size={13} />
                </button>
              : <button onClick={handleSubmit} disabled={status === "loading"}
                  className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-60">
                  {status === "loading" ? "Envoi..." : <>Confirmer <ArrowRight size={13} /></>}
                </button>
            }
          </div>
        </div>

        {/* Minimum personnes */}
        <div className="mt-6 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-5 py-3">
          <p className="text-[#A1A1AA] text-sm font-light">
            <span className="text-[#D4AF37]">Tarif minimum pour 4 personnes</span> — au-delà, supplément par personne.
          </p>
        </div>

        {/* Garanties */}
        <div className="mt-6 flex items-center gap-6 flex-wrap">
          {["Confirmation sous 30 min", "Paiement sur place", "Annulation gratuite 24h avant"].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span className="text-[#707070] text-xs font-light tracking-wide">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

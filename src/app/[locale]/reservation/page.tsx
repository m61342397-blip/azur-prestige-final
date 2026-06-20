"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, MapPin, Calendar, Clock, Users, Luggage, Car, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import { engine, Engine } from "@/lib/engine";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import ContactChoice from "@/components/ui/ContactChoice";
import { Link } from "@/i18n/navigation";

const VEHICLE_IDS = ["berline", "van", "grandvan"] as const;

type Step = 1 | 2 | 3;
type Status = "idle" | "loading" | "success" | "error";

export default function Reservation() {
  const t = useTranslations("Reservation");
  const locale = useLocale();
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
  const vLabel = t(`vehicles.${form.vehicule}`);

  const inp = "w-full bg-transparent border border-white/[0.08] text-white placeholder-[#444] px-4 py-3.5 text-sm font-light focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300";
  const lbl = "block text-[#707070] text-[10px] uppercase tracking-[0.25em] font-light mb-2";

  const handleSubmit = async () => {
    setStatus("loading");
    setError("");
    try {
      const res  = await fetch("/api/reservation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, locale }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errorUnknown"));
      setRefId(json.id);
      setStatus("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
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
            {t("successTitle")}
          </h1>
          <p className="text-[#A1A1AA] font-light mb-2">
            {t("reference")} <span className="text-white font-medium">{refId}</span>
          </p>
          <p className="text-[#A1A1AA] font-light leading-relaxed mb-10">
            {t.rich("successEmail", { email: () => <span className="text-white">{form.email}</span> })}<br />
            {t("successDelay")}
          </p>
          <div className="border border-white/[0.06] divide-y divide-white/[0.04] mb-10 text-left">
            {[
              { l: t("recapDate"),        v: new Date(form.date_course).toLocaleDateString(locale, { weekday:"long", day:"numeric", month:"long" }) },
              { l: t("recapTime"),        v: form.heure_course },
              { l: t("recapFrom"),        v: form.depart },
              { l: t("recapTo"),          v: form.destination },
              { l: t("recapVehicle"),     v: vLabel },
            ].map(({ l, v }) => (
              <div key={l} className="flex gap-4 px-5 py-3">
                <span className="text-[#707070] text-[10px] uppercase tracking-[0.2em] w-28 shrink-0 pt-0.5">{l}</span>
                <span className="text-[#A1A1AA] text-sm font-light">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/" className="border border-white/[0.08] text-[#A1A1AA] px-8 py-3.5 text-sm font-light tracking-[0.1em] uppercase hover:border-[#D4AF37]/40 hover:text-white transition-all duration-300">{t("backHomeShort")}</Link>
            <ContactChoice
              mode="call"
              align="center"
              direction="up"
              className="bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300"
              trigger={<>{t("callUs")}</>}
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
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">{t("eyebrow")}</span>
          </div>
          <h1 className="font-light leading-tight text-white mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}>
            {t("titleLine1")}<br /><span className="text-[#D4AF37]">{t("titleLine2")}</span>
          </h1>
          <p className="text-[#A1A1AA] font-light leading-relaxed max-w-lg">
            {t("intro")}
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-12">
          {[{ n: 1, label: t("step1") }, { n: 2, label: t("step2") }, { n: 3, label: t("step3") }].map((s, i) => (
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
              <h2 className="text-white font-light mb-8 text-lg">{t("step1Title")}</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className={lbl}>{t("firstName")}</label><input className={inp} placeholder="Jean" value={form.prenom} onChange={e => set("prenom", e.target.value)} /></div>
                <div><label className={lbl}>{t("lastName")}</label><input className={inp} placeholder="Dupont" value={form.nom} onChange={e => set("nom", e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className={lbl}>{t("phone")}</label><input className={inp} placeholder="+33 6 00 00 00 00" type="tel" value={form.telephone} onChange={e => set("telephone", e.target.value)} /></div>
                <div><label className={lbl}>{t("email")}</label><input className={inp} placeholder="jean@email.com" type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
              </div>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="p-8 lg:p-10">
              <h2 className="text-white font-light mb-8 text-lg">{t("step2Title")}</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className={lbl}><Calendar size={10} className="inline mr-1" />{t("date")}</label><input className={inp} type="date" min={today} value={form.date_course} onChange={e => set("date_course", e.target.value)} /></div>
                <div><label className={lbl}><Clock size={10} className="inline mr-1" />{t("time")}</label><input className={inp} type="time" value={form.heure_course} onChange={e => set("heure_course", e.target.value)} /></div>
              </div>
              <div className="space-y-5 mb-5">
                <div><label className={lbl}>{t("from")}</label><AddressAutocomplete placeholder={t("fromPlaceholder")} value={form.depart} onChange={v => set("depart", v)} icon="depart" /></div>
                <div><label className={lbl}>{t("to")}</label><AddressAutocomplete placeholder={t("toPlaceholder")} value={form.destination} onChange={v => set("destination", v)} icon="arrivee" /></div>
              </div>
              <div className="grid grid-cols-3 gap-5 mb-5">
                <div><label className={lbl}><Users size={10} className="inline mr-1" />{t("passengers")}</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.nb_passagers} onChange={e => set("nb_passagers", e.target.value)}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div><label className={lbl}><Luggage size={10} className="inline mr-1" />{t("luggage")}</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.nb_bagages} onChange={e => set("nb_bagages", e.target.value)}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div><label className={lbl}><Car size={10} className="inline mr-1" />{t("vehicle")}</label>
                  <select className={inp + " cursor-pointer"} style={{ background: "#080808" }} value={form.vehicule} onChange={e => set("vehicule", e.target.value)}>
                    {VEHICLE_IDS.map(id => <option key={id} value={id}>{t(`vehicles.${id}`)}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={lbl}>{t("messageLabel")}</label><textarea className={inp + " resize-none"} rows={3} placeholder={t("messagePlaceholder")} value={form.message} onChange={e => set("message", e.target.value)} /></div>
            </div>
          )}

          {/* Étape 3 */}
          {step === 3 && (
            <div className="p-8 lg:p-10">
              <h2 className="text-white font-light mb-8 text-lg">{t("step3Title")}</h2>
              <div className="border border-white/[0.06] divide-y divide-white/[0.04] mb-8">
                {[
                  { l: t("recapName"),     v: `${form.prenom} ${form.nom}` },
                  { l: t("recapPhone"),    v: form.telephone },
                  { l: t("recapEmail"),    v: form.email },
                  { l: t("recapDate"),     v: new Date(form.date_course).toLocaleDateString(locale, { weekday:"long", day:"numeric", month:"long", year:"numeric" }) },
                  { l: t("recapTime"),     v: form.heure_course },
                  { l: t("recapFrom"),     v: form.depart },
                  { l: t("recapTo"),       v: form.destination },
                  { l: t("recapVehicle"),  v: vLabel },
                  { l: t("recapPassengers"), v: form.nb_passagers },
                  { l: t("recapLuggage"),  v: form.nb_bagages },
                  ...(form.message ? [{ l: t("recapMessage"), v: form.message }] : []),
                ].map(({ l, v }) => (
                  <div key={l} className="flex gap-4 px-5 py-3.5">
                    <span className="text-[#707070] text-[10px] uppercase tracking-[0.2em] w-32 shrink-0 pt-0.5">{l}</span>
                    <span className="text-[#A1A1AA] text-sm font-light">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] p-5 mb-6">
                <p className="text-[#A1A1AA] text-sm font-light leading-relaxed">
                  {t.rich("paymentNote", { gold: (c) => <span className="text-[#D4AF37]">{c}</span> })}
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
              ? <button onClick={() => setStep(s => (s - 1) as Step)} className="text-[#707070] text-sm font-light uppercase tracking-[0.15em] hover:text-white transition-colors">{t("back")}</button>
              : <Link href="/" className="text-[#707070] text-sm font-light uppercase tracking-[0.15em] hover:text-white transition-colors">{t("backHomeShort")}</Link>
            }
            {step < 3
              ? <button onClick={() => setStep(s => (s + 1) as Step)} disabled={step === 1 ? !canNext1 : !canNext2}
                  className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  {t("continue")} <ArrowRight size={13} />
                </button>
              : <button onClick={handleSubmit} disabled={status === "loading"}
                  className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-60">
                  {status === "loading" ? t("sending") : <>{t("confirm")} <ArrowRight size={13} /></>}
                </button>
            }
          </div>
        </div>

        {/* Minimum personnes */}
        <div className="mt-6 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] px-5 py-3">
          <p className="text-[#A1A1AA] text-sm font-light">
            {t.rich("minFare", { gold: (c) => <span className="text-[#D4AF37]">{c}</span> })}
          </p>
        </div>

        {/* Garanties */}
        <div className="mt-6 flex items-center gap-6 flex-wrap">
          {(t.raw("guarantees") as string[]).map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span className="text-[#707070] text-xs font-light tracking-wide">{g}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

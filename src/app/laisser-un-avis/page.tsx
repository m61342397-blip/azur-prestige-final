"use client";

import { useState } from "react";
import { Star, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";

type Status = "idle" | "loading" | "success" | "error";

export default function LaisserUnAvis() {
  const [nom, setNom] = useState("");
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const inp =
    "w-full bg-transparent border border-white/[0.08] text-white placeholder-[#444] px-4 py-3.5 text-sm font-light focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300";
  const lbl = "block text-[#707070] text-[10px] uppercase tracking-[0.25em] font-light mb-2";

  const canSubmit = nom.trim() && note >= 1 && note <= 5 && commentaire.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, note, commentaire }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      setStatus("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setStatus("error");
    }
  };

  if (status === "success")
    return (
      <main className="bg-[#050505] min-h-screen">
        <GlobalAmbient />
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-lg w-full">
            <CheckCircle size={52} className="text-[#D4AF37] mx-auto mb-8" />
            <h1
              className="font-light text-white mb-4"
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3.5rem)" }}
            >
              Merci pour votre avis !
            </h1>
            <p className="text-[#A1A1AA] font-light leading-relaxed mb-10">
              Votre avis a bien été enregistré.<br />
              Il sera publié après validation par notre équipe.
            </p>
            <a
              href="/"
              className="inline-block bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors duration-300"
            >
              ← Retour à l'accueil
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );

  return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient />
      <Navigation />
      <div className="max-w-[640px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">
              Votre expérience
            </span>
          </div>
          <h1
            className="font-light leading-tight text-white mb-4"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}
          >
            Laissez<br />
            <span className="text-[#D4AF37]">votre avis.</span>
          </h1>
          <p className="text-[#A1A1AA] font-light leading-relaxed max-w-lg">
            Partagez votre expérience avec Azur Prestige. Votre avis sera publié après validation.
          </p>
        </div>

        {/* Form card */}
        <div className="border border-white/[0.06] p-8 lg:p-10">
          {/* Nom */}
          <div className="mb-6">
            <label className={lbl}>Votre nom *</label>
            <input
              className={inp}
              placeholder="Jean D."
              maxLength={80}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className={lbl}>Votre note *</label>
            <div className="flex items-center gap-2" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => {
                const active = (hover || note) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setNote(n)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <Star
                      size={30}
                      className="transition-colors duration-200"
                      style={{
                        color: active ? "#D4AF37" : "#333",
                        fill: active ? "#D4AF37" : "transparent",
                      }}
                    />
                  </button>
                );
              })}
              {note > 0 && (
                <span className="text-[#707070] text-sm font-light ml-3">{note}/5</span>
              )}
            </div>
          </div>

          {/* Commentaire */}
          <div className="mb-8">
            <label className={lbl}>Votre commentaire *</label>
            <textarea
              className={inp + " resize-none"}
              rows={5}
              maxLength={1000}
              placeholder="Racontez votre expérience..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          {status === "error" && (
            <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/[0.05] p-4 mb-6">
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-light">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || status === "loading"}
            className="flex items-center gap-3 bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Envoi..." : <>Publier mon avis <ArrowRight size={13} /></>}
          </button>
        </div>

        <a
          href="/"
          className="inline-block mt-8 text-[#707070] text-sm font-light uppercase tracking-[0.15em] hover:text-white transition-colors"
        >
          ← Retour à l'accueil
        </a>
      </div>
      <Footer />
    </main>
  );
}

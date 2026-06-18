"use client";

import { useState, useCallback } from "react";
import { Star, Check, X, Lock, RefreshCw } from "lucide-react";
import type { Avis } from "@/lib/supabase";

type Status = "locked" | "loading" | "ready" | "error";

const statutLabel: Record<Avis["statut"], string> = {
  en_attente: "En attente",
  approuve: "Approuvé",
  refuse: "Refusé",
};

const statutColor: Record<Avis["statut"], string> = {
  en_attente: "#D4AF37",
  approuve: "#4ade80",
  refuse: "#f87171",
};

function Stars({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          style={{
            color: n <= note ? "#D4AF37" : "#333",
            fill: n <= note ? "#D4AF37" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export default function AdminAvis() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("locked");
  const [error, setError] = useState("");
  const [avis, setAvis] = useState<Avis[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (pwd: string) => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/avis", { headers: { "x-admin-password": pwd } });
      if (res.status === 401) {
        setStatus("locked");
        setError("Mot de passe incorrect.");
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");
      const json = await res.json();
      setAvis(json.avis ?? []);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("Impossible de charger les avis.");
    }
  }, []);

  const updateStatut = async (id: string, statut: "approuve" | "refuse") => {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/avis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ id, statut }),
      });
      if (!res.ok) throw new Error();
      setAvis((prev) => prev.map((a) => (a.id === id ? { ...a, statut } : a)));
    } catch {
      setError("La mise à jour a échoué.");
    } finally {
      setBusy(null);
    }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── Écran de connexion ──
  if (status !== "ready") {
    return (
      <main className="bg-[#050505] min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <Lock size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">
              Modération des avis
            </span>
          </div>
          <h1
            className="font-light text-white mb-8"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.5rem)" }}
          >
            Accès administrateur
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(password);
            }}
          >
            <input
              type="password"
              autoFocus
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/[0.08] text-white placeholder-[#444] px-4 py-3.5 text-sm font-light focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300 mb-4"
            />
            {error && <p className="text-red-400 text-sm font-light mb-4">{error}</p>}
            <button
              type="submit"
              disabled={!password || status === "loading"}
              className="w-full bg-[#D4AF37] text-[#050505] px-8 py-3.5 text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors disabled:opacity-40"
            >
              {status === "loading" ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const enAttente = avis.filter((a) => a.statut === "en_attente");
  const traites = avis.filter((a) => a.statut !== "en_attente");

  return (
    <main className="bg-[#050505] min-h-screen">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 pt-20 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">
                Modération des avis
              </span>
            </div>
            <h1
              className="font-light text-white"
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3rem)" }}
            >
              Avis clients
            </h1>
          </div>
          <button
            onClick={() => load(password)}
            className="flex items-center gap-2 text-[#707070] text-xs font-light uppercase tracking-[0.15em] hover:text-white transition-colors"
          >
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>

        {error && <p className="text-red-400 text-sm font-light mb-6">{error}</p>}

        {/* En attente */}
        <h2 className="text-white text-sm font-light uppercase tracking-[0.2em] mb-5">
          En attente <span className="text-[#707070]">({enAttente.length})</span>
        </h2>
        {enAttente.length === 0 ? (
          <p className="text-[#707070] text-sm font-light mb-14">Aucun avis en attente de modération.</p>
        ) : (
          <div className="space-y-px bg-white/[0.04] mb-14">
            {enAttente.map((a) => (
              <div key={a.id} className="bg-[#050505] p-6">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white text-sm font-light">{a.nom}</span>
                      <Stars note={a.note} />
                    </div>
                    <p className="text-[#8A8A8A] text-base font-light leading-relaxed italic mb-2">
                      &ldquo;{a.commentaire}&rdquo;
                    </p>
                    <span className="text-[#707070] text-[11px] font-light">{fmtDate(a.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStatut(a.id, "approuve")}
                      disabled={busy === a.id}
                      className="flex items-center gap-2 border border-green-500/30 text-green-400 px-5 py-2.5 text-xs font-light uppercase tracking-[0.1em] hover:bg-green-500/10 transition-colors disabled:opacity-40"
                    >
                      <Check size={14} /> Valider
                    </button>
                    <button
                      onClick={() => updateStatut(a.id, "refuse")}
                      disabled={busy === a.id}
                      className="flex items-center gap-2 border border-red-500/30 text-red-400 px-5 py-2.5 text-xs font-light uppercase tracking-[0.1em] hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      <X size={14} /> Refuser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Déjà traités */}
        <h2 className="text-white text-sm font-light uppercase tracking-[0.2em] mb-5">
          Historique <span className="text-[#707070]">({traites.length})</span>
        </h2>
        {traites.length === 0 ? (
          <p className="text-[#707070] text-sm font-light">Aucun avis traité pour le moment.</p>
        ) : (
          <div className="space-y-px bg-white/[0.04]">
            {traites.map((a) => (
              <div key={a.id} className="bg-[#050505] p-6 flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white text-sm font-light">{a.nom}</span>
                    <Stars note={a.note} />
                  </div>
                  <p className="text-[#8A8A8A] text-sm font-light leading-relaxed italic mb-2">
                    &ldquo;{a.commentaire}&rdquo;
                  </p>
                  <span className="text-[#707070] text-[11px] font-light">{fmtDate(a.created_at)}</span>
                </div>
                <span
                  className="text-[11px] font-light uppercase tracking-[0.15em] px-3 py-1.5 border"
                  style={{ color: statutColor[a.statut], borderColor: `${statutColor[a.statut]}40` }}
                >
                  {statutLabel[a.statut]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

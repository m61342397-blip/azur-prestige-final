"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Phone, MessageCircle, type LucideIcon } from "lucide-react";
import { DRIVERS, type Driver } from "@/lib/drivers";

type Mode = "call" | "whatsapp";

const GAP = 8;     // espace entre le bouton et la popup
const MARGIN = 12; // marge de sécurité avec les bords de l'écran

/**
 * Bouton de contact qui ouvre un petit menu de choix entre les deux chauffeurs
 * au clic, au lieu d'appeler / d'ouvrir WhatsApp directement sur un seul numéro.
 *
 * - `mode="call"`     → chaque entrée est un lien `tel:`
 * - `mode="whatsapp"` → chaque entrée ouvre `wa.me` (avec `waText` optionnel pré-rempli)
 *
 * Positionnement : la popup est rendue dans un portail sur `document.body`, en
 * `position: fixed`, avec des coordonnées calculées depuis le rectangle réel du
 * bouton. Cela évite tout décalage dû à la largeur du wrapper et tout clipping /
 * containing-block parasite causé par un ancêtre ayant un `transform` (parallax
 * du Hero) ou un `overflow`. La direction (haut/bas) et l'alignement horizontal
 * sont choisis dynamiquement selon la place disponible ; `align`/`direction` ne
 * servent plus que de préférence quand les deux côtés tiennent.
 */
export default function ContactChoice({
  mode,
  trigger,
  className,
  style,
  wrapperClassName = "relative",
  wrapperStyle,
  align = "left",
  direction = "down",
  waText,
}: {
  mode: Mode;
  trigger: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  align?: "left" | "right" | "center";
  direction?: "up" | "down";
  waText?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Positionne la popup (fixed, coordonnées viewport) par rapport au bouton.
  // Écrit directement dans le style pour rester collé même pendant un scroll fluide.
  const place = useCallback(() => {
    const btn = btnRef.current;
    const panel = panelRef.current;
    if (!btn || !panel) return;

    const b = btn.getBoundingClientRect();
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ── Horizontal : on part de la préférence `align`, puis on rabat/clamp ──
    let left =
      align === "right" ? b.right - pw
      : align === "center" ? b.left + b.width / 2 - pw / 2
      : b.left;
    if (left + pw > vw - MARGIN) left = b.right - pw; // déborde à droite → aligne à droite
    if (left < MARGIN) left = b.left;                 // déborde à gauche → aligne à gauche
    left = Math.min(Math.max(left, MARGIN), Math.max(MARGIN, vw - pw - MARGIN));

    // ── Vertical : ouvre en dessous si ça tient, sinon au-dessus ──
    const spaceBelow = vh - b.bottom;
    const spaceAbove = b.top;
    const needed = ph + GAP;
    const openUp =
      direction === "up"
        ? spaceAbove >= needed || spaceAbove >= spaceBelow // préfère le haut
        : spaceBelow < needed && spaceAbove > spaceBelow;  // préfère le bas, bascule si trop juste
    let top = openUp ? b.top - ph - GAP : b.bottom + GAP;
    top = Math.min(Math.max(top, MARGIN), Math.max(MARGIN, vh - ph - MARGIN));

    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    panel.style.visibility = "visible";
  }, [align, direction]);

  // Recalcule en continu tant que la popup est ouverte (scroll fluide, resize…).
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const loop = () => {
      place();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [open, place]);

  // Fermeture : clic extérieur (bouton + popup exclus) ou touche Échap.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const Icon: LucideIcon = mode === "whatsapp" ? MessageCircle : Phone;

  const hrefFor = (d: Driver) =>
    mode === "whatsapp"
      ? `https://wa.me/${d.wa}${waText ? `?text=${encodeURIComponent(waText)}` : ""}`
      : `tel:${d.tel}`;

  const panel = (
    <div
      ref={panelRef}
      role="menu"
      style={{ position: "fixed", top: 0, left: 0, visibility: "hidden" }}
      className="z-[200] min-w-[244px] bg-[#0c0c0c]/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-2xl shadow-black/60"
    >
      <div className="px-4 py-2.5 border-b border-white/[0.06]">
        {/* Couleurs en inline : une règle globale `color: inherit` (hors layer)
            surchargerait sinon les utilitaires Tailwind et teinterait ce texte
            en sombre sur le thème clair des circuits — popup illisible. */}
        <span className="text-[9px] tracking-[0.3em] uppercase font-light" style={{ color: "#D4AF37" }}>
          {mode === "whatsapp" ? "WhatsApp — choisir un chauffeur" : "Choisir un chauffeur"}
        </span>
      </div>
      {DRIVERS.map((d) => (
        <a
          key={d.tel}
          href={hrefFor(d)}
          {...(mode === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => setOpen(false)}
          role="menuitem"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#D4AF37]/10 transition-colors duration-200 border-b border-white/[0.04] last:border-b-0"
        >
          <span className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
            <Icon size={14} color="#D4AF37" style={{ color: "#D4AF37" }} />
          </span>
          <span className="flex flex-col text-left">
            <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#E5E5E5" }}>
              {d.name}
            </span>
            <span className="text-sm font-light" style={{ color: "#ffffff" }}>{d.display}</span>
          </span>
        </a>
      ))}
    </div>
  );

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={className}
        style={style}
      >
        {trigger}
      </button>

      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}

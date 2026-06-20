"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

// Drapeau + nom de la langue DANS sa propre langue (jamais traduit).
const LANGS = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
] as const;

/**
 * Sélecteur de langue. Conserve la page courante et bascule uniquement la
 * langue (ex. /cgv → /en/cgv) via le routing locale-aware de next-intl.
 *
 * - variant="desktop" : bouton compact + menu déroulant
 * - variant="mobile"  : liste pleine largeur (dans le menu mobile)
 */
export default function LanguageSwitcher({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  const switchTo = (code: string) => {
    setOpen(false);
    if (code === locale) return;
    // `pathname` est sans préfixe de langue ; next-intl ajoute le bon préfixe.
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // ── Mobile : liste de toutes les langues, déployée ──
  if (variant === "mobile") {
    return (
      <div className="flex flex-wrap gap-2" aria-busy={isPending}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => switchTo(l.code)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-light border transition-colors duration-300 ${
              l.code === locale
                ? "border-[#D4AF37]/60 text-white"
                : "border-white/[0.08] text-[#A1A1AA] hover:border-[#D4AF37]/30 hover:text-white"
            }`}
          >
            <span className="text-base leading-none">{l.flag}</span>
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  // ── Desktop : bouton compact + menu déroulant ──
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-busy={isPending}
        className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-light tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70"
        style={{ color: "var(--nav-link-color, #A1A1AA)" }}
      >
        <Globe size={13} className="text-[#D4AF37]" />
        <span className="text-sm leading-none">{current.flag}</span>
        <span>{current.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[190px] z-[120] bg-[#0c0c0c]/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-2xl shadow-black/60"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitem"
              onClick={() => switchTo(l.code)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#D4AF37]/10 transition-colors duration-200 border-b border-white/[0.04] last:border-b-0"
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span
                className="flex-1 text-left text-sm font-light"
                style={{ color: l.code === locale ? "#ffffff" : "#A1A1AA" }}
              >
                {l.label}
              </span>
              {l.code === locale && <Check size={13} className="text-[#D4AF37]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

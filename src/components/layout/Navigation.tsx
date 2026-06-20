"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Menu, X } from "lucide-react";
import { engine } from "@/lib/engine";
import ContactChoice from "@/components/ui/ContactChoice";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";

const links = [
  { key: "services", href: "#services"    },
  { key: "fleet",    href: "#vehicules"   },
  { key: "tourism",  href: "#tourisme"    },
  { key: "quote",    href: "#calculateur" },
  { key: "contact",  href: "#contact"     },
] as const;

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname(); // sans préfixe de langue ; "/" sur l'accueil

  // Hors page d'accueil, les ancres (#section) doivent renvoyer vers l'accueil
  // DE LA LANGUE COURANTE puis scroller (scroll géré par SmoothScroll au
  // chargement). Sur l'accueil, on garde l'ancre directe (smooth scroll Lenis).
  const prefix = locale === "fr" ? "" : `/${locale}`;
  const anchorHref = (href: string) => {
    if (pathname === "/") return href;
    const homePath = prefix === "" ? "/" : prefix;
    return `${homePath}${href}`;
  };

  const navRef  = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    // Cache theme-driven colours; refresh only when the circuit theme changes
    // (rare) instead of calling getComputedStyle on every scroll frame.
    let bgRgb   = getComputedStyle(root).getPropertyValue("--theme-bg-rgb").trim() || "5,5,5";
    let navText = getComputedStyle(root).getPropertyValue("--theme-nav-link").trim() || "#A1A1AA";
    const obs = new MutationObserver(() => {
      bgRgb   = getComputedStyle(root).getPropertyValue("--theme-bg-rgb").trim() || "5,5,5";
      navText = getComputedStyle(root).getPropertyValue("--theme-nav-link").trim() || "#A1A1AA";
      // Re-apply if currently scrolled so the nav re-tints to the new theme
      if (lastScrolled && navRef.current) {
        navRef.current.style.background = `rgba(${bgRgb},0.95)`;
        navRef.current.style.setProperty("--nav-link-color", navText);
      }
    });
    obs.observe(root, { attributes: true, attributeFilter: ["style"] });

    let lastScrolled: boolean | null = null;
    let lastLs = -1;

    const unsub = engine.subscribe(({ y, p }) => {
      if (!navRef.current) return;

      // Nav darkens on scroll — only touch the DOM when the state flips
      const scrolled = y > 40;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        const n = navRef.current;
        n.style.background    = scrolled ? `rgba(${bgRgb},0.95)` : "transparent";
        n.style.backdropFilter = scrolled ? "blur(12px)" : "none";
        n.style.borderBottom  = scrolled ? "1px solid rgba(128,128,128,0.12)" : "1px solid transparent";
        n.style.setProperty("--nav-link-color", scrolled ? navText : "#A1A1AA");
        if (dotRef.current) dotRef.current.style.opacity = scrolled ? "1" : "0.5";
      }

      // Logo letter-spacing compresses slightly — quantized to avoid
      // re-laying-out the logo text on every single frame.
      if (logoRef.current) {
        const ls = Math.round((0.35 - p * 0.15) * 100) / 100;
        if (ls !== lastLs) {
          lastLs = ls;
          logoRef.current.style.letterSpacing = `${ls}em`;
        }
      }
    });
    return () => { unsub(); obs.disconnect(); };
  }, []);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[90] transition-all duration-500 px-1"
        style={{ background: "transparent", borderBottom: "1px solid transparent" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div ref={dotRef} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] transition-opacity duration-300" style={{ opacity: 0.5 }} />
            <span ref={logoRef} className="text-[11px] font-light uppercase transition-all duration-300"
              style={{ letterSpacing: "0.35em", fontFamily: "var(--font-serif)", color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Azur Prestige
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={anchorHref(l.href)}
                className="text-[11px] font-light uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-70"
                style={{ color: "var(--nav-link-color, #A1A1AA)" }}>
                {t(l.key)}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LanguageSwitcher variant="desktop" />
            </div>
            <ContactChoice
              mode="call"
              align="right"
              wrapperClassName="hidden lg:block relative"
              className="flex items-center gap-2 border border-[#D4AF37]/40 px-5 py-2.5 text-[11px] font-light tracking-[0.18em] uppercase hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] transition-all duration-300"
              style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              trigger={<><Phone size={12} /> {t("call")}</>}
            />
            <Link href="/reservation"
              className="hidden lg:flex items-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-white transition-all duration-300"
              style={{ color: "#050505" }}>
              {t("book")}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#8A8A8A] hover:text-white transition-colors duration-300">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[85] bg-transparent backdrop-blur-sm flex flex-col justify-center px-8 transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="space-y-6">
          {links.map((l) => (
            <a key={l.href} href={anchorHref(l.href)} onClick={() => setMenuOpen(false)}
              className="block text-[#A1A1AA] text-3xl font-light hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-serif)" }}>
              {t(l.key)}
            </a>
          ))}
        </div>
        <Link href="/reservation" onClick={() => setMenuOpen(false)}
          className="mt-8 block text-center bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-white transition-colors">
          {t("bookOnline")}
        </Link>
        <ContactChoice
          mode="call"
          align="left"
          wrapperClassName="mt-4 relative"
          className="flex items-center gap-3 text-[#D4AF37]"
          trigger={<><Phone size={16} /> <span className="text-sm font-light tracking-[0.2em]">{t("callDriver")}</span></>}
        />

        {/* Language selector — mobile */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="text-[#707070] text-[10px] tracking-[0.3em] uppercase font-light mb-3">{t("language")}</div>
          <LanguageSwitcher variant="mobile" />
        </div>
      </div>

      {/* Fixed phone button mobile */}
      <ContactChoice
        mode="call"
        align="right"
        direction="up"
        wrapperClassName="fixed bottom-6 right-6 z-[80] lg:hidden"
        className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
        trigger={<Phone size={18} className="text-[#050505]" />}
      />
    </>
  );
}

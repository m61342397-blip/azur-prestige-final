"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Scroll vers la section ciblée quand on arrive sur la home avec un #hash
  // (ex. clic sur un lien du Footer depuis /mentions-legales → /#tourisme).
  // Fonctionne avec Lenis (desktop) comme en scroll natif (mobile), et
  // re-tente une fois pour absorber les décalages de mise en page tardifs.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    let cancelled = false;
    const scrollToHash = () => {
      if (cancelled) return;
      let el: Element | null = null;
      try { el = document.querySelector(hash); } catch { return; }
      if (!el) return;
      const lenis = (window as unknown as Record<string, { scrollTo: (t: Element, o: object) => void } | undefined>).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    const t1 = setTimeout(scrollToHash, 250);
    const t2 = setTimeout(scrollToHash, 800);
    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    // Mobile + reduced-motion: skip Lenis entirely. Native scrolling is
    // lighter and avoids per-frame JS work on every touch-scroll frame.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // easeOutExpo — long, soft deceleration for a premium glide
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    (window as unknown as Record<string, unknown>).__lenis = lenis;

    let raf: number;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    // Anchor smooth scroll
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.6 });
    };
    document.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <>{children}</>;
}

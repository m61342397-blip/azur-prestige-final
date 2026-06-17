"use client";

import { useEffect, useRef } from "react";
import { engine, Engine } from "@/lib/engine";

const steps = [
  { n: "01", title: "Réservation",     x: 60,  y: 70  },
  { n: "02", title: "Confirmation",    x: 260, y: 175 },
  { n: "03", title: "Prise en charge", x: 460, y: 70  },
  { n: "04", title: "Arrivée",         x: 660, y: 175 },
];

const PATH = "M60,70 C160,70 160,175 260,175 C360,175 360,70 460,70 C560,70 560,175 660,175";

export default function Process() {
  const secRef   = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const drawRef  = useRef<HTMLDivElement>(null);
  const pathRef  = useRef<SVGPathElement>(null);
  const dotsRef  = useRef<SVGCircleElement[]>([]);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const pathLen  = useRef(0);

  useEffect(() => {
    if (pathRef.current) {
      pathLen.current = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray  = String(pathLen.current);
      pathRef.current.style.strokeDashoffset = String(pathLen.current);
    }

    const unsub = engine.subscribe(() => {
      if (!secRef.current) return;
      const vh = window.innerHeight;

      // Heading — standard reveal
      if (headRef.current) {
        const hp = Engine.ease(Engine.elVisible(headRef.current, 1.05, 0.5));
        headRef.current.style.opacity   = String(hp);
        headRef.current.style.transform = `translateY(${(1 - hp) * 40}px)`;
      }

      // Draw progress — anchored to the curve travelling UP through the
      // viewport, so the line draws while it is actually in front of the user.
      // Tight range: starts when the curve is ~80% down the screen, completes
      // by the time it reaches ~42% (upper-middle, still well in view).
      // 0 → curve at 80% height = line empty ; 1 → curve at 42% = fully drawn.
      const anchor = drawRef.current;
      if (!anchor) return;
      const top  = anchor.getBoundingClientRect().top;
      const draw = Engine.clamp((vh * 0.80 - top) / (vh * 0.38), 0, 1);

      // SVG path draws from dashoffset = full length → 0
      if (pathRef.current && pathLen.current) {
        pathRef.current.style.strokeDashoffset = String(pathLen.current * (1 - draw));
      }

      // Dots + labels appear as the line reaches each one along the curve
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const f  = (steps[i].x - 60) / 600;                       // 0→1 along curve
        const dp = Engine.ease(Engine.clamp((draw - f * 0.8) / 0.12, 0, 1));
        dot.style.opacity         = String(dp);
        dot.style.transformOrigin = `${steps[i].x}px ${steps[i].y}px`;
        dot.style.transform       = `scale(${dp})`;
      });

      stepsRef.current.forEach((s, i) => {
        if (!s) return;
        const f  = (steps[i].x - 60) / 600;
        const lp = Engine.ease(Engine.clamp((draw - (f * 0.8 + 0.04)) / 0.14, 0, 1));
        s.style.opacity   = String(lp);
        s.style.transform = `translateY(${(1 - lp) * 10}px)`;
      });
    });
    return unsub;
  }, []);

  return (
    <section ref={secRef} className="py-24 lg:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={headRef} className="mb-16" style={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-px bg-[#D4AF37]" /><span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Comment ça marche</span></div>
          <h2 className="font-light leading-tight text-white" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,5rem)" }}>
            Simple,<br /><span className="text-[#A1A1AA]">rapide, fiable.</span>
          </h2>
        </div>

        {/* Desktop SVG — width capped to the viewBox box so the %-positioned
            labels share the exact coordinate space as the curve points. */}
        <div ref={drawRef} className="hidden lg:block relative mb-4 mx-auto max-w-[720px]" style={{ height: "260px" }}>
          <svg viewBox="0 0 720 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path d={PATH} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <path ref={pathRef} d={PATH} fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
            {steps.map((s, i) => (
              <circle key={i} ref={el => { if (el) dotsRef.current[i] = el; }}
                cx={s.x} cy={s.y} r={5} fill="#D4AF37" style={{ opacity: 1 }} />
            ))}
          </svg>
          {steps.map((s, i) => (
            // Outer wrapper = static positioning anchored ON the dot, with a
            // small gap above (top points) or below (bottom points).
            <div key={i} className="absolute"
              style={{
                left: `${(s.x / 720) * 100}%`,
                top:  `${(s.y / 260) * 100}%`,
                transform: s.y < 130 ? "translate(-50%, calc(-100% - 10px))" : "translate(-50%, 10px)",
              }}>
              {/* Inner = engine-driven reveal (opacity + small lift) */}
              <div ref={el => { if (el) stepsRef.current[i] = el; }}
                className="text-center whitespace-nowrap" style={{ opacity: 0 }}>
                <div className="text-[9px] tracking-[0.3em] uppercase font-light mb-1" style={{ color: "#D4AF37" }}>{s.n}</div>
                <div className="text-sm font-light" style={{ color: "var(--text-primary)" }}>{s.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="lg:hidden space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-5" style={{ opacity: 1 }}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center text-xs font-light shrink-0"
                  style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>{s.n}</div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-2" />}
              </div>
              <div className="pt-1 pb-8 flex items-center">
                <h3 className="font-light" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

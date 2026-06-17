/**
 * SCROLL ENGINE — Single source of truth for all animations.
 * One RAF. Every section subscribes. Nothing else needed.
 */

type Subscriber = (state: ScrollState) => void;

export interface ScrollState {
  y: number;
  p: number;
  v: number;
  vh: number;
  max: number;
}

class Engine {
  private subs = new Set<Subscriber>();
  private raf = 0;
  private lastY = 0;
  private state: ScrollState = { y: 0, p: 0, v: 0, vh: 0, max: 0 };

  subscribe(fn: Subscriber): () => void {
    this.subs.add(fn);
    if (this.subs.size === 1) this.start();
    fn(this.state);
    return () => {
      this.subs.delete(fn);
      if (this.subs.size === 0) this.stop();
    };
  }

  private loop = () => {
    const y   = window.scrollY;
    const vh  = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const p   = max > 0 ? Math.min(1, y / max) : 0;
    const v   = y - this.lastY;
    this.lastY = y;
    this.state = { y, p, v, vh, max };
    this.subs.forEach(fn => fn(this.state));
    this.raf = requestAnimationFrame(this.loop);
  };

  private start() { this.raf = requestAnimationFrame(this.loop); }
  private stop()  { cancelAnimationFrame(this.raf); }

  /** Element progress [0→1]. 0 = bottom enters viewport, 1 = top exits */
  static el(el: HTMLElement, enterAt = 1.0, exitAt = 0.0): number {
    const r   = el.getBoundingClientRect();
    const vh  = window.innerHeight;
    const pos = r.top / vh;
    return Math.max(0, Math.min(1, (enterAt - pos) / (enterAt - exitAt)));
  }

  /**
   * Like el() but returns 1 immediately if element is already visible on page load.
   * Use this instead of el() for all opacity/transform animations to avoid
   * elements stuck invisible when already in viewport.
   */
  static elVisible(el: HTMLElement, enterAt = 1.0, exitAt = 0.0): number {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth <= 768;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (mobile || reduced) return 1;
    }
    const r  = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // Already in viewport — return 1 immediately
    if (r.top < vh && r.bottom > 0) {
      const pos = r.top / vh;
      const raw = (enterAt - pos) / (enterAt - exitAt);
      return Math.max(0.001, Math.min(1, raw)); // Never return 0 if visible
    }
    return Engine.el(el, enterAt, exitAt);
  }

  static band(p: number, from: number, to: number): number {
    return Math.max(0, Math.min(1, (p - from) / (to - from)));
  }

  /**
   * Reveal easing — easeOutQuint. Content travels most of its distance
   * early, then settles softly into place, giving scroll reveals a calm,
   * premium "arrive and rest" feel rather than a linear mid-glide.
   */
  static ease(t: number): number {
    return 1 - Math.pow(1 - t, 5);
  }

  static clamp(v: number, min = 0, max = 1): number {
    return Math.min(max, Math.max(min, v));
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}

export const engine = new Engine();
export { Engine };

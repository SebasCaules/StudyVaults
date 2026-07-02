"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "@studyvaults/ui";

// Islas cliente chicas de la landing: contador animado + chip de búsqueda.
// El grueso del hero es server-render; esto son sólo los pedazos interactivos.

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NF = new Intl.NumberFormat("es-AR");

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * CountUp — anima 0 → `to` con easing al entrar en viewport. El SSR (y el
 * primer render) muestran el valor final para no-JS/SEO; recién antes del
 * primer paint arrancamos en 0 (sin flash). Respeta prefers-reduced-motion.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1500,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);
  const started = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!prefersReduced()) setVal(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || started.current) continue;
          started.current = true;
          io.disconnect();
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(step);
            else setVal(to);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {NF.format(val)}
      {suffix}
    </span>
  );
}

/** Chip de búsqueda del hero: dispara el modal global de búsqueda (⌘K). */
export function SearchCTA({ total }: { total: number }) {
  const open = () => {
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("sv:search-open"));
  };
  return (
    <button
      type="button"
      className="hero-search"
      onClick={open}
      aria-label={`Buscar en ${NF.format(total)} páginas`}
    >
      <Icon name="search" size={16} />
      <span className="hero-search__label">
        Buscar en <b>{NF.format(total)}</b> páginas
      </span>
      <kbd className="hero-search__kbd">⌘K</kbd>
    </button>
  );
}

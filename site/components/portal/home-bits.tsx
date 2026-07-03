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

  // Pre-paint: arrancamos en 0 para que el conteo se vea desde el principio,
  // sin flash del valor final (el SSR ya renderizó `to` para no-JS/SEO).
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

    // Lanza el conteo una sola vez. Es idempotente (guard `started`), así que
    // aunque el efecto corra dos veces (StrictMode) el número igual llega a `to`.
    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(step);
        else setVal(to);
      };
      requestAnimationFrame(step);
    };

    // Sin IntersectionObserver: contá ya (no dejar el número pegado en 0).
    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    // Si el elemento YA está en viewport al cargar, el callback inicial del IO
    // puede no dispararse de forma fiable (dependía de un threshold alto) → lo
    // chequeamos a mano y arrancamos de inmediato. Este era el origen del bug
    // "se queda en 0": el stat visible al cargar nunca recibía el disparo.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      run();
      return;
    }

    // Está por debajo del fold: contá cuando entre (threshold 0 = cualquier píxel).
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
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

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// useLayoutEffect avisa en SSR; en el prerender (sin window) cae a useEffect.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Breakpoint (max-width, px) bajo el cual cada riel pasa a modo drawer
// off-canvas. Debe coincidir con los media queries de globals.css: el
// izquierdo (nav) a 860px, el derecho (TOC) a 1100px (mismo rango en el
// que `.rail--right` ya salía de la grilla antes de este fix).
const DRAWER_BREAKPOINT: Record<"left" | "right", number> = {
  left: 860,
  right: 1100,
};

// Bloqueo de scroll del body con conteo de referencias: ambos rieles
// (izq/der) pueden estar abiertos como drawer al mismo tiempo, cada uno
// con su propio effect, así que no alcanza con "desbloquear" a ciegas en
// el cleanup de uno — solo se libera cuando el último drawer se cierra.
let scrollLockCount = 0;
function lockBodyScroll() {
  scrollLockCount += 1;
  document.body.style.overflow = "hidden";
}
function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = "";
}

// Riel lateral pegado al borde, colapsable. Persiste estado en localStorage.
// En pantallas angostas cada riel es un drawer off-canvas (izquierdo <860px,
// derecho/TOC <1100px): scrim + bloqueo de scroll + cierre con Escape o tap
// afuera. `data-mounted` evita el flash del drawer abierto en SSR.
export default function WikiRail({
  side,
  storageKey,
  label,
  children,
}: {
  side: "left" | "right";
  storageKey: string;
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollId = useRef(`wiki-rail-${side}`).current;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollKey = `${storageKey}-scroll`;
  const rafPending = useRef(false);

  // Restaurar la posición de scroll del riel ANTES del paint (sin salto). El
  // riel se re-monta en cada navegación; sessionStorage la conserva por pestaña.
  useIsoLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      const y = sessionStorage.getItem(scrollKey);
      if (y != null) el.scrollTop = parseInt(y, 10) || 0;
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar la posición mientras se scrollea (throttle con rAF).
  const onScroll = () => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const el = scrollRef.current;
      if (!el) return;
      try {
        sessionStorage.setItem(scrollKey, String(el.scrollTop));
      } catch {}
    });
  };

  // Restaurar el colapso ANTES del paint (mismo motivo que el scroll arriba):
  // el riel se re-monta en cada navegación y por defecto abre; sin esto, un
  // riel colapsado por el usuario se ve un instante abierto y luego salta.
  useIsoLayoutEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem(storageKey);
      if (s !== null) setOpen(s === "1");
      else if (window.innerWidth <= DRAWER_BREAKPOINT[side]) setOpen(false);
    } catch {}
  }, [storageKey, side]);

  // En modo drawer abrir/cerrar es transitorio (navegar por el menú en el
  // teléfono): no se persiste, así un cierre de drawer no deja el riel
  // colapsado en la próxima visita desktop.
  const isDrawer = () =>
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${DRAWER_BREAKPOINT[side]}px)`).matches;

  const toggle = () => {
    const persist = !isDrawer();
    setOpen((v) => {
      const nv = !v;
      if (persist) {
        try {
          localStorage.setItem(storageKey, nv ? "1" : "0");
        } catch {}
      }
      return nv;
    });
  };

  // drawer (izq <860px, der/TOC <1100px): bloquear scroll del body + cerrar
  // con Escape mientras esté abierto. El lock cuenta referencias porque los
  // dos rieles pueden ser drawer a la vez (ver lockBodyScroll arriba). Se
  // escucha el media query para soltar/retomar el lock si el viewport cruza
  // el breakpoint con el riel abierto (antes quedaba el body bloqueado).
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(`(max-width: ${DRAWER_BREAKPOINT[side]}px)`);
    let locked = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
    };
    const sync = () => {
      if (mq.matches && !locked) {
        lockBodyScroll();
        document.addEventListener("keydown", onKey);
        locked = true;
      } else if (!mq.matches && locked) {
        unlockBodyScroll();
        document.removeEventListener("keydown", onKey);
        locked = false;
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      if (locked) {
        unlockBodyScroll();
        document.removeEventListener("keydown", onKey);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side]);

  return (
    <>
      {open && mounted && (
        <div
          className={`rail__scrim rail__scrim--${side}`}
          aria-hidden="true"
          onClick={toggle}
        />
      )}
      <aside
        className={`rail rail--${side}${open ? "" : " is-collapsed"}`}
        data-mounted={mounted ? "" : undefined}
      >
        <button
          className={`rail__toggle rail__toggle--${side}`}
          type="button"
          aria-expanded={open}
          aria-controls={scrollId}
          aria-label={open ? `Plegar ${label}` : `Expandir ${label}`}
          onClick={toggle}
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.6"
          >
            <path
              d={side === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="rail__toggle-label">{label}</span>
        </button>
        <div
          className="rail__scroll"
          id={scrollId}
          ref={scrollRef}
          onScroll={onScroll}
        >
          {children}
        </div>
      </aside>
    </>
  );
}

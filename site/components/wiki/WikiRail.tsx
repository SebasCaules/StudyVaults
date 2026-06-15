"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Riel lateral pegado al borde, colapsable. Persiste estado en localStorage.
// En mobile el riel izquierdo es un drawer: scrim + bloqueo de scroll + cierre
// con Escape o tap afuera. `data-mounted` evita el flash del drawer abierto en SSR.
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

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem(storageKey);
      if (s !== null) setOpen(s === "1");
      else if (side === "left" && window.innerWidth <= 860) setOpen(false);
    } catch {}
  }, [storageKey, side]);

  const toggle = () => {
    setOpen((v) => {
      const nv = !v;
      try {
        localStorage.setItem(storageKey, nv ? "1" : "0");
      } catch {}
      return nv;
    });
  };

  // mobile: bloquear scroll del body + cerrar con Escape cuando el drawer está abierto
  useEffect(() => {
    if (side !== "left" || !open) return;
    const mq = window.matchMedia("(max-width: 860px)");
    if (!mq.matches) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side]);

  return (
    <>
      {side === "left" && open && mounted && (
        <div className="rail__scrim" aria-hidden="true" onClick={toggle} />
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
        <div className="rail__scroll" id={scrollId}>
          {children}
        </div>
      </aside>
    </>
  );
}

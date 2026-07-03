"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Navegación por teclado entre notas: ← va a la anterior, → a la siguiente
 * (mismos destinos que las cards de `WikiSequenceNav`, derivados del árbol del
 * sidebar). No renderiza nada — sólo instala un listener global.
 *
 * Accesibilidad / no molestar: ignora el atajo si hay modificadores, si el foco
 * está en un campo editable (input/textarea/select/contenteditable) o si hay un
 * diálogo/modal abierto (p. ej. la búsqueda). Static-export safe: el acceso a
 * `document`/`window` vive dentro del effect (sólo cliente).
 */
export default function WikiKeyboardNav({
  prevHref,
  nextHref,
}: {
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!prevHref && !nextHref) return;

    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const active = document.activeElement as HTMLElement | null;
      if (active) {
        const tag = active.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (active.isContentEditable) return;
      }
      // No secuestrar las flechas si hay un modal/diálogo abierto.
      if (document.querySelector('[aria-modal="true"], [role="dialog"]')) return;

      const href = e.key === "ArrowLeft" ? prevHref : nextHref;
      if (!href) return;
      e.preventDefault();
      router.push(href);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router]);

  return null;
}

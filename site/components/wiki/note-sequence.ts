import type { NavSection } from "@/lib/content/nav-tree";

export interface SeqItem {
  title: string;
  href: string;
}

export interface NoteSequence {
  /** Etiqueta de la sección (unidad) que contiene la nota actual. */
  sectionLabel: string;
  /** Posición 1-based de la nota dentro de su sección. */
  position: number;
  /** Cantidad total de notas de la sección. */
  total: number;
  /** Nota anterior dentro de la sección (null si es la primera). */
  prev: SeqItem | null;
  /** Nota siguiente dentro de la sección (null si es la última). */
  next: SeqItem | null;
}

/**
 * Deriva la navegación secuencial prev/next de una nota a partir del MISMO
 * árbol que consume el sidebar (`buildNav`), acotada a la sección (unidad) que
 * la contiene.
 *
 * `NavSection.items` ya es la lista ordenada de páginas de la sección, y su
 * orden coincide 1:1 con el que pinta `Sidebar.tsx` para las secciones sin
 * grupos (la enorme mayoría). En la única sección con `groups` (Evaluaciones)
 * los grupos son vistas ancladas (`#id`) de esas mismas páginas, así que
 * `items` sigue siendo la lista canónica de páginas navegables —usarla evita
 * contar dos veces una nota que aparece como página y como ejercicios.
 *
 * Devuelve null si la nota no figura en ninguna sección (no debería ocurrir
 * con notas reales; el llamador simplemente no renderiza la navegación).
 */
export function buildNoteSequence(
  sections: NavSection[],
  currentHref: string,
): NoteSequence | null {
  for (const s of sections) {
    const i = s.items.findIndex((it) => it.href === currentHref);
    if (i === -1) continue;
    return {
      sectionLabel: s.label,
      position: i + 1,
      total: s.items.length,
      prev: i > 0 ? s.items[i - 1] : null,
      next: i < s.items.length - 1 ? s.items[i + 1] : null,
    };
  }
  return null;
}

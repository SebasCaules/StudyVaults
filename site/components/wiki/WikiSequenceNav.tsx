import Link from "next/link";
import type { NavSection } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";
import { buildNoteSequence } from "./note-sequence";
import WikiKeyboardNav from "./WikiKeyboardNav";

// Chevron reutilizable (izq/der). Estático, sin dependencias.
function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="wnav__chevron"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Navegación secuencial prev/next al pie de una nota. Deriva el orden del
 * mismo árbol del sidebar (`buildNav` → NavSection.items) y se acota a la
 * sección que contiene la nota, con un indicador "X de N". En los bordes de la
 * sección ese lado pasa a un estado vacío que enlaza al índice de la materia,
 * sin romper la grilla de dos columnas.
 *
 * Server component: sólo `<Link>` reales + `aria-label`, sin JS de cliente.
 * El drawer del índice en mobile lo resuelve `WikiRail` (rail izquierdo).
 */
export default function WikiSequenceNav({
  vault,
  sections,
  currentHref,
}: {
  vault: string;
  sections: NavSection[];
  currentHref: string;
}) {
  const seq = buildNoteSequence(sections, currentHref);
  // Sin secuencia útil (nota fuera del árbol o sección de una sola nota): nada.
  if (!seq || seq.total <= 1) return null;

  const en = getVault(vault)?.lang === "en";
  const indexHref = `/${vault}/`;
  const pct = Math.round((seq.position / seq.total) * 100);

  const t = en
    ? {
        progress: `In this section · ${seq.position} of ${seq.total}`,
        prev: "Previous",
        next: "Next",
        startEyebrow: "Start of section",
        endEyebrow: "End of section",
        toIndex: "Back to index",
        aria: "Note navigation",
        prevAria: (title: string) => `Previous note: ${title}`,
        nextAria: (title: string) => `Next note: ${title}`,
        indexAria: "Back to subject index",
        kbdHint: "to move",
      }
    : {
        progress: `En esta sección · ${seq.position} de ${seq.total}`,
        prev: "Anterior",
        next: "Siguiente",
        startEyebrow: "Inicio de la sección",
        endEyebrow: "Fin de la sección",
        toIndex: "Volver al índice",
        aria: "Navegación entre notas",
        prevAria: (title: string) => `Nota anterior: ${title}`,
        nextAria: (title: string) => `Nota siguiente: ${title}`,
        indexAria: "Volver al índice de la materia",
        kbdHint: "para moverte",
      };

  return (
    <nav className="wnav" aria-label={t.aria}>
      <WikiKeyboardNav
        prevHref={seq.prev?.href ?? null}
        nextHref={seq.next?.href ?? null}
      />
      <p className="wnav__progress">
        <span>{t.progress}</span>
        <span className="wnav__progress-track" aria-hidden="true">
          <span className="wnav__progress-fill" style={{ width: `${pct}%` }} />
        </span>
        {(seq.prev || seq.next) && (
          <span className="wnav__kbd-hint">
            <kbd className="wnav__kbd">←</kbd>
            <kbd className="wnav__kbd">→</kbd>
            {t.kbdHint}
          </span>
        )}
      </p>

      <div className="wnav__grid">
        {seq.prev ? (
          <Link
            className="wnav__card wnav__card--prev"
            href={seq.prev.href}
            aria-label={t.prevAria(seq.prev.title)}
          >
            <span className="wnav__eyebrow">
              <Chevron dir="left" />
              {t.prev}
            </span>
            <span className="wnav__title">{seq.prev.title}</span>
          </Link>
        ) : (
          <Link
            className="wnav__card wnav__card--prev wnav__card--empty"
            href={indexHref}
            aria-label={t.indexAria}
          >
            <span className="wnav__eyebrow">
              <Chevron dir="left" />
              {t.startEyebrow}
            </span>
            <span className="wnav__title">{t.toIndex}</span>
          </Link>
        )}

        {seq.next ? (
          <Link
            className="wnav__card wnav__card--next"
            href={seq.next.href}
            aria-label={t.nextAria(seq.next.title)}
          >
            <span className="wnav__eyebrow">
              <Chevron dir="right" />
              {t.next}
            </span>
            <span className="wnav__title">{seq.next.title}</span>
          </Link>
        ) : (
          <Link
            className="wnav__card wnav__card--next wnav__card--empty"
            href={indexHref}
            aria-label={t.indexAria}
          >
            <span className="wnav__eyebrow">
              <Chevron dir="right" />
              {t.endEyebrow}
            </span>
            <span className="wnav__title">{t.toIndex}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

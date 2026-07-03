"use client";

import ToolkitShell, { type Tool } from "./ToolkitShell";
import PracticeBank from "./derecho/PracticeBank";
import Flashcards from "./derecho/Flashcards";
import ConceptBrowser from "./derecho/ConceptBrowser";
import Repaso1er from "./derecho/Repaso1er";
import Repetidas from "./derecho/Repetidas";
import { BANK_1ER, BANK_2DO, TEORIA_2DO } from "./derecho/data";

/* ──────────────────────────────────────────────────────────────────────────
   Derecho para Ingenieros — toolkit unificado de estudio.
   Concentra en una sola herramienta lo que antes vivía en tres apps HTML
   sueltas del 2.º parcial (estudio interactivo, quiz y preguntas repetidas) y
   suma un repaso completo + flashcards para el 1.º parcial. Datos puros en
   ./derecho/data.ts (generado de los originales del vault).
   ────────────────────────────────────────────────────────────────────────── */

/* Afiches bespoke del runner (micro-ilustraciones tinteadas por --k-color). */

/** Frontón con columnas: toda la teoría, ordenada por unidad. */
const PosterLaw = (
  <svg viewBox="0 0 288 150" fill="none">
    <path d="M144 26 L64 48 H224 Z" fill="color-mix(in srgb, var(--k-color) 12%, transparent)" stroke="var(--k-color)" strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M60 48 H228" stroke="var(--k-color)" strokeWidth={2.4} strokeLinecap="round" />
    <g stroke="var(--border)" strokeWidth={2.2} strokeLinecap="round">
      <path d="M80 58 V112 M110 58 V112 M140 58 V112 M170 58 V112 M200 58 V112" />
    </g>
    <path d="M62 116 H218" stroke="var(--k-color)" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M54 126 H226" stroke="var(--border)" strokeWidth={1.6} strokeLinecap="round" />
    <text x="56" y="142" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>teoría · por unidad</text>
  </svg>
);

/** Diana con flecha: práctica con corrección al instante. */
const PosterTarget = (
  <svg viewBox="0 0 288 150" fill="none">
    <circle cx="158" cy="72" r="44" stroke="var(--border)" strokeWidth={1.6} />
    <circle cx="158" cy="72" r="29" stroke="var(--k-color)" strokeWidth={1.8} opacity={0.75} />
    <circle cx="158" cy="72" r="14" fill="color-mix(in srgb, var(--k-color) 16%, transparent)" stroke="var(--k-color)" strokeWidth={1.8} />
    <circle cx="158" cy="72" r="4" fill="var(--k-color)" />
    <path d="M66 36 L150 68" stroke="var(--k-color)" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M138 58 L152 69 L137 72" stroke="var(--k-color)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const tools: Tool[] = [
  {
    key: "repaso1",
    label: "Repaso completo",
    group: "1.º parcial",
    icon: "book",
    tone: "def",
    verb: "Repasar",
    desc: "Toda la teoría del 1.º parcial ordenada por unidad: conceptos críticos, definiciones y errores típicos en una sola página.",
    poster: PosterLaw,
    node: <Repaso1er />,
  },
  {
    key: "flash1",
    label: "Flashcards",
    group: "1.º parcial",
    icon: "cards",
    tone: "def",
    verb: "Repasar",
    desc: "Tarjetas de recuerdo activo del 1.º parcial: leé la pregunta, intentá responder y girá la tarjeta para verificar.",
    node: <Flashcards cards={BANK_1ER} units={[1, 2, 3, 4, 5, 0]} />,
  },
  {
    key: "practica2",
    label: "Banco de práctica",
    group: "2.º parcial",
    icon: "target",
    tone: "method",
    verb: "Practicar",
    desc: "Preguntas de práctica del 2.º parcial con corrección al instante y filtro por unidad para medir cómo vas.",
    poster: PosterTarget,
    node: <PracticeBank bank={BANK_2DO} storageKey="derecho-practica-2do" units={[6, 7, 8, 9, 0]} />,
  },
  {
    key: "conceptos2",
    label: "Conceptos por unidad",
    group: "2.º parcial",
    icon: "list",
    tone: "method",
    verb: "Explorar",
    desc: "La teoría del 2.º parcial explicada concepto por concepto y agrupada por unidad para estudiar de cero.",
    node: <ConceptBrowser blocks={TEORIA_2DO} />,
  },
  {
    key: "repetidas2",
    label: "Preguntas repetidas",
    group: "2.º parcial",
    icon: "repeat",
    tone: "method",
    verb: "Ver",
    desc: "Las preguntas que más caen en los parciales, con su respuesta: enfocá el estudio en lo que de verdad toman.",
    node: <Repetidas />,
  },
];

export default function DerechoTools() {
  return (
    <ToolkitShell
      launcher={{
        code: "SYS.06",
        kicker: "Derecho para ingenieros",
        title: "Derecho",
        accent: "var(--accent)",
        pattern: "radial",
        variant: "grid",
        dek: "Todo el estudio de Derecho en un solo lugar: repaso completo y flashcards para el 1.º parcial; banco de práctica, conceptos por unidad y preguntas repetidas para el 2.º.",
        meta: (
          <>
            <span className="tk__hero-metaitem">
              <b>5</b> herramientas
            </span>
            <span className="tk__hero-metaitem">
              <b>2</b> parciales
            </span>
            <span className="tk__hero-metaitem">/derecho/herramientas</span>
          </>
        ),
        motif: (
          <svg viewBox="0 0 320 200" fill="none">
            <path d="M160 44 V150" stroke="var(--border)" strokeWidth={2.5} strokeLinecap="round" />
            <path d="M120 158 H200" stroke="var(--border)" strokeWidth={2.5} strokeLinecap="round" />
            <path d="M84 62 H236" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx="160" cy="62" r="4" fill="var(--accent)" />
            <path d="M84 62 L68 104 M84 62 L100 104" stroke="var(--border)" strokeWidth={1.4} />
            <path d="M236 62 L220 104 M236 62 L252 104" stroke="var(--border)" strokeWidth={1.4} />
            <path d="M62 104 A26 15 0 0 0 106 104" fill="color-mix(in srgb, var(--link) 14%, transparent)" stroke="var(--link)" strokeWidth={1.6} />
            <path d="M214 104 A26 15 0 0 0 258 104" fill="color-mix(in srgb, var(--accent) 16%, transparent)" stroke="var(--accent)" strokeWidth={1.6} />
            <text x="150" y="182" fill="var(--text-secondary)" fontSize={11} style={{ fontFamily: "var(--font-mono)" }}>
              lex
            </text>
          </svg>
        ),
      }}
      tools={tools}
    />
  );
}

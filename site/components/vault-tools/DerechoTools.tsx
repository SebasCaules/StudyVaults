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

const tools: Tool[] = [
  {
    key: "repaso1",
    label: "Repaso completo",
    group: "1.º parcial",
    icon: "book",
    verb: "Repasar",
    desc: "Toda la teoría del 1.º parcial ordenada por unidad: conceptos críticos, definiciones y errores típicos en una sola página.",
    node: <Repaso1er />,
  },
  {
    key: "flash1",
    label: "Flashcards",
    group: "1.º parcial",
    icon: "cards",
    verb: "Repasar",
    desc: "Tarjetas de recuerdo activo del 1.º parcial: leé la pregunta, intentá responder y girá la tarjeta para verificar.",
    node: <Flashcards cards={BANK_1ER} units={[1, 2, 3, 4, 5, 0]} />,
  },
  {
    key: "practica2",
    label: "Banco de práctica",
    group: "2.º parcial",
    icon: "target",
    verb: "Practicar",
    desc: "Preguntas de práctica del 2.º parcial con corrección al instante y filtro por unidad para medir cómo vas.",
    node: <PracticeBank bank={BANK_2DO} storageKey="derecho-practica-2do" units={[6, 7, 8, 9, 0]} />,
  },
  {
    key: "conceptos2",
    label: "Conceptos por unidad",
    group: "2.º parcial",
    icon: "list",
    verb: "Explorar",
    desc: "La teoría del 2.º parcial explicada concepto por concepto y agrupada por unidad para estudiar de cero.",
    node: <ConceptBrowser blocks={TEORIA_2DO} />,
  },
  {
    key: "repetidas2",
    label: "Preguntas repetidas",
    group: "2.º parcial",
    icon: "repeat",
    verb: "Ver",
    desc: "Las preguntas que más caen en los parciales, con su respuesta: enfocá el estudio en lo que de verdad toman.",
    node: <Repetidas />,
  },
];

export default function DerechoTools() {
  return (
    <ToolkitShell
      intro="Todo el estudio de Derecho en un solo lugar: un repaso completo y flashcards para el 1.º parcial, y el banco de práctica, los conceptos por unidad y las preguntas repetidas del 2.º."
      tools={tools}
    />
  );
}

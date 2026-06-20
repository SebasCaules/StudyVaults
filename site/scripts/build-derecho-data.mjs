// Genera components/vault-tools/derecho/data.ts a partir de los originales del
// vault Derecho (read-only). Consolida en un único módulo TS todo el contenido
// que vivía suelto en las tres apps HTML del 2.º parcial + el material del 1.º:
//
//   2.º parcial (units 6-9):
//     · BANK_2DO   ← estudio-interactivo.html (BANK) + quiz-2do-parcial.html (DATA)
//     · TEORIA_2DO ← estudio-interactivo.html (TEORIA)
//     · REPETIDAS / REPETIDAS_FEATURES ← preguntas-repetidas-...print.html
//   1.º parcial (units 1-5):
//     · BANK_1ER   ← sesion-estudio-unidad-{1..5}.md + ...preguntas-mixtas.md (flashcards)
//     · CONCEPTS_1ER + ERRORES_1ER + CHECKLIST_1ER ← resumen-conceptos-clave.tex
//
// Determinista: no se vuelve a correr en build; se ejecuta a mano y se commitea
// el data.ts resultante.  `node scripts/build-derecho-data.mjs`

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "..");
const D2 = path.join(REPO, "Derecho", "wiki", "2doParcial");
const D1 = path.join(REPO, "Derecho", "wiki", "1erParcial");
const OUT = path.join(process.cwd(), "components", "vault-tools", "derecho", "data.ts");

const read = (p) => readFileSync(p, "utf8");

const UNIT_NAMES = {
  0: "Integradoras",
  1: "Introducción al Derecho",
  2: "Organización del Estado",
  3: "Derecho Civil",
  4: "Derecho Comercial",
  5: "Propiedad Intelectual",
  6: "Sociedades",
  7: "Contratos",
  8: "Derechos del consumidor",
  9: "Derecho laboral",
};

/* ── extracción de literales JS de los HTML ───────────────────────────── */

// Encuentra `const NAME = [ ... ]` y devuelve el literal del array respetando
// strings y escapes (bracket-matching robusto).
function extractArrayLiteral(src, name) {
  const m = src.indexOf(`const ${name} =`);
  if (m < 0) throw new Error(`no encontré const ${name}`);
  let i = src.indexOf("[", m);
  const start = i;
  let depth = 0;
  let str = null; // comilla activa
  for (; i < src.length; i++) {
    const c = src[i];
    if (str) {
      if (c === "\\") i++;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") str = c;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`array ${name} sin cierre`);
}

function evalArray(src, name) {
  const lit = extractArrayLiteral(src, name);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${lit});`)();
}

/* ── 2.º parcial: banco de preguntas (graded) ─────────────────────────── */

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

const estudio = read(path.join(D2, "estudio-interactivo.html"));
const BANK_RAW = evalArray(estudio, "BANK");
const TEORIA_RAW = evalArray(estudio, "TEORIA");
const quiz = read(path.join(D2, "quiz-2do-parcial.html"));
const DATA_RAW = evalArray(quiz, "DATA");

// Normaliza un item del BANK de estudio-interactivo.
function fromEstudio(q) {
  const base = { id: q.id, unit: q.unit, q: q.q, expl: q.expl, src: "estudio" };
  if (q.cite) base.cite = q.cite;
  if (q.topic) base.tema = q.topic;
  if (q.real || String(q.id).startsWith("real")) base.real = true;
  if (q.trap) base.trap = true;
  if (q.type === "tf") {
    return { ...base, kind: "vf", opts: ["Verdadero", "Falso"], correct: q.correct === true ? 0 : 1 };
  }
  if (q.type === "sc") {
    return { ...base, kind: "single", opts: q.opts, correct: q.correct };
  }
  if (q.type === "mc") {
    return { ...base, kind: "multi", opts: q.opts, correct: q.correct };
  }
  if (q.type === "match") {
    // Asociación → tarjeta de revelado: el enunciado lista la columna A,
    // y la respuesta muestra el mapeo correcto.
    const lines = q.items.map((it, i) => `${it} → ${q.optsB[q.correct[i]]}`);
    return {
      ...base,
      kind: "reveal",
      opts: q.optsB,
      reveal: lines,
    };
  }
  throw new Error(`tipo desconocido en estudio: ${q.type} (${q.id})`);
}

// Normaliza un item del DATA del quiz.
function fromQuiz(q) {
  const base = {
    id: `q${q.id}`,
    unit: q.unidad,
    q: q.pregunta,
    expl: q.explicacion,
    src: "quiz",
  };
  if (q.tema) base.tema = q.tema;
  if (q.trampa) base.trap = true;
  if (q.dificultad) base.dif = q.dificultad;
  if (q.tipo === "vf") {
    return { ...base, kind: "vf", opts: q.opciones, correct: q.correcta };
  }
  return { ...base, kind: "single", opts: q.opciones, correct: q.correcta };
}

const seen = new Set();
const BANK_2DO = [];
for (const q of [...BANK_RAW.map(fromEstudio), ...DATA_RAW.map(fromQuiz)]) {
  const k = norm(q.q);
  if (seen.has(k)) continue;
  seen.add(k);
  BANK_2DO.push(q);
}

// Teoría: bloques {unit, title, html}
const TEORIA_2DO = TEORIA_RAW.map((t) => ({ unit: t.unit, title: t.title, html: t.html }));

/* ── 2.º parcial: preguntas repetidas (HTML) ──────────────────────────── */

const rep = read(path.join(D2, "preguntas-repetidas-2do-parcial-print.html"));

// Features destacadas: cada <div class="feature uN"> con un <h3> + <table>.
const REPETIDAS_FEATURES = [];
{
  const re = /<div class="feature u(\d)">([\s\S]*?)<\/div>\s*(?=<div class="feature|<hr)/g;
  let m;
  while ((m = re.exec(rep))) {
    const unit = Number(m[1]);
    const inner = m[2];
    const h3 = /<h3>([\s\S]*?)<\/h3>/.exec(inner);
    const table = /<table>[\s\S]*?<\/table>/.exec(inner);
    if (!h3 || !table) continue;
    const title = h3[1].replace(/<span class="n">.*?<\/span>/g, "").replace(/\s+/g, " ").trim();
    const freqM = /<span class="n">\((.*?)\)<\/span>/.exec(h3[1]);
    REPETIDAS_FEATURES.push({
      unit,
      title,
      freq: freqM ? freqM[1] : "",
      html: table[0].trim(),
    });
  }
}

// Preguntas por unidad: <section class="uN"><h2 class="unit">Unidad N — …</h2>
// luego <div class="qa"><span class="q">…</span><span class="a">…</span></div>
const REPETIDAS = [];
{
  const secRe = /<section class="u\d">([\s\S]*?)<\/section>/g;
  let s;
  while ((s = secRe.exec(rep))) {
    const block = s[1];
    const head = /<h2 class="unit">Unidad (\d)\s*[—-]\s*([\s\S]*?)<\/h2>/.exec(block);
    if (!head) continue;
    const unit = Number(head[1]);
    const name = head[2].replace(/\s+/g, " ").trim();
    const items = [];
    const qaRe = /<div class="qa"><span class="q">([\s\S]*?)<\/span><span class="a">([\s\S]*?)<\/span><\/div>/g;
    let qa;
    while ((qa = qaRe.exec(block))) {
      let qHtml = qa[1];
      const a = qa[2].trim();
      const freqM = /<span class="freq">\((.*?)\)<\/span>/.exec(qHtml);
      const trap = /<span class="trap">/.test(qHtml);
      const q = qHtml
        .replace(/<span class="freq">.*?<\/span>/g, "")
        .replace(/<span class="trap">.*?<\/span>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      items.push({ q, a, freq: freqM ? freqM[1] : "", trap });
    }
    if (items.length) REPETIDAS.push({ unit, name, items });
  }
}

/* ── 1.º parcial: flashcards desde las sesiones .md ───────────────────── */

const SESSIONS = [
  ["sesion-estudio-unidad-1.md", 1],
  ["sesion-estudio-unidad-2.md", 2],
  ["sesion-estudio-unidad-3.md", 3],
  ["sesion-estudio-unidad-4.md", 4],
  ["sesion-estudio-unidad-5.md", 5],
  ["sesion-estudio-preguntas-mixtas.md", 0],
];

// markdown inline → html acotado (negritas, wikilinks, código)
function mdInline(s) {
  return s
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1") // [[t|label]] → label
    .replace(/\[\[([^\]]*)\]\]/g, "$1") // [[x]] → x
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

// Convierte un bloque markdown (con listas/párrafos) a html simple.
function mdBlock(src) {
  const lines = src.replace(/\r/g, "").split("\n");
  const out = [];
  let li = [];
  const flush = () => {
    if (li.length) {
      out.push(`<ul>${li.map((x) => `<li>${mdInline(x)}</li>`).join("")}</ul>`);
      li = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const m = /^[-*]\s+(.*)$/.exec(line) || /^\d+\.\s+(.*)$/.exec(line);
    if (m) li.push(m[1]);
    else {
      flush();
      out.push(`<p>${mdInline(line)}</p>`);
    }
  }
  flush();
  return out.join("");
}

function classifyKind(title) {
  const t = title.toLowerCase();
  if (t.includes("verdadero")) return "vf";
  if (t.includes("múltiple") || t.includes("multiple") || t.includes("selección múltiple")) return "mc";
  if (t.includes("completar")) return "completar";
  if (t.includes("caso")) return "caso";
  return "desarrollo";
}

const BANK_1ER = [];
for (const [file, unit] of SESSIONS) {
  const txt = read(path.join(D1, file)).replace(/\r/g, "");
  // Cada pregunta arranca en "### Pregunta N: …"
  const blocks = txt.split(/\n###\s+Pregunta\s+\d+:\s*/).slice(1);
  blocks.forEach((b, idx) => {
    const titleLine = b.split("\n")[0].trim();
    const tema = titleLine.replace(/^.*?[—-]\s*/, "").trim() || titleLine;
    const kind = classifyKind(titleLine);
    // Enunciado: entre "**Enunciado:**" y la próxima línea "**…:**" de sección.
    const enunM = /\*\*Enunciado:\*\*\s*\n([\s\S]*?)(?=\n\*\*(?:Respuesta propuesta|Corrección|Comentario):\*\*)/.exec(b);
    let enunciadoRaw = enunM ? enunM[1].trim() : "";
    // Opciones tipo "- a) …"
    const opts = [];
    enunciadoRaw = enunciadoRaw
      .split("\n")
      .filter((ln) => {
        const o = /^\s*[-*]\s*[a-eA-E]\)\s*(.*)$/.exec(ln);
        if (o) {
          opts.push(o[1].trim());
          return false;
        }
        return true;
      })
      .join("\n")
      .trim();
    const comM = /\*\*Comentario:\*\*\s*\n([\s\S]*?)(?=\n---|\n###|$)/.exec(b);
    const comentario = comM ? comM[1].trim() : "";
    const corrM = /\*\*Corrección:\*\*\s*\n?\s*(.*)/.exec(b);
    const correccion = corrM ? corrM[1].replace(/[*_]/g, "").trim() : "";

    BANK_1ER.push({
      id: `p1-${unit}-${idx + 1}`,
      unit,
      kind,
      tema,
      enunciado: mdBlock(enunciadoRaw),
      opts: opts.length ? opts : undefined,
      respuesta: mdBlock(comentario),
      correccion,
    });
  });
}

/* ── 1.º parcial: conceptos clave desde el .tex ───────────────────────── */

const tex = read(path.join(D1, "resumen-conceptos-clave.tex"));

// Convierte markup TeX inline → html acotado.
function texInline(s) {
  let out = s;
  // \textbf{...}, \alerta{...}, \mal{...}, \bien{...} con anidado simple
  const macro = (name, cls) => {
    const re = new RegExp(`\\\\${name}\\{`, "g");
    let r;
    while ((r = re.exec(out))) {
      // bracket match desde r.index
      let i = r.index + r[0].length;
      let depth = 1;
      const start = i;
      for (; i < out.length && depth; i++) {
        if (out[i] === "{") depth++;
        else if (out[i] === "}") depth--;
      }
      const inner = out.slice(start, i - 1);
      const tag = cls ? `<em class="${cls}">${inner}</em>` : `<strong>${inner}</strong>`;
      out = out.slice(0, r.index) + tag + out.slice(i);
      re.lastIndex = r.index + tag.length;
    }
  };
  macro("textbf", "");
  macro("alerta", "warn");
  macro("mal", "err");
  macro("bien", "ok");
  out = out
    .replace(/``/g, "“")
    .replace(/''/g, "”")
    .replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>")
    // limpia cualquier math inline restante ($>$, $=$, $\cdot$, $\square$…)
    .replace(/\$([^$]*)\$/g, (_, inner) =>
      inner
        .replace(/\\square/g, "")
        .replace(/\\cdot/g, "·")
        .replace(/>/g, "›")
        .replace(/</g, "‹")
        .replace(/\\[a-zA-Z]+/g, "")
        .replace(/[{}]/g, "")
        .trim()
    )
    .replace(/\\%/g, "%")
    .replace(/\\&/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return out;
}

// Extrae los \D{term}{def} dentro de un fragmento.
function extractDefs(frag) {
  const defs = [];
  const re = /\\D\{/g;
  let m;
  while ((m = re.exec(frag))) {
    // term
    let i = m.index + m[0].length;
    let depth = 1;
    let start = i;
    for (; i < frag.length && depth; i++) {
      if (frag[i] === "{") depth++;
      else if (frag[i] === "}") depth--;
    }
    const term = frag.slice(start, i - 1);
    // def: el siguiente {...}
    while (frag[i] && frag[i] !== "{") i++;
    i++;
    depth = 1;
    start = i;
    for (; i < frag.length && depth; i++) {
      if (frag[i] === "{") depth++;
      else if (frag[i] === "}") depth--;
    }
    const def = frag.slice(start, i - 1);
    defs.push({ term: texInline(term), def: texInline(def) });
    re.lastIndex = i;
  }
  return defs;
}

const CONCEPTS_1ER = [];
{
  // Secciones de unidad: \section*{UNIDAD N --- Title} … hasta la próxima \section*
  const secRe = /\\section\*\{UNIDAD (\d)\s*-+\s*([\s\S]*?)\}([\s\S]*?)(?=\\section\*|$)/g;
  let m;
  while ((m = secRe.exec(tex))) {
    const unit = Number(m[1]);
    const name = texInline(m[2]);
    const body = m[3];
    const clave = /\\begin\{cajaClave\}([\s\S]*?)\\end\{cajaClave\}/.exec(body);
    const errBox = /\\begin\{cajaError\}([\s\S]*?)\\end\{cajaError\}/.exec(body);
    const concepts = clave ? extractDefs(clave[1]) : [];
    let errores = "";
    if (errBox) {
      errores = texInline(errBox[1].replace(/\\\\/g, " "));
    }
    CONCEPTS_1ER.push({ unit, name, concepts, errores });
  }
}

// Errores críticos + checklist (sección final)
let ERRORES_1ER = [];
let CHECKLIST_1ER = [];
{
  const finalSec = /ERRORES CRITICOS Y CHECKLIST FINAL\}([\s\S]*)$/.exec(tex);
  if (finalSec) {
    const body = finalSec[1];
    const errBox = /\\begin\{cajaError\}([\s\S]*?)\\end\{cajaError\}/.exec(body);
    if (errBox) {
      ERRORES_1ER = errBox[1]
        .split(/\\\\/)
        .map((x) => texInline(x))
        .filter((x) => x && x !== "");
    }
    const checkBox = /\\begin\{cajaBien\}([\s\S]*?)\\end\{cajaBien\}/.exec(body);
    if (checkBox) {
      const itemRe = /\\item\[\$\\square\$\]\s*([\s\S]*?)(?=\\item|\\end)/g;
      let it;
      while ((it = itemRe.exec(checkBox[1]))) {
        const v = texInline(it[1]);
        if (v) CHECKLIST_1ER.push(v);
      }
    }
  }
}

/* ── emisión del módulo TS ────────────────────────────────────────────── */

const j = (v) => JSON.stringify(v, null, 2);

const banner = `// AUTO-GENERADO por scripts/build-derecho-data.mjs — NO editar a mano.
// Fuente: Derecho/wiki/{1er,2do}Parcial/*. Regenerar con:
//   node scripts/build-derecho-data.mjs
`;

const ts = `${banner}
export const UNIT_NAMES: Record<number, string> = ${j(UNIT_NAMES)};

export type QuizKind = "vf" | "single" | "multi" | "reveal";

export interface QuizQ {
  id: string;
  unit: number;
  kind: QuizKind;
  q: string;
  opts: string[];
  correct?: number | number[];
  reveal?: string[];
  expl: string;
  cite?: string;
  tema?: string;
  dif?: string;
  real?: boolean;
  trap?: boolean;
  src: "estudio" | "quiz";
}

export interface ConceptBlock {
  unit: number;
  title: string;
  html: string;
}

export interface RepUnit {
  unit: number;
  name: string;
  items: { q: string; a: string; freq: string; trap: boolean }[];
}

export interface RepFeature {
  unit: number;
  title: string;
  freq: string;
  html: string;
}

export type FlashKind = "vf" | "mc" | "completar" | "desarrollo" | "caso";

export interface Flashcard {
  id: string;
  unit: number;
  kind: FlashKind;
  tema: string;
  enunciado: string;
  opts?: string[];
  respuesta: string;
  correccion: string;
}

export interface Concept {
  term: string;
  def: string;
}

export interface UnitConcepts {
  unit: number;
  name: string;
  concepts: Concept[];
  errores: string;
}

export const BANK_2DO: QuizQ[] = ${j(BANK_2DO)};

export const TEORIA_2DO: ConceptBlock[] = ${j(TEORIA_2DO)};

export const REPETIDAS: RepUnit[] = ${j(REPETIDAS)};

export const REPETIDAS_FEATURES: RepFeature[] = ${j(REPETIDAS_FEATURES)};

export const BANK_1ER: Flashcard[] = ${j(BANK_1ER)};

export const CONCEPTS_1ER: UnitConcepts[] = ${j(CONCEPTS_1ER)};

export const ERRORES_1ER: string[] = ${j(ERRORES_1ER)};

export const CHECKLIST_1ER: string[] = ${j(CHECKLIST_1ER)};
`;

writeFileSync(OUT, ts);

// Resumen para verificación manual.
const byUnit = (arr, key = "unit") =>
  arr.reduce((a, x) => ((a[x[key]] = (a[x[key]] || 0) + 1), a), {});
console.log("[build-derecho-data] escrito:", path.relative(process.cwd(), OUT));
console.log("  BANK_2DO:", BANK_2DO.length, "preguntas", byUnit(BANK_2DO));
console.log("    kinds:", byUnit(BANK_2DO, "kind"));
console.log("  TEORIA_2DO:", TEORIA_2DO.length, "bloques");
console.log("  REPETIDAS:", REPETIDAS.length, "unidades,", REPETIDAS.reduce((a, u) => a + u.items.length, 0), "items");
console.log("  REPETIDAS_FEATURES:", REPETIDAS_FEATURES.length);
console.log("  BANK_1ER:", BANK_1ER.length, "flashcards", byUnit(BANK_1ER));
console.log("    kinds:", byUnit(BANK_1ER, "kind"));
console.log("  CONCEPTS_1ER:", CONCEPTS_1ER.length, "unidades,", CONCEPTS_1ER.reduce((a, u) => a + u.concepts.length, 0), "conceptos");
console.log("  ERRORES_1ER:", ERRORES_1ER.length, "· CHECKLIST_1ER:", CHECKLIST_1ER.length);

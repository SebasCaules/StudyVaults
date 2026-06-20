// =============================================================================
// PLANTILLA — scripts/build-<x>-data.mjs  (skill: studyvault-data)
//
// Esqueleto de un pipeline de datos de StudyVaults. Copiá este archivo a
//   site/scripts/build-<x>-data.mjs
// y reemplazá <Vault>, <x> y la lógica de extracción.  Modo por defecto: A
// (emite un .ts tipado en components/vault-tools/<vault>/data.ts, committeado,
// run-by-hand). Al pie hay una nota de cómo virarlo a modo B (.json gitignored
// cableado en predev/prebuild).
//
// Se corre desde site/ (cwd = site/):   node scripts/build-<x>-data.mjs
//
// REGLAS DURAS:
//   · Leer SOLO de ../<Vault>/... (originales DEL REPO). NUNCA de los vaults
//     externos read-only ni de raw/ externo. JAMÁS mutar los originales.
//   · Header AUTO-GENERADO en el output (ver `banner`).
//   · Idempotente: correrlo 2× no cambia el output (sin timestamps, orden estable).
//   · No romper el build si falta una fuente OPCIONAL (warn + vacío); throw con
//     path claro si falta una OBLIGATORIA.
// =============================================================================

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

// --- resolución de rutas (cwd = site/) -------------------------------------
const REPO = path.resolve(process.cwd(), ".."); // raíz del repo
const SRC_DIR = path.join(REPO, "<Vault>", "wiki"); // originales del vault, en el repo
const OUT = path.join(
  process.cwd(),
  "components",
  "vault-tools",
  "<vault>",
  "data.ts",
); // modo A: .ts committeado

const read = (p) => readFileSync(p, "utf8");

// Lee una fuente OBLIGATORIA (throw con path si falta) u OPCIONAL (warn + null).
function readSource(rel, { required = true } = {}) {
  const p = path.join(SRC_DIR, rel);
  if (!existsSync(p)) {
    if (required) throw new Error(`[build-<x>-data] falta fuente obligatoria: ${p}`);
    console.warn(`[build-<x>-data] fuente opcional ausente, sigo vacío: ${p}`);
    return null;
  }
  return read(p);
}

// --- helpers de extracción robusta -----------------------------------------

// Extrae el literal de array de `const NAME = [ ... ]` en un HTML/JS, con
// bracket-matching que respeta strings y escapes (NO regex greedy).
function extractArrayLiteral(src, name) {
  const m = src.indexOf(`const ${name} =`);
  if (m < 0) throw new Error(`[build-<x>-data] no encontré const ${name}`);
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
  throw new Error(`[build-<x>-data] array ${name} sin cierre`);
}

// Evalúa el literal extraído a un valor JS real.
function evalArray(src, name) {
  const lit = extractArrayLiteral(src, name);
  return new Function(`return (${lit});`)(); // literal de catedra, no input de usuario
}

// Bracket-match de `\macro{...}` (cuenta profundidad; soporta anidados).
// Devuelve { inner, end } o null si no matchea en `from`.
function matchBraces(src, from) {
  if (src[from] !== "{") return null;
  let depth = 1;
  let i = from + 1;
  const start = i;
  for (; i < src.length && depth; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") depth--;
  }
  return { inner: src.slice(start, i - 1), end: i };
}

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

// --- EXTRACCIÓN (reemplazar por la lógica real) -----------------------------
//
// Ejemplo modo A (literal JS en un HTML de la app del vault):
//   const html = readSource("2doParcial/estudio-interactivo.html");
//   const RAW = evalArray(html, "BANK");
//   const ITEMS = RAW.map(normalizeItem);
//
// Deduplicar al juntar varias fuentes:
//   const seen = new Set(); const ITEMS = [];
//   for (const it of [...a, ...b]) { const k = norm(it.q);
//     if (seen.has(k)) continue; seen.add(k); ITEMS.push(it); }

const ITEMS = []; // TODO: poblar desde las fuentes del vault

// --- emisión del módulo TS (modo A) ----------------------------------------
const j = (v) => JSON.stringify(v, null, 2);

const banner = `// AUTO-GENERADO por scripts/build-<x>-data.mjs — NO editar a mano.
// Fuente: <Vault>/wiki/... . Regenerar con:
//   node scripts/build-<x>-data.mjs
`;

const ts = `${banner}
export interface Item {
  id: string;
  // TODO: campos tipados que consume la tool/hoja
}

export const ITEMS: Item[] = ${j(ITEMS)};
`;

writeFileSync(OUT, ts);

// --- resumen por stdout (verificación a ojo) -------------------------------
console.log("[build-<x>-data] escrito:", path.relative(process.cwd(), OUT));
console.log("  ITEMS:", ITEMS.length);

// =============================================================================
// VIRAR A MODO B (.json gitignored, cableado en build):
//   1. import { mkdirSync } from "node:fs";
//   2. const DEST_DIR = path.join(process.cwd(), "lib", "<x>");
//      const OUT = path.join(DEST_DIR, "data.json");
//   3. mkdirSync(DEST_DIR, { recursive: true });
//      writeFileSync(OUT, JSON.stringify(ITEMS)); // sin banner: el JSON no admite comentarios
//   4. Definir los tipos a mano en lib/<x>/types.ts (el JSON se importa tipado).
//   5. Cablear en site/package.json: agregar `&& node scripts/build-<x>-data.mjs`
//      a los scripts `predev` Y `prebuild`.
//   6. Agregar `lib/<x>/data.json` a site/.gitignore.
// =============================================================================

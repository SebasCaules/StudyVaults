import GithubSlugger from "github-slugger";
import type { Manifest } from "./manifest";
import type { Note } from "./parse";
import { humanize } from "./slug";
import { getVault, type VaultId } from "./vaults";

export interface NavItem {
  title: string;
  href: string;
}
/** Sub-grupo de un grupo (p. ej. tipo de ejercicio dentro de un final). */
export interface NavSubGroup {
  label: string;
  items: NavItem[];
}
/** Grupo anidado dentro de una sección (p. ej. cada final en Evaluaciones). */
export interface NavGroup {
  label: string;
  subgroups: NavSubGroup[];
}
export interface NavSection {
  key: string;
  label: string;
  items: NavItem[];
  // Si está presente, el sidebar renderiza esta sección ANIDADA: grupos →
  // sub-grupos → items (se usa en Evaluaciones: final → tipo → ejercicio).
  groups?: NavGroup[];
}

// Orden preferido de secciones (folders) por convención de los vaults.
const SECTION_ORDER = [
  "meta",
  "teoria",
  "theory",
  "unidades",
  "unidad-1",
  "unidad-2",
  "unidad-3",
  "unidad-4",
  "unidad-5",
  "unidad-6",
  "unidad-7",
  "unidad-8",
  "unidad-9",
  "conceptos",
  "concepts",
  "entities",
  "distribuciones",
  "teoremas",
  "tecnicas",
  "formularios",
  "clases",
  "classes",
  "pizarrones",
  "metodos",
  "katas",
  "guias",
  "ejercicios",
  "resueltos",
  "tps",
  "herramientas",
  "tools",
  "parciales",
  "tpe",
  "fuentes",
  "sources",
];

function sectionRank(key: string): number {
  const i = SECTION_ORDER.indexOf(key);
  return i === -1 ? SECTION_ORDER.length + 1 : i;
}

const SECTION_LABELS: Record<string, string> = {
  meta: "Meta",
  teoria: "Teoría",
  theory: "Theory",
  unidades: "Unidades",
  conceptos: "Conceptos",
  concepts: "Concepts",
  entities: "Entities",
  distribuciones: "Distribuciones",
  teoremas: "Teoremas",
  tecnicas: "Técnicas",
  formularios: "Formularios",
  clases: "Clases",
  classes: "Classes",
  pizarrones: "Pizarrones",
  metodos: "Métodos",
  katas: "Katas",
  guias: "Guías",
  ejercicios: "Ejercicios",
  resueltos: "Resueltos",
  tps: "TPs",
  herramientas: "Herramientas",
  tools: "Tools",
  parciales: "Parciales",
  tpe: "TPE",
  fuentes: "Fuentes",
  sources: "Sources",
};

/** Rank de unidad para ordenar las secciones: 1..9, luego Complementos (0) y
 *  Evaluaciones (eval), y al final lo que no tiene unidad. */
function unitRank(key: string): number {
  if (key === "_root") return 999;
  if (key === "0") return 90; // Complementos Matemáticos
  if (key === "eval") return 91; // Evaluaciones
  const n = Number(key);
  return Number.isFinite(n) ? n : 95;
}

// --- Evaluaciones: agrupar los ejercicios resueltos por FINAL → TIPO ---------
// Los bancos `ejercicios-de-parcial-resueltos[-estadistica].md` listan ejercicios
// (`## Ej. N — …`) cada uno con su `**Fuente:** \`<pdf>\``. Mapeamos cada PDF a
// la evaluación de la que viene y construimos la nav anidada final → tipo → ej.
const EVAL_FINALES: { match: RegExp; label: string; order: number }[] = [
  { match: /2025_12_05_Final/i, label: "Final 05/12/2025", order: 1 },
  { match: /Examen_15_12/i, label: "Examen final 15/12", order: 2 },
  { match: /2025Q2_Parcial/i, label: "Parcial 2025 Q2", order: 3 },
  { match: /Segundo Parcial/i, label: "2.º Parcial", order: 4 },
  { match: /Primer Parcial/i, label: "1.º Parcial", order: 5 },
  { match: /Parcialito_TP1y2/i, label: "Parcialito TP 1–2", order: 6 },
  { match: /Parcialito_TP8y9/i, label: "Parcialito TP 8–9", order: 7 },
];
const EVAL_TIPO_ORDER = ["Probabilidad", "Estadística"];

function evalTipoOfBank(basename: string): string | null {
  if (!basename.startsWith("ejercicios-de-parcial-resueltos")) return null;
  return basename.includes("estadistica") ? "Estadística" : "Probabilidad";
}

/** Construye los grupos anidados (final → tipo → ejercicio) a partir de los
 *  bancos de ejercicios resueltos. Devuelve [] si no hay bancos reconocibles. */
function buildEvalGroups(notes: Note[]): NavGroup[] {
  type Ej = {
    tipo: string;
    title: string;
    href: string;
    finalLabel: string;
    finalOrder: number;
  };
  const ejs: Ej[] = [];

  for (const n of notes) {
    const tipo = evalTipoOfBank(n.basename);
    if (!tipo) continue;
    const lines = n.body.split("\n");
    // Replicar rehype-slug: slugger por nota, headings en orden de documento.
    const slugger = new GithubSlugger();
    const idOf = new Map<string, string>();
    for (const ln of lines) {
      const h = ln.match(/^#{1,6}\s+(.+?)\s*$/);
      if (h) idOf.set(h[1], slugger.slug(h[1]));
    }
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^##\s+(Ej\.\s*\d+.*?)\s*$/);
      if (!m) continue;
      const title = m[1];
      let pdf: string | null = null;
      for (let j = i + 1; j < lines.length && !/^##\s/.test(lines[j]); j++) {
        const fm = lines[j].match(/\*\*Fuente:\*\*\s*`([^`]+)`/);
        if (fm) {
          pdf = fm[1];
          break;
        }
      }
      const fin = pdf ? EVAL_FINALES.find((f) => f.match.test(pdf!)) : null;
      const id = idOf.get(title);
      if (!fin || !id) continue;
      ejs.push({
        tipo,
        title,
        href: `${n.href}#${id}`,
        finalLabel: fin.label,
        finalOrder: fin.order,
      });
    }
  }
  if (!ejs.length) return [];

  const byFinal = new Map<string, { order: number; tipos: Map<string, Ej[]> }>();
  for (const e of ejs) {
    let g = byFinal.get(e.finalLabel);
    if (!g) {
      g = { order: e.finalOrder, tipos: new Map() };
      byFinal.set(e.finalLabel, g);
    }
    const list = g.tipos.get(e.tipo) ?? [];
    list.push(e);
    g.tipos.set(e.tipo, list);
  }

  return [...byFinal]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([label, g]) => ({
      label,
      subgroups: EVAL_TIPO_ORDER.flatMap((tipo) => {
        const items = g.tipos.get(tipo);
        return items?.length
          ? [{ label: tipo, items: items.map((e) => ({ title: e.title, href: e.href })) }]
          : [];
      }),
    }));
}

/** Variante: agrupa las notas por UNIDAD (frontmatter `unidad`) en vez de por
 *  carpeta. Dentro de cada unidad ordena por categoría (carpeta) y luego título. */
function buildNavByUnit(
  notes: Note[],
  unitLabels: Record<string, string>,
): NavSection[] {
  const groups = new Map<string, Note[]>();
  for (const n of notes) {
    const key = n.unit ?? "_root";
    const list = groups.get(key) ?? [];
    list.push(n);
    groups.set(key, list);
  }

  const sections: NavSection[] = [];
  for (const [key, list] of groups) {
    list.sort((a, b) => {
      const ra = sectionRank(a.slug.length > 1 ? a.slug[0] : "");
      const rb = sectionRank(b.slug.length > 1 ? b.slug[0] : "");
      return ra !== rb ? ra - rb : a.title.localeCompare(b.title);
    });
    sections.push({
      key,
      label: key === "_root" ? "General" : unitLabels[key] ?? `Unidad ${key}`,
      items: list.map((n) => ({ title: n.title, href: n.href })),
    });
  }

  sections.sort((a, b) => {
    const ra = unitRank(a.key);
    const rb = unitRank(b.key);
    return ra !== rb ? ra - rb : a.label.localeCompare(b.label);
  });

  // Evaluaciones: anidar los ejercicios por final → tipo (si hay bancos).
  const evalSec = sections.find((s) => s.key === "eval");
  if (evalSec) {
    const g = buildEvalGroups(notes.filter((n) => n.unit === "eval"));
    if (g.length) evalSec.groups = g;
  }

  return sections;
}

/** Árbol de navegación del vault. Por defecto deriva del filesystem
 *  (folder = sección); si el vault tiene `navByUnit`, agrupa por unidad. */
export function buildNav(m: Manifest, vault: VaultId): NavSection[] {
  const notes = m.notes.filter((n) => n.vault === vault && !n.isIndex);

  const cfg = getVault(vault);
  if (cfg?.navByUnit) return buildNavByUnit(notes, cfg.unitLabels ?? {});

  const groups = new Map<string, Note[]>();

  for (const n of notes) {
    const key = n.slug.length > 1 ? n.slug[0] : "_root";
    const list = groups.get(key) ?? [];
    list.push(n);
    groups.set(key, list);
  }

  const sections: NavSection[] = [];
  for (const [key, list] of groups) {
    list.sort((a, b) => a.slug.join("/").localeCompare(b.slug.join("/")));
    sections.push({
      key,
      label:
        key === "_root"
          ? "General"
          : SECTION_LABELS[key] ?? humanize(key),
      items: list.map((n) => ({ title: n.title, href: n.href })),
    });
  }

  sections.sort((a, b) => {
    if (a.key === "_root") return 1; // General al final
    if (b.key === "_root") return -1;
    const ra = sectionRank(a.key);
    const rb = sectionRank(b.key);
    return ra !== rb ? ra - rb : a.label.localeCompare(b.label);
  });

  return sections;
}

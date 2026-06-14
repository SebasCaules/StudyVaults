import type { Manifest } from "./manifest";
import type { Note } from "./parse";
import { humanize } from "./slug";
import type { VaultId } from "./vaults";

export interface NavItem {
  title: string;
  href: string;
}
export interface NavSection {
  key: string;
  label: string;
  items: NavItem[];
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

/** Árbol de navegación del vault, derivado del filesystem (folder = sección). */
export function buildNav(m: Manifest, vault: VaultId): NavSection[] {
  const notes = m.notes.filter((n) => n.vault === vault && !n.isIndex);
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

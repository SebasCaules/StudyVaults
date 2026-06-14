import matter from "gray-matter";
import type { VaultConfig, VaultId } from "./vaults";
import { humanize, isIndexPath, noteHref, relPathToSlug } from "./slug";
import { displayTitle } from "./text";

export interface Note {
  vault: VaultId;
  relPath: string; // relativo al dir del vault
  slug: string[];
  href: string;
  basename: string; // sin .md
  isIndex: boolean;
  title: string;
  type?: string;
  unit?: string;
  tags: string[];
  aliases: string[];
  updated?: string;
  sources: string[];
  body: string; // markdown sin frontmatter
}

function coerceArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  return [String(v)].filter(Boolean);
}

function pickFirst(
  data: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const val = data[k];
    if (val != null && val !== "") return String(val);
  }
  return undefined;
}

function firstH1(body: string): string | undefined {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, "").trim() : undefined;
}

// Algunos .md tienen YAML levemente inválido (p.ej. un valor con ":" y paréntesis
// sin comillas). Como los vaults son read-only, parseamos tolerante: si gray-matter
// tira, separamos el frontmatter a mano y salvamos campos comunes por regex.
function lenientMatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  try {
    const r = matter(raw);
    return { data: r.data as Record<string, unknown>, content: r.content };
  } catch {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { data: {}, content: raw };
    const fmText = m[1];
    const content = m[2];
    const data: Record<string, unknown> = {};
    const pick = (key: string) => {
      const mm = fmText.match(
        new RegExp(`^${key}\\s*:\\s*(.+)$`, "im"),
      );
      return mm ? mm[1].trim().replace(/^["']|["']$/g, "") : undefined;
    };
    for (const k of ["title", "titulo", "type", "tipo"]) {
      const v = pick(k);
      if (v) data[k] = v;
    }
    return { data, content };
  }
}

/** Parsea el contenido crudo de un .md → Note normalizada. */
export function parseNote(
  vault: VaultConfig,
  relPath: string,
  raw: string,
): Note {
  const { data, content } = lenientMatter(raw);
  const fm = data as Record<string, unknown>;
  const basename = relPath.replace(/\.md$/i, "").split("/").pop() || relPath;
  const slug = relPathToSlug(vault, relPath);

  const rawTitle =
    pickFirst(fm, ["title", "titulo"]) ||
    firstH1(content) ||
    humanize(basename);
  const title = displayTitle(rawTitle);

  const aliases = coerceArray(fm.aliases);
  // conservar el título crudo (con $...$) como alias para resolver wikilinks
  if (rawTitle !== title) aliases.push(rawTitle);

  const unit = pickFirst(fm, ["unidad", "unit"]) ||
    (Array.isArray(fm.unidades) ? String(fm.unidades[0]) : undefined);

  return {
    vault: vault.id as VaultId,
    relPath,
    slug,
    href: noteHref(vault.id, slug),
    basename,
    isIndex: isIndexPath(vault, relPath),
    title,
    type: pickFirst(fm, ["tipo", "type"]),
    unit,
    tags: coerceArray(fm.tags),
    aliases,
    updated: pickFirst(fm, [
      "actualizado",
      "updated",
      "last_updated",
      "ultima_actualizacion",
    ]),
    sources: coerceArray(fm.fuente ?? fm.fuentes ?? fm.sources),
    body: content,
  };
}

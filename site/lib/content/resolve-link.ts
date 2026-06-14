import type { Manifest } from "./manifest";
import type { Note } from "./parse";
import { withBase } from "./slug";
import { getVault, type VaultId } from "./vaults";

export type Resolved =
  | { kind: "note"; note: Note }
  | { kind: "asset"; url: string; alt: string }
  | null;

const IMG_RE = /\.(svg|png|jpe?g|gif|webp)$/i;

/** Normaliza un path con segmentos "." y ".." (sin tocar el fs). */
function normalizeJoin(baseDir: string, target: string): string {
  const parts = `${baseDir}/${target}`.split("/");
  const out: string[] = [];
  for (const seg of parts) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return out.join("/");
}

function assetUrl(vault: VaultId, relPath: string): string {
  return withBase(`/vault-assets/${vault}/${relPath}`);
}

/**
 * Resuelve un target de wikilink/embed, scoped al vault de la nota actual.
 * `currentRelDir` = carpeta de la nota actual relativa al dir del vault.
 */
export function resolveTarget(
  m: Manifest,
  vault: VaultId,
  currentRelDir: string,
  rawTarget: string,
): Resolved {
  // limpiar #anchor y query, decodificar
  let target = rawTarget.trim().replace(/[#].*$/, "");
  try {
    target = decodeURIComponent(target);
  } catch {}
  if (!target) return null;

  const cfg = getVault(vault);
  const contentRoot = cfg?.contentRoot ? `${cfg.contentRoot}/` : "";

  // ---- asset (termina en extensión de imagen) ----
  if (IMG_RE.test(target)) {
    const aR = m.assetByRelPath.get(vault);
    const aB = m.assetByBasename.get(vault);
    const basename = target.split("/").pop() || target;
    // intentar por ruta (varias bases) y luego por basename
    const candidates = [
      target,
      `${contentRoot}${target}`,
      currentRelDir ? normalizeJoin(currentRelDir, target) : target,
    ];
    for (const c of candidates) {
      const hit = aR?.get(c);
      if (hit) return { kind: "asset", url: assetUrl(vault, hit.relPath), alt: basename };
    }
    const byName = aB?.get(basename);
    if (byName) return { kind: "asset", url: assetUrl(vault, byName.relPath), alt: basename };
    return null;
  }

  // ---- nota ----
  const rIdx = m.relPathIndex.get(vault);
  const bIdx = m.basenameIndex.get(vault);
  const tries = [
    `${contentRoot}${target}`, // ruta relativa al vault (lo más común)
    target, // por si ya incluía contentRoot o el vault no tiene
    currentRelDir ? normalizeJoin(currentRelDir, target) : "", // relativa a la nota
  ].filter(Boolean);
  for (const t of tries) {
    const hit = rIdx?.get(t);
    if (hit) return { kind: "note", note: hit };
  }
  // por basename/título/alias (lowercase) — como resuelve Obsidian
  const ali = m.aliasIndex.get(vault)?.get(target.toLowerCase());
  if (ali) return { kind: "note", note: ali };
  // por basename dentro del mismo vault
  const basename = target.split("/").pop() || target;
  const list = bIdx?.get(basename);
  if (list && list.length) {
    if (list.length === 1) return { kind: "note", note: list[0] };
    // colisión: preferir el que mejor matchea el path del target
    const want = `${contentRoot}${target}`;
    const best =
      list.find((n) => n.relPath.replace(/\.md$/i, "") === want) ||
      list.find((n) => n.relPath.replace(/\.md$/i, "").endsWith(target)) ||
      list[0];
    return { kind: "note", note: best };
  }
  return null;
}

/** Reescribe una imagen markdown con ruta relativa → asset público del vault. */
export function resolveRelativeImage(
  m: Manifest,
  vault: VaultId,
  currentRelDir: string,
  url: string,
): string | null {
  if (/^https?:\/\//i.test(url) || url.startsWith("/")) return null; // absoluta/externa
  const rel = normalizeJoin(currentRelDir, url);
  const aR = m.assetByRelPath.get(vault);
  const hit = aR?.get(rel);
  if (hit) return assetUrl(vault, hit.relPath);
  // fallback por basename
  const basename = rel.split("/").pop() || rel;
  const byName = m.assetByBasename.get(vault)?.get(basename);
  return byName ? assetUrl(vault, byName.relPath) : null;
}

import fg from "fast-glob";
import path from "node:path";
import type { VaultConfig } from "./vaults";

// El contenido vive en la raíz del repo (../ respecto de site/).
export const REPO_ROOT = path.resolve(process.cwd(), "..");

export interface DiscoveredFile {
  relPath: string; // relativo al dir del vault, p.ej. "wiki/teoria/04.md"
  absPath: string;
}

export interface DiscoveredAsset {
  relPath: string; // relativo al dir del vault
  basename: string; // "fpp.svg"
  absPath: string;
}

const IMG_EXTS = ["svg", "png", "jpg", "jpeg", "gif", "webp"];
// Documentos servibles (copiados a public/ por copy-assets.mjs): el resolver los
// enlaza como <a> en vez de <img>. Mantener en sync con EXTS de copy-assets.mjs.
const DOC_EXTS = ["pdf"];
const ASSET_EXTS = [...IMG_EXTS, ...DOC_EXTS];

/** Notas .md publicables del vault (excluye CLAUDE.md y carpetas de editor). */
export async function discoverNoteFiles(
  vault: VaultConfig,
): Promise<DiscoveredFile[]> {
  const cwd = path.join(REPO_ROOT, vault.dir);
  const entries = await fg("**/*.md", {
    cwd,
    ignore: ["**/CLAUDE.md", "**/.obsidian/**", "**/node_modules/**"],
    dot: false,
  });
  return entries.sort().map((relPath) => ({
    relPath,
    absPath: path.join(cwd, relPath),
  }));
}

/** Assets del vault: imágenes (svg de Economia, png de PAW, …) + documentos PDF. */
export async function discoverAssets(
  vault: VaultConfig,
): Promise<DiscoveredAsset[]> {
  const cwd = path.join(REPO_ROOT, vault.dir);
  const entries = await fg(
    ASSET_EXTS.map((e) => `**/*.${e}`),
    { cwd, ignore: ["**/.obsidian/**", "**/node_modules/**"], dot: false },
  );
  return entries.map((relPath) => ({
    relPath,
    basename: path.basename(relPath),
    absPath: path.join(cwd, relPath),
  }));
}

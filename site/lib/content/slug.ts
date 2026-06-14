import type { VaultConfig } from "./vaults";

// basePath del sitio (project page de GitHub Pages). En dev queda vacío.
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/StudyVaults" : "";

// Prefija basePath para assets/URLs referenciados a mano (iframe, pagefind,
// imágenes del wiki). next/link y next/image lo aplican solos — no usar acá.
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** ¿Es el index.md del vault? */
export function isIndexPath(vault: VaultConfig, relPath: string): boolean {
  return relPath === vault.indexPath;
}

/**
 * Path relativo al dir del vault → slug array para la ruta.
 * Quita el contentRoot ("wiki/"), la extensión y separa por "/".
 * El index.md devuelve [] (se rutea como /[vault]).
 */
export function relPathToSlug(vault: VaultConfig, relPath: string): string[] {
  if (isIndexPath(vault, relPath)) return [];
  let p = relPath.replace(/\.md$/i, "");
  const root = vault.contentRoot ? `${vault.contentRoot}/` : "";
  if (root && p.startsWith(root)) p = p.slice(root.length);
  return p.split("/").filter(Boolean);
}

/** Href interno de una nota (con trailing slash, como espera el export). */
export function noteHref(vaultId: string, slug: string[]): string {
  return slug.length ? `/${vaultId}/${slug.join("/")}/` : `/${vaultId}/`;
}

/** Humaniza un basename kebab/snake → título legible de fallback. */
export function humanize(basename: string): string {
  return basename
    .replace(/^\d+[-_]/, "") // prefijo numérico de orden
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

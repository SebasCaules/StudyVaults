import { readFile } from "node:fs/promises";
import {
  discoverAssets,
  discoverNoteFiles,
  type DiscoveredAsset,
} from "./discover";
import { parseNote, type Note } from "./parse";
import { VAULTS, type VaultId } from "./vaults";

export interface Manifest {
  notes: Note[];
  byHref: Map<string, Note>;
  byVaultSlug: Map<string, Note>; // key: `${vault}|${slug.join("/")}`
  basenameIndex: Map<VaultId, Map<string, Note[]>>; // basename → notas (por vault)
  relPathIndex: Map<VaultId, Map<string, Note>>; // relPath sin .md → nota
  aliasIndex: Map<VaultId, Map<string, Note>>; // basename/título/alias (lowercase) → nota
  assetByBasename: Map<VaultId, Map<string, DiscoveredAsset>>;
  assetByRelPath: Map<VaultId, Map<string, DiscoveredAsset>>;
}

function vaultSlugKey(vault: string, slug: string[]): string {
  return `${vault}|${slug.join("/")}`;
}

async function build(): Promise<Manifest> {
  const notes: Note[] = [];
  const byHref = new Map<string, Note>();
  const byVaultSlug = new Map<string, Note>();
  const basenameIndex = new Map<VaultId, Map<string, Note[]>>();
  const relPathIndex = new Map<VaultId, Map<string, Note>>();
  const aliasIndex = new Map<VaultId, Map<string, Note>>();
  const assetByBasename = new Map<VaultId, Map<string, DiscoveredAsset>>();
  const assetByRelPath = new Map<VaultId, Map<string, DiscoveredAsset>>();

  for (const vault of VAULTS) {
    const bIdx = new Map<string, Note[]>();
    const rIdx = new Map<string, Note>();
    const aIdx = new Map<string, Note>();
    basenameIndex.set(vault.id, bIdx);
    relPathIndex.set(vault.id, rIdx);
    aliasIndex.set(vault.id, aIdx);

    const files = await discoverNoteFiles(vault);
    for (const f of files) {
      const raw = await readFile(f.absPath, "utf8");
      const note = parseNote(vault, f.relPath, raw);
      notes.push(note);
      byHref.set(note.href, note);
      byVaultSlug.set(vaultSlugKey(note.vault, note.slug), note);

      const list = bIdx.get(note.basename) ?? [];
      list.push(note);
      bIdx.set(note.basename, list);

      rIdx.set(note.relPath.replace(/\.md$/i, ""), note);

      // alias index (lowercase): basename, título y aliases — como resuelve Obsidian
      for (const key of [note.basename, note.title, ...note.aliases]) {
        const k = key.trim().toLowerCase();
        if (k && !aIdx.has(k)) aIdx.set(k, note);
      }
    }

    // assets (svg de Economia, png de PAW, etc.)
    const aB = new Map<string, DiscoveredAsset>();
    const aR = new Map<string, DiscoveredAsset>();
    assetByBasename.set(vault.id, aB);
    assetByRelPath.set(vault.id, aR);
    const assets = await discoverAssets(vault);
    for (const a of assets) {
      if (!aB.has(a.basename)) aB.set(a.basename, a);
      aR.set(a.relPath, a);
    }
  }

  return {
    notes,
    byHref,
    byVaultSlug,
    basenameIndex,
    relPathIndex,
    aliasIndex,
    assetByBasename,
    assetByRelPath,
  };
}

// Singleton: un solo build del manifest reusado en toda la corrida
// (sobrevive HMR en dev y los miles de llamados de generateStaticParams).
const g = globalThis as unknown as { __svManifest?: Promise<Manifest> };

export function getManifest(): Promise<Manifest> {
  if (!g.__svManifest) g.__svManifest = build();
  return g.__svManifest;
}

export function getNoteByVaultSlug(
  m: Manifest,
  vault: string,
  slug: string[],
): Note | undefined {
  return m.byVaultSlug.get(vaultSlugKey(vault, slug));
}

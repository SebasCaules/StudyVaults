import { visit, SKIP } from "unist-util-visit";
import type { Manifest } from "./content/manifest";
import type { Note } from "./content/parse";
import { resolveTarget, resolveRelativeImage } from "./content/resolve-link";
import type { VaultId } from "./content/vaults";

export interface BrokenLink {
  fromHref: string;
  fromRelPath: string;
  vault: VaultId;
  target: string;
  embed: boolean;
}

// Contexto por-nota, inyectado en file.data.wiki (el processor se reusa).
export interface WikiData {
  manifest: Manifest;
  note: Note;
  broken: BrokenLink[];
}

// [[target]], [[target|alias]], ![[target]], ![[target|alias]]
const WIKILINK_RE = /(!?)\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dirOf(relPath: string): string {
  const i = relPath.lastIndexOf("/");
  return i === -1 ? "" : relPath.slice(0, i);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdNode = any;

export function remarkWikilink() {
  return (tree: MdNode, file: MdNode) => {
    const ctx = file.data?.wiki as WikiData | undefined;
    if (!ctx) return;
    const { manifest, note, broken } = ctx;
    const currentDir = dirOf(note.relPath);

    // 1) wikilinks y embeds en nodos de texto
    visit(
      tree,
      "text",
      (node: MdNode, index: number | undefined, parent: MdNode) => {
        if (!parent || index === undefined) return;
        const value: string = node.value;
        if (!value.includes("[[")) return;

        const out: MdNode[] = [];
        let last = 0;
        let m: RegExpExecArray | null;
        WIKILINK_RE.lastIndex = 0;
        while ((m = WIKILINK_RE.exec(value))) {
          const [full, bang, rawTarget, alias] = m;
          if (m.index > last)
            out.push({ type: "text", value: value.slice(last, m.index) });
          last = m.index + full.length;

          const embed = bang === "!";
          const target = rawTarget.trim();
          const resolved = resolveTarget(
            manifest,
            note.vault,
            currentDir,
            target,
          );

          if (resolved && resolved.kind === "asset") {
            out.push({
              type: "image",
              url: resolved.url,
              alt: alias?.trim() || resolved.alt,
            });
          } else if (resolved && resolved.kind === "note") {
            const label = alias?.trim() || resolved.note.title || target;
            out.push({
              type: "link",
              url: resolved.note.href,
              data: {
                hProperties: { className: [embed ? "wikiembed" : "wikilink"] },
              },
              children: [{ type: "text", value: embed ? `↪ ${label}` : label }],
            });
          } else {
            const label = alias?.trim() || target;
            broken.push({
              fromHref: note.href,
              fromRelPath: note.relPath,
              vault: note.vault,
              target,
              embed,
            });
            out.push({
              type: "html",
              value: `<span class="broken-link" title="enlace no resuelto: ${escapeHtml(
                target,
              )}">${escapeHtml(label)}</span>`,
            });
          }
        }
        if (last === 0) return;
        if (last < value.length)
          out.push({ type: "text", value: value.slice(last) });
        parent.children.splice(index, 1, ...out);
        return [SKIP, index + out.length];
      },
    );

    // 2) imágenes markdown con ruta relativa → asset público del vault
    visit(tree, "image", (node: MdNode) => {
      const rewritten = resolveRelativeImage(
        manifest,
        note.vault,
        currentDir,
        node.url,
      );
      if (rewritten) node.url = rewritten;
    });
  };
}

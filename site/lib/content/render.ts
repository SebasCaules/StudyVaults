import { unified, type Processor } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import { VFile } from "vfile";
import { mathToText } from "./text";
import { remarkWikilink, type BrokenLink, type WikiData } from "../remark-wikilink";
import type { Manifest } from "./manifest";
import type { Note } from "./parse";
import { getVault } from "./vaults";

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

export interface RenderedNote {
  html: string;
  toc: TocItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;

/** Code fences ```mermaid → <pre class="mermaid"> (passthrough; hidrata el cliente). */
function remarkMermaid() {
  return (tree: AnyNode) => {
    visit(tree, "code", (node: AnyNode) => {
      if ((node.lang || "").toLowerCase() === "mermaid") {
        const escaped = String(node.value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        node.type = "html";
        node.value = `<pre class="mermaid">${escaped}</pre>`;
        delete node.lang;
        delete node.meta;
      }
    });
  };
}

function findAnnotation(node: AnyNode): string | null {
  if (node?.type === "element" && node.tagName === "annotation")
    return hastToString(node);
  for (const c of node?.children ?? []) {
    const r = findAnnotation(c);
    if (r != null) return r;
  }
  return null;
}

/** Texto legible de un heading (convierte KaTeX a unicode vía su anotación). */
function headingText(node: AnyNode): string {
  if (node.type === "text") return node.value;
  if (node.type !== "element") return "";
  const cls = node.properties?.className;
  const list = Array.isArray(cls) ? cls : cls ? String(cls).split(" ") : [];
  if (list.includes("katex")) {
    const ann = findAnnotation(node);
    return ann != null ? mathToText(ann) : "";
  }
  return (node.children ?? []).map(headingText).join("");
}

/** Recolecta headings h2/h3 (con id) en file.data.toc. */
function rehypeCollectToc() {
  return (tree: AnyNode, file: AnyNode) => {
    const toc: TocItem[] = (file.data.toc = []);
    visit(tree, "element", (node: AnyNode) => {
      const tag = node.tagName;
      if ((tag === "h2" || tag === "h3") && node.properties?.id) {
        toc.push({
          depth: tag === "h2" ? 2 : 3,
          id: String(node.properties.id),
          text: headingText(node),
        });
      }
    });
  };
}

function buildProcessor(math: boolean): Processor {
  // El tipo genérico de unified cambia con cada .use() condicional; usamos
  // `any` en el builder (lo que importa es el tipo en process(), abajo).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let p: any = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMermaid)
    .use(remarkWikilink);
  if (math) p = p.use(remarkMath);
  p = p.use(remarkRehype, { allowDangerousHtml: true });
  if (math) p = p.use(rehypeKatex, { strict: false });
  p = p
    .use(rehypeSlug)
    .use(rehypeCollectToc)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true });
  return p as Processor;
}

// Reusar UN processor por variante (math on/off): evita recrear shiki/unified
// por cada una de las ~780 notas. Cacheado en globalThis (sobrevive HMR).
const g = globalThis as unknown as {
  __svProc?: { on: Processor; off: Processor };
};
function getProcessor(math: boolean): Processor {
  if (!g.__svProc) {
    g.__svProc = { on: buildProcessor(true), off: buildProcessor(false) };
  }
  return math ? g.__svProc.on : g.__svProc.off;
}

export async function renderNote(
  note: Note,
  manifest: Manifest,
): Promise<RenderedNote> {
  const math = getVault(note.vault)?.math ?? false;
  const broken: BrokenLink[] = [];
  const wiki: WikiData = { manifest, note, broken };

  const file = new VFile({ value: note.body });
  file.data.wiki = wiki;

  const out = await getProcessor(math).process(file);

  if (broken.length) {
    console.warn(
      `[wiki] ${note.vault}/${note.relPath}: ${broken.length} broken → ${broken
        .map((b) => b.target)
        .join(", ")}`,
    );
  }

  return {
    html: String(out),
    toc: (file.data.toc as TocItem[]) ?? [],
  };
}

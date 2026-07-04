import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest, getNoteByVaultSlug } from "@/lib/content/manifest";
import { renderNote } from "@/lib/content/render";
import { buildNav } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";
import { humanize } from "@/lib/content/slug";
import { Eyebrow, Tag, CodeCopy } from "@studyvaults/ui";
import WikiLayout from "@/components/wiki/WikiLayout";
import WikiSequenceNav from "@/components/wiki/WikiSequenceNav";
import Prose from "@/components/wiki/Prose";

export const dynamicParams = false;

type Params = { vault: string; slug: string[] };

export async function generateStaticParams() {
  const m = await getManifest();
  return m.notes
    .filter((n) => !n.isIndex)
    // Guard: una nota cuyo slug colisione con una ruta dedicada de la materia
    // (/herramientas, /hojas, /biblioteca) pisaría el path de salida de esa ruta.
    .filter((n) => {
      const cfg = getVault(n.vault);
      if (n.slug.length !== 1) return true;
      if (cfg?.toolkit && n.slug[0] === "herramientas") return false;
      if (cfg?.sheets && n.slug[0] === "hojas") return false;
      if (cfg?.library && n.slug[0] === "biblioteca") return false;
      return true;
    })
    .map((n) => ({ vault: n.vault, slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vault, slug } = await params;
  const m = await getManifest();
  const note = getNoteByVaultSlug(m, vault, slug);
  if (!note) return {};
  const cfg = getVault(vault);
  return {
    title: `${note.title} · ${cfg?.short ?? vault}`,
    description: cfg?.name,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vault, slug } = await params;
  const m = await getManifest();
  const note = getNoteByVaultSlug(m, vault, slug);
  const cfg = getVault(vault);
  if (!note || !cfg) notFound();

  // El header ya muestra el título; sacamos el primer H1 del body para no duplicar.
  const forRender = {
    ...note,
    body: note.body.replace(/^\s*#\s+[^\n]*\r?\n?/, ""),
  };
  const { html, toc } = await renderNote(forRender, m);
  const sections = buildNav(m, note.vault);
  const sectionLabel = note.slug.length > 1 ? humanize(note.slug[0]) : cfg.short;

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: cfg.short, href: `/${vault}/` },
    { label: note.title },
  ];

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={note.href}
      breadcrumbs={crumbs}
      toc={toc}
    >
      <div data-pagefind-body data-pagefind-filter={`materia:${cfg.short}`}>
        <header className="wiki__head">
          <Eyebrow data-pagefind-ignore>
            {cfg.code} // {sectionLabel}
          </Eyebrow>
          <h1 className="wiki__title" data-pagefind-meta="title">
            {note.title}
          </h1>
          {(note.updated || note.tags.length > 0) && (
            <div className="wiki__meta" data-pagefind-ignore>
              {note.updated && (
                <span className="wiki__updated">act. {note.updated}</span>
              )}
              {note.tags.slice(0, 6).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </header>
        <Prose html={html} />
        <CodeCopy />
      </div>
      <WikiSequenceNav
        vault={vault}
        sections={sections}
        currentHref={note.href}
      />
    </WikiLayout>
  );
}

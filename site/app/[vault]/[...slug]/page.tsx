import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest, getNoteByVaultSlug } from "@/lib/content/manifest";
import { renderNote } from "@/lib/content/render";
import { buildNav } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";
import { humanize } from "@/lib/content/slug";
import WikiLayout from "@/components/wiki/WikiLayout";
import Prose from "@/components/wiki/Prose";

export const dynamicParams = false;

type Params = { vault: string; slug: string[] };

export async function generateStaticParams() {
  const m = await getManifest();
  return m.notes
    .filter((n) => !n.isIndex)
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
          <p className="eyebrow">
            {cfg.code} // {sectionLabel}
          </p>
          <h1 className="wiki__title" data-pagefind-meta="title">
            {note.title}
          </h1>
          {(note.updated || note.tags.length > 0) && (
            <div className="wiki__meta">
              {note.updated && (
                <span className="wiki__updated">act. {note.updated}</span>
              )}
              {note.tags.slice(0, 6).map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>
        <Prose html={html} />
      </div>
    </WikiLayout>
  );
}

import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest, getNoteByVaultSlug } from "@/lib/content/manifest";
import { renderNote } from "@/lib/content/render";
import { buildNav } from "@/lib/content/nav-tree";
import { VAULTS, getVault } from "@/lib/content/vaults";
import WikiLayout from "@/components/wiki/WikiLayout";
import Prose from "@/components/wiki/Prose";

export const dynamicParams = false;

type Params = { vault: string };

export async function generateStaticParams() {
  return VAULTS.map((v) => ({ vault: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vault } = await params;
  const cfg = getVault(vault);
  if (!cfg) return {};
  return { title: cfg.name, description: cfg.blurb };
}

export default async function VaultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vault } = await params;
  const cfg = getVault(vault);
  if (!cfg) notFound();

  const m = await getManifest();
  const sections = buildNav(m, cfg.id);
  const count = m.notes.filter((n) => n.vault === cfg.id && !n.isIndex).length;

  const index = getNoteByVaultSlug(m, vault, []);
  let html = "";
  let toc: Awaited<ReturnType<typeof renderNote>>["toc"] = [];
  if (index) {
    // sacar el primer H1 del index.md (usamos nuestro propio header)
    const stripped = {
      ...index,
      body: index.body.replace(/^#\s+.*\r?\n?/m, ""),
    };
    const r = await renderNote(stripped, m);
    html = r.html;
    toc = r.toc;
  }

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: cfg.short },
  ];

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={`/${vault}/`}
      breadcrumbs={crumbs}
      toc={toc}
    >
      <header className="wiki__head">
        <p className="eyebrow">
          {cfg.code} // {cfg.lang === "en" ? "Subject" : "Materia"}
        </p>
        <h1 className="wiki__title">{cfg.name}</h1>
        <p className="wiki__blurb">{cfg.blurb}</p>
        <div className="wiki__meta">
          <span className="badge badge--status">{count} páginas</span>
        </div>
      </header>
      {html ? (
        <Prose html={html} />
      ) : (
        <p className="wiki__blurb">Catálogo en preparación.</p>
      )}
    </WikiLayout>
  );
}

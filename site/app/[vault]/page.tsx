import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest, getNoteByVaultSlug } from "@/lib/content/manifest";
import { renderNote } from "@/lib/content/render";
import { buildNav } from "@/lib/content/nav-tree";
import { VAULTS, getVault } from "@/lib/content/vaults";
import { Eyebrow, Button } from "@studyvaults/ui";
import WikiLayout from "@/components/wiki/WikiLayout";
import Prose from "@/components/wiki/Prose";
import WikiExplainer from "@/components/wiki/WikiExplainer";
import UseWithClaude from "@/components/wiki/UseWithClaude";
import VaultToolLaunchers from "@/components/wiki/VaultToolLaunchers";

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
  const en = cfg.lang === "en";

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

  // chips de capacidades de la materia, en su idioma
  const caps: string[] = [];
  if (cfg.toolkit) caps.push(en ? "Toolkit" : "Toolkit");
  if (cfg.sheets) caps.push(en ? "Sheets" : "Hojas");
  if (cfg.library) caps.push("PDFs");
  if (cfg.apps?.length) caps.push(en ? "App" : "App");

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={`/${vault}/`}
      breadcrumbs={crumbs}
      toc={toc}
    >
      <header className="wiki__head vl-head">
        <Eyebrow>
          {cfg.code} // {en ? "Subject" : "Materia"}
        </Eyebrow>
        <h1 className="wiki__title">{cfg.name}</h1>
        <p className="wiki__blurb">{cfg.blurb}</p>

        <div className="vl-head__meta">
          <span className="vl-head__stat">
            <b>{count}</b> {en ? "pages" : "páginas"}
          </span>
          <span className="vl-head__statsep" aria-hidden="true" />
          <span className="vl-head__stat">
            <b>{sections.length}</b> {en ? "sections" : "secciones"}
          </span>
          {caps.length > 0 && (
            <>
              <span className="vl-head__statsep" aria-hidden="true" />
              <span className="vl-head__chips">
                {caps.map((c) => (
                  <span className="vl-head__chip" key={c}>
                    {c}
                  </span>
                ))}
              </span>
            </>
          )}
        </div>

        <div className="vl-head__actions">
          <Button variant="primary" href="#contenido">
            {en ? "Browse content ↓" : "Explorar contenido ↓"}
          </Button>
          <Button variant="ghost" href="#usar-con-ia">
            {en ? "Use it with Claude Code" : "Usala con Claude Code"}
          </Button>
        </div>
      </header>

      <WikiExplainer lang={cfg.lang} pages={count} sections={sections.length} />

      <VaultToolLaunchers cfg={cfg} />

      <UseWithClaude
        vault={cfg.id}
        dir={cfg.dir}
        name={cfg.name}
        short={cfg.short}
        lang={cfg.lang}
      />

      <section className="vl-catalog" id="contenido">
        <header className="vl-sec__head">
          <span className="vl-sec__kicker">
            {en ? "index // contents" : "índice // contenido"}
          </span>
          <h2 className="vl-sec__title">
            {en ? "Everything inside" : "Todo el contenido"}
          </h2>
          <p className="vl-sec__lead">
            {en
              ? `The full catalog of ${cfg.short} — every unit and topic, also reachable from the side index and ⌘K search.`
              : `El catálogo completo de ${cfg.short} — todas las unidades y temas, también accesibles desde el índice lateral y la búsqueda ⌘K.`}
          </p>
        </header>
        {html ? (
          <Prose html={html} />
        ) : (
          <p className="wiki__blurb">
            {en ? "Catalog in preparation." : "Catálogo en preparación."}
          </p>
        )}
      </section>
    </WikiLayout>
  );
}

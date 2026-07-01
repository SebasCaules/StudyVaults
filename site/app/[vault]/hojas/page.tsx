import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/content/manifest";
import { buildNav } from "@/lib/content/nav-tree";
import { getVault, type VaultId } from "@/lib/content/vaults";
import { Eyebrow } from "@studyvaults/ui";
import WikiLayout from "@/components/wiki/WikiLayout";
import SheetShell from "@/components/vault-sheets/SheetShell";
import { SHEETS } from "@/components/vault-sheets/registry";

export const dynamicParams = false;

type Params = { vault: string };

export function generateStaticParams() {
  return Object.keys(SHEETS).map((vault) => ({ vault }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vault } = await params;
  const cfg = getVault(vault);
  if (!cfg) return {};
  const t = cfg.lang === "en" ? "Study sheets" : "Hojas de estudio";
  return {
    title: `${t} · ${cfg.short}`,
    description: `Hojas de fórmulas y conceptos imprimibles para ${cfg.name}.`,
  };
}

export default async function SheetsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vault } = await params;
  const cfg = getVault(vault);
  const sheets = SHEETS[vault as VaultId];
  if (!cfg || !sheets) notFound();

  const m = await getManifest();
  const sections = buildNav(m, cfg.id);
  const en = cfg.lang === "en";

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: cfg.short, href: `/${vault}/` },
    { label: en ? "Study sheets" : "Hojas de estudio" },
  ];

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={`/${vault}/hojas`}
      breadcrumbs={crumbs}
      toc={[]}
      wide
    >
      <header className="wiki__head">
        <Eyebrow>
          {cfg.code} // {en ? "Study sheets" : "Hojas de estudio"}
        </Eyebrow>
        <h1 className="wiki__title">
          {en ? "Study sheets" : "Hojas de estudio"}
        </h1>
        <p className="wiki__blurb">
          {en
            ? `Dense, color-coded formula and concept sheets for ${cfg.short} — print to PDF or export to .tex / .md.`
            : `Hojas de fórmulas y conceptos densas y color-coded para ${cfg.short}: imprimí a PDF o exportá a .tex / .md.`}
        </p>
      </header>
      <SheetShell
        formulas={sheets.formulas}
        conceptos={sheets.conceptos}
        defaultDensity={vault === "proba" ? "book" : undefined}
        intro={
          en
            ? "Built to print on the fewest pages possible. Use the toggle to switch sheets, and the toolbar to print or download."
            : "Pensadas para imprimirse en la menor cantidad de hojas. Usá el toggle para cambiar de hoja y la barra para imprimir o descargar."
        }
      />
    </WikiLayout>
  );
}

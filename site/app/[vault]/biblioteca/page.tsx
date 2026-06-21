import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/content/manifest";
import { buildNav } from "@/lib/content/nav-tree";
import { VAULTS, getVault, type VaultId } from "@/lib/content/vaults";
import { Eyebrow } from "@studyvaults/ui";
import WikiLayout from "@/components/wiki/WikiLayout";
import VaultLibrary from "@/components/vault-library/VaultLibrary";
import { LIBRARIES } from "@/components/vault-library/registry";

export const dynamicParams = false;

type Params = { vault: string };

export function generateStaticParams() {
  return VAULTS.filter((v) => v.library).map((v) => ({ vault: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vault } = await params;
  const cfg = getVault(vault);
  if (!cfg) return {};
  const t = cfg.lang === "en" ? "Library" : "Biblioteca";
  return {
    title: `${t} · ${cfg.short}`,
    description: `Material de estudio en PDF de ${cfg.name}, ordenado por carpetas.`,
  };
}

export default async function LibraryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vault } = await params;
  const cfg = getVault(vault);
  const lib = LIBRARIES[vault as VaultId];
  if (!cfg || !cfg.library || !lib) notFound();

  const m = await getManifest();
  const sections = buildNav(m, cfg.id);
  const en = cfg.lang === "en";

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: cfg.short, href: `/${vault}/` },
    { label: en ? "Library" : "Biblioteca" },
  ];

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={`/${vault}/biblioteca`}
      breadcrumbs={crumbs}
      toc={[]}
      wide
    >
      <header className="wiki__head">
        <Eyebrow>
          {cfg.code} // {en ? "PDF library" : "Biblioteca de PDF"}
        </Eyebrow>
        <h1 className="wiki__title">
          {en ? "PDF library" : "Biblioteca de PDFs"}
        </h1>
        <p className="wiki__blurb">
          {en
            ? `Printable study material for ${cfg.short}, organized into folders like a drive.`
            : `Material de estudio imprimible de ${cfg.short}, ordenado en carpetas como un drive.`}
        </p>
      </header>
      <VaultLibrary vault={cfg.id} lib={lib} />
    </WikiLayout>
  );
}

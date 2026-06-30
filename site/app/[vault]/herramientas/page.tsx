import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/content/manifest";
import { buildNav } from "@/lib/content/nav-tree";
import { VAULTS, getVault, type VaultId } from "@/lib/content/vaults";
import { Eyebrow } from "@studyvaults/ui";
import WikiLayout from "@/components/wiki/WikiLayout";
import { TOOLKITS } from "@/components/vault-tools/registry";

export const dynamicParams = false;

type Params = { vault: string };

export function generateStaticParams() {
  return VAULTS.filter((v) => v.toolkit).map((v) => ({ vault: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vault } = await params;
  const cfg = getVault(vault);
  if (!cfg) return {};
  const t = cfg.lang === "en" ? "Toolkit" : "Herramientas";
  return {
    title: `${t} · ${cfg.short}`,
    description: `Herramientas interactivas de estudio para ${cfg.name}.`,
  };
}

export default async function ToolkitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vault } = await params;
  const cfg = getVault(vault);
  const Toolkit = TOOLKITS[vault as VaultId];
  if (!cfg || !cfg.toolkit || !Toolkit) notFound();

  const m = await getManifest();
  const sections = buildNav(m, cfg.id);
  const en = cfg.lang === "en";

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: cfg.short, href: `/${vault}/` },
    { label: en ? "Toolkit" : "Herramientas" },
  ];

  return (
    <WikiLayout
      vault={vault}
      sections={sections}
      currentHref={`/${vault}/herramientas`}
      breadcrumbs={crumbs}
      toc={[]}
      wide
    >
      <header className="wiki__head">
        <Eyebrow>
          {cfg.code} // {en ? "Study toolkit" : "Herramientas de estudio"}
        </Eyebrow>
        <h1 className="wiki__title">
          {en ? "Study toolkit" : "Herramientas de estudio"}
        </h1>
        <p className="wiki__blurb">
          {en
            ? `Interactive tools tailored to ${cfg.short} — built to study the subject, not just read it.`
            : `Herramientas interactivas pensadas para ${cfg.short}: para estudiar la materia, no solo leerla.`}
        </p>
      </header>
      <Toolkit />
    </WikiLayout>
  );
}

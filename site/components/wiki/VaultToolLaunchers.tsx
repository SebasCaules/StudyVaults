import { Eyebrow, CardGrid, ToolCard } from "@studyvaults/ui";
import type { VaultConfig } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

const ToolkitIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
  </svg>
);

const AppIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3v5h5" />
    <path d="M19 8v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h8l5 5Z" />
  </svg>
);

// Cards-lanzador en la landing de la materia: el toolkit interactivo
// (/[vault]/herramientas) y las apps estáticas propias (cfg.apps, servidas
// bajo /apps/<vault>/). Server component — sin estado.
export default function VaultToolLaunchers({ cfg }: { cfg: VaultConfig }) {
  const hasToolkit = !!cfg.toolkit;
  const apps = cfg.apps ?? [];
  if (!hasToolkit && apps.length === 0) return null;

  const en = cfg.lang === "en";

  return (
    <section className="toollaunch" data-vault={cfg.id}>
      <Eyebrow>
        {cfg.code} // {en ? "tools" : "herramientas"}
      </Eyebrow>
      <h2 className="section__title" style={{ fontSize: "clamp(22px,3vw,28px)" }}>
        {en ? "Study tools" : "Herramientas para estudiar"}
      </h2>
      <CardGrid className="toollaunch__cards">
        {hasToolkit && (
          <ToolCard
            href={`/${cfg.id}/herramientas`}
            icon={ToolkitIcon}
            kind={en ? "Interactive" : "Interactivo"}
            title={en ? "Study toolkit" : "Toolkit de estudio"}
            description={
              en
                ? "Interactive calculators, explorers and references tailored to the subject."
                : "Calculadoras, exploradores y referencias interactivas hechas a medida de la materia."
            }
            cta={en ? "Open toolkit →" : "Abrir toolkit →"}
          />
        )}

        {apps.map((app) => (
          <ToolCard
            key={app.href}
            href={withBase(app.href)}
            external
            icon={AppIcon}
            kind="App"
            title={app.label}
            description={app.desc}
            cta={en ? "Open" : "Abrir"}
          />
        ))}
      </CardGrid>
    </section>
  );
}

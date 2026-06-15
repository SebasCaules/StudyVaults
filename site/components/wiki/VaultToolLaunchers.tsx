import Link from "next/link";
import type { VaultConfig } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

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
      <p className="eyebrow">{cfg.code} // {en ? "tools" : "herramientas"}</p>
      <h2 className="section__title" style={{ fontSize: "clamp(22px,3vw,28px)" }}>
        {en ? "Study tools" : "Herramientas para estudiar"}
      </h2>
      <div className="cards toollaunch__cards">
        {hasToolkit && (
          <Link href={`/${cfg.id}/herramientas`} className="card toolcard">
            <div className="toolcard__top">
              <span className="toolcard__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
                </svg>
              </span>
              <span className="toolcard__kind">{en ? "Interactive" : "Interactivo"}</span>
            </div>
            <h3>{en ? "Study toolkit" : "Toolkit de estudio"}</h3>
            <p>
              {en
                ? "Interactive calculators, explorers and references tailored to the subject."
                : "Calculadoras, exploradores y referencias interactivas hechas a medida de la materia."}
            </p>
            <span className="toolcard__meta">{en ? "Open toolkit →" : "Abrir toolkit →"}</span>
          </Link>
        )}

        {apps.map((app) => (
          <a
            key={app.href}
            href={withBase(app.href)}
            target="_blank"
            rel="noopener noreferrer"
            className="card toolcard"
          >
            <div className="toolcard__top">
              <span className="toolcard__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3v5h5" />
                  <path d="M19 8v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h8l5 5Z" />
                </svg>
              </span>
              <span className="toolcard__kind">{en ? "App" : "App"}</span>
            </div>
            <h3>{app.label}</h3>
            <p>{app.desc}</p>
            <span className="toolcard__meta">
              {en ? "Open" : "Abrir"} <span className="ext">↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

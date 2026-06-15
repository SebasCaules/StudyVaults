import Link from "next/link";
import { getManifest } from "@/lib/content/manifest";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";
import Reveal from "@/components/Reveal";

export default async function Home() {
  const m = await getManifest();
  const counts: Record<string, number> = {};
  for (const v of VAULTS) {
    counts[v.id] = m.notes.filter(
      (n) => n.vault === v.id && !n.isIndex,
    ).length;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <section className="home-hero container">
        <Reveal as="div" className="home-hero__grid">
          <div className="home-hero__copy">
            <div className="home-hero__topmeta">
              <span>
                <span className="dot" />
                SYS.00 // StudyVaults
              </span>
              <span>ITBA · Ing. Informática</span>
              <span>{VAULTS.length} vaults · active</span>
            </div>
            <h1 className="home-hero__title">
              <span className="mask-line">
                <span>Apuntes de la carrera,</span>
              </span>
              <span className="mask-line">
                <span>
                  <span className="accent">destilados</span> en un wiki
                </span>
              </span>
              <span className="mask-line">
                <span>navegable.</span>
              </span>
            </h1>
            <p className="home-sub">
              Siete materias del ITBA convertidas en bases de conocimiento:
              teoría, clases, guías y parciales como notas atómicas, enlazadas y
              buscables. Más un planificador de electivas.
            </p>
            <div className="home-actions">
              <a className="btn btn--primary btn--lg" href="#materias">
                Explorar materias
              </a>
              <a
                className="btn btn--ghost btn--lg"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en GitHub
              </a>
            </div>
          </div>

          <aside className="home-panel" aria-label="Resumen del sistema">
            <div className="home-panel__head">
              <span>SYS.00 // STUDYVAULTS</span>
              <span className="live">
                <span className="live-dot" />
                LIVE
              </span>
            </div>
            <div
              className="focal"
              role="img"
              aria-label="Anillos técnicos concéntricos"
            >
              <svg viewBox="0 0 240 240" fill="none" style={{ color: "var(--ink-strong)" }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F47C59" />
                    <stop offset="1" stopColor="#92CFF2" />
                  </linearGradient>
                </defs>
                <circle cx="120" cy="120" r="112" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                <g className="ring ring--slow">
                  <circle cx="120" cy="120" r="96" stroke="rgba(146,207,242,0.35)" strokeWidth="1" strokeDasharray="2 8" />
                  <circle cx="120" cy="24" r="3.2" fill="#92CFF2" />
                </g>
                <g className="ring ring--rev">
                  <circle cx="120" cy="120" r="74" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="60 18 8 18" />
                  <circle cx="46" cy="120" r="3" fill="#F47C59" />
                </g>
                <g className="ring ring--fast">
                  <circle cx="120" cy="120" r="52" stroke="rgba(244,124,89,0.5)" strokeWidth="1" strokeDasharray="3 6" />
                  <circle cx="120" cy="68" r="2.4" fill="currentColor" />
                </g>
                <circle cx="120" cy="120" r="30" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
                <path d="M120 100v40M100 120h40" stroke="rgba(146,207,242,0.6)" strokeWidth="1" />
                <circle cx="120" cy="120" r="6" fill="#F47C59" />
                <circle cx="120" cy="120" r="6" stroke="#92CFF2" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="home-panel__meta">
              <div className="kv">
                <span className="k">Vaults</span>
                <span className="v">0{VAULTS.length} / active</span>
              </div>
              <div className="kv">
                <span className="k">Páginas</span>
                <span className="v acc">{total}</span>
              </div>
              <div className="kv">
                <span className="k">Planificador</span>
                <span className="v">electivas</span>
              </div>
              <div className="kv">
                <span className="k">Integridad</span>
                <span className="v coral">curado</span>
              </div>
            </div>
          </aside>
        </Reveal>
      </section>

      <section id="materias" className="section container">
        <Reveal>
          <p className="eyebrow">Índice de vaults</p>
          <h2 className="section__title">Una materia, un vault.</h2>
        </Reveal>
        <div className="cards" style={{ marginTop: "32px" }}>
          {VAULTS.map((v, i) => (
            <Reveal as="div" delay={i * 55} key={v.id}>
              <Link href={`/${v.id}/`} className="card vaultcard">
                <div className="card__ico">{v.code.replace("SYS.", "")}</div>
                <h3>{v.name}</h3>
                <p>{v.blurb}</p>
                <span className="vaultcard__meta">
                  {counts[v.id]} páginas →
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal as="div" delay={VAULTS.length * 55}>
            <a href={withBase("/electivas/")} className="card vaultcard">
              <div className="card__ico blue">PL</div>
              <h3>Planificador de electivas</h3>
              <p>
                App para planificar la carrera: mapa de correlativas, áreas y
                minors, créditos y armado de horario cuatrimestral.
              </p>
              <span className="vaultcard__meta">Abrir planner →</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

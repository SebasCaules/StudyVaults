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
        <Reveal>
          <p className="eyebrow">SYS.00 // StudyVaults · ITBA</p>
          <h1 className="home-hero__title">
            Apuntes de la carrera, <span className="accent">destilados</span> en
            un wiki navegable.
          </h1>
          <p className="home-sub">
            Siete materias del ITBA convertidas en bases de conocimiento: teoría,
            clases, guías y parciales como notas atómicas, enlazadas y
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
          <div className="home-stats">
            <span>
              <b>{VAULTS.length}</b> vaults
            </span>
            <span>
              <b>{total}</b> páginas curadas
            </span>
            <span>
              <b>1</b> planificador
            </span>
          </div>
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

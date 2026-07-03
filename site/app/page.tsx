import type { CSSProperties } from "react";
import {
  Reveal,
  Section,
  SectionHeading,
  Eyebrow,
  CardGrid,
  Card,
  Button,
  Icon,
} from "@studyvaults/ui";
import { getManifest } from "@/lib/content/manifest";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";
import GraphExplorer from "@/components/portal/GraphExplorer";
import { BANNERS, PLANNER_BANNER } from "@/components/portal/VaultBanners";
import { CountUp, SearchCTA } from "@/components/portal/home-bits";

// atajo tipado para las custom properties de delay del stagger
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function Home() {
  const m = await getManifest();
  const counts: Record<string, number> = {};
  for (const v of VAULTS) {
    counts[v.id] = m.notes.filter((n) => n.vault === v.id && !n.isIndex).length;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* 1 · HERO — copy a la izquierda, grafo REAL de notas (compacto) a la derecha */}
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true">
          <span className="home-hero__blob home-hero__blob--a" />
          <span className="home-hero__blob home-hero__blob--b" />
        </div>

        <div className="home-hero__inner">
          <div className="home-hero__copy">
            <div className="home-hero__topmeta anim" style={d(0)}>
              <span>
                <span className="dot" />
                SYS.00 // StudyVaults
              </span>
              <span>ITBA · Ing. Informática</span>
              <span>{VAULTS.length} vaults</span>
            </div>

            <h1 className="home-hero__title">
              <span className="mask-line">
                <span style={d(120)}>Los apuntes de la carrera,</span>
              </span>
              <span className="mask-line">
                <span style={d(240)}>
                  <span className="accent">destilados</span> en un wiki.
                </span>
              </span>
            </h1>

            <p className="home-sub anim" style={d(430)}>
              Siete materias de Ingeniería Informática del ITBA reescritas como
              notas atómicas y enlazadas entre sí, más un planificador para armar
              tu cursada. Todo buscable y navegable.
            </p>

            <div className="home-actions anim" style={d(540)}>
              <Button variant="primary" href="/electivas/planificar/">
                Planificar mi cursada
                <Icon name="arrowRight" size={16} />
              </Button>
              <Button variant="ghost" href="#materias">
                Explorar materias
                <Icon name="arrowRight" size={16} />
              </Button>
              <SearchCTA total={total} />
            </div>

            <div className="home-stats anim" style={d(640)}>
              <span>
                <b>
                  <CountUp to={total} />
                </b>
                páginas
              </span>
              <span>
                <b>
                  <CountUp to={VAULTS.length} />
                </b>
                vaults
              </span>
              <span>
                <b>1</b>
                planificador
              </span>
            </div>
          </div>

          <div className="home-hero__graphic anim" style={d(420)}>
            <GraphExplorer variant="hero" />
          </div>
        </div>
      </section>

      {/* 2 · MATERIAS — las 7 + card del planner, revelado como bloque único */}
      <Section container id="materias">
        <Reveal>
          <SectionHeading
            eyebrow="SYS // índice de vaults"
            title="Elegí tu materia."
            lead="Las siete materias de Ingeniería Informática, cada una como una base de conocimiento independiente. El número junto a cada una es la cantidad de páginas que contiene."
          />
        </Reveal>
        <Reveal>
          <CardGrid className="cards--vaults" style={{ marginTop: "32px" }}>
            {VAULTS.map((v, i) => (
              <Card
                key={v.id}
                href={`/${v.id}/`}
                className="vaultcard"
                data-vault={v.id}
                style={{ "--i": i } as CSSProperties}
              >
                <div className="vaultcard__bannerwrap">{BANNERS[v.id]}</div>
                <h3>{v.name}</h3>
                <p>{v.blurb}</p>
                <span className="vaultcard__meta">
                  {counts[v.id]} páginas
                  <Icon name="arrowRight" size={14} />
                </span>
              </Card>
            ))}
            <Card
              href="/electivas/"
              className="vaultcard vaultcard--tool"
              style={{ "--i": VAULTS.length } as CSSProperties}
            >
              <div className="vaultcard__bannerwrap">{PLANNER_BANNER}</div>
              <h3>Planificador de electivas</h3>
              <p>
                Armá la carrera cuatrimestre por cuatrimestre: correlativas,
                minors, combinador de horarios y de finales, y un optimizador.
              </p>
              <span className="vaultcard__meta">
                Conocer el planner
                <Icon name="arrowRight" size={14} />
              </span>
            </Card>
          </CardGrid>
        </Reveal>
      </Section>

      {/* 3 · CTA final — banda compacta al planner */}
      <Section container>
        <Reveal as="div" className="home-cta">
          <div className="home-cta__copy">
            <Eyebrow>SYS // planificá</Eyebrow>
            <h2 className="section__title">Armá tu cursada en minutos.</h2>
            <p className="home-cta__lead">
              Correlativas, horarios, minors y finales — todo en una sola vista,
              cuatrimestre por cuatrimestre.
            </p>
          </div>
          <div className="home-cta__actions">
            <Button variant="primary" size="lg" href="/electivas/planificar/">
              Abrir el planificador
              <Icon name="arrowRight" size={16} />
            </Button>
            <Button variant="ghost" href={REPO_URL} external>
              <Icon name="github" size={16} />
              GitHub
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

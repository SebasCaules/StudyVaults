import {
  Reveal,
  Section,
  SectionHeading,
  Eyebrow,
  CardGrid,
  Card,
  CardIcon,
  Button,
} from "@studyvaults/ui";
import { getManifest } from "@/lib/content/manifest";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";
import GraphExplorer from "@/components/portal/GraphExplorer";
import { BANNERS } from "@/components/portal/VaultBanners";

export default async function Home() {
  const m = await getManifest();
  const counts: Record<string, number> = {};
  for (const v of VAULTS) {
    counts[v.id] = m.notes.filter((n) => n.vault === v.id && !n.isIndex).length;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* 1 · HERO */}
      <section className="home-hero home-hero--center container">
        <Reveal>
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
                <span className="accent">destilados</span> en un wiki navegable.
              </span>
            </span>
          </h1>
          <p className="home-sub">
            StudyVaults convierte los apuntes de siete materias de Ingeniería
            Informática del ITBA en wikis navegables: cada tema es una nota
            atómica, enlazada a las demás. Acá abajo está el grafo real de esas
            notas — cada punto es una página, cada línea un enlace entre ideas.
          </p>
          <div className="home-actions">
            <Button variant="primary" size="lg" href="#materias">
              Explorar materias
            </Button>
            <Button variant="ghost" size="lg" href={REPO_URL} external>
              Ver en GitHub
            </Button>
          </div>
          <div className="home-stats">
            <span>
              <b>{total}</b> páginas
            </span>
            <span>
              <b>{VAULTS.length}</b> vaults
            </span>
            <span>
              <b>~8.000</b> enlaces
            </span>
            <span>
              <b>1</b> planificador
            </span>
          </div>
        </Reveal>
      </section>

      {/* 2 · GRAFO */}
      <Section container>
        <Reveal>
          <SectionHeading
            eyebrow="SYS // el mapa de las notas"
            title="Todo el conocimiento, conectado."
            lead="Cada materia forma su propio cúmulo; las líneas son los enlaces entre notas. Pasá el cursor para identificar una página, hacé click para abrirla, o elegí una materia para aislar su red."
          />
        </Reveal>
        <Reveal>
          <GraphExplorer />
        </Reveal>
      </Section>

      {/* 3 · QUÉ ES */}
      <Section container className="home-prose">
        <Reveal>
          <SectionHeading
            eyebrow="SYS // qué es"
            title="Un archivo de la carrera, no un drive de PDFs."
            lead="Tomar apuntes no es lo mismo que entender. StudyVaults toma las carpetas sueltas de cada materia —teóricas, prácticas, parciales viejos— y las pasa por un mismo proceso: partir el contenido en notas chicas y autocontenidas, conectarlas entre sí y publicarlas como un sitio que se puede leer, buscar y recorrer. El resultado son siete vaults: uno por materia, todos con la misma estructura."
          />
        </Reveal>
      </Section>

      {/* 4 · MATERIAS */}
      <Section container id="materias">
        <Reveal>
          <SectionHeading
            eyebrow="SYS // índice de vaults"
            title="Una materia, un vault."
            lead="Siete materias de Ingeniería Informática del ITBA, cada una como una base de conocimiento independiente. El número junto a cada materia es la cantidad de páginas que contiene."
          />
        </Reveal>
        <CardGrid className="cards--vaults" style={{ marginTop: "32px" }}>
          {VAULTS.map((v, i) => (
            <Reveal as="div" delay={i * 50} key={v.id}>
              <Card href={`/${v.id}/`} className="vaultcard" data-vault={v.id}>
                <div className="vaultcard__bannerwrap">{BANNERS[v.id]}</div>
                <h3>{v.name}</h3>
                <p>{v.blurb}</p>
                <span className="vaultcard__meta">{counts[v.id]} páginas →</span>
              </Card>
            </Reveal>
          ))}
          <Reveal as="div" delay={VAULTS.length * 50}>
            <Card href="/electivas/" className="vaultcard">
              <div className="vaultcard__bannerwrap vaultcard__bannerwrap--tool">
                <CardIcon tone="blue">PL</CardIcon>
              </div>
              <h3>Planificador de electivas</h3>
              <p>
                App para planificar la carrera: mapa de correlativas, áreas y
                minors, créditos y armado de horario cuatrimestral.
              </p>
              <span className="vaultcard__meta">Abrir planner →</span>
            </Card>
          </Reveal>
        </CardGrid>
      </Section>

      {/* 5 · MÉTODO */}
      <Section container>
        <Reveal>
          <SectionHeading
            eyebrow="SYS // método"
            title="Destilado con IA, curado a mano."
          />
        </Reveal>
        <CardGrid className="cards--feature" style={{ marginTop: "32px" }}>
          {[
            {
              k: "Capturar",
              d: "El material crudo de la cursada —PDFs, fotos del pizarrón, guías, resoluciones— se junta en un vault de Obsidian por materia.",
            },
            {
              k: "Destilar",
              d: "Cada tema se reescribe como una nota atómica con un formato consistente: definición, desarrollo, ejemplos y enlaces. Un modelo de lenguaje asiste el reescrito; el criterio y la verificación son humanos.",
            },
            {
              k: "Enlazar",
              d: "Las notas se cruzan con wikilinks. Eso teje el grafo: estudiar un tema te lleva naturalmente a los que dependen de él.",
            },
          ].map((c, i) => (
            <Reveal as="div" delay={i * 60} key={c.k}>
              <Card>
                <CardIcon>{String(i + 1).padStart(2, "0")}</CardIcon>
                <h3>{c.k}</h3>
                <p>{c.d}</p>
              </Card>
            </Reveal>
          ))}
        </CardGrid>
        <Reveal>
          <p className="home-foot">
            No es material oficial de las cátedras. Son apuntes de un estudiante,
            abiertos por si le sirven a alguien más.
          </p>
        </Reveal>
      </Section>

      {/* 6 · CÓMO SE USA */}
      <Section container>
        <Reveal>
          <SectionHeading eyebrow="SYS // cómo se usa" title="Tres formas de entrar." />
        </Reveal>
        <CardGrid className="cards--feature" style={{ marginTop: "32px" }}>
          {[
            {
              k: "Por materia",
              d: "Elegí un vault en el índice de arriba. Cada uno abre con la estructura completa de unidades y temas en el riel lateral. Plegá lo que no necesites.",
            },
            {
              k: "Por búsqueda",
              d: "Apretá ⌘K y buscá cualquier término en las 782 páginas. Es instantáneo y funciona sin conexión.",
            },
            {
              k: "Por enlaces",
              d: "Seguí los wikilinks dentro de cada nota para saltar de un concepto al siguiente, o usá el grafo del inicio como mapa.",
            },
          ].map((c, i) => (
            <Reveal as="div" delay={i * 60} key={c.k}>
              <Card>
                <CardIcon tone="blue">{String(i + 1).padStart(2, "0")}</CardIcon>
                <h3>{c.k}</h3>
                <p>{c.d}</p>
              </Card>
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* 7 · ELECTIVAS */}
      <Section container>
        <Reveal as="div" className="home-band">
          <div>
            <Eyebrow>SYS // herramientas</Eyebrow>
            <h2 className="section__title">
              Planificá la carrera, no solo la cursada.
            </h2>
            <p className="home-lead" style={{ marginBottom: 0 }}>
              Además de los apuntes, StudyVaults incluye un planificador de
              electivas: un mapa interactivo de correlativas, áreas y minors,
              cómputo de créditos y armado del horario cuatrimestral. Pensado
              para decidir qué cursar y cuándo.
            </p>
          </div>
          <Button variant="primary" size="lg" href="/electivas/">
            Abrir el planificador →
          </Button>
        </Reveal>
      </Section>

      {/* 8 · LETRA CHICA */}
      <Section container>
        <Eyebrow>SYS // letra chica</Eyebrow>
        <p className="home-note">
          Material de estudio de un estudiante, con fines académicos. No es
          contenido oficial de ninguna cátedra del ITBA. Los vaults originales de
          Obsidian son la fuente de verdad; este sitio es una vista estática
          publicada de ese contenido.
        </p>
      </Section>
    </>
  );
}

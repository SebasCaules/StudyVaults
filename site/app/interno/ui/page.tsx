"use client";

import { useState } from "react";
import {
  Button,
  Icon,
  type IconName,
  Badge,
  Tag,
  Eyebrow,
  BigNum,
  Mono,
  Container,
  SectionHeading,
  Stack,
  Row,
  Card,
  CardGrid,
  CardIcon,
  ToolCard,
  SubPanel,
  PanelHeader,
  Note,
  Brand,
  BrandMark,
  NavLink,
  Breadcrumbs,
  ThemeToggle,
  Reveal,
  Modal,
  Drawer,
  Tabs,
  Field,
  TextInput,
  TextArea,
  Select,
  Slider,
  Chip,
  KeyValue,
  Readout,
  DataTable,
  CopyButton,
  CodeBlock,
} from "@studyvaults/ui";
import { Demo, Specimen } from "./parts";

const ICONS: IconName[] = [
  "search", "sun", "moon", "menu", "close", "arrowRight", "arrowLeft",
  "external", "chevronRight", "chevronDown", "check", "copy", "github",
  "info", "spinner",
];

const TOC: { id: string; label: string }[] = [
  { id: "buttons", label: "Buttons" },
  { id: "icons", label: "Icons" },
  { id: "badges", label: "Badges & Tags" },
  { id: "cards", label: "Cards" },
  { id: "layout", label: "Layout" },
  { id: "surfaces", label: "Surfaces" },
  { id: "forms", label: "Forms" },
  { id: "data", label: "Data" },
  { id: "overlays", label: "Overlays" },
  { id: "nav", label: "Navigation" },
  { id: "motion", label: "Motion" },
];

const SNIPPET = `import { Button, Card, SectionHeading } from "@studyvaults/ui";

<SectionHeading eyebrow="SYS // demo" title="Hola" />
<Card href="/mna/">Análisis numérico →</Card>
<Button variant="primary" size="lg" href="#go">Explorar</Button>`;

export default function DesignSystemPage() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [name, setName] = useState("Tu nombre");
  const [bio, setBio] = useState("Escribí algo sobre vos…");
  const [vault, setVault] = useState("mna");
  const [credits, setCredits] = useState(18);
  const [picked, setPicked] = useState<string[]>(["álgebra", "grafos"]);

  const togglePick = (c: string) =>
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <Container as="section" style={{ paddingTop: "calc(var(--nav-h) + 40px)", paddingBottom: "96px" }}>
      {/* ── header ── */}
      <Breadcrumbs
        items={[{ label: "Interno", href: "/" }, { label: "Sistema de diseño" }]}
      />
      <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <div>
          <Eyebrow>SYS // @studyvaults/ui</Eyebrow>
          <h1 className="section__title" style={{ fontSize: "clamp(34px, 5vw, 52px)", marginTop: "8px" }}>
            Librería de componentes.
          </h1>
          <p className="home-lead" style={{ maxWidth: "62ch" }}>
            Catálogo vivo del sistema de diseño <Mono>Technical Split</Mono>. Cada
            espécimen es el componente real importado desde el package privado —
            misma fuente que consume todo el sitio. Probá el toggle de tema (arriba
            a la derecha): todo conmuta por tokens.
          </p>
        </div>
        <Stack gap={10} style={{ flex: "0 0 auto" }}>
          <Badge variant="status">v1.0.0</Badge>
          <Badge variant="sys">interno</Badge>
          <Badge variant="solid">0 deps</Badge>
        </Stack>
      </Row>

      <Readout
        style={{ marginTop: "28px", maxWidth: "420px" }}
        items={[
          { k: "Componentes", v: "40+" },
          { k: "Categorías", v: "6" },
          { k: "Dependencias", v: "react · next", tone: "accent" },
          { k: "Tokens de color base", v: "6 hex", tone: "coral" },
        ]}
      />

      {/* ── índice ── */}
      <Row style={{ marginTop: "28px", gap: "4px" }}>
        {TOC.map((t) => (
          <NavLink key={t.id} href={`#${t.id}`}>
            {t.label}
          </NavLink>
        ))}
      </Row>

      <div style={{ marginTop: "44px" }}>
        {/* ── BUTTONS ── */}
        <Demo
          id="buttons"
          eyebrow="primitives"
          title="Button"
          description="Polimórfico: button / next-link / anchor externo. Cinco variantes, tres tamaños, pill, deshabilitado e íconos."
        >
          <Stack gap={22}>
            <Specimen label="Variantes">
              <Button variant="primary">Primary</Button>
              <Button variant="blue">Blue</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="monolabel">
                Monolabel <Icon name="arrowRight" size={15} />
              </Button>
            </Specimen>
            <Specimen label="Tamaños">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" pill>Pill</Button>
            </Specimen>
            <Specimen label="Con ícono · estados · link">
              <Button variant="secondary">
                <Icon name="search" size={15} /> Buscar
              </Button>
              <Button variant="primary" disabled>Deshabilitado</Button>
              <Button variant="ghost" href="https://github.com" external>
                <Icon name="github" size={15} /> GitHub
              </Button>
            </Specimen>
          </Stack>
        </Demo>

        {/* ── ICONS ── */}
        <Demo
          id="icons"
          eyebrow="primitives"
          title="Icon"
          description="Set de íconos de línea (stroke=currentColor); heredan color y escalan con size."
        >
          <Row style={{ gap: "16px" }}>
            {ICONS.map((n) => (
              <Specimen key={n} label={n}>
                <span style={{ color: "var(--ink-strong)" }}>
                  <Icon name={n} size={22} />
                </span>
              </Specimen>
            ))}
          </Row>
        </Demo>

        {/* ── BADGES & TAGS ── */}
        <Demo
          id="badges"
          eyebrow="primitives"
          title="Badge · Tag · Eyebrow · BigNum · Mono"
          description="Etiquetas mono, antetítulos y números display."
        >
          <Stack gap={22}>
            <Specimen label="Badge">
              <Badge>Default</Badge>
              <Badge variant="status">En curso</Badge>
              <Badge variant="sys">Sistema</Badge>
              <Badge variant="solid">v2.0</Badge>
            </Specimen>
            <Specimen label="Tag">
              <Tag>álgebra</Tag>
              <Tag>grafos</Tag>
              <Tag href="#data">clickeable</Tag>
            </Specimen>
            <Specimen label="Eyebrow / Mono">
              <Eyebrow>SYS // antetítulo</Eyebrow>
              <Mono>npm install</Mono>
            </Specimen>
            <Specimen label="BigNum">
              <BigNum value="782" unit="páginas" />
              <BigNum value="7" unit="vaults" />
            </Specimen>
          </Stack>
        </Demo>

        {/* ── CARDS ── */}
        <Demo
          id="cards"
          eyebrow="layout"
          title="Card · CardGrid · CardIcon"
          description="Superficie con barra de acento al hover; polimórfica (link interno/externo/estática). La grilla es auto-fit."
        >
          <CardGrid min={240}>
            <Card href="/mna/">
              <CardIcon>01</CardIcon>
              <h3>Con link interno</h3>
              <p>Toda la card es un next/link. Hover para ver la barra de acento.</p>
            </Card>
            <Card href="https://obsidian.md" external>
              <CardIcon tone="blue">
                <Icon name="external" size={18} />
              </CardIcon>
              <h3>Link externo</h3>
              <p>Renderiza un anchor con target _blank y rel seguro.</p>
            </Card>
            <Card>
              <CardIcon tone="blue">PL</CardIcon>
              <h3>Estática</h3>
              <p>Sin href: es un div. Sirve de contenedor presentacional.</p>
            </Card>
          </CardGrid>
        </Demo>

        {/* ── LAYOUT ── */}
        <Demo
          id="layout"
          eyebrow="layout"
          title="SectionHeading · Stack · Row · ToolCard · ThemeToggle"
          description="Estructura y chrome. Section/Container envuelven el contenido (esta misma página los usa); SectionHeading es el encabezado de cada demo de acá."
        >
          <Stack gap={24}>
            <Specimen label="SectionHeading (con / sin lead)">
              <Stack gap={18} style={{ width: "100%" }}>
                <SectionHeading
                  eyebrow="SYS // ejemplo"
                  title="Con eyebrow, título y bajada"
                  lead="La bajada es opcional; se renderiza sólo si pasás `lead`."
                />
                <SectionHeading title="Sólo título (nivel 3)" level={3} />
              </Stack>
            </Specimen>
            <Specimen label="Stack (gap) · Row (wrap)">
              <Stack gap={8} style={{ width: "160px" }}>
                <Badge variant="status">apilado</Badge>
                <Badge variant="sys">vertical</Badge>
                <Badge variant="solid">gap 8</Badge>
              </Stack>
              <Row>
                <Chip>en fila</Chip>
                <Chip>que envuelve</Chip>
                <Chip>en mobile</Chip>
              </Row>
            </Specimen>
            <Specimen label="ToolCard (lanzador)">
              <CardGrid min={240} style={{ width: "100%" }}>
                <ToolCard
                  href="/mna/herramientas"
                  icon={<Icon name="search" size={18} />}
                  kind="Interactivo"
                  title="Toolkit de estudio"
                  description="Calculadoras y exploradores a medida de la materia."
                  cta="Abrir toolkit →"
                />
                <ToolCard
                  href="https://obsidian.md"
                  external
                  icon={<Icon name="external" size={18} />}
                  kind="App"
                  title="App externa"
                  description="Abre en una pestaña nueva, con el ↗ de externo."
                  cta="Abrir"
                />
              </CardGrid>
            </Specimen>
            <Specimen label="ThemeToggle">
              <ThemeToggle variant="desktop" />
            </Specimen>
            <Note>
              El chrome de esta página ya son componentes del sistema: la barra
              superior es <Mono>Navbar</Mono>, el pie es <Mono>Footer</Mono>, el
              fondo de partículas es <Mono>AmbientLayer</Mono> y el tema lo fija{" "}
              <Mono>ThemeScript</Mono> (anti-flash) + <Mono>ThemeToggle</Mono>.
            </Note>
          </Stack>
        </Demo>

        {/* ── SURFACES ── */}
        <Demo
          id="surfaces"
          eyebrow="layout"
          title="Panel · SubPanel · PanelHeader · Note · Stack · Row"
          description="Superficies y composición. Este mismo stage es un Panel."
        >
          <Stack gap={16}>
            <SubPanel>
              <PanelHeader
                eyebrow="ejemplo"
                title="Encabezado de panel"
                description="Eyebrow + título + descripción, con acciones a la derecha."
                actions={<Button variant="ghost" size="sm">Acción</Button>}
              />
              <Row>
                <KeyValue k="Estado" v="OK" tone="accent" />
                <KeyValue k="Items" v="12" />
              </Row>
            </SubPanel>
            <Note>Esto es una nota de ayuda (borde de acento, texto mono).</Note>
            <Note tone="error">Y esta es una nota de error (coral).</Note>
          </Stack>
        </Demo>

        {/* ── FORMS ── */}
        <Demo
          id="forms"
          eyebrow="forms"
          title="Field · TextInput · TextArea · Select · Slider · Chip"
          description="Controles de formulario sobre el chrome del toolkit. Interactivos: probalos."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
            <Field label="Nombre" hint={`${name.length} car.`}>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Materia">
              <Select
                value={vault}
                onChange={(e) => setVault(e.target.value)}
                options={[
                  { value: "mna", label: "Métodos numéricos" },
                  { value: "proba", label: "Probabilidad" },
                  { value: "paw", label: "PAW" },
                ]}
              />
            </Field>
            <Field label="Bio" hint="textarea">
              <TextArea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </Field>
            <Field label="Créditos" hint={String(credits)}>
              <Slider
                min={0}
                max={36}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              />
            </Field>
          </div>
          <Specimen label="Chip (toggle)">
            {["álgebra", "grafos", "redes", "compiladores"].map((c) => (
              <Chip
                key={c}
                active={picked.includes(c)}
                tone={picked.includes(c) ? "ok" : "default"}
                onClick={() => togglePick(c)}
              >
                {c}
              </Chip>
            ))}
          </Specimen>
        </Demo>

        {/* ── DATA ── */}
        <Demo
          id="data"
          eyebrow="data"
          title="KeyValue · Readout · DataTable · CodeBlock · CopyButton"
          description="Lectura de datos: pares clave-valor, tablas y bloques de código."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <Specimen label="Readout" grow>
              <Readout
                style={{ width: "100%" }}
                items={[
                  { k: "h/sem", v: "22" },
                  { k: "Días con clase", v: "4" },
                  { k: "Días libres", v: "1", tone: "accent" },
                  { k: "Conflictos", v: "0", tone: "coral" },
                ]}
              />
            </Specimen>
            <Specimen label="DataTable" grow>
              <DataTable
                columns={[
                  { key: "comp", header: "Componente" },
                  { key: "cat", header: "Categoría" },
                  { key: "client", header: "Cliente", align: "center" },
                ]}
                rows={[
                  { comp: <Mono>Button</Mono>, cat: "primitives", client: "no" },
                  { comp: <Mono>Modal</Mono>, cat: "feedback", client: "sí" },
                  { comp: <Mono>Field</Mono>, cat: "forms", client: "no" },
                ]}
              />
            </Specimen>
          </div>
          <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
            <Row style={{ justifyContent: "space-between" }}>
              <Eyebrow>uso</Eyebrow>
              <CopyButton text={SNIPPET} />
            </Row>
            <CodeBlock>{SNIPPET}</CodeBlock>
          </div>
        </Demo>

        {/* ── OVERLAYS ── */}
        <Demo
          id="overlays"
          eyebrow="feedback"
          title="Tabs · Modal · Drawer"
          description="Pestañas y superposiciones. Modal y Drawer cierran con Escape o click en el scrim."
        >
          <Stack gap={20}>
            <Tabs
              tabs={[
                { id: "over", label: "Resumen" },
                { id: "props", label: "Props" },
                { id: "a11y", label: "A11y" },
              ]}
              defaultValue="over"
              panels={{
                over: <p style={{ margin: "14px 0 0", color: "var(--text-secondary)" }}>Tabs no controlado: mantiene su propio estado. También acepta value+onChange.</p>,
                props: <p style={{ margin: "14px 0 0", color: "var(--text-secondary)" }}>tabs, value?, defaultValue?, onChange?, panels?</p>,
                a11y: <p style={{ margin: "14px 0 0", color: "var(--text-secondary)" }}>role=tablist/tab/tabpanel + aria-selected.</p>,
              }}
            />
            <Specimen label="Triggers">
              <Button variant="secondary" onClick={() => setModal(true)}>Abrir Modal</Button>
              <Button variant="secondary" onClick={() => setDrawer(true)}>Abrir Drawer</Button>
            </Specimen>
          </Stack>

          <Modal open={modal} onClose={() => setModal(false)} title="Diálogo de ejemplo" width={520}>
            <p style={{ marginTop: 0, color: "var(--text-secondary)" }}>
              Centrado sobre un scrim con blur. Cerrá con Escape, con el botón ✕, o
              haciendo click afuera.
            </p>
            <Row style={{ marginTop: "16px", justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => setModal(false)}>Aceptar</Button>
            </Row>
          </Modal>

          <Drawer open={drawer} onClose={() => setDrawer(false)} title="Panel lateral" width={380}>
            <Stack gap={12}>
              <KeyValue k="Tipo" v="Drawer" tone="accent" />
              <KeyValue k="Lado" v="derecha" />
              <Note>Mismo contrato que Modal: open + onClose.</Note>
              <Button variant="primary" onClick={() => setDrawer(false)}>Cerrar</Button>
            </Stack>
          </Drawer>
        </Demo>

        {/* ── NAVIGATION ── */}
        <Demo
          id="nav"
          eyebrow="navigation"
          title="Brand · BrandMark · NavLink · Breadcrumbs"
          description="Chrome de navegación. La Navbar y el Footer de esta misma página son los componentes del sistema."
        >
          <Stack gap={22}>
            <Specimen label="BrandMark / Brand">
              <span style={{ color: "var(--ink-strong)" }}>
                <BrandMark />
              </span>
              <Brand />
            </Specimen>
            <Specimen label="NavLink">
              <NavLink href="#buttons" active>Activo</NavLink>
              <NavLink href="#icons">Inactivo</NavLink>
              <NavLink href="https://itba.edu.ar" external>Externo</NavLink>
            </Specimen>
            <Specimen label="Breadcrumbs">
              <Breadcrumbs
                items={[
                  { label: "Inicio", href: "/" },
                  { label: "MNA", href: "/mna/" },
                  { label: "Factorización LU" },
                ]}
              />
            </Specimen>
            <Specimen label="Tint por materia (data-vault)">
              <Row>
                {(["mna", "economia", "sds", "inge2"] as const).map((id) => (
                  <span key={id} data-vault={id}>
                    <CardIcon tone="blue" style={{ background: "color-mix(in srgb, var(--vault-tint) 16%, transparent)", borderColor: "color-mix(in srgb, var(--vault-tint) 38%, transparent)", color: "var(--ink-strong)" }}>
                      {id}
                    </CardIcon>
                  </span>
                ))}
              </Row>
            </Specimen>
          </Stack>
        </Demo>

        {/* ── MOTION ── */}
        <Demo
          id="motion"
          eyebrow="feedback"
          title="Reveal"
          description="Aparición al hacer scroll (IntersectionObserver), con stagger por delay. Respeta prefers-reduced-motion."
        >
          <CardGrid min={200}>
            {[0, 1, 2, 3].map((i) => (
              <Reveal as="div" delay={i * 80} key={i}>
                <Card>
                  <CardIcon>{`0${i + 1}`}</CardIcon>
                  <h3>Reveal #{i + 1}</h3>
                  <p>Entra escalonado al cruzar el viewport.</p>
                </Card>
              </Reveal>
            ))}
          </CardGrid>
        </Demo>
      </div>
    </Container>
  );
}

---
name: studyvault-toolkit
description: Arma o extiende el toolkit interactivo de una materia de StudyVaults (la ruta /[vault]/herramientas) siguiendo el patron del repo. Usala cuando el usuario pida "agregar una herramienta interactiva a una materia", "armar/crear el toolkit de <materia>", "extender /herramientas con una tool nueva", "sumar una calculadora/quiz/flashcards/clasificador interactivo al vault", "agregar una tab al toolkit", "armar un flujo de estudio multi-herramienta con progreso" o similar. Cubre los dos casos: agregar UNA tool a un toolkit existente, y crear el toolkit de un vault que todavia no tiene (flag toolkit:true). Cablea vaults.ts <-> registry.tsx <-> XxxTools.tsx, respeta static-export safe + @studyvaults/ui + tokens, y opcionalmente el patron de progreso compartido tipo Inge2.
---

# studyvault-toolkit

Arma o extiende un **toolkit interactivo por materia** de StudyVaults: las herramientas
React que viven en la ruta `/[vault]/herramientas` (calculadoras, quizzes, flashcards,
clasificadores guiados, walkthroughs). El objetivo es **determinismo**: con mínima
instrucción, la skill elige el patrón correcto, cablea las tres puntas del registro y
produce código que renderiza, persiste, es reactivo y compila limpio.

> **Leé esto primero:** `.claude/skills/_shared/PROJECT.md` — el contrato compartido de
> todas las skills `studyvault-*` (arquitectura del sitio, convenciones, trampas de
> verificación). Si algo de acá choca con el código, **gana el código**.
>
> **Y leé `site/AGENTS.md`:** este Next.js (16, App Router, `output: 'export'`) tiene
> breaking changes vs. lo que conocés. Consultá `node_modules/next/dist/docs/` antes de
> escribir código de Next y respetá las deprecations.

Todos los paths son relativos a la raíz del repo (`StudyVaultsITBA/`). El cwd del sitio
es `site/`.

## El patrón en una imagen

Un toolkit es una **isla cliente** montada por la ruta estática. Hay **tres puntas** que
SIEMPRE deben quedar en sync:

```
site/lib/content/vaults.ts          ──→  toolkit: true   (en el VaultConfig de la materia)
        │
        ▼
site/components/vault-tools/registry.tsx  ──→  TOOLKITS[<id>] = <XxxTools>
        │
        ▼
site/components/vault-tools/XxxTools.tsx  ──→  arma las tabs con <ToolkitShell tools=[…] />
```

- La ruta `site/app/[vault]/herramientas/page.tsx` ya es genérica: hace
  `generateStaticParams()` filtrando `VAULTS.filter(v => v.toolkit)`, busca el componente
  en `TOOLKITS[vault]` y lo monta dentro de `WikiLayout` con `wide` y `toc={[]}` (sin TOC).
  **No se toca** salvo que cambie el contrato de la ruta.
- El catch-all de notas `site/app/[vault]/[...slug]/page.tsx` filtra el slug `herramientas`
  (y `hojas`) para no intentar renderizarlo como `.md`. Si ya existía la ruta, ya está
  filtrado; verificá que no se haya roto el guard.

### `ToolkitShell` — el contenedor de tabs

`site/components/vault-tools/ToolkitShell.tsx` recibe `tools: Tool[]` (+ `intro?`) y
renderiza una **grilla de cards-lanzador**: una card por herramienta, agrupadas por
`group` opcional; al abrir una se monta sólo esa tool a ancho completo. La interfaz `Tool`:

```ts
interface Tool {
  key: string;        // id estable (slug corto)
  label: string;      // título de la card / del breadcrumb
  node: ReactNode;    // el componente de la herramienta
  group?: string;     // categoría opcional → encabezado de grupo en la grilla
  icon?: ToolIconName; // glifo de la card (ver components/vault-tools/ToolIcon.tsx)
  desc?: ReactNode;   // una línea en lenguaje llano: qué hace y para qué sirve
  verb?: string;      // verbo del CTA: "Calcular", "Practicar", "Repasar"…
}
```

`ToolIconName` es un union cerrado en `components/vault-tools/ToolIcon.tsx`
(`calculator`, `sigma`, `shield`, `scale`, `cards`, `question`, `lock`, `checklist`,
`branch`, `gears`, `flow`, `clock`, `percent`, `book`…). Elegí uno existente; si no encaja
ninguno, agregá el glifo nuevo a `ToolIcon.tsx` (viewBox 24×24, `stroke="currentColor"`).

### Anatomía de una herramienta

Cada herramienta es una función React `"use client"` que devuelve un `<Panel>` con un
`<div className="vtool-head">` (eyebrow + h3 + p) y el cuerpo. Reglas:

- **Presentación con `@studyvaults/ui`** (catálogo en `site/packages/ui/README.md`):
  `Panel`, `SubPanel`, `Note`, `Chip`, `Field`, `TextInput`, `TextArea`, `Select`,
  `Slider`, `Button`, `Badge`, `BigNum`, `Readout`, `KeyValue`, `DataTable`, `CopyButton`,
  `Mono`. **No reinventes** inputs ni paneles.
- **Clases crudas `.vtool-*`** sólo para layout/tablas/plots que el DS no cubre:
  `vtool-head`, `vtool-stack`, `vtool-row`, `vtool-grid`, `vtool-grid--ctrl`, `vtool-field`,
  `vtool-label`, `vtool-readout`, `vtool-kv`, `vtool-eyebrow`, `vtool-mono`, `vtool-table`,
  `vtool-matrix`, `vtool-mout`, `vtool-code`, `vtool-plot`. Están definidas en
  `site/packages/ui/src/styles/toolkit.css`. **No inventes** clases `.vtool-*` nuevas: si
  necesitás una, agregala a `toolkit.css`.
- **Tokens §12, no hex.** En estilos inline usá variables CSS de rol (`var(--ink-strong)`,
  `var(--primary)`, `var(--accent)`, `var(--hairline)`, `var(--vault-tint)`, …). El tinte
  por materia sale solo del `[data-vault]` del layout.
- **Lógica pura en helpers, no en el componente.** La matemática/algoritmos van en módulos
  puros y testeables. Los existentes viven en `site/components/vault-tools/lib/`
  (`linalg.ts`, `stats.ts`) — **no** en `site/lib/`. Importás `from "./lib/linalg"`.
- **Idioma:** español rioplatense, salvo PAW e Inge2 que nacen en inglés y mantienen su
  idioma en el contenido de las tools (mirá `cfg.lang` en `vaults.ts`).

### Static-export safe (no negociable)

El HTML es estático; la tool se hidrata en cliente. **Todo acceso a `window`/`localStorage`
va detrás de un guard** (`typeof window !== "undefined"`) o dentro de un `useEffect` /
event handler — nunca en el cuerpo del render. Patrón de persistencia (calcado de
`inge2/Flashcards.tsx`):

```tsx
const [state, setState] = useState<T>(initial);   // SSR: valor por defecto
const [hydrated, setHydrated] = useState(false);
useEffect(() => {                                 // montaje: cargar lo guardado
  setState(loadJSON(KEY, initial));
  setHydrated(true);
}, []);
useEffect(() => {                                 // persistir post-hidratación
  if (!hydrated) return;
  saveJSON(KEY, state);
}, [state, hydrated]);
```

`Date.now()` y `Math.random()` sólo en handlers/effects (rompen la hidratación si se
evalúan en render directo).

## Patrón opcional: progreso compartido (flujo multi-herramienta)

Cuando lo que se arma NO es una tool suelta sino un **flujo de estudio de varias
herramientas que alimentan un dashboard** (tipo el "Plan de recu" de Inge2: flashcards +
quiz + drills + dashboard de readiness por unidad), conviene el contrato de progreso
compartido. Referencia viva:

- `site/components/vault-tools/inge2/types.ts` — el backbone de tipos: el union `UnitId`
  (taxonomía de unidades del programa) + `UNIT_IDS` + las interfaces de cada tipo de ítem
  (`Flashcard`, `QuizQuestion`, …). **Todas** las data modules y componentes referencian
  `UnitId` desde acá.
- `site/components/vault-tools/inge2/progress.ts` — el pub/sub:
  `publishContribution(tool, byUnit)` (cada tool publica su dominio 0..1 por unidad),
  `loadContributions()` / `unitMastery(unit)` / `overallReadiness()` (el dashboard lee y
  agrega), `onProgress(cb)` (suscripción: CustomEvent mismo-tab + `storage` cross-tab),
  `resetAllProgress()`, y los helpers `loadJSON`/`saveJSON`/`toolKey`/`clamp01`. Keys
  namespaceadas con prefijo de versión (`inge2.v1.*`): bumpear el prefijo invalida el
  progreso viejo.
- `site/components/vault-tools/inge2/data/*.ts` — un módulo de datos puro por herramienta
  (`flashcards.ts`, `quiz.ts`, …) tipado contra `types.ts`; `data/units.ts` lleva el
  metadato (`label`, `blurb`, slugs de `wiki/` para deep-links).
- `site/components/vault-tools/inge2/StudyDashboard.tsx` — consume `onProgress` + recalcula
  con `useEffect`/`useMemo`.

El **decoupling** es la clave: el dashboard nunca conoce el formato interno de cada tool
(cajas Leitner, historial de quiz…); sólo ve un `{mastery, seen, total}` por (tool, unidad).

**Cuándo usarlo:** ≥3 herramientas que comparten una taxonomía de unidades y querés un
dashboard de readiness. **Cuándo NO:** una calculadora, un clasificador o una sola tool de
práctica → no metas `progress.ts`, es over-engineering; basta el patrón de persistencia
local de arriba. Resumen autocontenido del contrato en `assets/PROGRESO_CONTRATO.md`.

## Dos arquitecturas de archivo según tamaño

- **Monolítico** (`MnaTools.tsx`, `EconomiaTools.tsx`, `ProbaTools.tsx`): todas las tools
  como funciones en UN archivo, datos puros arriba, `export default XxxTools()` con el
  array `tools` y `<ToolkitShell>` al final. Ideal para 3–6 calculadoras/referencias que
  comparten helpers de `lib/`.
- **Modular** (`Inge2Tools.tsx` + carpeta `inge2/`): `XxxTools.tsx` sólo orquesta las tabs;
  cada herramienta es su propio archivo en `vault-tools/<vault>/`, con `types.ts`,
  `progress.ts` y `data/` cuando hay flujo de estudio. Ideal para toolkits grandes o con
  progreso compartido.

Para **agregar una tool** a un toolkit existente, seguí la arquitectura que ya usa ese
toolkit (no mezcles estilos).

## Procedimiento

### Caso A — agregar UNA herramienta a un toolkit existente

1. **Leé el contexto.** `_shared/PROJECT.md`, `site/AGENTS.md`, este SKILL.md, y el
   `XxxTools.tsx` del vault destino (+ su carpeta `vault-tools/<vault>/` si es modular).
   Confirmá que el vault ya tiene `toolkit: true` en `vaults.ts` y entrada en `TOOLKITS`.
2. **Ubicá la fuente.** La herramienta tiene que reflejar la materia: leé las páginas de
   `wiki/` relevantes (o el material que da el usuario) para que datos y explicaciones sean
   fieles. No inventes contenido técnico.
3. **Escribí la lógica pura primero.** Si hay cálculo/algoritmo, ponelo en un helper de
   `components/vault-tools/lib/` (o `vault-tools/<vault>/` en modular), tipado y sin React.
4. **Escribí el componente de la tool** (`"use client"`): `<Panel>` + `vtool-head` + cuerpo
   con componentes de `@studyvaults/ui`. Persistencia (si hay) con el patrón hydrated→load
   →save. Static-export safe.
5. **Registrá la tab** en el array `tools` de `XxxTools.tsx`: `{ key, label, icon, verb,
   desc, node: <TuTool /> }`, con `group` si el toolkit agrupa. `key` único; `desc` en
   lenguaje llano; `icon` de los existentes en `ToolIcon.tsx`.
6. **Verificá** (sección Verificación). `tsc` + `next build` + browser.

### Caso B — crear el toolkit de un vault sin toolkit

1. **Leé el contexto** (igual que A) + un toolkit existente entero como molde: `MnaTools.tsx`
   (monolítico) o `Inge2Tools.tsx` + `inge2/` (modular con progreso). Elegí arquitectura
   según el tamaño previsto.
2. **Prendé el flag** en `site/lib/content/vaults.ts`: agregá `toolkit: true` al
   `VaultConfig` de la materia. (Si fuera necesario, dejá un comentario corto como hacen los
   demás vaults explicando qué consolida.)
3. **Creá el componente** `site/components/vault-tools/<Xxx>Tools.tsx` partiendo de
   `assets/TOOL_TEMPLATE.tsx`: 2–4 herramientas reales de la materia (datos de `wiki/`),
   `export default` que arma `tools: Tool[]` y devuelve `<ToolkitShell intro={…} tools={…} />`.
   Lógica pura en `lib/` o en la carpeta del vault.
4. **Registrá** en `site/components/vault-tools/registry.tsx`: import del componente +
   `TOOLKITS[<id>] = <Xxx>Tools`. El `<id>` debe ser el `VaultId` exacto.
5. **(Opcional) progreso compartido:** si es un flujo multi-herramienta, montá
   `vault-tools/<vault>/` con `types.ts` (`UnitId` propio + `UNIT_IDS`), `progress.ts`
   (cambiá el namespace a `<vault>.v1.`), `data/*.ts` y un dashboard. Ver
   `assets/PROGRESO_CONTRATO.md`.
6. **Verificá** (sección Verificación). Confirmá que `/[vault]/herramientas` aparece en el
   build (la ruta la genera sola al estar el flag + el registry).

## Verificación

Antes de declarar hecho (las trampas están en `_shared/PROJECT.md §4`):

1. **`tsc` limpio.** Desde `site/`: `npx tsc --noEmit` (o el script del repo). Cero errores.
2. **`next build` verde.** Usá `./run.sh build` desde la raíz (limpia cachés y sirve fiel a
   GH Pages). **No corras `next build` con `next dev` prendido** (comparten `.next` y se
   corrompe). Si tocaste CSS (`toolkit.css`, `globals.css`) y no se refleja: `rm -rf .next`
   / `./run.sh clean` antes de concluir que "no anduvo".
3. **Browser, vía Claude Preview MCP** (`preview_*`): andá a `/StudyVaults/<vault>/herramientas`,
   abrí la card de la tool nueva y comprobá que (a) **renderiza**, (b) **interactúa** (inputs
   recalculan, chips filtran, quiz califica), (c) **persiste** (recargá: el estado sigue), y
   (d) es **reactivo** (si hay dashboard de progreso, se actualiza al usar otra tool).
   Mostrá evidencia (screenshot / consola sin errores / build verde). Nunca le pidas al
   usuario que chequee a mano.

## Checklist final

- [ ] Las **tres puntas** en sync: `toolkit: true` en `vaults.ts` ↔ entrada en `TOOLKITS`
      de `registry.tsx` ↔ `XxxTools.tsx` con la tool en el array.
- [ ] `XxxTools.tsx` arma las tabs con `<ToolkitShell tools={…} />`; cada `Tool` tiene
      `key` único, `label`, `desc` en lenguaje llano, `icon` válido de `ToolIcon.tsx` y
      `verb`.
- [ ] Componentes `"use client"` sólo donde hay hooks/DOM; presentación con
      `@studyvaults/ui`; clases crudas sólo `.vtool-*` existentes de `toolkit.css`.
- [ ] **Static-export safe**: nada de `window`/`localStorage`/`Date.now()`/`Math.random()`
      en render directo; todo detrás de guard/`useEffect`/handler. Persistencia con el
      patrón hydrated→load→save.
- [ ] Lógica pura en helpers (`components/vault-tools/lib/` o la carpeta del vault), no en
      el componente. Sin hex hardcodeado: tokens §12 (`var(--…)`).
- [ ] Datos fieles a la materia (leídos de `wiki/`), no inventados. Idioma según `cfg.lang`.
- [ ] Si es flujo multi-herramienta: contrato de progreso de `progress.ts`/`types.ts` con
      namespace `<vault>.v1.*`; si es una tool suelta, **sin** `progress.ts`.
- [ ] `tsc` limpio + `next build` verde + verificado en browser (renderiza, interactúa,
      persiste, reactivo).

## Instalación

La skill vive en `.claude/skills/studyvault-toolkit/` (con su `assets/`). Es específica del
repo StudyVaults: depende de la estructura de `site/` y de `@studyvaults/ui`, así que se usa
dentro de este repo. Para instalarla en otra copia, copiá la carpeta entera a
`.claude/skills/` del proyecto destino. Leé siempre `_shared/PROJECT.md` primero.

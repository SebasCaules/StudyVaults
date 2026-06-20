# Contrato de progreso compartido (flujo multi-herramienta)

Resumen autocontenido del patrón que usa el toolkit de Inge2 (el "Plan de recu"):
varias herramientas de estudio que publican su dominio por unidad y un dashboard que lo
agrega. Referencia viva (la fuente de verdad es el código, no este doc):

- `site/components/vault-tools/inge2/types.ts`
- `site/components/vault-tools/inge2/progress.ts`
- `site/components/vault-tools/inge2/data/*.ts` (un módulo por herramienta + `units.ts`)
- `site/components/vault-tools/inge2/StudyDashboard.tsx`

## Cuándo usarlo

- **Sí:** ≥3 herramientas que comparten una taxonomía de unidades del programa y querés un
  dashboard de readiness por unidad (flashcards + quiz + drills + dashboard).
- **No:** una calculadora, un clasificador guiado, o una sola tool de práctica. Para esos
  alcanza el patrón de persistencia local (`hydrated → load → save`) del
  `TOOL_TEMPLATE.tsx`. Meter `progress.ts` ahí es over-engineering.

## Las piezas

### 1. `types.ts` — backbone de tipos

- Un union **`UnitId`** con las unidades del programa + el array **`UNIT_IDS`** en orden
  canónico. Es la fuente de verdad de la cobertura: toda data module y todo componente
  referencian `UnitId` desde acá. No inventar unidades sin tocar este archivo.
- Las interfaces de cada tipo de ítem (`Flashcard`, `QuizQuestion`, `MechanismItem`, …),
  cada una con su `unit: UnitId` y un `wiki?` (slug de la página de respaldo).
- `UnitMeta` (`id`, `label`, `blurb`, `wiki: string[]`) — el metadato que consume el
  dashboard; vive en `data/units.ts`.

### 2. `progress.ts` — pub/sub de progreso (static-export safe)

Cada herramienta es dueña de cómo calcula su dominio; sólo expone un número 0..1 por unidad.
El dashboard nunca conoce el formato interno (cajas Leitner, historial de quiz, …).

Tipos:

```ts
type Tool = "flashcards" | "quiz" | "mechanism" | "tradeoff" | "antipattern"; // las tools del flujo
interface Contribution { mastery: number; seen: number; total: number; } // 0..1, ítems vistos, totales
type ContributionMap = Partial<Record<Tool, Partial<Record<UnitId, Contribution>>>>;
```

API que publica cada herramienta:

- `publishContribution(tool, byUnit)` — reemplaza la contribución de esa tool con el mapa de
  TODAS las unidades que cubre. Se llama tras cada cambio de estado (en el `useEffect` de
  persistencia). Emite el evento de progreso.

API que lee el dashboard:

- `loadContributions(): ContributionMap`
- `unitMastery(unit, contrib?): number` — promedio de las masteries de las tools con señal
  (`seen > 0`) para esa unidad; sin señal → 0 (honesto: "todavía no lo trabajaste").
- `unitTouched(unit, contrib?): boolean`
- `overallReadiness(contrib?): number` — promedio de `unitMastery` sobre `UNIT_IDS`.

Pub/sub (reactividad):

- `onProgress(cb): () => void` — suscribe a cambios: mismo tab vía `CustomEvent` + otros tabs
  vía evento `storage`. Devuelve unsubscribe. El dashboard lo usa en un `useEffect`.
- `emitProgress()` — dispara la notificación (lo llama `publishContribution`/`saveJSON`).
- `resetAllProgress()` — borra TODAS las keys del namespace.

Storage genérico + utils: `loadJSON`/`saveJSON` (detrás de guard `typeof window`),
`toolKey(tool, suffix)` (key namespaceada para el estado interno de una tool), `clamp01`.

### 3. Namespace versionado

Prefijo de namespace con versión: en Inge2 es `const NS = "inge2.v1.";`. **Al crear el
toolkit de otra materia, cambialo a `<vault>.v1.`** (p.ej. `proba.v1.`). Bumpear la versión
(`.v2.`) invalida el progreso viejo guardado en `localStorage`.

### 4. Data modules (`data/*.ts`)

Un módulo puro por herramienta (`flashcards.ts`, `quiz.ts`, …), tipado contra `types.ts`,
sin React. `units.ts` lleva el `Record<UnitId, UnitMeta>` + `UNIT_LIST`. Si los datos se
extraen de los originales del vault, el módulo puede ser generado por un pipeline
`scripts/build-*-data.mjs` (ver la skill `studyvault-data`).

## Flujo de una herramienta del set (resumen)

```tsx
// 1. estado local persistido (hydrated → load → save)
useEffect(() => { setState(loadJSON(toolKey("flashcards"), {})); setHydrated(true); }, []);
useEffect(() => {
  if (!hydrated) return;
  saveJSON(toolKey("flashcards"), state);
  // 2. publicar el dominio por unidad → el dashboard se entera por onProgress
  publishContribution("flashcards", buildContribution(state));
}, [state, hydrated]);
```

El dashboard, en paralelo, hace `onProgress(() => recompute())` y recalcula
`unitMastery`/`overallReadiness`. Decoupling total: agregar una tool nueva al set sólo
requiere sumarla al union `Tool` y que llame `publishContribution`.

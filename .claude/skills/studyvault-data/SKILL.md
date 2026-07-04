---
name: studyvault-data
description: Escribe un pipeline de datos para el sitio StudyVaults — un script Node `scripts/build-*-data.mjs` que lee los originales de un vault y emite un módulo de datos tipado (o un JSON) para que lo consuma una tool/hoja React. Usala cuando el usuario pida "crear un pipeline de datos para una tool/hoja", "generar un data.ts desde el vault", "escribir un script build-*-data.mjs", "extraer el contenido de los originales a un módulo tipado", "que la herramienta X tome sus preguntas/casos/conceptos del vault", "regenerar/actualizar los datos de un toolkit", o cuando una tool/sheet necesita datos derivados de los HTML/MD/TEX/JS fuente de un vault. Cubre los dos modos (data.ts committeado vs JSON gitignored cableado en build), el header AUTO-GENERADO, la extracción robusta y la verificación.
---

# studyvault-data

Pipeline de datos de StudyVaults: un script `scripts/build-*-data.mjs` que **lee los
originales de un vault** (HTML/MD/TEX/JS de catedra y apps) y **emite un módulo que el
sitio consume** (un `data.ts` tipado o un `data.json`). Objetivo: **determinismo** — la
misma fuente produce el mismo output, los originales nunca se mutan, y la salida lleva un
header AUTO-GENERADO que prohíbe editarla a mano.

> **Leé primero `../_shared/PROJECT.md`** (contrato compartido de las skills `studyvault-*`):
> layout del repo, `REPO_ROOT = process.cwd()/..` (cwd = `site/`), originales externos
> read-only, registro `vaults.ts`, y las trampas de verificación. Si algo de acá choca con
> el código, **gana el código**.

## Cuándo se usa esto

Una tool (`components/vault-tools/<vault>/`) o una hoja (`components/vault-sheets/`)
necesita **datos derivados** del vault: bancos de preguntas, flashcards, conceptos, casos
de práctica, tablas, etc. En vez de tipear ese contenido a mano en el componente, se
escribe un builder que lo extrae de la fuente y lo deja en un módulo importable. Así el
dato queda trazable a su origen y se regenera con un comando.

## El patrón (común a los dos modos)

Todo `build-*-data.mjs` vive en `site/scripts/` y se corre desde `site/` (`cwd = site/`):

```js
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "..");          // raíz del repo (cwd = site/)
const SRC  = path.join(REPO, "<Vault>", "wiki", "...");  // ORIGINALES del repo, NUNCA los externos
const OUT  = path.join(process.cwd(), "components", "vault-tools", "<vault>", "data.ts");
```

Reglas duras:

- **Leer de `../<Vault>/...` dentro del repo.** Nunca de los vaults externos
  (`~/Desktop/ITBA/..._Obsidian`) ni de `raw/` externo: son read-only (ver PROJECT.md §2).
  **El builder solo lee la fuente y escribe el output. Jamás muta los originales.**
- **Header AUTO-GENERADO** al tope de la salida, citando el script y la fuente:

  ```
  // AUTO-GENERADO por scripts/build-<x>-data.mjs — NO editar a mano.
  // Fuente: <Vault>/wiki/... . Regenerar con:
  //   node scripts/build-<x>-data.mjs
  ```

- **Datos tipados.** En modo `.ts` el módulo exporta `interface`s + los `const` tipados.
  En modo `.json` el tipado vive en un `.ts` aparte (`lib/<x>/types.ts`) que se importa.
- **Idempotente.** Correrlo dos veces seguidas no cambia el output (orden estable, sin
  `Date.now()` ni timestamps en el contenido emitido). Serializá con `JSON.stringify(v, null, 2)`.
- **No romper el build si falta una fuente.** Si una fuente opcional no existe, emitir vacío
  con un `console.warn`, no `throw`. Si una fuente *obligatoria* falta, `throw` con mensaje
  claro (incluí el path) — mejor fallar ruidoso que emitir un módulo corrupto.
- **Resumen por stdout** al final (cuántos items por unidad/kind) para verificación a ojo.

## Los dos modos — cuándo usar cada uno

### Modo A — `data.ts` committeado (run-by-hand)

> Referencia fiel y única en el repo: **`site/scripts/build-derecho-data.mjs`** →
> `site/components/vault-tools/derecho/data.ts` (lo consumen `PracticeBank.tsx`,
> `Flashcards.tsx`, `ConceptBrowser.tsx`, `Repetidas.tsx`, `Repaso1er.tsx`).

- **Salida**: un `.ts` tipado en `components/vault-tools/<vault>/data.ts` (o
  `components/vault-sheets/...`).
- **NO se cablea** en `predev`/`prebuild`. Se corre **a mano** (`node scripts/build-<x>-data.mjs`)
  y **se commitea** el `data.ts` resultante (está *tracked* en git, no en `.gitignore`).
- **Cuándo**: la extracción es **cara o frágil** (parsear HTML/TEX con regex, evaluar literales
  JS) y/o el dato es **estable** (un parcial ya pasó, el banco no cambia). No querés correr ese
  parser en cada build de CI; preferís un artefacto revisable en el diff.
- El `data.ts` emitido exporta sus `interface`s y `const`; el componente hace
  `import { BANK_2DO } from "./data"`.

### Modo B — `data.json` gitignored (cableado en build)

> Referencia fiel: **`site/scripts/build-planner-data.mjs`** → `site/lib/planner/data.json`
> (gitignored; lo consume el planner vía `lib/planner/types.ts`). Cableado en
> `predev`/`prebuild` de `site/package.json`.

- **Salida**: un `.json` (p. ej. `lib/<x>/data.json`) **gitignored** — regenerado en cada build.
- **Se cablea** en los scripts `predev` y `prebuild` de `site/package.json` (junto a
  `copy-assets.mjs`, `build-planner-data.mjs`, `copy-vault-apps.mjs`) y se agrega su path a
  `site/.gitignore`.
- **Cuándo**: el dato deriva de una fuente que **cambia** y querés que **cada build la tome
  fresca** sin acordarte de regenerar a mano. La extracción es barata/robusta.
- El tipo se define a mano en un `.ts` (`lib/<x>/types.ts`) y el componente importa el JSON
  tipado contra esa interfaz.

| | Modo A (`.ts` committeado) | Modo B (`.json` gitignored) |
|---|---|---|
| Salida | `components/vault-tools/<v>/data.ts` | `lib/<x>/data.json` |
| Git | **tracked** (en el diff) | **gitignored** |
| Build | a mano, NO en prebuild | cableado en `predev`/`prebuild` |
| Tipos | en el propio `.ts` emitido | en `lib/<x>/types.ts` aparte |
| Ideal para | extracción cara/frágil, dato estable | fuente que cambia, extracción barata |

> Para empezar usá **`assets/BUILDER_TEMPLATE.mjs`** (esqueleto del modo A; el comentario al
> pie indica cómo virarlo a modo B).

## Extracción robusta (lecciones de `build-derecho-data.mjs`)

- **Literales JS en HTML** (`const BANK = [...]` dentro de un `<script>`): localizá `const NAME =`,
  hacé **bracket-matching** respetando strings/escapes, y evaluá el literal con
  `new Function("return (" + lit + ")")()`. No uses regex greedy para capturar el array entero.
- **Macros TeX anidados** (`\textbf{...}`, `\D{term}{def}`): bracket-match desde la `{` de
  apertura contando profundidad; no `\\textbf\{([^}]*)\}` (rompe con anidados).
- **Bloques markdown → HTML acotado**: convertí solo lo que la tool necesita (negritas,
  listas, `code`, wikilinks → label). No metas un parser markdown completo si alcanza con eso.
- **Normalizá y deduplicá** cuando juntás varias fuentes (p. ej. `norm(q.q)` lower+trim para
  detectar preguntas repetidas y quedarte con una).
- **Mantené orden estable** (el orden de las fuentes y de iteración) para que el diff sea limpio.

## Consumo desde el componente

- **Modo A**: `import { FOO, type FooItem } from "./data";` en el `.tsx` de la tool/hoja.
  El componente es una isla cliente (`"use client"`); el `data.ts` es data estática pura.
- **Modo B**: `import data from "./data.json"` tipado contra `lib/<x>/types.ts`.
- Recordá: los toolkits/hojas son **static-export safe** (PROJECT.md §7) — nada de `window`
  sin guard. El módulo de datos es solo data, así que esto aplica al componente, no al builder.

## Procedimiento

1. **Leé el contexto.** `../_shared/PROJECT.md` (§2 originales read-only, §3 scripts de build,
   §4 verificación). Abrí la referencia del modo elegido (`build-derecho-data.mjs` para A,
   `build-planner-data.mjs` para B) y `assets/BUILDER_TEMPLATE.mjs`.

2. **Identificá fuente y consumidor.** Qué archivo(s) del vault tienen el dato
   (`../<Vault>/wiki/...`), de qué tipo (HTML/MD/TEX/JS) y qué tool/hoja lo va a importar.
   Abrí la fuente real y entendé su estructura antes de escribir el parser.

3. **Elegí el modo** (tabla de arriba): A si la extracción es cara/frágil o el dato es estable;
   B si la fuente cambia y querés frescura en cada build.

4. **Escribí el builder** partiendo de `assets/BUILDER_TEMPLATE.mjs`. `REPO = process.cwd()/..`,
   read de `../<Vault>/...`, parser robusto, tipos, header AUTO-GENERADO, write del output,
   resumen por stdout. Nunca escribas dentro del vault.

5. **Si es modo B, cableá el build.** Agregá `&& node scripts/build-<x>-data.mjs` a `predev`
   **y** `prebuild` en `site/package.json`, y el path de salida a `site/.gitignore`. (Modo A:
   no toques ni package.json ni .gitignore — el `.ts` se commitea.)

6. **Corré el builder** desde `site/`: `node scripts/build-<x>-data.mjs`. Mirá el resumen de
   stdout (counts razonables, sin errores). Corrélo **dos veces** y confirmá que el output no
   cambia (idempotencia) — en modo A, `git diff` del `data.ts` debe quedar limpio en la 2.ª.

7. **Verificá el build.** `tsc` limpio (los tipos del módulo cierran con el consumidor) y
   `next build` limpio (ver `./run.sh build` en PROJECT.md §4). Ojo con las trampas: no corras
   `next build` con `next dev` prendido; CSS/`globalThis` stale no aplican acá pero el resto sí.

8. **Verificá el consumo en el browser.** Abrí la tool/hoja que importa el dato (Claude Preview
   MCP, PROJECT.md §4) y confirmá que renderiza con el dato nuevo. No declares hecho sin evidencia.

9. **Confirmá los originales intactos.** `git status` del/los vault(s) fuente debe estar limpio
   (el builder no debe haber tocado nada bajo `<Vault>/`).

## Checklist

- [ ] `REPO = path.resolve(process.cwd(), "..")`; lee de `../<Vault>/...` (originales del repo),
      NUNCA de los externos read-only ni de `raw/` externo.
- [ ] El builder **no muta** ningún original (`git status` del vault limpio tras correrlo).
- [ ] Header **AUTO-GENERADO** al tope del output: cita el script + la fuente + cómo regenerar.
- [ ] Salida tipada: modo A exporta `interface`s + `const`; modo B tiene su `lib/<x>/types.ts`.
- [ ] **Idempotente**: correrlo 2× no cambia el output (sin timestamps, orden estable).
- [ ] Fuente faltante: `console.warn` + vacío si es opcional, `throw` con path si es obligatoria.
- [ ] Resumen por stdout con counts.
- [ ] Modo A: `data.ts` **committeado** (tracked), NO cableado en prebuild, package.json/.gitignore
      sin tocar.
- [ ] Modo B: salida **gitignored** + cableada en `predev` **y** `prebuild`.
- [ ] `tsc` + `next build` limpios; la tool/hoja consumidora renderiza con el dato (browser).

## Estado verificado del repo (2026-07)

- Builders existentes: **`build-derecho-data.mjs`** (modo A), **`build-fichas-data.mjs`** (modo A →
  `lib/planner/fichas.ts`, fichas/programas de electivas) y **`build-planner-data.mjs`** (modo B).
- Outputs **tracked**: `components/vault-tools/derecho/data.ts`, `lib/planner/fichas.ts` y
  `components/vault-tools/parcial/data.ts`.
- Output **gitignored** (confirmado): `lib/planner/data.json` (línea final de `site/.gitignore`).
- `parcial/data.ts` (toolkit de Inge2) **NO** tiene builder: se portó a mano *verbatim* desde la
  app de Inge2 y **no** lleva header AUTO-GENERADO. Es la excepción: copia manual estable, no
  pipeline. Si en algún momento se le escribe un builder, seguí el modo A.

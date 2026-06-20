---
name: studyvault-sheet
description: Arma o extiende una hoja de estudio imprimible (cheat sheet) de una materia de StudyVaults, en la ruta /[vault]/hojas. Usala cuando el usuario pida "agregar/crear una hoja de fórmulas o de conceptos", "armar/extender las hojas de estudio de <materia>", "agregar una sección/fórmula/concepto a /hojas", "formulario imprimible de la materia", "cheat sheet de <materia>", "exportar la hoja a PDF/.tex/.md" o "habilitar /hojas en un vault que todavía no las tiene". Edita los módulos de datos en site/components/vault-sheets/data/<vault>.ts (Sheet puro-datos), el map SHEETS del registry y el flag sheets de vaults.ts, respetando el flag math del vault (KaTeX solo en MNA/Economía/Proba).
---

# studyvault-sheet

Genera o amplía una **hoja de estudio imprimible** de una materia: el documento denso, color-coded y
exportable que se ve en `/[vault]/hojas`. El objetivo es **determinismo**: la hoja es **puro dato**
(un objeto `Sheet` serializable), así que con la teoría/fórmulas en mano la skill produce/edita el
módulo de datos correcto, lo cablea, y verifica que renderiza + exporta sin romper el build.

**Leé primero `_shared/PROJECT.md`** (en `.claude/skills/_shared/PROJECT.md`): es el contrato
compartido de arquitectura, el flag `math` por vault y las trampas de CSS/`.next` que se aplican acá.

## Qué es una hoja (modelo de datos)

Todo vive en `site/components/vault-sheets/`. El schema es `types.ts` (leelo, es la fuente de verdad):

- **`Sheet`** — el documento. Campos:
  `vault: VaultId` · `kind: "formulas" | "conceptos"` · `title` · `subtitle?` ·
  `notation?` (línea de convenciones global, admite `$...$`) · `groups: SheetGroup[]` ·
  `updated?` (fecha ISO).
- **`SheetGroup`** — una sección. Campos:
  `title` · `hint?` (subtítulo breve, admite `$...$`) · `unit?` (string `"1"`.."9"; varias secciones
  comparten unidad y la hoja las agrupa bajo un encabezado de unidad + permite filtrar por unidad) ·
  `unitTitle?` (título humano de la unidad, coherente entre secciones del mismo `unit`) ·
  `entries: SheetEntry[]`.
- **`SheetEntry`** — un ítem. Campos:
  - `label` (nombre corto; admite rich text).
  - `kind?: EntryKind` — categoría semántica → color. Valores:
    `def` (azul) · `theorem` (púrpura) · `formula` (verde) · `method` (ámbar) ·
    `caution` (coral) · `example` (gris). Si se omite, `defaultKind()` lo deriva del tipo de hoja
    (`formulas` → `formula`, `conceptos` → `def`).
  - `tex?` — LaTeX **sin delimitadores `$`**. Se renderiza en display salvo que `inline: true`.
    Es el campo principal en hojas de **fórmulas**.
  - `inline?` — renderizar `tex` en línea con el `label` en vez de en bloque.
  - `body?` — texto breve (admite rich text, ver abajo). Campo principal en hojas de **conceptos**.
  - `cond?` — condición de validez / "cuándo aplica" (rich text).
  - `note?` — caveat / error común (rich text).

**Fórmulas vs conceptos.** Una hoja `formulas` se arma alrededor de `tex` (cada `entry` lleva su
fórmula en display). Una hoja `conceptos` se arma alrededor de `body` (texto), normalmente sin `tex`.
Mirá `data/proba.ts` (`probaFormulas`, lleno de `tex`) vs `data/inge2.ts` (`inge2Conceptos`, solo
`body`/`note`, **sin** `tex` ni `notation` con math, porque Inge2 no usa LaTeX).

## Rich text (qué markup admite `body`/`cond`/`note`/`hint`/`label`/`notation`)

El tokenizador es `richtext.ts` (`tokenize`), compartido por el render y los exporters. Solo soporta
**dos** marcas inline; el resto es texto plano:

- **`$...$`** → matemática inline (KaTeX). `$$` = un `$` literal.
- **`` `...` ``** → código (`<code>`). Dentro de code los `$` son literales; dentro de math los
  backticks son literales (así PAW/Inge2 mezclan código y flechas sin chocar).

No hay negritas/itálicas/listas/links de Markdown: lo que no esté entre `$` o backticks va literal.
**No metas `$...$` en vaults sin math** (PAW/Inge2/Derecho): KaTeX intentaría renderizarlo. En esos
vaults usá backticks para identificadores/código y texto plano para el resto. En PAW `$...$` es
Expression Language/JSP, no matemática → tratarlo como texto, no como `$...$`.

## El cableado (3 puntos que tienen que estar en sync)

Para que `/[vault]/hojas` exista y muestre la hoja, los tres tienen que coincidir:

1. **Flag** `sheets: true` en el `VaultConfig` del vault, en `site/lib/content/vaults.ts`.
2. **Entrada** en el map `SHEETS: Partial<Record<VaultId, VaultSheets>>` de
   `site/components/vault-sheets/registry.ts`, donde `VaultSheets = { formulas?: Sheet; conceptos?: Sheet }`.
   El `import` del módulo de datos también va acá.
3. **Módulo de datos** `site/components/vault-sheets/data/<vault>.ts` que exporta
   `<vault>Formulas` y/o `<vault>Conceptos` (camelCase del id, ej. `probaFormulas`, `inge2Conceptos`).

La ruta `app/[vault]/hojas/page.tsx` hace `generateStaticParams()` sobre `Object.keys(SHEETS)`, así que
**si el vault no está en `SHEETS`, la página no se genera** (404). `SheetShell` recibe `formulas` y
`conceptos` y muestra el toggle solo si ambos existen.

### Reglas por materia (cuáles hojas corresponden)

- **`formulas` solo en materias con matemática.** Las que tienen `math: true` Y hoja de fórmulas hoy
  son **MNA, Economía, Proba**. El render usa `SheetMath`/`FitMath` (KaTeX) para `tex`. **No agregues
  una hoja `formulas` a un vault con `math: false`** (PAW/Inge2/Derecho): el `tex` se renderizaría como
  LaTeX y no tiene sentido ahí.
- **`conceptos` en las que tienen toolkit.** Hoy con `conceptos`: MNA, Economía, Proba, PAW, Inge2.
- **Estado actual de `SHEETS`** (verificá en el archivo, puede cambiar):
  `mna { formulas, conceptos }`, `economia { formulas, conceptos }`, `proba { formulas, conceptos }`,
  `paw { conceptos }`, `inge2 { conceptos }`.
- **Ojo (discrepancias reales que vi):**
  - **SDS** tiene `math: true` pero **NO** `sheets` ni módulo de datos → ser math NO implica tener
    hoja de fórmulas. Solo agregá una hoja si el usuario la pide.
  - **Derecho** tiene toolkit pero **NO** está en `SHEETS` ni tiene `sheets: true`, aunque el comentario
    del registry diga "conceptos en todas las que tienen toolkit". El código manda: el estado real es el
    de arriba. Si el usuario pide hojas de Derecho, hay que crear el módulo + cablear (y como
    `math: false`, sería `conceptos`, no `formulas`).

## Exporters e impresión (qué formato soporta la hoja)

La misma `Sheet` (filtrada por los controles: densidad, columnas, unidades, categorías → "se exporta
lo que ves") se vuelca a tres salidas. Lógica en `exporters.ts`:

- **Imprimir / PDF** — `window.print()` sobre `.sheet-print-root` (CSS de impresión en
  `packages/ui/src/styles/sheets.css`). Pensada para la menor cantidad de hojas.
- **`.tex`** — `toTex(sheet, cols)`: documento `article` + `multicol` compilable con `pdflatex`,
  color-coded por `EntryKind`. **Traduce Unicode → comandos LaTeX** (mapa `UNI`: griegas, operadores,
  etc.) y **descarta emojis** (mapa `EMOJI_RE`) que romperían `pdflatex`. Implicancia al escribir
  datos: podés usar símbolos Unicode en `tex`/texto (KaTeX los acepta) y el export los convierte; pero
  no metas pictogramas raros sin equivalente LaTeX.
- **`.md`** — `toMd(sheet)`: Markdown estilo formulario (frontmatter + H2 por sección + listas).
  Reusa el mismo rich text (`$...$`, `` ` ``).

No tenés que tocar los exporters para extender una hoja; sí saber que **todo lo que pongas en `tex`
debe ser LaTeX KaTeX-válido y, ojalá, pdflatex-traducible** vía el mapa `UNI`.

## Procedimiento

Al invocarte, seguí estos pasos en orden:

1. **Leer el contexto.** `_shared/PROJECT.md`, `vault-sheets/types.ts` (schema), y el módulo de datos
   del vault objetivo si existe (`vault-sheets/data/<vault>.ts`) como referencia de estilo. Si es una
   hoja nueva, abrí un módulo del mismo `kind` como molde (`data/proba.ts` para fórmulas,
   `data/inge2.ts` para conceptos sin math).

2. **Detectar vault, `kind` y `math`.** Identificá el `VaultId` (`mna · derecho · economia · proba ·
   paw · sds · inge2`) y mirá su `math` en `lib/content/vaults.ts`. Decidí el `kind`:
   `formulas` solo si `math: true` y el usuario quiere fórmulas; si no, `conceptos`. **Nunca** una hoja
   `formulas` en un vault `math: false`.

3. **¿Existe la hoja?**
   - **Extender una hoja existente** → editá el objeto `<vault>Formulas`/`<vault>Conceptos` en
     `data/<vault>.ts`: agregá `SheetEntry` a un `SheetGroup` existente, o un `SheetGroup` nuevo a
     `groups` (con su `unit`/`unitTitle` si la hoja usa unidades; respetá la numeración existente).
     Tocá `updated` a la fecha de hoy (ISO).
   - **Hoja nueva en un vault que ya tiene `/hojas`** (ej. agregar `formulas` a un vault que solo tenía
     `conceptos`) → agregá el export al `data/<vault>.ts` y la clave al objeto del registry.
   - **Vault sin `/hojas` todavía** → creá `data/<vault>.ts` desde `assets/SHEET_TEMPLATE.ts`, agregá
     `import` + entrada en `SHEETS` (registry), y poné `sheets: true` en `vaults.ts`.

4. **Escribir los datos.** Completá `Sheet`/`SheetGroup`/`SheetEntry` según el schema:
   - `vault` y `kind` correctos; `title`/`subtitle`/`updated`.
   - Hoja **`formulas`**: cada entry con `tex` (LaTeX sin `$`), `kind` semántico, y `cond`/`note`
     cuando sumen. `notation` global con las convenciones (admite `$...$`).
   - Hoja **`conceptos`**: cada entry con `body` (texto), `kind`, y `cond`/`note`. Sin `tex` salvo que
     la materia use math.
   - **Rich text**: `$...$` solo en vaults `math: true`; backticks para código en cualquiera; nada de
     Markdown extra. En `tex`, símbolos Unicode OK (los traduce el export), nada de emojis.
   - Agrupá por `unit`/`unitTitle` si la hoja organiza por unidad (mirá si la hoja ya lo hace).

5. **Cablear** (solo si la hoja/vault es nueva): `import` + clave en `SHEETS` (registry) ↔ `sheets:
   true` (vaults.ts) ↔ export en `data/<vault>.ts`. Los tres en sync.

6. **Verificar.** `cd site` y:
   - `npx tsc --noEmit` (o el comando de typecheck del repo) limpio.
   - `./run.sh` (dev en :3000) o `./run.sh build` (build estático fiel a GH Pages). Recordá las trampas
     de PROJECT.md: **no corras `next build` con `next dev` prendido** (comparten `.next`); si tocaste
     CSS de `packages/ui/src/styles/` y no se refleja, `rm -rf .next` / `./run.sh clean`.
   - **Browser (Claude Preview MCP, `preview_*`)**: abrí `/[vault]/hojas`, confirmá que la hoja
     renderiza, que el **math se ve bien** (KaTeX, sin texto rojo `sheet-math-err`), y que **Imprimir /
     PDF** y los export **`.tex` / `.md`** funcionan. Mostrá evidencia (screenshot/console limpia/build
     verde); nunca pidas verificación manual al usuario.

## Checklist de calidad

Antes de cerrar, verificá TODO:

- [ ] `kind` correcto: `formulas` solo si el vault es `math: true`; si no, `conceptos`.
- [ ] `vault` del `Sheet` = id real del vault; export `<vault>Formulas`/`<vault>Conceptos` bien nombrado.
- [ ] `tex` **sin** delimitadores `$`; KaTeX-válido (sin `sheet-math-err` en el render).
- [ ] Rich text: `$...$` solo en vaults con math; backticks para código; sin Markdown extra ni emojis.
- [ ] `kind` de cada entry coherente con su color semántico (`def/theorem/formula/method/caution/example`).
- [ ] Unidades coherentes: `unit`/`unitTitle` consistentes entre secciones de la misma unidad.
- [ ] `updated` tocado a la fecha de hoy (ISO).
- [ ] Cableado en sync (si aplica): `sheets: true` (vaults.ts) ↔ entrada en `SHEETS` (registry) ↔ export.
- [ ] `npx tsc --noEmit` limpio y `next build` verde (sin dev prendido en paralelo).
- [ ] Browser: la hoja renderiza, math OK, Imprimir/PDF y export `.tex`/`.md` funcionan (con evidencia).
- [ ] Idioma del contenido = idioma del vault (español rioplatense; PAW/Inge2 en inglés).

## Archivos clave (paths reales)

- Schema: `site/components/vault-sheets/types.ts`
- Render: `site/components/vault-sheets/SheetShell.tsx`, `site/components/vault-sheets/SheetMath.tsx`
- Rich text: `site/components/vault-sheets/richtext.ts`
- Exporters: `site/components/vault-sheets/exporters.ts`
- Registry: `site/components/vault-sheets/registry.ts`
- Datos: `site/components/vault-sheets/data/<vault>.ts`
- Ruta: `site/app/[vault]/hojas/page.tsx`
- Flags: `site/lib/content/vaults.ts`
- Estilos (incl. impresión): `site/packages/ui/src/styles/sheets.css`
- Molde: `assets/SHEET_TEMPLATE.ts` (junto a esta skill)

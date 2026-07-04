---
name: studyvault-ui
description: Agrega o modifica un componente de la librería de diseño @studyvaults/ui (el design system "Technical Split" del sitio StudyVaults), respetando todas sus convenciones (server-first, polimorfismo de links, tokens de color, a11y) y registrándolo en el barrel + el showcase /interno/ui. Usala cuando el usuario pida "agregar un componente a @studyvaults/ui", "crear/modificar un componente del design system", "extender la librería de UI", "nuevo Button/Card/Badge/Modal/… reusable", "un componente nuevo para el sitio", "tocar un componente de la UI compartida", o trabajo equivalente bajo site/packages/ui/.
---

# studyvault-ui

Workflow para **agregar o modificar un componente** de `@studyvaults/ui`, el design system
privado del sitio StudyVaults (package del workspace en `site/packages/ui/`, distribuido como
TS/TSX crudo y transpilado por Next vía `transpilePackages`). El objetivo es **determinismo**: que
el componente nuevo entre con las mismas convenciones que los ~45 existentes, soporte dark/light por
tokens, sea accesible cuando aplica, y quede registrado y verificado.

> **Leé primero** `.claude/skills/_shared/PROJECT.md` (contrato compartido: arquitectura del sitio,
> trampas de CSS/`.next`, reglas de git) y `site/packages/ui/README.md` (fuente de verdad del DS:
> catálogo, tokens, convenciones). Si algo de acá choca con el código real, **gana el código**.

## El mapa del package

```
site/packages/ui/
  package.json        · exports: "." → src/index.ts, "./styles.css" → src/styles/index.css
  src/
    cn.ts             · joiner de clases zero-dep (NO clsx). export { cn }, type ClassValue
    tokens.ts         · espejo TS de los tokens: BASE_HEX, VAULT_IDS/VaultId, Theme,
                        ButtonVariant/Size, BadgeVariant, ReadoutTone, SPACE
    index.ts          · barrel público (re-exporta todas las categorías con `export *`)
    primitives/ layout/ navigation/ feedback/ forms/ data/   · un .tsx por componente
    styles/
      index.css       · entry: @import de tokens.css → base.css → … en orden
      tokens.css      · los 7 hex base (6 + --hex-brown-soft) + tokens de rol conmutados por
                        [data-theme] + tint [data-vault] + estados semánticos --status-*
      base.css layout.css button.css badge.css card.css nav.css footer.css
      ambient.css breadcrumbs.css reveal.css overlay.css toolkit.css parcial.css sheets.css
      diagram.css forms.css library.css
```

Lo consume `site/app/globals.css` con `@import "@studyvaults/ui/styles.css";` (una sola vez).
Showcase vivo: `site/app/interno/ui/page.tsx` (+ helpers locales `parts.tsx`: `Demo`, `Specimen`).

> Nota: `cn` y `tokens` viven en `src/cn.ts` y `src/tokens.ts` (raíz de `src/`), **no** en un
> subdirectorio `core/`. Los componentes importan `import { cn } from "../cn"`.

## Las 6 categorías — dónde va el componente nuevo

Elegí la carpeta por el **rol** del componente, no por cómo se ve:

| Categoría | Para qué | Ejemplos existentes |
|---|---|---|
| `primitives/` | átomos sin estructura: un botón, un ícono, una etiqueta, un número | `Button`, `Icon`, `Badge`, `Tag`, `Eyebrow`, `BigNum`, `Mono` |
| `layout/` | estructura y superficies: contenedores, grillas, cards, paneles | `Container`, `Section`, `SectionHeading`, `Stack`, `Row`, `Card`, `CardGrid`, `CardIcon`, `ToolCard`, `Panel`, `SubPanel`, `PanelHeader`, `Note`, `Callout` |
| `navigation/` | chrome de navegación y tema | `Navbar`, `NavLink`, `Brand`, `BrandMark`, `Breadcrumbs`, `Footer`, `ThemeToggle`, `ThemeScript` |
| `feedback/` | motion y overlays: revelados, modales, drawers, pestañas | `Reveal`, `AmbientLayer`, `Modal`, `Drawer`, `Tabs` (+ hook `useDismissable`) |
| `forms/` | controles de formulario | `Field`, `TextInput`, `TextArea`, `Select`, `Slider`, `Chip`, `CommissionSelect` |
| `data/` | lectura/salida de datos | `KeyValue`, `Readout`, `DataTable`, `CopyButton`, `CodeBlock` (+ `CodeBlockChrome`), `CodeCopy` |

Si dudás entre dos, mirá cuál import-path tiene el vecino más parecido y seguí esa convención.

## Convenciones duras (verificadas en el código)

1. **Cero dependencias.** Solo `react` y `next` (peerDeps). El joiner de clases es `cn()` desde
   `../cn` — **nunca** `clsx`/`classnames`.
2. **Server-first.** Por defecto el componente es React Server Component (sin `"use client"`).
   Poné `"use client"` **solo** si usa hooks (`useState`/`useId`/`useEffect`/`useRef`), refs, o toca
   el DOM/eventos del cliente. Presentacionales puros (`Button`, `Card`, `Badge`) **no** lo llevan;
   interactivos (`Modal`, `Drawer`, `Tabs`, `Field`, `Slider`) **sí**.
3. **Polimorfismo de links** (componentes que pueden ser link, ver `Button`/`Card`/`ToolCard`):
   - sin `href` → el elemento nativo (`<button>` / `<div>`),
   - `href` interno → `next/link` (`import Link from "next/link"` → `<Link href=…>`),
   - `href` + `external` → `<a href target="_blank" rel="noopener noreferrer">`.
   Spreadeá `...rest` casteado al tipo de cada rama (ver el patrón exacto en `Button.tsx`).
4. **`className` siempre se reenvía** y se mergea con `cn("clase-base", …, className)`. Las props
   nativas del elemento se spreadean con `...rest` (tipá las props como
   `CommonProps & Omit<HTMLAttributes<…>, keyof CommonProps>`).
5. **Named export + default export.** Cada archivo: `export function Foo(...) {}` **y**
   `export default Foo;`. El barrel de categoría usa `export *`, así que el named export es
   obligatorio. Los tipos de props se exportan (`export interface FooProps`) cuando el showcase u
   otros componentes los necesitan.
6. **JSDoc en español** arriba de cada componente: una frase de qué es + la clase CSS que usa + un
   bloque `@example`. Comentarios en español rioplatense.
7. **Nada de hex hardcodeado.** Los 7 hex base viven SOLO en `tokens.css` (`--hex-brown/brown-soft/
   zinc/blue/gray/coral/white`); todo lo demás deriva por `color-mix()`. Para estados semánticos
   existen `--status-go/promo/warn/caution`. En el CSS del componente usá
   **tokens de rol**: `--background`, `--surface-2`, `--surface-3`, `--border`, `--hairline`,
   `--ink-strong`, `--text-secondary`, `--link`, `--accent`, `--primary`, `--accent-soft`,
   `--accent-line`, `--accent-text`, `--primary-soft`, `--primary-line`, `--ring`, `--ring-soft`,
   `--shadow-sm/md/lg`, `--r-card/ctrl/pill`, `--s-1`…`--s-7`, `--font-display/body/mono`,
   `--ease`, `--dur`/`--dur-fast`/`--dur-slow`. Son los que conmutan por `[data-theme]`, así que el
   componente soporta dark/light **sin recompilar**. Si necesitás un tono nuevo, derivalo con
   `color-mix(in srgb, var(--token) N%, transparent)`, no con un hex nuevo.
8. **Tinte por materia.** Para acentos sensibles a la materia usá `var(--vault-tint)` (lo setea
   `[data-vault="mna|derecho|…"]` en `tokens.css`). Regla del proyecto: el tint va como **fondo a
   baja opacidad, borde o relleno**, nunca como color de texto sobre superficie (ahí van `--link` /
   `--ink-strong`, que pasan AA).
9. **Tipos del DS.** Reutilizá las uniones de `tokens.ts` (`ButtonVariant`, `BadgeVariant`,
   `ReadoutTone`, `VaultId`, `Theme`, `SPACE`) en vez de redefinir strings. Si agregás una variante
   nueva, agregala a la union en `tokens.ts` **y** a la clase `.foo--variante` en el CSS.

## A11y — patrones que ya existen, reusalos

- **Overlays (`Modal`/`Drawer`):** comparten el hook `feedback/useDismissable.ts`, que hace
  focus-trap (Tab/Shift+Tab), scroll-lock del `body`, foco inicial al primer focusable y
  **restauración del foco** al cerrar, + Escape para cerrar. El panel lleva `tabIndex={-1}`,
  `role="dialog"`, `aria-modal="true"`, y `aria-labelledby` apuntando a un `useId()` cuando hay
  `title`. Si creás otro overlay, **usá `useDismissable`** en vez de reimplementar el trap.
- **Pestañas (`Tabs`):** `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`,
  **roving tabindex** (la activa `tabIndex={0}`, el resto `-1`) y navegación con flechas / Home /
  End. Copialo si hacés un control con selección.
- **Form controls (`Field`):** asocia `<label htmlFor>` con el control; si no le pasan `htmlFor`
  y el único hijo no tiene `id`, le inyecta un `id` autogenerado (`useId`) y lo cablea. Cualquier
  control nuevo debe poder recibir `id` para que `Field` lo asocie.
- **Toggles / live regions:** usá `aria-pressed` para botones de estado y `aria-live` donde haya
  contenido que cambia dinámicamente.

## El CSS — dónde va y cómo se consume

- Las clases CSS son **detalle de implementación** (el README lo dice): el consumidor usa el
  componente, no las clases. Una sola fuente de verdad por estilo.
- Si el componente necesita estilos nuevos, **creá `src/styles/<componente>.css`** (split por
  componente) y agregá su `@import` a `src/styles/index.css` **respetando el orden**
  (tokens → base → primitivos → chrome). Reusá un CSS existente si el componente cae claramente en
  él (p. ej. una card nueva → `card.css`; un control de toolkit → `toolkit.css`).
- No toques `app/globals.css` para estilos de componentes: ese archivo solo importa el bundle del DS
  y define el `@theme inline` de Tailwind + CSS de páginas (wiki/prose/home/search).

## Registro

1. **Barrel de categoría / principal:** no hay barrels por carpeta — el `src/index.ts` re-exporta
   cada archivo directamente con `export * from "./categoria/Componente";`. Agregá esa línea en la
   sección correcta del barrel.
2. **Showcase `/interno/ui`:** registrá el componente en `site/app/interno/ui/page.tsx` —
   importalo del barrel, y agregá un `<Demo id=… eyebrow="categoria" title=… description=…>` con uno
   o más `<Specimen label=…>` mostrando sus variantes/estados. Si abrís una sección nueva, sumá su
   entrada al array `TOC`. Asegurate de que se vea bien en **dark y light** (el toggle está arriba a
   la derecha).

## Procedimiento

1. **Leé el contexto.** `_shared/PROJECT.md` + `site/packages/ui/README.md`. Abrí el componente
   existente más parecido al que vas a tocar (mismo tipo: link-polimórfico → `Button.tsx`/`Card.tsx`;
   overlay → `Modal.tsx`/`Drawer.tsx` + `useDismissable.ts`; control con teclado → `Tabs.tsx`;
   form control → `Field.tsx` + `TextInput.tsx`).
2. **Elegí la categoría** (tabla de arriba) y el nombre `PascalCase` del archivo.
3. **Escribí el componente** partiendo de `assets/COMPONENT_TEMPLATE.tsx`: header JSDoc en español,
   props con `className` + `...rest`, `cn()` para mergear, named + default export, `"use client"`
   solo si hace falta, polimorfismo de links si es un link. Reutilizá tipos de `tokens.ts`.
4. **CSS (si hace falta):** creá `src/styles/<componente>.css` con tokens de rol (cero hex) y
   agregá su `@import` ordenado en `src/styles/index.css`. Si la variante es nueva, reflejala en
   `tokens.ts`.
5. **A11y:** si es overlay → `useDismissable`; si tiene selección → roving tabindex + roles ARIA;
   si es form control → recibí `id` para que `Field` lo asocie.
6. **Registrá** en `src/index.ts` (`export * from …`).
7. **Sumá al showcase** `app/interno/ui/page.tsx`: import + `<Demo>`/`<Specimen>`, y `TOC` si
   abriste sección. Cubrí variantes, estados y (si aplica) link interno/externo/estático.
8. **Verificá** (ver checklist). `tsc` + `next build` limpios; browser en `/interno/ui` dark + light
   con 0 errores de consola.

## Verificación

> **Trampas de PROJECT.md §4 (críticas):** cambios en `packages/ui/src/styles/` o `app/globals.css`
> pueden quedar **stale en Turbopack** → `rm -rf .next` (o `./run.sh clean`) y reiniciar antes de
> concluir "no anduvo". **Nunca** corras `next build` con `next dev` prendido (comparten `.next`).
> La verificación en browser es vía **Claude Preview MCP** (`preview_*`): verificá vos y mostrá
> evidencia (screenshot/console limpia), no le pidas al usuario que chequee.

- `cd site && npx tsc --noEmit` (o `npm run -w @studyvaults/ui typecheck`) → **0 errores**.
- `./run.sh build` → build estático verde (~800 páginas, fiel a GH Pages).
- `./run.sh` (dev) + Claude Preview en `/interno/ui`: el espécimen renderiza, el toggle de tema lo
  conmuta sin romper, **0 errores de consola** en dark **y** light.

Antes de cerrar, recorré `assets/CHECKLIST.md`.

## Ejemplo de invocación

**Prompt:** "Agregá a la UI un componente `Spinner` reusable para estados de carga."

1. Lee PROJECT.md + README; abre `primitives/Icon.tsx` (ya hay un ícono `spinner`) y `Badge.tsx`.
2. Categoría: `primitives/` (átomo). Archivo `src/primitives/Spinner.tsx`.
3. RSC puro (sin hooks) salvo que anime por JS — acá basta CSS, así que **sin** `"use client"`.
   Props `size?`, `className`, `...rest`; clase base `.spinner`; `role="status"` +
   `aria-label="Cargando"`. Named + default export, JSDoc en español con `@example`.
4. CSS: `src/styles/spinner.css` con `@keyframes` y `border-color: var(--hairline)` /
   `border-top-color: var(--accent)` (tokens, cero hex); `@import "./spinner.css";` ordenado en
   `index.css`.
5. `export * from "./primitives/Spinner";` en `src/index.ts`.
6. Showcase: import + `<Demo id="spinner" eyebrow="primitives" title="Spinner" …>` con
   `<Specimen>` de tamaños; entrada en `TOC`.
7. `tsc` + `next build` limpios; Preview en `/interno/ui` dark+light, consola limpia.

## Instalación

Vive en `.claude/skills/studyvault-ui/` de este repo. Es específica de StudyVaults (asume
`site/packages/ui/`), así que no tiene sentido instalarla global. Mantené `SKILL.md` + `assets/`
juntos.

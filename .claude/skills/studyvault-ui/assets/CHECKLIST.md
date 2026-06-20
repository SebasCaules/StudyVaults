# Checklist — componente de @studyvaults/ui

Antes de declarar hecho el componente nuevo/modificado, verificá TODO:

## Archivo del componente (`src/<categoria>/<Componente>.tsx`)
- [ ] Está en la **categoría correcta** (`primitives/ layout/ navigation/ feedback/ forms/ data/`).
- [ ] `"use client"` **solo** si usa hooks/refs/DOM; si es presentacional puro, **no** lo lleva.
- [ ] Importa `cn` desde `"../cn"` (NO clsx) y mergea con `cn("clase-base", …, className)`.
- [ ] `className` se reenvía y `...rest` se spreadea al elemento nativo.
- [ ] **named export** `export function Componente` **y** `export default Componente`.
- [ ] Tipos de props exportados si el showcase u otros los consumen (`export interface FooProps`).
- [ ] JSDoc en español (qué es + clase CSS + `@example`); comentarios en español rioplatense.
- [ ] Reutiliza tipos de `tokens.ts` (`ButtonVariant`, `BadgeVariant`, `ReadoutTone`, `VaultId`, …)
      en vez de redefinir strings.
- [ ] Si es link: polimorfismo `href`→next/link, `href`+`external`→`<a target=_blank rel=noopener noreferrer>`,
      sin href→elemento nativo (patrón `Button`/`Card`/`ToolCard`).

## A11y (cuando aplica)
- [ ] Overlay → usa `useDismissable` (focus-trap + scroll-lock + restauración de foco + Escape);
      panel con `tabIndex={-1}`, `role="dialog"`, `aria-modal`, `aria-labelledby` (useId).
- [ ] Selección/pestañas → roving tabindex + flechas/Home/End + roles `tablist/tab/tabpanel`.
- [ ] Form control → acepta `id` para que `Field` lo asocie al `<label htmlFor>`.
- [ ] Toggles con `aria-pressed`; contenido dinámico con `aria-live` donde corresponda.

## CSS
- [ ] **Cero hex hardcodeado**: solo tokens de rol (`--surface-2`, `--border`, `--ink-strong`,
      `--accent`, `--link`, `--ring`, `--s-*`, `--r-*`, `--font-*`, `--dur`/`--ease`, …) o
      `color-mix(in srgb, var(--token) N%, transparent)`.
- [ ] Tint por materia con `var(--vault-tint)` solo como fondo/borde/relleno, nunca como texto.
- [ ] Estilos nuevos en `src/styles/<componente>.css` con `@import` ordenado en `src/styles/index.css`
      (o reusando un CSS existente que claramente corresponda). No se tocó `app/globals.css`.

## Registro
- [ ] `export * from "./<categoria>/<Componente>";` agregado en `src/index.ts` (sección correcta).
- [ ] Showcase `app/interno/ui/page.tsx`: import del barrel + `<Demo>`/`<Specimen>` cubriendo
      variantes/estados (y link interno/externo/estático si aplica); entrada en `TOC` si abriste sección.

## Verificación
- [ ] `cd site && npx tsc --noEmit` → 0 errores.
- [ ] `./run.sh build` → build estático verde.
- [ ] Claude Preview MCP en `/interno/ui`: renderiza, el toggle de tema lo conmuta, **0 errores de
      consola en dark Y en light**. (Si el CSS no aparece: `rm -rf .next` / `./run.sh clean` y reiniciar.)
- [ ] No se corrió `next build` con `next dev` prendido.

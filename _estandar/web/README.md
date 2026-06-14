# `_estandar/web/` — capa de presentación web de StudyVaults

Esta carpeta es la **capa web** del estándar: la estética visual del portal/sitio de
StudyVaults, derivada del template Neuform "Premium Agency Portal — Technical Split"
(autor: Meng To / @mengto). Adaptación **sobria**: el canvas de página es el oscuro `#241208` y el coral `#F47C59` se usa como **acento**, no como fondo a pantalla completa.

> **Importante.** Esta capa NO toca las notas `.md` del wiki. Las notas siguen siendo
> Markdown vanilla (ver [`../DESIGN.md`](../DESIGN.md) §0). El estándar visual de acá rige
> únicamente HTML/CSS de un sitio web. La skill `studyvault-page` debe ignorar esta capa.

## Archivos

- **[`components.html`](./components.html)** — página showcase / style guide autocontenida.
  Implementa **todos** los componentes (navbar, hero "technical split", botones, badges,
  cards, code, tabla, forms, tabs, accordion, foundations) con motion (masked reveals,
  staggered entrance, hover lift, scroll-triggered) y una capa ambient (gradiente animado +
  canvas de partículas). Un solo archivo, sin build, sin deps externas salvo Google Fonts
  (Newsreader + JetBrains Mono). **Abrila con doble click** en el navegador.
- **[`COMPONENT_LIBRARIES.md`](./COMPONENT_LIBRARIES.md)** — dónde buscar librerías de
  componentes para construir el portal en este estilo (headless, copy-paste, libs animadas,
  Tailwind, WebGL/3D, iconos, fuentes) + un stack recomendado.

## Tokens

La fuente de verdad de los tokens (color, tipografía, espaciado, radios, motion) es
[`../DESIGN.md`](../DESIGN.md) **§12. Estética web**. Bloque copy-paste:

```css
:root {
  --primary:        #92CFF2;  /* azul: links, focos, acento secundario */
  --accent:         #F47C59;  /* coral: ACENTO (CTA, realces) — no es el fondo */
  --background:     #F47C59;  /* coral: acento; el canvas NO es coral */
  --surface:        #241208;  /* canvas de página (sobrio) + base de paneles */
  --surface-2:      color-mix(in srgb, var(--surface) 90%, #FFFFFF); /* panel elevado */
  --text-primary:   #FFFFFF;
  --text-secondary: #A1A1AA;
  --border:         #27272A;
}
```

## Ver

- Tokens y reglas completas: [`../DESIGN.md`](../DESIGN.md) §12.
- Librerías para construirlo: [`COMPONENT_LIBRARIES.md`](./COMPONENT_LIBRARIES.md).

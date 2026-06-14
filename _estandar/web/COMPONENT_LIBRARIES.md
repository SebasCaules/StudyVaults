# Librerías de componentes — capa web de StudyVaults

Dónde buscar componentes para construir el **portal web** de StudyVaults con la estética
Neuform "Premium Agency Portal — Technical Split", en su **adaptación sobria**: canvas
oscuro `#241208` con el coral `#F47C59` de **acento** (no a pantalla completa), display
serif **Newsreader**, labels mono **JetBrains Mono**, motion abundante pero con gusto, WebGL
ambient. Los tokens y reglas viven en [`../DESIGN.md`](../DESIGN.md) §12; la página de
referencia con todos los componentes es [`components.html`](./components.html).

> **Nota.** Esto es para la **capa web** (un sitio/portal HTML), no para las notas `.md` del
> wiki. Las notas siguen siendo Markdown vanilla (DESIGN.md §0).

## Stack recomendado

Para construir el portal en este estilo:

- **Framework:** Next.js (App Router) — o **Astro** si es mayormente contenido/marketing — con React para las islas animadas/3D.
- **Estilos:** Tailwind CSS v4 con un theme tokenizado (canvas coral + surfaces oscuros, radios y fuentes vía CSS variables). Afinalo en **tweakcn**.
- **Componentes base:** **shadcn/ui** (sos dueño del código, lo theme-ás por tokens) como capa fundacional.
- **Capa animada de marketing:** **Aceternity UI** + **Magic UI** para hero/feature sections; **Motion Primitives** para micro-motion editorial contenido.
- **Motor de motion:** **Motion** (motion.dev) para animación React + reveals in-view/scroll; sumá **GSAP + ScrollTrigger + SplitText** para coreografía cinematográfica en los titulares serif.
- **Ambient 3D/WebGL:** **React Three Fiber + drei** para los fondos del hero, con **Shadergradient** u **OGL** para los lavados de gradiente animado (**Cobe**/**Spline** para un único acento 3D premium).
- **Tipografía:** **Newsreader** (display serif) + **JetBrains Mono** (labels) de Google Fonts, self-hosted vía `next/font`.
- **Iconos:** **Lucide** como set por defecto (combina con shadcn); **Phosphor** donde quieras iconos con peso/carácter.
- **La fuente del look:** arrancá del `DESIGN.md` de **Neuform** (bajá el HTML / copiá el DESIGN.md) y reconstruilo sobre este stack en vez de hacer ingeniería inversa desde cero.

## Headless / primitives (comportamiento; vos estilás todo)

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Radix UI (Primitives) | https://www.radix-ui.com/primitives | Primitives accesibles sin estilo (dialog, popover, tabs): lienzo en blanco para pintar el look coral/oscuro. *Mantenimiento más lento tras la compra por WorkOS.* | MIT |
| Base UI | https://base-ui.com | De los equipos de Radix + MUI; hoy la capa de primitives sin estilo más activa — apuesta más segura a largo plazo que Radix para builds nuevos. | MIT |
| Headless UI | https://headlessui.com | Del equipo de Tailwind; componentes accesibles mínimos que componen perfecto con tus utilities. | MIT |
| Ark UI | https://ark-ui.com | Headless agnóstico de framework (React/Vue/Solid) sobre state machines: comportamiento sólido para que toda la energía vaya al estilo editorial. | MIT |
| React Aria (Adobe) | https://react-spectrum.adobe.com/react-aria/ | A11y + hooks de interacción de primer nivel, agnóstico de estilos — ideal para que componentes custom y motion-heavy queden correctos en teclado/lector. | Apache-2.0 |

## Sistemas token-based copy-paste

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| shadcn/ui | https://ui.shadcn.com | La capa base de todo este stack: sos dueño del código, lo theme-ás por CSS variables (canvas coral + paneles oscuros) y su registry trae las libs animadas de abajo. | MIT |
| Park UI | https://park-ui.com | Sobre Ark UI + Panda/Tailwind; generador de design-system token-first — ideal para una escala de color/espacio totalmente tokenizada. | MIT |
| 21st.dev | https://21st.dev | Marketplace/registry de componentes community compatibles con shadcn (el "npm para design engineers"). | Free + pago (mixto) |
| tweakcn | https://tweakcn.com | Editor visual de themes para shadcn/ui — afiná el canvas coral, surfaces, radios y fuentes y exportá el theme de CSS variables. | Free |

## Librerías animadas premium (las más on-brand)

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Aceternity UI | https://ui.aceternity.com | La fuente más on-brand: 200+ componentes copy-paste React + Tailwind + Motion (spotlight cards, aurora/background beams, 3D card hover, sticky scroll reveals). ESTO es el vibe "agency con motion con gusto". | Free + pago (Pro) |
| Magic UI | https://magicui.design | 150+ componentes animados compatibles con shadcn (beams, marquees, shimmer/gradient text, fondos de partículas/puntos). | MIT + templates pagos |
| Motion Primitives | https://motion-primitives.com | Componentes Motion (Framer) sobrios y editoriales (text shimmer, número animado, dialog morphing, reveals in-view). | MIT + Pro |
| Cult UI | https://www.cult-ui.com | Componentes Motion compatibles con shadcn para "design engineers" (dynamic islands, neumórfico, bento) — fuerte para feature sections oscuros premium. | MIT + templates pagos |
| SyntaxUI | https://syntaxui.com | React + Tailwind + Motion gratis, minimal y moderno — buenos efectos de texto animado, marquees y CTA. | Free |
| React Bits | https://reactbits.dev | Catálogo grande de efectos de texto/fondo/componentes (variable-proximity text, fondos ASCII/shader) — excelente para los momentos "WebGL ambient" + display serif sin escribir shaders a mano. | MIT |

## Colecciones Tailwind gratis

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| HyperUI | https://www.hyperui.dev | Bloques Tailwind v4 gratis (marketing/e-commerce/app) — scaffolding rápido de secciones estructurales que después re-skinás en la paleta editorial. | MIT |
| Preline UI | https://preline.co | 640+ componentes Tailwind v4 + 200+ layouts gratis — la librería de bloques gratis más amplia. | MIT (core) + Pro |
| Flowbite | https://flowbite.com | 400+ componentes (React/Vue/Svelte/HTML) con elementos interactivos (datepickers, modals) cuando necesitás comportamiento rápido. | MIT + bloques pagos |
| daisyUI | https://daisyui.com | Plugin Tailwind con clases semánticas + theming por tokens — rápido para definir un theme coral/oscuro custom. | MIT |
| TailGrids | https://tailgrids.com | 600+ componentes/bloques Tailwind (React/Vue/HTML) con kit de Figma. | Free (core) + Pro |
| Meraki UI | https://merakiui.com | Componentes Tailwind livianos gratis con soporte RTL + dark — bloques limpios que toman bien una paleta custom. | MIT |

## Premium / pago (valen para este look)

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| **Design+Code / Neuform (Meng To)** | https://neuform.ai | **LA fuente de esta estética exacta.** El Neuform de Meng To trae 400+ design systems como archivos `DESIGN.md` vivos (canvas coral, Newsreader, JetBrains Mono, motion WebGL/Three.js) — bajá el HTML o copiá el DESIGN.md y prompteá. **Empezá acá.** | DESIGN.md/HTML gratis; cursos pagos |
| Tailwind Plus (ex Tailwind UI) | https://tailwindcss.com/plus | 500+ componentes + templates oficiales del equipo Tailwind — el backbone production-quality que re-skinás. Rebranded de "Tailwind UI" en 2025. | Pago — $299 personal / $979 team (one-time, lifetime, incluye Catalyst) |
| Cruip | https://cruip.com | Templates Tailwind + React/Next pulidos con motion y tipografía refinada — el punto de partida pago más cercano a un portal casi completo. Templates gratis en GitHub. | Pago + templates gratis (MIT) |
| Aceternity UI Pro | https://ui.aceternity.com/pro | Templates/bloques premium de Aceternity — páginas agency-grade con el mismo ADN animado del tier gratis. | Pago |

## Librerías de animación

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Motion (ex Framer Motion) | https://motion.dev | El motor de motion React de todo este stack — animaciones declarativas, transiciones de layout, reveals scroll/in-view. Potencia Aceternity/Magic UI. Ahora independiente; importás de `motion/react`. | MIT |
| GSAP (+ ScrollTrigger) | https://gsap.com | Para la coreografía de scroll cinematográfica (pinning, timelines scrubbeados, SplitText para titulares serif). 100% gratis desde v3.13 (abr 2025), plugins bonus incluidos. | Free (incl. comercial; es de Webflow — no para construir un competidor de Webflow) |
| anime.js (v4) | https://animejs.com | Motor de timeline/stagger liviano y elegante — ideal para micro-animaciones de labels/texto mono y line work SVG sin un runtime React completo. | MIT |

## WebGL / 3D / fondos ambient

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Three.js | https://threejs.org | El motor WebGL fundacional para los backdrops "ambient" del hero — gradientes con shaders custom, partículas, momentos 3D. | MIT |
| React Three Fiber + drei | https://r3f.docs.pmnd.rs | Renderer React de Three.js (+ helpers drei: Environment, shaderMaterial, MeshTransmissionMaterial) — la forma idiomática de meter escenas 3D ambient en un portal React. | MIT |
| OGL | https://github.com/oframe/ogl | Librería WebGL mínima (~chica) — perfecta para un único shader/gradiente fullscreen performante sin el peso de Three.js. | MIT |
| Cobe | https://cobe.vercel.app | Globo WebGL de 5kb — el acento "un único objeto 3D premium" (globo interactivo en un panel oscuro). | MIT |
| Shadergradient | https://www.shadergradient.co | Gradientes shader animados config-driven para React/Three — el camino más rápido a los lavados de color ambient que acompañan el canvas coral. | MIT |
| Vanta.js | https://www.vantajs.com | Fondos WebGL animados plug-and-play (fog, waves, dots, halo) — sin saber shaders, cuando querés efecto rápido. | MIT |
| Spline | https://spline.design | Herramienta de diseño 3D en browser con runtime React — diseñá un objeto 3D a medida (sin GLSL) y embebelo; el centerpiece 3D de alto craft para un landing premium. | Free + planes pagos (runtime MIT) |

## Iconos

| Librería | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Lucide | https://lucide.dev | Iconos de trazo limpios y consistentes (fork de Feather) — el set de facto de shadcn/ui; peso de línea neutro que convive con un display serif sin competir. | ISC |
| Phosphor Icons | https://phosphoricons.com | Familia flexible con múltiples pesos (thin → bold/duotone) — el peso del icono puede hacer eco del contraste tipográfico editorial. | MIT |
| Tabler Icons | https://tabler.io/icons | 5000+ iconos de trazo consistentes — cobertura amplia para el lado data/dashboard del portal. | MIT |
| Heroicons | https://heroicons.com | Del equipo Tailwind, variantes outline + solid — minimal y Tailwind-native, default seguro. | MIT |

## Fuentes

| Fuente | URL | Por qué encaja | Licencia |
|---|---|---|---|
| Newsreader (Google Fonts) | https://fonts.google.com/specimen/Newsreader | El serif display en el corazón de esta estética — editorial, literario, con itálica de tamaño óptico para titulares elegantes. La cara exacta del template. | OFL |
| JetBrains Mono (Google Fonts) | https://fonts.google.com/specimen/JetBrains+Mono | El mono de labels/eyebrows/metadata — da la tensión "editorial-técnica" contra el serif. | OFL |
| JetBrains Mono (Fontshare) | https://www.fontshare.com/fonts/jet-brains-mono | Fuente CDN/self-host alternativa para JetBrains Mono. | Free |
| Fontshare | https://www.fontshare.com | Servicio de fuentes gratis de calidad — caras complementarias on-brand (Satoshi para UI body, Erode/Gambetta como serif alternos) si extendés más allá de las dos core. | Free (uso comercial) |

## Notas para el dev

- **Fuente del look:** la estética exacta (canvas coral, paneles oscuros, Newsreader display, JetBrains Mono, motion abundante, WebGL ambient) es de **Meng To** (@mengto) en **Neuform** (https://neuform.ai, p. ej. https://neuform.ai/user/mengto), la herramienta de diseño AI de Design+Code. Neuform publica 400+ design systems como `DESIGN.md` vivos + HTML descargable. Recomendado: agarrar el Neuform DESIGN.md de este estilo y promptear/reconstruir sobre el stack de arriba en vez de reversear desde cero.
- **Radix vs Base UI:** el mantenimiento de Radix se desaceleró tras su adquisición por WorkOS; para necesidades nuevas de primitives, preferí **Base UI**.
- **Renames 2025:** Framer Motion → **Motion** (paquete `motion`, import `motion/react`). **GSAP** pasó a 100% gratis para uso comercial desde v3.13 (abr 2025), plugins bonus incluidos — sigue siendo de Webflow y no se puede usar para construir un competidor de Webflow.

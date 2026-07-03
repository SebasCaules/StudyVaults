import type { SheetFigure } from "../types";

/* ──────────────────────────────────────────────────────────────────────────
   Figuras SVG reutilizables de las hojas de estudio. Un resumen tipo LaTeX no
   es sólo texto y fórmulas: a veces una campana, un boxplot o una oferta/demanda
   comunican mejor. Cada figura es un SVG inline ESTÁTICO (static-export safe):
   sin <script>, sin <image>, `viewBox` y sin width/height (la CSS la escala).

   Colores por TOKENS de rol, nunca hex: los trazos usan las clases helper
   definidas en packages/ui/src/styles/sheets.css (.sheet-fig-*), que a su vez
   se derivan del color de la entrada (`--k`) y de los tokens del sitio. Así la
   figura respeta tema oscuro/claro e impresión sin duplicarse.

   Se referencian desde los módulos de datos (ej. `figure: FIG.normalBell`).
   ────────────────────────────────────────────────────────────────────────── */

/** Campana normal con la regla empírica (±1σ ≈ 68%). */
const normalBell: SheetFigure = {
  alt: "Densidad normal en forma de campana, con el área central de ±1 desvío sombreada",
  caption: "Densidad **normal**: campana simétrica en $\\mu$; el $68\\%$ de la masa cae en $[\\mu-\\sigma,\\ \\mu+\\sigma]$.",
  svg: `<svg viewBox="0 0 320 160" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="20" y1="130" x2="304" y2="130"/>
  <path class="sheet-fig-area" d="M 120,130 L 120,69.3 L 126,60.3 L 132,51.7 L 138,44 L 144,37.7 L 150,33.1 L 156,30.5 L 162,30.1 L 168,32 L 174,35.9 L 180,41.8 L 186,49 L 192,57.4 L 198,66.3 L 200,130 Z"/>
  <path class="sheet-fig-curve" d="M 34,129.3 L 40,128.9 L 46,128.3 L 52,127.4 L 58,126.1 L 64,124.4 L 70,122 L 76,119 L 82,115.1 L 88,110.2 L 94,104.4 L 100,97.5 L 106,89.8 L 112,81.3 L 118,72.4 L 124,63.3 L 130,54.5 L 136,46.5 L 142,39.6 L 148,34.4 L 154,31.1 L 160,30 L 166,31.1 L 172,34.4 L 178,39.6 L 184,46.5 L 190,54.5 L 196,63.3 L 202,72.4 L 208,81.3 L 214,89.8 L 220,97.5 L 226,104.4 L 232,110.2 L 238,115.1 L 244,119 L 250,122 L 256,124.4 L 262,126.1 L 268,127.4 L 274,128.3 L 280,128.9 L 286,129.3"/>
  <line class="sheet-fig-grid" x1="160" y1="30" x2="160" y2="130" stroke-dasharray="3 3"/>
  <line class="sheet-fig-grid" x1="120" y1="126" x2="120" y2="134"/>
  <line class="sheet-fig-grid" x1="200" y1="126" x2="200" y2="134"/>
  <text class="sheet-fig-label--ink" x="160" y="98" text-anchor="middle" font-size="12">68%</text>
  <text class="sheet-fig-label" x="160" y="147" text-anchor="middle">μ</text>
  <text class="sheet-fig-label" x="120" y="147" text-anchor="middle">μ−σ</text>
  <text class="sheet-fig-label" x="200" y="147" text-anchor="middle">μ+σ</text>
</svg>`,
};

/** Diagrama de caja (boxplot) con las cercas de Tukey y un outlier. */
const boxplot: SheetFigure = {
  alt: "Diagrama de caja con mínimo, primer cuartil, mediana, tercer cuartil, máximo y un valor atípico",
  caption: "**Boxplot**: la caja abarca el $50\\%$ central ($q_1$ a $q_3$); fuera de las cercas $q_1-1.5\\,\\mathrm{IQR}$ y $q_3+1.5\\,\\mathrm{IQR}$ hay un outlier.",
  svg: `<svg viewBox="0 0 320 120" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="20" y1="100" x2="304" y2="100"/>
  <line class="sheet-fig-mark" x1="60" y1="60" x2="110" y2="60"/>
  <line class="sheet-fig-mark" x1="60" y1="48" x2="60" y2="72"/>
  <line class="sheet-fig-mark" x1="210" y1="60" x2="260" y2="60"/>
  <line class="sheet-fig-mark" x1="260" y1="48" x2="260" y2="72"/>
  <rect class="sheet-fig-area" x="110" y="38" width="100" height="44"/>
  <rect class="sheet-fig-mark" x="110" y="38" width="100" height="44"/>
  <line class="sheet-fig-curve" x1="160" y1="38" x2="160" y2="82"/>
  <circle class="sheet-fig-dot" cx="288" cy="60" r="3.5"/>
  <text class="sheet-fig-label" x="60" y="115" text-anchor="middle">mín</text>
  <text class="sheet-fig-label" x="110" y="30" text-anchor="middle">q₁</text>
  <text class="sheet-fig-label--ink" x="160" y="30" text-anchor="middle">Md</text>
  <text class="sheet-fig-label" x="210" y="30" text-anchor="middle">q₃</text>
  <text class="sheet-fig-label" x="288" y="115" text-anchor="middle">outlier</text>
</svg>`,
};

/** Densidad exponencial: decaimiento a tasa constante. */
const expDecay: SheetFigure = {
  alt: "Densidad exponencial decreciente desde el origen",
  caption: "Densidad **exponencial** $f(x)=\\lambda e^{-\\lambda x}$: decae a tasa constante; sin memoria.",
  svg: `<svg viewBox="0 0 320 160" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="40" y1="130" x2="304" y2="130"/>
  <line class="sheet-fig-axis" x1="40" y1="18" x2="40" y2="130"/>
  <path class="sheet-fig-area" d="M 40,130 L 40,30 L 45,37.7 L 50,44.8 L 55,51.3 L 60,57.4 L 65,63 L 70,68.1 L 75,72.9 L 80,77.3 L 85,81.3 L 90,85.1 L 95,88.5 L 100,91.7 L 105,94.7 L 110,97.4 L 115,99.9 L 120,102.2 L 125,104.3 L 130,106.3 L 135,108.1 L 140,109.8 L 145,111.4 L 150,112.8 L 155,114.1 L 160,115.3 L 165,116.5 L 170,117.5 L 175,118.5 L 180,119.4 L 185,120.2 L 190,120.9 L 195,121.6 L 200,122.3 L 205,122.9 L 210,123.4 L 215,123.9 L 220,124.4 L 225,124.8 L 230,125.2 L 235,125.6 L 240,125.9 L 245,126.2 L 250,126.5 L 255,126.8 L 260,127 L 265,127.3 L 270,127.5 L 275,127.7 L 280,127.9 L 285,128 L 290,128.2 L 290,130 Z"/>
  <path class="sheet-fig-curve" d="M 40,30 L 45,37.7 L 50,44.8 L 55,51.3 L 60,57.4 L 65,63 L 70,68.1 L 75,72.9 L 80,77.3 L 85,81.3 L 90,85.1 L 95,88.5 L 100,91.7 L 105,94.7 L 110,97.4 L 115,99.9 L 120,102.2 L 125,104.3 L 130,106.3 L 135,108.1 L 140,109.8 L 145,111.4 L 150,112.8 L 155,114.1 L 160,115.3 L 165,116.5 L 170,117.5 L 175,118.5 L 180,119.4 L 185,120.2 L 190,120.9 L 195,121.6 L 200,122.3 L 205,122.9 L 210,123.4 L 215,123.9 L 220,124.4 L 225,124.8 L 230,125.2 L 235,125.6 L 240,125.9 L 245,126.2 L 250,126.5 L 255,126.8 L 260,127 L 265,127.3 L 270,127.5 L 275,127.7 L 280,127.9 L 285,128 L 290,128.2"/>
  <text class="sheet-fig-label" x="46" y="26" text-anchor="start">f(x)</text>
  <text class="sheet-fig-label" x="298" y="126" text-anchor="end">x</text>
</svg>`,
};

/** Oferta y demanda: equilibrio de mercado. */
const supplyDemand: SheetFigure = {
  alt: "Curvas de oferta y demanda que se cruzan en el punto de equilibrio",
  caption: "**Equilibrio de mercado**: la demanda $D$ (decreciente) y la oferta $S$ (creciente) fijan el precio $P^{*}$ y la cantidad $Q^{*}$.",
  svg: `<svg viewBox="0 0 320 160" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="40" y1="130" x2="304" y2="130"/>
  <line class="sheet-fig-axis" x1="40" y1="18" x2="40" y2="130"/>
  <line class="sheet-fig-curve" x1="52" y1="30" x2="280" y2="125"/>
  <line class="sheet-fig-mark" x1="52" y1="125" x2="280" y2="30"/>
  <line class="sheet-fig-grid" x1="165" y1="77" x2="165" y2="130" stroke-dasharray="3 3"/>
  <line class="sheet-fig-grid" x1="40" y1="77" x2="165" y2="77" stroke-dasharray="3 3"/>
  <circle class="sheet-fig-dot" cx="165" cy="77" r="4"/>
  <text class="sheet-fig-label" x="284" y="122" text-anchor="start">D</text>
  <text class="sheet-fig-label" x="284" y="34" text-anchor="start">S</text>
  <text class="sheet-fig-label--ink" x="34" y="80" text-anchor="end">P*</text>
  <text class="sheet-fig-label--ink" x="165" y="145" text-anchor="middle">Q*</text>
  <text class="sheet-fig-label" x="30" y="24" text-anchor="end">P</text>
  <text class="sheet-fig-label" x="298" y="126" text-anchor="end">Q</text>
</svg>`,
};

/** Punto de equilibrio (break-even): ingreso total vs costo total. */
const breakEven: SheetFigure = {
  alt: "Rectas de ingreso total y costo total que se cruzan en el punto de equilibrio",
  caption: "**Break-even**: donde el ingreso total $IT$ iguala al costo total $CT=CF+cv\\,Q$; a la derecha hay ganancia.",
  svg: `<svg viewBox="0 0 320 160" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="40" y1="130" x2="304" y2="130"/>
  <line class="sheet-fig-axis" x1="40" y1="18" x2="40" y2="130"/>
  <line class="sheet-fig-grid" x1="40" y1="95" x2="290" y2="75"/>
  <line class="sheet-fig-curve" x1="40" y1="130" x2="290" y2="30"/>
  <line class="sheet-fig-grid" x1="40" y1="95" x2="40" y2="95"/>
  <line class="sheet-fig-grid" x1="149" y1="86" x2="149" y2="130" stroke-dasharray="3 3"/>
  <circle class="sheet-fig-dot" cx="149" cy="86" r="4"/>
  <text class="sheet-fig-label" x="294" y="30" text-anchor="start">IT</text>
  <text class="sheet-fig-label" x="294" y="74" text-anchor="start">CT</text>
  <text class="sheet-fig-label" x="34" y="98" text-anchor="end">CF</text>
  <text class="sheet-fig-label--ink" x="149" y="145" text-anchor="middle">Q*</text>
  <text class="sheet-fig-label" x="298" y="126" text-anchor="end">Q</text>
</svg>`,
};

/** Raíces n-ésimas de un complejo: n puntos equiespaciados en el círculo. */
const unitRoots: SheetFigure = {
  alt: "Seis raíces equiespaciadas sobre un círculo en el plano complejo",
  caption: "**Raíces $n$-ésimas** de $z$: $n$ puntos equiespaciados en el círculo de radio $\\sqrt[n]{\\rho}$, separados $2\\pi/n$.",
  svg: `<svg viewBox="0 0 320 160" role="img" xmlns="http://www.w3.org/2000/svg">
  <line class="sheet-fig-axis" x1="40" y1="80" x2="280" y2="80"/>
  <line class="sheet-fig-axis" x1="160" y1="14" x2="160" y2="146"/>
  <circle class="sheet-fig-mark" cx="160" cy="80" r="60" stroke-dasharray="4 3"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="160" y2="20"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="212" y2="50"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="212" y2="110"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="160" y2="140"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="108" y2="110"/>
  <line class="sheet-fig-grid" x1="160" y1="80" x2="108" y2="50"/>
  <circle class="sheet-fig-dot" cx="160" cy="20" r="3.5"/>
  <circle class="sheet-fig-dot" cx="212" cy="50" r="3.5"/>
  <circle class="sheet-fig-dot" cx="212" cy="110" r="3.5"/>
  <circle class="sheet-fig-dot" cx="160" cy="140" r="3.5"/>
  <circle class="sheet-fig-dot" cx="108" cy="110" r="3.5"/>
  <circle class="sheet-fig-dot" cx="108" cy="50" r="3.5"/>
  <text class="sheet-fig-label" x="276" y="76" text-anchor="end">Re</text>
  <text class="sheet-fig-label" x="166" y="22" text-anchor="start">Im</text>
</svg>`,
};

/** Catálogo de figuras por materia (se importa desde los módulos de datos). */
export const FIG = {
  normalBell,
  boxplot,
  expDecay,
  supplyDemand,
  breakEven,
  unitRoots,
} as const;

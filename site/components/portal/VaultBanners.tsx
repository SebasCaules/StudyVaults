import type { ReactNode } from "react";
import type { VaultId } from "@/lib/content/vaults";

// Ilustraciones por materia para las cards del portal. Cada una representa el
// TEMA de la materia de forma reconocible (balanza = derecho, campana = proba,
// ventana de navegador = web, calendario = planner…), no una abstracción.
// Todo por tokens de rol: currentColor = --vault-tint de la card; realces con
// --accent (coral) y --primary (azul). Nada de hex hardcodeado.
// preserveAspectRatio="slice" → cubren la cabecera de la card; el contenido se
// mantiene dentro de la banda central (y≈26..146) por si la card recorta.

const VB = "0 0 400 170";
const AR = "xMidYMid slice";

/** Fondo compartido: superficie + velo del tint de la materia. */
function Bg({ id, tint = "var(--vault-tint)" }: { id: string; tint?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.28" />
          <stop offset="0.55" stopColor={tint} stopOpacity="0.06" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="var(--surface-3)" />
      <rect width="400" height="170" fill={`url(#${id})`} />
    </>
  );
}

/** Sello mono discreto abajo a la izquierda (horizontal, on-brand). */
const sig = (s: string) => (
  <text
    x="16"
    y="150"
    fontFamily="var(--font-mono)"
    fontSize="10"
    letterSpacing="1.5"
    fill="var(--ink-strong)"
    stroke="var(--surface-3)"
    strokeWidth="3"
    strokeLinejoin="round"
    paintOrder="stroke"
  >
    {s}
  </text>
);

/** Muestrea y = f(x) sobre [x0,x1] con paso `step` y devuelve un atributo `d`
 *  ("M…L…") para dibujar la curva. Determinista: corre una vez al importar el
 *  módulo (sin `window`), así que es static-export safe (igual que el Math
 *  inline del banner de SDS). */
function plot(fn: (x: number) => number, x0: number, x1: number, step: number): string {
  let d = "";
  for (let x = x0; x <= x1 + 0.001; x += step) {
    d += (d ? "L" : "M") + x.toFixed(1) + " " + fn(x).toFixed(1);
  }
  return d;
}

export const BANNERS: Record<VaultId, ReactNode> = {
  // MNA — matriz (métodos numéricos) + curva muestreada (interpolación)
  mna: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-mna" />
      {/* matriz con corchetes */}
      <g stroke="currentColor" strokeWidth="2.4" opacity="0.75" strokeLinecap="round">
        <path d="M42 44v72M42 44h7M42 116h7" />
        <path d="M132 44v72M132 44h-7M132 116h-7" />
      </g>
      <g>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const on = (r + c) % 2 === 0;
            return (
              <rect
                key={`${r}-${c}`}
                x={56 + c * 24}
                y={52 + r * 22}
                width="16"
                height="16"
                rx="2"
                fill={on ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.2"
                opacity={on ? 0.38 : 0.5}
              />
            );
          }),
        )}
      </g>
      {/* eje + curva de interpolación con nodos muestra */}
      <path d="M164 40v96h216" stroke="currentColor" strokeWidth="1.3" opacity="0.4" />
      <path
        d="M176 112C204 112 214 66 244 84S296 52 320 92 356 74 380 66"
        stroke="var(--accent)"
        strokeWidth="2.4"
        opacity="0.92"
      />
      <g fill="var(--accent)">
        {[
          [176, 112],
          [244, 84],
          [292, 66],
          [320, 92],
          [352, 74],
          [380, 66],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" />
        ))}
      </g>
      {sig("SYS.01 · MNA")}
    </svg>
  ),

  // Derecho — balanza de la justicia
  derecho: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-der" />
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* mástil + base */}
        <path d="M200 48v82" strokeWidth="4" />
        <path d="M172 132h56" strokeWidth="4" />
        <path d="M162 148l16 -12h44l16 12" strokeWidth="3" opacity="0.7" />
        {/* viga */}
        <path d="M128 60h144" strokeWidth="3" />
        {/* cadenas */}
        <path d="M132 60l8 30M148 60l-8 30M268 60l-8 30M252 60l8 30" strokeWidth="1.4" opacity="0.75" />
        {/* platos */}
        <path d="M120 90a20 11 0 0 0 40 0" strokeWidth="2.4" />
        <path d="M240 90a20 11 0 0 0 40 0" strokeWidth="2.4" />
      </g>
      {/* fiel + pivote en acento */}
      <path d="M200 42l-5 12h10z" fill="var(--accent)" />
      <circle cx="200" cy="60" r="4.5" fill="var(--accent)" />
      {sig("SYS.02 · DERECHO")}
    </svg>
  ),

  // Economía — oferta y demanda cruzándose en el equilibrio
  economia: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-eco" />
      {/* ejes con puntas */}
      <path d="M74 30v102h296" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <path d="M74 30l-4 8h8zM370 132l-8 -4v8z" fill="currentColor" opacity="0.45" />
      {/* área bajo el cruce */}
      <path d="M96 122 223 84 96 46Z" fill="var(--vault-tint)" opacity="0.12" />
      {/* demanda (baja) y oferta (sube) */}
      <path d="M96 46 350 124" stroke="var(--primary)" strokeWidth="2.4" opacity="0.85" />
      <path d="M96 124 350 46" stroke="currentColor" strokeWidth="2.4" opacity="0.9" />
      {/* guías finas al equilibrio (sólidas, no punteadas) */}
      <path d="M74 84h149M223 132V84" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* equilibrio */}
      <circle cx="223" cy="84" r="9" fill="var(--accent)" opacity="0.18" />
      <circle cx="223" cy="84" r="4.5" fill="var(--accent)" />
      <text x="330" y="60" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor" opacity="0.7">O</text>
      <text x="330" y="120" fontFamily="var(--font-mono)" fontSize="11" fill="var(--primary)" opacity="0.8">D</text>
      {sig("SYS.03 · ECON")}
    </svg>
  ),

  // Proba — campana normal sobre un histograma
  proba: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-pro" />
      {/* histograma */}
      <g fill="currentColor" opacity="0.22">
        {[10, 20, 38, 62, 80, 80, 62, 38, 20, 10].map((h, i) => (
          <rect key={i} x={72 + i * 26} y={130 - h} width="22" height={h} rx="1.5" />
        ))}
      </g>
      {/* eje base */}
      <path d="M60 130h300" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* campana */}
      <path
        d="M64 130C150 130 158 52 200 52C242 52 250 130 336 130"
        stroke="var(--accent)"
        strokeWidth="2.6"
        opacity="0.92"
      />
      {/* media */}
      <path d="M200 54v76" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="200" cy="52" r="4.5" fill="var(--accent)" />
      {sig("SYS.04 · PROBA")}
    </svg>
  ),

  // PAW — ventana de navegador (app web) + servidor y request
  paw: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-paw" />
      {/* ventana */}
      <rect x="64" y="34" width="212" height="104" rx="7" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <path d="M64 56h212" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <g fill="currentColor" opacity="0.5">
        <circle cx="80" cy="45" r="3" />
        <circle cx="92" cy="45" r="3" />
        <circle cx="104" cy="45" r="3" />
      </g>
      <rect x="120" y="40" width="140" height="10" rx="5" fill="var(--primary)" opacity="0.45" />
      {/* contenido */}
      <rect x="80" y="66" width="180" height="12" rx="3" fill="currentColor" opacity="0.3" />
      <rect x="80" y="86" width="52" height="44" rx="3" fill="currentColor" opacity="0.2" />
      <rect x="144" y="86" width="116" height="14" rx="3" fill="currentColor" opacity="0.22" />
      <rect x="144" y="108" width="76" height="12" rx="3" fill="var(--accent)" opacity="0.65" />
      {/* request → servidor + base */}
      <path d="M282 78h20m-6 -4l6 4-6 4" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M302 96h-20m6 -4l-6 4 6 4" stroke="var(--accent)" strokeWidth="1.5" />
      <rect x="308" y="66" width="56" height="16" rx="2" fill="currentColor" opacity="0.42" />
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.55" fill="none">
        <path d="M312 100c0 -4 10 -7 24 -7s24 3 24 7v22c0 4 -10 7 -24 7s-24 -3 -24 -7z" />
        <path d="M312 100c0 4 10 7 24 7s24 -3 24 -7" />
      </g>
      {sig("SYS.05 · PAW")}
    </svg>
  ),

  // SDS — campo de partículas alineadas (Vicsek) con vectores de velocidad
  sds: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-sds" />
      <g strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => {
            const x = 48 + c * 38 + (r % 2) * 16;
            const y = 40 + r * 17;
            const ang = -0.35 + Math.sin((x + y * 1.4) / 55) * 0.55;
            const len = 13;
            const ex = x + Math.cos(ang) * len;
            const ey = y + Math.sin(ang) * len;
            // cabeza de flecha
            const ha = 0.5;
            const h1x = ex - Math.cos(ang - ha) * 5;
            const h1y = ey - Math.sin(ang - ha) * 5;
            const h2x = ex - Math.cos(ang + ha) * 5;
            const h2y = ey - Math.sin(ang + ha) * 5;
            const lead = c >= 4 && c <= 5 && r >= 2 && r <= 3;
            const col = lead ? "var(--accent)" : "currentColor";
            const op = lead ? 0.95 : 0.32 + (r / 6) * 0.4;
            return (
              <path
                key={`${r}-${c}`}
                d={`M${x} ${y}L${ex.toFixed(1)} ${ey.toFixed(1)}M${ex.toFixed(1)} ${ey.toFixed(1)}L${h1x.toFixed(1)} ${h1y.toFixed(1)}M${ex.toFixed(1)} ${ey.toFixed(1)}L${h2x.toFixed(1)} ${h2y.toFixed(1)}`}
                stroke={col}
                strokeWidth={lead ? 2 : 1.4}
                opacity={op}
              />
            );
          }),
        )}
      </g>
      {sig("SYS.06 · SDS")}
    </svg>
  ),

  // Inge2 — arquitectura por capas: servicio → componentes → base de datos
  inge2: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-ing" />
      {/* conectores */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55" fill="none">
        <path d="M200 54v10M108 76v-6h184v6M108 76v2M292 76v2M200 76v-6" />
        <path d="M200 106v14" />
      </g>
      {/* servicio (arriba) */}
      <rect x="160" y="30" width="80" height="24" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="160" y="30" width="80" height="24" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* componentes */}
      {[70, 162, 254].map((x) => (
        <g key={x}>
          <rect x={x} y="78" width="76" height="24" rx="3" fill="currentColor" opacity="0.32" />
          <rect x={x} y="78" width="76" height="24" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </g>
      ))}
      {/* base de datos (cilindro) */}
      <g stroke="var(--primary)" strokeWidth="1.6" fill="var(--primary)">
        <path d="M172 120c0 -5 13 -8 28 -8s28 3 28 8v18c0 5 -13 8 -28 8s-28 -3 -28 -8z" fillOpacity="0.18" />
        <path d="M172 120c0 5 13 8 28 8s28 -3 28 -8" fill="none" />
        <path d="M172 129c0 5 13 8 28 8s28 -3 28 -8" fill="none" opacity="0.6" />
      </g>
      {/* dependencia resaltada */}
      <path d="M200 108l-4 6h8z" fill="var(--accent)" />
      {sig("SYS.07 · INGE2")}
    </svg>
  ),

  // ---- expansión 2026-07: arte temático propio por materia ----

  // Física 1 — tiro oblicuo: trayectoria parabólica + vector velocidad inicial
  fisica1: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-f1" />
      {/* piso */}
      <path d="M40 132h336" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      {/* trayectoria parabólica punteada */}
      <path d="M56 132Q210 -36 364 132" stroke="currentColor" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" opacity="0.65" />
      {/* posiciones muestra */}
      <g fill="currentColor" opacity="0.5">
        <circle cx="133" cy="69" r="3" />
        <circle cx="210" cy="48" r="3" />
        <circle cx="287" cy="69" r="3" />
      </g>
      {/* vector velocidad inicial (foco) */}
      <path d="M56 132L100 84M88.9 88.7L100 84L96.3 95.5" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="56" cy="132" r="4" fill="var(--accent)" />
      {sig("SYS.08 · FÍSICA 1")}
    </svg>
  ),

  // Física 2 — onda modulada (batido) con su envolvente
  fisica2: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-f2" />
      {/* eje central */}
      <path d="M46 86h318" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* envolventes */}
      <g stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 5" opacity="0.4" fill="none">
        <path d={plot((x) => 86 - Math.abs(30 * Math.cos((x - 205) * 0.024)), 48, 362, 6)} />
        <path d={plot((x) => 86 + Math.abs(30 * Math.cos((x - 205) * 0.024)), 48, 362, 6)} />
      </g>
      {/* onda modulada (foco) */}
      <path
        d={plot((x) => 86 - 30 * Math.cos((x - 205) * 0.024) * Math.sin((x - 46) * 0.42), 46, 364, 3.5)}
        stroke="var(--accent)"
        strokeWidth="2.4"
        opacity="0.92"
        fill="none"
        strokeLinecap="round"
      />
      {sig("SYS.09 · FÍSICA 2")}
    </svg>
  ),

  // Física 3 — dipolo: dos cargas +/− con líneas de campo
  fisica3: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-f3" />
      {/* líneas de campo */}
      <g stroke="currentColor" strokeWidth="1.3" opacity="0.4" fill="none">
        <path d="M140 86Q200 46 260 86" />
        <path d="M140 86Q200 26 260 86" />
        <path d="M140 86Q200 126 260 86" />
        <path d="M140 86Q200 146 260 86" />
        <path d="M140 86h120" opacity="0.55" />
        <path d="M140 86Q96 60 84 40" />
        <path d="M140 86Q96 112 84 132" />
        <path d="M260 86Q304 60 316 40" />
        <path d="M260 86Q304 112 316 132" />
      </g>
      {/* carga negativa */}
      <circle cx="260" cy="86" r="15" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8" />
      <path d="M252 86h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* carga positiva (foco) */}
      <circle cx="140" cy="86" r="15" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="2" />
      <path d="M140 78v16M132 86h16" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      {sig("SYS.10 · FÍSICA 3")}
    </svg>
  ),

  // AM1 — área bajo la curva entre a y b + símbolo integral
  am1: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-am1" />
      {/* ejes */}
      <path d="M96 34v100h270" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <path d="M96 34l-4 8h8zM366 134l-8-4v8z" fill="currentColor" opacity="0.45" />
      {/* área ∫ sombreada */}
      <path
        d={plot((x) => 118 - 58 * Math.exp(-Math.pow((x - 210) / 68, 2)), 156, 286, 6) + "L286 134L156 134Z"}
        fill="currentColor"
        opacity="0.15"
      />
      {/* límites a, b */}
      <g stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4">
        <path d="M156 134V88M286 134V101" />
      </g>
      {/* curva f(x) */}
      <path
        d={plot((x) => 118 - 58 * Math.exp(-Math.pow((x - 210) / 68, 2)), 100, 360, 4)}
        stroke="currentColor"
        strokeWidth="2.2"
        opacity="0.85"
        fill="none"
        strokeLinecap="round"
      />
      {/* signo integral (foco) */}
      <g stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M126 52c0-7 9-8 11-2" />
        <path d="M126 52v52" />
        <path d="M126 104c0 7-9 8-11 2" />
      </g>
      {sig("SYS.11 · AM1")}
    </svg>
  ),

  // AM2 — curvas de nivel con vector gradiente hacia el máximo
  am2: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-am2" />
      {/* curvas de nivel */}
      <g transform="rotate(-14 205 86)" stroke="currentColor" fill="none">
        <ellipse cx="205" cy="86" rx="30" ry="20" strokeWidth="1.6" opacity="0.75" />
        <ellipse cx="205" cy="86" rx="56" ry="38" strokeWidth="1.4" opacity="0.55" />
        <ellipse cx="205" cy="86" rx="84" ry="57" strokeWidth="1.3" opacity="0.38" />
        <ellipse cx="205" cy="86" rx="112" ry="76" strokeWidth="1.2" opacity="0.24" />
      </g>
      <circle cx="205" cy="86" r="3.5" fill="currentColor" opacity="0.7" />
      {/* vector gradiente (foco) */}
      <path d="M300 40L232 76M244 75.4L232 76L239.2 66.4" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="300" cy="40" r="3.5" fill="var(--accent)" />
      {sig("SYS.12 · AM2")}
    </svg>
  ),

  // Álgebra — matriz entre corchetes + vectores base e₁ e₂
  algebra: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-alg" />
      {/* corchetes */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.7">
        <path d="M64 54v56M64 54h8M64 110h8" />
        <path d="M160 54v56M160 54h-8M160 110h-8" />
      </g>
      {/* entradas 2×2 */}
      <g fill="currentColor">
        <rect x="80" y="62" width="18" height="18" rx="2" opacity="0.42" />
        <rect x="118" y="62" width="18" height="18" rx="2" opacity="0.22" />
        <rect x="80" y="88" width="18" height="18" rx="2" opacity="0.22" />
        <rect x="118" y="88" width="18" height="18" rx="2" opacity="0.42" />
      </g>
      {/* ejes de base */}
      <path d="M250 128V60M250 128h96" stroke="currentColor" strokeWidth="1.3" opacity="0.4" />
      {/* e₂ */}
      <path d="M250 128V78M245 88L250 78L255 88" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" fill="none" />
      <text x="258" y="82" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor" opacity="0.7">e₂</text>
      {/* e₁ (foco) */}
      <path d="M250 128h52M292 123L302 128L292 133" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="284" y="120" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent)">e₁</text>
      {sig("SYS.13 · ÁLGEBRA")}
    </svg>
  ),

  // Discreta — grafo (nodos y aristas) con un nodo acentuado
  discreta: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-dis" />
      {/* aristas */}
      <path
        d="M120 58L192 44M192 44L258 82M120 58L176 110M176 110L258 82M258 82L322 56M258 82L308 122M192 44L176 110"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.5"
      />
      {/* nodos */}
      <g fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8">
        <circle cx="120" cy="58" r="10" />
        <circle cx="192" cy="44" r="10" />
        <circle cx="176" cy="110" r="10" />
        <circle cx="322" cy="56" r="10" />
        <circle cx="308" cy="122" r="10" />
      </g>
      {/* nodo foco */}
      <circle cx="258" cy="82" r="12" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="2.2" />
      {sig("SYS.14 · DISCRETA")}
    </svg>
  ),

  // Lógica — tabla de verdad con el condicional → resaltado
  logica: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-log" />
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55" fill="none">
        <rect x="132" y="42" width="156" height="98" rx="4" />
        <path d="M132 62h156M184 42v98M236 42v98" />
      </g>
      {/* encabezado p q */}
      <g fontFamily="var(--font-mono)" fontSize="13" fill="currentColor" textAnchor="middle">
        <text x="158" y="56">p</text>
        <text x="210" y="56">q</text>
      </g>
      {/* conectivo → (foco) */}
      <text x="262" y="56" fontFamily="var(--font-mono)" fontSize="14" fill="var(--accent)" textAnchor="middle">→</text>
      {/* filas V/F */}
      <g fontFamily="var(--font-mono)" fontSize="12" fill="currentColor" opacity="0.8" textAnchor="middle">
        <text x="158" y="80">V</text><text x="210" y="80">V</text><text x="262" y="80">V</text>
        <text x="158" y="98">V</text><text x="210" y="98">F</text><text x="262" y="98">F</text>
        <text x="158" y="116">F</text><text x="210" y="116">V</text><text x="262" y="116">V</text>
        <text x="158" y="134">F</text><text x="210" y="134">F</text><text x="262" y="134">V</text>
      </g>
      {sig("SYS.15 · LÓGICA")}
    </svg>
  ),

  // Métodos Numéricos — Newton-Raphson: tangentes convergiendo a la raíz
  metnum: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-mn" />
      {/* eje x */}
      <path d="M70 124h296" stroke="currentColor" strokeWidth="1.3" opacity="0.4" />
      {/* curva f(x) */}
      <path d="M138 132C200 116 268 82 360 44" stroke="currentColor" strokeWidth="2.2" opacity="0.85" strokeLinecap="round" />
      {/* tangentes de Newton */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.6" strokeLinecap="round">
        <path d="M330 52L250 124" />
        <path d="M250 84L178 124" />
        <path d="M178 110L152 124" />
      </g>
      {/* caídas verticales */}
      <g stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 4" opacity="0.4">
        <path d="M250 124V84M178 124V110" />
      </g>
      {/* iterados sobre la curva */}
      <g fill="currentColor" opacity="0.7">
        <circle cx="330" cy="52" r="3" />
        <circle cx="250" cy="84" r="3" />
        <circle cx="178" cy="110" r="3" />
      </g>
      {/* raíz (foco) */}
      <circle cx="150" cy="124" r="9" fill="var(--accent)" fillOpacity="0.18" />
      <circle cx="150" cy="124" r="4.5" fill="var(--accent)" />
      {sig("SYS.16 · METNUM")}
    </svg>
  ),

  // PI — lista enlazada: cajas con dato + puntero al siguiente
  pi: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-pi" />
      <text x="40" y="60" fontFamily="var(--font-mono)" fontSize="10" fill="currentColor" opacity="0.55" letterSpacing="1">head</text>
      {[64, 184, 304].map((x, i) => (
        <g key={x}>
          <rect x={x} y="70" width="68" height="40" rx="4" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" />
          <path d={`M${x + 44} 70v40`} stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <rect x={x + 10} y="82" width="24" height="16" rx="2" fill="currentColor" opacity="0.28" />
          {i < 2 ? (
            <circle cx={x + 56} cy="90" r="3.5" fill="currentColor" opacity="0.65" />
          ) : (
            <path d={`M${x + 48} 80L${x + 66} 104`} stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
          )}
        </g>
      ))}
      {/* enlaces */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none">
        <path d="M120 90h58m-10-5l10 5-10 5" />
        <path d="M240 90h58m-10-5l10 5-10 5" />
      </g>
      {/* head → primer nodo (foco) */}
      <path d="M42 66v10c0 6 6 8 12 8h8m-8-5l8 5-8 5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {sig("SYS.17 · PI")}
    </svg>
  ),

  // POO — jerarquía UML: clase base → subclases (generalización)
  poo: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-poo" />
      {/* conectores de herencia */}
      <path d="M110 104V88h180v16M200 88v-14" stroke="currentColor" strokeWidth="1.5" opacity="0.55" fill="none" />
      {/* clase base */}
      <rect x="160" y="34" width="80" height="40" rx="3" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M160 50h80M160 62h80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="176" y="39" width="48" height="6" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="168" y="53" width="30" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="168" y="65" width="40" height="4" rx="2" fill="currentColor" opacity="0.3" />
      {/* subclases */}
      {[70, 250].map((x) => (
        <g key={x}>
          <rect x={x} y="104" width="80" height="38" rx="3" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.4" />
          <path d={`M${x} 120h80`} stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <rect x={x + 16} y="108" width="48" height="6" rx="3" fill="currentColor" opacity="0.4" />
          <rect x={x + 8} y="124" width="34" height="4" rx="2" fill="currentColor" opacity="0.28" />
        </g>
      ))}
      {/* triángulo de generalización (foco) */}
      <path d="M200 74l-8 12h16z" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      {sig("SYS.18 · POO")}
    </svg>
  ),

  // EDA — árbol binario balanceado con rotación insinuada
  eda: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-eda" />
      {/* aristas */}
      <path
        d="M200 46L152 84M200 46L248 84M152 84L122 122M152 84L182 122M248 84L278 122M248 84L218 122"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.55"
      />
      {/* nodos */}
      <g fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8">
        <circle cx="200" cy="46" r="12" />
        <circle cx="152" cy="84" r="11" />
        <circle cx="248" cy="84" r="11" />
        <circle cx="122" cy="122" r="10" />
        <circle cx="182" cy="122" r="10" />
        <circle cx="278" cy="122" r="10" />
        <circle cx="218" cy="122" r="10" />
      </g>
      {/* rotación insinuada (foco) */}
      <path d="M268 62A26 26 0 1 1 290 94" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M290 94l-3-11 11 4z" fill="var(--accent)" />
      {sig("SYS.19 · EDA")}
    </svg>
  ),

  // Arqui — chip con pines + pila de frames (SP al tope)
  arqui: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-arq" />
      {/* pines */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        {[0, 1, 2, 3].map((i) => (
          <path key={`t${i}`} d={`M${96 + i * 16} 46v-10`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={`b${i}`} d={`M${96 + i * 16} 118v10`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={`l${i}`} d={`M84 ${58 + i * 14}h-10`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={`r${i}`} d={`M162 ${58 + i * 14}h10`} />
        ))}
      </g>
      {/* chip */}
      <rect x="84" y="46" width="78" height="72" rx="5" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8" />
      <rect x="100" y="62" width="46" height="40" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1" />
      <circle cx="106" cy="53" r="2" fill="currentColor" opacity="0.6" />
      <text x="123" y="88" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor" opacity="0.7" textAnchor="middle">CPU</text>
      {/* pila de frames */}
      <g fill="currentColor">
        <rect x="256" y="102" width="96" height="24" rx="2" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="256" y="78" width="96" height="24" rx="2" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.4" />
      </g>
      {/* frame activo + SP (foco) */}
      <rect x="256" y="54" width="96" height="24" rx="2" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="1.8" />
      <path d="M374 66h-16m6-5l-6 5 6 5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {sig("SYS.20 · ARQUI")}
    </svg>
  ),

  // SO — línea de tiempo de procesos con context switches
  so: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-so" />
      <g fontFamily="var(--font-mono)" fontSize="10" fill="currentColor" opacity="0.6">
        <text x="42" y="60">P1</text>
        <text x="42" y="92">P2</text>
        <text x="42" y="124">P3</text>
      </g>
      {/* carriles */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.2">
        <path d="M76 56h300M76 88h300M76 120h300" />
      </g>
      {/* bloques de ejecución */}
      <g fill="currentColor" opacity="0.4">
        <rect x="76" y="48" width="70" height="16" rx="2" />
        <rect x="206" y="112" width="66" height="16" rx="2" />
        <rect x="272" y="48" width="52" height="16" rx="2" />
        <rect x="324" y="80" width="52" height="16" rx="2" />
      </g>
      {/* bloque activo (foco) */}
      <rect x="146" y="80" width="60" height="16" rx="2" fill="var(--accent)" opacity="0.85" />
      {/* context switches */}
      <g stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 4" opacity="0.35">
        <path d="M146 44v90M206 44v90M272 44v90M324 44v90" />
      </g>
      {/* eje tiempo */}
      <path d="M76 136h300" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {sig("SYS.21 · SO")}
    </svg>
  ),

  // TLA — autómata: estados, transiciones y estado de aceptación (doble círculo)
  tla: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-tla" />
      {/* flecha de inicio */}
      <path d="M56 92H88m-7-6l7 6-7 6" stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* transiciones */}
      <g stroke="currentColor" strokeWidth="1.6" opacity="0.65" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M127.5 87.8L192.5 72.2M182.7 70.2L192.5 72.2L184.7 78.4" />
        <path d="M227.3 73L288.7 91M281.2 84.4L288.7 91L278.8 92.5" />
        <path d="M100 76A12 12 0 1 1 120 76M120 76l-7 1M120 76l-1 7" />
      </g>
      {/* estados */}
      <circle cx="110" cy="92" r="18" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="210" cy="68" r="18" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8" />
      {/* estado de aceptación (foco) */}
      <circle cx="306" cy="96" r="18" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="306" cy="96" r="12.5" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <g fontFamily="var(--font-mono)" fontSize="11" opacity="0.85" textAnchor="middle">
        <text x="110" y="96" fill="currentColor">q0</text>
        <text x="210" y="72" fill="currentColor">q1</text>
        <text x="306" y="100" fill="var(--accent)">q2</text>
      </g>
      {sig("SYS.22 · TLA")}
    </svg>
  ),

  // BD1 — dos tablas relacionales unidas por una relación FK → PK
  bd1: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-bd1" />
      {/* tabla A */}
      <rect x="64" y="44" width="104" height="86" rx="4" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M64 64h104M64 86h104M64 108h104" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="64" y="44" width="104" height="20" rx="4" fill="currentColor" opacity="0.32" />
      <rect x="74" y="72" width="30" height="6" rx="3" fill="currentColor" opacity="0.42" />
      <rect x="74" y="94" width="46" height="6" rx="3" fill="currentColor" opacity="0.24" />
      <rect x="74" y="116" width="40" height="6" rx="3" fill="currentColor" opacity="0.24" />
      {/* tabla B */}
      <rect x="248" y="52" width="100" height="78" rx="4" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M248 72h100M248 94h100" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="248" y="52" width="100" height="20" rx="4" fill="currentColor" opacity="0.32" />
      <rect x="258" y="80" width="28" height="6" rx="3" fill="currentColor" opacity="0.42" />
      <rect x="258" y="102" width="44" height="6" rx="3" fill="currentColor" opacity="0.24" />
      {/* relación FK → PK (foco) */}
      <path d="M168 98H210c8 0 8-16 16-16h22m-8-5l8 5-8 5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="168" cy="98" r="3" fill="var(--accent)" />
      {sig("SYS.23 · BD1")}
    </svg>
  ),

  // Protos — pila de capas con un paquete bajando (encapsulado)
  protos: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-pro" />
      {["APP", "TRA", "RED", "ENL"].map((l, i) => (
        <g key={l}>
          <rect x="96" y={40 + i * 24} width="184" height="20" rx="3" fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.4" />
          <text x="110" y={54 + i * 24} fontFamily="var(--font-mono)" fontSize="9" fill="currentColor" opacity="0.6" letterSpacing="1">
            {l}
          </text>
          <rect x="150" y={47 + i * 24} width="96" height="6" rx="3" fill="currentColor" opacity="0.22" />
        </g>
      ))}
      {/* flecha de descenso (foco) */}
      <path d="M320 44v78m-6-10l6 10 6-10" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* paquete que baja */}
      <rect x="308" y="58" width="24" height="16" rx="2" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="1.6" />
      {sig("SYS.24 · PROTOS")}
    </svg>
  ),

  // Química — molécula VSEPR: átomo central + enlaces (uno en cuña)
  quimica: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-qui" />
      {/* enlaces */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.7">
        <path d="M200 86L200 46" />
        <path d="M200 86L150 118" />
        <path d="M200 86L250 118" />
      </g>
      {/* enlace en cuña (3D) */}
      <path d="M200 86L241 64L235 56Z" fill="currentColor" opacity="0.45" />
      {/* arco de ángulo de enlace */}
      <path d="M182 100A24 24 0 0 0 218 100" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* átomos periféricos */}
      <g fill="var(--surface-2)" stroke="currentColor" strokeWidth="1.8">
        <circle cx="200" cy="42" r="12" />
        <circle cx="146" cy="122" r="12" />
        <circle cx="254" cy="122" r="12" />
        <circle cx="242" cy="56" r="11" />
      </g>
      {/* átomo central (foco) */}
      <circle cx="200" cy="86" r="17" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="2.2" />
      {sig("SYS.25 · QUÍMICA")}
    </svg>
  ),

  // Info — registros Z80 en pares (B/C D/E H/L) con bytes en hex; HL acentuado
  info: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-inf" />
      {[
        { x: 64, hi: "B", lo: "C", hv: "3A", lv: "7F", accent: false },
        { x: 180, hi: "D", lo: "E", hv: "00", lv: "1C", accent: false },
        { x: 296, hi: "H", lo: "L", hv: "FF", lv: "08", accent: true },
      ].map((r) => {
        const stroke = r.accent ? "var(--accent)" : "currentColor";
        return (
          <g key={r.hi}>
            <text x={r.x + 18} y="58" fontFamily="var(--font-mono)" fontSize="11" fill={stroke} textAnchor="middle" opacity={r.accent ? 1 : 0.65}>
              {r.hi}
            </text>
            <text x={r.x + 52} y="58" fontFamily="var(--font-mono)" fontSize="11" fill={stroke} textAnchor="middle" opacity={r.accent ? 1 : 0.65}>
              {r.lo}
            </text>
            <rect x={r.x} y="66" width="36" height="34" rx="3" fill={r.accent ? "var(--accent)" : "var(--surface-2)"} fillOpacity={r.accent ? 0.18 : 1} stroke={stroke} strokeWidth={r.accent ? 2 : 1.6} />
            <rect x={r.x + 34} y="66" width="36" height="34" rx="3" fill={r.accent ? "var(--accent)" : "var(--surface-2)"} fillOpacity={r.accent ? 0.18 : 1} stroke={stroke} strokeWidth={r.accent ? 2 : 1.6} />
            <text x={r.x + 18} y="88" fontFamily="var(--font-mono)" fontSize="12" fill="currentColor" textAnchor="middle" opacity="0.8">
              {r.hv}
            </text>
            <text x={r.x + 52} y="88" fontFamily="var(--font-mono)" fontSize="12" fill="currentColor" textAnchor="middle" opacity="0.8">
              {r.lv}
            </text>
          </g>
        );
      })}
      {sig("SYS.26 · INFO")}
    </svg>
  ),
};

// Banner del Planificador de electivas — un calendario (mes con días y clases
// agendadas). Azul de "herramienta" (--primary) con el día resaltado en acento.
export const PLANNER_BANNER: ReactNode = (
  <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
    <Bg id="vb-plan" tint="var(--primary)" />
    {/* marco del calendario */}
    <rect x="118" y="26" width="164" height="120" rx="7" fill="var(--surface-2)" stroke="var(--primary)" strokeWidth="1.6" />
    {/* cabecera */}
    <path d="M118 52h164" stroke="var(--primary)" strokeWidth="1.4" opacity="0.5" />
    <rect x="132" y="35" width="58" height="7" rx="3.5" fill="var(--primary)" opacity="0.7" />
    <g stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
      <path d="M250 39l-4 4 4 4" />
      <path d="M264 39l4 4-4 4" />
    </g>
    {/* fila de días de la semana */}
    <g fill="var(--primary)" opacity="0.45">
      {[132, 160, 188, 216, 244].map((x) => (
        <rect key={x} x={x} y="58" width="14" height="4" rx="2" />
      ))}
    </g>
    {/* grilla de días */}
    <g>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const x = 132 + c * 28;
          const y = 68 + r * 24;
          const accent = r === 1 && c === 2;
          const filled = (r === 0 && c === 3) || (r === 2 && c === 1);
          const fill = accent
            ? "var(--accent)"
            : filled
              ? "var(--primary)"
              : "none";
          const op = accent ? 0.9 : filled ? 0.5 : 0.5;
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width="20"
              height="18"
              rx="3"
              fill={fill}
              stroke={accent || filled ? "none" : "var(--primary)"}
              strokeWidth="1.1"
              opacity={op}
            />
          );
        }),
      )}
    </g>
    {sig("SYS · PLANNER")}
  </svg>
);

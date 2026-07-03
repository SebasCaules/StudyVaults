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

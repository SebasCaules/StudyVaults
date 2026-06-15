import type { ReactNode } from "react";
import type { VaultId } from "@/lib/content/vaults";

// Banners artísticos por materia: composiciones por capas con gradientes
// derivados de la paleta (tint de materia + coral acento + azul), en el
// lenguaje editorial-técnico del sitio. currentColor = --vault-tint.
// preserveAspectRatio="slice" → cubren la cabecera de la card.

const VB = "0 0 400 170";
const AR = "xMidYMid slice";

function Bg({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--vault-tint)" stopOpacity="0.30" />
          <stop offset="0.55" stopColor="var(--vault-tint)" stopOpacity="0.06" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--vault-tint)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="var(--surface-3)" />
      <rect width="400" height="170" fill={`url(#${id})`} />
    </>
  );
}

const sig = (s: string) => (
  <text
    x="16"
    y="156"
    fontFamily="var(--font-mono)"
    fontSize="10"
    letterSpacing="1.5"
    fill="var(--ink-strong)"
    opacity="0.8"
  >
    {s}
  </text>
);

export const BANNERS: Record<VaultId, ReactNode> = {
  // MNA — campo de ondas (Fourier) superpuestas + retícula de matriz
  mna: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-mna" />
      <g fill="currentColor" opacity="0.22">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => (
            <circle key={`${r}-${c}`} cx={250 + c * 26} cy={28 + r * 26} r="1.6" />
          )),
        )}
      </g>
      <path d="M-10 96C40 56 70 56 110 96S180 136 220 96 300 56 410 96" stroke="url(#vb-mna-s)" strokeWidth="2.4" opacity="0.9" />
      <path d="M-10 110C40 78 70 78 110 110S180 142 220 110 300 80 410 110" stroke="var(--primary)" strokeWidth="1.6" opacity="0.5" />
      <path d="M-10 82C40 118 70 118 110 82S180 50 220 82 300 116 410 82" stroke="var(--accent)" strokeWidth="1.4" opacity="0.55" />
      <circle cx="110" cy="96" r="4.5" fill="var(--accent)" />
      {sig("SYS.01 · MNA")}
    </svg>
  ),

  // Derecho — colonnade de columnas (altura variable) + dintel + clave coral
  derecho: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-der" />
      <path d="M44 52h320" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <g fill="currentColor">
        {[60, 104, 148, 192, 236, 280, 324].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={62}
            width="20"
            height={48 + (i % 3) * 18}
            opacity={0.22 + (i % 3) * 0.12}
          />
        ))}
      </g>
      <path d="M192 30 210 52H174z" fill="var(--accent)" />
      <path d="M44 52 210 30 376 52" stroke="var(--accent)" strokeWidth="1.4" opacity="0.5" />
      {sig("SYS.02 · DERECHO")}
    </svg>
  ),

  // Economía — oferta/demanda con área de gradiente + equilibrio incandescente
  economia: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-eco" />
      <path d="M70 26v104h300" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <path d="M84 40C180 86 250 110 360 126L360 130 84 130Z" fill="var(--vault-tint)" opacity="0.16" />
      <path d="M84 40C180 86 250 110 360 126" stroke="currentColor" strokeWidth="2.4" opacity="0.9" />
      <path d="M84 128C180 104 250 60 360 32" stroke="var(--primary)" strokeWidth="2.2" opacity="0.7" />
      <path d="M212 86V130M70 86H212" stroke="var(--accent-line)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="212" cy="86" r="9" fill="var(--accent)" opacity="0.18" />
      <circle cx="212" cy="86" r="4.5" fill="var(--accent)" />
      {sig("SYS.03 · ECON")}
    </svg>
  ),

  // Proba — campanas de Gauss superpuestas (distribuciones) + muestras
  proba: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-pro" />
      <path d="M30 132h340" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <path d="M60 132C150 132 150 58 200 58C250 58 250 132 340 132Z" fill="var(--vault-tint)" opacity="0.16" />
      <path d="M60 132C150 132 150 58 200 58C250 58 250 132 340 132" stroke="currentColor" strokeWidth="2.4" opacity="0.85" />
      <path d="M110 132C175 132 168 84 215 84C262 84 250 132 320 132" stroke="var(--primary)" strokeWidth="1.6" opacity="0.55" />
      <path d="M40 132C120 132 130 100 170 100C210 100 205 132 270 132" stroke="var(--accent)" strokeWidth="1.4" opacity="0.5" />
      <g fill="currentColor" opacity="0.6">
        {[150, 175, 200, 225, 250].map((x, i) => (
          <circle key={x} cx={x} cy={120 - (i === 2 ? 30 : Math.abs(2 - i) * 8)} r="1.8" />
        ))}
      </g>
      <circle cx="200" cy="58" r="4.5" fill="var(--accent)" />
      {sig("SYS.04 · PROBA")}
    </svg>
  ),

  // PAW — paneles apilados (MVC) con profundidad + flujo de request
  paw: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-paw" />
      <g opacity="0.9">
        {[
          { y: 30, o: 0.3 },
          { y: 58, o: 0.4 },
          { y: 86, o: 0.5 },
          { y: 114, o: 0.62 },
        ].map((p) => (
          <g key={p.y}>
            <rect x="120" y={p.y} width="180" height="20" rx="3" fill="currentColor" opacity={p.o} />
            <rect x="120" y={p.y} width="180" height="20" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </g>
        ))}
      </g>
      <path d="M210 50v8M210 78v8M210 106v8" stroke="var(--primary)" strokeWidth="1.4" />
      <g fill="var(--primary)">
        {[54, 82, 110].map((y) => (
          <path key={y} d={`M206 ${y}l4 5 4-5z`} />
        ))}
      </g>
      <circle cx="210" cy="40" r="4.5" fill="var(--accent)" />
      {sig("SYS.05 · PAW")}
    </svg>
  ),

  // SDS — campo de flujo de partículas alineadas (Vicsek) + líder coral
  sds: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-sds" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => {
            const x = 50 + c * 36 + (r % 2) * 14;
            const y = 36 + r * 16;
            const ang = -0.5 + Math.sin((x + y) / 60) * 0.5;
            const dx = Math.cos(ang) * 12;
            const dy = Math.sin(ang) * 12;
            return (
              <g key={`${r}-${c}`} opacity={0.35 + (r / 7) * 0.4}>
                <path d={`M${x} ${y}l${dx.toFixed(1)} ${dy.toFixed(1)}`} />
              </g>
            );
          }),
        )}
      </g>
      <g stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
        <path d="M196 92l13 -6" />
        <circle cx="196" cy="92" r="2.6" fill="var(--accent)" />
      </g>
      {sig("SYS.06 · SDS")}
    </svg>
  ),

  // Inge2 — bloques de arquitectura con profundidad + dependencias
  inge2: (
    <svg className="vaultcard__banner" viewBox={VB} preserveAspectRatio={AR} fill="none" aria-hidden="true">
      <Bg id="vb-ing" />
      <g>
        <rect x="150" y="36" width="100" height="30" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="64" y="92" width="92" height="30" rx="3" fill="currentColor" opacity="0.34" />
        <rect x="244" y="92" width="92" height="30" rx="3" fill="currentColor" opacity="0.34" />
        <g stroke="currentColor" strokeWidth="1.4" opacity="0.6">
          <path d="M200 66v14M200 80H110v12M200 80h90v12" />
        </g>
        <g stroke="currentColor" strokeWidth="1" opacity="0.4">
          <rect x="150" y="36" width="100" height="30" rx="3" />
          <rect x="64" y="92" width="92" height="30" rx="3" />
          <rect x="244" y="92" width="92" height="30" rx="3" />
        </g>
      </g>
      <path d="M156 107h-6m6 0l-5 -3m5 3l-5 3" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="200" cy="36" r="4.5" fill="var(--accent)" />
      {sig("SYS.07 · INGE2")}
    </svg>
  ),
};

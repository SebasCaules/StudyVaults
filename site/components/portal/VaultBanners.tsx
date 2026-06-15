import type { ReactNode } from "react";
import type { VaultId } from "@/lib/content/vaults";

// Sistema de banners: 7 láminas de una misma colección. Retícula hairline +
// signatura mono + un motivo monolínea propio de cada materia + una chispa coral.
// currentColor = --vault-tint (heredado del data-vault de la card).

const GRID = (
  <g stroke="var(--hairline)" strokeWidth="1">
    <path d="M0 35h400M0 70h400M0 105h400" />
    <path d="M100 0v140M200 0v140M300 0v140" opacity="0.5" />
  </g>
);
const sig = (s: string) => (
  <text
    x="14"
    y="130"
    fontFamily="var(--font-mono)"
    fontSize="10"
    letterSpacing="1.5"
    fill="var(--ink-strong)"
    opacity="0.85"
  >
    {s}
  </text>
);

export const BANNERS: Record<VaultId, ReactNode> = {
  // MNA — matriz con corchetes + diagonal de factorización + curva
  mna: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55">
        <path d="M120 30v80M120 30h7M120 110h7" />
        <path d="M210 30v80M210 30h-7M210 110h-7" />
      </g>
      <g fill="currentColor">
        {[44, 62, 80, 98].map((y) =>
          [140, 165, 190].map((x) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={x - 140 === y - 44 ? 3 : 1.7}
              opacity={x - 140 === y - 44 ? 1 : 0.5}
            />
          )),
        )}
      </g>
      <path d="M140 44 190 98" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <path d="M250 36C300 56 300 96 256 112" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <path d="M300 30v90M295 36l5-6 5 6" stroke="currentColor" strokeWidth="1.6" opacity="0.8" />
      <circle cx="140" cy="44" r="3.4" fill="var(--accent)" />
      {sig("SYS.01 · MNA")}
    </svg>
  ),
  // Derecho — árbol jerárquico de unidades (raíz coral → ramas numeradas)
  derecho: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.75">
        <path d="M200 28 110 70M200 28 200 70M200 28 290 70" />
        <path d="M110 70 80 104M110 70 140 104M290 70 260 104M290 70 320 104M200 70 200 104" />
      </g>
      <g fill="currentColor">
        {[
          [80, 104],
          [140, 104],
          [200, 104],
          [260, 104],
          [320, 104],
          [110, 70],
          [200, 70],
          [290, 70],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
        ))}
      </g>
      <circle cx="200" cy="28" r="5" fill="var(--accent)" />
      {sig("SYS.02 · DERECHO")}
    </svg>
  ),
  // Economía — ejes P-Q + curvas oferta/demanda, equilibrio coral
  economia: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <path d="M70 22v92h300" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M88 34C170 70 250 96 348 110" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <path d="M88 110C170 92 250 58 348 30" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M214 74V114M70 74H214" stroke="var(--accent-line)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="214" cy="74" r="4.5" fill="var(--accent)" />
      <text x="56" y="28" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-secondary)">P</text>
      <text x="352" y="126" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-secondary)">Q</text>
      {sig("SYS.03 · ECON")}
    </svg>
  ),
  // Proba — campana de Gauss con área ±σ y media coral
  proba: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <path d="M40 112h320" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M60 112C140 112 150 36 200 36C250 36 260 112 340 112" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <path d="M150 112C175 102 188 64 200 50C212 64 225 102 250 112Z" fill="currentColor" opacity="0.14" />
      <path d="M200 36V112" stroke="var(--accent-line)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="200" cy="36" r="4.5" fill="var(--accent)" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.5">
        <path d="M150 108v8M250 108v8" />
      </g>
      {sig("SYS.04 · PROBA")}
    </svg>
  ),
  // PAW — capas MVC (request→Controller→Service→Repo→DB) con flechas
  paw: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.7">
        {[34, 60, 86, 112].map((y) => (
          <rect key={y} x="130" y={y - 9} width="140" height="18" rx="3" />
        ))}
        <path d="M200 43v8M200 69v8M200 95v8" />
      </g>
      <g fill="currentColor" opacity="0.7">
        {[51, 77, 103].map((y) => (
          <path key={y} d={`M196 ${y}l4 5 4-5z`} />
        ))}
      </g>
      <circle cx="200" cy="34" r="4.5" fill="var(--accent)" />
      {sig("SYS.05 · PAW")}
    </svg>
  ),
  // SDS — enjambre Vicsek: partículas con vectores alineados + caja periódica
  sds: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <rect x="110" y="26" width="180" height="88" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.45" strokeDasharray="5 5" />
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.85">
        {[
          [140, 50],
          [175, 44],
          [210, 58],
          [245, 50],
          [155, 82],
          [195, 90],
          [235, 84],
          [265, 66],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="2" fill="currentColor" />
            <path d={`M${x} ${y}l11 -5`} />
          </g>
        ))}
      </g>
      <g stroke="var(--accent)" strokeWidth="1.6">
        <circle cx="195" cy="90" r="2.4" fill="var(--accent)" />
        <path d="M195 90l11 -5" />
      </g>
      {sig("SYS.06 · SDS")}
    </svg>
  ),
  // Inge2 — componentes conectados (arquitectura/ADR) + dependencia coral
  inge2: (
    <svg className="vaultcard__banner" viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <rect width="400" height="140" fill="var(--surface-3)" />
      {GRID}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.7" fill="none">
        <rect x="60" y="44" width="80" height="40" rx="3" />
        <rect x="260" y="44" width="80" height="40" rx="3" />
        <rect x="160" y="90" width="80" height="34" rx="3" />
        <path d="M140 64h120M200 90V64" />
      </g>
      <path d="M256 64h-8m8 0l-6 -4m6 4l-6 4" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="100" cy="64" r="3" fill="currentColor" />
      <circle cx="300" cy="64" r="3" fill="currentColor" />
      <circle cx="200" cy="107" r="4.5" fill="var(--accent)" />
      {sig("SYS.07 · INGE2")}
    </svg>
  ),
};

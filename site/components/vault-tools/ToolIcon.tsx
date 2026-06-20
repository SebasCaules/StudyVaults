import type { SVGProps } from "react";

/**
 * ToolIcon — set de íconos de línea propio de los toolkits por materia.
 *
 * El `Icon` de la librería sólo cubre el chrome del sitio (search, sol/luna,
 * flechas…). Las cards-lanzador necesitan glifos que comuniquen *de qué se
 * trata cada herramienta* a alguien que no sabe nada de la materia: una
 * calculadora, una campana de Gauss, una balanza de trade-offs, un candado…
 *
 * Todos comparten el lenguaje del set base: viewBox 24×24, stroke
 * `currentColor`, así que heredan el color del texto y se tintan solos en la
 * card. Glifos deliberadamente simples (1–4 trazos) para leerse a 20px.
 */
export type ToolIconName =
  | "calculator"
  | "matrix"
  | "layers"
  | "sigma"
  | "formula"
  | "percent"
  | "clock"
  | "calendar"
  | "infinity"
  | "bank"
  | "tag"
  | "flow"
  | "trending"
  | "shield"
  | "scale"
  | "pie"
  | "crossCurves"
  | "wallet"
  | "document"
  | "bell"
  | "bars"
  | "code"
  | "cycle"
  | "book"
  | "braces"
  | "cards"
  | "question"
  | "target"
  | "warning"
  | "clipboard"
  | "blueprint"
  | "triangle"
  | "pulse"
  | "pen"
  | "blocks"
  | "gears"
  | "branch"
  | "checklist"
  | "lock"
  | "repeat"
  | "list";

const PATHS: Record<ToolIconName, React.ReactNode> = {
  // ── álgebra / cálculo ─────────────────────────────────────────────
  calculator: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.4" />
      <path d="M7 7h10" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  matrix: (
    <>
      <path d="M7 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2" />
      <path d="M17 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2" />
      <path d="M9.5 9h.01M14.5 9h.01M9.5 15h.01M14.5 15h.01" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8 4.2-8 4.2-8-4.2L12 3Z" />
      <path d="m4 12 8 4.2 8-4.2" />
      <path d="m4 16.6 8 4.2 8-4.2" />
    </>
  ),
  sigma: (
    <>
      <path d="M17 5H7l6 7-6 7h10" />
      <path d="M17 5v2M17 19v-2" />
    </>
  ),
  formula: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9.5 8h4.5" />
      <path d="M11.7 8c0-1.3.7-2 1.8-2M11.7 8v7.5" />
      <path d="M9 15.5l3.2 3.5" />
      <path d="M12.2 19l3-3.5" />
    </>
  ),
  percent: (
    <>
      <path d="M6 18 18 6" />
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
    </>
  ),
  infinity: (
    <path d="M7 9a3 3 0 1 0 0 6c2 0 3-2 5-3s3-3 5-3a3 3 0 1 1 0 6c-2 0-3-2-5-3s-3-3-5-3Z" />
  ),
  scale: (
    <>
      <path d="M12 4v15" />
      <path d="M7 19h10" />
      <path d="M5 7h14" />
      <path d="M7 4.8 5 7" />
      <path d="M17 4.8 19 7" />
      <path d="M3 12a2.5 2.5 0 0 0 5 0l-2.5-5L3 12Z" />
      <path d="M16 12a2.5 2.5 0 0 0 5 0l-2.5-5L16 12Z" />
    </>
  ),

  // ── finanzas / economía ───────────────────────────────────────────
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8" />
      <path d="M3 20h18" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.5 11 4.5a2 2 0 0 1 1.4-.5H19a2 2 0 0 1 2 2v6.6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0L3 15.3a2 2 0 0 1 0-2.8Z" />
      <circle cx="16" cy="8" r="1.4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h12v3" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M21 12h-4a2 2 0 0 0 0 4h4" />
      <path d="M17 14h.01" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M8.5 12h7M8.5 15h7M8.5 18h4" />
    </>
  ),
  pie: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
      <path d="M12 3v9h9" opacity="0.55" />
    </>
  ),
  trending: (
    <>
      <path d="M3 17 9.5 10.5 13 14l7.5-7.5" />
      <path d="M15.5 6.5H21V12" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8V11c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V5.8L12 3Z" />
      <path d="m9 11.5 2 2 4-4" />
    </>
  ),
  crossCurves: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M6.5 7c4 0 7.5 4 11 9" />
      <path d="M6.5 16c4 0 7.5-4 11-9" />
    </>
  ),

  // ── probabilidad / datos ──────────────────────────────────────────
  bell: (
    <>
      <path d="M3 18h18" />
      <path d="M3 18c4 0 4.5-11 9-11s5 11 9 11" />
    </>
  ),
  bars: (
    <>
      <path d="M4 20h16" />
      <rect x="5.5" y="11" width="3.2" height="6" rx="0.6" />
      <rect x="10.4" y="7" width="3.2" height="10" rx="0.6" />
      <rect x="15.3" y="13" width="3.2" height="4" rx="0.6" />
    </>
  ),
  flow: (
    <>
      <path d="M4 21V3" />
      <path d="M4 7h6M4 12h11M4 17h7" />
      <path d="M9 5v4M14 10v4M11 15v4" opacity="0.6" />
    </>
  ),

  // ── ingeniería de software / PAW ──────────────────────────────────
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 6-3 12" />
    </>
  ),
  braces: (
    <>
      <path d="M8 4c-2 0-2 3-2 4 0 1.5-1 2-2 2 1 0 2 .5 2 2 0 1 0 4 2 4" />
      <path d="M16 4c2 0 2 3 2 4 0 1.5 1 2 2 2-1 0-2 .5-2 2 0 1 0 4-2 4" />
    </>
  ),
  cycle: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </>
  ),
  blueprint: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 9v11" />
      <path d="M13 13h4M13 16.5h4" />
    </>
  ),
  triangle: (
    <>
      <path d="M12 4 3 19h18L12 4Z" />
      <circle cx="12" cy="4.6" r="1.4" />
      <circle cx="3.8" cy="18.4" r="1.4" />
      <circle cx="20.2" cy="18.4" r="1.4" />
    </>
  ),
  pulse: (
    <>
      <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
    </>
  ),
  pen: (
    <>
      <path d="M14.5 5.5 18.5 9.5" />
      <path d="M5 19l1-4L16 5a2.1 2.1 0 0 1 3 3L9 18l-4 1Z" />
    </>
  ),
  blocks: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </>
  ),
  gears: (
    <>
      <circle cx="10" cy="10" r="3" />
      <path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M14.6 5.4l-1.4 1.4M6.8 13.2l-1.4 1.4" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </>
  ),
  branch: (
    <>
      <circle cx="7" cy="6" r="2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="12" r="2" />
      <path d="M7 8v8" />
      <path d="M7 12h4.5a3.5 3.5 0 0 0 3.5-2" opacity="0.9" />
      <path d="M9 12h2.5a3.5 3.5 0 0 1 3.5 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14v2.5" />
    </>
  ),

  // ── estudio / práctica ────────────────────────────────────────────
  book: (
    <>
      <path d="M12 6c-1.6-1.3-3.7-2-6-2H4v13h2c2.3 0 4.4.7 6 2" />
      <path d="M12 6c1.6-1.3 3.7-2 6-2h2v13h-2c-2.3 0-4.4.7-6 2" />
      <path d="M12 6v13" />
    </>
  ),
  cards: (
    <>
      <rect x="7" y="6" width="13" height="14" rx="2" />
      <path d="M4.5 8.5v9A2.5 2.5 0 0 0 7 20" opacity="0.65" />
      <path d="M11 13h5" />
    </>
  ),
  question: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7" />
      <path d="M12 16.5h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 4 2.8 17.5a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4M12 17h.01" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 5a3 3 0 0 1 6 0" />
      <path d="M9 5h6v2H9V5Z" />
      <path d="m9 13 1.8 1.8L14 11.5" />
    </>
  ),
  checklist: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="m3.5 5.5 1.2 1.2L7 4.5" />
      <path d="m3.5 11.5 1.2 1.2L7 10.5" />
      <path d="M4 18h.01" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  repeat: (
    <>
      <path d="M4 9a5 5 0 0 1 5-5h7" />
      <path d="m13 1 3 3-3 3" />
      <path d="M20 15a5 5 0 0 1-5 5H8" />
      <path d="m11 23-3-3 3-3" />
    </>
  ),
};

export interface ToolIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  name: ToolIconName;
  /** Lado en px (alto y ancho). Por defecto 22. */
  size?: number;
  title?: string;
}

export function ToolIcon({ name, size = 22, title, ...rest }: ToolIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

export default ToolIcon;

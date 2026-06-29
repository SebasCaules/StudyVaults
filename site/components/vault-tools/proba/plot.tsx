"use client";

import { useId, type ReactNode } from "react";
import { fmt } from "../lib/stats";

/* ============================================================================
 * plot.tsx — andamiaje SVG compartido por las herramientas de Proba con gráfico
 * (Distribuciones, Tabla normal, Aprox. normal, Test de hipótesis, Potencia,
 * Descriptiva). Da ejes + grilla + escalas consistentes y un sistema visual
 * elevado (rellenos con gradiente, ejes con marcas, trazos con animación de
 * "dibujado"); cada tool dibuja sus marcas (barras, curvas, sombreados, líneas)
 * como hijos del frame usando las escalas + los rellenos que reciben.
 *
 * Estética: tokens §12 (var(--…)), nunca hex. El relleno de datos usa
 * var(--vault-tint, var(--primary)); referencias/anotaciones, var(--accent).
 * Los rellenos de área se reciben ya resueltos como url(#…) en `scales.fills`.
 * ========================================================================== */

export const PLOT_W = 520;
export const PLOT_H = 230;
export const PAD = { l: 38, r: 12, t: 16, b: 28 };
export const innerW = PLOT_W - PAD.l - PAD.r;
export const innerH = PLOT_H - PAD.t - PAD.b;

/** n+1 marcas equiespaciadas en [lo, hi] (devuelve [lo] si el rango es nulo). */
export function ticks(lo: number, hi: number, n: number): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) return [lo];
  const out: number[] = [];
  for (let i = 0; i <= n; i++) out.push(lo + ((hi - lo) * i) / n);
  return out;
}

export interface PlotScales {
  /** dominio x → px (centra si el rango es nulo). */
  sx: (v: number) => number;
  /** valor en [0, yMax] → px, con 0 en la base (eje izquierdo primario). */
  syTop: (v: number) => number;
  /** valor en [0, 1] → px, con 0 en la base (eje derecho normalizado: CDF). */
  syUnit: (v: number) => number;
  xLo: number;
  xHi: number;
  yMax: number;
  /** y de la base (línea del eje x) y de la cima del área de dibujo. */
  yBase: number;
  yTopPx: number;
  /** rellenos de área ya resueltos (url(#…)): tinte de la materia y acento. */
  fills: { area: string; areaAccent: string };
  /** props a esparcir en el `<path>` de la curva principal: dibujado animado. */
  curve: (accent?: boolean) => { className: string; pathLength: number };
}

/** Polilínea desde puntos (x,y) en px → atributo `d`. */
export function polyline(pts: { x: number; y: number }[]): string {
  if (!pts.length) return "";
  return "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
}

/** Área bajo una curva (puntos ya en px) cerrada contra la base `yBase`. */
export function areaPath(pts: { x: number; y: number }[], yBase: number): string {
  if (pts.length < 2) return "";
  return (
    `M ${pts[0].x} ${yBase} ` +
    pts.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${pts[pts.length - 1].x} ${yBase} Z`
  );
}

/**
 * Marco de ejes reutilizable. Dibuja los `<defs>` (gradientes de área), la
 * grilla horizontal (escala primaria `yMax`), las etiquetas del eje izquierdo,
 * el eje x con marcas, y entrega las escalas + rellenos a `children`.
 *
 *   <PlotFrame xLo={lo} xHi={hi} yMax={maxP} ariaLabel="…">
 *     {({ sx, syTop, fills, curve }) => (
 *       <>
 *         <path d={areaPath(curvePx, base)} fill={fills.area} />
 *         <path d={polyline(curvePx)} fill="none"
 *               stroke="var(--vault-tint, var(--primary))" strokeWidth={2} {...curve()} />
 *       </>
 *     )}
 *   </PlotFrame>
 */
export function PlotFrame({
  xLo,
  xHi,
  yMax = 1,
  xTicks = 5,
  yTicks = 4,
  xDecimals = 2,
  yDecimals = 2,
  ariaLabel,
  showYGrid = true,
  children,
}: {
  xLo: number;
  xHi: number;
  yMax?: number;
  xTicks?: number;
  yTicks?: number;
  xDecimals?: number;
  yDecimals?: number;
  ariaLabel?: string;
  showYGrid?: boolean;
  children: (s: PlotScales) => ReactNode;
}) {
  // id estable y válido para url(#…) (useId trae ':' que limpiamos).
  const uid = useId().replace(/:/g, "");
  const areaId = `${uid}-area`;
  const areaAccentId = `${uid}-area-accent`;

  const yBase = PAD.t + innerH;
  const sx = (v: number) =>
    PAD.l + (xHi === xLo ? innerW / 2 : ((v - xLo) / (xHi - xLo)) * innerW);
  const syTop = (v: number) =>
    PAD.t + innerH - (yMax === 0 ? 0 : (v / yMax) * innerH);
  const syUnit = (v: number) => PAD.t + innerH - v * innerH;

  const scales: PlotScales = {
    sx,
    syTop,
    syUnit,
    xLo,
    xHi,
    yMax,
    yBase,
    yTopPx: PAD.t,
    fills: { area: `url(#${areaId})`, areaAccent: `url(#${areaAccentId})` },
    curve: (accent = false) => ({
      className: accent ? "tk-plot-curve tk-plot-curve--accent" : "tk-plot-curve",
      pathLength: 1,
    }),
  };

  return (
    <div className="vtool-plot">
      <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} role="img" aria-label={ariaLabel}>
        <defs>
          {/* relleno de área: tinte de la materia, denso arriba → nulo abajo */}
          <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--vault-tint, var(--primary))"
              stopOpacity="0.34"
            />
            <stop
              offset="78%"
              stopColor="var(--vault-tint, var(--primary))"
              stopOpacity="0.05"
            />
            <stop
              offset="100%"
              stopColor="var(--vault-tint, var(--primary))"
              stopOpacity="0"
            />
          </linearGradient>
          {/* variante de acento (coral) para la segunda serie */}
          <linearGradient id={areaAccentId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grilla horizontal + etiquetas del eje izquierdo */}
        {showYGrid &&
          ticks(0, yMax, yTicks).map((t, i) => {
            const y = syTop(t);
            return (
              <g key={`gh-${i}`}>
                <line
                  x1={PAD.l}
                  x2={PLOT_W - PAD.r}
                  y1={y}
                  y2={y}
                  stroke="var(--hairline)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.l - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={8.5}
                  fontFamily="var(--font-mono)"
                  fill="var(--text-secondary)"
                >
                  {fmt(t, yDecimals)}
                </text>
              </g>
            );
          })}

        {/* eje x + marcas + etiquetas */}
        <line
          x1={PAD.l}
          x2={PLOT_W - PAD.r}
          y1={yBase}
          y2={yBase}
          stroke="var(--hairline-strong)"
          strokeWidth={1}
        />
        {ticks(xLo, xHi, xTicks).map((t, i) => {
          const x = sx(t);
          return (
            <g key={`gx-${i}`}>
              <line
                x1={x}
                x2={x}
                y1={yBase}
                y2={yBase + 3.5}
                stroke="var(--hairline-strong)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={PLOT_H - 8}
                textAnchor="middle"
                fontSize={8.5}
                fontFamily="var(--font-mono)"
                fill="var(--text-secondary)"
              >
                {fmt(t, xDecimals)}
              </text>
            </g>
          );
        })}

        {children(scales)}
      </svg>
    </div>
  );
}

export interface LegendItem {
  kind: "area" | "line" | "dashed" | "bar";
  /** color CSS (rol §12). Por defecto var(--vault-tint, var(--primary)). */
  color?: string;
  label: ReactNode;
}

/** Fila de leyenda con swatches, igual estilo que los plots existentes. */
export function PlotLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="vtool-plot-legend">
      {items.map((it, i) => {
        const color = it.color ?? "var(--vault-tint, var(--primary))";
        return (
          <span key={i} className="vtool-plot-legend__item">
            {it.kind === "line" ? (
              <span
                className="vtool-plot-legend__swatch"
                style={{ height: 3, background: color }}
              />
            ) : it.kind === "dashed" ? (
              <span
                className="vtool-plot-legend__swatch"
                style={{ height: 0, borderTop: `2px dashed ${color}` }}
              />
            ) : (
              <span
                className="vtool-plot-legend__swatch vtool-plot-legend__swatch--area"
                style={{ background: color }}
              />
            )}
            {it.label}
          </span>
        );
      })}
    </div>
  );
}

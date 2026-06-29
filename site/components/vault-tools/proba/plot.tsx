"use client";

import type { ReactNode } from "react";
import { fmt } from "../lib/stats";

/* ============================================================================
 * plot.tsx — andamiaje SVG compartido por las herramientas de Proba con gráfico
 * (Distribuciones, Tabla normal, Aprox. normal, Test de hipótesis, Potencia,
 * Descriptiva). Da ejes + grilla + escalas consistentes; cada tool dibuja sus
 * "marcas" propias (barras, curvas, sombreados, líneas) como hijos del frame.
 *
 * Estética: tokens §12 (var(--…)), nunca hex. El relleno de datos usa
 * var(--vault-tint, var(--primary)); referencias/anotaciones, var(--accent).
 * ========================================================================== */

export const PLOT_W = 520;
export const PLOT_H = 230;
export const PAD = { l: 38, r: 12, t: 14, b: 26 };
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
}

/**
 * Marco de ejes reutilizable. Dibuja la grilla horizontal (escala primaria
 * `yMax`), las etiquetas del eje izquierdo, el eje x y sus marcas, y entrega las
 * escalas a `children` para que la herramienta dibuje sus marcas encima.
 *
 *   <PlotFrame xLo={lo} xHi={hi} yMax={maxP} ariaLabel="…">
 *     {({ sx, syTop, syUnit }) => ( <> …barras / curvas / sombreados… </> )}
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
  };

  return (
    <div className="vtool-plot">
      <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} role="img" aria-label={ariaLabel}>
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
                  x={PAD.l - 5}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                  fill="var(--text-secondary)"
                >
                  {fmt(t, yDecimals)}
                </text>
              </g>
            );
          })}

        {/* eje x */}
        <line
          x1={PAD.l}
          x2={PLOT_W - PAD.r}
          y1={yBase}
          y2={yBase}
          stroke="var(--hairline-strong)"
          strokeWidth={1}
        />
        {ticks(xLo, xHi, xTicks).map((t, i) => (
          <text
            key={`gx-${i}`}
            x={sx(t)}
            y={PLOT_H - 8}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-mono)"
            fill="var(--text-secondary)"
          >
            {fmt(t, xDecimals)}
          </text>
        ))}

        {children(scales)}
      </svg>
    </div>
  );
}

/** Construye el atributo `d` de una polilínea a partir de puntos (x,y) en px. */
export function polyline(pts: { x: number; y: number }[]): string {
  if (!pts.length) return "";
  return "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
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
    <div className="vtool-row" style={{ gap: 16 }}>
      {items.map((it, i) => {
        const color = it.color ?? "var(--vault-tint, var(--primary))";
        return (
          <span
            key={i}
            className="vtool-mono"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {it.kind === "line" ? (
              <span
                style={{
                  width: 18,
                  height: 3,
                  background: color,
                  display: "inline-block",
                }}
              />
            ) : it.kind === "dashed" ? (
              <span
                style={{
                  width: 18,
                  height: 0,
                  borderTop: `2px dashed ${color}`,
                  display: "inline-block",
                }}
              />
            ) : (
              <span
                style={{
                  width: 14,
                  height: 10,
                  background: color,
                  opacity: 0.5,
                  display: "inline-block",
                }}
              />
            )}
            {it.label}
          </span>
        );
      })}
    </div>
  );
}

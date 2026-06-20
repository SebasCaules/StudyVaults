"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Slider, Note } from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";
import { fmt } from "./lib/stats";

// Parcial 2 — Unidades 6/7/8 (cada calculadora en su archivo, math en economia/lib/finance)
import SimuladorTool from "./economia/SimuladorTool";
import TasasTool from "./economia/TasasTool";
import ValorTiempoTool from "./economia/ValorTiempoTool";
import AnualidadesTool from "./economia/AnualidadesTool";
import PerpetuidadesTool from "./economia/PerpetuidadesTool";
import PrestamosTool from "./economia/PrestamosTool";
import DescuentoCftTool from "./economia/DescuentoCftTool";
import VanTirTool from "./economia/VanTirTool";
import FlujoProyectoTool from "./economia/FlujoProyectoTool";
import EscudoFiscalTool from "./economia/EscudoFiscalTool";
import CaeTool from "./economia/CaeTool";
import RatiosTool from "./economia/RatiosTool";
import EquilibrioTool from "./economia/EquilibrioTool";
import CapitalTrabajoTool from "./economia/CapitalTrabajoTool";
import ResultadosTool from "./economia/ResultadosTool";
import FormularioTool from "./economia/FormularioTool";

/* ------------------------------------------------------------------ */
/* Helpers de presentación (sin dependencias externas, cálculo inline) */
/* ------------------------------------------------------------------ */

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

function money(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return "—";
  return fmt(x, dp);
}

/* ================================================================== */
/* 1) MERCADO — Oferta y demanda                                       */
/* ================================================================== */

function MercadoTool() {
  // Demanda: P = a − b·Q   ;   Oferta: P = c + d·Q
  const [a, setA] = useState(100); // intercepto demanda
  const [b, setB] = useState(2); // pendiente demanda
  const [c, setC] = useState(20); // intercepto oferta
  const [d, setD] = useState(1.5); // pendiente oferta
  const [t, setT] = useState(0); // impuesto por unidad

  const m = useMemo(() => {
    const errs: string[] = [];
    if (!(b > 0)) errs.push("La pendiente de demanda b debe ser > 0.");
    if (!(d > 0)) errs.push("La pendiente de oferta d debe ser > 0.");
    if (!(a > c)) errs.push("Se requiere a > c para que exista equilibrio con Q > 0.");
    if (errs.length) return { ok: false as const, errs };

    // Equilibrio sin impuesto
    const Qe = (a - c) / (b + d);
    const Pe = a - b * Qe;

    // Con impuesto t por unidad sobre el vendedor: la oferta se desplaza a
    // P = (c + t) + d·Q. Cuña: P_comprador − P_vendedor = t.
    // Si t ≥ (a − c) la cuña excede el excedente total y el mercado se cierra:
    // Q_t = 0 y NO se transa nada. En ese caso la cuña efectiva es (a − c), no t.
    const choked = t >= a - c;
    const Qt = choked ? 0 : (a - c - t) / (b + d);
    const wedge = choked ? a - c : t; // cuña efectiva (acotada al excedente)
    const Pbuy = a - b * Qt; // precio que paga el comprador
    const Psell = Pbuy - wedge; // precio que recibe el vendedor (cae a c si Q_t = 0)
    const recaud = t * Qt; // recaudación fiscal (0 si no se transa)
    // Peso muerto = pérdida de excedente por la caída de Q, acotada por (a − c):
    const dwl = 0.5 * wedge * (Qe - Qt); // triángulo de pérdida de eficiencia

    // Excedentes (situación sin impuesto)
    const csNo = 0.5 * (a - Pe) * Qe;
    const psNo = 0.5 * (Pe - c) * Qe;

    // Excedentes con impuesto
    const cs = 0.5 * (a - Pbuy) * Qt;
    const ps = 0.5 * (Psell - c) * Qt;

    return {
      ok: true as const,
      Qe,
      Pe,
      Qt,
      Pbuy,
      Psell,
      recaud,
      dwl,
      csNo,
      psNo,
      cs,
      ps,
      hasTax: t > 1e-9,
    };
  }, [a, b, c, d, t]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Microeconomía</span>
        <h3>Oferta y demanda</h3>
        <p>
          Demanda lineal <span className="vtool-mono">P = a − b·Q</span>, oferta{" "}
          <span className="vtool-mono">P = c + d·Q</span>. Movés los parámetros y el
          impuesto por unidad y el equilibrio, los excedentes y el peso muerto se
          recalculan en vivo.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>a</b> intercepto demanda · {fmt(a, 1)}
            </label>
            <Slider
              min={20}
              max={200}
              step={1}
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>b</b> pendiente demanda · {fmt(b, 2)}
            </label>
            <Slider
              min={0.1}
              max={6}
              step={0.1}
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>c</b> intercepto oferta · {fmt(c, 1)}
            </label>
            <Slider
              min={0}
              max={120}
              step={1}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>d</b> pendiente oferta · {fmt(d, 2)}
            </label>
            <Slider
              min={0.1}
              max={6}
              step={0.1}
              value={d}
              onChange={(e) => setD(Number(e.target.value))}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>t</b> impuesto por unidad · {fmt(t, 1)}
            </label>
            <Slider
              min={0}
              max={60}
              step={1}
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!m.ok ? (
            <div className="vtool-error">
              {m.errs.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          ) : (
            <MercadoPlot m={m} a={a} b={b} c={c} d={d} />
          )}
        </div>
      </div>

      {m.ok && (
        <div className="vtool-grid">
          <div className="vtool-sub">
            <span className="vtool-eyebrow">Equilibrio sin impuesto</span>
            <div className="vtool-kv">
              <span className="k">Cantidad Q*</span>
              <span className="v acc">{money(m.Qe)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Precio P*</span>
              <span className="v acc">{money(m.Pe)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Excedente consumidor</span>
              <span className="v">{money(m.csNo)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Excedente productor</span>
              <span className="v">{money(m.psNo)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Excedente total</span>
              <span className="v">{money(m.csNo + m.psNo)}</span>
            </div>
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">
              Con impuesto {m.hasTax ? `t = ${fmt(t, 1)}` : "(t = 0)"}
            </span>
            <div className="vtool-kv">
              <span className="k">Cantidad transada Q_t</span>
              <span className="v acc">{money(m.Qt)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Precio comprador</span>
              <span className="v">{money(m.Pbuy)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Precio vendedor</span>
              <span className="v">{money(m.Psell)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Recaudación</span>
              <span className="v">{money(m.recaud)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Peso muerto (DWL)</span>
              <span className="v coral">{money(m.dwl)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">EC · EP con impuesto</span>
              <span className="v">
                {money(m.cs)} · {money(m.ps)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Note>
        El impuesto por unidad se modela como un desplazamiento de la oferta a{" "}
        <span className="vtool-mono">P = (c + t) + d·Q</span>: la cuña fiscal{" "}
        <span className="vtool-mono">P_comprador − P_vendedor = t</span> reduce la
        cantidad y genera el triángulo de peso muerto{" "}
        <span className="vtool-mono">½·t·(Q* − Q_t)</span>.
      </Note>
    </div>
  );
}

type MercadoModel = {
  ok: true;
  Qe: number;
  Pe: number;
  Qt: number;
  Pbuy: number;
  Psell: number;
  recaud: number;
  dwl: number;
  csNo: number;
  psNo: number;
  cs: number;
  ps: number;
  hasTax: boolean;
};

function MercadoPlot({
  m,
  a,
  b,
  c,
  d,
}: {
  m: MercadoModel;
  a: number;
  b: number;
  c: number;
  d: number;
}) {
  const W = 460;
  const H = 320;
  const pad = { l: 44, r: 14, t: 14, b: 34 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  // Rango de ejes: Q hasta 1.35·Q* (o donde la demanda cruza el eje), P hasta a.
  const Qmax = Math.max(m.Qe * 1.35, m.Qe + 1, (a - c) / (b + d) + 1);
  const Pmax = Math.max(a * 1.05, m.Pbuy * 1.1, 1);

  const sx = (q: number) => pad.l + (clamp(q, 0, Qmax) / Qmax) * iw;
  const sy = (p: number) => pad.t + (1 - clamp(p, 0, Pmax) / Pmax) * ih;

  // Demanda: de (0, a) a (a/b, 0) acotada al recuadro
  const dQ0 = 0;
  const dP0 = a;
  const dQ1 = Math.min(Qmax, a / b);
  const dP1 = a - b * dQ1;
  // Oferta: de (0, c) a (Qmax, c + d·Qmax)
  const oQ0 = 0;
  const oP0 = c;
  const oQ1 = Qmax;
  const oP1 = c + d * Qmax;

  // Ticks
  const qTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * Qmax);
  const pTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * Pmax);

  // Áreas de excedente (sin impuesto): triángulos CS y PS
  const csPath = `M ${sx(0)},${sy(a)} L ${sx(0)},${sy(m.Pe)} L ${sx(m.Qe)},${sy(
    m.Pe
  )} Z`;
  const psPath = `M ${sx(0)},${sy(c)} L ${sx(0)},${sy(m.Pe)} L ${sx(m.Qe)},${sy(
    m.Pe
  )} Z`;

  // Triángulo de peso muerto: vértices (Q_t, P_comprador), (Q_t, P_vendedor), (Q*, P*)
  const dwlPath = m.hasTax
    ? `M ${sx(m.Qt)},${sy(m.Pbuy)} L ${sx(m.Qt)},${sy(m.Psell)} L ${sx(
        m.Qe
      )},${sy(m.Pe)} Z`
    : "";

  return (
    <div className="vtool-plot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de oferta y demanda">
        {/* Gridlines */}
        {qTicks.map((q, i) => (
          <line
            key={`gx${i}`}
            x1={sx(q)}
            y1={pad.t}
            x2={sx(q)}
            y2={H - pad.b}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
        ))}
        {pTicks.map((p, i) => (
          <line
            key={`gy${i}`}
            x1={pad.l}
            y1={sy(p)}
            x2={W - pad.r}
            y2={sy(p)}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
        ))}

        {/* Áreas de excedente */}
        <path d={csPath} fill="var(--primary)" fillOpacity={0.16} />
        <path d={psPath} fill="var(--accent)" fillOpacity={0.16} />
        {m.hasTax && <path d={dwlPath} fill="var(--accent)" fillOpacity={0.42} />}

        {/* Demanda */}
        <line
          x1={sx(dQ0)}
          y1={sy(dP0)}
          x2={sx(dQ1)}
          y2={sy(dP1)}
          stroke="var(--primary)"
          strokeWidth={2.4}
        />
        {/* Oferta */}
        <line
          x1={sx(oQ0)}
          y1={sy(oP0)}
          x2={sx(oQ1)}
          y2={sy(oP1)}
          stroke="var(--accent-text)"
          strokeWidth={2.4}
        />

        {/* Líneas guía y punto de equilibrio sin impuesto */}
        <line
          x1={sx(m.Qe)}
          y1={sy(0)}
          x2={sx(m.Qe)}
          y2={sy(m.Pe)}
          stroke="var(--text-secondary)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <line
          x1={sx(0)}
          y1={sy(m.Pe)}
          x2={sx(m.Qe)}
          y2={sy(m.Pe)}
          stroke="var(--text-secondary)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <circle cx={sx(m.Qe)} cy={sy(m.Pe)} r={4.5} fill="var(--ink-strong)" />

        {/* Cuña con impuesto */}
        {m.hasTax && (
          <>
            <circle cx={sx(m.Qt)} cy={sy(m.Pbuy)} r={3.5} fill="var(--primary)" />
            <circle
              cx={sx(m.Qt)}
              cy={sy(m.Psell)}
              r={3.5}
              fill="var(--accent-text)"
            />
            <line
              x1={sx(m.Qt)}
              y1={sy(m.Pbuy)}
              x2={sx(m.Qt)}
              y2={sy(m.Psell)}
              stroke="var(--ink-strong)"
              strokeWidth={2}
            />
          </>
        )}

        {/* Ejes */}
        <line
          x1={pad.l}
          y1={pad.t}
          x2={pad.l}
          y2={H - pad.b}
          stroke="var(--hairline-strong)"
          strokeWidth={1.4}
        />
        <line
          x1={pad.l}
          y1={H - pad.b}
          x2={W - pad.r}
          y2={H - pad.b}
          stroke="var(--hairline-strong)"
          strokeWidth={1.4}
        />

        {/* Ticks numéricos */}
        {qTicks.map((q, i) => (
          <text
            key={`tx${i}`}
            x={sx(q)}
            y={H - pad.b + 16}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--text-secondary)"
          >
            {fmt(q, 0)}
          </text>
        ))}
        {pTicks.map((p, i) => (
          <text
            key={`ty${i}`}
            x={pad.l - 6}
            y={sy(p) + 3}
            textAnchor="end"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--text-secondary)"
          >
            {fmt(p, 0)}
          </text>
        ))}
        <text
          x={W - pad.r}
          y={H - pad.b + 16}
          textAnchor="end"
          fontSize={10}
          fontFamily="var(--font-mono)"
          fill="var(--text-secondary)"
        >
          Q
        </text>
        <text
          x={pad.l - 6}
          y={pad.t + 4}
          textAnchor="end"
          fontSize={10}
          fontFamily="var(--font-mono)"
          fill="var(--text-secondary)"
        >
          P
        </text>
      </svg>
    </div>
  );
}

/* ================================================================== */
/* 2) ELASTICIDAD — puntual, arco, cruzada e ingreso                   */
/* ================================================================== */

function clasifPrecio(eps: number): string {
  const a = Math.abs(eps);
  if (!Number.isFinite(eps)) return "indefinida";
  if (a > 1.0001) return "elástica (|ε| > 1)";
  if (a < 0.9999) return "inelástica (|ε| < 1)";
  return "unitaria (|ε| = 1)";
}

function ElasticidadTool() {
  // (a) Puntual
  const [pP, setPP] = useState("10");
  const [pQ, setPQ] = useState("100");
  const [pSlope, setPSlope] = useState("-5"); // dQ/dP

  // (b) Arco precio (punto medio)
  const [P1, setP1] = useState("10");
  const [Q1, setQ1] = useState("100");
  const [P2, setP2] = useState("12");
  const [Q2, setQ2] = useState("80");

  // (c) Cruzada e ingreso (dos puntos: variable explicativa X y cantidad Q)
  const [xLabel, setXLabel] = useState<"precio de otro bien" | "ingreso">(
    "ingreso"
  );
  const [X1, setX1] = useState("1000");
  const [Q1c, setQ1c] = useState("100");
  const [X2, setX2] = useState("1200");
  const [Q2c, setQ2c] = useState("130");

  // --- Cálculos ---
  const punt = useMemo(() => {
    const P = num(pP);
    const Q = num(pQ);
    const slope = num(pSlope);
    if (![P, Q, slope].every(Number.isFinite))
      return { ok: false as const, msg: "Completá P, Q y dQ/dP con números." };
    if (Q === 0) return { ok: false as const, msg: "Q no puede ser 0." };
    const eps = slope * (P / Q);
    return { ok: true as const, eps };
  }, [pP, pQ, pSlope]);

  const arco = useMemo(() => {
    const p1 = num(P1);
    const q1 = num(Q1);
    const p2 = num(P2);
    const q2 = num(Q2);
    if (![p1, q1, p2, q2].every(Number.isFinite))
      return { ok: false as const, msg: "Completá los dos puntos (P, Q)." };
    const dQ = q2 - q1;
    const dP = p2 - p1;
    const sumQ = q2 + q1;
    const sumP = p2 + p1;
    if (sumQ === 0 || sumP === 0)
      return { ok: false as const, msg: "La suma de P o de Q es 0." };
    if (dP === 0)
      return {
        ok: false as const,
        msg: "ΔP = 0: la elasticidad-precio arco no está definida (perfectamente elástica).",
      };
    // Fórmula del punto medio
    const eps = (dQ / (sumQ / 2)) / (dP / (sumP / 2));
    return { ok: true as const, eps, dQ, dP };
  }, [P1, Q1, P2, Q2]);

  const cruz = useMemo(() => {
    const x1 = num(X1);
    const q1 = num(Q1c);
    const x2 = num(X2);
    const q2 = num(Q2c);
    if (![x1, q1, x2, q2].every(Number.isFinite))
      return { ok: false as const, msg: "Completá los dos puntos (X, Q)." };
    const dQ = q2 - q1;
    const dX = x2 - x1;
    const sumQ = q2 + q1;
    const sumX = x2 + x1;
    if (sumQ === 0 || sumX === 0)
      return { ok: false as const, msg: "La suma de X o de Q es 0." };
    if (dX === 0)
      return { ok: false as const, msg: "ΔX = 0: variación nula en la variable explicativa." };
    const eps = (dQ / (sumQ / 2)) / (dX / (sumX / 2));
    return { ok: true as const, eps };
  }, [X1, Q1c, X2, Q2c]);

  const interpCruz = (eps: number): string => {
    if (!Number.isFinite(eps)) return "indefinida";
    if (xLabel === "ingreso") {
      if (eps > 0) return eps > 1 ? "normal de lujo (η > 1)" : "normal necesario (0 < η < 1)";
      if (eps < 0) return "inferior (η < 0)";
      return "indiferente al ingreso (η = 0)";
    }
    if (eps > 0) return "sustitutos (ε_xy > 0)";
    if (eps < 0) return "complementarios (ε_xy < 0)";
    return "independientes (ε_xy = 0)";
  };

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Microeconomía</span>
        <h3>Elasticidades</h3>
        <p>
          Elasticidad-precio puntual y arco (fórmula del punto medio), más
          elasticidad cruzada o ingreso entre dos observaciones, con su
          interpretación económica.
        </p>
      </div>

      <div className="vtool-grid">
        {/* (a) Puntual */}
        <div className="vtool-sub">
          <span className="vtool-eyebrow">a · Elasticidad puntual</span>
          <Note>
            <span className="vtool-mono">ε = (dQ/dP)·(P/Q)</span>
          </Note>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>P</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={pP}
                onChange={(e) => setPP(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Q</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={pQ}
                onChange={(e) => setPQ(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>dQ/dP</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={pSlope}
                onChange={(e) => setPSlope(e.target.value)}
              />
            </div>
          </div>
          {punt.ok ? (
            <>
              <div className="vtool-bignum">
                ε = {fmt(punt.eps, 4)}
                <small>{clasifPrecio(punt.eps)}</small>
              </div>
              <Note>
                Una suba de precio del 1% mueve la cantidad{" "}
                <span className="vtool-mono">{fmt(punt.eps, 2)}%</span> (signo
                negativo = demanda decreciente habitual).
              </Note>
            </>
          ) : (
            <p className="vtool-error">{punt.msg}</p>
          )}
        </div>

        {/* (b) Arco */}
        <div className="vtool-sub">
          <span className="vtool-eyebrow">b · Elasticidad arco (punto medio)</span>
          <Note>
            <span className="vtool-mono">
              ε = (ΔQ / Q̄) / (ΔP / P̄)
            </span>
          </Note>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>P₁</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={P1}
                onChange={(e) => setP1(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Q₁</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={Q1}
                onChange={(e) => setQ1(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>P₂</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={P2}
                onChange={(e) => setP2(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Q₂</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={Q2}
                onChange={(e) => setQ2(e.target.value)}
              />
            </div>
          </div>
          {arco.ok ? (
            <div className="vtool-bignum">
              ε = {fmt(arco.eps, 4)}
              <small>{clasifPrecio(arco.eps)}</small>
            </div>
          ) : (
            <p className="vtool-error">{arco.msg}</p>
          )}
        </div>

        {/* (c) Cruzada / ingreso */}
        <div className="vtool-sub">
          <span className="vtool-eyebrow">c · Cruzada o ingreso</span>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Variable explicativa X</b>
            </label>
            <Select
              value={xLabel}
              onChange={(e) =>
                setXLabel(e.target.value as "precio de otro bien" | "ingreso")
              }
            >
              <option value="ingreso">Ingreso (elasticidad-ingreso η)</option>
              <option value="precio de otro bien">
                Precio de otro bien (cruzada ε_xy)
              </option>
            </Select>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>X₁</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={X1}
                onChange={(e) => setX1(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Q₁</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={Q1c}
                onChange={(e) => setQ1c(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>X₂</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={X2}
                onChange={(e) => setX2(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Q₂</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={Q2c}
                onChange={(e) => setQ2c(e.target.value)}
              />
            </div>
          </div>
          {cruz.ok ? (
            <div className="vtool-bignum">
              {xLabel === "ingreso" ? "η" : "ε_xy"} = {fmt(cruz.eps, 4)}
              <small>{interpCruz(cruz.eps)}</small>
            </div>
          ) : (
            <p className="vtool-error">{cruz.msg}</p>
          )}
        </div>
      </div>

      <Note>
        La fórmula del punto medio usa los promedios{" "}
        <span className="vtool-mono">Q̄ = (Q₁+Q₂)/2</span> y{" "}
        <span className="vtool-mono">P̄ = (P₁+P₂)/2</span>, de modo que la
        elasticidad arco es simétrica respecto del sentido del cambio.
      </Note>
    </div>
  );
}

/* ================================================================== */
/* Export — toolkit completo, agrupado por unidad                      */
/* ================================================================== */

export default function EconomiaTools() {
  const tools: Tool[] = [
    // Práctica integradora
    {
      key: "simulador",
      label: "Simulador Parcial 2",
      group: "Práctica de parcial",
      icon: "clipboard",
      verb: "Rendir",
      desc: "Un parcial completo simulado con el formato real: ejercicios de las tres unidades y corrección al terminar.",
      node: <SimuladorTool />,
    },

    // Unidad 7 — Cálculo financiero
    {
      key: "tasas",
      label: "Tasas equivalentes",
      group: "Cálculo financiero · U7",
      icon: "percent",
      verb: "Convertir",
      desc: "Pasá entre tasa nominal, efectiva y de distintos períodos sin equivocarte con la capitalización.",
      node: <TasasTool />,
    },
    {
      key: "valor-tiempo",
      label: "Valor tiempo del dinero",
      group: "Cálculo financiero · U7",
      icon: "clock",
      verb: "Calcular",
      desc: "Cuánto vale hoy un monto futuro (y al revés): traé capitales en el tiempo con valor actual y futuro.",
      node: <ValorTiempoTool />,
    },
    {
      key: "anualidades",
      label: "Anualidades",
      group: "Cálculo financiero · U7",
      icon: "calendar",
      verb: "Calcular",
      desc: "Valuá una serie de pagos iguales y periódicos: cuotas, ahorros o rentas, a valor actual o futuro.",
      node: <AnualidadesTool />,
    },
    {
      key: "perpetuidades",
      label: "Perpetuidades",
      group: "Cálculo financiero · U7",
      icon: "infinity",
      verb: "Calcular",
      desc: "El valor hoy de un flujo que se paga para siempre, con o sin crecimiento constante.",
      node: <PerpetuidadesTool />,
    },
    {
      key: "prestamos",
      label: "Préstamos (francés/alemán/directo)",
      group: "Cálculo financiero · U7",
      icon: "bank",
      verb: "Calcular",
      desc: "Armá la tabla de amortización de un préstamo y compará los sistemas francés, alemán y directo.",
      node: <PrestamosTool />,
    },
    {
      key: "descuento",
      label: "Descuento comercial y CFT",
      group: "Cálculo financiero · U7",
      icon: "tag",
      verb: "Calcular",
      desc: "Cuánto recibís al descontar un documento antes de su vencimiento y el costo financiero total real.",
      node: <DescuentoCftTool />,
    },

    // Unidad 8 — Evaluación de proyectos
    {
      key: "flujo",
      label: "Constructor de flujo de fondos",
      group: "Evaluación de proyectos · U8",
      icon: "flow",
      verb: "Construir",
      desc: "Armá el flujo de fondos de un proyecto año por año: la base para evaluarlo con VAN y TIR.",
      node: <FlujoProyectoTool />,
    },
    {
      key: "van-tir",
      label: "VAN / TIR / criterios",
      group: "Evaluación de proyectos · U8",
      icon: "trending",
      verb: "Evaluar",
      desc: "Decidí si un proyecto conviene: valor actual neto, tasa interna de retorno y período de repago.",
      node: <VanTirTool />,
    },
    {
      key: "escudo",
      label: "Escudo fiscal y amortización",
      group: "Evaluación de proyectos · U8",
      icon: "shield",
      verb: "Calcular",
      desc: "Cuánto impuesto ahorra la amortización de un bien y cómo ese escudo fiscal mejora el flujo del proyecto.",
      node: <EscudoFiscalTool />,
    },
    {
      key: "cae",
      label: "Valor anual equivalente",
      group: "Evaluación de proyectos · U8",
      icon: "scale",
      verb: "Comparar",
      desc: "Compará proyectos de distinta duración llevándolos a un costo o beneficio anual equivalente.",
      node: <CaeTool />,
    },

    // Unidad 6 — Información contable
    {
      key: "ratios",
      label: "Ratios financieros y DuPont",
      group: "Información contable · U6",
      icon: "pie",
      verb: "Analizar",
      desc: "Calculá liquidez, endeudamiento y rentabilidad de una empresa y abrí el ROE con el modelo DuPont.",
      node: <RatiosTool />,
    },
    {
      key: "equilibrio",
      label: "Punto de equilibrio",
      group: "Información contable · U6",
      icon: "crossCurves",
      verb: "Calcular",
      desc: "Cuántas unidades hay que vender para no perder plata: punto de equilibrio en cantidad e ingresos.",
      node: <EquilibrioTool />,
    },
    {
      key: "capital-trabajo",
      label: "Capital de trabajo / NOF",
      group: "Información contable · U6",
      icon: "wallet",
      verb: "Calcular",
      desc: "Cuánta plata necesita la empresa para operar día a día: capital de trabajo y necesidades operativas de fondos.",
      node: <CapitalTrabajoTool />,
    },
    {
      key: "resultados",
      label: "Estado de resultados",
      group: "Información contable · U6",
      icon: "document",
      verb: "Armar",
      desc: "Construí el estado de resultados desde ventas hasta utilidad neta, viendo cada margen en el camino.",
      node: <ResultadosTool />,
    },

    // Referencia
    {
      key: "formulario",
      label: "Formulario Parcial 2",
      group: "Referencia",
      icon: "formula",
      verb: "Consultar",
      desc: "Todas las fórmulas de las Unidades 6, 7 y 8 reunidas para repasar antes del parcial.",
      node: <FormularioTool />,
    },

    // Parcial 1 — Microeconomía
    {
      key: "mercado",
      label: "Oferta y demanda",
      group: "Parcial 1 · Microeconomía",
      icon: "crossCurves",
      verb: "Simular",
      desc: "Mové las curvas de oferta y demanda y mirá cómo se forman el precio y la cantidad de equilibrio.",
      node: <MercadoTool />,
    },
    {
      key: "elasticidad",
      label: "Elasticidades",
      group: "Parcial 1 · Microeconomía",
      icon: "percent",
      verb: "Calcular",
      desc: "Cuánto reacciona la cantidad ante cambios de precio o ingreso: elasticidad y qué significa su valor.",
      node: <ElasticidadTool />,
    },
  ];

  return (
    <ToolkitShell
      intro={
        <>
          Herramientas interactivas de <b>Economía para Ingenieros</b>, centradas en
          el <b>Parcial 2</b> (Unidades 6/7/8): cálculo financiero, evaluación de
          proyectos por VAN/TIR e información contable. Arrancá por el{" "}
          <b>Simulador</b> para practicar el formato real, o usá cada calculadora
          como verificador paso a paso. Todo recalcula en vivo y la matemática está
          validada contra las soluciones oficiales de parciales anteriores.
        </>
      }
      tools={tools}
    />
  );
}

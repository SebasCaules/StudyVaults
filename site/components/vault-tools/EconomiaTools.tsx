"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Slider, Note } from "@studyvaults/ui";
import ToolkitShell from "./ToolkitShell";
import { fmt } from "./lib/stats";

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

function pct(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return "—";
  return `${fmt(x * 100, dp)}%`;
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
/* 3) VAN y TIR — flujos de fondos                                     */
/* ================================================================== */

function npv(rate: number, flows: number[]): number {
  let acc = 0;
  for (let t = 0; t < flows.length; t++) {
    acc += flows[t] / Math.pow(1 + rate, t);
  }
  return acc;
}

// TIR por bisección robusta con barrido de signo en [-0.99, 10].
function irr(flows: number[]): { rate: number | null; multiple: boolean } {
  const f = (r: number) => npv(r, flows);
  const lo0 = -0.99;
  const hi0 = 10;
  const steps = 400;
  const brackets: [number, number][] = [];
  let prevR = lo0;
  let prevV = f(lo0);
  for (let i = 1; i <= steps; i++) {
    const r = lo0 + ((hi0 - lo0) * i) / steps;
    const v = f(r);
    if (Number.isFinite(prevV) && Number.isFinite(v) && prevV * v <= 0 && prevV !== 0) {
      brackets.push([prevR, r]);
    }
    prevR = r;
    prevV = v;
  }
  if (brackets.length === 0) return { rate: null, multiple: false };

  const solveBisect = ([lo, hi]: [number, number]): number => {
    let flo = f(lo);
    let a = lo;
    let b = hi;
    for (let i = 0; i < 200; i++) {
      const mid = (a + b) / 2;
      const fmid = f(mid);
      if (Math.abs(fmid) < 1e-10 || (b - a) / 2 < 1e-10) return mid;
      if (flo * fmid < 0) {
        b = mid;
      } else {
        a = mid;
        flo = fmid;
      }
    }
    return (a + b) / 2;
  };

  const root = solveBisect(brackets[0]);
  return { rate: root, multiple: brackets.length > 1 };
}

function VanTirTool() {
  const [flows, setFlows] = useState<string[]>([
    "-1000",
    "300",
    "350",
    "400",
    "450",
  ]);
  const [rStr, setRStr] = useState("10"); // tasa en %

  const r = num(rStr, 0) / 100;
  const nums = flows.map((s) => num(s, NaN));
  const valid = nums.every(Number.isFinite) && nums.length >= 2;

  const result = useMemo(() => {
    if (!valid) return null;
    const van = npv(r, nums);
    const { rate: tir, multiple } = irr(nums);

    // Filas descontadas + acumulado
    let cum = 0;
    let cumDisc = 0;
    let paybackSimple: number | null = null;
    let paybackDisc: number | null = null;
    const rows = nums.map((cf, t) => {
      const disc = cf / Math.pow(1 + r, t);
      const prevCum = cum;
      const prevCumDisc = cumDisc;
      cum += cf;
      cumDisc += disc;
      if (paybackSimple === null && prevCum < 0 && cum >= 0 && t > 0) {
        // interpolación lineal dentro del período
        paybackSimple = t - 1 + (0 - prevCum) / (cum - prevCum);
      }
      if (paybackDisc === null && prevCumDisc < 0 && cumDisc >= 0 && t > 0) {
        paybackDisc = t - 1 + (0 - prevCumDisc) / (cumDisc - prevCumDisc);
      }
      return { t, cf, disc, cum, cumDisc };
    });

    return { van, tir, multiple, rows, paybackSimple, paybackDisc };
  }, [valid, r, nums]);

  const setFlow = (i: number, v: string) =>
    setFlows((f) => f.map((x, j) => (j === i ? v : x)));
  const addRow = () => setFlows((f) => [...f, "0"]);
  const removeRow = (i: number) =>
    setFlows((f) => (f.length > 2 ? f.filter((_, j) => j !== i) : f));

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Finanzas</span>
        <h3>VAN y TIR</h3>
        <p>
          Flujo de fondos por período (año 0 = inversión inicial). Calcula el VAN
          a la tasa indicada, la TIR por bisección y los períodos de repago simple
          y descontado.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Tasa de descuento r</b> · {fmt(r * 100, 2)}%
            </label>
            <Slider
              min={0}
              max={40}
              step={0.5}
              value={clamp(num(rStr, 0), 0, 40)}
              onChange={(e) => setRStr(e.target.value)}
            />
            <TextInput
              inputMode="decimal"
              value={rStr}
              onChange={(e) => setRStr(e.target.value)}
            />
          </div>

          <div className="vtool-stack">
            {flows.map((v, i) => (
              <div className="vtool-row" key={i}>
                <div className="vtool-field" style={{ flex: "0 0 auto", minWidth: 56 }}>
                  <label className="vtool-label">
                    <b>Año {i}</b>
                  </label>
                </div>
                <div className="vtool-field">
                  <TextInput
                    inputMode="decimal"
                    value={v}
                    onChange={(e) => setFlow(i, e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => removeRow(i)}
                  disabled={flows.length <= 2}
                  aria-label={`Quitar año ${i}`}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="btn btn--sm" onClick={addRow}>
              + Agregar período
            </button>
          </div>
        </div>

        <div className="vtool-stack">
          {!valid ? (
            <p className="vtool-error">
              Ingresá al menos 2 flujos numéricos válidos (año 0 y siguientes).
            </p>
          ) : result ? (
            <>
              <div className="vtool-bignum">
                VAN = {money(result.van)}
                <small>
                  a r = {fmt(r * 100, 2)}% ·{" "}
                  {result.van > 0
                    ? "proyecto conviene (VAN > 0)"
                    : result.van < 0
                    ? "no conviene (VAN < 0)"
                    : "indiferente (VAN = 0)"}
                </small>
              </div>

              <div className="vtool-kv">
                <span className="k">TIR</span>
                <span className="v acc">
                  {result.tir === null ? "—" : pct(result.tir, 3)}
                </span>
              </div>
              <div className="vtool-kv">
                <span className="k">Repago simple</span>
                <span className="v">
                  {result.paybackSimple === null
                    ? "no se recupera"
                    : `${fmt(result.paybackSimple, 2)} años`}
                </span>
              </div>
              <div className="vtool-kv">
                <span className="k">Repago descontado</span>
                <span className="v">
                  {result.paybackDisc === null
                    ? "no se recupera"
                    : `${fmt(result.paybackDisc, 2)} años`}
                </span>
              </div>

              {result.tir === null && (
                <Note>
                  No hay cambio de signo en el VAN sobre [−99%, 1000%]: la TIR no
                  está definida para este flujo (todos los signos iguales o sin
                  raíz real en el rango).
                </Note>
              )}
              {result.multiple && (
                <Note>
                  El flujo cambia de signo más de una vez: puede haber múltiples
                  TIR. Se reporta la primera raíz; interpretá el VAN como criterio
                  principal.
                </Note>
              )}
            </>
          ) : null}
        </div>
      </div>

      {valid && result && (
        <div className="vtool-sub" style={{ overflowX: "auto" }}>
          <span className="vtool-eyebrow">Flujos descontados</span>
          <table className="vtool-table">
            <thead>
              <tr>
                <th>Año</th>
                <th>Flujo</th>
                <th>Factor</th>
                <th>Descontado</th>
                <th>Acum. simple</th>
                <th>Acum. descont.</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.t}>
                  <td>
                    <code>{row.t}</code>
                  </td>
                  <td>{money(row.cf)}</td>
                  <td>{fmt(1 / Math.pow(1 + r, row.t), 4)}</td>
                  <td>{money(row.disc)}</td>
                  <td
                    style={{
                      color: row.cum >= 0 ? "var(--link)" : "var(--accent-text)",
                    }}
                  >
                    {money(row.cum)}
                  </td>
                  <td
                    style={{
                      color:
                        row.cumDisc >= 0 ? "var(--link)" : "var(--accent-text)",
                    }}
                  >
                    {money(row.cumDisc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* 4) FORMULARIO — referencia                                          */
/* ================================================================== */

function RefTool() {
  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Referencia</span>
        <h3>Formulario</h3>
        <p>
          Fórmulas clave de microeconomía y finanzas para tener a mano durante la
          cursada y los parciales.
        </p>
      </div>

      <div className="vtool-sub">
        <span className="vtool-eyebrow">Microeconomía</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Fórmula</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Elasticidad-precio puntual</td>
              <td>
                <code>ε = (dQ/dP)·(P/Q)</code>
              </td>
              <td>|ε| {">"} 1 elástica; {"<"} 1 inelástica; = 1 unitaria</td>
            </tr>
            <tr>
              <td>Elasticidad arco (punto medio)</td>
              <td>
                <code>ε = (ΔQ/Q̄) / (ΔP/P̄)</code>
              </td>
              <td>Q̄, P̄ = promedios de los dos puntos</td>
            </tr>
            <tr>
              <td>Elasticidad cruzada</td>
              <td>
                <code>ε_xy = (%ΔQ_x) / (%ΔP_y)</code>
              </td>
              <td>{">"} 0 sustitutos; {"<"} 0 complementarios</td>
            </tr>
            <tr>
              <td>Elasticidad-ingreso</td>
              <td>
                <code>η = (%ΔQ) / (%ΔY)</code>
              </td>
              <td>{">"} 0 normal; {"<"} 0 inferior; {">"} 1 de lujo</td>
            </tr>
            <tr>
              <td>Excedente del consumidor</td>
              <td>
                <code>EC = ½·(a − P*)·Q*</code>
              </td>
              <td>Área bajo demanda y sobre el precio</td>
            </tr>
            <tr>
              <td>Excedente del productor</td>
              <td>
                <code>EP = ½·(P* − c)·Q*</code>
              </td>
              <td>Área sobre oferta y bajo el precio</td>
            </tr>
            <tr>
              <td>Peso muerto (impuesto t)</td>
              <td>
                <code>DWL = ½·t·(Q* − Q_t)</code>
              </td>
              <td>Triángulo de pérdida de eficiencia</td>
            </tr>
            <tr>
              <td>Costo total</td>
              <td>
                <code>CT = CF + CV(Q)</code>
              </td>
              <td>Fijo + variable</td>
            </tr>
            <tr>
              <td>Costo medio</td>
              <td>
                <code>CMe = CT / Q</code>
              </td>
              <td>También CMe = CFMe + CVMe</td>
            </tr>
            <tr>
              <td>Costo marginal</td>
              <td>
                <code>CMg = dCT/dQ = ΔCT/ΔQ</code>
              </td>
              <td>Costo de la unidad adicional</td>
            </tr>
            <tr>
              <td>Ingreso marginal</td>
              <td>
                <code>IMg = dIT/dQ</code>
              </td>
              <td>Óptimo del productor: IMg = CMg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="vtool-sub">
        <span className="vtool-eyebrow">Finanzas</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Fórmula</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Valor presente</td>
              <td>
                <code>VP = CF / (1 + r)ⁿ</code>
              </td>
              <td>Descuenta un flujo futuro a hoy</td>
            </tr>
            <tr>
              <td>Valor actual neto</td>
              <td>
                <code>VAN = Σ CFₜ / (1 + r)ᵗ</code>
              </td>
              <td>VAN {">"} 0 ⇒ conviene</td>
            </tr>
            <tr>
              <td>Tasa interna de retorno</td>
              <td>
                <code>VAN(TIR) = 0</code>
              </td>
              <td>Tasa que anula el VAN</td>
            </tr>
            <tr>
              <td>Anualidad (valor presente)</td>
              <td>
                <code>VP = C · [1 − (1+r)⁻ⁿ] / r</code>
              </td>
              <td>C pagos iguales durante n períodos</td>
            </tr>
            <tr>
              <td>Anualidad (valor futuro)</td>
              <td>
                <code>VF = C · [(1+r)ⁿ − 1] / r</code>
              </td>
              <td>Acumulación de pagos iguales</td>
            </tr>
            <tr>
              <td>Perpetuidad</td>
              <td>
                <code>VP = C / r</code>
              </td>
              <td>Pago constante infinito</td>
            </tr>
            <tr>
              <td>Repago descontado</td>
              <td>
                <code>min t : Σ CFₖ/(1+r)ᵏ ≥ 0</code>
              </td>
              <td>Período en que se recupera la inversión</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Export                                                              */
/* ================================================================== */

export default function EconomiaTools() {
  const tools = [
    { key: "mercado", label: "Oferta y demanda", node: <MercadoTool /> },
    { key: "elasticidad", label: "Elasticidades", node: <ElasticidadTool /> },
    { key: "van-tir", label: "VAN y TIR", node: <VanTirTool /> },
    { key: "ref", label: "Formulario", node: <RefTool /> },
  ];

  return (
    <ToolkitShell
      intro={
        <>
          Herramientas interactivas de <b>Economía para Ingenieros</b>:
          equilibrio de mercado con impuestos, elasticidades y evaluación de
          proyectos por VAN/TIR. Todo recalcula en vivo a medida que editás los
          parámetros.
        </>
      }
      tools={tools}
    />
  );
}

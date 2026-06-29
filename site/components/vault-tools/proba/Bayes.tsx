"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Badge } from "@studyvaults/ui";
import { fmt } from "../lib/stats";

/* ============================================================================
 * Bayes / probabilidad total sobre una partición {Aᵢ}
 *
 * P(B) = Σᵢ P(B|Aᵢ) P(Aᵢ)                 (probabilidad total)
 * P(Aᵢ|B) = P(B|Aᵢ) P(Aᵢ) / P(B)          (teorema de Bayes)
 * con Σᵢ P(Aᵢ) = 1 (partición). Aritmética pura, sin funciones especiales.
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

interface Row {
  name: string;
  prior: string; // P(Aᵢ)
  like: string; // P(B|Aᵢ)
}

// Ejemplo por defecto: test diagnóstico (prevalencia 5%, sensibilidad 0.9,
// P(+|sano)=0.01). Tomado de probabilidad-total-y-bayes.md.
const DEFAULT_ROWS: Row[] = [
  { name: "Enfermo (E)", prior: "0.05", like: "0.9" },
  { name: "Sano (Eᶜ)", prior: "0.95", like: "0.01" },
];

const TOL = 1e-6;

export default function BayesTool() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((rs) => [
      ...rs,
      { name: `A${rs.length + 1}`, prior: "0", like: "0" },
    ]);

  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 2 ? rs.filter((_, j) => j !== i) : rs));

  const resetExample = () => setRows(DEFAULT_ROWS);

  const result = useMemo(() => {
    const parsed = rows.map((r) => ({
      name: r.name.trim() === "" ? "—" : r.name.trim(),
      prior: num(r.prior),
      like: num(r.like),
    }));

    // Validaciones.
    if (parsed.some((p) => !Number.isFinite(p.prior) || !Number.isFinite(p.like)))
      return { err: "Completá prior P(Aᵢ) y verosimilitud P(B|Aᵢ) numéricas en cada fila." };

    if (parsed.some((p) => p.prior < 0 || p.prior > 1))
      return { err: "Cada prior P(Aᵢ) debe estar en [0, 1]." };

    if (parsed.some((p) => p.like < 0 || p.like > 1))
      return { err: "Cada verosimilitud P(B|Aᵢ) debe estar en [0, 1]." };

    const sumPrior = parsed.reduce((s, p) => s + p.prior, 0);
    if (Math.abs(sumPrior - 1) > TOL)
      return {
        err: `Los priors deben sumar 1 (partición). Σ P(Aᵢ) = ${fmt(sumPrior)}.`,
        sumPrior,
      };

    // Probabilidad total y conjuntas.
    const joint = parsed.map((p) => p.prior * p.like); // P(Aᵢ) P(B|Aᵢ)
    const pB = joint.reduce((s, j) => s + j, 0); // P(B) = Σ P(B|Aᵢ) P(Aᵢ)

    if (pB <= 0)
      return {
        err: "P(B) = 0: con estos valores B es imposible, no se puede condicionar en B.",
      };

    const post = joint.map((j) => j / pB); // P(Aᵢ|B)

    return {
      rows: parsed.map((p, i) => ({
        name: p.name,
        prior: p.prior,
        like: p.like,
        joint: joint[i],
        post: post[i],
      })),
      pB,
      sumPrior,
    };
  }, [rows]);

  const ok = !("err" in result);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Bayes / probabilidad total</h3>
        <p>
          Cargá una partición de causas {"{Aᵢ}"} con su prior y la verosimilitud
          P(B|Aᵢ): se calcula P(B) por probabilidad total y los posteriores
          P(Aᵢ|B) por Bayes.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles: tabla editable de causas */}
        <div className="vtool-stack">
          <SubPanel>
            <div className="vtool-eyebrow">Partición {"{Aᵢ}"}</div>
            <div className="vtool-stack" style={{ marginTop: 10, gap: 12 }}>
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="vtool-row"
                  style={{ alignItems: "flex-end", gap: 8 }}
                >
                  <Field
                    label="Causa Aᵢ"
                    htmlFor={`name-${i}`}
                    style={{ flex: 1.4 }}
                  >
                    <TextInput
                      id={`name-${i}`}
                      value={r.name}
                      onChange={(e) => setRow(i, { name: e.target.value })}
                    />
                  </Field>
                  <Field
                    label="P(Aᵢ)"
                    htmlFor={`prior-${i}`}
                    style={{ flex: 1 }}
                  >
                    <TextInput
                      id={`prior-${i}`}
                      value={r.prior}
                      onChange={(e) => setRow(i, { prior: e.target.value })}
                      inputMode="decimal"
                    />
                  </Field>
                  <Field
                    label="P(B|Aᵢ)"
                    htmlFor={`like-${i}`}
                    style={{ flex: 1 }}
                  >
                    <TextInput
                      id={`like-${i}`}
                      value={r.like}
                      onChange={(e) => setRow(i, { like: e.target.value })}
                      inputMode="decimal"
                    />
                  </Field>
                  <button
                    type="button"
                    className="btn btn--sm btn--ghost"
                    onClick={() => removeRow(i)}
                    disabled={rows.length <= 2}
                    aria-label={`Quitar fila ${i + 1}`}
                    title={
                      rows.length <= 2
                        ? "Mínimo 2 causas"
                        : "Quitar esta causa"
                    }
                    style={{ marginBottom: 2 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="vtool-row" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={addRow}
              >
                + Agregar causa
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={resetExample}
              >
                Ejemplo (test diagnóstico)
              </button>
            </div>

            <div className="vtool-readout" style={{ marginTop: 12 }}>
              <div className="vtool-kv">
                <span className="k">Σ P(Aᵢ) (debe ser 1)</span>
                <span
                  className={
                    "sumPrior" in result &&
                    Math.abs((result.sumPrior ?? NaN) - 1) <= TOL
                      ? "v acc"
                      : "v coral"
                  }
                >
                  {"sumPrior" in result && result.sumPrior !== undefined
                    ? fmt(result.sumPrior)
                    : "—"}
                </span>
              </div>
            </div>
          </SubPanel>

          <Note>
            {"{Aᵢ}"} es una partición: causas mutuamente excluyentes cuyos priors
            suman 1. La verosimilitud P(B|Aᵢ) es la probabilidad del efecto B dado
            cada causa.
          </Note>
        </div>

        {/* Salida: P(B) + tabla de posteriores */}
        <div className="vtool-stack">
          {"err" in result ? (
            <Note tone="error">{result.err}</Note>
          ) : (
            <>
              <SubPanel>
                <div className="vtool-eyebrow">Probabilidad total</div>
                <div className="vtool-bignum" style={{ marginTop: 6 }}>
                  {fmt(result.pB)}
                  <small> = P(B) = Σ P(B|Aᵢ) P(Aᵢ)</small>
                </div>
              </SubPanel>

              <SubPanel>
                <div className="vtool-eyebrow">Posteriores por causa</div>
                <div style={{ overflowX: "auto", marginTop: 8 }}>
                  <table className="vtool-table">
                    <thead>
                      <tr>
                        <th>Causa</th>
                        <th>P(Aᵢ)</th>
                        <th>P(B|Aᵢ)</th>
                        <th>P(Aᵢ)·P(B|Aᵢ)</th>
                        <th>P(Aᵢ|B)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{r.name}</td>
                          <td>
                            <code>{fmt(r.prior)}</code>
                          </td>
                          <td>
                            <code>{fmt(r.like)}</code>
                          </td>
                          <td>
                            <code>{fmt(r.joint)}</code>
                          </td>
                          <td>
                            <code style={{ color: "var(--accent-text)" }}>
                              {fmt(r.post)}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Σ</td>
                        <td>
                          <code>{fmt(result.sumPrior)}</code>
                        </td>
                        <td>—</td>
                        <td>
                          <code>{fmt(result.pB)}</code>
                        </td>
                        <td>
                          <code>{fmt(1)}</code>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <Note style={{ marginTop: 10 }}>
                  La conjunta P(Aᵢ)·P(B|Aᵢ) es el peso del camino que pasa por Aᵢ
                  y produce B; su suma es P(B), que normaliza los posteriores
                  (suman 1).
                </Note>
              </SubPanel>

              {/* Barras prior vs posterior por causa (divs) */}
              <SubPanel>
                <div className="vtool-eyebrow">Prior vs. posterior</div>
                <div
                  className="vtool-stack"
                  style={{ marginTop: 10, gap: 12 }}
                >
                  {result.rows.map((r, i) => (
                    <div key={i}>
                      <div
                        className="vtool-row"
                        style={{
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span className="vtool-mono">{r.name}</span>
                        <span className="vtool-mono">
                          <Badge>prior {fmt(r.prior, 3)}</Badge>{" "}
                          <Badge
                            variant="solid"
                            style={{
                              background: "var(--accent)",
                              color: "var(--accent-text)",
                            }}
                          >
                            post {fmt(r.post, 3)}
                          </Badge>
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div
                          aria-label={`Prior de ${r.name}`}
                          style={{
                            height: 8,
                            borderRadius: 2,
                            background: "var(--hairline)",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.max(0, Math.min(1, r.prior)) * 100}%`,
                              borderRadius: 2,
                              background: "var(--vault-tint, var(--primary))",
                              opacity: 0.55,
                            }}
                          />
                        </div>
                        <div
                          aria-label={`Posterior de ${r.name}`}
                          style={{
                            height: 8,
                            borderRadius: 2,
                            background: "var(--hairline)",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.max(0, Math.min(1, r.post)) * 100}%`,
                              borderRadius: 2,
                              background: "var(--accent)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Note style={{ marginTop: 10 }}>
                  Barra clara = prior P(Aᵢ); barra violeta = posterior P(Aᵢ|B).
                  Observar B reasigna la creencia entre las causas.
                </Note>
              </SubPanel>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

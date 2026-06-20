"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  money,
  fmt,
  prestamoFrances,
  prestamoAleman,
  prestamoDirecto,
  saldoFrances,
  type TablaPrestamo,
  type CuotaPrestamo,
} from "./lib/finance";

/* ================================================================== */
/* SISTEMAS DE AMORTIZACIÓN — francés / alemán / directo (Unidad 7)     */
/* ================================================================== */

type Sistema = "frances" | "aleman" | "directo";

const SISTEMAS: { value: Sistema; label: string }[] = [
  { value: "frances", label: "Francés (cuota constante)" },
  { value: "aleman", label: "Alemán (amortización constante)" },
  { value: "directo", label: "Directo / americano (interés sobre capital inicial)" },
];

// Filas a mostrar al colapsar tablas largas (n>24): primeras 12 y últimas 6.
const HEAD = 12;
const TAIL = 6;

interface FilaVista {
  ellipsis?: boolean;
  row?: CuotaPrestamo;
}

function colapsar(rows: CuotaPrestamo[]): FilaVista[] {
  if (rows.length <= HEAD + TAIL + 1) return rows.map((row) => ({ row }));
  const head = rows.slice(0, HEAD).map((row) => ({ row }));
  const tail = rows.slice(rows.length - TAIL).map((row) => ({ row }));
  return [...head, { ellipsis: true }, ...tail];
}

export default function PrestamosTool() {
  const [pStr, setPStr] = useState("450000");
  const [nStr, setNStr] = useState("360");
  const [iStr, setIStr] = useState("0.5");
  const [sistema, setSistema] = useState<Sistema>("frances");
  const [tStr, setTStr] = useState("60");

  const r = useMemo(() => {
    const P = num(pStr);
    const n = Math.round(num(nStr));
    const i = num(iStr) / 100;
    if (![P, i].every(Number.isFinite) || !Number.isFinite(n)) return null;
    if (P <= 0 || n <= 0 || i < 0) return null;

    let tabla: TablaPrestamo;
    if (sistema === "frances") tabla = prestamoFrances(P, n, i);
    else if (sistema === "aleman") tabla = prestamoAleman(P, n, i);
    else tabla = prestamoDirecto(P, n, i);

    return { P, n, i, tabla };
  }, [pStr, nStr, iStr, sistema]);

  // Saldo tras t cuotas. En el francés es exacto vía VP de cuotas restantes;
  // en alemán/directo lo leemos de la fila correspondiente de la tabla.
  const saldo = useMemo(() => {
    if (!r) return null;
    const t = Math.round(num(tStr));
    if (!Number.isFinite(t) || t < 0 || t > r.n) return null;
    if (t === 0) return { t, valor: r.P };
    if (t === r.n) return { t, valor: 0 };
    if (sistema === "frances" && r.i > 0) {
      // Saldo exacto = VP de las (n−t) cuotas restantes.
      return { t, valor: saldoFrances(r.tabla.cuotaInicial, r.i, r.n - t) };
    }
    // Alemán, directo o i=0: el saldo se lee de la fila correspondiente.
    return { t, valor: r.tabla.rows[t - 1].saldo };
  }, [r, tStr, sistema]);

  const vista = useMemo(() => (r ? colapsar(r.tabla.rows) : []), [r]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Sistemas de amortización de préstamos</h3>
        <p>
          Armá la tabla de un préstamo y comparalo entre sistemas. En el{" "}
          <b>francés</b> la cuota es constante; en el <b>alemán</b> la
          amortización es constante (cuota decreciente); en el <b>directo</b> el
          interés se calcula siempre sobre el capital inicial. La tasa{" "}
          <span className="vtool-mono">i</span> es la efectiva del período de cada
          cuota.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Capital P</b> (préstamo)
            </label>
            <TextInput
              inputMode="decimal"
              value={pStr}
              onChange={(e) => setPStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>n</b> (cuotas)
              </label>
              <TextInput
                inputMode="numeric"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>i</b> (% del período)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Sistema</b>
            </label>
            <Select
              value={sistema}
              onChange={(e) => setSistema(e.target.value as Sistema)}
            >
              {SISTEMAS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Saldo tras t cuotas</b> — t
            </label>
            <TextInput
              inputMode="numeric"
              value={tStr}
              onChange={(e) => setTStr(e.target.value)}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Completá P, n e i con números válidos (P&gt;0, n&gt;0, i≥0).
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                Cuota inicial = {money(r.tabla.cuotaInicial)}
                <small>
                  {sistema === "frances"
                    ? "constante todas las cuotas"
                    : sistema === "directo"
                      ? "constante (P/n + P·i)"
                      : "primera cuota (luego decrece)"}
                </small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Totales</span>
                <div className="vtool-kv">
                  <span className="k">Total pagado</span>
                  <span className="v">{money(r.tabla.totalPagado)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Total interés</span>
                  <span className="v coral">{money(r.tabla.totalInteres)}</span>
                </div>
                {sistema !== "frances" && (
                  <div className="vtool-kv">
                    <span className="k">Última cuota</span>
                    <span className="v">
                      {money(r.tabla.rows[r.tabla.rows.length - 1].cuota)}
                    </span>
                  </div>
                )}
              </div>

              {saldo ? (
                <div className="vtool-sub">
                  <span className="vtool-eyebrow">Saldo tras t cuotas</span>
                  <div className="vtool-kv">
                    <span className="k">Saldo a t = {fmt(saldo.t, 0)}</span>
                    <span className="v acc">{money(saldo.valor)}</span>
                  </div>
                </div>
              ) : (
                <p className="vtool-error">
                  El t para el saldo debe ser un entero entre 0 y {r.n}.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {r && (
        <table className="vtool-table">
          <thead>
            <tr>
              <th>t</th>
              <th>Cuota</th>
              <th>Interés</th>
              <th>Amortización</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {vista.map((f, idx) =>
              f.ellipsis ? (
                <tr key="ellipsis">
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    … {r.n - HEAD - TAIL} cuotas omitidas …
                  </td>
                </tr>
              ) : (
                <tr key={f.row!.t ?? idx}>
                  <td>{f.row!.t}</td>
                  <td>{money(f.row!.cuota)}</td>
                  <td>{money(f.row!.interes)}</td>
                  <td>{money(f.row!.amortizacion)}</td>
                  <td>{money(f.row!.saldo)}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}

      <Note>
        Francés: <span className="vtool-mono">C = P·i / [1 − (1+i)^−n]</span>. El
        saldo tras pagar t cuotas es el <b>VP de las cuotas que faltan</b>:{" "}
        <span className="vtool-mono">saldo_t = C · a(n−t ; i)</span>. Alemán:
        amortización fija <span className="vtool-mono">A = P/n</span>, cuota = A +
        saldo·i. Directo: <span className="vtool-mono">C = P/n + P·i</span>.
      </Note>
    </div>
  );
}

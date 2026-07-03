"use client";

// Ingesta de la planilla oficial de finales → autocompleta las fechas de mesa
// del combinador. Tres vías: traer del link oficial (fetch con CORS abierto),
// subir un CSV, o pegar el texto. El parseo puro vive en
// lib/planner/finales/parseFinales.ts; la I/O en lib/planner/finales/source.ts;
// las mesas cargadas van al store reactivo de lib/planner/finalesData.ts, que
// mesaOficial() consulta antes que el mock.
//
// Static-export safe: fetch/FileReader corren solo en handlers del cliente.

import { useMemo, useRef, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import { byId } from "@/lib/planner/model";
import {
  parseFinalesCsv,
  finalesRowsToMesas,
  type FinalMateriaRow,
  type Llamado,
} from "@/lib/planner/finales/parseFinales";
import {
  fetchFinalesCsv,
  readFinalesFile,
  FINALES_PUB_HTML_URL,
} from "@/lib/planner/finales/source";
import {
  setMesasOficiales,
  clearMesasOficiales,
  PERIODO_LABEL,
} from "@/lib/planner/finalesData";
import type { FinalPeriodo } from "@/lib/planner/types";
import {
  IconArrowUpRight,
  IconCheck,
  IconClock,
  IconDownload,
  IconInfo,
  IconTrash,
  IconUpload,
} from "@/components/planner/icons";

type Status = "idle" | "loading" | "ok" | "error";

export default function FinalesIngesta() {
  const { state, dispatch } = usePlanner();
  const { periodo, anio } = state.finales;

  const [rows, setRows] = useState<FinalMateriaRow[] | null>(null);
  const [detected, setDetected] = useState<{
    periodo: FinalPeriodo;
    anio: number;
  } | null>(null);
  const [llamado, setLlamado] = useState<Llamado>("primer");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // cuántos de tus finales pendientes quedaron con fecha oficial.
  const matched = useMemo(() => {
    if (!rows) return 0;
    const codes = new Set(rows.map((r) => r.codigo));
    let n = 0;
    for (const c of state.approved)
      if (!state.finalDone.has(c) && byId.has(c) && codes.has(c)) n++;
    return n;
  }, [rows, state.approved, state.finalDone]);

  // ---- pipeline: aplica filas parseadas al store + salta al llamado/año ----
  const apply = (
    newRows: FinalMateriaRow[],
    per: FinalPeriodo,
    an: number,
    ll: Llamado,
  ) => {
    dispatch({ type: "SET_FINALES_PERIODO", periodo: per });
    dispatch({ type: "SET_FINALES_ANIO", anio: an });
    setMesasOficiales(per, an, finalesRowsToMesas(newRows, ll));
  };

  const ingest = (csv: string): boolean => {
    const res = parseFinalesCsv(csv);
    if (res.rows.length === 0) {
      setStatus("error");
      setError(
        res.warnings[0] ?? "No se encontraron materias en el archivo.",
      );
      return false;
    }
    const per = res.periodoDetectado ?? periodo;
    const an = res.anioDetectado ?? anio;
    setRows(res.rows);
    setDetected({ periodo: per, anio: an });
    setLlamado("primer");
    apply(res.rows, per, an, "primer");
    setError(res.warnings.length ? `${res.warnings.length} fila(s) ignorada(s).` : "");
    setStatus("ok");
    return true;
  };

  const traer = async () => {
    setStatus("loading");
    setError("");
    try {
      const csv = await fetchFinalesCsv();
      ingest(csv);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "No se pudo traer la planilla.");
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setStatus("loading");
    setError("");
    try {
      const text = await readFinalesFile(f);
      ingest(text);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const procesarPegado = () => {
    if (!pasteText.trim()) return;
    setStatus("loading");
    setError("");
    if (ingest(pasteText)) setPasteOpen(false);
  };

  const switchLlamado = (ll: Llamado) => {
    if (!rows || !detected) return;
    setLlamado(ll);
    apply(rows, detected.periodo, detected.anio, ll);
  };

  const quitar = () => {
    if (detected) clearMesasOficiales(detected.periodo, detected.anio);
    setRows(null);
    setDetected(null);
    setStatus("idle");
    setError("");
    setPasteText("");
  };

  const loaded = status === "ok" && rows && detected;

  return (
    <section className="fin__ing" aria-label="Cargar fechas oficiales de mesas">
      <div className="fin__ing-head">
        <span className="fin__ing-ico" aria-hidden="true">
          <IconDownload size={15} />
        </span>
        <div className="fin__ing-head-txt">
          <h3 className="fin__ing-title">Fechas oficiales de mesas</h3>
          <p className="fin__ing-sub">
            Traé el calendario oficial de finales y autocompletá la fecha y hora
            de cada mesa. Todo se procesa en tu navegador — no se sube nada.
          </p>
        </div>
      </div>

      {!loaded && (
        <>
          <div className="fin__ing-actions">
            <button
              type="button"
              className="fin__hbtn is-primary"
              onClick={traer}
              disabled={status === "loading"}
            >
              <IconDownload size={13} />
              {status === "loading" ? "Trayendo…" : "Traer del link oficial"}
            </button>

            <label className="fin__ing-file">
              <IconUpload size={13} />
              <span>Subir CSV</span>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={onFile}
                disabled={status === "loading"}
              />
            </label>

            <button
              type="button"
              className="fin__ing-link"
              onClick={() => setPasteOpen((v) => !v)}
              aria-expanded={pasteOpen}
            >
              {pasteOpen ? "cancelar" : "o pegá el texto"}
            </button>

            <a
              className="fin__ing-open"
              href={FINALES_PUB_HTML_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ver la planilla <IconArrowUpRight size={12} />
            </a>
          </div>

          {pasteOpen && (
            <div className="fin__ing-paste">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={
                  "Pegá acá el contenido del CSV\nCód,Materia,Primer llamado,Hora,Segundo llamado,Hora\n10.01,…"
                }
                rows={4}
                spellCheck={false}
              />
              <button
                type="button"
                className="fin__hbtn is-primary"
                onClick={procesarPegado}
                disabled={!pasteText.trim()}
              >
                <IconCheck size={13} /> Procesar
              </button>
            </div>
          )}
        </>
      )}

      {status === "error" && (
        <p className="fin__ing-error" role="alert">
          <IconInfo size={13} /> {error}
        </p>
      )}

      {loaded && (
        <div className="fin__ing-loaded">
          <div className="fin__ing-badge">
            <IconCheck size={13} />
            <b>{rows!.length}</b> materias · {PERIODO_LABEL[detected!.periodo]}{" "}
            {detected!.periodo === "febrero"
              ? detected!.anio + 1
              : detected!.anio}
            {matched > 0 && (
              <span className="fin__ing-match">
                · {matched} de tus finales pendientes con fecha
              </span>
            )}
          </div>

          <div className="fin__ing-llamado">
            <span className="fin__ing-llamado-lbl">
              <IconClock size={12} /> Llamado que se usa
            </span>
            <div className="fin__seg" role="group" aria-label="Llamado de la mesa">
              {(["primer", "segundo"] as Llamado[]).map((ll) => (
                <button
                  key={ll}
                  type="button"
                  className={"fin__seg-b" + (ll === llamado ? " is-active" : "")}
                  aria-pressed={ll === llamado}
                  onClick={() => switchLlamado(ll)}
                >
                  {ll === "primer" ? "Primer" : "Segundo"} llamado
                </button>
              ))}
            </div>
          </div>

          <div className="fin__ing-loaded-actions">
            <button type="button" className="fin__ing-quitar" onClick={quitar}>
              <IconTrash size={12} /> Quitar y volver a los datos de ejemplo
            </button>
            {error && <span className="fin__ing-warn">{error}</span>}
          </div>
        </div>
      )}

      <p className="fin__ing-disclaimer">
        <IconInfo size={12} />
        <span>
          Las fechas salen de la planilla que cargues. Verificá siempre con la
          cátedra: la fuente oficial es la planilla, no esta herramienta.
        </span>
      </p>
    </section>
  );
}

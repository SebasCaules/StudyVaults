"use client";

// Combinación de finales — pestaña nueva del planner (feature nueva).
// Spec visual: _design-review/module-f-combinador.html.
//
// Lee el estado global `state.finales` (types.ts / state.tsx) y las acciones
// SET_FINALES_PERIODO / SET_FINALES_ANIO / SET_MESA / TOGGLE_FINAL_SEL /
// SET_FINALES_REMINDER / SET_FINALES_MARGEN. Los datos de mesas y correlativas
// de final salen de lib/planner/finalesData.ts (DATA DE EJEMPLO, a reemplazar).
//
// Regla de negocio (contrato del overseer):
//   · un final está "pendiente" si tenés la cursada REGULAR aprobada y todavía
//     no rendiste el final: approved.has(code) && !finalDone.has(code).
//   · para rendir un final necesitás sus correlativas de FINAL aprobadas
//     (finalDone). Si falta alguna, el final queda bloqueado (candado).
//
// Static-export safe: el .ics se arma client-side (Blob + createObjectURL)
// detrás de un guard `typeof window !== "undefined"`.

import {
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { usePlanner } from "@/components/planner/state";
import { byId, credOf, PALETTE } from "@/lib/planner/model";
import {
  PERIODOS,
  PERIODO_LABEL,
  PERIODO_ORDINAL,
  periodoMesAnio,
  periodoAnioReal,
  mesaOficial,
  finalHabilitado,
  subscribeMesasOficiales,
  mesasOficialesVersion,
  hayMesasOficialesCargadas,
} from "@/lib/planner/finalesData";
import FinalesIngesta from "@/components/planner/FinalesIngesta";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconDownload,
  IconInfo,
  IconLock,
  IconPlus,
  IconTrash,
} from "@/components/planner/icons";
import type { FinalPeriodo, MesaFinal } from "@/lib/planner/types";
import "../finales.css";

/* ============================ helpers puros ============================ */

const MES_ABBR = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
const MES_NOMBRE = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DOW_ABBR = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

/** Duración asumida de una mesa de final para detectar superposición (min). */
const EXAM_DUR_MIN = 180;

const pad2 = (n: number) => String(n).padStart(2, "0");
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
const isoOf = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseISO = (s: string) => {
  const [y, mo, d] = s.split("-").map(Number);
  return new Date(y, (mo || 1) - 1, d || 1);
};
/** DD/MM legible a partir de "YYYY-MM-DD". */
const ddmm = (iso: string) => {
  const [, mo, d] = iso.split("-");
  return `${d}/${mo}`;
};
/** Días calendario entre dos fechas ISO (b - a). */
const dayDiff = (a: string, b: string) =>
  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
/** ¿Se superponen dos mesas? (misma fecha + ventanas horarias que se cruzan). */
function mesasPisan(a: MesaFinal, b: MesaFinal): boolean {
  if (a.fecha !== b.fecha) return false;
  const as = toMin(a.hora);
  const bs = toMin(b.hora);
  return as < bs + EXAM_DUR_MIN && bs < as + EXAM_DUR_MIN;
}
/** Escape RFC 5545 (backslash, coma, punto y coma, saltos de línea). */
const icsEsc = (s: string) =>
  String(s).replace(/([\\,;])/g, "\\$1").replace(/\r?\n/g, "\\n");

/** Zona horaria de las mesas. Argentina es UTC-3 fijo todo el año (sin DST):
 *  alcanza con un único bloque STANDARD en el VTIMEZONE. */
const ICS_TZID = "America/Argentina/Buenos_Aires";

/** Octetos UTF-8 de un code point (para plegar sin partir caracteres). */
const cpOctets = (cp: number) =>
  cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;

/** Plegado de líneas RFC 5545 §3.1: máximo 75 octetos por línea física; la
 *  continuación arranca con CRLF + un espacio (el espacio cuenta en el tope). */
function icsFold(line: string): string {
  let out = "";
  let len = 0;
  for (const ch of line) {
    const n = cpOctets(ch.codePointAt(0)!);
    if (len + n > 75) {
      out += "\r\n ";
      len = 1;
    }
    out += ch;
    len += n;
  }
  return out;
}

/** Objeto style con una custom property CSS (tipado seguro para tsc). */
const cvar = (name: string, value: string): CSSProperties =>
  ({ [name]: value } as CSSProperties);

type Source = "oficial" | "manual" | "none";

interface FinalRow {
  code: string;
  nombre: string;
  abbr: string;
  creditos: number;
  anio: number;
  cuatri: number;
  color: string;
  blocked: boolean;
  faltan: string[];
  mesa: MesaFinal | null;
  source: Source;
  /** la mesa efectiva cae dentro del mes/año del llamado mostrado. */
  inPeriod: boolean;
  selected: boolean;
}

/* ============================ componente ============================ */

export default function FinalesCombinadorView() {
  const { state, dispatch } = usePlanner();
  const { approved, finalDone } = state;
  const { periodo, anio, mesas, seleccion, reminderHs, margenDias } =
    state.finales;

  const [panelOpen, setPanelOpen] = useState(true);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  // Re-render cuando el store de mesas oficiales cambia (carga del parser de la
  // planilla). SSR-safe: en el server el snapshot es siempre 0.
  const mesasVersion = useSyncExternalStore(
    subscribeMesasOficiales,
    mesasOficialesVersion,
    () => 0,
  );

  const { month, year } = periodoMesAnio(periodo, anio);
  const anioReal = periodoAnioReal(periodo, anio);
  const conMesasReales = hayMesasOficialesCargadas(periodo, anio);

  // ----- universo de finales pendientes (approved && !finalDone) -----
  const rows: FinalRow[] = useMemo(() => {
    const codes: string[] = [];
    for (const c of approved) if (!finalDone.has(c) && byId.has(c)) codes.push(c);
    // orden estable: por año/cuatri/nombre (para color y listado)
    codes.sort((a, b) => {
      const ma = byId.get(a)!;
      const mb = byId.get(b)!;
      return (
        (ma.anio ?? 99) - (mb.anio ?? 99) ||
        (ma.cuatri ?? 9) - (mb.cuatri ?? 9) ||
        ma.nombre.localeCompare(mb.nombre)
      );
    });
    return codes.map((code, i) => {
      const m = byId.get(code)!;
      const { ok, faltan } = finalHabilitado(code, finalDone);
      const manual = mesas.get(code);
      const oficial = mesaOficial(code, periodo, anio);
      const mesa = manual ?? oficial ?? null;
      const source: Source = manual ? "manual" : oficial ? "oficial" : "none";
      const inPeriod = (() => {
        if (!mesa) return false;
        const d = parseISO(mesa.fecha);
        return d.getMonth() === month - 1 && d.getFullYear() === year;
      })();
      return {
        code,
        nombre: m.nombre,
        abbr: m.abbr,
        creditos: credOf(code),
        anio: m.anio ?? 99,
        cuatri: m.cuatri ?? 9,
        color: PALETTE[i % PALETTE.length],
        blocked: !ok,
        faltan,
        mesa,
        source,
        inPeriod,
        selected: seleccion.has(code),
      };
    });
    // mesasVersion: recomputa cuando el parser carga/limpia mesas oficiales.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approved, finalDone, mesas, seleccion, periodo, anio, month, year, mesasVersion]);

  const eligibles = useMemo(() => rows.filter((r) => !r.blocked), [rows]);
  const blocked = useMemo(() => rows.filter((r) => r.blocked), [rows]);
  const selectedRows = useMemo(
    () => eligibles.filter((r) => r.selected),
    [eligibles],
  );
  const selectedInPeriod = useMemo(
    () => selectedRows.filter((r) => r.inPeriod && r.mesa),
    [selectedRows],
  );

  // nombre corto por código para tooltips de correlativa
  const nombreDe = (code: string) => byId.get(code)?.nombre ?? code;

  // ----- conflictos entre los seleccionados con fecha en el período -----
  const { pisanCodes, flags } = useMemo(() => {
    const pisan = new Set<string>();
    const fl: { kind: "caution" | "warn"; title: string; body: string }[] = [];
    const withMesa = selectedInPeriod
      .slice()
      .sort(
        (a, b) =>
          a.mesa!.fecha.localeCompare(b.mesa!.fecha) ||
          toMin(a.mesa!.hora) - toMin(b.mesa!.hora),
      );
    // se pisan (pares que se superponen)
    for (let i = 0; i < withMesa.length; i++) {
      for (let j = i + 1; j < withMesa.length; j++) {
        if (mesasPisan(withMesa[i].mesa!, withMesa[j].mesa!)) {
          pisan.add(withMesa[i].code);
          pisan.add(withMesa[j].code);
          fl.push({
            kind: "caution",
            title: "Se pisan",
            body: `${withMesa[i].nombre} (${ddmm(withMesa[i].mesa!.fecha)} · ${withMesa[i].mesa!.hora}) y ${withMesa[j].nombre} (${ddmm(withMesa[j].mesa!.fecha)} · ${withMesa[j].mesa!.hora}) se superponen. No podés rendir las dos en este llamado.`,
          });
        }
      }
    }
    // sin margen / poco margen (consecutivos por fecha, sin superponerse)
    for (let i = 0; i < withMesa.length - 1; i++) {
      const a = withMesa[i];
      const b = withMesa[i + 1];
      if (mesasPisan(a.mesa!, b.mesa!)) continue;
      const dd = dayDiff(a.mesa!.fecha, b.mesa!.fecha);
      if (dd === 0) {
        // mismo día sin cruzarse en hora: se pueden rendir las dos, pero no
        // queda ningún margen de estudio entre una y otra.
        fl.push({
          kind: "warn",
          title: "Dos finales el mismo día",
          body: `${a.nombre} (${a.mesa!.hora}) y ${b.nombre} (${b.mesa!.hora}) caen el mismo día (${ddmm(a.mesa!.fecha)}). No se superponen en horario, pero no tenés margen de estudio entre uno y otro.`,
        });
        continue;
      }
      const prep = dd - 1; // días completos de preparación entre ambos
      if (prep < margenDias) {
        fl.push({
          kind: "warn",
          title: "Poco margen de repaso",
          body: `${prep === 0 ? "Ningún día completo" : `Solo ${prep} día${prep === 1 ? "" : "s"}`} para preparar entre ${a.nombre} (${ddmm(a.mesa!.fecha)}) y ${b.nombre} (${ddmm(b.mesa!.fecha)}).`,
        });
      }
    }
    return { pisanCodes: pisan, flags: fl };
  }, [selectedInPeriod, margenDias]);

  // ----- ¿agregar un pendiente pisaría lo ya elegido? (aviso en el panel) -----
  const wouldPisar = (r: FinalRow): boolean => {
    if (!r.inPeriod || !r.mesa || r.selected) return false;
    return selectedInPeriod.some((s) => mesasPisan(s.mesa!, r.mesa!));
  };

  // ----- calendario del mes del llamado -----
  const calendar = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    // offset del día 1 respecto del lunes (Lu=0 … Do=6)
    const startOffset = (first.getDay() + 6) % 7;
    const numWeeks = Math.ceil((startOffset + daysInMonth) / 7);

    // mesas ubicadas por fecha
    const byDate = new Map<string, FinalRow[]>();
    for (const r of selectedInPeriod) {
      const k = r.mesa!.fecha;
      const arr = byDate.get(k);
      if (arr) arr.push(r);
      else byDate.set(k, [r]);
    }

    const weeks = [];
    for (let w = 0; w < numWeeks; w++) {
      const days = [];
      const inMonthNums: number[] = [];
      for (let dow = 0; dow < 6; dow++) {
        // Lu..Sá (se omite domingo, como el mock)
        const offset = w * 7 + dow - startOffset;
        const d = new Date(year, month - 1, 1 + offset);
        const inMonth = d.getMonth() === month - 1;
        const iso = isoOf(d);
        const exams = inMonth ? byDate.get(iso) ?? [] : [];
        if (inMonth) inMonthNums.push(d.getDate());
        days.push({ iso, dayNum: d.getDate(), inMonth, exams });
      }
      const hasExams = days.some((d) => d.exams.length > 0);
      const label =
        inMonthNums.length > 0
          ? `${inMonthNums[0]}–${inMonthNums[inMonthNums.length - 1]} ${MES_ABBR[month - 1]}`
          : "";
      weeks.push({ days, hasExams, label });
    }
    return weeks;
  }, [selectedInPeriod, month, year]);

  // finales elegidos sin fecha cargada (para el editor "Fechas de mesa")
  const editorRows = selectedRows; // todos los elegidos, con o sin mesa

  // ----- acciones -----
  const setPeriodo = (p: FinalPeriodo) =>
    dispatch({ type: "SET_FINALES_PERIODO", periodo: p });
  const toggleSel = (code: string) =>
    dispatch({ type: "TOGGLE_FINAL_SEL", code });
  const setMesa = (code: string, mesa: MesaFinal | null) =>
    dispatch({ type: "SET_MESA", code, mesa });

  // "Sugerir combinación": elige el máximo de finales sin pisarse y con
  // margen ≥ margenDias, y lo aplica a la selección.
  const sugerir = () => {
    const cand = eligibles
      .filter((r) => r.inPeriod && r.mesa)
      .sort(
        (a, b) =>
          a.mesa!.fecha.localeCompare(b.mesa!.fecha) ||
          toMin(a.mesa!.hora) - toMin(b.mesa!.hora),
      );
    const chosen: FinalRow[] = [];
    for (const c of cand) {
      const pisa = chosen.some((x) => mesasPisan(x.mesa!, c.mesa!));
      if (pisa) continue;
      const pegado = chosen.some((x) => {
        const dd = Math.abs(dayDiff(x.mesa!.fecha, c.mesa!.fecha));
        return dd === 0 || dd - 1 < margenDias;
      });
      if (pegado) continue;
      chosen.push(c);
    }
    const target = new Set(chosen.map((c) => c.code));
    // reconciliar la selección de los elegibles con fecha en el período
    for (const r of cand) {
      const want = target.has(r.code);
      if (want !== r.selected) toggleSel(r.code);
    }
  };

  // ----- .ics (client-side, guardado) -----
  const includables = selectedInPeriod; // elegidos, elegibles, con fecha en el período
  const buildICS = (): string => {
    const stamp =
      new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const out = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//StudyVaults ITBA//Combinador de finales//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${icsEsc(`Finales — ${PERIODO_LABEL[periodo]} ${anioReal} (StudyVaults)`)}`,
      // Hora local con zona explícita: sin TZID los clientes interpretan la
      // hora "flotante" según la zona del dispositivo que abre el .ics.
      "BEGIN:VTIMEZONE",
      `TZID:${ICS_TZID}`,
      "BEGIN:STANDARD",
      "DTSTART:19700101T000000",
      "TZOFFSETFROM:-0300",
      "TZOFFSETTO:-0300",
      "TZNAME:-03",
      "END:STANDARD",
      "END:VTIMEZONE",
    ];
    for (const r of includables) {
      const { fecha, hora } = r.mesa!;
      const mins = toMin(hora);
      const start = parseISO(fecha);
      start.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
      const end = new Date(start.getTime() + EXAM_DUR_MIN * 60000);
      const fmt = (d: Date) =>
        `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
      out.push(
        "BEGIN:VEVENT",
        // UID estable por materia + llamado (SIN la fecha del evento): si
        // corregís la fecha y re-importás, el evento se actualiza en vez de
        // duplicarse en el calendario.
        `UID:sv-final-${r.code}-${periodo}-${anioReal}@studyvaults.itba`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=${ICS_TZID}:${fmt(start)}`,
        `DTEND;TZID=${ICS_TZID}:${fmt(end)}`,
        `SUMMARY:${icsEsc(`Final: ${r.nombre}`)}`,
        `LOCATION:${icsEsc("ITBA — sede a confirmar")}`,
        `DESCRIPTION:${icsEsc(
          `Mesa de final (${r.source === "manual" ? "fecha cargada a mano" : "oficial"}). ` +
            "Fechas sujetas a confirmación de la cátedra — revisá con el/la docente. " +
            "El .ics es una ayuda, no la fuente oficial.",
        )}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `TRIGGER:-PT${reminderHs}H`,
        `DESCRIPTION:${icsEsc(`Anotate a la mesa de ${r.nombre} — cierra la inscripción`)}`,
        "END:VALARM",
        "END:VEVENT",
      );
    }
    out.push("END:VCALENDAR");
    // plegado RFC 5545 sobre TODAS las líneas (DESCRIPTION suele pasar los 75).
    return out.map(icsFold).join("\r\n");
  };

  const exportarICS = () => {
    if (typeof window === "undefined" || includables.length === 0) return;
    const text = buildICS();
    const nombreArch = `finales-${periodo}-${anioReal}-studyvaults.ics`;
    const a = document.createElement("a");
    let url: string | null = null;
    try {
      const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
      url = URL.createObjectURL(blob);
      a.href = url;
    } catch {
      a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(text);
    }
    a.download = nombreArch;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (url) window.setTimeout(() => URL.revokeObjectURL(url!), 1500);
    setExportMsg(
      `${includables.length} final${includables.length === 1 ? "" : "es"} · aviso ${reminderHs} hs antes`,
    );
  };

  // ----- textos de resumen -----
  const nSel = selectedRows.length;
  const nEligPend = eligibles.filter((r) => !r.selected).length;
  const resumenMain =
    rows.length === 0
      ? "No tenés finales pendientes en este llamado."
      : `En ${PERIODO_LABEL[periodo]} rendís ${nSel} final${nSel === 1 ? "" : "es"} · te queda${nEligPend === 1 ? "" : "n"} ${nEligPend} para los otros llamados.`;
  const resumenSub =
    rows.length === 0
      ? "Marcá una materia como cursada regular (una tilde) en la pestaña de aprobadas para verla acá."
      : [
          blocked.length > 0
            ? `${blocked.length} bloqueado${blocked.length === 1 ? "" : "s"} por correlativa de final`
            : null,
          flags.some((f) => f.kind === "caution")
            ? "revisá los cruces marcados"
            : null,
        ]
          .filter(Boolean)
          .join(" · ") || "sin conflictos detectados en la selección actual";

  const yearOpts = Array.from(new Set([2025, 2026, 2027, 2028, anio])).sort(
    (a, b) => a - b,
  );

  /* ============================ render ============================ */

  return (
    <section className="view-panel fin" aria-label="Combinación de finales">
      <div className="panel-head">
        <h2>Combinación de finales</h2>
        <p>
          Elegí el llamado, sumá los finales que tenés pendientes y la
          herramienta ubica cada uno en su mesa, marca los que se pisan o quedan
          muy pegados, y te sugiere una combinación con margen de repaso.
        </p>
      </div>

      {/* ---- ingesta de la planilla oficial (autocompleta las mesas) ---- */}
      <FinalesIngesta />

      {/* ---- barra: llamado + año + panel + sugerir ---- */}
      <div className="fin__bar">
        <div className="fin__bar-left">
          <span className="fin__lbl">Llamado</span>
          <div className="fin__seg" role="group" aria-label="Llamado a finales">
            {PERIODOS.map((p) => (
              <button
                key={p}
                type="button"
                className={"fin__seg-b" + (p === periodo ? " is-active" : "")}
                aria-pressed={p === periodo}
                onClick={() => setPeriodo(p)}
              >
                {PERIODO_LABEL[p]}{" "}
                <span className="fin__seg-n">· {PERIODO_ORDINAL[p]}</span>
              </button>
            ))}
          </div>
          <label className="fin__year">
            <span className="sr-only">Año del llamado</span>
            <select
              value={anio}
              onChange={(e) =>
                dispatch({
                  type: "SET_FINALES_ANIO",
                  anio: Number(e.target.value),
                })
              }
            >
              {yearOpts.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="fin__bar-right">
          <button
            type="button"
            className="fin__hbtn"
            aria-pressed={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
          >
            <IconCalendar size={13} />
            Finales pendientes <span className="fin__count">· {rows.length}</span>
          </button>
          <button
            type="button"
            className="fin__hbtn is-primary"
            onClick={sugerir}
            disabled={eligibles.filter((r) => r.inPeriod && r.mesa).length === 0}
          >
            <IconCheck size={13} />
            Sugerir combinación
          </button>
        </div>
      </div>

      {/* ---- resumen ---- */}
      <div className="fin__resumen">
        <span className="fin__resumen-ico" aria-hidden="true">
          <IconGraduation />
        </span>
        <div className="fin__resumen-body">
          <div className="fin__resumen-main">{resumenMain}</div>
          <div className="fin__resumen-sub">{resumenSub}</div>
        </div>
        <label className="fin__margen">
          <span>Margen de repaso</span>
          <select
            value={margenDias}
            onChange={(e) =>
              dispatch({
                type: "SET_FINALES_MARGEN",
                dias: Number(e.target.value),
              })
            }
          >
            {[1, 2, 3, 4].map((d) => (
              <option key={d} value={d}>
                {d} día{d === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ---- conflictos ---- */}
      {flags.length > 0 && (
        <div className="fin__flags" aria-label="Conflictos detectados">
          {flags.map((f, i) => (
            <div key={i} className={"fin__flag " + f.kind}>
              <span className="fin__flag-ico" aria-hidden="true">
                {f.kind === "caution" ? <IconAlert /> : <IconClock size={16} />}
              </span>
              <div className="fin__flag-txt">
                <div className="fin__flag-title">{f.title}</div>
                <div className="fin__flag-body">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- combinación elegida ---- */}
      {selectedInPeriod.length > 0 && (
        <div className="fin__combo">
          <div className="fin__combo-eyebrow">
            <IconCheck size={14} /> Combinación elegida
          </div>
          <p className="fin__combo-line">
            {flags.length === 0
              ? `Rendís sin pisarte, con al menos ${margenDias} día${margenDias === 1 ? "" : "s"} de repaso entre finales:`
              : "Tu combinación actual (revisá los avisos de arriba):"}
          </p>
          <div className="fin__combo-chips">
            {selectedInPeriod
              .slice()
              .sort((a, b) => a.mesa!.fecha.localeCompare(b.mesa!.fecha))
              .map((r) => (
                <span
                  key={r.code}
                  className="fin__combo-chip"
                  style={cvar("--c-color", r.color)}
                >
                  <span className="fin__cc-dot" />
                  {r.nombre}{" "}
                  <span className="fin__cc-date">{ddmm(r.mesa!.fecha)}</span>
                </span>
              ))}
          </div>
          <p className="fin__combo-sub">
            {nEligPend > 0
              ? `Quedan ${nEligPend} final${nEligPend === 1 ? "" : "es"} elegible${nEligPend === 1 ? "" : "s"} sin sumar. `
              : ""}
            Ajustá la combinación agregando o quitando finales del panel.
          </p>
        </div>
      )}

      {/* ---- exportar a calendario (.ics) ---- */}
      {selectedRows.length > 0 && (
        <div className="fin__export">
          <div className="fin__export-eyebrow">
            <IconCalendar size={14} /> Agregar a mi calendario
          </div>
          <p className="fin__export-line">
            Bajás un archivo <span className="mono">.ics</span> con un evento por
            cada final del período — lo abrís en Google Calendar, Apple Calendar
            o el que uses, con fecha y hora de cada mesa ya cargadas.
          </p>

          <div className="fin__export-controls">
            <label className="fin__reminder">
              <span>Recordatorio para anotarte</span>
              <select
                value={reminderHs}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FINALES_REMINDER",
                    hs: Number(e.target.value),
                  })
                }
              >
                {[48, 72, 96].map((h) => (
                  <option key={h} value={h}>
                    {h} hs antes
                  </option>
                ))}
              </select>
            </label>
            <span className="fin__reminder-hint">
              El aviso «Anotate a la mesa» queda <b>{reminderHs} hs</b> antes de
              cada final, para no perder la inscripción.
            </span>
          </div>

          {includables.length > 0 ? (
            <div className="fin__export-chips" aria-label="Finales incluidos en el .ics">
              <span className="fin__export-chips-lbl">Van al .ics</span>
              {includables
                .slice()
                .sort((a, b) => a.mesa!.fecha.localeCompare(b.mesa!.fecha))
                .map((r) => (
                  <span
                    key={r.code}
                    className="fin__export-chip"
                    style={cvar("--c-color", r.color)}
                  >
                    <span className="fin__ec-dot" />
                    {r.nombre}{" "}
                    <span className="fin__ec-date">{ddmm(r.mesa!.fecha)}</span>
                  </span>
                ))}
            </div>
          ) : (
            <p className="fin__export-empty">
              Cargá la fecha de mesa de los finales elegidos para poder
              exportarlos.
            </p>
          )}

          <div className="fin__export-actions">
            <button
              type="button"
              className="fin__hbtn is-primary"
              onClick={exportarICS}
              disabled={includables.length === 0}
            >
              <IconDownload size={13} />
              Agregar a mi calendario (.ics)
            </button>
            {exportMsg && (
              <span className="fin__export-ok">
                <IconCheck size={14} /> {exportMsg}
              </span>
            )}
          </div>

          <p className="fin__export-disclaimer">
            Fechas sujetas a confirmación de la cátedra · revisá con el/la
            docente · las mesas bloqueadas por correlativa de final <b>no se
            agregan</b> hasta que rindas la anterior · el <b>.ics es una ayuda,
            no la fuente oficial</b>.
          </p>
        </div>
      )}

      {/* ---- calendario + panel de pendientes ---- */}
      <div className="fin__row">
        <div className="fin__cal-wrap">
          <div className="fin__cal-head">
            <span className="fin__cal-title">
              {MES_NOMBRE[month - 1].charAt(0).toUpperCase() +
                MES_NOMBRE[month - 1].slice(1)}{" "}
              {year}
            </span>
            {selectedInPeriod.length === 0 && (
              <span className="fin__cal-hint">
                sumá finales del panel para verlos en su mesa
              </span>
            )}
          </div>

          <div className="fin__cal-scroll">
            <div
              className="fin__agenda"
              role="grid"
              aria-label={`Calendario de mesas — ${MES_NOMBRE[month - 1]} ${year}`}
            >
              <div className="fin__ag-corner" />
              {DOW_ABBR.map((d) => (
                <div key={d} className="fin__ag-daylabel">
                  {d}
                </div>
              ))}
              {calendar.map((wk, wi) => (
                <FinalesWeek key={wi} week={wk} pisanCodes={pisanCodes} />
              ))}
            </div>
          </div>

          {/* editor de fechas de mesa (híbrido: oficial / manual / sin fecha) */}
          {editorRows.length > 0 && (
            <div className="fin__mesas">
              <div className="fin__mesas-head">
                <IconClock size={13} />
                <span>Fechas de mesa</span>
                <span className="fin__mesas-sub">
                  oficial autopoblada · manual editable · sin fecha a cargar
                </span>
              </div>
              <ul className="fin__mesas-list">
                {editorRows.map((r) => (
                  <li key={r.code} className="fin__mesa-row">
                    <span
                      className="fin__mesa-dot"
                      style={cvar("--c-color", r.color)}
                    />
                    <span className="fin__mesa-name">{r.nombre}</span>
                    {r.source === "none" ? (
                      <button
                        type="button"
                        className="fin__addfecha"
                        onClick={() =>
                          setMesa(r.code, {
                            fecha: isoOf(new Date(year, month - 1, 15)),
                            hora: "09:00",
                          })
                        }
                      >
                        <IconPlus size={12} /> agregar fecha
                      </button>
                    ) : r.source === "manual" ? (
                      <span className="fin__mesa-edit">
                        <input
                          type="date"
                          value={r.mesa!.fecha}
                          aria-label={`Fecha de mesa de ${r.nombre}`}
                          onChange={(e) =>
                            setMesa(r.code, {
                              fecha: e.target.value || r.mesa!.fecha,
                              hora: r.mesa!.hora,
                            })
                          }
                        />
                        <input
                          type="time"
                          value={r.mesa!.hora}
                          aria-label={`Hora de mesa de ${r.nombre}`}
                          onChange={(e) =>
                            setMesa(r.code, {
                              fecha: r.mesa!.fecha,
                              hora: e.target.value || r.mesa!.hora,
                            })
                          }
                        />
                        <span className="fin__badge is-manual">manual</span>
                        <button
                          type="button"
                          className="fin__mesa-clear"
                          aria-label={`Quitar la fecha manual de ${r.nombre}`}
                          title="Quitar fecha manual"
                          onClick={() => setMesa(r.code, null)}
                        >
                          <IconTrash size={12} />
                        </button>
                      </span>
                    ) : (
                      <span className="fin__mesa-edit">
                        <span className="fin__mesa-oficial">
                          {ddmm(r.mesa!.fecha)} · {r.mesa!.hora}
                        </span>
                        <span className="fin__badge is-oficial">oficial</span>
                        <button
                          type="button"
                          className="fin__mesa-clear"
                          aria-label={`Editar la fecha de ${r.nombre} (pasar a manual)`}
                          title="Editar (pasar a manual)"
                          onClick={() => setMesa(r.code, { ...r.mesa! })}
                        >
                          <IconPencil />
                        </button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {panelOpen && (
          <aside className="fin__side" aria-label="Finales pendientes">
            <div className="fin__side-head">
              <span className="fin__side-title">Finales pendientes</span>
              <span className="fin__side-count">
                {eligibles.length}
                {blocked.length > 0 ? ` + ${blocked.length} bloqueados` : ""}
              </span>
            </div>

            {rows.length === 0 ? (
              <p className="fin__side-empty">
                No hay finales pendientes. En la pestaña de materias aprobadas,
                marcá una cursada como <b>regular</b> (una tilde) y va a aparecer
                acá para combinarla.
              </p>
            ) : (
              <>
                <div
                  className="fin__group"
                  style={cvar("--tone", "var(--status-go)")}
                >
                  <div className="fin__group-head">
                    <span className="fin__g-dot" />
                    <span className="fin__group-title">
                      Se pueden rendir — {PERIODO_LABEL[periodo]}
                    </span>
                    <span className="fin__group-n">{eligibles.length}</span>
                  </div>
                  <ul className="fin__list">
                    {eligibles.map((r) => {
                      const pisa = wouldPisar(r) || pisanCodes.has(r.code);
                      const short = r.selected
                        ? "en el período"
                        : pisa
                          ? "se pisa"
                          : r.source === "manual"
                            ? "manual"
                            : r.source === "oficial"
                              ? "oficial"
                              : "sin fecha";
                      return (
                        <li key={r.code} className="fin__srow" tabIndex={0}>
                          <span
                            className="fin__fin-dot"
                            style={cvar("--c-color", r.color)}
                          />
                          <span className="fin__srow-name">{r.nombre}</span>
                          <span className="fin__srow-cr">{r.creditos} cr</span>
                          <span
                            className={
                              "fin__short" + (pisa && !r.selected ? " is-pisa" : "")
                            }
                          >
                            {short}
                          </span>
                          <button
                            type="button"
                            className="fin__toggle"
                            aria-pressed={r.selected}
                            aria-label={
                              r.selected
                                ? `${r.nombre}: en el período (quitar)`
                                : `${r.nombre}: agregar al período`
                            }
                            onClick={() => toggleSel(r.code)}
                          >
                            {r.selected ? (
                              <IconCheck size={11} />
                            ) : (
                              <IconPlus size={11} />
                            )}
                          </button>
                          <span className="fin__tip" role="note">
                            {r.mesa
                              ? `Mesa ${ddmm(r.mesa.fecha)} · ${r.mesa.hora}${r.source === "manual" ? " — fecha cargada a mano (editable)" : " (oficial)"}`
                              : "Sin mesa publicada — cargá la fecha en «Fechas de mesa»."}
                          </span>
                        </li>
                      );
                    })}
                    {eligibles.length === 0 && (
                      <li className="fin__srow-empty">
                        Todos tus finales pendientes están bloqueados por
                        correlativa.
                      </li>
                    )}
                  </ul>
                </div>

                {blocked.length > 0 && (
                  <div
                    className="fin__group is-muted"
                    style={cvar("--tone", "var(--status-caution)")}
                  >
                    <div className="fin__group-head">
                      <span className="fin__g-dot" />
                      <span className="fin__group-title">
                        Bloqueados por correlativa
                      </span>
                      <span className="fin__group-n">{blocked.length}</span>
                    </div>
                    <ul className="fin__list">
                      {blocked.map((r) => (
                        <li key={r.code} className="fin__srow" tabIndex={0}>
                          <span className="fin__lock" aria-hidden="true">
                            <IconLock size={13} strokeWidth={1.8} />
                          </span>
                          <span className="fin__srow-name is-muted">
                            {r.nombre}
                          </span>
                          <span className="fin__srow-cr">{r.creditos} cr</span>
                          <button
                            type="button"
                            className="fin__toggle"
                            disabled
                            aria-label={`${r.nombre}: bloqueado por correlativa de final`}
                          >
                            <IconPlus size={11} />
                          </button>
                          <span className="fin__tip" role="note">
                            Requiere el final de{" "}
                            {r.faltan.map(nombreDe).join(", ")} aprobado.
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="fin__side-note">
                  La tilde = en el período · el «+» agrega el final · el candado
                  marca las correlativas de final que todavía no rendiste.
                </p>
              </>
            )}
          </aside>
        )}
      </div>

      <p className="fin__foot">
        <IconInfo size={13} />
        <span>
          {conMesasReales
            ? "Mesas cargadas de la planilla oficial que subiste — verificá siempre con la cátedra. Las correlativas de final son un modelo de referencia."
            : "Datos de ejemplo — traé la planilla oficial arriba para autocompletar las fechas reales. Las correlativas de final son un modelo de referencia."}
        </span>
      </p>
    </section>
  );
}

/* ---- una semana del calendario (fila) ---- */
function FinalesWeek({
  week,
  pisanCodes,
}: {
  week: {
    label: string;
    hasExams: boolean;
    days: {
      iso: string;
      dayNum: number;
      inMonth: boolean;
      exams: FinalRow[];
    }[];
  };
  pisanCodes: Set<string>;
}) {
  return (
    <>
      <div className={"fin__ag-week" + (week.hasExams ? "" : " is-dim")}>
        {week.label}
      </div>
      {week.days.map((d, i) => {
        const conflictDay = d.exams.some((e) => pisanCodes.has(e.code));
        return (
          <div
            key={i}
            className={
              "fin__ag-day" +
              (!d.inMonth ? " is-out" : "") +
              (d.inMonth && !week.hasExams ? " is-dim" : "")
            }
          >
            {d.inMonth && <span className="fin__ag-num">{d.dayNum}</span>}
            {conflictDay && (
              <span className="fin__day-conflict">
                <IconAlert /> se pisan
              </span>
            )}
            {d.exams.map((e) => (
              <div
                key={e.code}
                className={
                  "fin__exam" + (pisanCodes.has(e.code) ? " is-conflict" : "")
                }
                style={cvar("--c-color", e.color)}
              >
                <span className="fin__exam-name">{e.nombre}</span>
                <span className="fin__exam-meta">
                  {e.mesa!.hora}
                  <span
                    className={
                      "fin__badge " +
                      (e.source === "manual" ? "is-manual" : "is-oficial")
                    }
                  >
                    {e.source === "manual" ? "manual" : "oficial"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/* ---- íconos locales que no están en icons.tsx ---- */
function IconAlert() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17.5h.01" />
    </svg>
  );
}
function IconPencil() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 5.5 18.5 10 8 20.5H3.5V16L14 5.5Z" />
      <path d="M13 6.5 17.5 11" />
    </svg>
  );
}
function IconGraduation() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
      <path d="M6.5 11v4.2c0 1.2 2.5 2.3 5.5 2.3s5.5-1.1 5.5-2.3V11" />
      <path d="M21.5 9v4.5" />
    </svg>
  );
}

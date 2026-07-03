"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Sheet, SheetEntry, SheetGroup } from "./types";
import { defaultKind, KIND_META, type EntryKind } from "./types";
import { Math, FitMath, RichText } from "./SheetMath";
import { toTex, toMd, downloadText } from "./exporters";
import { useUrlState, setOrDelete } from "@/lib/url-state/core";

/* ──────────────────────────────────────────────────────────────────────────
   SheetShell — chrome de una "hoja de estudio": toolbar (modo + export),
   panel de personalización (densidad, columnas, filtro de unidades y
   categorías) y el documento denso, color-coded e imprimible, separado por
   unidad. La personalización afecta a la vez la VISUALIZACIÓN, la IMPRESIÓN
   (window.print) y los EXPORTS (.tex / .md) — siempre se exporta "lo que ves".
   ────────────────────────────────────────────────────────────────────────── */

type Mode = "formulas" | "conceptos";
type Density = "compact" | "normal" | "wide" | "book";
type Cols = "auto" | "2" | "3" | "4";

interface Opts {
  density: Density;
  cols: Cols;
  hiddenUnits: string[];
  hiddenKinds: EntryKind[];
}
const DEFAULT_OPTS: Opts = {
  density: "normal",
  cols: "auto",
  hiddenUnits: [],
  hiddenKinds: [],
};
const OPTS_KEY = "sv-sheet-opts";

const MODE_LABEL: Record<Mode, string> = {
  formulas: "Fórmulas",
  conceptos: "Conceptos",
};
const DENSITY_LABEL: Record<Density, string> = {
  compact: "Compacta",
  normal: "Normal",
  wide: "Amplia",
  book: "Libro",
};
const KIND_ORDER: EntryKind[] = [
  "def",
  "theorem",
  "formula",
  "method",
  "caution",
  "example",
  "code",
];

/** Número de unidad para el encabezado: "2" → "02"; no numérico → tal cual. */
function unitNum(u: string): string {
  return /^\d+$/.test(u) ? u.padStart(2, "0") : u;
}

/** Columnas efectivas: override explícito o default por densidad y tipo. */
function colCount(opts: Opts, kind: Mode): number {
  if (opts.cols !== "auto") return Number(opts.cols);
  if (opts.density === "book") return 1; // lectura tipo libro: una columna
  if (kind === "formulas")
    return opts.density === "compact" ? 3 : 2;
  return opts.density === "compact" ? 4 : opts.density === "wide" ? 2 : 3;
}

/**
 * Rellena `subunit` con un código auto-derivado `${unit}.${pos}` para cada
 * sección que pertenece a una unidad y no lo trae explícito. Numeración por
 * posición dentro de la unidad (respeta un `subunit` ya escrito a mano).
 */
function deriveSubunits(sheet: Sheet): Sheet {
  const counters: Record<string, number> = {};
  const groups = sheet.groups.map((g) => {
    if (!g.unit) return g;
    counters[g.unit] = (counters[g.unit] ?? 0) + 1;
    if (g.subunit) return g;
    return { ...g, subunit: `${g.unit}.${counters[g.unit]}` };
  });
  return { ...sheet, groups };
}

/** Unidades presentes, en orden de aparición. */
function unitsOf(sheet: Sheet): { unit: string; title?: string }[] {
  const seen = new Map<string, string | undefined>();
  for (const g of sheet.groups)
    if (g.unit && !seen.has(g.unit)) seen.set(g.unit, g.unitTitle);
  return [...seen].map(([unit, title]) => ({ unit, title }));
}

export default function SheetShell({
  formulas,
  conceptos,
  intro,
  defaultDensity,
}: {
  formulas?: Sheet;
  conceptos?: Sheet;
  intro?: ReactNode;
  /** Densidad inicial cuando no hay preferencia guardada (ej. "book" en Proba). */
  defaultDensity?: Density;
}) {
  // Estable entre renders (solo depende de qué sheets llegan por props), para
  // que decode/encode del modo en la URL siempre vean el mismo `modes`.
  const modes = useMemo(
    () =>
      ([] as Mode[]).concat(
        formulas ? ["formulas"] : [],
        conceptos ? ["conceptos"] : [],
      ),
    [!!formulas, !!conceptos],
  );
  // Modo en la URL (?hoja=formulas|conceptos): recargar/compartir reproduce la
  // vista. Si la hoja tiene un solo modo, `?hoja` nunca se escribe (siempre
  // ese modo, sin ensuciar la URL) y un `?hoja` inválido/ajeno cae al default.
  const [mode, setMode] = useUrlState<Mode>({
    initial: modes[0],
    decode: (p) => {
      const m = p.get("hoja");
      return m && (modes as string[]).includes(m) ? (m as Mode) : modes[0];
    },
    encode: (v, p) => setOrDelete(p, "hoja", v, v !== modes[0]),
  });
  const rawSheet = mode === "formulas" ? formulas : conceptos;
  // Códigos de sub-unidad auto-derivados (2.1, 2.2, …) para que la hoja se lea
  // como un resumen con divisiones Unidad → Sub-unidad, sin duplicar el número
  // en cada módulo de datos. Se hace ANTES de filtrar para que la numeración sea
  // estable (ocultar categorías no renumera). Un `subunit` explícito gana.
  const sheet = useMemo(
    () => (rawSheet ? deriveSubunits(rawSheet) : undefined),
    [rawSheet],
  );

  // Persistencia per (vault,kind) bajo una sola key; hidratada post-mount.
  const [allOpts, setAllOpts] = useState<Record<string, Opts>>({});
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(OPTS_KEY);
      if (raw) setAllOpts(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(OPTS_KEY, JSON.stringify(allOpts));
      } catch {}
    }
  }, [allOpts, hydrated]);

  const base = sheet ? `${sheet.vault}-${sheet.kind}` : "";
  const baseDefault: Opts = defaultDensity
    ? { ...DEFAULT_OPTS, density: defaultDensity }
    : DEFAULT_OPTS;
  const opts = allOpts[base] ?? baseDefault;
  const setOpts = (fn: (o: Opts) => Opts) =>
    setAllOpts((prev) => ({ ...prev, [base]: fn(prev[base] ?? baseDefault) }));

  const units = useMemo(() => (sheet ? unitsOf(sheet) : []), [sheet]);
  const kinds = useMemo(() => (sheet ? usedKinds(sheet) : []), [sheet]);

  // Hoja efectiva (filtrada por unidad + categoría) — alimenta render y export.
  const visibleSheet = useMemo<Sheet | null>(() => {
    if (!sheet) return null;
    const hu = new Set(opts.hiddenUnits);
    const hk = new Set(opts.hiddenKinds);
    const groups: SheetGroup[] = [];
    for (const g of sheet.groups) {
      if (g.unit && hu.has(g.unit)) continue;
      const entries = g.entries.filter(
        (e) => !hk.has(e.kind ?? defaultKind(sheet.kind)),
      );
      if (entries.length) groups.push({ ...g, entries });
    }
    return { ...sheet, groups };
  }, [sheet, opts.hiddenUnits, opts.hiddenKinds]);

  if (!sheet || !visibleSheet) return null;

  const cols = colCount(opts, sheet.kind);
  const showTags = sheet.kind === "conceptos";

  return (
    <div className="sheet">
      {intro && <p className="sheet__intro">{intro}</p>}

      <div className="sheet-toolbar" data-noprint>
        {modes.length > 1 ? (
          <div className="sheet-seg" role="tablist" aria-label="Tipo de hoja">
            {modes.map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={m === mode}
                className={`sheet-seg__btn${m === mode ? " is-active" : ""}`}
                onClick={() => setMode(m)}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>
        ) : (
          <span className="sheet-seg__solo">{MODE_LABEL[mode]}</span>
        )}

        <div className="sheet-actions">
          <button
            className="sheet-btn sheet-btn--primary"
            onClick={() => window.print()}
          >
            <PrintIcon /> Imprimir / PDF
          </button>
          <button
            className="sheet-btn"
            onClick={() =>
              downloadText(`${base}.tex`, toTex(visibleSheet, cols), "text/x-tex")
            }
          >
            <DownIcon /> .tex
          </button>
          <button
            className="sheet-btn"
            onClick={() =>
              downloadText(`${base}.md`, toMd(visibleSheet), "text/markdown")
            }
          >
            <DownIcon /> .md
          </button>
        </div>
      </div>

      <Controls
        opts={opts}
        setOpts={setOpts}
        units={units}
        kinds={kinds}
      />

      <div className="sheet-print-root">
        <SheetDoc
          sheet={visibleSheet}
          showTags={showTags}
          density={opts.density}
          cols={cols}
        />
      </div>
    </div>
  );
}

/* ───────────────────────────── controles ──────────────────────────────── */

function Controls({
  opts,
  setOpts,
  units,
  kinds,
}: {
  opts: Opts;
  setOpts: (fn: (o: Opts) => Opts) => void;
  units: { unit: string; title?: string }[];
  kinds: EntryKind[];
}) {
  const toggle = (key: "hiddenUnits" | "hiddenKinds", v: string) =>
    setOpts((o) => {
      const set = new Set(o[key] as string[]);
      set.has(v) ? set.delete(v) : set.add(v);
      return { ...o, [key]: [...set] } as Opts;
    });

  const allUnitsOn = opts.hiddenUnits.length === 0;
  const allKindsOn = opts.hiddenKinds.length === 0;

  return (
    <div className="sheet-opts" data-noprint>
      <div className="sheet-opts__row">
        <span className="sheet-opts__label">Densidad</span>
        <div className="sheet-seg sheet-seg--sm">
          {(["compact", "normal", "wide", "book"] as Density[]).map((d) => (
            <button
              key={d}
              className={`sheet-seg__btn${opts.density === d ? " is-active" : ""}`}
              onClick={() => setOpts((o) => ({ ...o, density: d }))}
            >
              {DENSITY_LABEL[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="sheet-opts__row">
        <span className="sheet-opts__label">Columnas</span>
        <div className="sheet-seg sheet-seg--sm">
          {(["auto", "2", "3", "4"] as Cols[]).map((c) => (
            <button
              key={c}
              className={`sheet-seg__btn${opts.cols === c ? " is-active" : ""}`}
              onClick={() => setOpts((o) => ({ ...o, cols: c }))}
            >
              {c === "auto" ? "Auto" : c}
            </button>
          ))}
        </div>
      </div>

      {units.length > 0 && (
        <div className="sheet-opts__row">
          <span className="sheet-opts__label">Unidades</span>
          <div className="sheet-chips">
            <button
              className={`sheet-chip sheet-chip--all${allUnitsOn ? " is-active" : ""}`}
              onClick={() => setOpts((o) => ({ ...o, hiddenUnits: [] }))}
            >
              Todas
            </button>
            {units.map(({ unit, title }) => {
              const on = !opts.hiddenUnits.includes(unit);
              return (
                <button
                  key={unit}
                  className={`sheet-chip${on ? " is-active" : ""}`}
                  title={title ? `Unidad ${unit} · ${title}` : `Unidad ${unit}`}
                  aria-pressed={on}
                  onClick={() => toggle("hiddenUnits", unit)}
                >
                  U{unit}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {kinds.length > 1 && (
        <div className="sheet-opts__row">
          <span className="sheet-opts__label">Mostrar</span>
          <div className="sheet-chips">
            <button
              className={`sheet-chip sheet-chip--all${allKindsOn ? " is-active" : ""}`}
              onClick={() => setOpts((o) => ({ ...o, hiddenKinds: [] }))}
            >
              Todo
            </button>
            {kinds.map((k) => {
              const on = !opts.hiddenKinds.includes(k);
              return (
                <button
                  key={k}
                  className={`sheet-chip sheet-chip--kind${on ? " is-active" : ""}`}
                  data-kind={k}
                  aria-pressed={on}
                  onClick={() => toggle("hiddenKinds", k)}
                >
                  <i className="sheet-chip__dot" />
                  {KIND_META[k].label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── documento ──────────────────────────────── */

function SheetDoc({
  sheet,
  showTags,
  density,
  cols,
}: {
  sheet: Sheet;
  showTags: boolean;
  density: Density;
  cols: number;
}) {
  const hasUnits = sheet.groups.some((g) => g.unit);
  return (
    <article className="sheet-doc" data-kind={sheet.kind} data-density={density}>
      <header className="sheet-doc__head">
        <div>
          <h2 className="sheet-doc__title">{sheet.title}</h2>
          {sheet.subtitle && <p className="sheet-doc__sub">{sheet.subtitle}</p>}
        </div>
        <span className="sheet-doc__kind">
          {sheet.kind === "formulas" ? "Hoja de fórmulas" : "Hoja de conceptos"}
        </span>
      </header>

      {sheet.notation && (
        <p className="sheet-doc__notation">
          <b>Notación.</b> <RichText text={sheet.notation} />
        </p>
      )}

      {sheet.groups.length === 0 ? (
        <p className="sheet-doc__empty">
          Nada para mostrar con los filtros actuales.
        </p>
      ) : (
        <div
          className="sheet-doc__cols"
          style={{ ["--sheet-cols" as string]: String(cols) }}
        >
          {sheet.groups.map((g, gi) => {
            const prev = sheet.groups[gi - 1];
            const showUnit =
              hasUnits && g.unit && g.unit !== (prev ? prev.unit : undefined);
            return (
              <Fragment key={gi}>
                {showUnit && (
                  <header className="sheet-unit">
                    <span className="sheet-unit__num">{unitNum(g.unit!)}</span>
                    <div className="sheet-unit__titles">
                      <span className="sheet-unit__kicker">Unidad</span>
                      <h3 className="sheet-unit__title">
                        {g.unitTitle ?? `Unidad ${g.unit}`}
                      </h3>
                      {g.unitDesc && (
                        <p className="sheet-unit__desc">
                          <RichText text={g.unitDesc} />
                        </p>
                      )}
                    </div>
                  </header>
                )}
                <section className="sheet-group">
                  <div className="sheet-group__head">
                    {g.subunit && (
                      <span className="sheet-group__code">{g.subunit}</span>
                    )}
                    <h4 className="sheet-group__title">{g.title}</h4>
                  </div>
                  {g.hint && (
                    <p className="sheet-group__hint">
                      <RichText text={g.hint} />
                    </p>
                  )}
                  <div className="sheet-group__entries">
                    {g.entries.map((e, ei) => (
                      <Entry
                        key={ei}
                        entry={e}
                        sheetKind={sheet.kind}
                        showTag={showTags}
                      />
                    ))}
                  </div>
                </section>
              </Fragment>
            );
          })}
        </div>
      )}
    </article>
  );
}

function Entry({
  entry,
  sheetKind,
  showTag,
}: {
  entry: SheetEntry;
  sheetKind: Sheet["kind"];
  showTag: boolean;
}) {
  const kind = entry.kind ?? defaultKind(sheetKind);
  const hasInlineTex = entry.tex && entry.inline;
  return (
    <div className="sheet-entry" data-kind={kind}>
      <div className="sheet-entry__head">
        {showTag && (
          <span className="sheet-entry__tag">{KIND_META[kind].label}</span>
        )}
        <span className="sheet-entry__label">
          <RichText text={entry.label} />
        </span>
        {hasInlineTex && (
          <span className="sheet-entry__inline">
            <Math tex={entry.tex!} inline />
          </span>
        )}
      </div>
      {entry.tex && !entry.inline && (
        <div className="sheet-entry__tex">
          {/* wrapper interno sin padding: FitMath mide su clientWidth para el
              zoom-to-fit; el padding/tinte del recuadro van en el div externo. */}
          <div className="sheet-entry__tex-inner">
            <FitMath tex={entry.tex} />
          </div>
        </div>
      )}
      {entry.body && (
        <p className="sheet-entry__body">
          <RichText text={entry.body} />
        </p>
      )}
      {entry.code && (
        <div className="sheet-code-block">
          {(entry.code.file || entry.code.lang) && (
            <div className="sheet-code-block__bar">
              {entry.code.file && (
                <span className="sheet-code-block__file">{entry.code.file}</span>
              )}
              {entry.code.lang && (
                <span className="sheet-code-block__lang">{entry.code.lang}</span>
              )}
            </div>
          )}
          <pre className="sheet-code-block__pre">
            <code>{entry.code.text}</code>
          </pre>
        </div>
      )}
      {entry.figure && (
        <figure
          className="sheet-figure"
          aria-label={entry.figure.alt ?? entry.figure.caption ?? undefined}
        >
          {/* SVG estático e inline: seguro en static export (server render);
              usa currentColor + tokens de rol, así respeta tema e impresión. */}
          <div
            className="sheet-figure__svg"
            dangerouslySetInnerHTML={{ __html: entry.figure.svg }}
          />
          {entry.figure.caption && (
            <figcaption>
              <RichText text={entry.figure.caption} />
            </figcaption>
          )}
        </figure>
      )}
      {entry.vars && entry.vars.length > 0 && (
        <div className="sheet-entry__vars">
          <span className="sheet-entry__vars-cap">donde</span>
          <dl className="sheet-entry__vars-list">
            {entry.vars.map((v, vi) => (
              <Fragment key={vi}>
                <dt className="sheet-entry__var-sym">
                  <Math tex={v.sym} inline />
                </dt>
                <dd className="sheet-entry__var-desc">
                  <RichText text={v.desc} />
                </dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}
      {entry.cond && (
        <p className="sheet-entry__cond">
          <RichText text={entry.cond} />
        </p>
      )}
      {entry.note && (
        <p className="sheet-entry__note">
          <RichText text={entry.note} />
        </p>
      )}
    </div>
  );
}

/* ───────────────────────────── helpers ────────────────────────────────── */

function usedKinds(sheet: Sheet): EntryKind[] {
  const set = new Set<EntryKind>();
  for (const g of sheet.groups)
    for (const e of g.entries) set.add(e.kind ?? defaultKind(sheet.kind));
  return KIND_ORDER.filter((k) => set.has(k));
}

/* ───────────────────────────── iconos ─────────────────────────────────── */

const PrintIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </svg>
);

const DownIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

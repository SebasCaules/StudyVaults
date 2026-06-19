"use client";

import { useState, type ReactNode } from "react";
import type { Sheet, SheetEntry } from "./types";
import { defaultKind, KIND_META, type EntryKind } from "./types";
import { Math, RichText } from "./SheetMath";
import { toTex, toMd, downloadText } from "./exporters";

/* ──────────────────────────────────────────────────────────────────────────
   SheetShell — chrome de una "hoja de estudio": toolbar (toggle de modo +
   acciones de exportación) y el documento denso, color-coded e imprimible.
   Cada materia provee `formulas` y/o `conceptos`. La impresión usa CSS
   (@media print en sheets.css) para aislar solo `.sheet-print-root`.
   ────────────────────────────────────────────────────────────────────────── */

type Mode = "formulas" | "conceptos";

const MODE_LABEL: Record<Mode, string> = {
  formulas: "Fórmulas",
  conceptos: "Conceptos",
};

const KIND_ORDER: EntryKind[] = [
  "def",
  "theorem",
  "formula",
  "method",
  "caution",
  "example",
];

export default function SheetShell({
  formulas,
  conceptos,
  intro,
}: {
  formulas?: Sheet;
  conceptos?: Sheet;
  intro?: ReactNode;
}) {
  const modes = ([] as Mode[]).concat(
    formulas ? ["formulas"] : [],
    conceptos ? ["conceptos"] : [],
  );
  const [mode, setMode] = useState<Mode>(modes[0]);
  const sheet = mode === "formulas" ? formulas : conceptos;
  if (!sheet) return null;

  const base = `${sheet.vault}-${sheet.kind}`;
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
              downloadText(`${base}.tex`, toTex(sheet), "text/x-tex")
            }
          >
            <DownIcon /> .tex
          </button>
          <button
            className="sheet-btn"
            onClick={() =>
              downloadText(`${base}.md`, toMd(sheet), "text/markdown")
            }
          >
            <DownIcon /> .md
          </button>
        </div>
      </div>

      <Legend kinds={usedKinds(sheet)} />

      <div className="sheet-print-root">
        <SheetDoc sheet={sheet} showTags={showTags} />
      </div>
    </div>
  );
}

/* ───────────────────────────── documento ──────────────────────────────── */

function SheetDoc({ sheet, showTags }: { sheet: Sheet; showTags: boolean }) {
  return (
    <article className="sheet-doc" data-kind={sheet.kind}>
      <header className="sheet-doc__head">
        <div>
          <h2 className="sheet-doc__title">{sheet.title}</h2>
          {sheet.subtitle && (
            <p className="sheet-doc__sub">{sheet.subtitle}</p>
          )}
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

      <div className="sheet-doc__cols">
        {sheet.groups.map((g, gi) => (
          <section className="sheet-group" key={gi}>
            <h3 className="sheet-group__title">{g.title}</h3>
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
        ))}
      </div>
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
        <span className="sheet-entry__label">
          <RichText text={entry.label} />
        </span>
        {hasInlineTex && (
          <span className="sheet-entry__inline">
            <Math tex={entry.tex!} inline />
          </span>
        )}
        {showTag && (
          <span className="sheet-entry__tag">{KIND_META[kind].label}</span>
        )}
      </div>
      {entry.tex && !entry.inline && (
        <div className="sheet-entry__tex">
          <Math tex={entry.tex} />
        </div>
      )}
      {entry.body && (
        <p className="sheet-entry__body">
          <RichText text={entry.body} />
        </p>
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

/* ───────────────────────────── leyenda ────────────────────────────────── */

function usedKinds(sheet: Sheet): EntryKind[] {
  const set = new Set<EntryKind>();
  for (const g of sheet.groups)
    for (const e of g.entries) set.add(e.kind ?? defaultKind(sheet.kind));
  return KIND_ORDER.filter((k) => set.has(k));
}

function Legend({ kinds }: { kinds: EntryKind[] }) {
  if (kinds.length <= 1) return null;
  return (
    <div className="sheet-legend" data-noprint>
      <span className="sheet-legend__label">Color</span>
      {kinds.map((k) => (
        <span className="sheet-legend__item" data-kind={k} key={k}>
          <i className="sheet-legend__dot" />
          {KIND_META[k].label}
        </span>
      ))}
    </div>
  );
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

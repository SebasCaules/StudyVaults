"use client";

// Hub de exportar/importar del Plan de cursada. Reúne en un solo modal las dos
// cosas que antes vivían sueltas en el toolbar: (1) el DOCUMENTO del plan
// (HTML/PDF, para leer o imprimir) y (2) las PREFERENCIAS portables (.json con
// todo el estado, para llevar el plan a otro navegador). Reusa el chrome del
// modal de minors (.mnr-modal*) y portalea a `.planner` en <body> — el mismo
// patrón que MinorsModal, para escapar el transform de `.view-panel`.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalFocus } from "@/components/planner/useModalFocus";
import {
  IconClose,
  IconCheck,
  IconDownload,
  IconUpload,
  IconFileText,
  IconPrinter,
} from "@/components/planner/icons";

export interface IOCuatri {
  idx: number; // índice de cuatrimestre en el plan
  tag: string; // etiqueta corta ("2C 26")
  materias: number;
}

export default function IOModal({
  onClose,
  cuatris,
  onExportHTML,
  onExportPDF,
  onExportPrefs,
  onImportFile,
  prefsError,
}: {
  onClose: () => void;
  cuatris: IOCuatri[];
  onExportHTML: (cuatris: number[]) => void;
  onExportPDF: (cuatris: number[]) => void;
  onExportPrefs: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefsError: string | null;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  // foco accesible del modal: foco inicial en el panel + trap de Tab + restore
  const panelRef = useModalFocus<HTMLDivElement>();
  // selección de cuatrimestres a incluir en el documento (arranca con todos).
  const [sel, setSel] = useState<Set<number>>(
    () => new Set(cuatris.map((c) => c.idx)),
  );
  const allOn = cuatris.length > 0 && sel.size === cuatris.length;
  const toggle = (idx: number) =>
    setSel((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  const toggleAll = () =>
    setSel(allOn ? new Set() : new Set(cuatris.map((c) => c.idx)));
  const chosen = () => cuatris.map((c) => c.idx).filter((i) => sel.has(i));
  const nada = sel.size === 0;

  // cierre con Escape (igual que MinorsModal)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const modal = (
    <div
      className="mnr-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Exportar o importar el plan de cursada"
    >
      <div className="mnr-modal__bg" onClick={onClose} />
      {/* tabIndex=-1: fallback de foco inicial para useModalFocus */}
      <div className="mnr-modal__panel plan2-io" ref={panelRef} tabIndex={-1}>
        <button className="mnr-close" onClick={onClose} aria-label="Cerrar">
          <IconClose size={15} />
        </button>
        <header className="mnr-head">
          <span className="mnr-kick">Plan de cursada</span>
          <h3>Exportar o importar</h3>
          <p>
            Descargá tu plan para leerlo o imprimirlo, o guardá y restaurá tus
            preferencias entre navegadores.
          </p>
        </header>

        <div className="plan2-io__grid">
          <section className="plan2-io__card">
            <div className="plan2-io__cardtop">
              <span className="plan2-io__kick">Documento</span>
              <h4>Tu plan, listo para leer</h4>
              <p>
                Calendarios y, por cada materia, un resumen con los puntos clave
                y la evaluación. Elegí qué cuatrimestres incluir.
              </p>
            </div>

            {cuatris.length > 1 ? (
              <div className="plan2-io__pick">
                <div className="plan2-io__pickhead">
                  <span className="plan2-io__minilbl">Cuatrimestres</span>
                  <button
                    type="button"
                    className="plan2-io__all"
                    onClick={toggleAll}
                  >
                    {allOn ? "Ninguno" : "Todos"}
                  </button>
                </div>
                <div className="plan2-io__chips">
                  {cuatris.map((c) => {
                    const on = sel.has(c.idx);
                    return (
                      <button
                        type="button"
                        key={c.idx}
                        className={"plan2-io__chip" + (on ? " is-on" : "")}
                        aria-pressed={on}
                        onClick={() => toggle(c.idx)}
                      >
                        {on ? <IconCheck size={11} /> : null}
                        {c.tag}
                        <i>{c.materias}</i>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="plan2-io__acts">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                disabled={nada}
                onClick={() => onExportHTML(chosen())}
              >
                <IconFileText size={14} /> Exportar HTML
              </button>
              <button
                type="button"
                className="btn btn--go btn--sm"
                disabled={nada}
                onClick={() => onExportPDF(chosen())}
              >
                <IconPrinter size={14} /> Descargar PDF
              </button>
            </div>
          </section>

          <section className="plan2-io__card">
            <div className="plan2-io__cardtop">
              <span className="plan2-io__kick">Preferencias</span>
              <h4>Llevá tu plan a otro lado</h4>
              <p>
                Un archivo <b>.json</b> con todo tu estado: materias agregadas,
                topes por cuatrimestre, método, punto de partida y cuatrimestres
                fijados.
              </p>
            </div>
            <div className="plan2-io__acts">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={onExportPrefs}
              >
                <IconDownload size={14} /> Exportar .json
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => fileRef.current?.click()}
              >
                <IconUpload size={14} /> Importar .json
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={onImportFile}
              />
            </div>
            <p className="plan2-io__note">
              Importar reemplaza el plan actual en este navegador.
            </p>
            {prefsError && (
              <p className="plan2-io__err" role="alert">
                {prefsError}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="planner" style={{ padding: 0 }}>
      {modal}
    </div>,
    document.body,
  );
}

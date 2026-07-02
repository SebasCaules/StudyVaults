"use client";

// Hub de exportar/importar del Plan de cursada. Reúne en un solo modal las dos
// cosas que antes vivían sueltas en el toolbar: (1) el DOCUMENTO del plan
// (HTML/PDF, para leer o imprimir) y (2) las PREFERENCIAS portables (.json con
// todo el estado, para llevar el plan a otro navegador). Reusa el chrome del
// modal de minors (.mnr-modal*) y portalea a `.planner` en <body> — el mismo
// patrón que MinorsModal, para escapar el transform de `.view-panel`.
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  IconClose,
  IconDownload,
  IconUpload,
  IconFileText,
  IconPrinter,
} from "@/components/planner/icons";

export default function IOModal({
  onClose,
  onExportHTML,
  onExportPDF,
  onExportPrefs,
  onImportFile,
  prefsError,
}: {
  onClose: () => void;
  onExportHTML: () => void;
  onExportPDF: () => void;
  onExportPrefs: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefsError: string | null;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

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
      <div className="mnr-modal__panel plan2-io">
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
                Los calendarios, el roadmap y el detalle de cada cuatrimestre en
                una sola vista. Ideal para revisar o imprimir.
              </p>
            </div>
            <div className="plan2-io__acts">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={onExportHTML}
              >
                <IconFileText size={14} /> Exportar HTML
              </button>
              <button
                type="button"
                className="btn btn--go btn--sm"
                onClick={onExportPDF}
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

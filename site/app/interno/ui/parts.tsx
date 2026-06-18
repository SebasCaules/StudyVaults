import type { ReactNode } from "react";
import { SectionHeading, Panel } from "@studyvaults/ui";

/**
 * Demo — bloque de catálogo: encabezado (eyebrow + título + descripción)
 * sobre un "stage" (Panel) donde se muestran los especímenes. Ancla via id
 * para el índice lateral. Componente local del showcase.
 */
export function Demo({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: "88px", marginBottom: "44px" }}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={description} />
      <Panel style={{ marginTop: "20px" }}>{children}</Panel>
    </section>
  );
}

/**
 * Specimen — un espécimen etiquetado: una muestra del componente con un
 * caption mono arriba. Componente local del showcase.
 */
export function Specimen({
  label,
  children,
  grow,
}: {
  label: ReactNode;
  children: ReactNode;
  grow?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        alignContent: "start",
        flex: grow ? "1 1 240px" : "0 0 auto",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

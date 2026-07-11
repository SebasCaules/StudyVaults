"use client";

// Frontera de error a nivel de ruta: si un componente de la página lanza en
// runtime (p. ej. el grafo 3D al no poder crear el contexto WebGL), Next
// muestra esto en lugar de derribar la ventana entera. El layout raíz —con la
// navbar y el buscador— sigue montado, así que el estudiante nunca queda sin
// acceso a las materias.
import { useEffect } from "react";
import { Button, Icon } from "@studyvaults/ui";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "72px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "540px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "16px",
          }}
        >
          SYS // error de la página
        </p>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Algo se rompió al mostrar esta página.
        </h1>
        <p
          style={{
            marginTop: "14px",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
          }}
        >
          Fue el fallo de un componente, no de todo el sitio. Podés reintentar o
          recargar; el menú de arriba sigue disponible para ir a las materias, al
          buscador o al planificador.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "28px",
          }}
        >
          <Button variant="primary" onClick={() => unstable_retry()}>
            Reintentar
            <Icon name="arrowRight" size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
          >
            Recargar la página
          </Button>
          <Button variant="ghost" href="/">
            Volver al inicio
          </Button>
        </div>
      </div>
    </section>
  );
}

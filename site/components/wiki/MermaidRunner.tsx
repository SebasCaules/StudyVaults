"use client";

import { useEffect } from "react";

// Hidrata los <pre class="mermaid"> del contenido (solo páginas que los tienen
// pagan el import de mermaid). Re-renderiza al cambiar de tema.
export default function MermaidRunner() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll("pre.mermaid"),
    ) as HTMLElement[];
    if (!nodes.length) return;

    // guardar la definición original (textContent decodifica las entidades)
    const defs = nodes.map(
      (n) => n.getAttribute("data-def") ?? n.textContent ?? "",
    );
    nodes.forEach((n, i) => n.setAttribute("data-def", defs[i]));

    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mermaid: any = null;

    async function render() {
      if (!mermaid) mermaid = (await import("mermaid")).default;
      if (disposed) return;
      const dark =
        document.documentElement.getAttribute("data-theme") !== "light";
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "var(--font-body)",
      });
      nodes.forEach((n, i) => {
        n.removeAttribute("data-processed");
        n.textContent = defs[i];
      });
      try {
        await mermaid.run({ nodes });
      } catch {
        // si falla, queda el texto de la definición
      }
    }

    render();
    const onTheme = () => render();
    window.addEventListener("sv:themechange", onTheme);
    return () => {
      disposed = true;
      window.removeEventListener("sv:themechange", onTheme);
    };
  }, []);

  return null;
}

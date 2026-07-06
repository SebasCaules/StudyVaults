import type { VaultLibrary } from "../types";

// Biblioteca de Física 3 — el resumen maestro manuscrito de la cursada
// (electromagnetismo completo, color-codeado, con fórmulas encajonadas).
// El archivo vive en Fisica3/wiki/biblioteca/ y el build lo copia a
// public/vault-assets/fisica3/.

export const fisica3Library: VaultLibrary = {
  intro:
    "El material de referencia de la materia en PDF. La wiki transcribe y organiza este contenido por unidad; acá está el original entero para estudiar de corrido o imprimir.",
  folders: [
    {
      key: "resumen",
      label: "Resumen maestro",
      blurb:
        "El resumen manuscrito completo de la cursada — la fuente de la que sale toda la wiki.",
      items: [
        {
          title: "Las Sagradas Escrituras — resumen maestro de Física 3",
          file: "wiki/biblioteca/resumen-maestro-fisica-3.pdf",
          desc: "Electromagnetismo de punta a punta en 29 páginas color-codeadas: Coulomb, Gauss, potencial, circuitos, magnetismo, inducción, alterna y relatividad. Fórmulas clave encajonadas.",
          size: "27 MB",
        },
      ],
    },
  ],
};

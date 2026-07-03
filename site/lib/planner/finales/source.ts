// ============================================================================
// Fuentes de la planilla de finales — traer del link oficial o leer un archivo
// ----------------------------------------------------------------------------
// La parte con I/O del parser (el parseo puro vive en `parseFinales.ts`).
//
// El link oficial es un Google Sheet "Publicado en la web". Su endpoint
// `.../pub?output=csv` responde con CORS abierto (`access-control-allow-origin`
// hace echo de cualquier origen en el redirect y `*` en el CSV final), así que
// se puede traer con `fetch()` directo desde el sitio estático en GitHub Pages
// (verificado para localhost y sebascaules.github.io). El archivo subido es el
// fallback: sirve para una planilla propia o si el link está caído.
// ============================================================================

/**
 * Endpoint CSV de la planilla oficial (Publicación en la web del Google Sheet
 * de la cátedra). Cambiá esta constante si la cátedra publica un sheet nuevo;
 * el `.../pub?output=csv` sale de "Archivo → Compartir → Publicar en la web".
 */
export const FINALES_PUB_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR_F2CRhZIjlHOmBZTtH5CUPpYmwotZB66Kjy51Gf0p36SajvubFIqIjwJpelaH0te5ANEPQlVteMM/pub?output=csv";

/** Link legible (pubhtml) para que el usuario abra la planilla en el navegador. */
export const FINALES_PUB_HTML_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR_F2CRhZIjlHOmBZTtH5CUPpYmwotZB66Kjy51Gf0p36SajvubFIqIjwJpelaH0te5ANEPQlVteMM/pubhtml";

/**
 * Trae el CSV de la planilla oficial (o de otra URL `pub?output=csv`). Corre
 * en el cliente (usa `fetch`). Lanza un error legible si la red falla o el
 * servidor no responde 2xx.
 */
export async function fetchFinalesCsv(
  url: string = FINALES_PUB_CSV_URL,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, { redirect: "follow", cache: "no-store" });
  } catch (e) {
    throw new Error(
      "No se pudo conectar con la planilla. Revisá tu conexión o subí el CSV a mano. " +
        (e instanceof Error ? e.message : ""),
    );
  }
  if (!res.ok) {
    throw new Error(`La planilla respondió ${res.status}. Probá subir el CSV a mano.`);
  }
  const text = await res.text();
  if (looksLikeHtml(text)) {
    throw new Error(
      "El link no devolvió un CSV (parece una página HTML). Verificá que sea el enlace de «Publicar en la web» en formato CSV.",
    );
  }
  return text;
}

/**
 * Lee un archivo subido como texto UTF-8. Acepta `.csv` (o texto pegado). Los
 * `.xlsx` son un ZIP binario y NO se parsean acá: se detectan y se rechaza con
 * un mensaje que pide bajar la planilla como CSV (Google Sheets → Archivo →
 * Descargar → CSV), evitando arrastrar una dependencia pesada tipo SheetJS.
 */
export function readFinalesFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const nombre = file.name.toLowerCase();
    if (/\.(xlsx|xls|ods)$/.test(nombre)) {
      reject(
        new Error(
          "Los archivos de Excel (.xlsx) no se leen directamente. En Google Sheets usá «Archivo → Descargar → Valores separados por comas (.csv)» y subí ese archivo.",
        ),
      );
      return;
    }
    if (typeof FileReader === "undefined") {
      reject(new Error("Tu navegador no permite leer archivos."));
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const text = String(fr.result ?? "");
      // .xlsx renombrado a .csv → arranca con la firma ZIP "PK".
      if (text.startsWith("PK")) {
        reject(
          new Error(
            "El archivo parece un Excel (.xlsx) con otra extensión. Descargalo como CSV desde Google Sheets y subí ese.",
          ),
        );
        return;
      }
      resolve(text);
    };
    fr.onerror = () =>
      reject(fr.error ?? new Error("No se pudo leer el archivo."));
    fr.readAsText(file, "utf-8");
  });
}

/** Heurística mínima: ¿el texto es una página HTML en vez de un CSV? */
function looksLikeHtml(text: string): boolean {
  const head = text.slice(0, 200).trimStart().toLowerCase();
  return head.startsWith("<!doctype html") || head.startsWith("<html");
}

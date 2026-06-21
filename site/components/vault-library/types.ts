// Contrato de la "biblioteca" de PDFs por materia (la ruta /[vault]/biblioteca):
// una vista tipo Drive — carpetas con archivos descargables/visualizables.
// Los PDFs viven en <Vault>/wiki/... y el build los copia a
// public/vault-assets/<vault>/<file> (ver scripts/copy-assets.mjs, que ahora
// incluye .pdf). El campo `file` es la ruta relativa al dir del vault — la
// misma que preserva copy-assets — y el componente la sirve con withBase().

export interface LibraryItem {
  /** Nombre legible que se muestra en la card. */
  title: string;
  /** Ruta del PDF relativa al dir del vault (= relPath en public/vault-assets/<vault>/). */
  file: string;
  /** Una línea en lenguaje llano: qué es y para qué sirve. */
  desc?: string;
  /** Tamaño legible para mostrar (ej. "400 KB"). */
  size?: string;
}

export interface LibraryFolder {
  /** id estable (slug corto). */
  key: string;
  /** Título de la carpeta. */
  label: string;
  /** Una línea opcional bajo el título de la carpeta. */
  blurb?: string;
  items: LibraryItem[];
}

export interface VaultLibrary {
  /** Intro opcional arriba de todo. */
  intro?: string;
  folders: LibraryFolder[];
}

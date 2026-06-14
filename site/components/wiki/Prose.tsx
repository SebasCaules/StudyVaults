// Renderiza el HTML ya procesado del markdown. Contenido first-party (confiable).
export default function Prose({ html }: { html: string }) {
  return (
    <div
      className="prose-sv"
      data-pagefind-body
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

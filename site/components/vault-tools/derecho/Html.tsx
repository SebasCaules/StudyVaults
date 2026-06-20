// Render de los fragmentos HTML estáticos generados por
// scripts/build-derecho-data.mjs (teoría, conceptos, respuestas). El contenido
// es nuestro y se genera de fuentes propias del vault → safe para innerHTML.
export function Html({
  html,
  as: Tag = "div",
  className,
}: {
  html: string;
  as?: "div" | "span" | "td";
  className?: string;
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

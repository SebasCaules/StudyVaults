import Footer from "./Footer";

// El footer del portal se muestra en TODAS las rutas (el layout lo monta fuera
// de <main>). Incluye /electivas (la pseudo-landing) y /electivas/planificar/
// (la app): ambas son de flujo normal y scrolleables, así que el footer cierra
// la página al final sin taparse. El header (Navbar) también está siempre, en
// el layout raíz. No hay ruta que lo oculte — de ahí que no haya condición.
export default function ConditionalFooter() {
  return <Footer />;
}

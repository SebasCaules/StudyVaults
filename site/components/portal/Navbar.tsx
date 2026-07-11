import { Navbar, type NavbarLink } from "@studyvaults/ui";
import { VAULTS } from "@/lib/content/vaults";

// Configuración StudyVaults de la <Navbar> del sistema de diseño.
// La barra genérica (comportamiento, mobile, scroll-spy, búsqueda, tema)
// vive en @studyvaults/ui; acá sólo se inyecta el contenido del sitio.
const LINKS: NavbarLink[] = [
  { label: "Inicio", href: "/" },
  // "Materias" apunta a la sección in-page de la home, pero queda activa en
  // cualquier ruta de vault (/[vault]/… — wiki, hojas, herramientas, biblioteca).
  {
    label: "Materias",
    href: "/#materias",
    matchPrefixes: VAULTS.map((v) => `/${v.id}/`),
  },
  { label: "Electivas", href: "/electivas/" },
];

export default function AppNavbar() {
  return (
    <Navbar
      links={LINKS}
      meta={
        <>
          SYS.00 // <b>ITBA</b> · {VAULTS.length} vaults
        </>
      }
      cta={{ label: "Planificar", href: "/electivas/planificar/" }}
    />
  );
}

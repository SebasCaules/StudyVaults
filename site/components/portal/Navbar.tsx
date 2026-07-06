import { Navbar, type NavbarLink } from "@studyvaults/ui";
import { REPO_URL, VAULTS } from "@/lib/content/vaults";

// Configuración StudyVaults de la <Navbar> del sistema de diseño.
// La barra genérica (comportamiento, mobile, scroll-spy, búsqueda, tema)
// vive en @studyvaults/ui; acá sólo se inyecta el contenido del sitio.
const LINKS: NavbarLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Materias", href: "/#materias" },
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
      cta={{ label: "GitHub", href: REPO_URL, external: true }}
    />
  );
}

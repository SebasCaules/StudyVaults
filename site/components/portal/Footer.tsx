import { Footer, type FooterColumn } from "@studyvaults/ui";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";

// Configuración StudyVaults del <Footer> del sistema de diseño.
const COLUMNS: FooterColumn[] = [
  {
    title: "Materias",
    links: VAULTS.map((v) => ({ label: v.short, href: `/${v.id}/` })),
  },
  {
    title: "Recursos",
    links: [
      { label: "Planificador de electivas", href: "/electivas/planificar/" },
      { label: "Repositorio en GitHub", href: REPO_URL, external: true },
      { label: "Obsidian", href: "https://obsidian.md/", external: true },
    ],
  },
];

export default function AppFooter() {
  return (
    <Footer
      description={
        <p>
          Materias del ITBA destiladas en un wiki navegable, más un planificador
          de electivas. Material de estudio personal.
        </p>
      }
      columns={COLUMNS}
      bottom={
        <>
          <span>
            SYS.00 // <b>StudyVaults ITBA</b>
          </span>
          <span>No es material oficial de la cátedra</span>
        </>
      }
    />
  );
}

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
      { label: "Planificador de electivas", href: "/electivas/" },
      { label: "Repositorio en GitHub", href: REPO_URL, external: true },
      { label: "Obsidian", href: "https://obsidian.md/", external: true },
    ],
  },
];

export default function AppFooter() {
  return (
    <Footer
      description="Bases de conocimiento de materias del ITBA, destiladas en un wiki navegable. Material de estudio personal, con fines académicos."
      columns={COLUMNS}
      bottom={
        <>
          <span>
            SYS.00 // <b>StudyVaults ITBA</b> — 7 vaults
          </span>
          <span>
            Apuntes de un estudiante · no es material oficial de la cátedra
          </span>
        </>
      }
    />
  );
}

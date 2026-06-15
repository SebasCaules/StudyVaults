import Link from "next/link";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Link className="brand" href="/" aria-label="StudyVaults — inicio">
            <BrandMark />
            <span className="brand__name">
              Study<b>Vaults</b>
            </span>
          </Link>
          <p>
            Bases de conocimiento de materias del ITBA, destiladas en un wiki
            navegable. Material de estudio personal, con fines académicos.
          </p>
        </div>

        <div className="footer__col">
          <h4>Materias</h4>
          {VAULTS.map((v) => (
            <Link key={v.id} href={`/${v.id}/`}>
              {v.short}
            </Link>
          ))}
        </div>

        <div className="footer__col">
          <h4>Recursos</h4>
          <a href={withBase("/electivas/")}>Planificador de electivas</a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            Repositorio en GitHub
          </a>
          <a
            href="https://obsidian.md/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Obsidian
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          SYS.00 // <b>StudyVaults ITBA</b> — 7 vaults
        </span>
        <span>Apuntes de un estudiante · no es material oficial de la cátedra</span>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { VAULTS, REPO_URL } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Link className="brand" href="/" aria-label="StudyVaults — inicio">
            <svg
              className="brand__mark"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="1.25"
                y="1.25"
                width="29.5"
                height="29.5"
                rx="7"
                stroke="#F47C59"
                strokeWidth="1.5"
              />
              <path
                d="M8 22V10l8 5 8-5v12"
                stroke="#92CFF2"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <circle cx="16" cy="15" r="2.1" fill="#F47C59" />
            </svg>
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

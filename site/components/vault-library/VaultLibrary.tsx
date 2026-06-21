import type { VaultId } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";
import type { VaultLibrary as VaultLibraryData } from "./types";

// Vista "drive" de los PDFs de una materia: carpetas (secciones) con archivos
// como cards. Server component — sin estado; cada card es un <a> al PDF estático
// en public/vault-assets/<vault>/<file>, que abre en pestaña nueva.

const PdfIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3v5h5" />
    <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-4-5Z" />
    <path d="M8.5 13.5h1a1 1 0 0 1 0 2h-1v-2Zm0 0v3.5M13 13.5v4M13 13.5h1.4M13 15.5h1.2M16.6 13.5v4" />
  </svg>
);

const FolderIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);

export default function VaultLibrary({
  vault,
  lib,
}: {
  vault: VaultId;
  lib: VaultLibraryData;
}) {
  const total = lib.folders.reduce((n, f) => n + f.items.length, 0);

  return (
    <div className="lib">
      {lib.intro && <p className="lib__intro">{lib.intro}</p>}

      <div className="lib__deck">
        {lib.folders.map((folder) => (
          <section className="lib__folder" key={folder.key} aria-label={folder.label}>
            <header className="lib__folder-head">
              <span className="lib__folder-ico" aria-hidden="true">
                {FolderIcon}
              </span>
              <div className="lib__folder-meta">
                <h3 className="lib__folder-name">{folder.label}</h3>
                {folder.blurb && <p className="lib__folder-blurb">{folder.blurb}</p>}
              </div>
              <span className="lib__folder-count">
                {String(folder.items.length).padStart(2, "0")}
              </span>
            </header>

            <ul className="lib__grid">
              {folder.items.map((item) => (
                <li key={item.file}>
                  <a
                    className="lib__file"
                    href={withBase(`/vault-assets/${vault}/${item.file}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="lib__file-ico" aria-hidden="true">
                      {PdfIcon}
                    </span>
                    <span className="lib__file-body">
                      <span className="lib__file-title">{item.title}</span>
                      {item.desc && <span className="lib__file-desc">{item.desc}</span>}
                    </span>
                    <span className="lib__file-meta">
                      <span className="lib__file-ext">PDF</span>
                      {item.size && <span className="lib__file-size">{item.size}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="lib__foot">
        {total} archivos · {lib.folders.length} carpetas
      </p>
    </div>
  );
}

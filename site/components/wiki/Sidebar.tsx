import Link from "next/link";
import type { NavSection } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";

export default function Sidebar({
  vault,
  sections,
  currentHref,
}: {
  vault: string;
  sections: NavSection[];
  currentHref: string;
}) {
  const cfg = getVault(vault);
  return (
    <nav className="wikinav" aria-label="Navegación de la materia">
      <Link
        href={`/${vault}/`}
        className={`wikinav__home${
          currentHref === `/${vault}/` ? " is-active" : ""
        }`}
      >
        {cfg?.short ?? vault} · índice
      </Link>
      {sections.map((s) => (
        <div className="wikinav__sec" key={s.key}>
          <p className="wikinav__sectitle">{s.label}</p>
          <ul>
            {s.items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`wikinav__link${
                    it.href === currentHref ? " is-active" : ""
                  }`}
                >
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

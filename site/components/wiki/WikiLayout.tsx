import type { ReactNode } from "react";
import type { NavSection } from "@/lib/content/nav-tree";
import type { TocItem } from "@/lib/content/render";
import Sidebar from "./Sidebar";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";

export default function WikiLayout({
  vault,
  sections,
  currentHref,
  breadcrumbs,
  toc,
  children,
}: {
  vault: string;
  sections: NavSection[];
  currentHref: string;
  breadcrumbs: Crumb[];
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <div className="wiki container">
      <details className="wiki__side" open>
        <summary className="wiki__side-toggle">Navegar la materia</summary>
        <Sidebar
          vault={vault}
          sections={sections}
          currentHref={currentHref}
        />
      </details>

      <div className="wiki__main">
        <Breadcrumbs items={breadcrumbs} />
        {children}
      </div>

      <div className="wiki__toc">
        <TableOfContents items={toc} />
      </div>
    </div>
  );
}

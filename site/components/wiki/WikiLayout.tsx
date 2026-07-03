import type { ReactNode } from "react";
import "./wiki-nav.css";
import type { NavSection } from "@/lib/content/nav-tree";
import type { TocItem } from "@/lib/content/render";
import { Breadcrumbs, type Crumb } from "@studyvaults/ui";
import Sidebar from "./Sidebar";
import TableOfContents from "./TableOfContents";
import MermaidRunner from "./MermaidRunner";
import WikiRail from "./WikiRail";

export default function WikiLayout({
  vault,
  sections,
  currentHref,
  breadcrumbs,
  toc,
  wide = false,
  children,
}: {
  vault: string;
  sections: NavSection[];
  currentHref: string;
  breadcrumbs: Crumb[];
  toc: TocItem[];
  wide?: boolean;
  children: ReactNode;
}) {
  const hasToc = toc.length > 0;
  return (
    <div
      className="wiki"
      data-vault={vault}
      data-toc={hasToc ? "1" : "0"}
      data-wide={wide ? "1" : undefined}
    >
      <WikiRail side="left" storageKey="sv-rail-l" label="Navegación">
        <Sidebar vault={vault} sections={sections} currentHref={currentHref} />
      </WikiRail>

      <div className="wiki__main">
        <div className="wiki__inner">
          <Breadcrumbs items={breadcrumbs} />
          {children}
        </div>
      </div>

      {hasToc && (
        <WikiRail side="right" storageKey="sv-rail-r" label="En esta página">
          <TableOfContents items={toc} />
        </WikiRail>
      )}

      <MermaidRunner />
    </div>
  );
}

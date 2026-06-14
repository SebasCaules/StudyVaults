import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Migas de pan">
      {items.map((c, i) => (
        <span key={i} className="crumbs__item">
          {c.href ? (
            <Link href={c.href}>{c.label}</Link>
          ) : (
            <span aria-current="page">{c.label}</span>
          )}
          {i < items.length - 1 && <span className="crumbs__sep">/</span>}
        </span>
      ))}
    </nav>
  );
}

import type { TocItem } from "@/lib/content/render";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <aside className="toc" aria-label="En esta página">
      <p className="toc__title">En esta página</p>
      <ul>
        {items.map((it) => (
          <li
            key={it.id}
            className={it.depth === 3 ? "toc__item toc__item--sub" : "toc__item"}
          >
            <a href={`#${it.id}`}>{it.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

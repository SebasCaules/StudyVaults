"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/content/slug";

interface Result {
  url: string;
  title: string;
  excerpt: string;
  materia?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pagefind = any;

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState<boolean | null>(null); // null=sin cargar
  const pfRef = useRef<Pagefind | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // abrir con cmd/ctrl+K o evento; cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("sv:search-open", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("sv:search-open", onOpen);
    };
  }, []);

  const loadPagefind = useCallback(async () => {
    if (pfRef.current) return pfRef.current;
    try {
      const url = withBase("/pagefind/pagefind.js");
      const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url);
      await mod.options?.({ excerptLength: 18 });
      pfRef.current = mod;
      setReady(true);
      return mod;
    } catch {
      setReady(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadPagefind();
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open, loadPagefind]);

  // búsqueda con debounce
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const pf = await loadPagefind();
      if (!pf || cancelled) return;
      const search = await pf.search(q);
      const data = await Promise.all(
        search.results.slice(0, 8).map((r: Pagefind) => r.data()),
      );
      if (cancelled) return;
      setResults(
        data.map((d: Pagefind) => ({
          url: d.url,
          title: d.meta?.title || "Sin título",
          excerpt: d.excerpt || "",
          materia: d.filters?.materia?.[0],
        })),
      );
    }, 160);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, open, loadPagefind]);

  if (!open) return null;

  return (
    <div
      className="search-overlay"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar"
    >
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="Buscar en las 7 materias…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="search-esc">ESC</kbd>
        </div>
        <div className="search-results">
          {query.trim() && results.length === 0 && ready !== false && (
            <p className="search-empty">Sin resultados para “{query}”.</p>
          )}
          {ready === false && (
            <p className="search-empty">
              El índice de búsqueda solo está disponible en el sitio publicado.
            </p>
          )}
          {results.map((r) => (
            <a key={r.url} className="search-result" href={withBase(r.url)}>
              <span className="search-result__title">
                {r.title}
                {r.materia && (
                  <span className="search-result__tag">{r.materia}</span>
                )}
              </span>
              <span
                className="search-result__excerpt"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

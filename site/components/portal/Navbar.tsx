"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import BrandMark from "./BrandMark";
import { REPO_URL } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

const LINKS: { label: string; href: string; raw?: boolean }[] = [
  { label: "Inicio", href: "/" },
  { label: "Materias", href: "/#materias" },
  { label: "Electivas", href: "/electivas/" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Sección in-page actualmente a la vista (solo aplica en la home, p. ej. "materias").
  const [section, setSection] = useState("");

  // Cerrar el menú al cambiar de ruta o con Escape.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Scroll-spy: solo la home tiene anclas in-page (#materias). El indicador
  // sigue a la sección que cruza el centro del viewport, en lugar de quedar fijo.
  useEffect(() => {
    if (pathname !== "/") {
      setSection("");
      return;
    }
    const el = document.getElementById("materias");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSection(entry.isIntersecting ? "materias" : ""),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    const [base, anchor] = href.split("#");
    // Anclas in-page (p. ej. "/#materias"): activas solo mientras su sección
    // está a la vista en la home — nunca de forma permanente.
    if (anchor) return pathname === (base || "/") && section === anchor;
    // "Inicio" cede el estado activo cuando hay una sección in-page a la vista.
    if (base === "/") return pathname === "/" && section === "";
    return pathname.startsWith(base);
  };

  return (
    <header className="nav" role="banner">
      <div className="nav__inner">
        <Link className="brand" href="/" aria-label="StudyVaults — inicio">
          <BrandMark />
          <span className="brand__name">
            Study<b>Vaults</b>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Principal">
          {LINKS.map((l) =>
            l.raw ? (
              <a key={l.href} className="nav__link" href={withBase(l.href)}>
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                className={`nav__link${isActive(l.href) ? " is-active" : ""}`}
                href={l.href}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <span className="nav__spacer" />
        <span className="nav__meta">
          SYS.00 // <b>ITBA</b> · 7 vaults
        </span>
        <a
          className="btn btn--primary nav__cta"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <button
          type="button"
          className="theme-toggle theme-toggle--desktop"
          aria-label="Buscar (⌘K)"
          title="Buscar (⌘K)"
          onClick={() => window.dispatchEvent(new Event("sv:search-open"))}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        <ThemeToggle variant="desktop" />

        <button
          className="nav__burger"
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="ico-open"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg
            className="ico-close"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div
        className={`nav__mobile${open ? " is-open" : ""}`}
        id="mobileMenu"
      >
        {LINKS.map((l) =>
          l.raw ? (
            <a
              key={l.href}
              className="nav__link"
              href={withBase(l.href)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              className="nav__link"
              href={l.href}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ),
        )}
        <button
          type="button"
          className="nav__link"
          style={{ textAlign: "left", background: "none", border: "none" }}
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event("sv:search-open"));
          }}
        >
          Buscar
        </button>
        <ThemeToggle variant="mobile" />
        <a
          className="btn btn--primary"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

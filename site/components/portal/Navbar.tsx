"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import BrandMark from "./BrandMark";
import { REPO_URL } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

// `raw` → la app de Electivas es un asset estático, no una ruta del app router.
const LINKS: { label: string; href: string; raw?: boolean }[] = [
  { label: "Inicio", href: "/" },
  { label: "Materias", href: "/#materias" },
  { label: "Electivas", href: "/electivas/", raw: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

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

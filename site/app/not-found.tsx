import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-40 text-center">
      <p className="eyebrow">ERROR 404 // ruta no encontrada</p>
      <h1 className="mt-6 font-display text-6xl text-ink">Esta página no existe.</h1>
      <p className="mt-5 max-w-md font-body text-lg leading-8 text-ink-dim">
        El enlace puede estar roto o la nota no forma parte de los vaults
        publicados.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link className="btn btn--primary" href="/">
          Volver al inicio
        </Link>
        <Link className="btn btn--ghost" href="/mna/">
          Ver una materia
        </Link>
      </div>
    </section>
  );
}

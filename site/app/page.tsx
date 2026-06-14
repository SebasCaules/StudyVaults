export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-text)]">
        SYS.00 // StudyVaults ITBA
      </p>
      <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.04] text-ink sm:text-6xl">
        Apuntes de la carrera, <span className="text-accent">destilados</span> en
        un wiki navegable.
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg leading-8 text-ink-dim">
        Portal en construcción. Siete materias del ITBA como base de
        conocimiento, más un planificador de electivas.
      </p>
      <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
        Build · fase 0 — scaffolding
      </p>
    </main>
  );
}

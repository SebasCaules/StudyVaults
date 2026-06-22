// Explica el modelo mental de estas wikis en la landing de cada materia:
// no son un PDF ni un drive, sino apuntes destilados en notas chicas y
// enlazadas que se navegan por índice y búsqueda. Server component — sin
// estado. El DOM/clases (vl-how*, vl-sec__*) los estiliza el overseer.

const NoteIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h7l5 5v13a0 0 0 0 1 0 0H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M13 3v5h5" />
    <path d="M9 13h6M9 16h4" />
  </svg>
);

const GraphIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="2.4" />
    <circle cx="18" cy="8" r="2.4" />
    <circle cx="9" cy="18" r="2.4" />
    <path d="M8 7.4 16 7M7.4 8 8.4 15.6M10.8 16.4 16 9.8" />
  </svg>
);

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

export default function WikiExplainer({
  lang,
  pages,
  sections,
}: {
  lang: "es" | "en";
  pages: number; // cantidad de páginas/notas de la materia
  sections: number; // cantidad de secciones del índice lateral
}) {
  const en = lang === "en";

  const t = en
    ? {
        aria: "How this wiki works",
        kicker: "guide // the wiki",
        title: "How this wiki is built",
        lead: `Not a PDF and not a shared drive: these are the notes, distilled. Every topic is a small, self-contained page, and the ${pages} of them link to each other so you read by following ideas, not by scrolling files.`,
        cards: [
          {
            icon: NoteIcon,
            name: "Atomic notes",
            desc: `Each topic is one short page — definition, then development, then worked examples. ${pages} of them, each readable on its own, so you grab exactly the idea you need.`,
          },
          {
            icon: GraphIcon,
            name: "Everything linked",
            desc: "Notes reference each other with wikilinks, weaving the whole subject into one graph. Land on any page and the related concepts are one click away.",
          },
          {
            icon: SearchIcon,
            name: "Search and navigate",
            desc: `A side index splits the subject into ${sections} sections, and ⌘K opens an instant, offline search. Jump anywhere by name in a second.`,
          },
        ],
      }
    : {
        aria: "Cómo funciona esta wiki",
        kicker: "guía // la wiki",
        title: "Cómo está armada esta wiki",
        lead: `No es un PDF ni un drive compartido: son los apuntes, destilados. Cada tema es una página chica y autocontenida, y las ${pages} se enlazan entre sí, así que leés siguiendo ideas en vez de scrollear archivos.`,
        cards: [
          {
            icon: NoteIcon,
            name: "Notas atómicas",
            desc: `Cada tema es una página corta — definición, después desarrollo, después ejemplos resueltos. ${pages} en total, cada una se entiende sola, así que agarrás justo la idea que buscás.`,
          },
          {
            icon: GraphIcon,
            name: "Todo enlazado",
            desc: "Las notas se referencian entre sí con wikilinks y tejen toda la materia en un solo grafo. Caés en cualquier página y los conceptos relacionados quedan a un clic.",
          },
          {
            icon: SearchIcon,
            name: "Buscá y navegá",
            desc: `El índice lateral divide la materia en ${sections} secciones, y ⌘K abre una búsqueda instantánea y offline. Saltás a cualquier tema por nombre en un segundo.`,
          },
        ],
      };

  return (
    <section className="vl-how" aria-label={t.aria}>
      <header className="vl-sec__head">
        <span className="vl-sec__kicker">{t.kicker}</span>
        <h2 className="vl-sec__title">{t.title}</h2>
        <p className="vl-sec__lead">{t.lead}</p>
      </header>
      <div className="vl-how__grid">
        {t.cards.map((card) => (
          <article className="vl-how__card" key={card.name}>
            <span className="vl-how__ico" aria-hidden="true">
              {card.icon}
            </span>
            <h3 className="vl-how__name">{card.name}</h3>
            <p className="vl-how__desc">{card.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

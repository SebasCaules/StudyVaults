import type { VaultLibrary } from "../types";

// Biblioteca de PDFs de Ingeniería del Software II — material de estudio
// imprimible de la materia, organizado tipo carpetas. Los archivos viven en
// Inge2/wiki/biblioteca/** (+ el cheat-sheet en wiki/analyses/) y el build los
// copia a public/vault-assets/inge2/<file>. Curado a propósito: se excluyen
// los decks de clase del profesor, papers de terceros (Twitter/QCon, OEI) y el
// material de alumnos — solo apuntes, enunciados, resoluciones y referencia.
// El vault es lang:"en": los rótulos de organización (intro, carpetas, bajadas)
// van en inglés como el chrome de la página; los títulos de archivo conservan
// el nombre real del documento.

export const inge2Library: VaultLibrary = {
  intro:
    "Every printable resource for the subject in one place, arranged like a study folder: notes by topic, exam prompts, step-by-step solutions, mock exams and the quick reference. Each file opens the PDF in a new tab.",
  folders: [
    {
      key: "apuntes",
      label: "Notes by topic",
      blurb:
        "Compiled theory summaries ready to print, one per block of the syllabus — from fundamentals to anti-patterns.",
      items: [
        {
          title: "01 · Fundamentos de arquitectura",
          file: "wiki/biblioteca/apuntes/01-fundamentos-arquitectura.pdf",
          desc: "Definitions, the ABCs of design and what makes an architectural decision significant.",
          size: "400 KB",
        },
        {
          title: "02 · ADD y trade-offs",
          file: "wiki/biblioteca/apuntes/02-add-y-trade-offs.pdf",
          desc: "Attribute Driven Design and the canonical trade-offs between quality attributes.",
          size: "280 KB",
        },
        {
          title: "03 · Estilos arquitectónicos",
          file: "wiki/biblioteca/apuntes/03-estilos-arquitectonicos.pdf",
          desc: "POSA catalogue: dataflow, distributed, interactive and event-driven.",
          size: "268 KB",
        },
        {
          title: "04 · Cuándo diseñar y evaluación",
          file: "wiki/biblioteca/apuntes/04-cuando-disenar-y-evaluacion.pdf",
          desc: "BDUF / YAGNI / JEDUF, ATAM and SAAM, and the utility tree.",
          size: "276 KB",
        },
        {
          title: "05 · Documentación",
          file: "wiki/biblioteca/apuntes/05-documentacion.pdf",
          desc: "The 4+1 model and C4 — how to document an architecture by views.",
          size: "272 KB",
        },
        {
          title: "06 · Persistencia y datos",
          file: "wiki/biblioteca/apuntes/06-persistencia-y-datos.pdf",
          desc: "RDBMS, OLTP/OLAP, NoSQL, sharding and the CAP theorem.",
          size: "400 KB",
        },
        {
          title: "07 · Integración, SOA y microservicios",
          file: "wiki/biblioteca/apuntes/07-integracion-soa-microservicios.pdf",
          desc: "ESB, SOA and microservices; integration patterns.",
          size: "392 KB",
        },
        {
          title: "08 · Seguridad arquitectónica",
          file: "wiki/biblioteca/apuntes/08-seguridad-arquitectonica.pdf",
          desc: "Security attributes and mechanisms: WAF, MFA, defence in depth.",
          size: "292 KB",
        },
        {
          title: "09 · Anti-patrones y estructura de respuesta",
          file: "wiki/biblioteca/apuntes/09-anti-patrones-y-estructura-de-respuesta.pdf",
          desc: "Common exam mistakes and the minimum structure of a good answer.",
          size: "268 KB",
        },
      ],
    },
    {
      key: "enunciados",
      label: "Exam prompts",
      blurb: "The prompts unsolved — to practise under exam conditions before looking at the solution.",
      items: [
        {
          title: "Parciales — 6 casos",
          file: "wiki/biblioteca/enunciados/enunciados-parciales-6-casos.pdf",
          desc: "A bank of six exam prompts from previous years.",
          size: "100 KB",
        },
        {
          title: "Cross challenge — 3 casos",
          file: "wiki/biblioteca/enunciados/cross-challenge.pdf",
          desc: "Three cases for comparing alternative designs.",
          size: "60 KB",
        },
        {
          title: "Ejercicio 2013 — control de fábrica",
          file: "wiki/biblioteca/enunciados/ejercicio-2013.pdf",
          desc: "The classic sensors, daemon and alarm exercise.",
          size: "60 KB",
        },
        {
          title: "TP general",
          file: "wiki/biblioteca/enunciados/tp-general.pdf",
          desc: "Prompt for the integrative practical assignment.",
          size: "316 KB",
        },
      ],
    },
    {
      key: "resoluciones",
      label: "Solutions",
      blurb: "The prompts solved step by step, with the design reasoning made explicit.",
      items: [
        {
          title: "Parciales — 6 casos resueltos",
          file: "wiki/biblioteca/resoluciones/parciales-6-casos.pdf",
          desc: "Full solution to the six exam cases.",
          size: "348 KB",
        },
        {
          title: "Cross challenge — 3 casos resueltos",
          file: "wiki/biblioteca/resoluciones/cross-challenge-3-casos.pdf",
          desc: "Worked designs for the three cross-challenge cases.",
          size: "300 KB",
        },
        {
          title: "Ejercicio 2013 — control de fábrica",
          file: "wiki/biblioteca/resoluciones/ejercicio-2013-control-fabrica.pdf",
          desc: "Solution to the series-sensors exercise.",
          size: "316 KB",
        },
        {
          title: "TP general resuelto",
          file: "wiki/biblioteca/resoluciones/tp-general.pdf",
          desc: "Solution to the integrative practical assignment.",
          size: "272 KB",
        },
        {
          title: "ADD — e-commerce",
          file: "wiki/biblioteca/resoluciones/add-ecommerce.pdf",
          desc: "Attribute Driven Design applied to an e-commerce case.",
          size: "244 KB",
        },
        {
          title: "Biblioteca Nacional",
          file: "wiki/biblioteca/resoluciones/biblioteca-nacional.pdf",
          desc: "Solved case study: National Library.",
          size: "252 KB",
        },
        {
          title: "Multiple choice resuelto",
          file: "wiki/biblioteca/resoluciones/multiple-choice.pdf",
          desc: "Multiple-choice questions with justification.",
          size: "300 KB",
        },
      ],
    },
    {
      key: "simulacros",
      label: "Mock exams",
      blurb: "Full exam-style cases in the real format — ideal for timing yourself.",
      items: [
        {
          title: "Mock parcial + multiple choice",
          file: "wiki/biblioteca/simulacros/mock-parcial-y-multiple-choice.pdf",
          desc: "Short mock exam with a multiple-choice section.",
          size: "32 KB",
        },
        {
          title: "Simulacro 1 — telemedicina",
          file: "wiki/biblioteca/simulacros/simulacro-1-telemedicina.pdf",
          desc: "Interregional telemedicine platform.",
          size: "264 KB",
        },
        {
          title: "Simulacro 2 — voto electrónico",
          file: "wiki/biblioteca/simulacros/simulacro-2-voto-electronico.pdf",
          desc: "In-person electronic voting system.",
          size: "292 KB",
        },
        {
          title: "Simulacro 3 — streaming de video",
          file: "wiki/biblioteca/simulacros/simulacro-3-streaming-video.pdf",
          desc: "Large-scale OTT streaming platform.",
          size: "260 KB",
        },
        {
          title: "Simulacro 4 — smart city / IoT",
          file: "wiki/biblioteca/simulacros/simulacro-4-smart-city-iot.pdf",
          desc: "Urban monitoring with IoT sensors.",
          size: "240 KB",
        },
        {
          title: "Simulacro 5 — subasta en tiempo real",
          file: "wiki/biblioteca/simulacros/simulacro-5-subasta-tiempo-real.pdf",
          desc: "Live auction order book.",
          size: "240 KB",
        },
        {
          title: "Simulacro 6 — logística última milla",
          file: "wiki/biblioteca/simulacros/simulacro-6-logistica-ultima-milla.pdf",
          desc: "Last-mile logistics with gig workers in hypergrowth.",
          size: "292 KB",
        },
      ],
    },
    {
      key: "referencia",
      label: "Quick reference",
      blurb: "To keep beside you while you study: the cheat sheet, the attributes table and the notes index.",
      items: [
        {
          title: "Cheat sheet pre-parcial",
          file: "wiki/analyses/cheat-sheet-estudio-pre-parcial.pdf",
          desc: "A dense summary of everything key for the final review.",
          size: "100 KB",
        },
        {
          title: "Atributos de calidad (ISO 25010)",
          file: "wiki/biblioteca/referencia/atributos-de-calidad.pdf",
          desc: "Quality attributes table from the ISO 25000/25010 standard.",
          size: "48 KB",
        },
        {
          title: "Índice de apuntes",
          file: "wiki/biblioteca/referencia/indice-apuntes.pdf",
          desc: "Table of contents of all the printable notes.",
          size: "164 KB",
        },
      ],
    },
  ],
};

import type { VaultLibrary } from "../types";

// Biblioteca de PDFs de Ingeniería del Software II — material de estudio
// imprimible de la materia, organizado tipo carpetas. Los archivos viven en
// Inge2/wiki/biblioteca/** (+ el cheat-sheet en wiki/analyses/) y el build los
// copia a public/vault-assets/inge2/<file>. Curado a propósito: se excluyen
// los decks de clase del profesor, papers de terceros (Twitter/QCon, OEI) y el
// material de alumnos — solo apuntes, enunciados, resoluciones y referencia.

export const inge2Library: VaultLibrary = {
  intro:
    "Todo el material imprimible de la materia en un solo lugar, ordenado como una carpeta de estudio: apuntes por tema, enunciados, resoluciones paso a paso, simulacros de parcial y la referencia rápida. Cada archivo abre el PDF en una pestaña nueva.",
  folders: [
    {
      key: "apuntes",
      label: "Apuntes por tema",
      blurb:
        "Resúmenes teóricos compilados para imprimir, uno por bloque del programa — de fundamentos a anti-patrones.",
      items: [
        {
          title: "01 · Fundamentos de arquitectura",
          file: "wiki/biblioteca/apuntes/01-fundamentos-arquitectura.pdf",
          desc: "Definiciones, ABC del diseño y qué hace significativa a una decisión arquitectónica.",
          size: "400 KB",
        },
        {
          title: "02 · ADD y trade-offs",
          file: "wiki/biblioteca/apuntes/02-add-y-trade-offs.pdf",
          desc: "Attribute Driven Design y los trade-offs canónicos entre atributos de calidad.",
          size: "280 KB",
        },
        {
          title: "03 · Estilos arquitectónicos",
          file: "wiki/biblioteca/apuntes/03-estilos-arquitectonicos.pdf",
          desc: "Catálogo POSA: dataflow, distribuidos, interactivos y orientados a eventos.",
          size: "268 KB",
        },
        {
          title: "04 · Cuándo diseñar y evaluación",
          file: "wiki/biblioteca/apuntes/04-cuando-disenar-y-evaluacion.pdf",
          desc: "BDUF / YAGNI / JEDUF, ATAM y SAAM, y el árbol de utilidad.",
          size: "276 KB",
        },
        {
          title: "05 · Documentación",
          file: "wiki/biblioteca/apuntes/05-documentacion.pdf",
          desc: "Modelo 4+1 y C4 — cómo documentar una arquitectura por vistas.",
          size: "272 KB",
        },
        {
          title: "06 · Persistencia y datos",
          file: "wiki/biblioteca/apuntes/06-persistencia-y-datos.pdf",
          desc: "RDBMS, OLTP/OLAP, NoSQL, sharding y el teorema CAP.",
          size: "400 KB",
        },
        {
          title: "07 · Integración, SOA y microservicios",
          file: "wiki/biblioteca/apuntes/07-integracion-soa-microservicios.pdf",
          desc: "ESB, SOA y microservicios; patrones de integración.",
          size: "392 KB",
        },
        {
          title: "08 · Seguridad arquitectónica",
          file: "wiki/biblioteca/apuntes/08-seguridad-arquitectonica.pdf",
          desc: "Atributos de seguridad y mecanismos: WAF, MFA, defensa en profundidad.",
          size: "292 KB",
        },
        {
          title: "09 · Anti-patrones y estructura de respuesta",
          file: "wiki/biblioteca/apuntes/09-anti-patrones-y-estructura-de-respuesta.pdf",
          desc: "Errores típicos del parcial y la estructura mínima de una buena respuesta.",
          size: "268 KB",
        },
      ],
    },
    {
      key: "enunciados",
      label: "Enunciados",
      blurb: "Las consignas sin resolver — para practicar en condiciones de examen antes de mirar la solución.",
      items: [
        {
          title: "Parciales — 6 casos",
          file: "wiki/biblioteca/enunciados/enunciados-parciales-6-casos.pdf",
          desc: "Banco de seis enunciados de parcial de años anteriores.",
          size: "100 KB",
        },
        {
          title: "Cross challenge — 3 casos",
          file: "wiki/biblioteca/enunciados/cross-challenge.pdf",
          desc: "Tres casos para comparar diseños alternativos.",
          size: "60 KB",
        },
        {
          title: "Ejercicio 2013 — control de fábrica",
          file: "wiki/biblioteca/enunciados/ejercicio-2013.pdf",
          desc: "El clásico ejercicio de sensores, daemon y alarma.",
          size: "60 KB",
        },
        {
          title: "TP general",
          file: "wiki/biblioteca/enunciados/tp-general.pdf",
          desc: "Enunciado del trabajo práctico integrador.",
          size: "316 KB",
        },
      ],
    },
    {
      key: "resoluciones",
      label: "Resoluciones",
      blurb: "Las consignas resueltas paso a paso, con el razonamiento de diseño explícito.",
      items: [
        {
          title: "Parciales — 6 casos resueltos",
          file: "wiki/biblioteca/resoluciones/parciales-6-casos.pdf",
          desc: "Resolución completa de los seis casos de parcial.",
          size: "348 KB",
        },
        {
          title: "Cross challenge — 3 casos resueltos",
          file: "wiki/biblioteca/resoluciones/cross-challenge-3-casos.pdf",
          desc: "Diseños trabajados para los tres casos del cross challenge.",
          size: "300 KB",
        },
        {
          title: "Ejercicio 2013 — control de fábrica",
          file: "wiki/biblioteca/resoluciones/ejercicio-2013-control-fabrica.pdf",
          desc: "Resolución del ejercicio de sensores en serie.",
          size: "316 KB",
        },
        {
          title: "TP general resuelto",
          file: "wiki/biblioteca/resoluciones/tp-general.pdf",
          desc: "Resolución del trabajo práctico integrador.",
          size: "272 KB",
        },
        {
          title: "ADD — e-commerce",
          file: "wiki/biblioteca/resoluciones/add-ecommerce.pdf",
          desc: "Attribute Driven Design aplicado a un caso de e-commerce.",
          size: "244 KB",
        },
        {
          title: "Biblioteca Nacional",
          file: "wiki/biblioteca/resoluciones/biblioteca-nacional.pdf",
          desc: "Caso de estudio resuelto: Biblioteca Nacional.",
          size: "252 KB",
        },
        {
          title: "Multiple choice resuelto",
          file: "wiki/biblioteca/resoluciones/multiple-choice.pdf",
          desc: "Preguntas de opción múltiple con justificación.",
          size: "300 KB",
        },
      ],
    },
    {
      key: "simulacros",
      label: "Simulacros de parcial",
      blurb: "Casos tipo parcial completos, con el formato real — ideales para cronometrarse.",
      items: [
        {
          title: "Mock parcial + multiple choice",
          file: "wiki/biblioteca/simulacros/mock-parcial-y-multiple-choice.pdf",
          desc: "Simulacro corto de parcial con sección de opción múltiple.",
          size: "32 KB",
        },
        {
          title: "Simulacro 1 — telemedicina",
          file: "wiki/biblioteca/simulacros/simulacro-1-telemedicina.pdf",
          desc: "Plataforma de telemedicina interregional.",
          size: "264 KB",
        },
        {
          title: "Simulacro 2 — voto electrónico",
          file: "wiki/biblioteca/simulacros/simulacro-2-voto-electronico.pdf",
          desc: "Sistema de voto electrónico presencial.",
          size: "292 KB",
        },
        {
          title: "Simulacro 3 — streaming de video",
          file: "wiki/biblioteca/simulacros/simulacro-3-streaming-video.pdf",
          desc: "Plataforma de streaming OTT a gran escala.",
          size: "260 KB",
        },
        {
          title: "Simulacro 4 — smart city / IoT",
          file: "wiki/biblioteca/simulacros/simulacro-4-smart-city-iot.pdf",
          desc: "Monitoreo urbano con sensores IoT.",
          size: "240 KB",
        },
        {
          title: "Simulacro 5 — subasta en tiempo real",
          file: "wiki/biblioteca/simulacros/simulacro-5-subasta-tiempo-real.pdf",
          desc: "Order book de subastas en vivo.",
          size: "240 KB",
        },
        {
          title: "Simulacro 6 — logística última milla",
          file: "wiki/biblioteca/simulacros/simulacro-6-logistica-ultima-milla.pdf",
          desc: "Logística de última milla con gig workers en hipercrecimiento.",
          size: "292 KB",
        },
      ],
    },
    {
      key: "referencia",
      label: "Referencia rápida",
      blurb: "Para tener al lado mientras estudiás: el cheat sheet, la tabla de atributos y el índice de apuntes.",
      items: [
        {
          title: "Cheat sheet pre-parcial",
          file: "wiki/analyses/cheat-sheet-estudio-pre-parcial.pdf",
          desc: "Resumen denso de todo lo clave para la última repasada.",
          size: "100 KB",
        },
        {
          title: "Atributos de calidad (ISO 25010)",
          file: "wiki/biblioteca/referencia/atributos-de-calidad.pdf",
          desc: "Tabla de atributos de calidad del estándar ISO 25000/25010.",
          size: "48 KB",
        },
        {
          title: "Índice de apuntes",
          file: "wiki/biblioteca/referencia/indice-apuntes.pdf",
          desc: "Tabla de contenidos de todos los apuntes imprimibles.",
          size: "164 KB",
        },
      ],
    },
  ],
};

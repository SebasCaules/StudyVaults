// AUTO-GENERADO por scripts/build-derecho-data.mjs — NO editar a mano.
// Fuente: Derecho/wiki/{1er,2do}Parcial/*. Regenerar con:
//   node scripts/build-derecho-data.mjs

export const UNIT_NAMES: Record<number, string> = {
  "0": "Integradoras",
  "1": "Introducción al Derecho",
  "2": "Organización del Estado",
  "3": "Derecho Civil",
  "4": "Derecho Comercial",
  "5": "Propiedad Intelectual",
  "6": "Sociedades",
  "7": "Contratos",
  "8": "Derechos del consumidor",
  "9": "Derecho laboral"
};

export type QuizKind = "vf" | "single" | "multi" | "reveal";

export interface QuizQ {
  id: string;
  unit: number;
  kind: QuizKind;
  q: string;
  opts: string[];
  correct?: number | number[];
  reveal?: string[];
  expl: string;
  cite?: string;
  tema?: string;
  dif?: string;
  real?: boolean;
  trap?: boolean;
  src: "estudio" | "quiz";
}

export interface ConceptBlock {
  unit: number;
  title: string;
  html: string;
}

export interface RepUnit {
  unit: number;
  name: string;
  items: { q: string; a: string; freq: string; trap: boolean }[];
}

export interface RepFeature {
  unit: number;
  title: string;
  freq: string;
  html: string;
}

export type FlashKind = "vf" | "mc" | "completar" | "desarrollo" | "caso";

export interface Flashcard {
  id: string;
  unit: number;
  kind: FlashKind;
  tema: string;
  enunciado: string;
  opts?: string[];
  respuesta: string;
  correccion: string;
}

export interface Concept {
  term: string;
  def: string;
}

export interface UnitConcepts {
  unit: number;
  name: string;
  concepts: Concept[];
  errores: string;
}

export const BANK_2DO: QuizQ[] = [
  {
    "id": "u6-1",
    "unit": 6,
    "q": "La sociedad unipersonal puede constituirse bajo cualquier tipo societario (SA, SRL, SAS) bajo la LGS 19.550.",
    "expl": "FALSO. Solo se admite unipersonal como SA (SAU — Sociedad Anonima Unipersonal, art. 1 + 299 LGS) o SAS (Ley 27.349). La SRL exige minimo 2 socios.",
    "src": "estudio",
    "cite": "art. 1 LGS + Ley 27.349",
    "tema": "organos",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u6-2",
    "unit": 6,
    "q": "¿Cual es el capital minimo de una SAS (Sociedad por Acciones Simplificada)?",
    "expl": "La Ley 27.349 fija el capital minimo de la SAS en 2 veces el SMVyM, integrable 25% al constituir y el saldo en 2 anos.",
    "src": "estudio",
    "cite": "art. 40 Ley 27.349",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "Sin minimo exigido",
      "1 SMVyM",
      "2 SMVyM",
      "Igual al capital minimo de una SA"
    ],
    "correct": 2
  },
  {
    "id": "u6-3",
    "unit": 6,
    "q": "En una SRL con 60 socios, ¿que sucede?",
    "expl": "Art. 146 LGS: la SRL no puede tener mas de 50 socios. Excedido el limite, debe transformarse a SA en plazo razonable o queda en irregularidad.",
    "src": "estudio",
    "cite": "art. 146 LGS",
    "tema": "tipos",
    "kind": "single",
    "opts": [
      "Es valida, el limite legal es 60 socios",
      "No es valida: SRL admite max. 50 socios; debe transformarse en SA",
      "Se disuelve automaticamente",
      "Los socios pierden la responsabilidad limitada"
    ],
    "correct": 1
  },
  {
    "id": "u6-4",
    "unit": 6,
    "q": "Las SAS siempre quedan comprendidas en el art. 299 LGS si superan cierto monto de capital, debiendo someterse a fiscalizacion estatal permanente.",
    "expl": "FALSO. Las SAS no pueden estar comprendidas en el art. 299 LGS. Si reciben inversion de una sociedad art. 299 que las pase a controlar, deben transformarse a SA en 6 meses.",
    "src": "estudio",
    "cite": "art. 39 Ley 27.349",
    "tema": "organos",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u6-5",
    "unit": 6,
    "q": "Marque cuales son requisitos OBLIGATORIOS del instrumento constitutivo segun el art. 11 LGS:",
    "expl": "Art. 11 LGS exige: 1) datos de socios, 2) razon social, 3) domicilio, 4) objeto preciso, 5) capital en pesos, 6) plazo determinado, 7) organizacion de la administracion / fiscalizacion / asamblea, 8) reglas de utilidades / perdidas, 9) clausulas para funcionamiento, disolucion y liquidacion. El arbitraje y el IPC NO son requisitos legales.",
    "src": "estudio",
    "cite": "art. 11 LGS",
    "tema": "organos",
    "kind": "multi",
    "opts": [
      "Datos de los socios (DNI, domicilio, profesion)",
      "Razon social o denominacion",
      "Objeto social preciso y determinado",
      "Capital social en pesos",
      "Plazo determinado",
      "Sistema de arbitraje obligatorio",
      "Reglas de distribucion de utilidades y perdidas",
      "Cifra del IPC al cierre del ejercicio anterior"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4,
      6
    ]
  },
  {
    "id": "u6-6",
    "unit": 6,
    "q": "El objeto social en una SAS se diferencia de la regla general de la LGS porque:",
    "expl": "Ley 27.349 (art. 36 inc. 4) permite que la SAS tenga objeto plural sin necesidad de conexidad — diferencia clave respecto del art. 11 inc. 3 LGS que exige objeto preciso y determinado.",
    "src": "estudio",
    "cite": "art. 36 Ley 27.349",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "No puede ser plural",
      "Puede ser plural sin exigencia de conexidad entre los objetos",
      "No puede cambiarse durante la vida de la sociedad",
      "Requiere aprobacion previa de la CNV"
    ],
    "correct": 1
  },
  {
    "id": "u6-7",
    "unit": 6,
    "q": "Un administrador de SAS que actua con dolo o culpa grave responde solidaria e ilimitadamente ante socios y terceros, aplicando supletoriamente el art. 59 LGS.",
    "expl": "VERDADERO. El art. 59 LGS impone a administradores el estandar del 'buen hombre de negocios' (lealtad + diligencia). Responde solidaria e ilimitadamente por dolo, abuso de facultades o culpa grave. Se aplica supletoriamente a la SAS.",
    "src": "estudio",
    "cite": "art. 59 LGS",
    "tema": "capital",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u6-8",
    "unit": 6,
    "q": "¿Cual es la ventaja clave de constituir una SAS frente a una SA tradicional?",
    "expl": "La SAS fue creada por la Ley 27.349 para facilitar el emprendedurismo. Su valor diferencial es la inscripcion digital rapida, formulario estandar, costos bajos y libertad organizativa (sin sindicatura obligatoria, voto plural admitido, etc.).",
    "src": "estudio",
    "cite": "Ley 27.349",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "Responsabilidad limitada mayor que la SA",
      "Constitucion digital en 24-48 hs, bajo costo, CUIT inmediato y mayor flexibilidad organizativa",
      "Obligatoriedad de sindicatura colegiada",
      "Acceso directo a la oferta publica de acciones"
    ],
    "correct": 1
  },
  {
    "id": "u6-9",
    "unit": 6,
    "q": "¿Cuantos directores como minimo debe tener una SA comprendida en el art. 299 LGS (sociedad bajo fiscalizacion estatal permanente)?",
    "expl": "Art. 255 LGS: en las SA del art. 299 el directorio debe ser plural y compuesto por al menos 3 directores. Ademas requiere sindicatura colegiada en numero impar (art. 284 LGS).",
    "src": "estudio",
    "cite": "arts. 255, 284 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "1",
      "2",
      "3",
      "5"
    ],
    "correct": 2
  },
  {
    "id": "u6-10",
    "unit": 6,
    "q": "La responsabilidad de los socios en una sociedad de hecho (Seccion IV LGS, arts. 21-26) es siempre solidaria, sin excepciones.",
    "expl": "FALSO. Tras la reforma 2015 (Ley 26.994), en Seccion IV los socios responden por partes iguales SALVO que el contrato social, las reglas comunes, o un pacto con el tercero, establezcan solidaridad o proporcion distinta. Es decir: la regla pasa a ser mancomunada simple.",
    "src": "estudio",
    "cite": "arts. 21-26 LGS (reforma Ley 26.994)",
    "tema": "seccion-iv",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u6-11",
    "unit": 6,
    "q": "La 'inoponibilidad de la personalidad juridica' (art. 54 in fine LGS — corrimiento del velo) implica:",
    "expl": "Art. 54 in fine LGS: 'La actuacion de la sociedad que encubra la consecucion de fines extrasocietarios, constituya un mero recurso para violar la ley, el orden publico o la buena fe o para frustrar derechos de terceros, se imputara directamente a los socios o a los controlantes que la hicieron posible, quienes responderan solidaria e ilimitadamente'.",
    "src": "estudio",
    "cite": "art. 54 LGS",
    "tema": "responsabilidad",
    "kind": "single",
    "opts": [
      "Perdida de la inscripcion en IGJ",
      "Que se atribuyan los actos a los socios o controlantes cuando la sociedad fue utilizada como pantalla para fraude, frustracion de derechos de terceros o violacion del orden publico",
      "La nulidad automatica de la sociedad",
      "Que los socios pasan a tener responsabilidad limitada"
    ],
    "correct": 1
  },
  {
    "id": "u6-12",
    "unit": 6,
    "q": "¿Cuales de estas clausulas estatutarias son NULAS segun el art. 13 LGS ('clausulas leoninas')?",
    "expl": "Art. 13 LGS declara nulas las clausulas leoninas: excluir de ganancias, liberar de perdidas, asegurar capital o ganancias fijas, devolver aportes con premios designados, fijar precios irreales para participaciones al retirarse. Limitar transferencias o tener pluralidad de gerentes son validos.",
    "src": "estudio",
    "cite": "art. 13 LGS",
    "tema": "capital",
    "kind": "multi",
    "opts": [
      "Excluir a un socio de las ganancias o liberarlo de las perdidas",
      "Establecer que el directorio reporte a la asamblea",
      "Limitar la transferencia de cuotas o acciones",
      "Asegurar a un socio capital o ganancias eventuales (sin riesgo)",
      "Devolver al socio sus aportes con un premio designado",
      "Pluralidad de gerentes en SRL"
    ],
    "correct": [
      0,
      3,
      4
    ]
  },
  {
    "id": "u6-13",
    "unit": 6,
    "q": "En una SAS, el estatuto puede prohibir la transferencia de acciones por hasta 10 anos, prorrogables.",
    "expl": "VERDADERO. La Ley 27.349 (art. 48) permite que el estatuto restrinja la transferencia de acciones por un plazo maximo de 10 anos desde la emision, prorrogables por acuerdo unanime de los socios. Es una flexibilidad mayor que en la SA.",
    "src": "estudio",
    "cite": "art. 48 Ley 27.349",
    "tema": "capital",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u6-14",
    "unit": 6,
    "q": "Capital minimo legal para constituir una SRL:",
    "expl": "La LGS no fija capital minimo para SRL. Existe solo el principio general del art. 11 inc. 4 (debe estar en pesos y ser suficiente para cumplir el objeto). Para SA el minimo es fijado por decreto (actualizable); para SAS son 2 SMVyM (Ley 27.349).",
    "src": "estudio",
    "cite": "art. 11 LGS",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "No exigido por la LGS",
      "1 SMVyM",
      "2 SMVyM",
      "Mismo que para SA"
    ],
    "correct": 0
  },
  {
    "id": "u6-15",
    "unit": 6,
    "q": "La SAU (Sociedad Anonima Unipersonal) creada por la reforma del CCyC (2015) debe inscribirse:",
    "expl": "Art. 299 inc. 7 LGS incluye expresamente a la SAU dentro de las sociedades bajo fiscalizacion permanente del Estado, por lo que requiere directorio plural (≥3) y sindicatura colegiada.",
    "src": "estudio",
    "cite": "art. 299 inc. 7 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "Bajo el regimen de la Ley 27.349",
      "Sometida al art. 299 LGS (fiscalizacion estatal permanente)",
      "Como sociedad de Seccion IV",
      "Sin requerir fiscalizacion estatal"
    ],
    "correct": 1
  },
  {
    "id": "u6-16",
    "unit": 6,
    "q": "La Seccion IV LGS (arts. 21-26) permite la subsanacion de los vicios formales o tipicidad por decision de mayoria de socios.",
    "expl": "VERDADERO. Art. 25 LGS (reforma 2015): la subsanacion puede pedirse por cualquier socio y se decide por mayoria. El disconforme tiene derecho de receso.",
    "src": "estudio",
    "cite": "art. 25 LGS",
    "tema": "seccion-iv",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u6-17",
    "unit": 6,
    "q": "En la SRL el regimen de sindicatura es:",
    "expl": "Art. 158 LGS: la SRL puede prescindir de la sindicatura por estatuto. Es obligatoria solo si el capital alcanza el monto del art. 299 inc. 2 (capital relevante).",
    "src": "estudio",
    "cite": "art. 158 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "Opcional como regla general; obligatoria si el capital alcanza el monto del art. 299 inc. 2 LGS",
      "Siempre obligatoria desde la constitucion",
      "Prohibida por la LGS",
      "Solo permitida si todos los socios son contadores"
    ],
    "correct": 0
  },
  {
    "id": "u6-18",
    "unit": 6,
    "q": "¿Cual de los siguientes NO es un elemento esencial del concepto de sociedad segun el art. 1 LGS?",
    "expl": "Art. 1 LGS exige aportes, organizacion tipificada, produccion/intercambio, y participacion en utilidades y perdidas. La unipersonalidad esta admitida (SA y SAS) y no hay un minimo de 5 socios. La SRL exige minimo 2 y maximo 50.",
    "src": "estudio",
    "cite": "art. 1 LGS",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "Aportes para aplicarlos a la produccion o intercambio de bienes o servicios",
      "Affectio societatis (intencion de asociarse)",
      "Organizacion bajo uno de los tipos previstos",
      "Participacion en las ganancias y las perdidas",
      "Cantidad minima de 5 socios"
    ],
    "correct": 4
  },
  {
    "id": "u6-19",
    "unit": 6,
    "q": "Asociar cada organo societario con su funcion principal en una SA:",
    "expl": "En la SA: Asamblea = organo de gobierno (decisiones supremas), Directorio = administracion y representacion, Sindicatura = fiscalizacion. En las SAS este esquema se simplifica.",
    "src": "estudio",
    "cite": "arts. 233-298 LGS",
    "tema": "organos",
    "kind": "reveal",
    "opts": [
      "Administracion ejecutiva y representacion legal de la sociedad",
      "Decisiones fundamentales: reforma de estatuto, aprobacion de balance, designacion/remocion de directores",
      "Fiscalizacion interna, control de la administracion y auditoria de actos"
    ],
    "reveal": [
      "Asamblea de Accionistas → Decisiones fundamentales: reforma de estatuto, aprobacion de balance, designacion/remocion de directores",
      "Directorio → Administracion ejecutiva y representacion legal de la sociedad",
      "Sindicatura / Consejo de Vigilancia → Fiscalizacion interna, control de la administracion y auditoria de actos"
    ]
  },
  {
    "id": "u6-20",
    "unit": 6,
    "q": "En una SRL, la transmision de cuotas sociales a terceros (no socios):",
    "expl": "Art. 152 LGS: la cesion de cuotas a terceros es libre, salvo que el contrato social la restrinja. No puede prohibirse de modo absoluto, pero si exigir conformidad de socios u otorgar derecho de preferencia.",
    "src": "estudio",
    "cite": "art. 152 LGS",
    "tema": "tipos",
    "kind": "single",
    "opts": [
      "Es siempre libre, sin restricciones",
      "Esta prohibida absolutamente",
      "Es libre salvo que el contrato social la limite o requiera conformidad",
      "Requiere autorizacion judicial"
    ],
    "correct": 2
  },
  {
    "id": "u7-1",
    "unit": 7,
    "q": "El art. 957 CCyC define al contrato como:",
    "expl": "Art. 957 CCyC (literal): es ACUERDO, no imposicion; involucra mas de una parte; finalidad patrimonial. El 'papel firmado' es solo una posible forma (art. 1015).",
    "src": "estudio",
    "cite": "art. 957 CCyC",
    "tema": "forma",
    "kind": "single",
    "opts": [
      "La imposicion de una voluntad dominante sobre otra",
      "El acto juridico mediante el cual dos o mas partes manifiestan su consentimiento para crear, regular, modificar, transferir o extinguir relaciones juridicas patrimoniales",
      "Un documento escrito firmado por dos personas",
      "Una promesa unilateral con efectos vinculantes"
    ],
    "correct": 1
  },
  {
    "id": "u7-2",
    "unit": 7,
    "q": "Todos los contratos deben celebrarse por escrito, en soporte papel o digital, para ser validos.",
    "expl": "FALSO. Art. 1015 CCyC consagra la LIBERTAD DE FORMAS: 'Solo son formales los contratos a los cuales la ley les impone una forma determinada'. La regla es informalidad.",
    "src": "estudio",
    "cite": "art. 1015 CCyC",
    "tema": "forma",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u7-3",
    "unit": 7,
    "q": "Hay compraventa cuando una de las partes se obliga a transferir la ___ de una cosa, y la otra a pagar un precio en dinero.",
    "expl": "Art. 1123 CCyC: el contrato de compraventa transfiere la PROPIEDAD (dominio) de la cosa. No es posesion ni tenencia.",
    "src": "estudio",
    "cite": "art. 1123 CCyC",
    "tema": "compraventa",
    "kind": "single",
    "opts": [
      "posesion",
      "tenencia",
      "propiedad",
      "administracion"
    ],
    "correct": 2
  },
  {
    "id": "u7-4",
    "unit": 7,
    "q": "La oferta como acto unilateral previo al contrato (art. 972 CCyC) requiere:",
    "expl": "Art. 972 CCyC: la oferta debe (i) ser dirigida a persona determinada o determinable, (ii) tener intencion de obligarse, (iii) contener las precisiones del contrato. Es revocable hasta que llegue al destinatario salvo que se haya pactado irrevocabilidad.",
    "src": "estudio",
    "cite": "art. 972 CCyC",
    "tema": "consentimiento",
    "kind": "single",
    "opts": [
      "Estar dirigida al publico en general",
      "Estar dirigida a persona determinada o determinable, con la intencion de obligarse y con las precisiones necesarias para fijar los efectos del eventual contrato",
      "Ser irrevocable durante 30 dias",
      "Constar siempre por escrito ante escribano"
    ],
    "correct": 1
  },
  {
    "id": "u7-5",
    "unit": 7,
    "q": "Conforme al art. 260 CCyC, el ACTO VOLUNTARIO es aquel ejecutado con:",
    "expl": "Art. 260 CCyC (literal): 'El acto voluntario es el ejecutado con discernimiento, intencion y libertad, que se manifiesta por un hecho exterior'. Faltando alguno de los tres elementos, el acto es involuntario y por regla nulo.",
    "src": "estudio",
    "cite": "art. 260 CCyC",
    "tema": "vicios",
    "kind": "single",
    "opts": [
      "Firma autentica + dos testigos",
      "Discernimiento, intencion y libertad",
      "Capacidad civil + consentimiento expreso",
      "Forma escrita + entrega de la cosa"
    ],
    "correct": 1
  },
  {
    "id": "u7-6",
    "unit": 7,
    "q": "Si una persona firma un contrato bajo intoxicacion alcoholica grave (BAC > 0,1%), el contrato es:",
    "expl": "Art. 261 inc. b CCyC: es acto involuntario por falta de discernimiento 'el acto licito de la persona privada accidentalmente de la razon'. La intoxicacion alcoholica grave priva accidentalmente del discernimiento → el contrato carece de elemento esencial → nulidad relativa.",
    "src": "estudio",
    "cite": "arts. 260-261 CCyC",
    "tema": "vicios",
    "kind": "single",
    "opts": [
      "Valido porque lo firmo voluntariamente",
      "Invalido por falta de discernimiento — falta de elemento esencial del acto voluntario (arts. 260, 261 inc. b CCyC) y por ende falta de consentimiento",
      "Invalido solo si la otra parte conocia el estado",
      "Valido pero anulable solo si causa dano"
    ],
    "correct": 1
  },
  {
    "id": "u7-7",
    "unit": 7,
    "q": "¿Cuales contratos requieren ESCRITURA PUBLICA bajo el art. 1017 CCyC?",
    "expl": "Art. 1017 CCyC enumera los contratos que requieren escritura publica: (a) inmuebles y derechos reales sobre ellos; (b) renta vitalicia; (c) particiones extrajudiciales de herencias; (d) actos accesorios; (e) los que la ley o las partes acuerden.",
    "src": "estudio",
    "cite": "art. 1017 CCyC",
    "tema": "forma",
    "kind": "single",
    "opts": [
      "Todos los contratos comerciales",
      "Solo los que las partes elijan voluntariamente",
      "Los que tienen por objeto inmuebles, derechos reales sobre inmuebles, particiones extrajudiciales, derechos reales sobre cosas muebles registrables, y otros casos expresos",
      "Solo los contratos de seguros"
    ],
    "correct": 2
  },
  {
    "id": "u7-8",
    "unit": 7,
    "q": "Si un contrato sobre inmuebles se celebra por instrumento privado (boleto de compraventa) sin escritura publica, el contrato:",
    "expl": "Art. 1018 CCyC: el otorgamiento pendiente de un instrumento publico previsto como forma constitutiva sera considerado como obligacion de hacer. El boleto NO es nulo: vale como obligacion de escriturar, exigible judicialmente.",
    "src": "estudio",
    "cite": "art. 1018 CCyC",
    "tema": "forma",
    "kind": "single",
    "opts": [
      "Es absolutamente nulo y no produce ningun efecto",
      "Vale como compromiso de las partes de otorgar la escritura publica respectiva — obligacion de escriturar (art. 1018 CCyC)",
      "Convalida automaticamente si no se objeta dentro de 30 dias",
      "Vale solo si esta certificado por escribano"
    ],
    "correct": 1
  },
  {
    "id": "u7-9",
    "unit": 7,
    "q": "Marque los REQUISITOS del OBJETO del contrato segun el art. 1003 CCyC:",
    "expl": "Art. 1003-1004 CCyC: el objeto debe ser licito, posible (fisica y juridicamente), determinado o determinable, susceptible de valoracion economica y debe corresponder a un interes de las partes. Forma escrita y aprobacion judicial NO son requisitos del objeto.",
    "src": "estudio",
    "cite": "arts. 1003-1004 CCyC",
    "tema": "forma",
    "kind": "multi",
    "opts": [
      "Licito",
      "Posible (fisica y juridicamente)",
      "Determinado o determinable",
      "Susceptible de valoracion economica / patrimonial",
      "Que corresponda a un interes de las partes",
      "Forma escrita siempre",
      "Aprobacion judicial previa"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": "u7-10",
    "unit": 7,
    "q": "La excepcion de incumplimiento (exceptio non adimpleti contractus) regulada en los arts. 1031-1032 CCyC permite a una parte:",
    "expl": "Arts. 1031-1032 CCyC: en contratos bilaterales, una parte puede suspender su prestacion hasta que la otra cumpla u ofrezca cumplir. Es defensa, no resolucion. Tambien admite la excepcion ante peligro de no cumplir (excepcion preventiva).",
    "src": "estudio",
    "cite": "arts. 1031-1032 CCyC",
    "tema": "clasificacion",
    "kind": "single",
    "opts": [
      "Resolver unilateralmente el contrato sin notificacion",
      "Suspender el cumplimiento de su propia obligacion mientras la otra parte no cumpla la suya, en los contratos bilaterales",
      "Reclamar danos sin probarlos",
      "Modificar el precio sin acuerdo"
    ],
    "correct": 1
  },
  {
    "id": "u7-11",
    "unit": 7,
    "q": "En el leasing (art. 1227 CCyC), la opcion de compra a favor del tomador puede ejercerse cuando:",
    "expl": "Art. 1240 CCyC: la opcion de compra puede ejercerse por el tomador una vez que haya pagado las tres cuartas partes del canon total estipulado en el contrato, salvo pacto en contrario.",
    "src": "estudio",
    "cite": "art. 1240 CCyC",
    "tema": "leasing",
    "kind": "single",
    "opts": [
      "Se firma el contrato",
      "Se han pagado el 50% de los canones",
      "Se han pagado las tres cuartas partes (3/4) del canon total fijado",
      "Solo al finalizar el contrato"
    ],
    "correct": 2
  },
  {
    "id": "u7-12",
    "unit": 7,
    "q": "Tras el DNU 70/2023 (que derogo la Ley 27.551 de locaciones), el plazo MINIMO actual de un contrato de locacion de vivienda es de:",
    "expl": "El DNU 70/2023 (dic. 2023) derogo el art. 1198 CCyC modificado por Ley 27.551 y restituyo el texto original: plazo MINIMO = 2 anos para locacion de vivienda. La indexacion ahora es libre (puede pactarse en cualquier moneda y con cualquier indice). Es trampa frecuente: la Ley 27.551 (3 anos + ICL) ya NO esta vigente.",
    "src": "estudio",
    "cite": "art. 1198 CCyC (post DNU 70/2023)",
    "tema": "locacion",
    "kind": "single",
    "opts": [
      "1 ano",
      "2 anos (art. 1198 CCyC, vuelve al texto original)",
      "3 anos (regimen Ley 27.551, hoy derogado)",
      "Sin plazo minimo legal"
    ],
    "correct": 1
  },
  {
    "id": "u7-13",
    "unit": 7,
    "q": "El mandato (art. 1319 CCyC) tiene por objeto:",
    "expl": "Art. 1319 CCyC: 'Hay contrato de mandato cuando una parte se obliga a realizar uno o mas actos juridicos en interes de otra'. Los hechos materiales corresponden al contrato de obra/servicios (art. 1251); la custodia al deposito (art. 1356).",
    "src": "estudio",
    "cite": "art. 1319 CCyC",
    "tema": "vicios",
    "kind": "single",
    "opts": [
      "Realizar hechos materiales (obras o servicios)",
      "Que el mandatario realice ACTOS JURIDICOS por cuenta del mandante",
      "Custodiar una cosa ajena",
      "Garantizar el cumplimiento de un contrato"
    ],
    "correct": 1
  },
  {
    "id": "u7-14",
    "unit": 7,
    "q": "El contrato de franquicia (art. 1512 CCyC) combina:",
    "expl": "Art. 1512 CCyC: el franquiciante (titular de un sistema probado) concede al franquiciado el derecho a explotarlo, suministrando un conjunto de conocimientos tecnicos (know-how) y prestando asistencia tecnica permanente, a cambio de una contraprestacion (canon).",
    "src": "estudio",
    "cite": "art. 1512 CCyC",
    "tema": "franquicia",
    "kind": "single",
    "opts": [
      "Solo cesion de marca",
      "Solo asistencia tecnica",
      "Cesion de uso de marca + know-how + asistencia tecnica continua, a cambio de regalias",
      "Solo financiamiento a comerciantes"
    ],
    "correct": 2
  },
  {
    "id": "u7-15",
    "unit": 7,
    "q": "La donacion de bienes INMUEBLES (art. 1552 CCyC) debe formalizarse mediante:",
    "expl": "Art. 1552 CCyC: 'Deben ser hechas en escritura publica, bajo pena de nulidad, las donaciones de cosas inmuebles, las de cosas muebles registrables y las de prestaciones periodicas o vitalicias'. Es forma ad solemnitatem absoluta.",
    "src": "estudio",
    "cite": "art. 1552 CCyC",
    "tema": "forma",
    "kind": "single",
    "opts": [
      "Instrumento privado con dos testigos",
      "Carta documento",
      "Escritura publica, bajo pena de nulidad",
      "Inscripcion en el Registro de la Propiedad sin necesidad de escritura"
    ],
    "correct": 2
  },
  {
    "id": "u7-16",
    "unit": 7,
    "q": "En contratos celebrados por adhesion a clausulas generales predispuestas, las clausulas abusivas se tienen por no convenidas (art. 988 CCyC).",
    "expl": "VERDADERO. Art. 988 CCyC: en los contratos por adhesion, se tienen por no escritas las clausulas que (a) desnaturalizan las obligaciones del predisponente; (b) importan renuncia o restriccion a derechos del adherente o amplian los del predisponente; (c) por su contenido, redaccion o presentacion no fueran razonablemente previsibles.",
    "src": "estudio",
    "cite": "art. 988 CCyC",
    "tema": "clasificacion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-17",
    "unit": 7,
    "q": "El consentimiento contractual se considera perfeccionado cuando:",
    "expl": "Art. 980 CCyC: la aceptacion perfecciona el contrato (a) entre presentes, cuando es manifestada; (b) entre ausentes, si es recibida por el proponente durante el plazo de vigencia de la oferta. Argentina sigue la teoria de la RECEPCION.",
    "src": "estudio",
    "cite": "arts. 978-983 CCyC",
    "tema": "consentimiento",
    "kind": "single",
    "opts": [
      "La oferta llega a conocimiento del destinatario",
      "La aceptacion del destinatario llega al oferente (teoria de la recepcion — art. 978-983 CCyC)",
      "Se firma un instrumento privado",
      "Se entrega la cosa"
    ],
    "correct": 1
  },
  {
    "id": "u7-18",
    "unit": 7,
    "q": "Marque los elementos ESENCIALES del contrato (regla CCOCF):",
    "expl": "Los 5 elementos esenciales son: Consentimiento (arts. 957, 971), Capacidad (arts. 22, 23, 31), Objeto (art. 1003), Causa (art. 281), Forma (art. 1015). La firma ante escribano y la aprobacion fiscal son accesorios, no elementos esenciales del contrato civil.",
    "src": "estudio",
    "cite": "arts. 957, 1003, 1015 CCyC",
    "tema": "consentimiento",
    "kind": "multi",
    "opts": [
      "Consentimiento valido (libre y voluntario)",
      "Capacidad de las partes",
      "Objeto licito, posible y determinado",
      "Causa licita (motivo licito)",
      "Forma exigida por la ley",
      "Firma certificada ante escribano",
      "Aprobacion de la AFIP"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": "u7-19",
    "unit": 7,
    "q": "La teoria de la imprevision (art. 1091 CCyC) permite al perjudicado por una alteracion extraordinaria de las circunstancias:",
    "expl": "Art. 1091 CCyC: si la prestacion a cargo de una parte se torna excesivamente onerosa por una alteracion extraordinaria de las circunstancias existentes al tiempo de su celebracion, sobrevenida por causas ajenas a las partes y al riesgo asumido, la parte afectada puede plantear la resolucion total o parcial del contrato, o su adecuacion. Aplica en contratos conmutativos de ejecucion diferida o permanente.",
    "src": "estudio",
    "cite": "art. 1091 CCyC",
    "tema": "extincion",
    "kind": "single",
    "opts": [
      "Resolver el contrato unilateralmente sin notificar",
      "Plantear extrajudicial o judicialmente la resolucion total o parcial del contrato, o su adecuacion",
      "Suspender automaticamente el cumplimiento",
      "Cobrar el doble del precio"
    ],
    "correct": 1
  },
  {
    "id": "u7-20",
    "unit": 7,
    "q": "En el contrato de obra (art. 1251 CCyC), el contratista asume una obligacion de RESULTADO, mientras que en la prestacion de servicios suele ser de medios.",
    "expl": "VERDADERO. Art. 1251-1252 CCyC: la obra implica resultado (entregar la cosa hecha — ej. edificio terminado). La prestacion de servicios implica medios (ej. medico, abogado: actuar con diligencia, sin garantizar resultado).",
    "src": "estudio",
    "cite": "arts. 1251-1252 CCyC",
    "tema": "vicios",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-21",
    "unit": 7,
    "q": "En la cesion de derechos (art. 1614 CCyC), la cesion produce efectos respecto del deudor cedido:",
    "expl": "Art. 1620 CCyC: la cesion tiene efecto respecto de terceros desde la notificacion al cedido por instrumento publico o privado de fecha cierta. La conformidad del deudor NO es requerida (no es novacion).",
    "src": "estudio",
    "cite": "arts. 1614, 1620 CCyC",
    "tema": "forma",
    "kind": "single",
    "opts": [
      "Desde que se firma entre cedente y cesionario",
      "Desde la notificacion al deudor cedido (por instrumento publico o privado de fecha cierta)",
      "Solo si el deudor presta su conformidad expresa",
      "Cuando se inscribe en un registro publico"
    ],
    "correct": 1
  },
  {
    "id": "u7-22",
    "unit": 7,
    "q": "En el contrato de locacion, las MEJORAS pagadas por el locatario (inquilino):",
    "expl": "Arts. 1211-1213 CCyC: necesarias o urgentes → reembolso obligatorio; utiles → reembolso si fueron consentidas; voluntarias o suntuarias → sin reembolso (quedan en beneficio del locador).",
    "src": "estudio",
    "cite": "arts. 1211-1213 CCyC",
    "tema": "locacion",
    "kind": "single",
    "opts": [
      "Son siempre del locatario al finalizar el contrato",
      "Las necesarias y urgentes deben ser reintegradas por el locador; las utiles solo si fueron autorizadas; las suntuarias quedan a favor del locador sin compensacion (arts. 1211 y ss CCyC)",
      "Nunca corresponden compensacion",
      "Solo se compensan si se inscribieron en escritura"
    ],
    "correct": 1
  },
  {
    "id": "u7-23",
    "unit": 7,
    "q": "Asociar cada articulo del CCyC con el tema que regula:",
    "expl": "260=acto voluntario, 972=oferta, 1015=libertad de formas, 1123=compraventa, 1512=franquicia. Son los articulos 'estrella' de Unidad 7 que tienen alta probabilidad de aparecer.",
    "src": "estudio",
    "cite": "CCyC",
    "tema": "vicios",
    "kind": "reveal",
    "opts": [
      "Concepto de compraventa: transferencia de propiedad por precio",
      "Concepto de franquicia: marca + know-how + asistencia",
      "Libertad de formas en los contratos",
      "Acto voluntario: discernimiento + intencion + libertad",
      "Concepto de oferta como acto unilateral previo al contrato"
    ],
    "reveal": [
      "Art. 260 CCyC → Acto voluntario: discernimiento + intencion + libertad",
      "Art. 972 CCyC → Concepto de oferta como acto unilateral previo al contrato",
      "Art. 1015 CCyC → Libertad de formas en los contratos",
      "Art. 1123 CCyC → Concepto de compraventa: transferencia de propiedad por precio",
      "Art. 1512 CCyC → Concepto de franquicia: marca + know-how + asistencia"
    ]
  },
  {
    "id": "u7-24",
    "unit": 7,
    "q": "Los vicios redhibitorios (arts. 1051-1058 CCyC) son defectos OCULTOS que existen al tiempo de la entrega y que hacen la cosa impropia para su destino o que disminuyen su valor en forma significativa.",
    "expl": "VERDADERO. Art. 1051 CCyC: vicio redhibitorio es el defecto OCULTO (no manifiesto a simple vista) preexistente a la entrega, que torna la cosa impropia para su destino o disminuye significativamente su valor. Habilita accion redhibitoria (resolucion) o estimatoria (rebaja de precio).",
    "src": "estudio",
    "cite": "arts. 1051-1058 CCyC",
    "tema": "vicios",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-25",
    "unit": 7,
    "q": "Las modalidades de extincion del contrato (arts. 1076-1091 CCyC) incluyen:",
    "expl": "El CCyC regula multiples modos de extincion: cumplimiento, rescision bilateral (art. 1076), revocacion (acto unilateral con efecto ex nunc — desde ahora), resolucion (con efecto retroactivo — ex tunc — por incumplimiento art. 1083 o por clausula expresa), frustracion de finalidad (art. 1090), imprevision (art. 1091).",
    "src": "estudio",
    "cite": "arts. 1076-1091 CCyC",
    "tema": "clasificacion",
    "kind": "single",
    "opts": [
      "Solamente el cumplimiento",
      "Cumplimiento, rescision bilateral, revocacion, resolucion (por incumplimiento o por causa expresa), frustracion de la finalidad e imprevision",
      "Solo la resolucion judicial",
      "Cumplimiento e imposibilidad de pago"
    ],
    "correct": 1
  },
  {
    "id": "u8-1",
    "unit": 8,
    "q": "Segun el art. 1 LDC (Ley 24.240), ¿quien es CONSUMIDOR strictu sensu?",
    "expl": "Art. 1 LDC: consumidor es quien adquiere o utiliza bienes/servicios como destinatario final. Quien compra para producir o revender (B2B) NO es consumidor — esta regido por derecho comercial / contratos paritarios.",
    "src": "estudio",
    "cite": "art. 1 LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "La empresa que adquiere materia prima para producir bienes",
      "La persona fisica o juridica que adquiere o utiliza bienes o servicios como DESTINATARIO FINAL, en beneficio propio o de su grupo familiar o social",
      "El comerciante que compra para revender",
      "El profesional que adquiere herramientas para su trabajo"
    ],
    "correct": 1
  },
  {
    "id": "u8-2",
    "unit": 8,
    "q": "El 'consumidor expuesto' (bystander) — quien sin ser parte de la relacion de consumo, esta expuesto a ella — NO tiene proteccion bajo la LDC.",
    "expl": "FALSO. Aunque la reforma de 2014 al CCyC (art. 1092) restringio el bystander, la jurisprudencia y la doctrina mayoritaria reconocen tutela al expuesto (ej. quien sufre dano por publicidad enganosa aunque no haya comprado). Tambien el art. 1 LDC parr. 2 hablaba de quienes 'de cualquier manera estan expuestos'.",
    "src": "estudio",
    "cite": "art. 1 LDC; art. 1092 CCyC",
    "tema": "consumidor",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u8-3",
    "unit": 8,
    "q": "¿Quien NO es PROVEEDOR segun el art. 2 LDC?",
    "expl": "Art. 2 LDC: estan EXCLUIDOS los servicios de los profesionales liberales que requieran titulo universitario y matricula (medicos, abogados, contadores), salvo en lo relativo a la PUBLICIDAD que hagan de su ofrecimiento. La regla es la exclusion.",
    "src": "estudio",
    "cite": "art. 2 LDC",
    "tema": "proveedor",
    "kind": "single",
    "opts": [
      "Una empresa que vende electrodomesticos",
      "Un importador o distribuidor mayorista",
      "Un abogado matriculado que ofrece servicios juridicos",
      "Una concesionaria de automoviles"
    ],
    "correct": 2
  },
  {
    "id": "u8-4",
    "unit": 8,
    "q": "Marque las caracteristicas que debe tener la informacion brindada al consumidor segun el art. 4 LDC:",
    "expl": "Art. 4 LDC: la informacion debe ser CIERTA, CLARA, DETALLADA, EFICAZ y SUFICIENTE, y entregarse en forma GRATUITA al consumidor, con la claridad necesaria para su comprension. Debe ser proporcionada en soporte fisico, salvo aceptacion expresa del consumidor para soporte digital.",
    "src": "estudio",
    "cite": "art. 4 LDC",
    "tema": "consumidor",
    "kind": "multi",
    "opts": [
      "Cierta",
      "Clara",
      "Detallada",
      "Eficaz y suficiente sobre las caracteristicas esenciales del bien o servicio",
      "Gratuita",
      "Oral cuando el consumidor lo prefiera",
      "En idioma del proveedor"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": "u8-5",
    "unit": 8,
    "q": "La publicidad de un producto o servicio NO obliga al proveedor: si el consumidor luego pide el producto en las condiciones publicitadas, el proveedor puede negarse.",
    "expl": "FALSO. Art. 8 LDC: las precisiones formuladas en la publicidad o en anuncios obligan al oferente y se tienen por incluidas en el contrato con el consumidor. Es la consagracion del PRINCIPIO DE LA PUBLICIDAD VINCULANTE.",
    "src": "estudio",
    "cite": "art. 8 LDC",
    "tema": "consumidor",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u8-6",
    "unit": 8,
    "q": "Plazo legal de la garantia para bienes muebles NO consumibles NUEVOS (art. 11 LDC):",
    "expl": "Art. 11 LDC: garantia legal de 6 meses para bienes muebles no consumibles nuevos, contados desde la entrega. Para usados es de 3 meses. Se prolonga por el tiempo en que el bien estuvo en service o privado del uso (art. 16).",
    "src": "estudio",
    "cite": "art. 11 LDC",
    "tema": "garantias",
    "kind": "single",
    "opts": [
      "3 meses",
      "6 meses desde la entrega",
      "1 ano",
      "Indefinido"
    ],
    "correct": 1
  },
  {
    "id": "u8-7",
    "unit": 8,
    "q": "Plazo de garantia para bienes muebles USADOS:",
    "expl": "Art. 11 LDC: 3 meses para bienes usados. La garantia se prolonga por reparaciones (art. 16).",
    "src": "estudio",
    "cite": "art. 11 LDC",
    "tema": "garantias",
    "kind": "single",
    "opts": [
      "3 meses desde la entrega",
      "6 meses desde la entrega",
      "1 mes",
      "No tienen garantia legal"
    ],
    "correct": 0
  },
  {
    "id": "u8-8",
    "unit": 8,
    "q": "Si la reparacion bajo garantia no es satisfactoria, el consumidor puede (art. 17 LDC):",
    "expl": "Art. 17 LDC: cuando la reparacion no resulte satisfactoria, el consumidor puede optar entre: (a) sustitucion, (b) devolucion del importe, (c) quita proporcional. La eleccion es del consumidor.",
    "src": "estudio",
    "cite": "art. 17 LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Solo seguir reclamando reparacion sin opciones adicionales",
      "Pedir sustitucion por bien identico o resolver el contrato con devolucion del importe, o aceptar una quita proporcional del precio",
      "Demandar exclusivamente danos y perjuicios",
      "Iniciar accion penal directamente"
    ],
    "correct": 1
  },
  {
    "id": "u8-9",
    "unit": 8,
    "q": "El DERECHO DE REVOCACION del consumidor en compras a distancia (10 dias, art. 34 LDC) es RENUNCIABLE.",
    "expl": "FALSO. Art. 34 LDC: 'Esta facultad NO puede ser dispensada ni renunciada'. El plazo es de 10 dias corridos desde la entrega o celebracion del contrato. Aplica en venta domiciliaria, telefonica y e-commerce.",
    "src": "estudio",
    "cite": "art. 34 LDC",
    "tema": "consumidor",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u8-10",
    "unit": 8,
    "q": "Plazo del derecho de revocacion en compras online o por venta domiciliaria:",
    "expl": "Art. 34 LDC: 10 dias CORRIDOS, contados desde la entrega o desde la celebracion del contrato, el ultimo. Sin necesidad de invocar causa. Sin penalidad. Los costos de devolucion son del proveedor.",
    "src": "estudio",
    "cite": "art. 34 LDC",
    "tema": "proveedor",
    "kind": "single",
    "opts": [
      "5 dias habiles",
      "10 dias corridos desde la entrega del bien o celebracion del contrato (lo posterior)",
      "15 dias habiles",
      "30 dias corridos"
    ],
    "correct": 1
  },
  {
    "id": "u8-11",
    "unit": 8,
    "q": "Una clausula que invierte la carga de la prueba en perjuicio del consumidor (ej. 'el consumidor debe probar el vicio'):",
    "expl": "Art. 37 inc. c LDC: se tienen por no convenidas las clausulas que 'contengan cualquier precepto que imponga la inversion de la carga de la prueba en perjuicio del consumidor'. Es nulidad absoluta — no requiere declaracion previa.",
    "src": "estudio",
    "cite": "art. 37 LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Es valida si el consumidor la firmo expresamente",
      "Es valida si el contrato es comercial",
      "Se tiene por no escrita / NO convenida (art. 37 inc. c LDC y art. 988 CCyC)",
      "Es nula solo si el juez lo declara expresamente"
    ],
    "correct": 2
  },
  {
    "id": "u8-12",
    "unit": 8,
    "q": "Cuando el dano al consumidor proviene del riesgo o vicio de la cosa o del servicio, responden:",
    "expl": "Art. 40 LDC: respondan solidariamente el productor, fabricante, importador, distribuidor, proveedor, vendedor y quien haya puesto su marca en la cosa. Solo se libera quien demuestre que la causa del dano le ha sido AJENA (fuerza mayor, hecho de la victima o de un tercero por quien no debe responder).",
    "src": "estudio",
    "cite": "art. 40 LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Solo el fabricante",
      "Solo el vendedor que tuvo contacto directo con el consumidor",
      "Solidariamente toda la cadena (productor, fabricante, importador, distribuidor, proveedor, vendedor, quien puso su marca)",
      "Solo el transportista"
    ],
    "correct": 2
  },
  {
    "id": "u8-13",
    "unit": 8,
    "q": "El DANO PUNITIVO (art. 52 bis LDC) es:",
    "expl": "Art. 52 bis LDC (incorporado por Ley 26.361, actualizado por Ley 27.701): multa civil al proveedor que no cumpla sus obligaciones legales o contractuales, a beneficio del consumidor, a instancia del damnificado. Tope: 2.100 CBT (segun Ley 27.701). No es resarcimiento del dano, es funcion disuasoria.",
    "src": "estudio",
    "cite": "art. 52 bis LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Una indemnizacion compensatoria del dano material",
      "Una multa civil a favor del consumidor que el juez puede aplicar a instancia del damnificado, en funcion de la gravedad de la conducta del proveedor, con tope de 2.100 Canastas Basicas Totales (CBT)",
      "Una sancion penal con prision",
      "Una multa administrativa cobrada por el Estado"
    ],
    "correct": 1
  },
  {
    "id": "u8-14",
    "unit": 8,
    "q": "El DANO DIRECTO del art. 40 bis LDC tiene como tope maximo:",
    "expl": "Art. 40 bis LDC: dano directo es el perjuicio o menoscabo al derecho del consumidor susceptible de apreciacion pecuniaria, ocasionado de manera inmediata sobre sus bienes o sobre su persona, como consecuencia de la accion u omision del proveedor. Lo determina la autoridad de aplicacion (administrativa) con tope de 5 CBT.",
    "src": "estudio",
    "cite": "art. 40 bis LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "1 CBT (Canasta Basica Total)",
      "5 CBT",
      "100 CBT",
      "Sin tope"
    ],
    "correct": 1
  },
  {
    "id": "u8-15",
    "unit": 8,
    "q": "La POSICION DOMINANTE de mercado es por si misma ilegal y sancionable.",
    "expl": "FALSO. Art. 4 Ley 25.156 (Defensa de la Competencia): la posicion dominante NO es ilegal en si misma. Lo que es sancionable es el ABUSO de la posicion dominante (precios excesivos, predatory pricing, exclusion de competidores, etc.). Tener cuota alta de mercado no esta prohibido — abusarla si.",
    "src": "estudio",
    "cite": "art. 4 Ley 25.156",
    "tema": "info",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u8-16",
    "unit": 8,
    "q": "El predatory pricing (precios predatorios) es:",
    "expl": "Arts. 1-2 Ley 25.156 (continuada por Ley 27.442): el predatory pricing es vender bajo costo para desplazar competencia y luego subir precios. Es practica horizontal anticompetitiva sancionable por la Autoridad Nacional de la Competencia.",
    "src": "estudio",
    "cite": "arts. 1-2 Ley 25.156/27.442",
    "tema": "competencia",
    "kind": "single",
    "opts": [
      "Vender a un precio justo de mercado",
      "Vender por debajo del costo con el objeto de eliminar a un competidor o impedir su entrada al mercado (practica anticompetitiva — art. 2 inc. m Ley 25.156 / 27.442)",
      "Fijar un precio maximo en acuerdo con el Estado",
      "Aplicar promociones masivas en navidad"
    ],
    "correct": 1
  },
  {
    "id": "u8-17",
    "unit": 8,
    "q": "La publicidad enganosa viola unicamente la Ley de Lealtad Comercial (22.802 / DNU 274/2019), pero no la LDC ni el CCyC.",
    "expl": "FALSO. La publicidad enganosa viola simultaneamente: (i) art. 9 DNU 274/2019 (lealtad comercial), (ii) art. 8 LDC (publicidad vinculante), (iii) arts. 1101-1103 CCyC (publicidad de contratos de consumo). Hay tutela concurrente.",
    "src": "estudio",
    "cite": "art. 9 DNU 274/2019; art. 8 LDC; arts. 1101-1103 CCyC",
    "tema": "lealtad",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u8-18",
    "unit": 8,
    "q": "Asociar cada articulo de la LDC con su contenido principal:",
    "expl": "Las 5 normas de oro de la LDC: 4=informacion, 8 bis=trato digno, 34=revocacion, 40=solidaridad cadena, 52 bis=dano punitivo. Memorizar estos 5 = aprobar U8.",
    "src": "estudio",
    "cite": "LDC 24.240",
    "tema": "info",
    "kind": "reveal",
    "opts": [
      "Solidaridad de toda la cadena de comercializacion ante danos al consumidor",
      "Deber de informacion: cierta, clara, detallada, eficaz y gratuita",
      "Trato digno: prohibicion de practicas vergonzantes, vejatorias o intimidatorias",
      "Derecho de revocacion (10 dias) en venta domiciliaria y a distancia",
      "Dano punitivo: multa civil a beneficio del consumidor, tope 2.100 CBT"
    ],
    "reveal": [
      "Art. 4 LDC → Deber de informacion: cierta, clara, detallada, eficaz y gratuita",
      "Art. 8 bis LDC → Trato digno: prohibicion de practicas vergonzantes, vejatorias o intimidatorias",
      "Art. 34 LDC → Derecho de revocacion (10 dias) en venta domiciliaria y a distancia",
      "Art. 40 LDC → Solidaridad de toda la cadena de comercializacion ante danos al consumidor",
      "Art. 52 bis LDC → Dano punitivo: multa civil a beneficio del consumidor, tope 2.100 CBT"
    ]
  },
  {
    "id": "u8-19",
    "unit": 8,
    "q": "En el caso PACHECO c/ CETROGAR (Cam. Civ. Tucuman 2021), un TV publicitado online a $39.999 cambio a $50.999 en el checkout. La camara condeno a Cetrogar a:",
    "expl": "Caso Pacheco c/Cetrogar: la camara aplico (a) art. 8 LDC (publicidad vinculante), (b) art. 1108 CCyC (oferta electronica vigente mientras este accesible), (c) art. 9 DNU 274/2019 (publicidad enganosa), (d) art. 40 in fine LDC (carga probatoria agravada), (e) art. 52 bis LDC (dano punitivo). Condeno a Cetrogar a entregar el TV al precio publicitado mas $50.000 de dano punitivo.",
    "src": "estudio",
    "cite": "Cam. Civ. Tucuman, 'Pacheco c/Cetrogar', 21/4/2021",
    "tema": "info",
    "kind": "single",
    "opts": [
      "Devolver la diferencia de precio sin mas",
      "Entregar el bien al precio publicitado + dano punitivo de $50.000 (art. 52 bis LDC) por incumplimiento del deber de informacion y la publicidad vinculante",
      "Una multa administrativa unicamente",
      "Nada — declaro que la publicidad no obligaba al proveedor"
    ],
    "correct": 1
  },
  {
    "id": "u8-20",
    "unit": 8,
    "q": "El trato digno (art. 8 bis LDC) prohibe al proveedor adoptar practicas vergonzantes, vejatorias o intimidatorias frente al consumidor. El incumplimiento puede generar dano punitivo.",
    "expl": "VERDADERO. Art. 8 bis LDC (incorporado por Ley 26.361): los proveedores deben garantizar condiciones de atencion y trato digno y equitativo a los consumidores. Practicas vejatorias / vergonzantes habilitan dano punitivo + indemnizaciones.",
    "src": "estudio",
    "cite": "art. 8 bis LDC",
    "tema": "consumidor",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u8-21",
    "unit": 8,
    "q": "La concentracion economica (fusiones, adquisiciones, take-over) en defensa de la competencia esta regulada por:",
    "expl": "Art. 6 Ley 25.156 / 27.442: la concentracion economica esta sujeta a control previo cuando la operacion supere los umbrales de notificacion. La autoridad evalua si la concentracion restringe o distorsiona la competencia.",
    "src": "estudio",
    "cite": "art. 6 Ley 25.156/27.442",
    "tema": "competencia",
    "kind": "single",
    "opts": [
      "LDC 24.240",
      "Ley 25.156 (continuada por Ley 27.442) y debe notificarse a la Autoridad Nacional de la Competencia cuando supera ciertos umbrales",
      "DNU 274/2019 de Lealtad Comercial",
      "El CCyC en su parte de contratos"
    ],
    "correct": 1
  },
  {
    "id": "u8-22",
    "unit": 8,
    "q": "Cuando una clausula contractual con un consumidor desnaturaliza las obligaciones del proveedor o amplia las del consumidor en forma desproporcionada:",
    "expl": "Arts. 37-39 LDC + art. 988 CCyC: las clausulas abusivas se tienen por NO ESCRITAS / NO CONVENIDAS de pleno derecho. No requieren declaracion judicial previa, aunque pueden someterse a control en sede administrativa o judicial.",
    "src": "estudio",
    "cite": "arts. 37-39 LDC; art. 988 CCyC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Es valida porque el consumidor firmo",
      "Se tiene por NO ESCRITA — clausula abusiva (arts. 37-39 LDC + 988 CCyC)",
      "Solo puede ser declarada nula por sentencia judicial firme con dictamen pericial",
      "Es siempre subsanable a pedido del consumidor"
    ],
    "correct": 1
  },
  {
    "id": "u8-23",
    "unit": 8,
    "q": "En relacion al ECOMMERCE / venta a distancia, marque cuales reglas se aplican al consumidor argentino:",
    "expl": "En e-commerce: (i) revocacion 10 dias (34 LDC, irrenunciable); (ii) informacion (4 LDC); (iii) oferta electronica vinculante mientras este accesible (1108 CCyC); (iv) regla de venta a distancia (32-35 LDC). Los costos de devolucion son a cargo del PROVEEDOR. Las garantias legales aplican igual que en compras presenciales.",
    "src": "estudio",
    "cite": "arts. 32-35 LDC; art. 1108 CCyC",
    "tema": "consumidor",
    "kind": "multi",
    "opts": [
      "Derecho de revocacion de 10 dias corridos (art. 34 LDC), irrenunciable",
      "Deber de informacion previa, completa y veraz",
      "Oferta electronica vinculante mientras este accesible (art. 1108 CCyC)",
      "Costos de devolucion a cargo del consumidor",
      "Aplicacion de los arts. 32-35 LDC sobre venta domiciliaria",
      "No aplican garantias legales en compras online"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ]
  },
  {
    "id": "u8-24",
    "unit": 8,
    "q": "Los servicios publicos domiciliarios (luz, gas, agua, telefono) estan regulados por:",
    "expl": "Arts. 25-31 LDC: regimen especial para usuarios de servicios publicos domiciliarios. Incluye obligacion de facturar con claridad, no cobrar mas alla de 1 ano (salvo dolo), prohibicion de cortar el servicio sin previa intimacion, indemnizaciones por interrupciones.",
    "src": "estudio",
    "cite": "arts. 25-31 LDC",
    "tema": "servicios-publicos",
    "kind": "single",
    "opts": [
      "LDC 24.240, arts. 25-31: factura clara, prohibicion de cobrar mas de 1 ano de retroactividad, garantia de provision",
      "Solo por las leyes especiales de cada servicio",
      "Solo el CCyC",
      "Por ningun cuerpo normativo unificado"
    ],
    "correct": 0
  },
  {
    "id": "u8-25",
    "unit": 8,
    "q": "El plazo de garantia se prolonga por el tiempo en que el bien estuvo en service (en reparacion) o en privacion del uso.",
    "expl": "VERDADERO. Art. 16 LDC: la garantia se suspende durante el lapso en que el bien permanezca en service o el consumidor este privado de su uso, y se prolonga por ese mismo tiempo. Si el bien se sustituye, el plazo arranca de nuevo.",
    "src": "estudio",
    "cite": "art. 16 LDC",
    "tema": "consumidor",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-1",
    "unit": 9,
    "q": "Un trabajador firma 'contrato de consultoria autonoma' pero trabaja 9-18 hs en oficina con uniforme, supervisor diario, sin otros clientes. ¿Que principio justifica su recalificacion como contrato de trabajo?",
    "expl": "Primacia de la realidad (arts. 14 + 23 LCT, Perego p. 205): los hechos prevalecen sobre las formas. Si hay subordinacion en los hechos, el contrato es de trabajo aunque las partes lo hayan llamado de otra forma. Combate frontal al fraude laboral.",
    "src": "estudio",
    "cite": "arts. 14, 23 LCT",
    "tema": "principios",
    "kind": "single",
    "opts": [
      "Continuidad de la relacion laboral",
      "Primacia de la realidad",
      "Razonabilidad",
      "Gratuidad"
    ],
    "correct": 1
  },
  {
    "id": "u9-2",
    "unit": 9,
    "q": "El art. 14 de la Constitucion Nacional otorga al trabajador los derechos especificos a la jornada limitada, descanso y vacaciones pagas, y salario minimo vital y movil.",
    "expl": "FALSO — TRAMPA CLASICA. El art. 14 CN garantiza derechos civiles generales (trabajar, comerciar, peticionar, ensenar, etc.). Los derechos LABORALES especificos (jornada limitada, vacaciones, SMVyM, organizacion sindical, huelga, etc.) estan en el art. 14 BIS CN (incorporado por la reforma de 1957).",
    "src": "estudio",
    "cite": "arts. 14 y 14 bis CN",
    "tema": "contrato",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u9-3",
    "unit": 9,
    "q": "¿Cual de las siguientes NO es causal de extincion del contrato de trabajo SIN indemnizacion del art. 245?",
    "expl": "El despido por fuerza mayor o falta de trabajo NO imputable (art. 247 LCT) paga el 50% del art. 245 — NO es sin indemnizacion. Renuncia, periodo de prueba y jubilacion intimada no pagan art. 245.",
    "src": "estudio",
    "cite": "arts. 240, 247, 252 LCT",
    "tema": "modalidades",
    "kind": "single",
    "opts": [
      "Renuncia del trabajador (art. 240)",
      "Despido durante el periodo de prueba con preaviso de 15 dias",
      "Despido por fuerza mayor o falta o disminucion de trabajo no imputable al empleador",
      "Jubilacion intimada por el empleador"
    ],
    "correct": 2
  },
  {
    "id": "u9-4",
    "unit": 9,
    "q": "Durante el PERIODO DE PRUEBA reformado por la Ley Bases 27.742, marque las afirmaciones CORRECTAS:",
    "expl": "Ley Bases 27.742 (julio 2024): periodo de prueba = 6 meses general (antes 3, art. 92 bis LCT). Ampliable a 8 m (medianas) y 12 m (microempresas hasta 5 trab.) por CCT. El despido durante el periodo de prueba NO paga art. 245 (solo SAC y vacaciones proporcionales y dias trabajados). Requiere preaviso de 15 dias. Computa como antiguedad para todos los efectos.",
    "src": "estudio",
    "cite": "art. 92 bis LCT modif. Ley 27.742",
    "tema": "modalidades",
    "kind": "multi",
    "opts": [
      "Duracion general: 6 meses (antes era 3)",
      "Es ampliable hasta 8 meses por CCT en medianas empresas",
      "Es ampliable hasta 12 meses por CCT en microempresas (hasta 5 trabajadores)",
      "El despido durante el periodo de prueba requiere art. 245 completo",
      "Se requiere preaviso de 15 dias para extinguirlo",
      "NO computa como antiguedad para el art. 245 (computa para SAC, vacaciones y aportes)"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ]
  },
  {
    "id": "u9-5",
    "unit": 9,
    "q": "El caso 'Vizzoti, Carlos A. c/AMSA SA' (CSJN, 14/9/2004) establece que el tope del art. 245 LCT (3 veces el promedio del CCT aplicable):",
    "expl": "Fallo Vizzoti CSJN 2004: el tope del art. 245 es constitucional como mecanismo pero NO PUEDE REDUCIR LA BASE DE CALCULO EN MAS DEL 33% del salario real (es decir, debe respetarse al menos el 67% del MRMNH). Sigue plenamente vigente.",
    "src": "estudio",
    "cite": "CSJN, 'Vizzoti c/AMSA', 14/9/2004",
    "tema": "contrato",
    "kind": "single",
    "opts": [
      "Es inconstitucional en todos los casos y debe inaplicarse siempre",
      "No puede reducir mas del 33% la mejor remuneracion mensual, normal y habitual del trabajador (piso constitucional del 67% del salario real)",
      "Es valido sin excepciones, incluso cuando se reduce el salario a menos del 50%",
      "Fue derogado por la Ley Bases 27.742"
    ],
    "correct": 1
  },
  {
    "id": "u9-6",
    "unit": 9,
    "q": "¿Que reforma cambio la BASE DE CALCULO del art. 245 LCT, excluyendo el SAC, los bonos anuales o extraordinarios y todo rubro de pago no habitual o no mensual?",
    "expl": "DNU 70/2023 (diciembre 2023) modifico la base de calculo del art. 245 LCT: excluyo SAC, bonos extraordinarios, participaciones en ganancias, y todo rubro de pago no habitual ni mensual. Tambien derogo las multas de las Leyes 24.013 y 25.323.",
    "src": "estudio",
    "cite": "DNU 70/2023",
    "tema": "remuneracion",
    "kind": "single",
    "opts": [
      "Ley 27.555 (Teletrabajo)",
      "DNU 70/2023 (Bases para la reconstruccion economica)",
      "Ley 23.551 (Asociaciones Sindicales)",
      "Ley 27.802 (Modernizacion Laboral / FAL)"
    ],
    "correct": 1
  },
  {
    "id": "u9-7",
    "unit": 9,
    "q": "Marque las afirmaciones CORRECTAS sobre el contrato a TIEMPO PARCIAL (art. 92 ter LCT):",
    "expl": "Art. 92 ter LCT (Ley 26.474): tiempo parcial = jornada < 2/3 de la habitual; sin horas extras; remuneracion proporcional con piso; contribuciones segun jornada efectiva (NO completa). Si supera los 2/3, se reputa jornada completa por la totalidad. NO es plazo fijo.",
    "src": "estudio",
    "cite": "art. 92 ter LCT",
    "tema": "modalidades",
    "kind": "multi",
    "opts": [
      "Jornada inferior a las 2/3 partes de la habitual del establecimiento",
      "No admite la realizacion de horas extras",
      "La remuneracion no puede ser inferior a la proporcional, segun la jornada efectiva",
      "Las contribuciones patronales se calculan sobre la jornada completa",
      "Si supera los 2/3, se convierte en jornada completa",
      "Es modalidad de plazo fijo"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ]
  },
  {
    "id": "u9-8",
    "unit": 9,
    "q": "El ius variandi (art. 66 LCT) permite al empleador cambiar el domicilio del lugar de trabajo sin limites de distancia ni compensaciones, siempre que no reduzca el salario nominal.",
    "expl": "FALSO. Art. 66 LCT establece tres limites del ius variandi: (1) solo aspectos NO esenciales del contrato; (2) JUSTIFICACION funcional en necesidades de la empresa; (3) NO debe causar perjuicio MATERIAL ni MORAL al trabajador. Un cambio drastico de domicilio (ej. Buenos Aires → Tierra del Fuego) excede claramente esos limites y habilita despido indirecto.",
    "src": "estudio",
    "cite": "art. 66 LCT",
    "tema": "remuneracion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u9-9",
    "unit": 9,
    "q": "La presuncion legal sobre el despido por embarazo o maternidad protegido (art. 178 LCT) abarca un periodo de:",
    "expl": "Art. 178 LCT: se presume iuris tantum que el despido se debe a maternidad o embarazo cuando ocurre dentro de los 7,5 meses anteriores o posteriores al parto. Si el empleador no destruye la presuncion, paga indemnizacion agravada equivalente a 1 ano de remuneraciones (art. 182).",
    "src": "estudio",
    "cite": "arts. 177-182 LCT",
    "tema": "dependencia",
    "kind": "single",
    "opts": [
      "3 meses antes y 3 meses despues del parto",
      "6 meses antes y 6 meses despues del parto",
      "7,5 meses antes y 7,5 meses despues del parto",
      "1 ano antes y 1 ano despues del parto"
    ],
    "correct": 2
  },
  {
    "id": "u9-10",
    "unit": 9,
    "q": "El trabajador en enfermedad inculpable, con mas de 5 anos de antiguedad, tiene 6 meses pagos. Si tiene cargas de familia, ese plazo se duplica a 12 meses.",
    "expl": "VERDADERO. Arts. 208-213 LCT: enfermedad inculpable — antiguedad < 5 anos: 3 meses (6 con cargas familia); antiguedad > 5 anos: 6 meses (12 con cargas familia). Vencidos los plazos pagos, sigue 1 ano de conservacion del empleo sin remuneracion.",
    "src": "estudio",
    "cite": "arts. 208-213 LCT",
    "tema": "remuneracion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-11",
    "unit": 9,
    "q": "En el contrato de trabajo de TEMPORADA (art. 96 LCT), la antiguedad para calcular indemnizacion por despido se computa:",
    "expl": "Fallo Plenario N 50 CNAT 'Bonanata, Emma c/Nestle SA' (13/5/1959): en contratos de temporada se computa unicamente el tiempo efectivamente trabajado, descartando los recesos. Doctrina sigue vigente.",
    "src": "estudio",
    "cite": "art. 96 LCT; Plenario CNAT N 50 'Bonanata'",
    "tema": "modalidades",
    "kind": "single",
    "opts": [
      "Sumando todo el tiempo transcurrido desde el primer contrato, incluyendo los recesos",
      "Solo por la totalidad de los periodos efectivamente trabajados (fallo plenario Bonanata c/Nestle, 1959)",
      "No corresponde indemnizacion",
      "A razon de un mes fijo por cada temporada cumplida"
    ],
    "correct": 1
  },
  {
    "id": "u9-12",
    "unit": 9,
    "q": "Marque cuales son DEBERES del EMPLEADOR conforme la LCT:",
    "expl": "Deberes del empleador: remuneracion, seguridad, ocupacion, no discriminar, libros, formacion profesional, previsional (art. 80). Custodia, fidelidad, no concurrencia, obediencia, diligencia son deberes del TRABAJADOR (arts. 84-88 LCT).",
    "src": "estudio",
    "cite": "arts. 17, 52, 75, 78, 79, 81, 103 LCT",
    "tema": "remuneracion",
    "kind": "multi",
    "opts": [
      "Pago de la remuneracion (arts. 103, 126)",
      "Seguridad y proteccion de la salud psicofisica (art. 75)",
      "Ocupacion efectiva (art. 78)",
      "No discriminacion e igualdad de trato (arts. 17, 81)",
      "Llevar libros laborales (art. 52)",
      "Custodia de los instrumentos de trabajo",
      "Fidelidad y no concurrencia",
      "Formacion profesional"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4,
      7
    ]
  },
  {
    "id": "u9-13",
    "unit": 9,
    "q": "El empleador puede retener hasta el 100% del salario del trabajador para cobrar adelantos, multas internas o danos a los bienes de la empresa.",
    "expl": "FALSO. Art. 130-133 LCT: el empleador NO puede retener mas del 20% del salario en cada periodo de pago. El total de retenciones por todo concepto no puede exceder el 50% del salario. Las multas internas no pueden establecerse: art. 131 prohibe expresamente las sanciones pecuniarias.",
    "src": "estudio",
    "cite": "arts. 130-133 LCT",
    "tema": "remuneracion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u9-14",
    "unit": 9,
    "q": "El Fondo de Asistencia Laboral (FAL), creado por la Ley 27.802 de Modernizacion Laboral (vigente desde marzo 2026), es un aporte mensual del:",
    "expl": "Ley 27.802 (marzo 2026): el FAL es aporte mensual OBLIGATORIO del empleador (1% a 2,5% de la nomina segun rama), administrado por entidades habilitadas por la CNV. Funciona como fondo de cese (modelo construccion). Es tema central del P5 2026.",
    "src": "estudio",
    "cite": "Ley 27.802",
    "tema": "reformas",
    "kind": "single",
    "opts": [
      "Trabajador, equivalente al 0,5% del salario",
      "Empleador, equivalente al 1% a 2,5% de la nomina, administrado por entidades habilitadas por la CNV",
      "Sindicato sobre las cuotas de sus afiliados",
      "Estado a traves de impuestos generales"
    ],
    "correct": 1
  },
  {
    "id": "u9-15",
    "unit": 9,
    "q": "En el despido INDIRECTO (art. 246 LCT) el trabajador cobra indemnizacion plena cuando:",
    "expl": "Art. 246 LCT: el trabajador puede considerarse despedido cuando existe injuria grave del empleador (incumplimiento de sus obligaciones — falta de pago, trabajo en negro, ius variandi abusivo, acoso). DEBE notificarlo por escrito de manera previa o coetanea. Si prueba la causa: cobra igual que sin causa. Si no la prueba: se considera renuncia.",
    "src": "estudio",
    "cite": "art. 246 LCT",
    "tema": "remuneracion",
    "kind": "single",
    "opts": [
      "Notifica verbalmente al empleador que se considera despedido",
      "Prueba que existio un incumplimiento grave del empleador que torna imposible continuar la relacion, habiendolo notificado por escrito",
      "El empleador acepta el despido",
      "Tiene mas de 10 anos de antiguedad"
    ],
    "correct": 1
  },
  {
    "id": "u9-16",
    "unit": 9,
    "q": "Las vacaciones (art. 150 LCT) se calculan dividiendo el salario mensual por 25 — no por 30 — porque la formula es mas favorable al trabajador.",
    "expl": "VERDADERO. Art. 155 LCT: el valor diario del periodo de vacaciones se obtiene dividiendo el sueldo mensual por 25 (no por 30 dias). Es una formula favor del trabajador (mayor valor diario). Aplica el principio protectorio + norma mas favorable.",
    "src": "estudio",
    "cite": "art. 155 LCT",
    "tema": "principios",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-17",
    "unit": 9,
    "q": "¿Que ocurre si el empleador despide a un delegado sindical sin solicitar previamente el DESAFUERO JUDICIAL (Ley 23.551)?",
    "expl": "Arts. 48-52 Ley 23.551: los representantes sindicales (delegados, miembros de comisiones internas) gozan de ESTABILIDAD ESPECIAL. El despido requiere previa exclusion de tutela sindical (desafuero) por juez laboral. Si se despide sin desafuero: el trabajador puede demandar reinstalacion en el puesto + salarios caidos. Es una excepcion a la regla de la estabilidad impropia (que admite despido pagando indemnizacion).",
    "src": "estudio",
    "cite": "arts. 48-52 Ley 23.551",
    "tema": "remuneracion",
    "kind": "single",
    "opts": [
      "Paga indemnizacion del art. 245 unicamente",
      "Paga indemnizacion del art. 247 (50%) por causa atendible",
      "Procede el REINTEGRO al puesto + salarios caidos durante el periodo de cesantia + el plazo del mandato sindical pendiente (estabilidad sindical reforzada)",
      "Solo paga una multa al sindicato"
    ],
    "correct": 2
  },
  {
    "id": "u9-18",
    "unit": 9,
    "q": "Las modalidades de contratacion a plazo (plazo fijo, eventual, temporada) requieren:",
    "expl": "La regla del art. 90 LCT es tiempo indeterminado. Las modalidades a plazo son EXCEPCIONES que requieren: (a) justificacion funcional en la naturaleza de las tareas (ej. cosecha → temporada; obra puntual → plazo fijo); (b) FORMA ESCRITA. Sin estos requisitos, se convierten en tiempo indeterminado.",
    "src": "estudio",
    "cite": "arts. 90, 93, 96, 99 LCT",
    "tema": "modalidades",
    "kind": "single",
    "opts": [
      "Solo acuerdo verbal de las partes",
      "Justificacion funcional en la naturaleza de las tareas y forma escrita",
      "Aprobacion del sindicato con personeria gremial",
      "Autorizacion judicial previa"
    ],
    "correct": 1
  },
  {
    "id": "u9-19",
    "unit": 9,
    "q": "Respecto a la jubilacion intimada por el empleador cuando el trabajador reune los requisitos previsionales (art. 252 LCT), el empleador:",
    "expl": "Art. 252 LCT: cuando el trabajador reune los requisitos para jubilarse, el empleador puede intimarlo para que inicie los tramites. El empleador debe mantenerlo en el puesto durante 1 ano (mientras tramita). Vencido el plazo: extincion automatica SIN INDEMNIZACION. Solo se liquidan: SAC proporcional, vacaciones proporcionales y dias trabajados.",
    "src": "estudio",
    "cite": "art. 252 LCT",
    "tema": "remuneracion",
    "kind": "single",
    "opts": [
      "Paga indemnizacion del art. 245 completo",
      "NO paga indemnizacion del art. 245 (el trabajador pasa al sistema previsional)",
      "Paga art. 247 (50%)",
      "Depende del CCT aplicable"
    ],
    "correct": 1
  },
  {
    "id": "u9-20",
    "unit": 9,
    "q": "La RENUNCIA del trabajador (art. 240 LCT) debe formalizarse mediante telegrama colacionado o carta documento, con personal identificacion ante el correo. El despacho es gratuito para el trabajador.",
    "expl": "VERDADERO. Art. 240 LCT: la renuncia debe instrumentarse por despacho telegrafico colacionado, personalmente o por carta documento, con identificacion ante la oficina postal. Las empresas de correos estan obligadas a despacharlo en forma gratuita para el trabajador. Sin esta forma: la renuncia carece de validez.",
    "src": "estudio",
    "cite": "art. 240 LCT",
    "tema": "extincion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-21",
    "unit": 9,
    "q": "Marque cuales son SANCIONES DISCIPLINARIAS validas conforme al art. 67 LCT (poder disciplinario del empleador):",
    "expl": "Art. 67 LCT: las sanciones validas son amonestacion, suspension (max 30 dias al ano) y despido con justa causa. Las multas pecuniarias estan PROHIBIDAS (art. 131 LCT). Reduccion salarial y castigos fisicos violan la dignidad del trabajador.",
    "src": "estudio",
    "cite": "arts. 67, 131, 220, 243 LCT",
    "tema": "extincion",
    "kind": "multi",
    "opts": [
      "Amonestacion (verbal o escrita)",
      "Suspension de hasta 30 dias al ano (sin goce de haberes — art. 220 LCT)",
      "Despido con justa causa (forma escrita + causa clara, art. 243 LCT)",
      "Reduccion del salario en forma unilateral",
      "Multas pecuniarias internas",
      "Castigos fisicos",
      "Descuento por roturas accidentales superior al 50% del salario"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "u9-22",
    "unit": 9,
    "q": "El SAC (aguinaldo) se calcula como el 50% de la mayor remuneracion mensual devengada por todo concepto dentro del semestre respectivo, en virtud de la modificacion de la Ley 27.073 (2015).",
    "expl": "VERDADERO. Art. 121 LCT (modif. Ley 27.073, 2015): el SAC equivale al 50% de la mayor remuneracion mensual devengada por todos los conceptos dentro de los semestres que finalizan el 30/6 y el 31/12 (ahora 18/12). Antes era 1/12 del total del semestre.",
    "src": "estudio",
    "cite": "art. 121 LCT modif. Ley 27.073",
    "tema": "remuneracion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-23",
    "unit": 9,
    "q": "El derecho de HUELGA del art. 14 bis CN:",
    "expl": "Art. 14 bis CN parr. 2: 'Queda garantizado a los GREMIOS... el derecho de huelga'. Es derecho COLECTIVO, ejercido por la asociacion sindical. Requiere conciliacion obligatoria previa (Ley 14.786) por 15 + 5 dias. La autoridad puede declarar la conciliacion. La huelga ilegal puede ser sancionada disciplinariamente.",
    "src": "estudio",
    "cite": "art. 14 bis CN; Ley 14.786",
    "tema": "contrato",
    "kind": "single",
    "opts": [
      "Es un derecho individual del trabajador, sin necesidad de estructura sindical",
      "Esta garantizado a los GREMIOS, requiere proceso de conciliacion obligatoria previa (Ley 14.786) y debe ejercerse pacificamente",
      "Es un derecho absoluto, sin limites",
      "Solo se puede ejercer ante la Justicia"
    ],
    "correct": 1
  },
  {
    "id": "u9-24",
    "unit": 9,
    "q": "El sindicato con PERSONERIA GREMIAL (Ley 23.551) tiene la facultad de:",
    "expl": "Art. 31 Ley 23.551: la asociacion sindical con personeria gremial es la mas representativa del ambito y goza de derechos exclusivos: (i) representar a los trabajadores ante el empleador y el Estado; (ii) negociar y firmar CCT; (iii) administrar obras sociales; (iv) ejercer el derecho de huelga. Otorgada por el MTEySS a la asociacion con mas afiliados cotizantes en los ultimos 6 meses.",
    "src": "estudio",
    "cite": "arts. 25, 31 Ley 23.551",
    "tema": "deberes",
    "kind": "single",
    "opts": [
      "Solo afiliar trabajadores",
      "Negociar y celebrar Convenios Colectivos de Trabajo (CCT), administrar obras sociales, ejercer la representacion exclusiva de la actividad y ejercer la accion directa (huelga)",
      "Crear sus propias normas laborales por encima de la LCT",
      "Sancionar disciplinariamente a empleadores"
    ],
    "correct": 1
  },
  {
    "id": "u9-25",
    "unit": 9,
    "q": "Asociar cada articulo / fallo con su contenido principal:",
    "expl": "5 normas clave: 9 LCT (in dubio pro operario), 23 LCT (presuncion), 245 LCT (formula indemnizatoria), Vizzoti (piso 67%), 245 bis (despido discriminatorio Ley Bases). Memorizar = puntos seguros.",
    "src": "estudio",
    "cite": "LCT 20.744 + CSJN 2004 + Ley 27.742",
    "tema": "principios",
    "kind": "reveal",
    "opts": [
      "Indemnizacion por despido sin causa = MRMNH × anos de antiguedad",
      "Tope del art. 245 no puede reducir mas del 33% del salario real",
      "Despido discriminatorio: art. 245 + agravante 50%-100%",
      "In dubio pro operario",
      "Presuncion de contrato de trabajo por la sola prestacion de servicios"
    ],
    "reveal": [
      "Art. 9 LCT → In dubio pro operario",
      "Art. 23 LCT → Presuncion de contrato de trabajo por la sola prestacion de servicios",
      "Art. 245 LCT → Indemnizacion por despido sin causa = MRMNH × anos de antiguedad",
      "Fallo Vizzoti (CSJN 2004) → Tope del art. 245 no puede reducir mas del 33% del salario real",
      "Art. 245 bis LCT (Ley Bases) → Despido discriminatorio: art. 245 + agravante 50%-100%"
    ]
  },
  {
    "id": "mix-1",
    "unit": 0,
    "q": "Una SAS unipersonal contrata a un trabajador en relacion de dependencia. El socio unico es despues sancionado por la IGJ por fraude. ¿Es responsable solidariamente con la sociedad por las obligaciones laborales del trabajador?",
    "expl": "Conexion U6-U9: cuando la sociedad se usa para defraudar derechos laborales, el art. 54 LGS (inoponibilidad) hace responsables solidaria e ilimitadamente a los socios y controlantes. Es el 'corrimiento del velo'. Aplicable tambien a SAS y a obligaciones laborales (incluso ART, no incluido aqui). Atencion: la CSJN en 'Palomeque c/Benemeth' (2003) fijo un criterio RESTRICTIVO: la inoponibilidad es excepcional y exige probar que la sociedad es ficticia o fraudulenta.",
    "src": "estudio",
    "cite": "art. 54 LGS + arts. 14, 23 LCT",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "No: el principio de la personalidad juridica protege siempre al socio",
      "Si: si la SAS fue utilizada como pantalla para defraudar derechos laborales, se aplica el art. 54 LGS (inoponibilidad de la personalidad juridica) y el socio responde solidariamente",
      "Solo si el trabajador inicia accion penal",
      "Depende solo del CCT aplicable"
    ],
    "correct": 1
  },
  {
    "id": "mix-2",
    "unit": 0,
    "q": "Un contrato de franquicia (art. 1512 CCyC) ¿genera responsabilidad del franquiciante frente al CONSUMIDOR por danos causados por el franquiciado?",
    "expl": "Conexion U7-U8: el art. 1520 CCyC dispone que el franquiciante NO responde por los actos del franquiciado, salvo respecto del CONSUMIDOR donde rige la solidaridad del art. 40 LDC (toda la cadena responde, incluido quien puso su marca). El franquiciante es 'quien puso su marca' en el bien o servicio.",
    "src": "estudio",
    "cite": "art. 1520 CCyC; art. 40 LDC",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "No: el franquiciante es ajeno a la relacion de consumo",
      "Si: el franquiciante responde frente al consumidor en los terminos del art. 40 LDC (solidaridad de la cadena) y del art. 1520 CCyC (responsabilidad por puesta de marca)",
      "Solo si el franquiciante lo asume contractualmente",
      "Solo si el dano es por publicidad enganosa"
    ],
    "correct": 1
  },
  {
    "id": "mix-3",
    "unit": 0,
    "q": "Un trabajador en relacion de dependencia que celebra una compraventa de un electrodomestico para uso propio del hogar es simultaneamente sujeto del derecho laboral y del derecho del consumidor. Ambos regimenes le otorgan el caracter de 'parte mas debil' protegida.",
    "expl": "VERDADERO. Conexion U8-U9: tanto la LDC como la LCT protegen a la parte 'mas debil' (consumidor / trabajador) frente a la 'mas fuerte' (proveedor / empleador). Son dos universos paralelos con la misma logica protectoria, aunque con tecnicas distintas: orden publico laboral (irrenunciabilidad art. 12 LCT) y orden publico de consumo (art. 65 LDC).",
    "src": "estudio",
    "cite": "art. 65 LDC; art. 12 LCT",
    "tema": "integradora",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "mix-4",
    "unit": 0,
    "q": "Una SRL alquila un inmueble a otra empresa para usarlo como deposito comercial. El plazo del contrato es de 1 ano. ¿Es valido el plazo?",
    "expl": "Conexion U6-U7: el plazo minimo de 3 anos (Ley 27.551, post-DNU 70/2023 vuelve a 2 anos por art. 1198 CCyC) aplica solo a locaciones con destino VIVIENDA. Las locaciones comerciales o de otros destinos siguen la libertad de plazos (con el tope de 50 anos para inmuebles, art. 1197 CCyC). La SRL puede ser locataria sin problema (capacidad para celebrar contratos en su objeto).",
    "src": "estudio",
    "cite": "arts. 1197-1198 CCyC; Ley 27.551",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "No: el plazo minimo es siempre 3 anos",
      "Si: la locacion para destino COMERCIAL no esta sometida al plazo minimo de 3 anos (Ley 27.551 / 2 anos del CCyC). Solo el destino VIVIENDA tiene plazo minimo",
      "Si, pero requiere autorizacion judicial",
      "No: las SRL no pueden celebrar locaciones"
    ],
    "correct": 1
  },
  {
    "id": "mix-5",
    "unit": 0,
    "q": "Marque cuales de los siguientes contratos REQUIEREN forma escrita / instrumento publico bajo el CCyC:",
    "expl": "Conexion U7-U9: requieren forma especial — escritura publica: inmuebles (1017), donaciones de inmuebles (1552); telegrama o CD: renuncia laboral (240 LCT); escritura publica o ante autoridad: mutuo acuerdo extintivo (241 LCT). NO requieren forma especial: contrato de trabajo en general, locacion (no requiere escritura, alcanza con instrumento privado), franquicia (escrito pero no escritura publica).",
    "src": "estudio",
    "cite": "arts. 1015-1017 CCyC; arts. 240-241 LCT",
    "tema": "integradora",
    "kind": "multi",
    "opts": [
      "Contrato de compraventa de un inmueble (escritura publica — art. 1017)",
      "Contrato de trabajo (forma libre, salvo modalidades a plazo)",
      "Renuncia del trabajador (telegrama colacionado o carta documento — art. 240 LCT)",
      "Mutuo acuerdo extintivo del contrato de trabajo (escritura publica o ante autoridad — art. 241 LCT)",
      "Donacion de bienes inmuebles (escritura publica — art. 1552 CCyC)",
      "Locacion para vivienda con plazo 3 anos (siempre escritura publica)",
      "Contrato de franquicia"
    ],
    "correct": [
      0,
      2,
      3,
      4
    ]
  },
  {
    "id": "mix-6",
    "unit": 0,
    "q": "Un consumidor compra online un producto y sufre un dano por defecto. La cadena de comercializacion incluye: fabricante (SA del art. 299), distribuidor (SRL), y vendedor minorista (SAS). El consumidor demanda. ¿A quien puede dirigir la accion?",
    "expl": "Conexion U6-U8: art. 40 LDC consagra la SOLIDARIDAD DE TODA LA CADENA (productor, fabricante, importador, distribuidor, proveedor, vendedor, marca). El consumidor elige a quien demandar — el principio favor consumitor. Los responsables pueden luego repetir entre si segun el principio de relacion causal interna. La forma juridica (SA, SRL, SAS) no altera la responsabilidad solidaria.",
    "src": "estudio",
    "cite": "art. 40 LDC",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "Solo al vendedor con quien tuvo trato directo",
      "Al fabricante exclusivamente, porque es el unico responsable por defectos del producto",
      "A toda la cadena solidariamente (fabricante, distribuidor y vendedor) — art. 40 LDC. Cada uno puede luego repetir contra el responsable directo",
      "Solo a la SAS por ser la mas pequena"
    ],
    "correct": 2
  },
  {
    "id": "mix-7",
    "unit": 0,
    "q": "Una microempresa que contrata su PRIMER trabajador bajo la Ley Bases 27.742. ¿Cual es el periodo de prueba ampliable maximo aplicable?",
    "expl": "Conexion reformas-U9: Ley Bases 27.742 fijo el periodo de prueba en 6 meses GENERAL, ampliable POR CCT hasta 8 m (medianas) o 12 m (microempresas hasta 5 trabajadores). Si la microempresa contrata su primer empleado y el CCT lo preve, puede llegar a 12 meses. Sin CCT, sigue siendo 6 meses.",
    "src": "estudio",
    "cite": "art. 92 bis LCT modif. Ley 27.742",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "6 meses (regla general)",
      "8 meses (medianas empresas)",
      "12 meses (microempresas hasta 5 trabajadores), si esta previsto en CCT",
      "Sin periodo de prueba — proteccion absoluta del primer empleado"
    ],
    "correct": 2
  },
  {
    "id": "mix-8",
    "unit": 0,
    "q": "Tanto en el contrato de trabajo (art. 23 LCT) como en el contrato de consumo (art. 3 LDC) rige el principio de IN DUBIO PRO la parte mas debil, con criterios analogos de interpretacion.",
    "expl": "VERDADERO. Conexion U8-U9: art. 9 LCT (in dubio pro operario) + art. 3 LDC (in dubio pro consumidor — interpretacion del contrato y de la ley en favor del consumidor). Son la misma logica del orden publico protectorio aplicada en dos universos.",
    "src": "estudio",
    "cite": "art. 9 LCT; art. 3 LDC",
    "tema": "integradora",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "mix-9",
    "unit": 0,
    "q": "Un trabajador firma un contrato 'aceptando renunciar al SAC' a cambio de un bono extraordinario. Posteriormente reclama el SAC. ¿Cual es el resultado?",
    "expl": "Conexion U7-U9: principio de irrenunciabilidad (art. 12 LCT) — toda convencion que reduzca derechos legales es NULA. Ni siquiera con compensacion economica es valida la renuncia. El art. 12 LCT funciona como tope al art. 944 CCyC (validez de las renuncias). El trabajador cobra el SAC + se queda con el bono (sin perjuicio de eventuales recalificaciones tributarias).",
    "src": "estudio",
    "cite": "art. 12 LCT; art. 944 CCyC",
    "tema": "integradora",
    "kind": "single",
    "opts": [
      "La renuncia es valida porque hubo compensacion",
      "La renuncia es nula — el SAC es irrenunciable (art. 12 LCT) y forma parte del orden publico laboral. El trabajador puede cobrar el SAC sin perjuicio del bono",
      "Solo es valida si la renuncia se homologo ante el Ministerio de Trabajo",
      "El trabajador debe devolver el bono y entonces puede cobrar el SAC"
    ],
    "correct": 1
  },
  {
    "id": "u6-21",
    "unit": 6,
    "q": "Conforme al art. 55 LGS, los socios de una SRL tienen derecho a:",
    "expl": "Art. 55 LGS: los socios pueden examinar los libros y papeles sociales y exigir del administrador los informes que estimen pertinentes. Es el derecho de informacion, complementado por el derecho a la rendicion de cuentas (art. 67 LGS). Tiene mayor amplitud en SRL sin sindicatura.",
    "src": "estudio",
    "cite": "arts. 55, 67 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "Solo retirar dividendos al cierre del ejercicio",
      "Examinar los libros sociales y exigir al gerente los informes que estimen pertinentes — derecho de informacion",
      "Despedir directamente a los administradores",
      "Aprobar individualmente cada contrato de la sociedad"
    ],
    "correct": 1
  },
  {
    "id": "u6-22",
    "unit": 6,
    "q": "En una sociedad de la Seccion IV LGS, el contrato social puede oponerse entre los socios pero NO frente a terceros, salvo que se pruebe que estos lo conocian al contratar.",
    "expl": "VERDADERO. Art. 22 LGS (reforma 2015): el contrato puede invocarse entre socios; respecto de terceros es oponible solo si se prueba que estos lo conocian al contratar. Es regla de seguridad de las relaciones con terceros.",
    "src": "estudio",
    "cite": "art. 22 LGS",
    "tema": "seccion-iv",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-26",
    "unit": 7,
    "q": "Los VICIOS DEL CONSENTIMIENTO regulados en los arts. 265-278 CCyC, que pueden anular un contrato, son:",
    "expl": "Los vicios del consentimiento del CCyC: (i) ERROR esencial sobre la naturaleza, persona, cualidad sustancial (arts. 265-270); (ii) DOLO — afirmacion de lo falso, disimulacion (arts. 271-275); (iii) VIOLENCIA o intimidacion — temor fundado (arts. 276-278); (iv) LESION (art. 332) — explotacion de necesidad, inexperiencia o debilidad psiquica para obtener una ventaja patrimonial notoriamente desproporcionada. Habilitan nulidad relativa.",
    "src": "estudio",
    "cite": "arts. 265-278, 332 CCyC",
    "tema": "vicios",
    "kind": "single",
    "opts": [
      "Solo el error de hecho",
      "Error esencial, dolo, violencia (fisica o moral / intimidacion) y lesion subjetiva-objetiva (art. 332)",
      "Solo la falta de capacidad",
      "Cualquier divergencia con el precio de mercado"
    ],
    "correct": 1
  },
  {
    "id": "u7-27",
    "unit": 7,
    "q": "El dolo como vicio del consentimiento contractual (art. 271 CCyC) consiste en toda asercion falsa o disimulacion de lo verdadero, cualquier artificio o engano, mediante el cual se induce a la otra parte a celebrar un contrato que no habria celebrado o lo habria hecho en condiciones distintas.",
    "expl": "VERDADERO. Art. 271 CCyC: definicion literal de dolo. Para anular el contrato debe ser esencial (sobre elemento determinante) y haber causado dano. El dolo incidental (afecta condiciones secundarias) no anula, pero da derecho a danos.",
    "src": "estudio",
    "cite": "arts. 271-272 CCyC",
    "tema": "vicios",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u8-26",
    "unit": 8,
    "q": "Los CARTELES o acuerdos colusivos entre competidores (fijacion concertada de precios, reparto de mercados o clientes, manipulacion de licitaciones publicas) constituyen:",
    "expl": "Art. 2 Ley 27.442 (continuadora de la 25.156): los acuerdos entre competidores para fijar precios, repartir mercados, manipular licitaciones o restringir produccion constituyen PRACTICAS HORIZONTALES NULAS Y ABSOLUTAMENTE PROHIBIDAS. La Autoridad Nacional de la Competencia puede imponer multas de hasta 30% de la facturacion. En casos graves, hay responsabilidad penal (Codigo Penal arts. 300, 300 bis).",
    "src": "estudio",
    "cite": "arts. 1-2 Ley 27.442",
    "tema": "proveedor",
    "kind": "single",
    "opts": [
      "Practica permitida si todos los competidores estan de acuerdo",
      "Practica anticompetitiva HORIZONTAL absolutamente prohibida (art. 2 Ley 27.442), sancionable con multas y, en casos graves, accion penal",
      "Solo una infraccion administrativa menor",
      "Conducta permitida en sectores regulados"
    ],
    "correct": 1
  },
  {
    "id": "u9-26",
    "unit": 9,
    "q": "Marque cuales de los siguientes pueden constituir CAUSALES de DESPIDO CON JUSTA CAUSA (art. 242 LCT — 'injuria grave que torna imposible la continuacion del vinculo'):",
    "expl": "Art. 242 LCT: injuria grave = falta que por su gravedad torna imposible la continuacion del vinculo. Causales tipicas: inasistencias reiteradas, insubordinacion, hurto, falsificacion, agresion, embriaguez probada, abandono de tareas, perdida de confianza por dolo. NO son justa causa: faltas leves aisladas (proporcionalidad), segundo empleo (salvo no concurrencia), embarazo (despido discriminatorio prohibido). El estandar es de PROPORCIONALIDAD y la causa debe expresarse por escrito (art. 243) e invariable.",
    "src": "estudio",
    "cite": "arts. 242-243 LCT",
    "tema": "dependencia",
    "kind": "multi",
    "opts": [
      "Inasistencias reiteradas e injustificadas",
      "Insubordinacion grave / negativa a cumplir directivas legitimas",
      "Hurto, sustraccion o danos dolosos a bienes de la empresa",
      "Falsificacion de documentos (certificados medicos, registros)",
      "Agresion fisica o verbal grave a superiores o companeros",
      "Una unica llegada tarde sin antecedentes disciplinarios",
      "Tener un segundo empleo legal y sin competencia",
      "Embarazo de la trabajadora"
    ],
    "correct": [
      0,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": "u9-27",
    "unit": 9,
    "q": "Las suspensiones por causas economicas o disciplinarias del trabajador (arts. 218-221 LCT) sumadas en un ano no pueden exceder:",
    "expl": "Art. 222 LCT: la totalidad de suspensiones (disciplinarias del 220 + por falta o disminucion de trabajo del 221 + por fuerza mayor del 221 in fine) no puede exceder los 75 dias en el periodo de 1 ano. La disciplinaria sola tiene tope de 30 dias al ano. Excedido el limite total, el trabajador puede considerarse despedido (despido indirecto).",
    "src": "estudio",
    "cite": "arts. 218-222 LCT",
    "tema": "extincion",
    "kind": "single",
    "opts": [
      "30 dias en total",
      "75 dias en total",
      "100 dias en total",
      "No hay limite legal"
    ],
    "correct": 1
  },
  {
    "id": "mix-10",
    "unit": 0,
    "q": "Asociar cada principio rector con su universo / orden publico de aplicacion:",
    "expl": "Los principios protectorios se replican entre unidades: U9 (operario), U8 (consumidor), comun (buena fe), U8 (solidaridad), U7 (forma).",
    "src": "estudio",
    "cite": "art. 9 LCT; art. 3 LDC; art. 9 CCyC; art. 40 LDC; arts. 1015-1017 CCyC",
    "tema": "integradora",
    "kind": "reveal",
    "opts": [
      "U7 — contratos formales (inmuebles, donacion inmuebles)",
      "U8 — interpretacion del contrato de consumo",
      "U9 — interpretacion de la LCT y CCT",
      "U8 — responsabilidad por dano del producto / servicio",
      "U7-U8-U9 — comun a todos los contratos / relaciones"
    ],
    "reveal": [
      "In dubio pro operario → U9 — interpretacion de la LCT y CCT",
      "In dubio pro consumidor → U8 — interpretacion del contrato de consumo",
      "Buena fe (CCyC + LCT) → U7-U8-U9 — comun a todos los contratos / relaciones",
      "Solidaridad de la cadena → U8 — responsabilidad por dano del producto / servicio",
      "Forma escrita ad solemnitatem → U7 — contratos formales (inmuebles, donacion inmuebles)"
    ]
  },
  {
    "id": "u6-23",
    "unit": 6,
    "q": "Respecto de los aportes dinerarios al constituir una SA o SRL, que porcentaje minimo debe integrarse al momento de la suscripcion?",
    "expl": "En los aportes en dinero debe integrarse minimo el 25% al suscribir y completarse el saldo en un plazo no mayor a 2 anos. Suscribir es comprometerse a aportar; integrar es desembolsar efectivamente.",
    "src": "estudio",
    "cite": "art. 149 LGS (SRL) / art. 187 LGS (SA)",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "10%, y el saldo en 1 ano",
      "25%, y el saldo en un plazo no mayor a 2 anos",
      "50%, y el saldo en 5 anos",
      "100% al suscribir, sin excepciones"
    ],
    "correct": 1
  },
  {
    "id": "u6-24",
    "unit": 6,
    "q": "Los aportes en especie (bienes no dinerarios) pueden integrarse de a poco igual que los aportes en dinero, alcanzando con el 25% al constituir la sociedad.",
    "expl": "Los aportes en especie deben integrarse en su totalidad (100%) al constituir la sociedad. Solo los aportes dinerarios admiten integracion diferida (25% al suscribir, saldo en 2 anos).",
    "src": "estudio",
    "cite": "art. 149 LGS / art. 187 LGS",
    "tema": "capital",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u6-25",
    "unit": 6,
    "q": "En una sociedad colectiva, como responden los socios por las obligaciones sociales?",
    "expl": "En la sociedad colectiva los socios responden en forma subsidiaria (primero se ejecuta a la sociedad), ilimitada y solidaria. Es el tipo de maxima exposicion patrimonial.",
    "src": "estudio",
    "cite": "art. 125 LGS",
    "tema": "responsabilidad",
    "kind": "single",
    "opts": [
      "De forma limitada al aporte realizado",
      "En forma subsidiaria, ilimitada y solidaria",
      "Solo el socio administrador responde ilimitadamente",
      "No responden: solo responde la sociedad con su patrimonio"
    ],
    "correct": 1
  },
  {
    "id": "u6-26",
    "unit": 6,
    "q": "En la sociedad en comandita simple existen dos clases de socios. Como responde cada una?",
    "expl": "En la comandita simple los comanditados responden como los socios de la colectiva (subsidiaria, ilimitada, solidaria) y los comanditarios limitan su responsabilidad al capital comprometido. Los comanditarios no pueden administrar.",
    "src": "estudio",
    "cite": "art. 134 LGS",
    "tema": "responsabilidad",
    "kind": "single",
    "opts": [
      "Ambos responden limitadamente al aporte",
      "Los comanditados responden ilimitada y solidariamente; los comanditarios solo hasta el capital comprometido",
      "Los comanditarios responden ilimitadamente; los comanditados solo hasta su aporte",
      "Todos responden ilimitadamente pero no solidariamente"
    ],
    "correct": 1
  },
  {
    "id": "u6-27",
    "unit": 6,
    "q": "Asocia cada forma del nombre social con su definicion.",
    "expl": "La razon social incluye el nombre de socios y se usa en tipos con responsabilidad ilimitada (colectiva, comandita). La denominacion social es un nombre de fantasia con el aditamento del tipo, propia de SRL, SA y SAS.",
    "src": "estudio",
    "cite": "art. 126 LGS (razon social) / arts. 147, 164 LGS (denominacion)",
    "tema": "concepto",
    "kind": "reveal",
    "opts": [
      "Nombre de fantasia mas la indicacion del tipo (SA/SRL/SAS), sin comprometer el nombre de socios",
      "Se forma con el nombre de uno o mas socios e implica la responsabilidad ilimitada de quienes figuran"
    ],
    "reveal": [
      "Razon social → Se forma con el nombre de uno o mas socios e implica la responsabilidad ilimitada de quienes figuran",
      "Denominacion social → Nombre de fantasia mas la indicacion del tipo (SA/SRL/SAS), sin comprometer el nombre de socios"
    ]
  },
  {
    "id": "u6-28",
    "unit": 6,
    "q": "Que tipo de asamblea es competente para reformar el estatuto de una SA?",
    "expl": "La reforma del estatuto excede la competencia de la asamblea ordinaria (art. 234: balance, distribucion de ganancias, eleccion de organos) y corresponde a la asamblea extraordinaria.",
    "src": "estudio",
    "cite": "art. 235 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "El directorio, por decision propia",
      "La asamblea ordinaria",
      "La asamblea extraordinaria",
      "La sindicatura"
    ],
    "correct": 2
  },
  {
    "id": "u6-29",
    "unit": 6,
    "q": "Cual es el quorum minimo para que sesione una asamblea EXTRAORDINARIA de una SA en primera convocatoria?",
    "expl": "La asamblea extraordinaria en primera convocatoria requiere quorum del 60% de las acciones con derecho a voto (salvo mayor exigencia estatutaria); en segunda baja al 30%. La ordinaria exige mayoria en primera y sesiona con cualquier capital en segunda.",
    "src": "estudio",
    "cite": "art. 244 LGS",
    "tema": "organos",
    "kind": "single",
    "opts": [
      "Mayoria de las acciones con derecho a voto",
      "60% de las acciones con derecho a voto (salvo que el estatuto exija mas)",
      "30% de las acciones con derecho a voto",
      "Cualquiera sea el capital presente"
    ],
    "correct": 1
  },
  {
    "id": "u6-30",
    "unit": 6,
    "q": "Las acciones de voto plural (privilegiadas en el voto), que limite tienen?",
    "expl": "Las acciones de voto plural confieren hasta 5 votos por accion ordinaria, pero no pueden emitirse luego de que la sociedad fue autorizada a hacer oferta publica de sus acciones.",
    "src": "estudio",
    "cite": "art. 216 LGS",
    "tema": "acciones",
    "kind": "single",
    "opts": [
      "Pueden otorgar hasta 10 votos por accion sin restriccion",
      "Otorgan hasta 5 votos por accion y no se admiten en sociedades que hacen oferta publica",
      "Otorgan 1 voto por accion como todas las demas",
      "No existen en el derecho argentino"
    ],
    "correct": 1
  },
  {
    "id": "u6-31",
    "unit": 6,
    "q": "Cuales de las siguientes son causales de disolucion de una sociedad segun el art. 94 LGS?",
    "expl": "El art. 94 enumera, entre otras: vencimiento del plazo, cumplimiento o imposibilidad del objeto, decision de los socios, perdida del capital social y declaracion de quiebra. El aumento de capital NO es causal de disolucion.",
    "src": "estudio",
    "cite": "art. 94 LGS",
    "tema": "disolucion",
    "kind": "multi",
    "opts": [
      "Vencimiento del plazo de duracion",
      "Cumplimiento del objeto o imposibilidad sobreviniente de lograrlo",
      "Decision de los socios",
      "Aumento del capital social"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "u6-32",
    "unit": 6,
    "q": "La reduccion a uno del numero de socios es causal de disolucion automatica e inmediata de cualquier sociedad.",
    "expl": "Tras la reforma de 2015 la reduccion a uno NO disuelve: la sociedad puede continuar. Si en 3 meses no se recompone la pluralidad o no se transforma, el socio unico responde ilimitada y solidariamente por las obligaciones contraidas.",
    "src": "estudio",
    "cite": "art. 94 bis LGS",
    "tema": "disolucion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u6-33",
    "unit": 6,
    "q": "En la transformacion de una sociedad (por ejemplo de SRL a SA), que sucede con su personalidad juridica?",
    "expl": "La transformacion es el cambio de tipo societario. No implica disolucion ni creacion de una persona nueva: la sociedad conserva personalidad, patrimonio, derechos y obligaciones; solo cambia de molde tipico.",
    "src": "estudio",
    "cite": "art. 74 LGS",
    "tema": "reorganizacion",
    "kind": "single",
    "opts": [
      "Se extingue la sociedad y nace una persona juridica nueva y distinta",
      "No se disuelve ni se altera la personalidad: es el mismo sujeto bajo otro tipo",
      "Se crean dos sociedades a partir de la original",
      "La sociedad pierde su patrimonio y debe reconstituirlo"
    ],
    "correct": 1
  },
  {
    "id": "u6-34",
    "unit": 6,
    "q": "Asocia cada figura de reorganizacion societaria con su descripcion.",
    "expl": "Transformacion (74): cambio de tipo sin perder personalidad. Fusion (82): union, las fusionantes se disuelven sin liquidarse. Escision (88): division del patrimonio. Disolucion (94): inicio de la liquidacion.",
    "src": "estudio",
    "cite": "arts. 74, 82, 88, 94 LGS",
    "tema": "reorganizacion",
    "kind": "reveal",
    "opts": [
      "Una sociedad adopta otro tipo societario conservando su personalidad",
      "Dos o mas sociedades se disuelven sin liquidarse para crear una nueva, o una incorpora a otra(s)",
      "Una sociedad destina parte de su patrimonio a crear o integrar otra(s) sociedad(es)",
      "Apertura de la etapa de liquidacion para extinguir la sociedad"
    ],
    "reveal": [
      "Transformacion → Una sociedad adopta otro tipo societario conservando su personalidad",
      "Fusion → Dos o mas sociedades se disuelven sin liquidarse para crear una nueva, o una incorpora a otra(s)",
      "Escision → Una sociedad destina parte de su patrimonio a crear o integrar otra(s) sociedad(es)",
      "Disolucion → Apertura de la etapa de liquidacion para extinguir la sociedad"
    ]
  },
  {
    "id": "u6-35",
    "unit": 6,
    "q": "La reserva legal en una SA o SRL: que porcentaje de las ganancias liquidas y realizadas debe destinarse y hasta que tope?",
    "expl": "Las sociedades por acciones y de responsabilidad limitada deben destinar no menos del 5% de las ganancias liquidas y realizadas de cada ejercicio a la reserva legal, hasta alcanzar el 20% del capital social.",
    "src": "estudio",
    "cite": "art. 70 LGS",
    "tema": "capital",
    "kind": "single",
    "opts": [
      "No menos del 5% anual hasta alcanzar el 20% del capital social",
      "El 10% anual hasta alcanzar el 50% del capital",
      "El 1% por unica vez",
      "No existe obligacion de constituir reserva legal"
    ],
    "correct": 0
  },
  {
    "id": "u6-36",
    "unit": 6,
    "q": "Como regla, los dividendos solo pueden distribuirse a los socios si provienen de ganancias liquidas y realizadas resultantes de un balance aprobado.",
    "expl": "Esta prohibido distribuir ganancias que no resulten de ganancias liquidas y realizadas surgidas de un balance regular y aprobado. Los dividendos pagados en violacion son repetibles, salvo buena fe del socio.",
    "src": "estudio",
    "cite": "art. 68 LGS",
    "tema": "capital",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u6-37",
    "unit": 6,
    "q": "Que organismo lleva el Registro Publico en la Ciudad de Buenos Aires y que efecto tiene la inscripcion del contrato constitutivo?",
    "expl": "En CABA el Registro Publico es llevado por la IGJ (en las provincias, los registros locales). La sociedad ya tiene personalidad desde su constitucion, pero la inscripcion la hace regular y oponible frente a terceros.",
    "src": "estudio",
    "cite": "arts. 5 y 7 LGS",
    "tema": "inscripcion",
    "kind": "single",
    "opts": [
      "La AFIP; la inscripcion otorga el CUIT",
      "La IGJ; la inscripcion hace oponible el contrato a terceros y regular a la sociedad",
      "La CNV; la inscripcion habilita la oferta publica",
      "El BCRA; la inscripcion autoriza a operar como entidad financiera"
    ],
    "correct": 1
  },
  {
    "id": "u7-28",
    "unit": 7,
    "q": "En el CCyC, salvo pacto en contrario, la sena o arras entregada al celebrar un contrato se considera:",
    "expl": "El art. 1059 CCyC invierte el criterio del viejo Codigo: la sena se interpreta como CONFIRMATORIA (confirma el contrato y se imputa a la prestacion), salvo que se pacte expresamente la facultad de arrepentirse (penitencial, art. 1060).",
    "src": "estudio",
    "cite": "arts. 1059-1060 CCyC",
    "tema": "parte-general",
    "kind": "single",
    "opts": [
      "Penitencial: permite arrepentirse perdiendo la sena o devolviendola doblada",
      "Confirmatoria: como principio de ejecucion y a cuenta de la prestacion",
      "Una clausula penal que sustituye la indemnizacion de danos",
      "Nula por falta de causa si no se escritura"
    ],
    "correct": 1
  },
  {
    "id": "u7-29",
    "unit": 7,
    "q": "Con clausula resolutoria expresa (pacto comisorio expreso), la resolucion opera por la sola comunicacion a la parte incumplidora, sin necesidad de intimacion previa.",
    "expl": "Con pacto comisorio EXPRESO (art. 1086) la resolucion opera de pleno derecho al comunicar la voluntad de resolver, sin requerimiento previo. Con la clausula resolutoria IMPLICITA (1087-1088) se exige intimacion con plazo no menor a 15 dias.",
    "src": "estudio",
    "cite": "arts. 1086-1088 CCyC",
    "tema": "extincion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-30",
    "unit": 7,
    "q": "Una persona entrega un auto usado valuado en 9 millones mas 1 millon en efectivo a cambio de un auto nuevo de 10 millones. Como se califica el contrato?",
    "expl": "Cuando se entrega parte cosa y parte dinero, se resuelve por el valor relativo (art. 1126): si el valor de la cosa es mayor que el del dinero, es permuta; si el dinero es igual o mayor, es compraventa. Aqui la cosa (9M) supera al dinero (1M): permuta.",
    "src": "estudio",
    "cite": "arts. 1126 y 1172-1175 CCyC",
    "tema": "compraventa",
    "kind": "single",
    "opts": [
      "Compraventa, porque hay dinero involucrado",
      "Donacion con cargo",
      "Permuta, porque el valor de la cosa entregada supera al del dinero",
      "Suministro de bienes"
    ],
    "correct": 2
  },
  {
    "id": "u7-31",
    "unit": 7,
    "q": "Asocie cada clasificacion contractual con su ejemplo tipico.",
    "expl": "Aleatorio (968): las ventajas dependen de un hecho incierto. Gratuito (967): una parte recibe ventaja sin contraprestacion. Plurilateral: varias partes con interes comun. Tracto sucesivo: ejecucion prolongada en el tiempo.",
    "src": "estudio",
    "cite": "arts. 966-970 CCyC",
    "tema": "clasificacion",
    "kind": "reveal",
    "opts": [
      "Contrato de seguro o renta vitalicia",
      "Donacion o comodato",
      "Contrato de sociedad",
      "Locacion o suministro"
    ],
    "reveal": [
      "Aleatorio → Contrato de seguro o renta vitalicia",
      "Gratuito → Donacion o comodato",
      "Plurilateral → Contrato de sociedad",
      "Tracto sucesivo → Locacion o suministro"
    ]
  },
  {
    "id": "u7-32",
    "unit": 7,
    "q": "En el contrato de agencia, al extinguirse el vinculo el agente que aporto clientela que sigue generando beneficios al proponente tiene derecho a:",
    "expl": "El art. 1497 reconoce al agente, a la extincion, una indemnizacion por la clientela aportada que siga produciendo ventajas al empresario. El art. 1498 fija el tope: no mayor a un ano de remuneraciones (promedio anual).",
    "src": "estudio",
    "cite": "arts. 1497-1498 CCyC",
    "tema": "agencia",
    "kind": "single",
    "opts": [
      "Continuar promoviendo los negocios por seis meses mas",
      "Una indemnizacion por clientela, con tope de un ano de comisiones promedio",
      "Adquirir la cartera de clientes a precio de mercado",
      "Nada, porque actua sin relacion de dependencia"
    ],
    "correct": 1
  },
  {
    "id": "u7-33",
    "unit": 7,
    "q": "Diferencia central entre el contrato de agencia y el de concesion respecto del riesgo comercial:",
    "expl": "El agente (1479) PROMUEVE negocios por cuenta del proponente sin comprar la mercaderia y cobra comision. El concesionario (1502) actua por cuenta PROPIA: compra al concedente y revende, asumiendo el riesgo comercial.",
    "src": "estudio",
    "cite": "arts. 1479 y 1502 CCyC",
    "tema": "agencia",
    "kind": "single",
    "opts": [
      "El agente compra la mercaderia y la revende asumiendo el riesgo; el concesionario solo promueve",
      "El agente promueve negocios sin comprar (cobra comision); el concesionario compra y revende por cuenta propia asumiendo el riesgo",
      "Ambos compran la mercaderia, solo cambia la exclusividad",
      "Ninguno asume riesgo porque actuan por cuenta del principal"
    ],
    "correct": 1
  },
  {
    "id": "u7-34",
    "unit": 7,
    "q": "El contrato de mandato se presume gratuito; el mandatario solo cobra honorarios si se pacto expresamente.",
    "expl": "Es al reves: el art. 1322 presume que el mandato es ONEROSO. Si se quiere gratuito hay que pactarlo. A falta de acuerdo sobre el monto, lo fijan las leyes, los usos o el juez.",
    "src": "estudio",
    "cite": "art. 1322 CCyC",
    "tema": "mandato",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u7-35",
    "unit": 7,
    "q": "En el mandato SIN representacion, los efectos de los actos que el mandatario celebra con terceros:",
    "expl": "En el mandato sin representacion (1321) el mandatario actua en NOMBRE PROPIO pero por cuenta del mandante; los efectos recaen sobre el, que luego transfiere al mandante. Con representacion (1320) recaen directamente sobre el mandante.",
    "src": "estudio",
    "cite": "arts. 1320-1321 CCyC",
    "tema": "mandato",
    "kind": "single",
    "opts": [
      "Recaen directamente sobre el mandante, que queda obligado frente al tercero",
      "Recaen sobre el mandatario, que actua en nombre propio y luego traslada los resultados al mandante",
      "No producen efecto hasta la ratificacion del mandante",
      "Obligan solidariamente a mandante y mandatario frente al tercero"
    ],
    "correct": 1
  },
  {
    "id": "u7-36",
    "unit": 7,
    "q": "En la locacion, la diferencia entre sublocacion y cesion de la posicion contractual del locatario es que:",
    "expl": "En la sublocacion (1213-1216) el locatario celebra un nuevo contrato con un tercero y sigue obligado frente al locador. En la cesion transmite integramente su posicion al cesionario, que pasa a ser el nuevo locatario.",
    "src": "estudio",
    "cite": "arts. 1213-1216 CCyC",
    "tema": "locacion",
    "kind": "single",
    "opts": [
      "La sublocacion crea un nuevo contrato entre locatario y tercero; la cesion transmite integramente la posicion del locatario al cesionario",
      "Son sinonimos, el CCyC los trata igual",
      "La sublocacion requiere escritura publica; la cesion no",
      "La cesion solo procede en locaciones comerciales"
    ],
    "correct": 0
  },
  {
    "id": "u7-37",
    "unit": 7,
    "q": "El locatario de un inmueble habitacional puede resolver anticipadamente el contrato luego de transcurridos seis meses, con preaviso y pagando la indemnizacion legal.",
    "expl": "El art. 1221 habilita al locatario a resolver anticipadamente pasados los primeros 6 meses, con preaviso. La indemnizacion es de un mes y medio de alquiler si ocurre en el primer ano, y de un mes si es despues.",
    "src": "estudio",
    "cite": "art. 1221 CCyC",
    "tema": "locacion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u7-38",
    "unit": 7,
    "q": "En el contrato de obra, el sistema por el cual se pacta un precio unico y global, asumiendo el contratista el riesgo de los mayores costos, se denomina:",
    "expl": "En el ajuste alzado se fija un precio unico, global e invariable: el contratista asume el riesgo de los mayores costos. En coste y costas el comitente paga el costo real mas un honorario; por unidad de medida se paga por cada unidad ejecutada.",
    "src": "estudio",
    "cite": "contrato de obra, arts. 1251 y ss. CCyC",
    "tema": "obra",
    "kind": "single",
    "opts": [
      "Coste y costas",
      "Por unidad de medida",
      "Ajuste alzado",
      "Administracion delegada"
    ],
    "correct": 2
  },
  {
    "id": "u7-39",
    "unit": 7,
    "q": "Sobre la responsabilidad por ruina de una obra sobre inmueble destinada a larga duracion (art. 1273 CCyC), indique las afirmaciones CORRECTAS:",
    "expl": "El art. 1273 establece responsabilidad por ruina durante 10 anos desde la recepcion. Responden constructor, proyectista y director segun su intervencion (1274). Es de orden publico: el 1276 anula toda clausula que la dispense. No requiere dolo: basta vicio del suelo, materiales o construccion.",
    "src": "estudio",
    "cite": "arts. 1273-1276 CCyC",
    "tema": "obra",
    "kind": "multi",
    "opts": [
      "El plazo de garantia es de 10 anos desde la recepcion de la obra",
      "Pueden responder, ademas del constructor, el proyectista y el director de obra",
      "Es una responsabilidad de orden publico, no dispensable por pacto",
      "Solo responde si la ruina deriva de dolo probado del contratista"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "u7-40",
    "unit": 7,
    "q": "En la cesion de un credito a titulo oneroso, salvo pacto en contrario, el cedente garantiza:",
    "expl": "Por regla el cedente garantiza la EXISTENCIA y LEGITIMIDAD del credito (art. 1628), pero NO la solvencia del deudor (art. 1629): ese riesgo lo asume el cesionario, salvo pacto de garantia de solvencia, conocimiento de la insolvencia, o creditos futuros.",
    "src": "estudio",
    "cite": "arts. 1628-1629 CCyC",
    "tema": "cesion",
    "kind": "single",
    "opts": [
      "La existencia y legitimidad del credito al tiempo de la cesion, pero no la solvencia del deudor",
      "Tanto la existencia del credito como la solvencia presente y futura del deudor",
      "Unicamente que notificara al deudor cedido",
      "Nada: el cesionario asume todos los riesgos"
    ],
    "correct": 0
  },
  {
    "id": "u7-41",
    "unit": 7,
    "q": "El estipulante conviene con el promitente que este pague una suma a un tercero (por ejemplo, un seguro de vida a favor de un hijo). Que regimen aplica?",
    "expl": "Es una excepcion al efecto relativo (1021). El art. 1027 regula la estipulacion a favor de tercero: el beneficiario, aunque no sea parte, puede exigir directamente al promitente el cumplimiento una vez que la acepta. El seguro de vida es el ejemplo clasico.",
    "src": "estudio",
    "cite": "art. 1027 CCyC",
    "tema": "efectos",
    "kind": "single",
    "opts": [
      "Es nulo por violar el efecto relativo del contrato",
      "Contrato a favor de tercero: el beneficiario puede exigir directamente la prestacion al promitente",
      "Solo es valido si el tercero firma el contrato",
      "Es una cesion de derechos que requiere notificacion al tercero"
    ],
    "correct": 1
  },
  {
    "id": "u7-42",
    "unit": 7,
    "q": "Una empresa alquila una terraza por un dia, a precio muy alto, solo para que sus clientes vean un desfile aereo, que luego es cancelado por la autoridad. El frustrado puede:",
    "expl": "Es el caso clasico de frustracion del fin (art. 1090): una alteracion extraordinaria y sobreviniente, ajena a las partes, frustra la finalidad que integraba la causa. Faculta a resolver. Se distingue de la imprevision (1091), donde la prestacion sigue posible pero se vuelve excesivamente onerosa.",
    "src": "estudio",
    "cite": "art. 1090 CCyC",
    "tema": "extincion",
    "kind": "single",
    "opts": [
      "Nada: rige pacta sunt servanda y debe pagar igual",
      "Invocar la frustracion de la finalidad del contrato y pedir su resolucion",
      "Invocar vicios redhibitorios de la terraza",
      "Exigir la sustitucion por otro evento equivalente"
    ],
    "correct": 1
  },
  {
    "id": "u8-27",
    "unit": 8,
    "q": "Segun el art. 50 LDC, cual es el plazo de prescripcion de las acciones y sanciones de la Ley de Defensa del Consumidor?",
    "expl": "El art. 50 LDC fija la prescripcion en 3 anos. Si por otra ley resultara un plazo distinto, se aplica el mas favorable al consumidor. (La prescripcion en defensa de la competencia es de 5 anos, no confundir.)",
    "src": "estudio",
    "cite": "art. 50 LDC",
    "tema": "procedimiento",
    "kind": "single",
    "opts": [
      "1 ano",
      "2 anos",
      "3 anos",
      "5 anos"
    ],
    "correct": 2
  },
  {
    "id": "u8-28",
    "unit": 8,
    "q": "Cuales son requisitos que las asociaciones de consumidores deben acreditar para su reconocimiento (art. 57 LDC)?",
    "expl": "El art. 57 exige independencia: no actividad politica partidaria, independencia de actividad comercial, no recibir aportes de empresas y sus publicaciones no pueden tener avisos publicitarios. Son personas juridicas SIN fines de lucro.",
    "src": "estudio",
    "cite": "art. 57 LDC",
    "tema": "asociaciones",
    "kind": "multi",
    "opts": [
      "No participar en actividades politicas partidarias",
      "Ser independientes de toda actividad profesional, comercial y productiva",
      "No recibir donaciones ni aportes de empresas comerciales o proveedoras",
      "Tener fines de lucro para autofinanciarse"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "u8-29",
    "unit": 8,
    "q": "Un consumidor inicia una accion judicial individual por incumplimiento de la LDC. Respecto de las costas y la tasa de justicia:",
    "expl": "El art. 53 LDC otorga beneficio de justicia gratuita a las acciones por derechos individuales. La parte demandada puede acreditar la solvencia del consumidor para hacer cesar el beneficio.",
    "src": "estudio",
    "cite": "art. 53 LDC",
    "tema": "procedimiento",
    "kind": "single",
    "opts": [
      "Debe pagar la tasa de justicia como cualquier juicio civil",
      "Goza del beneficio de justicia gratuita, salvo que el demandado acredite la solvencia del actor",
      "Solo las asociaciones de consumidores tienen gratuidad, no el consumidor individual",
      "La gratuidad solo rige en acciones colectivas"
    ],
    "correct": 1
  },
  {
    "id": "u8-30",
    "unit": 8,
    "q": "En una operacion de venta de credito, el contrato omite consignar la tasa de interes efectiva anual y el costo financiero total. Cual es la consecuencia (art. 36 LDC)?",
    "expl": "El art. 36 exige, bajo pena de nulidad, consignar precio al contado, monto financiado, tasa de interes efectiva anual, costo financiero total, sistema de amortizacion y cantidad de pagos. Su omision acarrea nulidad. El tribunal competente es el del domicilio del consumidor.",
    "src": "estudio",
    "cite": "art. 36 LDC",
    "tema": "clausulas",
    "kind": "single",
    "opts": [
      "El contrato es valido pero el proveedor recibe un apercibimiento",
      "La nulidad del contrato o de la clausula, por exigirse esos datos bajo pena de nulidad",
      "El consumidor pierde el derecho a reclamar si ya firmo",
      "Solo se aplica una multa administrativa sin afectar el contrato"
    ],
    "correct": 1
  },
  {
    "id": "u8-31",
    "unit": 8,
    "q": "Asocia cada sancion del art. 47 LDC con su descripcion.",
    "expl": "El art. 47 enumera: apercibimiento, multa, decomiso, clausura hasta 30 dias, suspension hasta 5 anos en registros de proveedores del Estado, y perdida de concesiones. La graduacion (49) considera perjuicio, beneficio y reincidencia.",
    "src": "estudio",
    "cite": "art. 47 LDC",
    "tema": "procedimiento",
    "kind": "reveal",
    "opts": [
      "Llamado de atencion formal, sin contenido patrimonial",
      "Perdida de las mercaderias objeto de la infraccion",
      "Cierre del establecimiento por hasta 30 dias",
      "Exclusion de hasta 5 anos de los registros de proveedores del Estado"
    ],
    "reveal": [
      "Apercibimiento → Llamado de atencion formal, sin contenido patrimonial",
      "Decomiso → Perdida de las mercaderias objeto de la infraccion",
      "Clausura → Cierre del establecimiento por hasta 30 dias",
      "Suspension en registros → Exclusion de hasta 5 anos de los registros de proveedores del Estado"
    ]
  },
  {
    "id": "u8-32",
    "unit": 8,
    "q": "La Ley 24.240 es de orden publico, por lo que sus disposiciones son irrenunciables y cualquier pacto en contrario es nulo.",
    "expl": "El art. 65 LDC declara que la ley es de orden publico. Por eso derechos como la garantia legal (11) o la revocacion (34) no pueden dispensarse ni renunciarse, y las clausulas que los limiten se tienen por no escritas (37).",
    "src": "estudio",
    "cite": "art. 65 LDC",
    "tema": "clausulas",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u8-33",
    "unit": 8,
    "q": "Segun el art. 3 LDC, como se resuelve una duda interpretativa y con que normas se integra la LDC?",
    "expl": "El art. 3 consagra el in dubio pro consumidor (en duda, interpretacion mas favorable al consumidor) y la integracion normativa con la Ley 25.156/27.442 (competencia) y la Ley 22.802/DNU 274/2019 (lealtad comercial).",
    "src": "estudio",
    "cite": "art. 3 LDC",
    "tema": "consumidor",
    "kind": "single",
    "opts": [
      "Interpretacion mas favorable al proveedor; se integra con el Codigo Penal",
      "Interpretacion mas favorable al consumidor; se integra con las leyes de defensa de la competencia y lealtad comercial",
      "Regla del derecho comun sin presunciones; no se integra con ninguna otra ley",
      "Se remite siempre al CCyC con preferencia sobre la LDC"
    ],
    "correct": 1
  },
  {
    "id": "u8-34",
    "unit": 8,
    "q": "La Ley 25.156 creo el Tribunal Nacional de Defensa de la Competencia. Cuantos miembros y que perfiles minimos exige?",
    "expl": "El art. 18 Ley 25.156 exige 7 miembros: al menos 2 abogados y 2 profesionales en ciencias economicas, con mas de 5 anos de profesion. En la practica el TNDC nunca se constituyo; la Ley 27.442 creo la Autoridad Nacional de la Competencia (ANC).",
    "src": "estudio",
    "cite": "art. 18 Ley 25.156",
    "tema": "competencia",
    "kind": "single",
    "opts": [
      "3 miembros, todos abogados",
      "5 miembros, al menos 1 economista",
      "7 miembros, de los cuales al menos 2 abogados y 2 profesionales en ciencias economicas",
      "9 miembros designados por sorteo entre jueces"
    ],
    "correct": 2
  },
  {
    "id": "u8-35",
    "unit": 8,
    "q": "Una concentracion economica supera el umbral del art. 8. En que plazo debe expedirse la autoridad y que ocurre si no resuelve?",
    "expl": "El art. 13 obliga a autorizar, condicionar o denegar dentro de 45 dias. Si transcurre ese plazo sin resolucion, opera la autorizacion tacita (14), con los mismos efectos que la expresa.",
    "src": "estudio",
    "cite": "arts. 13-14 Ley 25.156",
    "tema": "competencia",
    "kind": "single",
    "opts": [
      "10 dias; si no resuelve, la operacion queda denegada",
      "45 dias; si no resuelve, hay autorizacion tacita",
      "90 dias; si no resuelve, se inicia un nuevo expediente",
      "1 ano; si no resuelve, interviene la justicia penal"
    ],
    "correct": 1
  },
  {
    "id": "u8-36",
    "unit": 8,
    "q": "Cuales de las siguientes operaciones estan EXCEPTUADAS del deber de notificacion previa de concentraciones (art. 10)?",
    "expl": "El art. 10 exceptua, entre otras: adquisiciones donde ya se posee mas del 50%, por una unica empresa extranjera sin activos previos, y operaciones por debajo del umbral minimo. Una fusion horizontal entre las dos mayores empresas SI debe notificarse: es el mayor riesgo competitivo.",
    "src": "estudio",
    "cite": "art. 10 Ley 25.156",
    "tema": "competencia",
    "kind": "multi",
    "opts": [
      "Adquisiciones de empresas de las que el comprador ya posee mas del 50% de las acciones",
      "Una fusion horizontal entre las dos mayores empresas del mercado",
      "Adquisiciones por una unica empresa extranjera sin activos ni participaciones previas en el pais",
      "Operaciones cuyos activos en el pais no superan el monto minimo legal"
    ],
    "correct": [
      0,
      2,
      3
    ]
  },
  {
    "id": "u8-37",
    "unit": 8,
    "q": "En los servicios publicos domiciliarios, la empresa debe aplicar para los reintegros a favor del usuario los mismos criterios que usa para los cargos por mora (reciprocidad).",
    "expl": "El art. 26 LDC consagra la reciprocidad: si la empresa cobra intereses por mora a una tasa, debe aplicar la misma al reintegrar sumas al usuario. El art. 27 obliga ademas a habilitar un registro de reclamos.",
    "src": "estudio",
    "cite": "art. 26 LDC",
    "tema": "servicios-publicos",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u8-38",
    "unit": 8,
    "q": "Conforme la Ley 22.802, cuando puede usarse una denominacion de origen geografica (por ejemplo Vino de Mendoza)?",
    "expl": "El art. 7 Ley 22.802 prohibe usar una denominacion de origen cuando el producto no provenga de la zona respectiva. Las denominaciones genericas (art. 8), que pasaron a ser nombre del tipo de producto, son de uso libre.",
    "src": "estudio",
    "cite": "art. 7 Ley 22.802",
    "tema": "lealtad",
    "kind": "single",
    "opts": [
      "Siempre: las denominaciones geograficas son de uso libre",
      "Solo si el producto proviene efectivamente de la zona respectiva",
      "Solo si la empresa paga un canon a la provincia",
      "Unicamente para productos exportados"
    ],
    "correct": 1
  },
  {
    "id": "u8-39",
    "unit": 8,
    "q": "El certificado de garantia contiene una clausula que dice que la garantia caduca si el producto se traslada a otra provincia. Que valor tiene esa clausula?",
    "expl": "El art. 14 LDC exige que el certificado conste por escrito con condiciones, validez, plazo y lugar de reparacion, y dispone que cualquier clausula que contrarie esas normas es nula y se tiene por no escrita. Una caducidad arbitraria desnaturaliza la garantia de orden publico.",
    "src": "estudio",
    "cite": "art. 14 LDC",
    "tema": "garantias",
    "kind": "single",
    "opts": [
      "Es valida porque consta por escrito en el certificado",
      "Es nula y se tiene por no escrita, por contrariar las normas del articulo",
      "Es valida solo si el consumidor la firmo expresamente",
      "Obliga al consumidor pero le da derecho a una rebaja del precio"
    ],
    "correct": 1
  },
  {
    "id": "u8-40",
    "unit": 8,
    "q": "Las asociaciones de consumidores legalmente reconocidas tienen legitimacion para iniciar acciones judiciales colectivas en defensa de intereses de incidencia colectiva de los consumidores.",
    "expl": "El art. 55 LDC reconoce a las asociaciones de consumidores legitimacion para accionar judicialmente cuando resulten objetivamente afectados o amenazados intereses de los consumidores. Es la base de las acciones colectivas de consumo (art. 54 regula el alcance de la cosa juzgada).",
    "src": "estudio",
    "cite": "arts. 54-55 LDC",
    "tema": "asociaciones",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u8-41",
    "unit": 8,
    "q": "Quien debe soportar los costos de traslado de un producto pesado para hacer efectiva la garantia legal (art. 13 LDC)?",
    "expl": "El art. 13 LDC dispone que son solidariamente responsables del otorgamiento y cumplimiento de la garantia los productores, importadores, distribuidores y vendedores; y los gastos de flete y seguro para hacerla efectiva son a cargo del responsable de la garantia, no del consumidor.",
    "src": "estudio",
    "cite": "arts. 12-13 LDC",
    "tema": "garantias",
    "kind": "single",
    "opts": [
      "El consumidor, que debe llevarlo al service por su cuenta",
      "El responsable de la garantia: los gastos de flete y seguro son a su cargo",
      "Se reparten en partes iguales entre consumidor y proveedor",
      "El fabricante solo si el producto pesa mas de 50 kg"
    ],
    "correct": 1
  },
  {
    "id": "u9-28",
    "unit": 9,
    "q": "El trabajo de casas particulares (servicio domestico) se rige principalmente por:",
    "expl": "El personal de casas particulares tiene un regimen especial: Ley 26.844 (2013), con estatuto propio, tribunal especifico, periodo de prueba de hasta 30 dias y categorias. La LCT se aplica supletoriamente. Es relacion de dependencia con estatuto propio.",
    "src": "estudio",
    "cite": "Ley 26.844",
    "tema": "especiales",
    "kind": "single",
    "opts": [
      "La LCT 20.744 sin ninguna modificacion",
      "La Ley 26.844 (Regimen Especial para el Personal de Casas Particulares), que desplaza a la LCT",
      "Un contrato civil de locacion de servicios, por no haber subordinacion",
      "El Codigo Rural provincial"
    ],
    "correct": 1
  },
  {
    "id": "u9-29",
    "unit": 9,
    "q": "El trabajador agrario se rige por la LCT general; no existe un regimen especial para esa actividad.",
    "expl": "El trabajo agrario tiene su propio Regimen de Trabajo Agrario: Ley 26.727 (2011), que regula jornada, descansos, vivienda, contratacion permanente y por temporada (cosecha). La LCT se aplica supletoriamente.",
    "src": "estudio",
    "cite": "Ley 26.727",
    "tema": "especiales",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "u9-30",
    "unit": 9,
    "q": "Una empresa contrata a otra para un servicio correspondiente a su actividad normal y especifica (ej. limpieza industrial en una fabrica). Respecto de los trabajadores de la contratista, la empresa principal:",
    "expl": "Art. 30 LCT: quien contrate o subcontrate trabajos correspondientes a su actividad normal y especifica debe exigir el cumplimiento de las normas laborales y previsionales, y responde SOLIDARIAMENTE por las obligaciones respecto del personal afectado.",
    "src": "estudio",
    "cite": "art. 30 LCT",
    "tema": "deberes",
    "kind": "single",
    "opts": [
      "No tiene ninguna responsabilidad: es un tercero ajeno",
      "Responde solidariamente por las obligaciones laborales y de seguridad social, debiendo exigir el cumplimiento de las normas (art. 30 LCT)",
      "Solo responde si el contratista quiebra",
      "Solo responde por los accidentes, no por salarios"
    ],
    "correct": 1
  },
  {
    "id": "u9-31",
    "unit": 9,
    "q": "Marque las afirmaciones CORRECTAS sobre la TRANSFERENCIA del establecimiento (arts. 225-228 LCT):",
    "expl": "Arts. 225-228: la transferencia NO extingue los contratos (continuidad); el adquirente se subroga y el trabajador mantiene antiguedad y condiciones. Transmitente y adquirente responden solidariamente por las obligaciones existentes (228). Si hay perjuicio que justifica la ruptura, el trabajador puede considerarse despedido (226).",
    "src": "estudio",
    "cite": "arts. 225-228 LCT",
    "tema": "deberes",
    "kind": "multi",
    "opts": [
      "El adquirente se subroga en los contratos de trabajo existentes (continuidad)",
      "El trabajador conserva la antiguedad y las condiciones adquiridas",
      "Transmitente y adquirente responden solidariamente por las obligaciones existentes al momento de la transmision",
      "La transferencia extingue automaticamente todos los contratos",
      "Si la transferencia causa un perjuicio que justifica la ruptura, el trabajador puede considerarse despedido"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ]
  },
  {
    "id": "u9-32",
    "unit": 9,
    "q": "Conforme al art. 31 LCT, las empresas que integran un conjunto economico permanente responden solidariamente por las obligaciones laborales cuando:",
    "expl": "Art. 31 LCT: las empresas relacionadas que constituyan un conjunto economico permanente responden solidariamente SOLO cuando hayan mediado maniobras fraudulentas o conduccion temeraria. No basta con la mera existencia del grupo.",
    "src": "estudio",
    "cite": "art. 31 LCT",
    "tema": "deberes",
    "kind": "single",
    "opts": [
      "Comparten el mismo CCT",
      "Hayan mediado maniobras fraudulentas o conduccion temeraria",
      "Tienen el mismo domicilio fiscal",
      "Siempre, en cualquier caso"
    ],
    "correct": 1
  },
  {
    "id": "u9-33",
    "unit": 9,
    "q": "Conforme al art. 113 LCT, las PROPINAS habituales y no prohibidas:",
    "expl": "Art. 113 LCT: cuando el trabajador tuviese oportunidad de obtener ganancias (propinas), estas integran la remuneracion si son habituales y no estan prohibidas. Es una remuneracion abonada por un tercero (mozos, mucamas de hotel).",
    "src": "estudio",
    "cite": "art. 113 LCT",
    "tema": "remuneracion",
    "kind": "single",
    "opts": [
      "Nunca integran la remuneracion",
      "Se consideran parte de la remuneracion cuando son habituales y no estan prohibidas",
      "Son siempre un beneficio social no remunerativo",
      "Solo cuentan si las paga el empleador"
    ],
    "correct": 1
  },
  {
    "id": "u9-34",
    "unit": 9,
    "q": "Sobre el PAGO de la remuneracion (arts. 124-129 LCT), marque las afirmaciones CORRECTAS:",
    "expl": "El pago se hace en dias habiles, en el lugar de trabajo y en horas de labor (129); en efectivo, cheque o cuenta sueldo (124). Estan prohibidos los sustitutos de moneda (125) y pagar en lugares de esparcimiento (129). Mensualizados: 4 dias habiles (128). El recibo es obligatorio (138-140).",
    "src": "estudio",
    "cite": "arts. 124-129 LCT",
    "tema": "remuneracion",
    "kind": "multi",
    "opts": [
      "Debe pagarse en dias habiles, en el lugar de trabajo y en horas de prestacion",
      "Puede abonarse en efectivo, cheque a la orden del trabajador o cuenta sueldo",
      "El pago en mercaderias, vales o fichas (sustitutos de moneda) esta prohibido",
      "Para mensualizados, vence dentro del cuarto dia habil del mes siguiente",
      "Puede pagarse en bares o lugares de esparcimiento",
      "El recibo de sueldo es facultativo para el empleador"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ]
  },
  {
    "id": "u9-35",
    "unit": 9,
    "q": "En la enfermedad inculpable, respecto del aviso y el control medico (arts. 209-210 LCT):",
    "expl": "Art. 209: el trabajador debe dar aviso de la enfermedad y su ubicacion durante la primera jornada de imposibilidad; mientras no avise pierde la remuneracion, salvo acreditacion inequivoca posterior. Art. 210: debe someterse al control del facultativo designado por el empleador.",
    "src": "estudio",
    "cite": "arts. 209-210 LCT",
    "tema": "licencias",
    "kind": "single",
    "opts": [
      "El trabajador no tiene obligacion de avisar; basta el certificado al reintegrarse",
      "El trabajador debe avisar de la enfermedad y del lugar donde se encuentra en la primera jornada; mientras no lo haga pierde la remuneracion, salvo que la enfermedad luego se acredite inequivocamente",
      "El empleador no puede ejercer control medico alguno",
      "El control medico solo lo realiza la obra social del trabajador"
    ],
    "correct": 1
  },
  {
    "id": "u9-36",
    "unit": 9,
    "q": "Sobre el CERTIFICADO DE TRABAJO (art. 80 LCT), la multa por falta de entrega equivale a:",
    "expl": "Art. 80 LCT: al extinguirse la relacion el empleador debe entregar el certificado de trabajo. Si no lo hace tras intimacion fehaciente, abona una indemnizacion equivalente a TRES veces la mejor remuneracion mensual, normal y habitual del ultimo ano.",
    "src": "estudio",
    "cite": "art. 80 LCT",
    "tema": "deberes",
    "kind": "single",
    "opts": [
      "Un mes de sueldo",
      "Tres veces la mejor remuneracion mensual, normal y habitual del ultimo ano (previa intimacion fehaciente)",
      "El doble de la indemnizacion del art. 245",
      "No hay multa, solo se puede pedir la entrega judicialmente"
    ],
    "correct": 1
  },
  {
    "id": "u9-37",
    "unit": 9,
    "q": "Sobre el OTORGAMIENTO y la OMISION de las VACACIONES (arts. 154, 157, 164 LCT), marque las CORRECTAS:",
    "expl": "Vacaciones: epoca 1/10 a 30/4 y aviso con 45 dias (154). Omision: el trabajador las toma por si, terminando antes del 31/5 (157). Acumulacion: solo hasta un tercio de un periodo inmediatamente anterior, de comun acuerdo (164): NO es ilimitada.",
    "src": "estudio",
    "cite": "arts. 154, 157, 164 LCT",
    "tema": "licencias",
    "kind": "multi",
    "opts": [
      "Deben concederse entre el 1 de octubre y el 30 de abril",
      "Se comunica la fecha de inicio por escrito con anticipacion no menor a 45 dias",
      "Si el empleador no las otorga, el trabajador puede tomarlas por si, previa notificacion, de modo que terminen antes del 31 de mayo",
      "Son acumulables sin limite a periodos futuros",
      "Solo es admisible acumular hasta un tercio de un periodo inmediatamente anterior"
    ],
    "correct": [
      0,
      1,
      2,
      4
    ]
  },
  {
    "id": "u9-38",
    "unit": 9,
    "q": "Las acciones relativas a creditos provenientes de las relaciones individuales de trabajo prescriben a los dos anos (art. 256 LCT).",
    "expl": "Art. 256 LCT: prescriben a los DOS anos las acciones relativas a creditos de las relaciones individuales de trabajo. Es un plazo de orden publico, no modificable por convencion, contado desde que cada credito es exigible.",
    "src": "estudio",
    "cite": "art. 256 LCT",
    "tema": "extincion",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "u9-39",
    "unit": 9,
    "q": "Asociar cada figura del derecho colectivo y de las suspensiones con su contenido.",
    "expl": "Conciliacion (14.786): instancia previa de 15+5 dias. Paritaria (14.250): bipartita, interpreta el CCT. Disciplinaria (220): max 30 dias/ano, justa causa. Falta de trabajo (221): causa no imputable, orden inverso de antiguedad. Preventiva: dura el proceso penal; si hay sobreseimiento, salarios caidos.",
    "src": "estudio",
    "cite": "Ley 14.786; Ley 14.250; arts. 218-224 LCT",
    "tema": "colectivo",
    "kind": "reveal",
    "opts": [
      "Tope de 30 dias al ano, sin goce de haberes, con justa causa y plazo fijo",
      "Mientras se tramita la causa penal; si hay sobreseimiento, se pagan los salarios caidos",
      "Organo bipartito que interpreta y aplica el CCT",
      "El Estado intima a no innovar por 15 dias (prorrogables 5) antes de la accion directa",
      "Causa no imputable al empleador; tope de 30 dias; en orden inverso de antiguedad"
    ],
    "reveal": [
      "Conciliacion obligatoria (Ley 14.786) → El Estado intima a no innovar por 15 dias (prorrogables 5) antes de la accion directa",
      "Comision paritaria (Ley 14.250) → Organo bipartito que interpreta y aplica el CCT",
      "Suspension disciplinaria (art. 220) → Tope de 30 dias al ano, sin goce de haberes, con justa causa y plazo fijo",
      "Suspension por falta o disminucion de trabajo (art. 221) → Causa no imputable al empleador; tope de 30 dias; en orden inverso de antiguedad",
      "Suspension preventiva (denuncia penal) → Mientras se tramita la causa penal; si hay sobreseimiento, se pagan los salarios caidos"
    ]
  },
  {
    "id": "real-u7-1",
    "unit": 7,
    "q": "Que pasa si el contrato es celebrado por una persona que no tiene discernimiento (por ingesta de alcohol) como en el caso de la serie Suits?",
    "expl": "El acto voluntario requiere discernimiento, intencion y libertad (260). La persona privada accidentalmente de la razon por intoxicacion carece de discernimiento (261 inc. b): el acto es involuntario y nulo. No es que no se pueda contratar con quien tomo alcohol; lo que falta es el discernimiento.",
    "src": "estudio",
    "cite": "arts. 260 y 261 inc. b CCyC",
    "tema": "vicios",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Es valido porque lo firmo",
      "Es invalido porque no fue voluntario, en virtud de la falta de discernimiento",
      "Es invalido porque no se puede firmar contratos con alguien que tomo alcohol"
    ],
    "correct": 1
  },
  {
    "id": "real-u7-2",
    "unit": 7,
    "q": "Un acto voluntario es ejecutado con:",
    "expl": "El art. 260 define el acto voluntario como el ejecutado con discernimiento, intencion y libertad, manifestado por un hecho exterior. Si falta cualquiera de los tres, el acto es involuntario.",
    "src": "estudio",
    "cite": "art. 260 CCyC",
    "tema": "vicios",
    "real": true,
    "kind": "single",
    "opts": [
      "Intencion, firma y clausulas acordadas aunque sean abusivas",
      "Discernimiento, intencion y libertad",
      "Libertad, independencia y ganas"
    ],
    "correct": 1
  },
  {
    "id": "real-u7-3",
    "unit": 7,
    "q": "Que un contrato este celebrado por escrito, cumple el requisito de Formalidad exigido por el CCyC?",
    "expl": "Depende del tipo de contrato. Si la ley exige escritura publica (1017, ej. inmuebles), un instrumento privado no alcanza y vale solo como obligacion de escriturar (1018). En contratos no formales, el escrito si alcanza.",
    "src": "estudio",
    "cite": "arts. 1015, 1017 y 1018 CCyC",
    "tema": "forma",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Depende",
      "No",
      "Si"
    ],
    "correct": 0
  },
  {
    "id": "real-u7-4",
    "unit": 7,
    "q": "Cuales son los elementos de los contratos?",
    "expl": "Los cinco elementos esenciales son capacidad, consentimiento, objeto, causa y forma (mnemotecnico CCOCF).",
    "src": "estudio",
    "cite": "arts. 1000, 971, 1003, 1012, 1015 CCyC",
    "tema": "parte-general",
    "real": true,
    "kind": "single",
    "opts": [
      "Capacidad, consentimiento, objeto, causa, forma",
      "Sujetos, oferta, voluntad, obligaciones",
      "Sujetos, papel, clausulas, capacidad"
    ],
    "correct": 0
  },
  {
    "id": "real-u7-5",
    "unit": 7,
    "q": "El objeto de un contrato debe ser:",
    "expl": "El art. 1003 exige objeto licito, posible, determinado o determinable, susceptible de valoracion economica y que corresponda a un interes de las partes. La opcion b incluye la trampa imposible, que es contradictoria.",
    "src": "estudio",
    "cite": "art. 1003 CCyC",
    "tema": "objeto",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Licito, posible, determinado o determinable",
      "Licito, posible, imposible, determinado, susceptible de valoracion economica y corresponder a un interes de las partes",
      "Licito, posible, determinado o determinable, susceptible de valoracion economica y corresponder a un interes de las partes"
    ],
    "correct": 2
  },
  {
    "id": "real-u7-6",
    "unit": 7,
    "q": "Como se si una persona juridica es capaz para celebrar un contrato?",
    "expl": "La persona juridica tiene capacidad limitada a su objeto social (156 CCyC, 58 LGS). Para verificarla hay que mirar el estatuto o acta constitutiva; los actos notoriamente extranos al objeto pueden no comprometerla.",
    "src": "estudio",
    "cite": "art. 156 CCyC, art. 58 LGS",
    "tema": "parte-general",
    "real": true,
    "kind": "single",
    "opts": [
      "Porque despues de un ano de funcionamiento ya puede celebrar contratos",
      "Tengo que verlo en el CCyC",
      "Tengo que ir al acta constitutiva para ver su objeto y fin y analizarlo",
      "Porque desde su creacion siempre es capaz para todo"
    ],
    "correct": 2
  },
  {
    "id": "real-u7-7",
    "unit": 7,
    "q": "Cuando una persona fisica es capaz para celebrar un contrato?",
    "expl": "Se necesitan dos condiciones: mayoria de edad (capacidad de ejercicio a los 18, art. 23) y ausencia de restriccion judicial (24, 32, 38). La opcion c ignora las restricciones y la d ignora la mayoria de edad.",
    "src": "estudio",
    "cite": "arts. 22, 23, 32, 38 CCyC",
    "tema": "parte-general",
    "real": true,
    "kind": "single",
    "opts": [
      "Desde la concepcion",
      "Cuando es mayor de edad y no esta declarado incapaz por un juez ni tiene capacidad restringida",
      "Cuando tiene 18, sin importar otra causa",
      "Cuando no esta declarado incapaz"
    ],
    "correct": 1
  },
  {
    "id": "real-u7-8",
    "unit": 7,
    "q": "Un contrato puede ser celebrado por:",
    "expl": "El art. 957 habla de dos o mas PARTES. Una parte puede estar compuesta por varias personas: el contrato se cuenta por centros de interes, no por personas.",
    "src": "estudio",
    "cite": "art. 957 CCyC",
    "tema": "parte-general",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Dos partes",
      "Dos o mas personas",
      "Dos o mas personas humanas",
      "Dos o mas partes"
    ],
    "correct": 3
  },
  {
    "id": "real-u7-9",
    "unit": 7,
    "q": "Se puede celebrar un contrato en el dorso de una figurita de Messi del Mundial de Qatar 2022?",
    "expl": "Depende del tipo de contrato. Si es no formal (1015) y reune los demas requisitos, si vale (la figurita firmada es instrumento particular, 287). Si requiere escritura publica (inmueble, donacion), no.",
    "src": "estudio",
    "cite": "arts. 1015 y 287 CCyC",
    "tema": "forma",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Solo en la figurita del Dibu",
      "Depende",
      "No",
      "Si"
    ],
    "correct": 1
  },
  {
    "id": "real-u7-10",
    "unit": 7,
    "q": "Celebrar un contrato en una servilleta es:",
    "expl": "La expresion escrita puede constar en instrumentos publicos o particulares (286). La servilleta firmada es un instrumento privado (287): es celebracion escrita, distinta de la oralidad.",
    "src": "estudio",
    "cite": "arts. 286 y 287 CCyC",
    "tema": "forma",
    "real": true,
    "kind": "single",
    "opts": [
      "Informal",
      "Igual que hacerlo oralmente",
      "Igual que en papel: su celebracion es escrita"
    ],
    "correct": 2
  },
  {
    "id": "real-u7-11",
    "unit": 7,
    "q": "Como resolvieron el conflicto del Ballet en el caso de la serie Suits?",
    "expl": "Louis fuerza la renuncia del director Sergei Baskov (que malversaba el fondo de reparacion) y, reorganizadas las finanzas, el ballet paga la deuda del fondo y evita el desalojo (conflicto de locacion, art. 1187 CCyC).",
    "src": "estudio",
    "cite": "caso Suits S2E6; art. 1187 CCyC",
    "tema": "caso-suits",
    "real": true,
    "kind": "single",
    "opts": [
      "Se mudaron de teatro",
      "Forzaron la renuncia del director que malversaba el fondo y, reorganizadas las finanzas, pagaron la deuda",
      "Aumentaron la cuota de los socios",
      "No habia ningun conflicto"
    ],
    "correct": 1
  },
  {
    "id": "real-u7-12",
    "unit": 7,
    "q": "Todos los contratos deben celebrarse por escrito, en soporte papel o digital.",
    "expl": "Rige la libertad de formas (1015): solo son formales los contratos a los que la ley les impone una forma. La regla general es que las partes eligen la forma.",
    "src": "estudio",
    "cite": "art. 1015 CCyC",
    "tema": "forma",
    "real": true,
    "trap": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "real-u9-1",
    "unit": 9,
    "q": "Cual es el principio que propone que en los contratos a plazo fijo no se puede despedir al trabajador antes del vencimiento del plazo?",
    "expl": "El principio de continuidad (art. 10 LCT) sostiene la subsistencia del vinculo. Si se rompe el plazo fijo antes del vencimiento sin causa, se debe el art. 245 mas danos por el tiempo faltante (art. 95).",
    "src": "estudio",
    "cite": "arts. 10 y 95 LCT",
    "tema": "principios",
    "real": true,
    "kind": "single",
    "opts": [
      "Principio de buena fe",
      "Principio de primacia de la realidad",
      "Principio de igualdad de trato",
      "Principio de continuidad de la relacion laboral"
    ],
    "correct": 3
  },
  {
    "id": "real-u9-2",
    "unit": 9,
    "q": "Cuales son las reglas del principio protectorio del derecho laboral?",
    "expl": "El protectorio se manifiesta en tres reglas: in dubio pro operario (9), norma mas favorable (1) y condicion mas beneficiosa. A trabajo igual salario igual es igualdad de trato (81); la d confunde el orden de prelacion de fuentes.",
    "src": "estudio",
    "cite": "arts. 9 y 1 LCT",
    "tema": "principios",
    "real": true,
    "kind": "single",
    "opts": [
      "In dubio pro operario, de la norma mas favorable, de la condicion laboral mas beneficiosa",
      "A trabajo igual, salario igual",
      "Quien incumple, pierde",
      "Convenio colectivo, contrato individual, legislacion nacional"
    ],
    "correct": 0
  },
  {
    "id": "real-u9-3",
    "unit": 9,
    "q": "Es cierto que el futuro empleador y empleado pueden pactar libremente las condiciones de contratacion laboral, sin limite alguno?",
    "expl": "La autonomia de la voluntad no rige plenamente: hay pisos minimos inderogables (12, irrenunciabilidad) impuestos por el 14 bis CN, la LCT y los CCT. Los pactos por debajo son nulos (7, 12, 13). La respuesta tajante es No.",
    "src": "estudio",
    "cite": "arts. 7, 12, 13 LCT; 14 bis CN",
    "tema": "principios",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "No",
      "Si",
      "Depende de la legislacion laboral vigente",
      "Solo si son profesionales independientes",
      "Solo en trabajos temporales"
    ],
    "correct": 0
  },
  {
    "id": "real-u9-4",
    "unit": 9,
    "q": "Las caracteristicas de la vinculacion laboral tienen los siguientes planos de subordinacion (elija los que correspondan):",
    "expl": "La relacion de dependencia (21 LCT) se manifiesta en triple subordinacion: tecnica (instrucciones sobre el como), economica (depende del salario, ajenidad) y juridica (poder de direccion y deber de obediencia). El resto son distractores.",
    "src": "estudio",
    "cite": "art. 21 LCT",
    "tema": "dependencia",
    "real": true,
    "kind": "multi",
    "opts": [
      "juridico",
      "sancionatorio",
      "dolo",
      "tecnico",
      "regulatorio",
      "culpa",
      "in dubio pro operario",
      "moral",
      "organizacional",
      "economico"
    ],
    "correct": [
      0,
      3,
      9
    ]
  },
  {
    "id": "real-u9-5",
    "unit": 9,
    "q": "Que regula el articulo 14 bis de la Constitucion Nacional?",
    "expl": "El art. 14 bis (reforma de 1957, constitucionalismo social) asegura condiciones dignas, jornada limitada, descanso y vacaciones pagados, retribucion justa, SMVyM, igual remuneracion, proteccion contra el despido arbitrario, organizacion sindical, ademas de derecho colectivo y seguridad social.",
    "src": "estudio",
    "cite": "art. 14 bis CN",
    "tema": "contrato",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Los requisitos para ser Presidente de la Nacion",
      "Las condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagados, retribucion justa y SMVyM",
      "Las obligaciones de los empleadores",
      "Las funciones del Poder Judicial",
      "Los derechos politicos de los ciudadanos"
    ],
    "correct": 1
  },
  {
    "id": "real-u9-6",
    "unit": 9,
    "q": "Elija las opciones adecuadas para considerar extinguida la relacion laboral segun la LCT (puede haber varias):",
    "expl": "Son causales: acuerdo (241), quiebra (251), despido incausado (245), jubilacion (252), despido indirecto (246), renuncia (240), incapacidad total (212), despido con justa causa (242) y muerte del empleador (249). Distractores: COVID, factor de atribucion, incendio aislado, muerte del accionista (la sociedad subsiste).",
    "src": "estudio",
    "cite": "arts. 240-254, 212, 251 LCT",
    "tema": "extincion",
    "real": true,
    "kind": "multi",
    "opts": [
      "Por COVID-19",
      "Por acuerdo entre las partes",
      "Por quiebra del empleador",
      "Por despido directo incausado",
      "Por jubilacion del trabajador",
      "Por despido indirecto",
      "Por renuncia del trabajador",
      "Por incapacidad total del trabajador",
      "Por factor de atribucion",
      "Por incendio de la oficina comercial",
      "Por despido directo con justa causa",
      "Por muerte del empleador",
      "Por muerte del accionista mayoritario de la sociedad"
    ],
    "correct": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      10,
      11
    ]
  },
  {
    "id": "real-u9-7",
    "unit": 9,
    "q": "El principio de irrenunciabilidad propone que el trabajador no puede renunciar a su empleo si no termino la obra encargada dentro del plazo pactado.",
    "expl": "Trampa clasica. La irrenunciabilidad (12 LCT) significa que el trabajador no puede renunciar a sus DERECHOS (salario minimo, vacaciones, indemnizaciones), no que no pueda renunciar a su empleo. La renuncia al vinculo esta regulada por el art. 240.",
    "src": "estudio",
    "cite": "arts. 12 y 240 LCT",
    "tema": "principios",
    "real": true,
    "trap": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "real-u9-8",
    "unit": 9,
    "q": "Cual es el objetivo principal del principio protectorio del derecho laboral?",
    "expl": "Segun Perego (p. 204), el protectorio tiene como finalidad proteger la dignidad del trabajador en su condicion de persona humana, por ser la parte mas debil. Las otras son efectos, no el objetivo central.",
    "src": "estudio",
    "cite": "Perego p. 204; art. 9 LCT",
    "tema": "principios",
    "real": true,
    "kind": "single",
    "opts": [
      "Regular los vinculos entre empleador y empleado",
      "Establecer condiciones dignas y equitativas de labor",
      "Garantizar la estabilidad en el empleo",
      "Proteger la dignidad del trabajador en su condicion de persona humana"
    ],
    "correct": 3
  },
  {
    "id": "real-u9-9",
    "unit": 9,
    "q": "El articulo 14 de la CN regula las condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagas, retribucion justa y SMVyM.",
    "expl": "Trampa: esa enumeracion es del art. 14 BIS (reforma de 1957), no del art. 14. El art. 14 original consagra las libertades civiles clasicas (trabajar, comerciar, peticionar, ensenar). Si dice art. 14 a secas, es Falso.",
    "src": "estudio",
    "cite": "arts. 14 y 14 bis CN",
    "tema": "contrato",
    "real": true,
    "trap": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "real-u9-10",
    "unit": 9,
    "q": "El poder disciplinario del empleador se ve reflejado en la facultad de (elija las correctas):",
    "expl": "La unica facultad disciplinaria valida es aplicar amonestaciones (67 LCT). La renuncia es voluntaria del trabajador; el adelanto es su derecho (130); solo responde por dolo o culpa grave con tope de retencion del 20% (87, 133); los castigos fisicos violan su dignidad; el retiro voluntario es un acuerdo (241).",
    "src": "estudio",
    "cite": "art. 67 LCT",
    "tema": "deberes",
    "real": true,
    "kind": "multi",
    "opts": [
      "Pedirle la renuncia al trabajador",
      "Negar adelantos de sueldo ante el pedido del trabajador",
      "Descontar hasta 3 sueldos mensuales por elementos rotos",
      "Aplicar amonestaciones",
      "Aplicar castigos fisicos",
      "Negociar un retiro voluntario"
    ],
    "correct": [
      3
    ]
  },
  {
    "id": "real-u8-1",
    "unit": 8,
    "q": "A una empresa le entregan materia prima en mal estado que iba a usar en su proceso productivo. Que vias tiene conforme la LDC?",
    "expl": "La empresa NO es consumidora: la materia prima se integra a su proceso productivo, no es destinatario final (art. 1 LDC). Las vias son las del CCyC: compraventa comercial, vicios redhibitorios (1051-1058) e incumplimiento.",
    "src": "estudio",
    "cite": "art. 1 LDC; arts. 1051-1058 CCyC",
    "tema": "consumidor",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Puede reclamar como consumidora invocando el art. 40 LDC",
      "No aplica la LDC porque no es destinatario final; reclama por el CCyC (vicios redhibitorios, incumplimiento)",
      "Puede pedir dano punitivo del art. 52 bis LDC",
      "Aplica la LDC porque toda compra entre empresas es relacion de consumo"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-2",
    "unit": 8,
    "q": "El contador no presento la declaracion jurada en termino y te multaron por la demora. Que se puede reclamar conforme la LDC?",
    "expl": "El art. 2 LDC excluye a los profesionales liberales con titulo y matricula, pero comprende la publicidad de su ofrecimiento. Las vias son el reclamo etico ante el Consejo Profesional y la accion civil de responsabilidad (1768 CCyC, subjetiva).",
    "src": "estudio",
    "cite": "art. 2 LDC; art. 1768 CCyC",
    "tema": "proveedor",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Todo el regimen de la LDC porque es un servicio",
      "Nada, los profesionales no tienen responsabilidad",
      "No aplica la LDC salvo respecto de la publicidad; el reclamo es por via civil y ante el consejo profesional",
      "Solo dano punitivo del art. 52 bis"
    ],
    "correct": 2
  },
  {
    "id": "real-u8-3",
    "unit": 8,
    "q": "Compraste una torta en mal estado y se intoxicaron tres invitados. Pueden reclamar? A quien?",
    "expl": "Pueden reclamar todos los intoxicados como consumidores expuestos (bystander, art. 1). Las cosas no deben presentar peligro (5). Responden solidariamente productor, distribuidor, vendedor (la confiteria), quien puso su marca y transportista (40); solo se libera quien acredite causa ajena.",
    "src": "estudio",
    "cite": "arts. 1, 5 y 40 LDC",
    "tema": "responsabilidad",
    "real": true,
    "kind": "single",
    "opts": [
      "Solo el comprador, contra la confiteria",
      "Pueden reclamar todos los intoxicados (consumidor expuesto) contra toda la cadena en forma solidaria",
      "Nadie, porque la torta se consumio en una casa particular",
      "Solo al fabricante de la harina"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-4",
    "unit": 8,
    "q": "Compraste por un sitio de subasta online un producto nocivo, sin que la publicacion lo advirtiera. El sitio de subasta es responsable junto con el vendedor.",
    "expl": "El sitio actua como proveedor o intermediario profesional en una relacion de consumo y debe controlar el deber de informacion (4) y la comercializacion segura (6). Por el art. 40 responde solidariamente con el vendedor.",
    "src": "estudio",
    "cite": "arts. 4, 6 y 40 LDC",
    "tema": "responsabilidad",
    "real": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "real-u8-5",
    "unit": 8,
    "q": "Compraste un producto remanufacturado que te vendieron como nuevo. Que podes hacer?",
    "expl": "El art. 9 obliga a indicar de forma precisa y notoria que la cosa es usada o reconstituida; ocultarlo es publicidad enganosa. El consumidor puede (10 bis) exigir cumplimiento, aceptar otro producto equivalente o rescindir, mas danos. La garantia de usados es de 3 meses (11).",
    "src": "estudio",
    "cite": "arts. 9, 10 bis y 11 LDC",
    "tema": "garantias",
    "real": true,
    "kind": "single",
    "opts": [
      "Nada, porque el producto funciona",
      "Reclamar por violacion del deber de informar el caracter reconstituido (9) y optar por cumplimiento, producto equivalente o rescision (10 bis), mas danos",
      "Solo cambiarlo si el comercio lo permite por cortesia",
      "Esperar a que se rompa para usar la garantia"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-6",
    "unit": 8,
    "q": "Compraste un producto nuevo el 1/1. Se rompe el 30/5, lo llevas a service el 16/6 y te lo devuelven el 30/6. El 20/7 se rompe otra cosa. Esta en garantia?",
    "expl": "Garantia de cosas nuevas: 6 meses (11), vence el 1/7. El tiempo de privacion por reparacion se suma (16): del 16/6 al 30/6 son 14 dias, prolongando al 15/7. El 20/7 es posterior: ya no hay garantia legal (solo convencional o vicios redhibitorios).",
    "src": "estudio",
    "cite": "arts. 11 y 16 LDC",
    "tema": "garantias",
    "real": true,
    "kind": "single",
    "opts": [
      "Si, la garantia es de 1 ano para productos nuevos",
      "No: la garantia de 6 meses vencia el 1/7 y, con la prolongacion del art. 16 (14 dias en service), llega al 15/7; el 20/7 ya no esta cubierta",
      "Si, porque cualquier reparacion reinicia la garantia desde cero",
      "No, porque la garantia se pierde al llevarlo a service"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-7",
    "unit": 8,
    "q": "En el mismo caso, si el 10/7 se rompe con el MISMO problema ya reparado, que podes hacer?",
    "expl": "El 10/7 esta dentro de la garantia prolongada (vence 15/7). Al repetirse el mismo defecto, la reparacion fue no satisfactoria (17): el consumidor puede pedir sustitucion por una cosa nueva, devolucion del precio o quita proporcional, mas danos.",
    "src": "estudio",
    "cite": "arts. 16 y 17 LDC",
    "tema": "garantias",
    "real": true,
    "kind": "single",
    "opts": [
      "Nada, ya usaste la garantia una vez",
      "Como la reparacion no fue satisfactoria, exigir sustitucion por una cosa nueva, devolucion del precio o quita proporcional, mas danos (17)",
      "Solo volver a llevarlo a reparar indefinidamente",
      "Reclamar dano punitivo unicamente"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-8",
    "unit": 8,
    "q": "Al enchufar una television recien comprada, el cable estaba fallado y muere una persona. Quienes responden?",
    "expl": "El art. 40 LDC establece responsabilidad objetiva y solidaria por el vicio o riesgo de la cosa: responde toda la cadena. Solo se libera quien acredite causa ajena. Los familiares pueden reclamar dano patrimonial, moral y eventual dano punitivo (52 bis).",
    "src": "estudio",
    "cite": "art. 40 LDC; art. 1722 CCyC",
    "tema": "responsabilidad",
    "real": true,
    "kind": "single",
    "opts": [
      "Solo el vendedor del comercio",
      "Solo el fabricante de la television",
      "Toda la cadena en forma objetiva y solidaria: fabricante, importador, distribuidor, vendedor, quien puso su marca y transportista",
      "Nadie, fue un accidente domestico"
    ],
    "correct": 2
  },
  {
    "id": "real-u8-9",
    "unit": 8,
    "q": "Compraste un producto electronico online y, ya entregado, no responde a lo que buscabas aunque funciona. Que podes hacer?",
    "expl": "En las compras a distancia rige el derecho de revocacion (34 LDC): 10 dias corridos desde la entrega para revocar sin causa. Es irrenunciable y los gastos de devolucion son del vendedor. (En local fisico no hay devolucion salvo politica del comercio.)",
    "src": "estudio",
    "cite": "art. 34 LDC",
    "tema": "revocacion",
    "real": true,
    "kind": "single",
    "opts": [
      "Nada, las compras online no admiten devolucion",
      "Ejercer el derecho de revocacion: 10 dias corridos desde la entrega, sin causa, con gastos de devolucion a cargo del vendedor",
      "Solo reclamar si el producto esta defectuoso",
      "Pedir dano punitivo del art. 52 bis"
    ],
    "correct": 1
  },
  {
    "id": "real-u8-10",
    "unit": 8,
    "q": "En los casos de producto danoso (torta intoxicante, TV con cable fallado), el consumidor puede dirigirse contra cualquiera de los integrantes de la cadena, porque responden solidariamente.",
    "expl": "El art. 40 LDC consagra la responsabilidad solidaria de toda la cadena. El consumidor elige a quien reclamar; cada uno se libera solo acreditando causa ajena.",
    "src": "estudio",
    "cite": "art. 40 LDC",
    "tema": "responsabilidad",
    "real": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "real-mix-1",
    "unit": 7,
    "q": "Que es un contrato segun el art. 957 del CCyC?",
    "expl": "El art. 957 define el contrato como el acto juridico por el que dos o mas partes manifiestan su consentimiento para crear, regular, modificar, transferir o extinguir relaciones juridicas patrimoniales. Es acuerdo de voluntades, no una imposicion ni un mero papel.",
    "src": "estudio",
    "cite": "art. 957 CCyC",
    "tema": "parte-general",
    "real": true,
    "kind": "single",
    "opts": [
      "Un papel firmado por dos personas con clausulas detalladas",
      "Un acto juridico mediante el cual dos o mas partes manifiestan su consentimiento para crear, regular, modificar, transferir o extinguir relaciones juridicas patrimoniales",
      "Una obligacion impuesta por la ley",
      "Cualquier acuerdo verbal o escrito entre dos personas"
    ],
    "correct": 1
  },
  {
    "id": "real-mix-2",
    "unit": 7,
    "q": "Un contrato celebrado en una servilleta es informal y no escrito, equivalente a un contrato verbal.",
    "expl": "Una servilleta firmada es escritura: instrumento privado (287), no oralidad. Por la libertad de formas (1015) el contrato es valido si reune los demas elementos. Es distinto de un contrato verbal.",
    "src": "estudio",
    "cite": "arts. 287 y 1015 CCyC",
    "tema": "forma",
    "real": true,
    "trap": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "real-mix-3",
    "unit": 9,
    "q": "Segun el art. 21 LCT, hay contrato de trabajo cuando:",
    "expl": "Cita del art. 21 LCT. Los tres elementos tipificantes son: persona fisica (trabajador), relacion de dependencia y remuneracion. No requiere forma escrita ni escritura publica.",
    "src": "estudio",
    "cite": "art. 21 LCT",
    "tema": "contrato",
    "real": true,
    "kind": "single",
    "opts": [
      "Una persona fisica se obliga a realizar actos, ejecutar obras o prestar servicios en favor de otra y bajo su dependencia, durante un periodo determinado o indeterminado, mediante el pago de una remuneracion",
      "Cualquier acuerdo escrito entre empleador y empleado",
      "Una persona se afilia a un sindicato y comienza a trabajar",
      "Solo cuando se celebra ante escribano publico"
    ],
    "correct": 0
  },
  {
    "id": "real-mix-4",
    "unit": 9,
    "q": "La indemnizacion del art. 245 LCT por despido sin causa se calcula como:",
    "expl": "El art. 245 fija un mes de sueldo por cada ano de servicio o fraccion mayor a 3 meses, sobre la mejor remuneracion mensual, normal y habitual del ultimo ano (o del tiempo de servicio si es menor).",
    "src": "estudio",
    "cite": "art. 245 LCT",
    "tema": "indemnizacion",
    "real": true,
    "kind": "single",
    "opts": [
      "15 dias de sueldo por cada ano trabajado",
      "Solo el preaviso adeudado",
      "50% del sueldo por cada ano de servicio",
      "Un mes de sueldo por cada ano de servicio o fraccion mayor a tres meses, sobre la base de la mejor remuneracion mensual, normal y habitual del ultimo ano"
    ],
    "correct": 3
  },
  {
    "id": "real-mix-5",
    "unit": 9,
    "q": "Que resolvio la CSJN en el caso Vizzoti c/ AMSA?",
    "expl": "En Vizzoti c/ AMSA (CSJN, 2004) la Corte sostuvo que el tope del art. 245 (3 veces el promedio del CCT) no puede reducir el salario base en mas del 33%; si lo hace, es inconstitucional para ese caso.",
    "src": "estudio",
    "cite": "CSJN Vizzoti c/ AMSA (2004); art. 245 LCT",
    "tema": "casos",
    "real": true,
    "kind": "single",
    "opts": [
      "El tope del CCT del art. 245 LCT no puede reducir el salario real del trabajador en mas del 33%",
      "El despido sin causa siempre es inconstitucional",
      "Se debe abonar el SAC en la indemnizacion del art. 245",
      "El preaviso debe ser de 6 meses para todos"
    ],
    "correct": 0
  },
  {
    "id": "real-mix-6",
    "unit": 9,
    "q": "Cual es la jornada de trabajo maxima diurna normal segun la Ley 11.544?",
    "expl": "La jornada normal diurna (6 a 21 hs) es de 8 horas diarias o 48 semanales. La de 6/36 corresponde a tareas insalubres y menores; la de 7/42 a la jornada nocturna.",
    "src": "estudio",
    "cite": "Ley 11.544",
    "tema": "jornada",
    "real": true,
    "kind": "single",
    "opts": [
      "6 horas diarias o 36 semanales",
      "8 horas diarias o 48 semanales",
      "7 horas diarias o 42 semanales",
      "10 horas diarias o 50 semanales"
    ],
    "correct": 1
  },
  {
    "id": "real-mix-7",
    "unit": 9,
    "q": "Cual de las siguientes NO es un principio del derecho del trabajo?",
    "expl": "La autonomia absoluta de la voluntad no es principio laboral; al contrario, el derecho del trabajo la restringe mediante minimos irrenunciables. El protectorio, la primacia de la realidad y la irrenunciabilidad si lo son.",
    "src": "estudio",
    "cite": "art. 12 LCT",
    "tema": "principios",
    "real": true,
    "trap": true,
    "kind": "single",
    "opts": [
      "Principio protectorio",
      "Principio de primacia de la realidad",
      "Principio de irrenunciabilidad",
      "Principio de autonomia absoluta de la voluntad"
    ],
    "correct": 3
  },
  {
    "id": "real-mix-8",
    "unit": 9,
    "q": "El despido con justa causa requiere notificacion por escrito con expresion suficientemente clara de la causa que motivo la decision rescisoria.",
    "expl": "El art. 243 LCT exige comunicar el despido con justa causa por escrito y con expresion suficientemente clara de la causa. La forma escrita es para poder invocar y luego probar esa causa; no se admite cambiarla en juicio (invariabilidad).",
    "src": "estudio",
    "cite": "art. 243 LCT",
    "tema": "extincion",
    "real": true,
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-001",
    "unit": 6,
    "q": "Segun el art. 1 de la LGS 19.550, ¿cual de estos NO es un elemento del concepto de sociedad?",
    "expl": "El art. 1 LGS exige aportes, fin de produccion/intercambio, participacion en beneficios y soporte de perdidas, y tipicidad. Asegurar una ganancia fija a un socio es una clausula leonina nula (art. 13 inc. 3).",
    "src": "quiz",
    "tema": "Concepto de sociedad",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Realizar aportes para aplicarlos a la produccion o intercambio de bienes o servicios",
      "Participar de los beneficios y soportar las perdidas",
      "Organizarse conforme a uno de los tipos previstos en la ley",
      "Garantizar a cada socio una ganancia minima fija con independencia del resultado"
    ],
    "correct": 3
  },
  {
    "id": "qu6-002",
    "unit": 6,
    "q": "¿Bajo que tipo(s) puede constituirse una sociedad unipersonal en Argentina?",
    "expl": "El art. 1 LGS admite la unipersonal solo como SA (la SAU); la Ley 27.349 agrega la SAS unipersonal (art. 34). La SRL requiere minimo 2 socios.",
    "src": "quiz",
    "tema": "Unipersonalidad",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Solo como SRL unipersonal",
      "Como SA unipersonal (SAU) o como SAS",
      "Como cualquier tipo, salvo la sociedad colectiva",
      "Solo como sociedad de la Seccion IV"
    ],
    "correct": 1
  },
  {
    "id": "qu6-003",
    "unit": 6,
    "q": "Una sociedad unipersonal puede ser constituida por otra sociedad unipersonal.",
    "expl": "El art. 1 LGS lo prohibe expresamente: la sociedad unipersonal no puede constituirse por una sociedad unipersonal (regla replicada para la SAS en el art. 34 L27349).",
    "src": "quiz",
    "tema": "Unipersonalidad",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-004",
    "unit": 6,
    "q": "El art. 11 LGS exige que el objeto social sea:",
    "expl": "El art. 11 inc. 3 LGS exige objeto 'preciso y determinado'. La SAS (art. 36 inc. 4 L27349) es la excepcion que admite objeto plural sin conexidad.",
    "src": "quiz",
    "tema": "Instrumento constitutivo",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Amplio y generico para permitir cualquier actividad comercial",
      "Necesariamente unico y conexo en todos los tipos",
      "Preciso y determinado",
      "Aprobado previamente por la CNV"
    ],
    "correct": 2
  },
  {
    "id": "qu6-005",
    "unit": 6,
    "q": "¿En que moneda debe expresarse el capital social en el instrumento constitutivo (art. 11 LGS)?",
    "expl": "El art. 11 inc. 4 LGS exige que el capital se exprese en moneda argentina, con mencion del aporte de cada socio.",
    "src": "quiz",
    "tema": "Instrumento constitutivo",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "En la moneda que elijan los socios",
      "En dolares estadounidenses",
      "En la moneda del domicilio de los socios",
      "En moneda argentina"
    ],
    "correct": 3
  },
  {
    "id": "qu6-006",
    "unit": 6,
    "q": "¿Cual de las siguientes clausulas es NULA por leonina (art. 13 LGS)?",
    "expl": "El art. 13 inc. 1 LGS declara nula la estipulacion que excluya a un socio de los beneficios o lo libere de las perdidas (clausula leonina).",
    "src": "quiz",
    "tema": "Clausulas leoninas",
    "dif": "media",
    "kind": "single",
    "opts": [
      "La que excluye a un socio de participar en las ganancias",
      "La que fija que las utilidades se distribuyen en proporcion a los aportes",
      "La que designa un gerente por tiempo indeterminado",
      "La que limita la transmisibilidad de las cuotas"
    ],
    "correct": 0
  },
  {
    "id": "qu6-007",
    "unit": 6,
    "q": "La inoponibilidad de la personalidad juridica (corrimiento del velo) esta regulada en:",
    "expl": "El art. 54, ultimo parrafo, LGS imputa directamente a socios/controlantes la actuacion que encubre fines extrasocietarios o viola la ley, con responsabilidad solidaria e ilimitada.",
    "src": "quiz",
    "tema": "Inoponibilidad",
    "dif": "media",
    "kind": "single",
    "opts": [
      "El art. 54, ultimo parrafo, LGS",
      "El art. 299 LGS",
      "El art. 2 LGS",
      "El art. 59 LGS"
    ],
    "correct": 0
  },
  {
    "id": "qu6-008",
    "unit": 6,
    "q": "Cuando se aplica la inoponibilidad de la personalidad juridica, los socios o controlantes responden solidaria e ilimitadamente por los perjuicios causados.",
    "expl": "El art. 54, ultimo parrafo, LGS dispone que quienes hicieron posible la actuacion encubridora responden solidaria e ilimitadamente.",
    "src": "quiz",
    "tema": "Inoponibilidad",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-009",
    "unit": 6,
    "q": "Segun el art. 59 LGS, los administradores y representantes deben obrar con:",
    "expl": "El art. 59 LGS impone obrar con lealtad y con la diligencia de un buen hombre de negocios; el incumplimiento genera responsabilidad ilimitada y solidaria.",
    "src": "quiz",
    "tema": "Administradores",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Mera buena fe y sin culpa grave",
      "Lealtad y la diligencia de un buen hombre de negocios",
      "Diligencia de un buen padre de familia unicamente",
      "La diligencia exigible a un comerciante medio sin deber de lealtad"
    ],
    "correct": 1
  },
  {
    "id": "qu6-010",
    "unit": 6,
    "q": "¿Como responden los administradores que faltan a sus obligaciones (art. 59 LGS)?",
    "expl": "El art. 59 LGS establece responsabilidad ilimitada y solidaria por los daños y perjuicios resultantes de su accion u omision (concordante art. 274 para directores).",
    "src": "quiz",
    "tema": "Administradores",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Solo ante la sociedad y hasta el monto de su remuneracion",
      "Ilimitada y solidariamente por los daños de su accion u omision",
      "De forma mancomunada y limitada",
      "No responden si actuaron por decision de la asamblea"
    ],
    "correct": 1
  },
  {
    "id": "qu6-011",
    "unit": 6,
    "q": "¿Cual es el numero maximo de socios de una SRL (art. 146 LGS)?",
    "expl": "El art. 146 LGS: 'El numero de socios no excedera de cincuenta'. Si la empresa supera ese numero debe transformarse (por ej. en SA).",
    "src": "quiz",
    "tema": "SRL - socios",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Cien",
      "Veinte",
      "Cincuenta",
      "No tiene limite"
    ],
    "correct": 2
  },
  {
    "id": "qu6-012",
    "unit": 6,
    "q": "En la SRL, las cuotas sociales (art. 148 LGS) tendran igual valor de:",
    "expl": "El art. 148 LGS fija que las cuotas tendran igual valor de $10 (pesos diez) o sus multiplos.",
    "src": "quiz",
    "tema": "SRL - cuotas",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Un peso o sus multiplos",
      "Diez pesos o sus multiplos",
      "Cien pesos o sus multiplos",
      "El valor que libremente fije el contrato"
    ],
    "correct": 1
  },
  {
    "id": "qu6-013",
    "unit": 6,
    "q": "El contrato de una SRL puede prohibir totalmente la transmision de las cuotas sociales.",
    "expl": "El art. 153 LGS permite limitar la transmisibilidad de las cuotas, pero NO prohibirla. La SAS si puede prohibir la transferencia de acciones por hasta 10 años (art. 48 L27349).",
    "src": "quiz",
    "tema": "SRL - cesion de cuotas",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-014",
    "unit": 6,
    "q": "Como principio general, las cuotas de una SRL son (art. 152 LGS):",
    "expl": "El art. 152 LGS: las cuotas son libremente transmisibles, salvo disposicion contraria del contrato.",
    "src": "quiz",
    "tema": "SRL - cuotas",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Libremente transmisibles, salvo disposicion contraria del contrato",
      "Intransferibles",
      "Transferibles solo con autorizacion judicial",
      "Transferibles solo a otros socios"
    ],
    "correct": 0
  },
  {
    "id": "qu6-015",
    "unit": 6,
    "q": "En la SRL, la sindicatura o el consejo de vigilancia (art. 158 LGS) son obligatorios cuando:",
    "expl": "El art. 158 LGS hace obligatoria la fiscalizacion solo cuando el capital alcanza el monto del art. 299 inc. 2. El criterio de 'mas de 20 socios' pertenece al regimen anterior y NO es la regla vigente.",
    "src": "quiz",
    "tema": "SRL - fiscalizacion",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "La SRL tiene mas de 20 socios",
      "La SRL tiene mas de 3 gerentes",
      "Siempre son obligatorios",
      "El capital social alcanza el importe del art. 299 inc. 2"
    ],
    "correct": 3
  },
  {
    "id": "qu6-016",
    "unit": 6,
    "q": "En la SRL, en defecto de regulacion contractual, la modificacion del contrato requiere el voto de las tres cuartas partes del capital social.",
    "expl": "El art. 160 LGS: en defecto de regulacion contractual la mayoria para modificar el contrato es de 3/4 del capital social (la mayoria nunca puede ser inferior a mas de la mitad).",
    "src": "quiz",
    "tema": "SRL - mayorias",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-017",
    "unit": 6,
    "q": "La administracion de la SRL esta a cargo de (art. 157 LGS):",
    "expl": "El art. 157 LGS: la administracion y representacion corresponde a uno o mas gerentes, socios o no, por tiempo determinado o indeterminado.",
    "src": "quiz",
    "tema": "SRL - administracion",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Uno o mas gerentes, socios o no",
      "Un directorio de minimo 3 miembros",
      "La asamblea de accionistas",
      "Necesariamente todos los socios en forma conjunta"
    ],
    "correct": 0
  },
  {
    "id": "qu6-018",
    "unit": 6,
    "q": "En la SA, los socios limitan su responsabilidad a (art. 163 LGS):",
    "expl": "El art. 163 LGS: el capital se representa por acciones y los socios limitan su responsabilidad a la integracion de las acciones suscriptas.",
    "src": "quiz",
    "tema": "SA - caracterizacion",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "El doble de su aporte",
      "La integracion de las acciones suscriptas",
      "Todo su patrimonio personal de forma subsidiaria",
      "Las deudas anteriores a su ingreso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-019",
    "unit": 6,
    "q": "En las SA comprendidas en el art. 299 (salvo la SAU del inciso 7), el directorio se integra con un minimo de:",
    "expl": "El art. 255 LGS: en las SA del art. 299, salvo las del inciso 7 (SAU), el directorio se integra por lo menos con tres directores.",
    "src": "quiz",
    "tema": "SA - directorio",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Tres directores",
      "Un director",
      "Dos directores",
      "Cinco directores"
    ],
    "correct": 0
  },
  {
    "id": "qu6-020",
    "unit": 6,
    "q": "Para ser director de una SA es obligatorio ser accionista de la sociedad.",
    "expl": "El art. 256 LGS dispone que no es obligatoria la calidad de accionista para ser director; pueden ser socios o terceros.",
    "src": "quiz",
    "tema": "SA - directorio",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-021",
    "unit": 6,
    "q": "¿Que asamblea de la SA trata la consideracion del balance y la eleccion de directores (art. 234 LGS)?",
    "expl": "El art. 234 LGS atribuye a la asamblea ordinaria el balance, distribucion de ganancias y designacion/remocion de directores y sindicos; se convoca dentro de los 4 meses del cierre.",
    "src": "quiz",
    "tema": "SA - asamblea",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "La asamblea extraordinaria",
      "La reunion del directorio",
      "La comision fiscalizadora",
      "La asamblea ordinaria"
    ],
    "correct": 3
  },
  {
    "id": "qu6-022",
    "unit": 6,
    "q": "El quorum de la asamblea extraordinaria de la SA en PRIMERA convocatoria es (art. 244 LGS):",
    "expl": "El art. 244 LGS: la asamblea extraordinaria se rene en primera convocatoria con el 60% de las acciones con voto (en segunda, 30%), salvo quorum estatutario mayor.",
    "src": "quiz",
    "tema": "SA - quorum",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Mayoria de acciones con derecho a voto",
      "El 60% de las acciones con derecho a voto",
      "El 30% de las acciones con derecho a voto",
      "Cualquier numero de acciones presentes"
    ],
    "correct": 1
  },
  {
    "id": "qu6-023",
    "unit": 6,
    "q": "La asamblea ORDINARIA de la SA en SEGUNDA convocatoria (art. 243 LGS) se considera constituida con:",
    "expl": "El art. 243 LGS: en segunda convocatoria la asamblea ordinaria se considera constituida cualquiera sea el numero de acciones presentes.",
    "src": "quiz",
    "tema": "SA - quorum",
    "dif": "media",
    "kind": "single",
    "opts": [
      "El 60% de las acciones con voto",
      "Cualquier numero de acciones presentes",
      "El 30% de las acciones con voto",
      "La mayoria de las acciones con voto"
    ],
    "correct": 1
  },
  {
    "id": "qu6-024",
    "unit": 6,
    "q": "Una SA no comprendida en el art. 299 puede prescindir de la sindicatura si el estatuto lo prevé.",
    "expl": "El art. 284 LGS permite la prescindencia de la sindicatura a las SA que no esten en el art. 299, cuando el estatuto lo prevea; los socios ejercen el contralor del art. 55.",
    "src": "quiz",
    "tema": "SA - sindicatura",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-025",
    "unit": 6,
    "q": "La sindicatura plural y colegiada en numero impar de una SA del art. 299 se denomina:",
    "expl": "Los arts. 284 y 290 LGS: cuando la sindicatura es plural actua como cuerpo colegiado denominado Comision Fiscalizadora.",
    "src": "quiz",
    "tema": "SA - sindicatura",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Consejo de administracion",
      "Asamblea de control",
      "Auditoria externa",
      "Comision Fiscalizadora"
    ],
    "correct": 3
  },
  {
    "id": "qu6-026",
    "unit": 6,
    "q": "Para ser sindico de una SA (art. 285 LGS) se requiere ser:",
    "expl": "El art. 285 LGS: el sindico debe ser abogado o contador publico con titulo habilitante (o sociedad de tales profesionales), con domicilio real en el pais.",
    "src": "quiz",
    "tema": "SA - sindico requisitos",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Abogado o contador publico con titulo habilitante",
      "Director de otra sociedad del grupo",
      "Accionista con al menos el 5% del capital",
      "Mayor de 25 años con domicilio en el extranjero"
    ],
    "correct": 0
  },
  {
    "id": "qu6-027",
    "unit": 6,
    "q": "¿Cual de los siguientes NO es un supuesto del art. 299 LGS (fiscalizacion estatal permanente)?",
    "expl": "El art. 299 enumera oferta publica, capital alto, participacion estatal, capitalizacion/ahorro, concesiones/servicios publicos, control y SAU. El numero de accionistas (>50) no es un supuesto del art. 299.",
    "src": "quiz",
    "tema": "Art. 299",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Hacer oferta publica de sus acciones",
      "Explotar concesiones o servicios publicos",
      "Ser una sociedad anonima unipersonal (SAU)",
      "Tener mas de cincuenta accionistas"
    ],
    "correct": 3
  },
  {
    "id": "qu6-028",
    "unit": 6,
    "q": "La Sociedad Anonima Unipersonal (SAU) esta siempre sujeta a la fiscalizacion estatal permanente del art. 299 LGS.",
    "expl": "El art. 299 inc. 7 LGS incluye a las SAU dentro de la fiscalizacion estatal permanente (incorporado en 2015).",
    "src": "quiz",
    "tema": "Art. 299",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-029",
    "unit": 6,
    "q": "El monto de capital del art. 299 inc. 2 a partir del cual una SA queda bajo fiscalizacion permanente fue actualizado en 2024 a:",
    "expl": "El monto del art. 299 inc. 2 LGS (historico $500) fue actualizado a $2.000.000.000 (dos mil millones) por la Resolucion 10/2024 del Ministerio de Justicia (B.O. 8/2/2024).",
    "src": "quiz",
    "tema": "Art. 299 - capital",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "$500",
      "$2.000.000.000",
      "$50.000.000",
      "No tiene monto, depende del numero de socios"
    ],
    "correct": 1
  },
  {
    "id": "qu6-030",
    "unit": 6,
    "q": "La Sociedad por Acciones Simplificada (SAS) esta regulada principalmente por:",
    "expl": "La SAS fue creada por la Ley 27.349 (art. 33), con aplicacion supletoria de la LGS 19.550.",
    "src": "quiz",
    "tema": "SAS - regulacion",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "La LGS 19.550, arts. 163-307",
      "El Codigo Civil y Comercial",
      "La Ley de Mercado de Capitales 26.831",
      "La Ley 27.349 de Apoyo al Capital Emprendedor"
    ],
    "correct": 3
  },
  {
    "id": "qu6-031",
    "unit": 6,
    "q": "El capital minimo de una SAS al momento de su constitucion (art. 40 L27349) no puede ser inferior a:",
    "expl": "El art. 40 L27349: el capital no puede ser inferior al importe equivalente a dos veces el salario minimo vital y movil (2 SMVyM).",
    "src": "quiz",
    "tema": "SAS - capital",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Un salario minimo vital y movil",
      "Diez salarios minimos vitales y moviles",
      "No tiene capital minimo legal",
      "Dos salarios minimos vitales y moviles"
    ],
    "correct": 3
  },
  {
    "id": "qu6-032",
    "unit": 6,
    "q": "El capital de la SAS se divide en cuotas, igual que en la SRL.",
    "expl": "El art. 40 L27349: el capital de la SAS se divide en acciones (no en cuotas). La doctrina critica que por simplicidad deberian haber sido cuotas.",
    "src": "quiz",
    "tema": "SAS - capital",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-033",
    "unit": 6,
    "q": "La SAS puede tener un objeto plural, enunciando varias actividades que pueden no tener conexidad entre si.",
    "expl": "El art. 36 inc. 4 L27349 admite objeto plural cuyas actividades 'podran guardar o no conexidad o relacion entre ellas', a diferencia del regimen general (art. 11 LGS).",
    "src": "quiz",
    "tema": "SAS - objeto",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-034",
    "unit": 6,
    "q": "Una SAS puede hacer oferta publica de sus acciones para captar inversores.",
    "expl": "El art. 39 L27349 prohibe que la SAS este comprendida en el art. 299 inc. 1 (oferta publica), entre otros supuestos.",
    "src": "quiz",
    "tema": "SAS - limitaciones",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-035",
    "unit": 6,
    "q": "Si una SAS queda comprendida en un supuesto prohibido del art. 39 L27349, ¿en que plazo debe transformarse en otro tipo de la LGS?",
    "expl": "El art. 39 L27349: debe inscribir la transformacion en un plazo no mayor a 6 meses; vencido, los socios responden frente a terceros en forma solidaria, ilimitada y subsidiaria.",
    "src": "quiz",
    "tema": "SAS - transformacion",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "30 dias",
      "1 año",
      "6 meses",
      "2 años"
    ],
    "correct": 2
  },
  {
    "id": "qu6-036",
    "unit": 6,
    "q": "Respecto del organo de fiscalizacion, en la SAS (art. 53 L27349):",
    "expl": "El art. 53 L27349: la reunion de socios es el organo de gobierno y el organo de fiscalizacion es opcional (el estatuto puede establecer sindicatura o consejo de vigilancia).",
    "src": "quiz",
    "tema": "SAS - fiscalizacion",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Es siempre obligatoria una Comision Fiscalizadora",
      "Debe designarse un sindico abogado obligatoriamente",
      "Lo ejerce siempre la CNV",
      "Es opcional; el estatuto puede prever sindicatura o consejo de vigilancia"
    ],
    "correct": 3
  },
  {
    "id": "qu6-037",
    "unit": 6,
    "q": "Si una SAS prescinde del organo de fiscalizacion, debe designarse al menos un administrador suplente.",
    "expl": "El art. 50 L27349: mientras la SAS carezca de organo de fiscalizacion debera designarse por lo menos un administrador suplente.",
    "src": "quiz",
    "tema": "SAS - administracion",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-038",
    "unit": 6,
    "q": "¿En que plazo se inscribe una SAS que utiliza el modelo tipo de instrumento (art. 38 L27349)?",
    "expl": "El art. 38 L27349: la inscripcion se realiza dentro de las 24 horas del dia habil siguiente a la presentacion, siempre que se use el modelo tipo aprobado por el registro publico.",
    "src": "quiz",
    "tema": "SAS - constitucion",
    "dif": "media",
    "kind": "single",
    "opts": [
      "En 30 dias corridos",
      "En 6 meses",
      "Dentro de las 24 horas del dia habil siguiente a la presentacion",
      "En el plazo que fije libremente el Registro"
    ],
    "correct": 2
  },
  {
    "id": "qu6-039",
    "unit": 6,
    "q": "El instrumento constitutivo de una SAS puede prohibir la transferencia de acciones por un plazo maximo de (art. 48 L27349):",
    "expl": "El art. 48 L27349: puede estipularse la prohibicion de transferencia por un plazo no mayor a 10 años, prorrogable por periodos no mayores de 10 años con el voto de la totalidad del capital.",
    "src": "quiz",
    "tema": "SAS - transferencia",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "2 años",
      "5 años",
      "10 años, prorrogable",
      "No puede prohibirla en ningun caso"
    ],
    "correct": 2
  },
  {
    "id": "qu6-040",
    "unit": 6,
    "q": "Segun la doctrina (Netri-Amelong, citando a Camisar), una critica central a la SAS es que:",
    "expl": "La doctrina critica que la SAS debio incorporarse a la LGS y no a una ley ajena (el art. 1 LGS exige que los tipos esten 'en esta ley'); Camisar habla de un 'problema de identidad'.",
    "src": "quiz",
    "tema": "SAS - doctrina",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Exige un capital minimo demasiado alto",
      "Obliga a tener sindicatura permanente",
      "Fue creada por una ley especial fuera de la LGS, generando un 'problema de identidad'",
      "No permite la unipersonalidad"
    ],
    "correct": 2
  },
  {
    "id": "qu6-041",
    "unit": 6,
    "q": "Como regla, ¿como responden frente a terceros los socios de una sociedad de la Seccion IV (art. 24 LGS, reforma 2015)?",
    "expl": "El art. 24 LGS (reforma 2015): los socios responden como obligados simplemente mancomunados y por partes iguales, salvo solidaridad o proporcion distinta que surja de estipulacion, del contrato o de las reglas del tipo.",
    "src": "quiz",
    "tema": "Seccion IV - responsabilidad",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Solidaria e ilimitadamente en todos los casos",
      "Como obligados simplemente mancomunados y por partes iguales",
      "No responden, solo responde la sociedad",
      "Subsidiariamente y hasta el monto de su aporte"
    ],
    "correct": 1
  },
  {
    "id": "qu6-042",
    "unit": 6,
    "q": "El contrato de una sociedad de la Seccion IV es oponible a los terceros solo si se prueba que lo conocieron efectivamente.",
    "expl": "El art. 22 LGS: el contrato puede invocarse entre socios y es oponible a terceros solo si se prueba que lo conocieron efectivamente al tiempo de la contratacion o del nacimiento de la relacion.",
    "src": "quiz",
    "tema": "Seccion IV - oponibilidad",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-043",
    "unit": 6,
    "q": "Las sociedades de la Seccion IV NO tienen personalidad juridica hasta que se subsanen.",
    "expl": "Las sociedades de la Seccion IV tienen personalidad juridica (la ley se la reconoce aun sin inscripcion); pueden incluso adquirir bienes registrables (art. 23). La subsanacion (art. 25) corrige defectos pero no es condicion de la personalidad.",
    "src": "quiz",
    "tema": "Seccion IV - subsanacion",
    "trap": true,
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu6-044",
    "unit": 6,
    "q": "Tras la reforma de 2015, una sociedad de la Seccion IV puede adquirir bienes registrables a su nombre.",
    "expl": "El art. 23 LGS permite a la sociedad de la Seccion IV adquirir bienes registrables acreditando su existencia ante el Registro; el bien se inscribe a nombre de la sociedad.",
    "src": "quiz",
    "tema": "Seccion IV - bienes",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu6-045",
    "unit": 6,
    "q": "Tratandose de aportes en dinero en una SRL o SAS, la integracion minima al momento de la suscripcion y el plazo del saldo son:",
    "expl": "Arts. 149 LGS (SRL) y 41 L27349 (SAS): los aportes en dinero se integran 25% como minimo al suscribir y el saldo en un plazo maximo de 2 años; los aportes en especie 100% al constituir.",
    "src": "quiz",
    "tema": "Tipos - integracion",
    "dif": "media",
    "kind": "single",
    "opts": [
      "25% al suscribir, saldo en 2 años",
      "100% al suscribir",
      "50% al suscribir, saldo en 1 año",
      "10% al suscribir, saldo en 5 años"
    ],
    "correct": 0
  },
  {
    "id": "qu7-001",
    "unit": 7,
    "q": "¿Que es un contrato?",
    "expl": "El contrato es el acto juridico mediante el cual dos o mas partes manifiestan su consentimiento; es un acuerdo de voluntades (art. 957 CCyC).",
    "src": "quiz",
    "tema": "Concepto de contrato",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Una imposicion de una voluntad dominante por sobre otra",
      "Un papel que tiene clausulas escritas",
      "Una orden judicial que obliga a las partes",
      "Un acuerdo de voluntades (acto voluntario) que crea relaciones juridicas patrimoniales"
    ],
    "correct": 3
  },
  {
    "id": "qu7-003",
    "unit": 7,
    "q": "Hay compraventa si una de las partes se obliga a transferir la ___ de una cosa y la otra a pagar un precio en dinero.",
    "expl": "El vendedor se obliga a transferir la PROPIEDAD (dominio) de la cosa (art. 1123 CCyC). No basta la tenencia ni la posesion.",
    "src": "quiz",
    "tema": "Compraventa",
    "trap": true,
    "dif": "facil",
    "kind": "single",
    "opts": [
      "tenencia",
      "propiedad",
      "posesion",
      "custodia"
    ],
    "correct": 1
  },
  {
    "id": "qu7-004",
    "unit": 7,
    "q": "¿Que un contrato este celebrado por escrito cumple el requisito de 'Formalidad' exigido por el Codigo Civil y Comercial?",
    "expl": "Solo son formales los contratos a los que la ley impone una forma (art. 1015). Escribirlo no lo vuelve 'formal' por si solo; depende del tipo de contrato.",
    "src": "quiz",
    "tema": "Forma de los contratos",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "No, nunca lo cumple",
      "Si, siempre que sea por escrito",
      "Si, pero solo en soporte digital",
      "Depende, solo si la ley exige esa forma para ese contrato"
    ],
    "correct": 3
  },
  {
    "id": "qu7-005",
    "unit": 7,
    "q": "La oferta es la manifestacion dirigida a persona determinada o determinable, con la intencion de obligarse.",
    "expl": "Es la definicion legal de oferta (art. 972 CCyC): manifestacion dirigida a persona determinada o determinable, con intencion de obligarse y precisiones necesarias.",
    "src": "quiz",
    "tema": "Consentimiento - oferta",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-006",
    "unit": 7,
    "q": "El juez puede restringir la capacidad de una persona fisica solo para algunos actos (por ejemplo, celebrar contratos de disposicion de bienes) y conservarla para otros.",
    "expl": "La capacidad puede restringirse para actos determinados conservandose para el resto (art. 32 CCyC).",
    "src": "quiz",
    "tema": "Capacidad",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-007",
    "unit": 7,
    "q": "¿Que pasa si el contrato es celebrado por una persona que no tiene discernimiento (por ingesta de alcohol)?",
    "expl": "Sin discernimiento el acto es involuntario (art. 261 CCyC); un contrato celebrado sin voluntad es invalido. No es por el alcohol en abstracto, sino por la falta de discernimiento que produjo.",
    "src": "quiz",
    "tema": "Acto voluntario - discernimiento",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Es invalido porque no fue voluntario, por la falta de discernimiento",
      "Es valido porque lo firmo",
      "Es invalido porque no se puede contratar con alguien que tomo alcohol",
      "Es valido pero anulable solo por el juez penal"
    ],
    "correct": 0
  },
  {
    "id": "qu7-008",
    "unit": 7,
    "q": "En el caso de la serie, ¿que paso con los pagos para el fondo de reparacion?",
    "expl": "En el episodio no se abonaron los pagos al fondo de reparacion durante el ultimo año, lo que habilita la resolucion por incumplimiento de la locacion (arts. 1083-1089 CCyC).",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Los pagaron en tiempo y forma",
      "Lo abono el propietario",
      "Ninguna de las anteriores",
      "No los pagaron por el ultimo año"
    ],
    "correct": 3
  },
  {
    "id": "qu7-009",
    "unit": 7,
    "q": "En el episodio analizado, ¿cuantos tragos tomo el CEO?",
    "expl": "Dato del episodio (Suits S2E6): el CEO tomo 16 tragos, lo que afecto su discernimiento al firmar.",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "8",
      "12",
      "16",
      "20"
    ],
    "correct": 2
  },
  {
    "id": "qu7-010",
    "unit": 7,
    "q": "¿Que tipo de contrato era el del salon de ballet?",
    "expl": "El salon de ballet estaba bajo un contrato de locacion (art. 1187 CCyC); no era proyecto inmobiliario ni educacion, por eso la respuesta es 'ninguna de las anteriores'.",
    "src": "quiz",
    "tema": "Caso Suits - locacion",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Un proyecto inmobiliario",
      "Ninguna de las anteriores (es una locacion)",
      "Un contrato de educacion",
      "Una compraventa"
    ],
    "correct": 1
  },
  {
    "id": "qu7-011",
    "unit": 7,
    "q": "¿Como se resuelve el conflicto de la cesion en el episodio?",
    "expl": "Dato del episodio: el conflicto de la cesion se resuelve con un juego de poker.",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Concurren a los tribunales de NY",
      "Abonan una multa por resolucion anticipada",
      "Mediante un engaño contractual",
      "Mediante un juego de poker"
    ],
    "correct": 3
  },
  {
    "id": "qu7-012",
    "unit": 7,
    "q": "¿Se puede celebrar un contrato en el dorso de una figurita?",
    "expl": "Por la libertad de formas el soporte es libre, pero depende de si la ley exige una forma especial para ese contrato (arts. 1015 y 1017 CCyC).",
    "src": "quiz",
    "tema": "Forma - soporte",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Depende del tipo de contrato y la forma que la ley exija",
      "Solo en figuritas oficiales",
      "No, nunca",
      "Si, en todos los casos sin excepcion"
    ],
    "correct": 0
  },
  {
    "id": "qu7-014",
    "unit": 7,
    "q": "El consentimiento se forma con:",
    "expl": "El consentimiento se forma con oferta + aceptacion plena (lisa y llana); cualquier modificacion seria una contraoferta (arts. 971-978 CCyC).",
    "src": "quiz",
    "tema": "Consentimiento",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Oferta y contraoferta",
      "Oferta y aceptacion lisa y llana",
      "Solo la oferta",
      "Firma y entrega de la cosa"
    ],
    "correct": 1
  },
  {
    "id": "qu7-016",
    "unit": 7,
    "q": "¿Cuales de estos contratos se observan en el capitulo de la serie?",
    "expl": "El episodio muestra varios contratos: alquiler de smoking, laborales, venta de bebidas, cesion de empresa y locacion del salon de ballet.",
    "src": "quiz",
    "tema": "Caso Suits - contratos",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Todas las anteriores (incluida la cesion de una empresa y la locacion del salon de ballet)",
      "Solo el alquiler de smoking",
      "Solo los contratos laborales",
      "Solo la venta de bebidas alcoholicas"
    ],
    "correct": 0
  },
  {
    "id": "qu7-017",
    "unit": 7,
    "q": "En el episodio, el director del ballet continua trabajando.",
    "expl": "El director del ballet fue despedido, no continua trabajando (dato del episodio).",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu7-018",
    "unit": 7,
    "q": "¿Como se si una persona juridica es capaz para celebrar un contrato?",
    "expl": "Rige el principio de especialidad: la capacidad de la persona juridica se mide por su objeto y fin expresados en el acta constitutiva (arts. 141 y 156 CCyC).",
    "src": "quiz",
    "tema": "Capacidad de persona juridica",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Verificando en el acta constitutiva su objeto y fin, y analizandolo",
      "Porque despues de un año de funcionamiento ya puede",
      "Buscandolo en el Codigo Civil y Comercial",
      "Porque desde su creacion siempre es capaz para todo"
    ],
    "correct": 0
  },
  {
    "id": "qu7-019",
    "unit": 7,
    "q": "¿Cuando una persona fisica es capaz para celebrar un contrato?",
    "expl": "La plena capacidad de ejercicio se adquiere con la mayoria de edad, salvo declaracion judicial de incapacidad o capacidad restringida (arts. 24, 25, 32 CCyC).",
    "src": "quiz",
    "tema": "Capacidad de persona humana",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Desde la concepcion",
      "Cuando es mayor de edad y no esta declarada incapaz por un juez ni tiene capacidad restringida",
      "Cuando tiene 18 años, sin importar ninguna otra causa",
      "Cuando no esta declarada incapaz, aunque sea menor"
    ],
    "correct": 1
  },
  {
    "id": "qu7-020",
    "unit": 7,
    "q": "En el episodio analizado existe un contrato de alquiler como uno de los conflictos.",
    "expl": "Si: el conflicto del salon de ballet gira en torno a un contrato de locacion (alquiler) (art. 1187 CCyC).",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-021",
    "unit": 7,
    "q": "¿Cuales son los elementos de los contratos segun la catedra?",
    "expl": "La catedra enumera cinco elementos: capacidad, consentimiento, objeto, causa y forma (slides Parte General; arts. 957, 1000-1015 CCyC).",
    "src": "quiz",
    "tema": "Elementos del contrato",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Sujetos, oferta, voluntad y obligaciones",
      "Capacidad, consentimiento, objeto, causa y forma",
      "Sujetos, papel, clausulas y capacidad",
      "Precio, cosa, plazo y firma"
    ],
    "correct": 1
  },
  {
    "id": "qu7-022",
    "unit": 7,
    "q": "¿El consumo de determinados productos puede alterar la voluntad a la hora de celebrar contratos?",
    "expl": "Depende de si el consumo priva del discernimiento; en ese caso el acto es involuntario e invalido (art. 261 CCyC).",
    "src": "quiz",
    "tema": "Vicios del consentimiento",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "No, nunca",
      "Si, siempre lo invalida automaticamente",
      "Depende: si afecta el discernimiento, si",
      "Solo si lo declara un medico"
    ],
    "correct": 2
  },
  {
    "id": "qu7-024",
    "unit": 7,
    "q": "Teniendo en cuenta lo dispuesto por el CCyC, ¿seria valido un contrato celebrado en una servilleta como en la serie?",
    "expl": "Si: rige la libertad de formas y el soporte es libre, salvo que la ley exija forma especial para ese contrato (art. 1015 CCyC).",
    "src": "quiz",
    "tema": "Forma de los contratos",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "No, por falta de soporte adecuado",
      "Si, por el principio de libertad de formas",
      "No, salvo que lo certifique un escribano",
      "Solo si lo ratifican luego por escritura"
    ],
    "correct": 1
  },
  {
    "id": "qu7-026",
    "unit": 7,
    "q": "¿A que adiccion sufria el CEO del episodio?",
    "expl": "Dato del episodio: el CEO tenia adiccion al alcohol y al poker.",
    "src": "quiz",
    "tema": "Caso Suits",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Autos caros",
      "Criptomonedas",
      "Apuestas deportivas",
      "Alcohol y poker"
    ],
    "correct": 3
  },
  {
    "id": "qu7-027",
    "unit": 7,
    "q": "¿Como resolvieron el conflicto del ballet en el episodio?",
    "expl": "El conflicto se resolvio despidiendo al director y pagando la deuda pendiente del fondo (datos del episodio; resolucion por incumplimiento, arts. 1083-1089 CCyC).",
    "src": "quiz",
    "tema": "Caso Suits - resolucion locacion",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Se mudaron de salon",
      "No habia conflicto real",
      "Despidieron al director y pagaron la deuda",
      "Aumentaron la cuota a los alumnos"
    ],
    "correct": 2
  },
  {
    "id": "qu7-028",
    "unit": 7,
    "q": "Los contratos son fuente de obligaciones.",
    "expl": "El contrato es una de las principales fuentes de las obligaciones (arts. 726 y 957 CCyC).",
    "src": "quiz",
    "tema": "Contrato fuente de obligaciones",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-029",
    "unit": 7,
    "q": "En el contrato de obra y de servicios, ¿que tipo de obligacion asume cada uno?",
    "expl": "El contrato de obra promete un resultado concreto; el de servicios promete una actividad diligente (medios) (arts. 1251-1252 CCyC).",
    "src": "quiz",
    "tema": "Obra y servicios",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Obra es obligacion de resultado y servicios de medios",
      "Obra es obligacion de medios y servicios de resultado",
      "Ambos son obligaciones de resultado",
      "Ambos son obligaciones de medios"
    ],
    "correct": 0
  },
  {
    "id": "qu7-030",
    "unit": 7,
    "q": "En la normativa vigente en 2026, ¿cual es el plazo minimo legal supletorio de una locacion de inmueble cuando las partes no pactan uno mayor?",
    "expl": "La Ley 27.551 (3 años) fue derogada por el DNU 70/2023, consolidado por la Ley Bases 27.742. El art. 1198 CCyC reformado fija un minimo supletorio de 2 años cuando no se pacta uno mayor (salvo excepciones del art. 1199).",
    "src": "quiz",
    "tema": "Locacion - plazo vigente",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "3 años, segun la Ley 27.551",
      "5 años",
      "2 años",
      "No existe plazo minimo de ningun tipo"
    ],
    "correct": 2
  },
  {
    "id": "qu7-031",
    "unit": 7,
    "q": "¿Cuando puede el tomador ejercer la opcion de compra en un leasing?",
    "expl": "El art. 1240 CCyC permite ejercer la opcion de compra una vez pagadas las 3/4 partes del canon total, o antes si las partes lo convinieron.",
    "src": "quiz",
    "tema": "Leasing - opcion de compra",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Solo al finalizar todo el plazo",
      "Una vez pagadas las tres cuartas partes del canon total, o antes si se pacto",
      "Una vez pagada la mitad del canon",
      "Desde la firma del contrato, sin pagar canon"
    ],
    "correct": 1
  },
  {
    "id": "qu7-032",
    "unit": 7,
    "q": "La donacion de un inmueble es valida aunque no se haga por escritura publica, siempre que conste por escrito.",
    "expl": "Falso: la donacion de inmuebles debe hacerse por escritura publica bajo pena de nulidad; es solemne absoluta (art. 1552 CCyC).",
    "src": "quiz",
    "tema": "Donacion - forma",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu7-033",
    "unit": 7,
    "q": "¿Que se requiere para que la cesion de un derecho sea oponible al deudor cedido?",
    "expl": "La cesion es oponible al deudor cedido y a terceros desde su notificacion por instrumento publico o privado de fecha cierta (art. 1620 CCyC).",
    "src": "quiz",
    "tema": "Cesion de derechos",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Que se inscriba en un registro publico",
      "La firma de dos testigos",
      "Nada: basta el acuerdo entre cedente y cesionario",
      "La notificacion al deudor cedido por instrumento publico o privado de fecha cierta"
    ],
    "correct": 3
  },
  {
    "id": "qu7-034",
    "unit": 7,
    "q": "La extincion de un contrato por incumplimiento de la otra parte, con efecto retroactivo, se denomina:",
    "expl": "La resolucion opera por incumplimiento (o clausula/condicion resolutoria) y tiene efecto retroactivo (arts. 1083-1089 CCyC). La rescision bilateral es por acuerdo mutuo.",
    "src": "quiz",
    "tema": "Extincion - conceptos",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Rescision bilateral",
      "Revocacion",
      "Resolucion",
      "Novacion"
    ],
    "correct": 2
  },
  {
    "id": "qu7-035",
    "unit": 7,
    "q": "Cuando ambas partes deciden de comun acuerdo dejar sin efecto un contrato, se trata de:",
    "expl": "La rescision bilateral o distracto es la extincion por acuerdo de ambas partes (art. 1076 CCyC).",
    "src": "quiz",
    "tema": "Extincion - rescision bilateral",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Rescision bilateral (distracto)",
      "Revocacion",
      "Resolucion por incumplimiento",
      "Nulidad"
    ],
    "correct": 0
  },
  {
    "id": "qu7-036",
    "unit": 7,
    "q": "¿Que se obliga a hacer el mandatario en el contrato de mandato?",
    "expl": "El mandatario se obliga a realizar uno o mas actos juridicos en interes del mandante (art. 1319 CCyC); las tareas materiales corresponden a obra/servicios.",
    "src": "quiz",
    "tema": "Mandato",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Una obra material",
      "Uno o mas actos juridicos en interes del mandante",
      "Custodiar y guardar una cosa",
      "Promover negocios sin representacion",
      "Transferir la propiedad de una cosa"
    ],
    "correct": 1
  },
  {
    "id": "qu7-037",
    "unit": 7,
    "q": "¿Cual de estas afirmaciones sobre el contrato de agencia es correcta?",
    "expl": "El agente es un intermediario independiente que promueve negocios; no asume el riesgo ni representa al preponente salvo facultad expresa (art. 1479 CCyC).",
    "src": "quiz",
    "tema": "Agencia",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "El agente asume el riesgo de todas las operaciones",
      "El agente representa siempre al preponente frente a terceros",
      "El agente es un intermediario independiente que promueve negocios, sin asumir el riesgo ni representar al preponente",
      "El agente compra mercaderia y la revende por cuenta propia"
    ],
    "correct": 2
  },
  {
    "id": "qu7-038",
    "unit": 7,
    "q": "En el contrato de franquicia, respecto del control del negocio:",
    "expl": "El franquiciante no puede tener participacion accionaria de control en el negocio del franquiciado; son partes independientes (art. 1512 CCyC).",
    "src": "quiz",
    "tema": "Franquicia",
    "dif": "media",
    "kind": "single",
    "opts": [
      "El franquiciante debe ser socio mayoritario del franquiciado",
      "El franquiciado controla la marca del franquiciante",
      "Ambos deben constituir una sociedad comun",
      "El franquiciante no puede tener participacion accionaria de control en el negocio del franquiciado"
    ],
    "correct": 3
  },
  {
    "id": "qu7-039",
    "unit": 7,
    "q": "¿Que distingue a la permuta del suministro?",
    "expl": "La permuta es el intercambio reciproco de cosas que no son dinero (art. 1172); el suministro es la entrega periodica o continuada de bienes/servicios (art. 1176 CCyC).",
    "src": "quiz",
    "tema": "Permuta y suministro",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Son sinonimos",
      "La permuta intercambia cosas que no son dinero; el suministro es la entrega periodica o continuada de bienes o servicios contra pago",
      "La permuta es periodica y el suministro instantaneo",
      "La permuta exige escritura publica siempre"
    ],
    "correct": 1
  },
  {
    "id": "qu7-040",
    "unit": 7,
    "q": "Un contrato en el que el beneficio o la perdida de las partes depende de un hecho incierto es:",
    "expl": "En el contrato aleatorio las ventajas o perdidas dependen de un acontecimiento incierto, como el seguro o la renta vitalicia (art. 968 CCyC).",
    "src": "quiz",
    "tema": "Clasificacion - conmutativo/aleatorio",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Conmutativo",
      "Unilateral",
      "Gratuito",
      "Aleatorio"
    ],
    "correct": 3
  },
  {
    "id": "qu7-041",
    "unit": 7,
    "q": "¿Cual de estos contratos es un ejemplo tipico de contrato gratuito?",
    "expl": "El comodato (prestamo de uso) es esencialmente gratuito (art. 1533 CCyC); la compraventa, locacion y leasing son onerosos.",
    "src": "quiz",
    "tema": "Clasificacion - oneroso/gratuito",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "La compraventa",
      "La locacion",
      "El comodato",
      "El leasing"
    ],
    "correct": 2
  },
  {
    "id": "qu7-042",
    "unit": 7,
    "q": "¿Cual de los siguientes contratos debe otorgarse por escritura publica?",
    "expl": "Deben otorgarse por escritura publica los contratos que tienen por objeto la adquisicion, modificacion o extincion de derechos reales sobre inmuebles, salvo subasta (art. 1017 inc. a CCyC).",
    "src": "quiz",
    "tema": "Forma - escritura publica",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Una locacion de un departamento por dos años",
      "La compra de un electrodomestico",
      "La adquisicion de un derecho real sobre un inmueble",
      "Un mandato verbal para gestiones simples"
    ],
    "correct": 2
  },
  {
    "id": "qu7-043",
    "unit": 7,
    "q": "El boleto de compraventa de un inmueble, al no estar en escritura publica:",
    "expl": "La compraventa inmobiliaria es solemne relativa: el boleto vale como contrato en que las partes se obligan a otorgar la escritura, y el juez puede otorgarla si una parte no lo hace (arts. 969 y 1018 CCyC).",
    "src": "quiz",
    "tema": "Forma - solemne relativa",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Es nulo de nulidad absoluta y no produce ningun efecto",
      "Convierte la compraventa en donacion",
      "Vale como contrato que obliga a otorgar la escritura (obligacion de escriturar)",
      "Es valido como compraventa definitiva sin mas tramite"
    ],
    "correct": 2
  },
  {
    "id": "qu7-044",
    "unit": 7,
    "q": "En un contrato bilateral, una parte puede suspender su propio cumplimiento hasta que la otra cumpla u ofrezca cumplir.",
    "expl": "Es la suspension del cumplimiento o exceptio non adimpleti contractus (art. 1031 CCyC).",
    "src": "quiz",
    "tema": "Efectos - excepcion de incumplimiento",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-045",
    "unit": 7,
    "q": "Si por un acontecimiento extraordinario e imprevisible la prestacion de un contrato conmutativo de ejecucion diferida se vuelve excesivamente onerosa, la parte perjudicada puede:",
    "expl": "La teoria de la imprevision permite a la parte perjudicada pedir la resolucion o la adecuacion (renegociacion) del contrato (art. 1091 CCyC). No se aplica a los aleatorios ni si hay mora.",
    "src": "quiz",
    "tema": "Efectos - imprevision",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Incumplir sin consecuencias",
      "Exigir el doble de la prestacion",
      "Pedir la resolucion o la adecuacion del contrato por la teoria de la imprevision",
      "Nada: el contrato siempre se cumple tal cual fue pactado"
    ],
    "correct": 2
  },
  {
    "id": "qu7-046",
    "unit": 7,
    "q": "En un contrato por adhesion, las clausulas que desnaturalizan las obligaciones del predisponente:",
    "expl": "Las clausulas abusivas (entre ellas las que desnaturalizan las obligaciones del predisponente) se tienen por no escritas (art. 988 CCyC).",
    "src": "quiz",
    "tema": "Clausulas abusivas",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Son validas si el adherente las firmo",
      "Obligan al adherente igual",
      "Convierten el contrato en paritario",
      "Se tienen por no escritas"
    ],
    "correct": 3
  },
  {
    "id": "qu7-047",
    "unit": 7,
    "q": "Si la causa de un contrato es ilicita (por ejemplo, contratar para cometer un delito), el contrato es nulo.",
    "expl": "La causa ilicita o contraria a la moral, el orden publico o las buenas costumbres provoca la nulidad del contrato (arts. 1012-1014 CCyC).",
    "src": "quiz",
    "tema": "Causa",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-048",
    "unit": 7,
    "q": "El silencio siempre importa aceptacion de una oferta.",
    "expl": "Falso: el silencio solo importa aceptacion cuando existe un deber de expedirse derivado de la ley, la voluntad de las partes, los usos o una relacion previa (art. 979 CCyC).",
    "src": "quiz",
    "tema": "Aceptacion - silencio",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu7-049",
    "unit": 7,
    "q": "El contrato de renta vitalicia se caracteriza por ser:",
    "expl": "La renta vitalicia es onerosa y aleatoria: a cambio de un capital se paga una renta periodica durante la vida de las personas designadas (art. 1599 CCyC).",
    "src": "quiz",
    "tema": "Renta vitalicia",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Gratuito y conmutativo",
      "Unilateral y de ejecucion instantanea",
      "Formal solemne absoluto",
      "Oneroso y aleatorio, pues la renta se paga durante la vida de personas designadas"
    ],
    "correct": 3
  },
  {
    "id": "qu7-050",
    "unit": 7,
    "q": "Si la cesion de un derecho se hace sin contraprestacion alguna, se le aplican las reglas de:",
    "expl": "Cuando la cesion es gratuita se aplican las reglas de la donacion; con precio en dinero, las de la compraventa; con otra cosa, las de la permuta (art. 1614 CCyC).",
    "src": "quiz",
    "tema": "Cesion - reglas aplicables",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "La donacion",
      "La compraventa",
      "La permuta",
      "El mutuo"
    ],
    "correct": 0
  },
  {
    "id": "qu7-051",
    "unit": 7,
    "q": "Un contrato de seguro es bilateral pero aleatorio.",
    "expl": "Verdadero: el seguro es bilateral (ambas partes se obligan) y a la vez aleatorio (la prestacion del asegurador depende de un hecho incierto). No hay que confundir bilateral con conmutativo (arts. 966 y 968 CCyC).",
    "src": "quiz",
    "tema": "Clasificacion - bilateral/conmutativo",
    "trap": true,
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu7-052",
    "unit": 7,
    "q": "Si en un contrato el precio se paga parte en dinero y parte con otra cosa, y el valor de la cosa es mayor que el del dinero, el contrato es:",
    "expl": "Si la cosa entregada vale mas que el dinero, el contrato es de permuta; si el dinero es igual o mayor, es compraventa (art. 1126 CCyC).",
    "src": "quiz",
    "tema": "Compraventa vs permuta",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Compraventa",
      "Donacion",
      "Permuta",
      "Suministro"
    ],
    "correct": 2
  },
  {
    "id": "qu7-053",
    "unit": 7,
    "q": "La garantia que debe el transmitente a titulo oneroso frente a las turbaciones de derecho de un tercero que privan al adquirente de la cosa se llama:",
    "expl": "La eviccion garantiza al adquirente frente a turbaciones de derecho de terceros; los vicios redhibitorios cubren defectos ocultos (arts. 1044-1058 CCyC).",
    "src": "quiz",
    "tema": "Saneamiento - eviccion",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Eviccion",
      "Vicios redhibitorios",
      "Imprevision",
      "Frustracion del fin"
    ],
    "correct": 0
  },
  {
    "id": "qu8-001",
    "unit": 8,
    "q": "Segun el art. 1 de la Ley 24.240, ?quien es consumidor en sentido estricto?",
    "expl": "El art. 1 LDC define al consumidor como toda persona fisica o juridica que adquiere o utiliza bienes o servicios, gratuita u onerosamente, como destinatario final (art. 1 Ley 24.240).",
    "src": "quiz",
    "tema": "Consumidor (art. 1 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Toda persona que produce bienes para el mercado",
      "Unicamente la persona fisica que compra al por menor",
      "Toda persona fisica o juridica que adquiere o utiliza bienes o servicios como destinatario final",
      "El comerciante que revende los bienes adquiridos"
    ],
    "correct": 2
  },
  {
    "id": "qu8-002",
    "unit": 8,
    "q": "La figura del 'consumidor expuesto' (bystander) sigue vigente en el texto general del art. 1 de la Ley 24.240 tal como fue incorporada por la Ley 26.361.",
    "expl": "Falso. La Ley 26.994 (CCyC, 2015) elimino al 'expuesto' del art. 1 LDC; solo subsiste para las practicas comerciales en el art. 1096 CCyC.",
    "src": "quiz",
    "tema": "Consumidor expuesto (art. 1 LDC / 1096 CCyC)",
    "trap": true,
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-003",
    "unit": 8,
    "q": "Respecto de los profesionales liberales con titulo universitario y matricula, la Ley 24.240 establece que:",
    "expl": "El art. 2 LDC excluye los servicios de profesionales liberales que requieran titulo universitario y matricula, pero si alcanza la publicidad de su ofrecimiento (art. 2 Ley 24.240).",
    "src": "quiz",
    "tema": "Proveedor (art. 2 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "No estan comprendidos en la ley, pero si lo esta la publicidad de su ofrecimiento",
      "Estan plenamente alcanzados por la LDC en todos sus servicios",
      "Estan alcanzados solo si facturan mas de cierto monto",
      "Solo se les aplica la ley si son sociedades comerciales"
    ],
    "correct": 0
  },
  {
    "id": "qu8-004",
    "unit": 8,
    "q": "Para ser considerado proveedor en los terminos del art. 2 LDC es necesario que la actividad sea habitual; la actividad ocasional nunca configura proveedor.",
    "expl": "Falso. El art. 2 LDC dice expresamente que el proveedor desarrolla su actividad 'de manera profesional, aun ocasionalmente'.",
    "src": "quiz",
    "tema": "Proveedor (art. 2 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-005",
    "unit": 8,
    "q": "En caso de duda sobre la interpretacion de los principios de la Ley 24.240, ?que regla se aplica?",
    "expl": "El art. 3 LDC consagra el principio in dubio pro consumidor: en caso de duda prevalece la interpretacion mas favorable al consumidor.",
    "src": "quiz",
    "tema": "Relacion de consumo (art. 3 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Prevalece la interpretacion mas favorable al proveedor",
      "Prevalece la interpretacion literal del contrato",
      "Se aplica el Codigo de Comercio supletoriamente",
      "Prevalece la interpretacion mas favorable al consumidor"
    ],
    "correct": 3
  },
  {
    "id": "qu8-006",
    "unit": 8,
    "q": "La Ley 24.240 es de orden publico, por lo que sus disposiciones son irrenunciables y el juez puede aplicarla de oficio.",
    "expl": "Verdadero. El art. 65 LDC declara que la ley es de orden publico, lo que la torna irrenunciable y de aplicacion oficiosa.",
    "src": "quiz",
    "tema": "Orden publico (art. 65 LDC)",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-007",
    "unit": 8,
    "q": "Segun el art. 4 LDC, la informacion al consumidor debe ser:",
    "expl": "El art. 4 LDC exige informacion cierta, clara y detallada, y siempre gratuita para el consumidor.",
    "src": "quiz",
    "tema": "Deber de informacion (art. 4 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Cierta, clara, detallada y gratuita",
      "Verbal y a pedido del consumidor",
      "Onerosa pero comprensible",
      "Solo escrita y en idioma extranjero si el producto es importado"
    ],
    "correct": 0
  },
  {
    "id": "qu8-008",
    "unit": 8,
    "q": "?Que efecto tienen las precisiones formuladas en la publicidad segun el art. 8 LDC?",
    "expl": "El art. 8 LDC establece que las precisiones de la publicidad obligan al oferente y se tienen por incluidas en el contrato con el consumidor (concordante con art. 1103 CCyC).",
    "src": "quiz",
    "tema": "Efecto de la publicidad (art. 8 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Obligan al oferente y se tienen por incluidas en el contrato",
      "Son meramente informativas y no obligan al oferente",
      "Solo obligan si el consumidor las acepta por escrito",
      "Obligan unicamente si fueron publicadas en medios graficos"
    ],
    "correct": 0
  },
  {
    "id": "qu8-009",
    "unit": 8,
    "q": "En una relacion de consumo, la oferta dirigida a consumidores potenciales indeterminados obliga a quien la emite durante el tiempo en que se realice.",
    "expl": "Verdadero. El art. 7 LDC obliga al oferente; esto invierte la regla del derecho comun (art. 972 CCyC), donde la oferta al publico en principio no obliga.",
    "src": "quiz",
    "tema": "Oferta (art. 7 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-010",
    "unit": 8,
    "q": "El art. 8 bis LDC (trato digno) obliga a los proveedores a abstenerse de:",
    "expl": "El art. 8 bis LDC (incorporado por Ley 26.361) impone el trato digno y prohibe conductas vergonzantes, vejatorias o intimidatorias; su violacion puede generar dano punitivo (art. 52 bis).",
    "src": "quiz",
    "tema": "Trato digno (art. 8 bis LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Publicar sus precios",
      "Conductas que coloquen al consumidor en situaciones vergonzantes, vejatorias o intimidatorias",
      "Otorgar garantia legal",
      "Vender productos importados"
    ],
    "correct": 1
  },
  {
    "id": "qu8-011",
    "unit": 8,
    "q": "?Cual es el plazo de garantia legal para cosas muebles no consumibles NUEVAS?",
    "expl": "El art. 11 LDC fija 6 meses para cosas nuevas y 3 meses para usadas, a partir de la entrega.",
    "src": "quiz",
    "tema": "Garantia legal (art. 11 LDC)",
    "trap": true,
    "dif": "facil",
    "kind": "single",
    "opts": [
      "3 meses",
      "1 ano",
      "6 meses",
      "12 meses prorrogables"
    ],
    "correct": 2
  },
  {
    "id": "qu8-012",
    "unit": 8,
    "q": "La garantia legal para bienes muebles USADOS es de:",
    "expl": "El art. 11 LDC establece 3 meses para bienes muebles usados (y 6 meses para los demas casos).",
    "src": "quiz",
    "tema": "Garantia legal (art. 11 LDC)",
    "trap": true,
    "dif": "facil",
    "kind": "single",
    "opts": [
      "6 meses",
      "1 ano",
      "3 meses",
      "30 dias"
    ],
    "correct": 2
  },
  {
    "id": "qu8-013",
    "unit": 8,
    "q": "Las partes pueden pactar un plazo de garantia MENOR al legal de 6 o 3 meses si el consumidor lo acepta por escrito.",
    "expl": "Falso. El art. 11 LDC solo permite convenir un plazo MAYOR; al ser la ley de orden publico (art. 65), no puede pactarse uno menor.",
    "src": "quiz",
    "tema": "Garantia (arts. 11 y 13 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-014",
    "unit": 8,
    "q": "Si la reparacion en garantia no resulta satisfactoria, el consumidor puede (art. 17 LDC):",
    "expl": "El art. 17 LDC ofrece tres opciones: sustitucion (con recomputo del plazo), devolucion contra el importe equivalente, o quita proporcional del precio, sin perjuicio de los danos.",
    "src": "quiz",
    "tema": "Reparacion no satisfactoria (art. 17 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Solo exigir una nueva reparacion",
      "Unicamente reclamar dano moral",
      "Rescindir el contrato pero sin restitucion del precio",
      "Pedir la sustitucion por otra cosa identica, devolver la cosa contra el importe equivalente, u obtener una quita proporcional"
    ],
    "correct": 3
  },
  {
    "id": "qu8-015",
    "unit": 8,
    "q": "El tiempo en que el consumidor esta privado del uso de la cosa por su reparacion en garantia se computa como prolongacion del plazo de garantia legal.",
    "expl": "Verdadero. El art. 16 LDC dispone que ese tiempo prolonga el plazo de garantia.",
    "src": "quiz",
    "tema": "Prolongacion de garantia (art. 16 LDC)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-016",
    "unit": 8,
    "q": "Cuando se interrumpe un servicio publico domiciliario, se presume que la causa es imputable a la empresa prestadora.",
    "expl": "Verdadero. El art. 30 LDC presume la imputabilidad a la empresa, que tiene 30 dias para demostrar lo contrario (inversion de la carga probatoria).",
    "src": "quiz",
    "tema": "Servicios publicos domiciliarios (art. 30 LDC)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-017",
    "unit": 8,
    "q": "Segun el art. 31 LDC, se presume error en la facturacion de un servicio publico con variaciones estacionales cuando el consumo facturado excede el promedio del mismo periodo de los dos anos anteriores en mas de:",
    "expl": "El art. 31 LDC presume error cuando la factura excede en mas del 75% el promedio del mismo periodo de los 2 anos anteriores.",
    "src": "quiz",
    "tema": "Facturacion excesiva (art. 31 LDC)",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "25%",
      "50%",
      "100%",
      "75%"
    ],
    "correct": 3
  },
  {
    "id": "qu8-018",
    "unit": 8,
    "q": "En las ventas a distancia o domiciliarias, el plazo para revocar la aceptacion es de:",
    "expl": "El art. 34 LDC fija 10 dias CORRIDOS contados desde la entrega del bien o la celebracion del contrato, lo ultimo que ocurra.",
    "src": "quiz",
    "tema": "Derecho de revocacion (art. 34 LDC)",
    "trap": true,
    "dif": "facil",
    "kind": "single",
    "opts": [
      "10 dias corridos",
      "10 dias habiles",
      "5 dias corridos",
      "30 dias corridos"
    ],
    "correct": 0
  },
  {
    "id": "qu8-019",
    "unit": 8,
    "q": "El derecho de revocacion del art. 34 LDC puede ser renunciado por el consumidor mediante una clausula contractual clara.",
    "expl": "Falso. El art. 34 LDC dispone que esta facultad no puede ser dispensada ni renunciada; cualquier clausula en contrario es nula.",
    "src": "quiz",
    "tema": "Derecho de revocacion (art. 34 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-020",
    "unit": 8,
    "q": "Cuando el consumidor revoca una compra a distancia, ?quien soporta los gastos de devolucion del bien?",
    "expl": "El art. 34 LDC establece que los gastos de devolucion son por cuenta del vendedor.",
    "src": "quiz",
    "tema": "Derecho de revocacion (art. 34 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "El vendedor",
      "El consumidor",
      "Se reparten por mitades",
      "El transportista"
    ],
    "correct": 0
  },
  {
    "id": "qu8-021",
    "unit": 8,
    "q": "Conforme el art. 37 LDC, una clausula que impone al consumidor la inversion de la carga de la prueba:",
    "expl": "El art. 37 inc c LDC tiene por no convenida la clausula que impone la inversion de la carga de la prueba en perjuicio del consumidor; el contrato subsiste y el juez lo integra.",
    "src": "quiz",
    "tema": "Clausulas abusivas (art. 37 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Se tiene por no convenida",
      "Es valida si esta en letra destacada",
      "Anula todo el contrato",
      "Solo es ineficaz en contratos de adhesion"
    ],
    "correct": 0
  },
  {
    "id": "qu8-022",
    "unit": 8,
    "q": "Si el dano al consumidor resulta del vicio o riesgo de la cosa, la responsabilidad de la cadena de comercializacion es:",
    "expl": "El art. 40 LDC establece la responsabilidad solidaria de toda la cadena (productor, fabricante, importador, distribuidor, vendedor, quien puso su marca).",
    "src": "quiz",
    "tema": "Responsabilidad por danos (art. 40 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Mancomunada simple",
      "Solidaria",
      "Exclusiva del vendedor final",
      "Subsidiaria del fabricante"
    ],
    "correct": 1
  },
  {
    "id": "qu8-023",
    "unit": 8,
    "q": "?Como puede eximirse de responsabilidad un integrante de la cadena conforme el art. 40 LDC?",
    "expl": "El art. 40 LDC solo libera total o parcialmente a quien demuestre que la causa del dano le ha sido ajena (responsabilidad objetiva).",
    "src": "quiz",
    "tema": "Eximente del art. 40 LDC",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Demostrando que actuo con diligencia",
      "Demostrando que no obtuvo beneficio",
      "Demostrando que la causa del dano le ha sido ajena",
      "No puede eximirse nunca"
    ],
    "correct": 2
  },
  {
    "id": "qu8-024",
    "unit": 8,
    "q": "Al enchufar un televisor, un cable fallado provoca la muerte de una persona. ?Quien responde por los danos segun la LDC?",
    "expl": "El art. 40 LDC hace responder solidariamente a toda la cadena por el dano derivado del vicio o riesgo de la cosa; el transportista responde por danos en ocasion del servicio.",
    "src": "quiz",
    "tema": "Caso 8 - cable fallado (art. 40 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Solo el vendedor del televisor",
      "Solo el fabricante del cable",
      "Toda la cadena: productor, fabricante, importador, quien puso la marca y vendedor, en forma solidaria",
      "Nadie, por tratarse de caso fortuito"
    ],
    "correct": 2
  },
  {
    "id": "qu8-025",
    "unit": 8,
    "q": "El dano directo del art. 40 bis LDC se caracteriza porque:",
    "expl": "El art. 40 bis LDC faculta a la autoridad de aplicacion (administrativa) a determinar el dano directo hasta un maximo de 5 CBT tipo 3 del INDEC.",
    "src": "quiz",
    "tema": "Dano directo (art. 40 bis LDC)",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Lo determina el juez, sin tope",
      "Lo determina la autoridad, sin tope",
      "Lo determina el juez con tope de 2.100 Canastas Basicas",
      "Lo determina la autoridad de aplicacion, con tope de 5 Canastas Basicas Totales tipo 3"
    ],
    "correct": 3
  },
  {
    "id": "qu8-026",
    "unit": 8,
    "q": "El dano punitivo (multa civil) del art. 52 bis LDC:",
    "expl": "El art. 52 bis LDC dispone que el juez aplica la multa civil a instancia del damnificado y a favor del consumidor, independientemente de otras indemnizaciones.",
    "src": "quiz",
    "tema": "Dano punitivo (art. 52 bis LDC)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Lo aplica la autoridad administrativa de oficio",
      "Lo aplica el juez a instancia del damnificado y a favor del consumidor",
      "Va al Estado nacional",
      "Solo procede en relaciones laborales"
    ],
    "correct": 1
  },
  {
    "id": "qu8-027",
    "unit": 8,
    "q": "?Cual es el tope maximo vigente del dano punitivo del art. 52 bis LDC tras la reforma de la Ley 27.701?",
    "expl": "El art. 52 bis remite al art. 47 inc b, modificado por el art. 119 de la Ley 27.701 (BO 1/12/2022): tope de 2.100 CBT tipo 3, actualizable mensualmente. El antiguo $5.000.000 quedo derogado.",
    "src": "quiz",
    "tema": "Tope dano punitivo (art. 52 bis / 47 LDC / Ley 27.701)",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "$5.000.000 fijos",
      "5 Canastas Basicas Totales",
      "No tiene tope",
      "2.100 Canastas Basicas Totales tipo 3 (INDEC), actualizables mensualmente"
    ],
    "correct": 3
  },
  {
    "id": "qu8-028",
    "unit": 8,
    "q": "Segun la doctrina mayoritaria, el dano punitivo procede automaticamente ante cualquier incumplimiento del proveedor, sin necesidad de una conducta especialmente grave.",
    "expl": "Falso. La doctrina y jurisprudencia mayoritarias exigen una conducta grave, dolo o culpa grave; no basta el mero incumplimiento (art. 52 bis LDC).",
    "src": "quiz",
    "tema": "Dano punitivo (art. 52 bis LDC)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-029",
    "unit": 8,
    "q": "?Cual es la diferencia entre la multa del art. 47 y la multa civil del art. 52 bis LDC?",
    "expl": "La multa del art. 47 es administrativa (la aplica la autoridad de aplicacion, su producido va a un fondo estatal); la del art. 52 bis es una multa civil que fija el juez a favor del consumidor.",
    "src": "quiz",
    "tema": "Distincion multa administrativa vs civil (arts. 47 y 52 bis LDC)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "No hay diferencia, son la misma sancion",
      "La del art. 47 es administrativa y va al Estado; la del art. 52 bis es civil, la fija el juez y va al consumidor",
      "Ambas van al consumidor",
      "Ambas las fija la autoridad administrativa"
    ],
    "correct": 1
  },
  {
    "id": "qu8-030",
    "unit": 8,
    "q": "?Cual es el plazo de prescripcion de las acciones de la Ley 24.240?",
    "expl": "El art. 50 LDC fija 3 anos; si otra ley preve un plazo distinto, rige el mas favorable al consumidor.",
    "src": "quiz",
    "tema": "Prescripcion (art. 50 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "3 anos",
      "2 anos",
      "5 anos",
      "10 anos"
    ],
    "correct": 0
  },
  {
    "id": "qu8-031",
    "unit": 8,
    "q": "?Quien es la autoridad nacional de aplicacion de la Ley 24.240?",
    "expl": "El art. 41 LDC designa a la Secretaria de Comercio Interior como autoridad nacional; CABA y provincias actuan como autoridades locales.",
    "src": "quiz",
    "tema": "Autoridad de aplicacion (art. 41 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "El Banco Central",
      "La Secretaria de Comercio Interior",
      "La AFIP",
      "La Comision Nacional de Valores"
    ],
    "correct": 1
  },
  {
    "id": "qu8-032",
    "unit": 8,
    "q": "Ademas del propio consumidor, ?quienes estan legitimados para iniciar acciones bajo la LDC (art. 52)?",
    "expl": "El art. 52 LDC legitima al consumidor, a las asociaciones autorizadas (art. 56), a la autoridad de aplicacion, al Defensor del Pueblo y al Ministerio Publico Fiscal.",
    "src": "quiz",
    "tema": "Acciones colectivas y legitimacion (art. 52 LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Solo el Ministerio de Economia",
      "Unicamente los jueces de oficio",
      "Las asociaciones de consumidores autorizadas, la autoridad de aplicacion, el Defensor del Pueblo y el Ministerio Publico Fiscal",
      "Cualquier comerciante competidor"
    ],
    "correct": 2
  },
  {
    "id": "qu8-033",
    "unit": 8,
    "q": "Las asociaciones de consumidores pueden recibir aportes y donaciones de empresas comerciales para financiar su actividad.",
    "expl": "Falso. El art. 57 LDC les prohibe recibir donaciones o aportes de empresas y exige independencia de toda actividad comercial/profesional.",
    "src": "quiz",
    "tema": "Asociaciones de consumidores (art. 57 LDC)",
    "trap": true,
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-034",
    "unit": 8,
    "q": "Tu contador no presento la declaracion jurada en termino y te aplicaron una multa. ?Podes reclamarle por la Ley 24.240?",
    "expl": "El art. 2 LDC excluye los servicios de profesionales liberales con titulo universitario y matricula; el reclamo va por la via civil/contractual comun y ante el colegio que controla la matricula.",
    "src": "quiz",
    "tema": "Caso 2 - profesional liberal (art. 2 LDC)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Si, porque presto un servicio defectuoso",
      "Si, con dano punitivo incluido",
      "Solo ante la autoridad de aplicacion de consumo",
      "No, porque el servicio del profesional liberal con titulo y matricula esta excluido del art. 2 LDC (salvo la publicidad)"
    ],
    "correct": 3
  },
  {
    "id": "qu8-035",
    "unit": 8,
    "q": "Compraste un producto remanufacturado que te vendieron como nuevo. ?Que via tenes conforme la LDC?",
    "expl": "El art. 9 LDC obliga a indicar de forma precisa que la cosa es usada o reconstituida; su omision viola el deber de informacion (art. 4) y habilita las opciones del art. 10 bis (cumplimiento, equivalente o rescision).",
    "src": "quiz",
    "tema": "Caso 5 - producto remanufacturado (arts. 9 y 10 bis LDC)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Reclamar por violacion del deber de informacion (art. 4) y del art. 9 (cosas usadas/reconstituidas deben indicarse), pudiendo exigir cumplimiento, sustitucion o rescision (art. 10 bis)",
      "Nada, porque funciona",
      "Solo el derecho de revocacion de 10 dias",
      "Solo dano moral"
    ],
    "correct": 0
  },
  {
    "id": "qu8-036",
    "unit": 8,
    "q": "Si compraste un producto nocivo en un sitio de subastas online sin que se indicara su peligrosidad, el sitio intermediario puede ser tambien responsable por el dano.",
    "expl": "Verdadero. El art. 40 LDC extiende la responsabilidad solidaria a toda la cadena de comercializacion; el intermediario que integra la relacion de consumo y omitio informar el riesgo puede responder (arts. 40 y 4/8 LDC).",
    "src": "quiz",
    "tema": "Caso 4 - sitio de subasta (arts. 40 y 8 LDC)",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-037",
    "unit": 8,
    "q": "?Cual es el bien juridico protegido por la Ley 25.156 de Defensa de la Competencia?",
    "expl": "El art. 1 Ley 25.156 protege la libre competencia y el interes economico general; segun Farina, el destinatario final de la tutela es el consumidor. No protege al competidor individual.",
    "src": "quiz",
    "tema": "Defensa de la competencia - bien protegido (art. 1 Ley 25.156)",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "El competidor individual perjudicado",
      "El patrimonio del Estado",
      "La marca registrada",
      "El mercado y el interes economico general (con el consumidor como destinatario final de la tutela)"
    ],
    "correct": 3
  },
  {
    "id": "qu8-038",
    "unit": 8,
    "q": "Tener posicion dominante en un mercado es, por si solo, una conducta ilegal sancionada por la Ley 25.156.",
    "expl": "Falso. La posicion dominante (art. 4) NO es ilegal; lo que se sanciona es el ABUSO de esa posicion (art. 1 Ley 25.156).",
    "src": "quiz",
    "tema": "Posicion dominante (arts. 1 y 4 Ley 25.156)",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu8-039",
    "unit": 8,
    "q": "Segun el art. 4 de la Ley 25.156, existe posicion dominante cuando una empresa:",
    "expl": "El art. 4 Ley 25.156 define la posicion dominante por ser unica oferente/demandante, no estar expuesta a competencia sustancial, o poder determinar la viabilidad economica de un competidor.",
    "src": "quiz",
    "tema": "Posicion dominante (art. 4 Ley 25.156)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Tiene mas de 10 empleados",
      "Cotiza en bolsa",
      "Exporta sus productos",
      "Es la unica oferente o demandante, o sin serlo no esta expuesta a competencia sustancial"
    ],
    "correct": 3
  },
  {
    "id": "qu8-040",
    "unit": 8,
    "q": "?Cual de las siguientes es una practica restrictiva de la competencia tipificada en el art. 2 de la Ley 25.156?",
    "expl": "El art. 2 Ley 25.156 enumera entre las practicas restrictivas la fijacion concertada de precios (inc a) y el reparto horizontal de zonas, mercados y clientes (inc c) -conductas de cartel-.",
    "src": "quiz",
    "tema": "Practicas anticompetitivas (art. 2 Ley 25.156)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Publicitar productos en idioma nacional",
      "Otorgar garantia legal de 6 meses",
      "Entregar un manual de uso en idioma nacional",
      "Fijar o concertar precios y repartirse zonas o clientes entre competidores"
    ],
    "correct": 3
  },
  {
    "id": "qu8-041",
    "unit": 8,
    "q": "?Cual de los siguientes actos NO constituye una concentracion economica segun el art. 6 de la Ley 25.156?",
    "expl": "El art. 6 Ley 25.156 define la concentracion como toma de control via fusion, transferencia de fondo de comercio o adquisicion de acciones/activos. La publicidad comparativa es materia de lealtad comercial, no de concentracion.",
    "src": "quiz",
    "tema": "Concentracion economica (art. 6 Ley 25.156)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "La fusion entre empresas",
      "La transferencia de fondos de comercio",
      "La publicidad comparativa entre competidores",
      "La adquisicion de acciones que otorgue el control de la empresa"
    ],
    "correct": 2
  },
  {
    "id": "qu8-042",
    "unit": 8,
    "q": "Si el Tribunal de Defensa de la Competencia no resuelve sobre una concentracion notificada dentro del plazo legal, la operacion se tiene por autorizada tacitamente.",
    "expl": "Verdadero. El art. 13 fija 45 dias para resolver y el art. 14 Ley 25.156 establece que el silencio implica autorizacion tacita con los mismos efectos que la expresa.",
    "src": "quiz",
    "tema": "Concentracion - autorizacion tacita (arts. 13-14 Ley 25.156)",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-043",
    "unit": 8,
    "q": "Las acciones que nacen de las infracciones a la Ley 25.156 de Defensa de la Competencia prescriben en:",
    "expl": "El art. 54 Ley 25.156 fija un plazo de prescripcion de 5 anos (a diferencia de los 3 anos de la LDC y de la Lealtad Comercial).",
    "src": "quiz",
    "tema": "Prescripcion competencia (art. 54 Ley 25.156)",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "3 anos",
      "2 anos",
      "5 anos",
      "10 anos"
    ],
    "correct": 2
  },
  {
    "id": "qu8-044",
    "unit": 8,
    "q": "La publicidad enganosa, conforme el art. 9 de la Ley 22.802, es aquella que:",
    "expl": "El art. 9 Ley 22.802 prohibe toda publicidad que por inexactitudes u ocultamientos pueda inducir a error, engano o confusion sobre las caracteristicas, origen, calidad o precio de los bienes y servicios.",
    "src": "quiz",
    "tema": "Lealtad comercial - publicidad enganosa (art. 9 Ley 22.802)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Mediante inexactitudes u ocultamientos puede inducir a error, engano o confusion",
      "Compara productos de la competencia",
      "Se difunde en horario de proteccion al menor",
      "Tiene un costo elevado"
    ],
    "correct": 0
  },
  {
    "id": "qu8-045",
    "unit": 8,
    "q": "Segun la Ley 22.802, las inscripciones sobre los productos nacionales deben estar:",
    "expl": "El art. 4 Ley 22.802 exige que las inscripciones esten en idioma nacional, con excepcion de marcas registradas, signos con aptitud marcaria y vocablos extranjeros de uso comun en el comercio.",
    "src": "quiz",
    "tema": "Identificacion de mercaderias (arts. 1-4 Ley 22.802)",
    "dif": "media",
    "kind": "single",
    "opts": [
      "En ingles, por estandar internacional",
      "Solo en el envase, no en la etiqueta",
      "A eleccion del fabricante",
      "En idioma nacional (salvo marcas registradas y vocablos de uso comun)"
    ],
    "correct": 3
  },
  {
    "id": "qu8-046",
    "unit": 8,
    "q": "La Ley 22.802 prohibe ofrecer premios o regalos sujetos al azar condicionados a la compra de mercaderias o contratacion de servicios.",
    "expl": "Verdadero. El art. 10 Ley 22.802 prohibe ofrecer premios sujetos al azar y los concursos/sorteos condicionados a la adquisicion de un producto o servicio.",
    "src": "quiz",
    "tema": "Premios y sorteos (art. 10 Ley 22.802)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-047",
    "unit": 8,
    "q": "En el fallo Pacheco c/ Cetrogar, la Camara Civil y Comercial de Concepcion (Tucuman) sostuvo que la publicidad enganosa:",
    "expl": "La Camara entendio que la publicidad enganosa se configuro aunque la compra no se concreto: la oferta electronica obligaba (art. 1108 CCyC) y la falta de correspondencia entre precio publicado y cobrado afecto el interes del consumidor.",
    "src": "quiz",
    "tema": "Caso Pacheco c/ Cetrogar - publicidad enganosa",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "No existio porque la compra no se concreto",
      "Se configuro igualmente, pese a no concretarse la operacion, por el interes frustrado del consumidor",
      "Solo aplica a productos importados",
      "Requiere dolo penal probado"
    ],
    "correct": 1
  },
  {
    "id": "qu8-048",
    "unit": 8,
    "q": "?Que monto de dano punitivo se confirmo en el fallo Pacheco c/ Cetrogar (Sentencia Nº 89, 21/04/2021)?",
    "expl": "La sentencia confirmo una multa civil (dano punitivo, art. 52 bis LDC) de $50.000 a favor de la actora, con intereses a tasa activa BNA.",
    "src": "quiz",
    "tema": "Caso Pacheco c/ Cetrogar - monto",
    "dif": "media",
    "kind": "single",
    "opts": [
      "$50.000",
      "$11.999",
      "$308.643.300",
      "$5.000.000"
    ],
    "correct": 0
  },
  {
    "id": "qu8-049",
    "unit": 8,
    "q": "En el caso Pacheco c/ Cetrogar el tribunal aplico el art. 1108 del CCyC, segun el cual las ofertas por medios electronicos deben tener vigencia durante el periodo fijado o mientras permanezcan accesibles a los destinatarios.",
    "expl": "Verdadero. El art. 1108 CCyC fue central en el fallo: la oferta de la TV a $39.999 que cambiaba al avanzar en el carrito no respeto la vigencia exigida.",
    "src": "quiz",
    "tema": "Caso Pacheco - oferta electronica (art. 1108 CCyC)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-050",
    "unit": 8,
    "q": "Respecto de la carga de la prueba, el fallo Pacheco c/ Cetrogar sostuvo que:",
    "expl": "La Camara, sobre la base del art. 40 LDC y la asimetria informatica, valoro los indicios (capturas) aportados por la actora e impuso al proveedor la carga de desvirtuarlos o acreditar el cumplimiento de la oferta.",
    "src": "quiz",
    "tema": "Caso Pacheco - carga de la prueba (art. 40 LDC)",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "El consumidor debe probar acabadamente cada extremo con peritos",
      "La carga recae siempre sobre el juez",
      "Basta que el consumidor acredite indiciariamente (capturas de pantalla); el proveedor debe desvirtuar la oferta o acreditar haberla cumplido",
      "No hay carga probatoria en amparos"
    ],
    "correct": 2
  },
  {
    "id": "qu8-051",
    "unit": 8,
    "q": "Si compraste una torta en mal estado y se intoxican tres invitados a tu cumpleanos, esos invitados que no compraron la torta tambien pueden reclamar por el dano sufrido.",
    "expl": "Verdadero. Conforme la relacion de consumo (art. 1 LDC, equiparacion) y la responsabilidad por danos del art. 40 LDC, los danados aunque no hayan sido compradores pueden reclamar a la cadena de comercializacion responsable.",
    "src": "quiz",
    "tema": "Caso 3 - intoxicacion por torta (arts. 1 y 40 LDC)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu8-052",
    "unit": 8,
    "q": "Las normas con las que se integra la Ley 24.240 conforme su art. 3 son, en particular:",
    "expl": "El art. 3 LDC dispone que sus disposiciones se integran con las normas generales y especiales, en particular la Ley 25.156 de Defensa de la Competencia y la Ley 22.802 de Lealtad Comercial.",
    "src": "quiz",
    "tema": "Integracion normativa (art. 3 LDC)",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "La Ley de Sociedades y la Ley de Concursos",
      "El Codigo Penal y el Codigo Aduanero",
      "La Ley 25.156 de Defensa de la Competencia y la Ley 22.802 de Lealtad Comercial",
      "La Ley de Marcas y la Ley de Patentes"
    ],
    "correct": 2
  },
  {
    "id": "qu8-053",
    "unit": 8,
    "q": "Las acciones y penas emergentes de la Ley 22.802 de Lealtad Comercial prescriben en:",
    "expl": "El art. 26 Ley 22.802 fija un plazo de prescripcion de 3 anos, interrumpible por la comision de nuevas infracciones (igual que la LDC; la competencia es de 5 anos).",
    "src": "quiz",
    "tema": "Prescripcion lealtad comercial (art. 26 Ley 22.802)",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "5 anos",
      "3 anos",
      "1 ano",
      "6 meses"
    ],
    "correct": 1
  },
  {
    "id": "qu8-054",
    "unit": 8,
    "q": "Las actuaciones judiciales iniciadas por un consumidor en ejercicio de un derecho individual gozan del beneficio de justicia gratuita.",
    "expl": "Verdadero. El art. 53 LDC otorga el beneficio de justicia gratuita; la demandada puede acreditar la solvencia del consumidor por incidente para hacerlo cesar.",
    "src": "quiz",
    "tema": "Justicia gratuita (art. 53 LDC)",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-001",
    "unit": 9,
    "q": "¿Cual es el principio que propone que en los contratos a plazo fijo no se puede despedir al trabajador antes del vencimiento del plazo?",
    "expl": "Principio de continuidad (art. 10 LCT): en duda sobre la subsistencia se favorece la continuidad del vinculo. Romper un plazo fijo antes del termino sin causa genera art. 245 + danos (art. 95 LCT).",
    "src": "quiz",
    "tema": "Principios - continuidad",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Principio de buena fe",
      "Principio de continuidad de la relacion laboral",
      "Principio de primacia de la realidad",
      "Principio de igualdad de trato"
    ],
    "correct": 1
  },
  {
    "id": "qu9-002",
    "unit": 9,
    "q": "¿Cuales son las tres reglas del principio protectorio del derecho laboral?",
    "expl": "Las 3 reglas del protectorio son in dubio pro operario, norma mas favorable y condicion mas beneficiosa (art. 9 LCT). 'A trabajo igual salario igual' es igualdad de trato (art. 81).",
    "src": "quiz",
    "tema": "Principio protectorio - reglas",
    "trap": true,
    "dif": "facil",
    "kind": "single",
    "opts": [
      "In dubio pro operario, de la norma mas favorable, de la condicion laboral mas beneficiosa",
      "A trabajo igual, salario igual",
      "Convenio colectivo, contrato individual, legislacion nacional",
      "Primero el empleador, luego el empleado"
    ],
    "correct": 0
  },
  {
    "id": "qu9-003",
    "unit": 9,
    "q": "¿Pueden el futuro empleador y empleado pactar libremente las condiciones de contratacion laboral, sin limite o condicionante alguno?",
    "expl": "No. El orden publico laboral (arts. 7, 12, 13 LCT + art. 14 bis CN + CCT) fija pisos minimos inderogables: solo se puede mejorar lo legal, nunca empeorarlo.",
    "src": "quiz",
    "tema": "Autonomia de la voluntad",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "No, existen pisos minimos inderogables de orden publico laboral",
      "Si, rige la autonomia de la voluntad",
      "Solo si se trata de profesionales independientes",
      "Solo en caso de trabajos temporales"
    ],
    "correct": 0
  },
  {
    "id": "qu9-004",
    "unit": 9,
    "q": "La vinculacion entre empleador y empleado tiene tres planos de subordinacion. ¿Cuales son?",
    "expl": "La triple subordinacion es economica, tecnica y juridica (art. 21 LCT, Perego p. 203). Los demas son distractores ajenos al derecho laboral.",
    "src": "quiz",
    "tema": "Triple subordinacion",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Politico, administrativo, negociador",
      "Economico, tecnico, juridico",
      "Fisico, emocional, psicologico",
      "Intelectual, creativo, estrategico"
    ],
    "correct": 1
  },
  {
    "id": "qu9-005",
    "unit": 9,
    "q": "El principio de continuidad de la relacion laboral propone que en los contratos a plazo fijo no se puede despedir al trabajador contratado antes del vencimiento del plazo.",
    "expl": "Verdadero. El principio de continuidad (art. 10 LCT) protege la subsistencia del vinculo durante el plazo pactado; el despido anticipado sin causa genera art. 245 + danos (art. 95).",
    "src": "quiz",
    "tema": "Principios - continuidad",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-006",
    "unit": 9,
    "q": "¿Que regula el articulo 14 bis de la Constitucion Nacional?",
    "expl": "El art. 14 bis CN (reforma de 1957, constitucionalismo social) consagra condiciones dignas de labor, jornada limitada, vacaciones pagas, retribucion justa, SMVyM, organizacion sindical, huelga, proteccion contra el despido arbitrario y seguridad social.",
    "src": "quiz",
    "tema": "Constitucion - art. 14 bis",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Las condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagados, retribucion justa y salario minimo vital y movil",
      "Los requisitos para ser Presidente de la Nacion",
      "Las funciones del Poder Judicial",
      "Los derechos politicos de los ciudadanos"
    ],
    "correct": 0
  },
  {
    "id": "qu9-007",
    "unit": 9,
    "q": "La jubilacion del trabajador, la renuncia, el despido directo incausado, el despido indirecto y la muerte del empleador son todas causales validas de extincion del contrato segun la LCT.",
    "expl": "Verdadero. Todas son causales de extincion reguladas por la LCT (arts. 240, 245, 246, 248, 249, 252). La extincion puede darse por voluntad de las partes, hechos objetivos o decision unilateral.",
    "src": "quiz",
    "tema": "Extincion - causales",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-008",
    "unit": 9,
    "q": "El principio de irrenunciabilidad propone que el trabajador no puede renunciar a su empleo si no termino la obra que le fuera encargada dentro del plazo pactado.",
    "expl": "Falso. La irrenunciabilidad (art. 12 LCT) recae sobre los DERECHOS laborales (no se pueden reducir), no sobre el empleo: el trabajador siempre puede renunciar al empleo (art. 240).",
    "src": "quiz",
    "tema": "Principio de irrenunciabilidad",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-009",
    "unit": 9,
    "q": "El principio de primacia de la realidad establece que lo que ha ocurrido en la realidad tiene mayor importancia que las formas o apariencias acordadas por las partes.",
    "expl": "Verdadero. La primacia de la realidad (art. 14 LCT) prioriza los hechos sobre las formas: si hay subordinacion real, se recalifica como laboral aunque el contrato diga 'locacion de servicios'.",
    "src": "quiz",
    "tema": "Principio de primacia de la realidad",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-010",
    "unit": 9,
    "q": "¿Cual es el objetivo principal del principio protectorio del derecho laboral?",
    "expl": "El protectorio (art. 9 LCT, Perego p. 204) tiene como finalidad proteger la dignidad del trabajador como persona humana. Las otras opciones son consecuencias o efectos, no la finalidad rectora.",
    "src": "quiz",
    "tema": "Principio protectorio - finalidad",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Regular los vinculos entre empleador y empleado",
      "Garantizar la estabilidad en el empleo",
      "Proteger la dignidad del trabajador en su condicion de persona humana",
      "Establecer condiciones dignas y equitativas de labor"
    ],
    "correct": 2
  },
  {
    "id": "qu9-011",
    "unit": 9,
    "q": "El poder disciplinario del empleador se ve reflejado en la facultad de:",
    "expl": "El poder disciplinario (arts. 67-69, 218-220 LCT) se ejerce mediante amonestaciones, suspensiones (max 30 dias/ano) y, en casos graves, despido con justa causa. Los castigos fisicos violan la dignidad (art. 14 bis CN).",
    "src": "quiz",
    "tema": "Poder disciplinario",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Aplicar castigos fisicos al trabajador",
      "Aplicar amonestaciones y suspensiones por incumplimiento",
      "Descontar hasta 3 sueldos por elementos rotos en la operatoria",
      "Pedirle la renuncia al trabajador"
    ],
    "correct": 1
  },
  {
    "id": "qu9-012",
    "unit": 9,
    "q": "El poder disciplinario del empleador se refleja en la facultad de aplicar amonestaciones, suspender al trabajador hasta 30 dias al ano y despedir al trabajador fundado en su incumplimiento.",
    "expl": "Verdadero. El poder disciplinario (arts. 67-69 y 220 LCT) habilita amonestaciones, suspensiones por un maximo de 30 dias en el ano y el despido con justa causa por incumplimiento.",
    "src": "quiz",
    "tema": "Poder disciplinario",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-013",
    "unit": 9,
    "q": "El articulo 14 de la CN regula, entre otras cosas, las 'condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagas, retribucion justa, salario minimo vital y movil'.",
    "expl": "Falso. Esa enumeracion corresponde al art. 14 BIS (reforma 1957). El art. 14 (a secas) regula las libertades civiles: trabajar, comerciar, navegar, peticionar, propiedad, asociarse, culto, ensenar y aprender.",
    "src": "quiz",
    "tema": "Constitucion - art. 14 vs 14 bis",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-014",
    "unit": 9,
    "q": "¿Cual de los siguientes NO es un deber del empleador segun la LCT?",
    "expl": "El deber de no concurrencia es del TRABAJADOR (no competir con el empleador), no del empleador. Pago, seguridad y ocupacion si son deberes del empleador (arts. 74-79 LCT).",
    "src": "quiz",
    "tema": "Deberes del empleador",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Pago de la remuneracion",
      "Deber de seguridad y proteccion de la salud psicofisica",
      "Deber de ocupacion adecuada a la categoria",
      "Deber de no concurrencia (no competir con su propia empresa)"
    ],
    "correct": 3
  },
  {
    "id": "qu9-015",
    "unit": 9,
    "q": "Tras la reforma de la Ley Bases 27.742, ¿cual es la duracion general del periodo de prueba en el contrato por tiempo indeterminado?",
    "expl": "La Ley Bases 27.742 (art. 92 bis LCT) extendio el periodo de prueba general a 6 meses (8 para empresas de 6-100 trabajadores y 12 para micro de hasta 5, por CCT). El 'antiguo' 3 meses ya no rige.",
    "src": "quiz",
    "tema": "Periodo de prueba",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "3 meses",
      "8 meses",
      "12 meses",
      "6 meses"
    ],
    "correct": 3
  },
  {
    "id": "qu9-016",
    "unit": 9,
    "q": "¿Cual es el limite de la jornada en trabajo insalubre?",
    "expl": "Jornada insalubre: 6 h diarias y 36 semanales. La diurna normal es 8/48, la nocturna 7/42 (Ley 11.544, arts. 196-200 LCT).",
    "src": "quiz",
    "tema": "Jornada",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "6 horas diarias y 36 semanales",
      "8 horas diarias y 48 semanales",
      "7 horas diarias y 42 semanales",
      "9 horas diarias y 45 semanales"
    ],
    "correct": 0
  },
  {
    "id": "qu9-017",
    "unit": 9,
    "q": "La jornada nocturna (de 21 a 6 hs) tiene un limite de 7 horas diarias o 42 semanales.",
    "expl": "Verdadero. La jornada nocturna se limita a 7 h diarias / 42 semanales (Ley 11.544). La diurna es 8/48 y la insalubre 6/36.",
    "src": "quiz",
    "tema": "Jornada",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-018",
    "unit": 9,
    "q": "Un trabajador con 6 anos de antiguedad, ¿cuantos dias corridos de vacaciones le corresponden?",
    "expl": "La franja '5 a 10 anos' otorga 21 dias y comprende los 6 anos (art. 150 LCT). 14 dias es hasta 5 anos; 28 de 10 a 20; 35 mas de 20.",
    "src": "quiz",
    "tema": "Vacaciones",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "21 dias",
      "14 dias",
      "28 dias",
      "35 dias"
    ],
    "correct": 0
  },
  {
    "id": "qu9-019",
    "unit": 9,
    "q": "La indemnizacion por despido sin causa del art. 245 LCT equivale a:",
    "expl": "Art. 245 LCT: 1 mes de sueldo (mejor remuneracion mensual, normal y habitual) por cada ano de servicio o fraccion MAYOR a 3 meses. La fraccion menor a 3 meses no cuenta como ano.",
    "src": "quiz",
    "tema": "Indemnizacion art. 245",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "Medio mes de sueldo por ano de servicio",
      "2 meses de sueldo por ano de servicio",
      "1 mes de sueldo por cada ano de servicio o fraccion mayor a 3 meses",
      "1 mes de sueldo por cada ano, sin computar fracciones"
    ],
    "correct": 2
  },
  {
    "id": "qu9-020",
    "unit": 9,
    "q": "Segun el fallo 'Vizzoti' (CSJN 2004), el tope del art. 245 LCT es inconstitucional cuando reduce la base de calculo en mas del:",
    "expl": "Vizzoti: el tope (3x promedio CCT) no puede reducir mas del 33% del salario real; la base no puede ser inferior al 67% de la mejor remuneracion. La Ley 27.802 incorporo este piso con rango legal.",
    "src": "quiz",
    "tema": "Caso Vizzoti",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "20%",
      "33%",
      "50%",
      "67%"
    ],
    "correct": 1
  },
  {
    "id": "qu9-021",
    "unit": 9,
    "q": "El fallo Vizzoti establece que la base de calculo del art. 245 nunca puede ser inferior al 67% de la mejor remuneracion mensual normal y habitual del trabajador.",
    "expl": "Verdadero. Vizzoti (CSJN 14/9/2004) fija un piso del 67% (el tope no puede reducir mas del 33%). La Ley 27.802 lo elevo a rango legal.",
    "src": "quiz",
    "tema": "Caso Vizzoti",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-022",
    "unit": 9,
    "q": "En caso de extincion por fuerza mayor o falta/disminucion de trabajo no imputable al empleador (art. 247 LCT), la indemnizacion equivale a:",
    "expl": "Art. 247 LCT: la indemnizacion por fuerza mayor o falta de trabajo no imputable es el 50% de la del art. 245. Se aplica en orden inverso de antiguedad.",
    "src": "quiz",
    "tema": "Extincion - fuerza mayor",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "El 100% del art. 245",
      "El 50% del art. 245",
      "Ninguna indemnizacion",
      "El doble del art. 245"
    ],
    "correct": 1
  },
  {
    "id": "qu9-023",
    "unit": 9,
    "q": "Cuando el empleador intima al trabajador a jubilarse al reunir los requisitos y este se jubila, el empleador debe pagar la indemnizacion del art. 245.",
    "expl": "Falso. La extincion por jubilacion (art. 252 LCT) NO genera indemnizacion por antiguedad: el trabajador pasa al sistema previsional.",
    "src": "quiz",
    "tema": "Extincion - jubilacion",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-024",
    "unit": 9,
    "q": "Ante la muerte del trabajador, sus herederos tienen derecho a percibir:",
    "expl": "Art. 248 LCT: por muerte del trabajador los herederos perciben el 50% de la indemnizacion del art. 245.",
    "src": "quiz",
    "tema": "Extincion - muerte del trabajador",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Nada, el vinculo se extingue sin consecuencias",
      "El 50% de la indemnizacion del art. 245 (art. 248 LCT)",
      "El 100% del art. 245 mas danos",
      "El doble del art. 245"
    ],
    "correct": 1
  },
  {
    "id": "qu9-025",
    "unit": 9,
    "q": "El trabajador siempre debe ser una persona fisica, mientras que el empleador puede ser una persona fisica o juridica.",
    "expl": "Verdadero. El trabajador es necesariamente persona fisica (art. 25 LCT); el empleador puede ser persona fisica o juridica (art. 26 LCT).",
    "src": "quiz",
    "tema": "Sujetos del contrato",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-026",
    "unit": 9,
    "q": "Segun el art. 23 LCT, el hecho de la prestacion de servicios:",
    "expl": "Art. 23 LCT: la prestacion de servicios hace presumir un contrato de trabajo (presuncion iuris tantum, prueba en contrario a cargo del empleador). Conecta con la primacia de la realidad.",
    "src": "quiz",
    "tema": "Presuncion art. 23",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Hace presumir la existencia de un contrato de trabajo, salvo prueba en contrario",
      "No tiene efecto juridico alguno",
      "Obliga al trabajador a registrarse como monotributista",
      "Convierte automaticamente el vinculo en una locacion de servicios"
    ],
    "correct": 0
  },
  {
    "id": "qu9-027",
    "unit": 9,
    "q": "La Ley 27.802 de Modernizacion Laboral fue sancionada y promulgada en 2026 (BO 6/3/2026) y modifica entre otras cosas la base de calculo de la indemnizacion y crea el Fondo de Asistencia Laboral.",
    "expl": "Verdadero. La Ley 27.802 (BO 6/3/2026, Decreto 137/2026, 218 articulos) existe: crea el FAL, regula el trabajo en plataformas y consolida la exclusion del SAC/bonos de la base del art. 245.",
    "src": "quiz",
    "tema": "Ley 27.802 - existencia",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-028",
    "unit": 9,
    "q": "Respecto del Fondo de Asistencia Laboral (FAL) creado por la Ley 27.802, ¿que afirmacion es correcta?",
    "expl": "El FAL es un aporte del EMPLEADOR (1% grandes / 2,5% MiPyMEs) en cuentas individuales; NO reemplaza el art. 245 (la ley es explicita): si el saldo no alcanza, el empleador responde con su patrimonio. Su vigencia fue postergada.",
    "src": "quiz",
    "tema": "Ley 27.802 - FAL",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Reemplaza por completo la indemnizacion del art. 245 LCT",
      "Lo aporta el trabajador con un descuento de su salario",
      "Es opcional y se adhiere solo por convenio colectivo",
      "Lo aporta el empleador (1% grandes empresas, 2,5% MiPyMEs) y NO reemplaza el art. 245"
    ],
    "correct": 3
  },
  {
    "id": "qu9-029",
    "unit": 9,
    "q": "Tras las reformas (DNU 70/2023, Ley Bases y Ley 27.802), el SAC (aguinaldo) y los bonos anuales se excluyen de la base de calculo de la indemnizacion del art. 245.",
    "expl": "Verdadero. La base es ahora la mejor remuneracion mensual, normal y habitual (conceptos percibidos en al menos 6 de los ultimos 12 meses), excluyendo SAC, bonos no mensuales y vacaciones.",
    "src": "quiz",
    "tema": "Base art. 245 post-reforma",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-030",
    "unit": 9,
    "q": "Para un trabajador con 7 anos de antiguedad, ¿que plazo de preaviso debe otorgar el empleador?",
    "expl": "Art. 231 LCT: antiguedad mayor a 5 anos -> 2 meses de preaviso. (15 dias en periodo de prueba; 1 mes de 3 meses a 5 anos.)",
    "src": "quiz",
    "tema": "Preaviso",
    "dif": "media",
    "kind": "single",
    "opts": [
      "2 meses",
      "15 dias",
      "1 mes",
      "3 meses"
    ],
    "correct": 0
  },
  {
    "id": "qu9-031",
    "unit": 9,
    "q": "El despido con justa causa puede comunicarse verbalmente, sin necesidad de expresar por escrito la causa.",
    "expl": "Falso. El art. 243 LCT exige comunicar por escrito y en forma clara la causa; ademas rige la invariabilidad (no puede cambiarse en juicio). Sin forma escrita el despido se reputa sin causa.",
    "src": "quiz",
    "tema": "Despido con justa causa - forma",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-032",
    "unit": 9,
    "q": "El Sueldo Anual Complementario (aguinaldo, art. 121 LCT) se paga:",
    "expl": "Art. 121-123 LCT: el SAC equivale a un sueldo adicional, pagadero en dos cuotas (junio y diciembre), cada una 50% de la mayor remuneracion mensual del semestre. Le corresponde a todos los trabajadores.",
    "src": "quiz",
    "tema": "SAC / aguinaldo",
    "dif": "facil",
    "kind": "single",
    "opts": [
      "En una sola cuota en diciembre",
      "En dos cuotas (junio y diciembre), cada una equivalente al 50% del mejor sueldo del semestre",
      "Solo a los trabajadores fuera de convenio",
      "En 12 cuotas mensuales prorrateadas"
    ],
    "correct": 1
  },
  {
    "id": "qu9-033",
    "unit": 9,
    "q": "El despido sin causa de una trabajadora dentro de los 7,5 meses anteriores o posteriores al parto genera:",
    "expl": "Art. 178 LCT: se presume que el despido obedece a la maternidad y se agrega una indemnizacion especial de 1 ano de remuneraciones, ademas del art. 245.",
    "src": "quiz",
    "tema": "Despido por embarazo",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Solo la indemnizacion del art. 245",
      "La indemnizacion del art. 245 mas una agravada de 1 ano de remuneraciones",
      "Ninguna indemnizacion si hubo preaviso",
      "La reincorporacion obligatoria"
    ],
    "correct": 1
  },
  {
    "id": "qu9-034",
    "unit": 9,
    "q": "Segun el art. 245 bis LCT (incorporado por la Ley Bases 27.742), el despido discriminatorio genera:",
    "expl": "Art. 245 bis LCT: el despido discriminatorio se tarifa con un adicional del 50% sobre el art. 245, que el juez puede elevar hasta el 100%. La carga de la prueba del discrimen recae en el demandante; no se admite reincorporacion.",
    "src": "quiz",
    "tema": "Despido discriminatorio - art. 245 bis",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "La reincorporacion forzosa del trabajador",
      "Solo una multa administrativa",
      "Una indemnizacion adicional del 50% sobre el art. 245, ampliable hasta el 100% segun la gravedad",
      "El triple de la indemnizacion del art. 245"
    ],
    "correct": 2
  },
  {
    "id": "qu9-035",
    "unit": 9,
    "q": "El contrato a plazo fijo debe formalizarse por escrito y no puede superar los 5 anos de duracion.",
    "expl": "Verdadero. Arts. 93-95 LCT: el plazo fijo requiere termino cierto, forma escrita, duracion maxima de 5 anos y justificacion en la naturaleza de la tarea.",
    "src": "quiz",
    "tema": "Modalidades - plazo fijo",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-036",
    "unit": 9,
    "q": "¿Cual de las siguientes es una fuente PROPIA (exclusiva) del Derecho del Trabajo?",
    "expl": "Las fuentes propias del Derecho del Trabajo son los CCT, estatutos profesionales, laudos arbitrales, convenios de la OIT y reglamentos/usos de empresa (art. 1 LCT). La CN, leyes y jurisprudencia son fuentes basicas (comunes a todas las ramas).",
    "src": "quiz",
    "tema": "Fuentes del derecho laboral",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "La Constitucion Nacional",
      "Las leyes y sus reglamentaciones",
      "La jurisprudencia",
      "Los convenios de la OIT y los convenios colectivos"
    ],
    "correct": 3
  },
  {
    "id": "qu9-037",
    "unit": 9,
    "q": "La personeria gremial (Ley 23.551) es:",
    "expl": "La personeria gremial (Ley 23.551) es la calificacion legal que el Ministerio de Trabajo otorga al sindicato mas representativo (mayor numero de afiliados cotizantes), dandole derechos exclusivos como negociar CCT.",
    "src": "quiz",
    "tema": "Derecho colectivo - personeria gremial",
    "dif": "media",
    "kind": "single",
    "opts": [
      "La calificacion legal que el Ministerio de Trabajo concede al sindicato mas representativo de una actividad",
      "Un permiso para realizar huelgas",
      "Un registro de los trabajadores afiliados",
      "El estatuto interno de cada empresa"
    ],
    "correct": 0
  },
  {
    "id": "qu9-038",
    "unit": 9,
    "q": "Un convenio colectivo de trabajo debe ser homologado por el Ministerio de Trabajo para tener efecto erga omnes, alcanzando a todos los trabajadores de su ambito (afiliados o no).",
    "expl": "Verdadero. El CCT (Ley 14.250) requiere homologacion del Ministerio para adquirir fuerza obligatoria general (erga omnes) sobre todos los trabajadores comprendidos en su ambito.",
    "src": "quiz",
    "tema": "Convenios colectivos",
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-039",
    "unit": 9,
    "q": "Antes de que un sindicato ejerza medidas de accion directa como la huelga, el Ministerio de Trabajo puede:",
    "expl": "Ley 14.786: el Ministerio puede imponer la conciliacion obligatoria (hasta 15 dias prorrogables), durante la cual se retrotrae la situacion y las partes no deben innovar. El derecho de huelga esta garantizado por el art. 14 bis CN.",
    "src": "quiz",
    "tema": "Huelga y conciliacion obligatoria",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "Prohibir definitivamente la huelga",
      "Despedir a los huelguistas",
      "Dictar la conciliacion obligatoria (Ley 14.786) durante la cual las partes deben no innovar",
      "Disolver el sindicato"
    ],
    "correct": 2
  },
  {
    "id": "qu9-040",
    "unit": 9,
    "q": "El ius variandi (art. 66 LCT) permite al empleador alterar cualquier condicion del contrato, incluso las esenciales, sin limite alguno.",
    "expl": "Falso. El ius variandi (art. 66 LCT) solo permite alterar aspectos NO esenciales, con justificacion funcional y sin causar perjuicio material o moral. Si se excede, el trabajador puede considerarse despedido (despido indirecto).",
    "src": "quiz",
    "tema": "Ius variandi",
    "trap": true,
    "dif": "media",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-041",
    "unit": 9,
    "q": "El salario minimo vital y movil es inembargable, salvo por deudas de naturaleza alimentaria.",
    "expl": "Verdadero. El SMVyM es inembargable salvo por deudas alimentarias (proteccion de la intangibilidad del salario, arts. 120, 147 LCT).",
    "src": "quiz",
    "tema": "Inembargabilidad del salario",
    "dif": "facil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-042",
    "unit": 9,
    "q": "¿Cual es la diferencia entre contrato de trabajo (art. 21) y relacion de trabajo (art. 22)?",
    "expl": "El contrato (art. 21) es el acuerdo de voluntades (puede existir sin prestacion); la relacion (art. 22) es la ejecucion efectiva de la prestacion bajo dependencia. La LCT protege ambas (art. 24).",
    "src": "quiz",
    "tema": "Contrato vs relacion de trabajo",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Son sinonimos exactos",
      "El contrato solo aplica a empleados publicos",
      "La relacion no esta protegida por la LCT",
      "El contrato es el acuerdo; la relacion es la prestacion efectiva de servicios"
    ],
    "correct": 3
  },
  {
    "id": "qu9-043",
    "unit": 9,
    "q": "¿Cuantos dias corridos de licencia por matrimonio otorga el art. 158 LCT?",
    "expl": "Art. 158 LCT: la licencia por matrimonio es de 10 dias corridos. (Nacimiento de hijo: 2; fallecimiento de familiar directo: 3; examen: 2 por examen, max 10/ano.)",
    "src": "quiz",
    "tema": "Licencias especiales",
    "dif": "media",
    "kind": "single",
    "opts": [
      "3 dias",
      "10 dias",
      "5 dias",
      "15 dias"
    ],
    "correct": 1
  },
  {
    "id": "qu9-044",
    "unit": 9,
    "q": "En el despido indirecto, si el trabajador no logra probar la injuria del empleador, igualmente cobra la indemnizacion plena del art. 245.",
    "expl": "Falso. En el despido indirecto (art. 246 LCT) el trabajador cobra la indemnizacion plena SOLO si prueba la injuria del empleador; si no la prueba, se considera una renuncia y no cobra indemnizacion.",
    "src": "quiz",
    "tema": "Despido indirecto",
    "trap": true,
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 1
  },
  {
    "id": "qu9-045",
    "unit": 9,
    "q": "El Derecho del Trabajo se divide en cuatro ramas. ¿Cuales son?",
    "expl": "Las 4 ramas son: derecho individual, colectivo, internacional y administrativo/procesal del trabajo (slides de catedra).",
    "src": "quiz",
    "tema": "Cuatro ramas del Derecho del Trabajo",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Civil, comercial, penal y administrativo",
      "Publico, privado, mixto y supranacional",
      "Individual, colectivo, internacional y administrativo/procesal",
      "Contractual, extracontractual, real y personal"
    ],
    "correct": 2
  },
  {
    "id": "qu9-046",
    "unit": 9,
    "q": "Un trabajador con mas de 5 anos de antiguedad y sin cargas de familia, ante una enfermedad inculpable, ¿durante cuanto tiempo conserva el derecho al cobro del salario?",
    "expl": "Art. 208 LCT: hasta 6 meses con antiguedad de 5 anos o mas (3 meses si es menor a 5 anos). Los plazos se duplican si tiene cargas de familia. Luego hay reserva de puesto de hasta 1 ano sin goce (art. 211).",
    "src": "quiz",
    "tema": "Enfermedad inculpable",
    "trap": true,
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "6 meses",
      "3 meses",
      "1 ano",
      "Indefinidamente"
    ],
    "correct": 0
  },
  {
    "id": "qu9-047",
    "unit": 9,
    "q": "En el regimen general de la LCT rige la estabilidad relativa impropia. Esto significa que:",
    "expl": "Estabilidad relativa impropia: el art. 14 bis CN protege contra el despido arbitrario, pero el empleador puede despedir pagando indemnizacion (art. 245); no hay reincorporacion forzada salvo casos especiales (empleo publico, dirigentes sindicales).",
    "src": "quiz",
    "tema": "Estabilidad",
    "dif": "dificil",
    "kind": "single",
    "opts": [
      "El empleador no puede despedir bajo ninguna circunstancia",
      "El empleador puede despedir sin causa pero debe pagar una indemnizacion",
      "El despido obliga siempre a la reincorporacion del trabajador",
      "No existe proteccion contra el despido"
    ],
    "correct": 1
  },
  {
    "id": "qu9-048",
    "unit": 9,
    "q": "En el contrato de trabajo de temporada, la antiguedad del trabajador se computa sumando los periodos efectivamente trabajados en los sucesivos ciclos.",
    "expl": "Verdadero (caso Bonanata). En la temporada el vinculo es continuo aunque la prestacion sea ciclica; la antiguedad acumula los periodos de cada temporada (arts. 96-98 LCT).",
    "src": "quiz",
    "tema": "Contrato de temporada - Bonanata",
    "dif": "dificil",
    "kind": "vf",
    "opts": [
      "Verdadero",
      "Falso"
    ],
    "correct": 0
  },
  {
    "id": "qu9-049",
    "unit": 9,
    "q": "¿Cual de los siguientes es un deber del TRABAJADOR (no del empleador)?",
    "expl": "El deber de fidelidad y no concurrencia (arts. 85, 88 LCT) es del trabajador. Pago de remuneracion, ocupacion y llevar libros son deberes del empleador.",
    "src": "quiz",
    "tema": "Deberes del trabajador",
    "trap": true,
    "dif": "media",
    "kind": "single",
    "opts": [
      "Pago de la remuneracion",
      "Deber de fidelidad y no concurrencia",
      "Deber de ocupacion",
      "Deber de llevar libros laborales"
    ],
    "correct": 1
  },
  {
    "id": "qu9-050",
    "unit": 9,
    "q": "El contrato de trabajo a tiempo parcial (art. 92 ter LCT) implica una jornada:",
    "expl": "Art. 92 ter LCT: el contrato a tiempo parcial supone una jornada inferior a las 2/3 partes de la jornada habitual de la actividad.",
    "src": "quiz",
    "tema": "Tiempo parcial",
    "dif": "media",
    "kind": "single",
    "opts": [
      "Igual a la habitual",
      "Superior a la habitual con horas extra",
      "Inferior a las dos terceras partes (2/3) de la jornada habitual",
      "De exactamente 4 horas diarias"
    ],
    "correct": 2
  }
];

export const TEORIA_2DO: ConceptBlock[] = [
  {
    "unit": 6,
    "title": "Concepto y unipersonalidad",
    "html": "<ul><li><span class='art'>Art. 1 LGS</span>: hay sociedad cuando dos o mas personas se organizan conforme a un tipo previsto, hacen aportes para producir o intercambiar bienes/servicios y participan en los beneficios y las perdidas.</li><li>Unipersonalidad admitida solo como <strong>SA (SAU)</strong> o <strong>SAS</strong>.</li><li>Elementos: aportes, organizacion tipificada, fin comun, affectio societatis.</li></ul>"
  },
  {
    "unit": 6,
    "title": "Capital: suscripcion vs integracion",
    "html": "<ul><li>Aportes <strong>en dinero</strong>: integrar minimo <strong>25%</strong> al suscribir, saldo en hasta <strong>2 anos</strong>.</li><li>Aportes <strong>en especie</strong>: <strong>100%</strong> al constituir.</li><li>Capital minimo: SRL <strong>no exige</strong>; SA por decreto; SAS <strong>2 SMVyM</strong>.</li><li>Reserva legal (<span class='art'>art. 70</span>): 5% anual hasta el 20% del capital.</li></ul>"
  },
  {
    "unit": 6,
    "title": "Tipos y responsabilidad de socios",
    "html": "<table><tr><th>Tipo</th><th>Responsabilidad</th></tr><tr><td>Colectiva</td><td>subsidiaria, ilimitada y solidaria</td></tr><tr><td>Comandita</td><td>comanditados ilimitada; comanditarios al aporte</td></tr><tr><td>SRL</td><td>limitada al capital (2 a 50 socios)</td></tr><tr><td>SA</td><td>limitada a las acciones suscriptas</td></tr><tr><td>SAS</td><td>limitada (Ley 27.349)</td></tr></table>"
  },
  {
    "unit": 6,
    "title": "Organos sociales (SA)",
    "html": "<ul><li><strong>Asamblea</strong> = gobierno. Ordinaria (<span class='art'>234</span>: balance, ganancias, organos); Extraordinaria (<span class='art'>235</span>: reforma de estatuto).</li><li><strong>Directorio</strong> = administracion y representacion. En <span class='art'>art. 299</span>, minimo 3.</li><li><strong>Sindicatura</strong> = fiscalizacion. En SRL es opcional (<span class='art'>158</span>); en SAS no hay.</li><li>Quorum asamblea extraordinaria: 60% (1a conv.) / 30% (2a).</li></ul>"
  },
  {
    "unit": 6,
    "title": "Art. 299 y SAU",
    "html": "<ul><li><span class='art'>Art. 299 LGS</span>: sociedades bajo fiscalizacion estatal permanente (oferta publica, gran capital, servicios publicos, <strong>SAU</strong>).</li><li>Consecuencias: directorio plural (>=3) y sindicatura colegiada.</li><li>La <strong>SAS no</strong> puede estar comprendida en el art. 299.</li></ul>"
  },
  {
    "unit": 6,
    "title": "Herramientas clave",
    "html": "<ul><li><span class='art'>Art. 54</span> inoponibilidad de la personalidad juridica (corrimiento del velo) ante fraude.</li><li><span class='art'>Art. 59</span> administradores: estandar del buen hombre de negocios; responden por dolo/culpa grave.</li><li><span class='art'>Art. 13</span> clausulas leoninas (nulas): excluir de ganancias, asegurar capital, etc.</li></ul>"
  },
  {
    "unit": 6,
    "title": "Reorganizacion y disolucion",
    "html": "<ul><li><span class='art'>Transformacion (74)</span>: cambia el tipo, conserva la personalidad.</li><li><span class='art'>Fusion (82)</span>: se disuelven sin liquidarse para crear una nueva o una incorpora a otra.</li><li><span class='art'>Escision (88)</span>: destina parte del patrimonio a otra(s).</li><li><span class='art'>Disolucion (94)</span>: vencimiento del plazo, cumplimiento/imposibilidad del objeto, decision de socios, perdida del capital, quiebra.</li><li><span class='art'>94 bis</span>: la reduccion a un socio NO disuelve automaticamente.</li></ul>"
  },
  {
    "unit": 6,
    "title": "Seccion IV (arts. 21-26)",
    "html": "<ul><li>Sociedades no constituidas regularmente o atipicas: <strong>tienen</strong> personalidad juridica.</li><li>El contrato es oponible entre socios y a terceros que lo conocian (<span class='art'>22</span>).</li><li>Responsabilidad: por regla <strong>mancomunada</strong> simple (reforma 2015).</li><li>Subsanacion por mayoria (<span class='art'>25</span>); derecho de receso del disconforme.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Concepto y elementos",
    "html": "<ul><li><span class='art'>Art. 957</span>: contrato = acto juridico por el que dos o mas <strong>partes</strong> manifiestan su consentimiento para crear, regular, modificar, transferir o extinguir relaciones juridicas patrimoniales.</li><li>Elementos esenciales <strong>CCOCF</strong>: Consentimiento, Capacidad, Objeto, Causa, Forma.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Acto voluntario y vicios",
    "html": "<ul><li><span class='art'>Art. 260</span>: acto voluntario = discernimiento + intencion + libertad.</li><li><span class='art'>261</span>: involuntario por falta de discernimiento (ej. privacion accidental de la razon por alcohol).</li><li>Vicios del consentimiento: error (265), <strong>dolo</strong> (271), violencia (276), <strong>lesion</strong> (332).</li></ul>"
  },
  {
    "unit": 7,
    "title": "Forma de los contratos",
    "html": "<ul><li><span class='art'>Art. 1015</span>: <strong>libertad de formas</strong>; solo son formales los que la ley exige.</li><li><span class='art'>1017</span>: requieren <strong>escritura publica</strong> los inmuebles y derechos reales.</li><li><span class='art'>1018</span>: el instrumento privado sobre inmueble vale como <strong>obligacion de escriturar</strong>.</li><li>Servilleta firmada = instrumento particular (287): es forma escrita.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Objeto y consentimiento",
    "html": "<ul><li><span class='art'>1003</span> objeto: licito, posible, determinado o determinable, susceptible de valoracion economica, interes de las partes.</li><li><span class='art'>972</span> oferta: a persona determinada/determinable, con intencion de obligarse.</li><li><span class='art'>980</span> el contrato se perfecciona con la <strong>recepcion</strong> de la aceptacion.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Extincion del contrato",
    "html": "<ul><li>Rescision bilateral, revocacion, resolucion.</li><li><span class='art'>1086</span> pacto comisorio expreso: resuelve por sola comunicacion. <span class='art'>1087-1088</span> implicito: requiere intimacion (15 dias).</li><li><span class='art'>1090</span> frustracion del fin; <span class='art'>1091</span> imprevision (excesiva onerosidad).</li><li><span class='art'>1059-1060</span> sena: por regla <strong>confirmatoria</strong>.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Compraventa, permuta, locacion",
    "html": "<ul><li><span class='art'>1123</span> compraventa: transferir <strong>propiedad</strong> por precio en dinero.</li><li><span class='art'>1126</span> cosa + dinero: si la cosa vale mas, es <strong>permuta</strong>.</li><li>Locacion: <span class='art'>1198</span> plazo minimo vivienda <strong>2 anos</strong> (post DNU 70/2023); <span class='art'>1221</span> resolucion anticipada tras 6 meses.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Contratos de empresa",
    "html": "<ul><li><span class='art'>1227/1240</span> leasing: opcion de compra al pagar 3/4 del canon.</li><li><span class='art'>1251</span> obra (resultado) vs servicios (medios); ruina decenal <span class='art'>1273</span>.</li><li><span class='art'>1319/1322</span> mandato: actos juridicos por cuenta de otro; se presume <strong>oneroso</strong>.</li><li><span class='art'>1479</span> agencia (promueve, comision) vs <span class='art'>1502</span> concesion (compra y revende, asume riesgo).</li><li><span class='art'>1512</span> franquicia: marca + know-how + asistencia.</li></ul>"
  },
  {
    "unit": 7,
    "title": "Donacion y cesion",
    "html": "<ul><li><span class='art'>1542</span> donacion; <span class='art'>1552</span> inmuebles: <strong>escritura publica</strong> bajo pena de nulidad.</li><li><span class='art'>1614</span> cesion de derechos; efectos al deudor desde la notificacion (<span class='art'>1620</span>).</li><li><span class='art'>1628-1629</span>: el cedente garantiza existencia, no la solvencia del deudor.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Sujetos de la relacion de consumo",
    "html": "<ul><li><span class='art'>Art. 1 LDC</span> consumidor: destinatario final (incluye el <strong>expuesto/bystander</strong>).</li><li><span class='art'>Art. 2</span> proveedor: excluye a los <strong>profesionales liberales</strong> con titulo y matricula (salvo su publicidad).</li><li><span class='art'>Art. 3</span> relacion de consumo + <strong>in dubio pro consumidor</strong>; <span class='art'>65</span> orden publico.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Informacion, publicidad y trato",
    "html": "<ul><li><span class='art'>Art. 4</span> informacion: cierta, clara, detallada, eficaz y <strong>gratuita</strong>.</li><li><span class='art'>Art. 8</span> la publicidad <strong>obliga</strong> (vinculante) e integra el contrato.</li><li><span class='art'>Art. 8 bis</span> trato digno: prohibe practicas vergonzantes, vejatorias o intimidatorias.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Garantias",
    "html": "<ul><li><span class='art'>Art. 11</span>: garantia legal <strong>6 meses</strong> (nuevo) / <strong>3 meses</strong> (usado).</li><li><span class='art'>16</span> se prolonga por el tiempo en service.</li><li><span class='art'>17</span> reparacion no satisfactoria: sustitucion, devolucion o quita.</li><li><span class='art'>13</span> flete y seguro a cargo del responsable de la garantia.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Clausulas, credito y revocacion",
    "html": "<ul><li><span class='art'>37-39</span> clausulas abusivas: se tienen por no escritas.</li><li><span class='art'>36</span> venta a credito: tasa e info bajo pena de nulidad.</li><li><span class='art'>34</span> derecho de revocacion: <strong>10 dias</strong> corridos, irrenunciable, en compras a distancia.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Responsabilidad y sanciones",
    "html": "<ul><li><span class='art'>Art. 40</span>: responsabilidad <strong>solidaria de toda la cadena</strong> por el riesgo/vicio de la cosa; se libera por causa ajena.</li><li><span class='art'>52 bis</span> dano punitivo: multa civil al consumidor, tope 2.100 CBT.</li><li><span class='art'>40 bis</span> dano directo (administrativo), tope 5 CBT.</li><li><span class='art'>47</span> sanciones; <span class='art'>50</span> prescripcion 3 anos; <span class='art'>53</span> gratuidad.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Competencia y lealtad comercial",
    "html": "<ul><li>Defensa de la competencia (Ley 25.156/27.442): <span class='art'>art. 4</span> posicion dominante (no es ilegal, lo es el <strong>abuso</strong>); practicas (carteles, predatory pricing); concentracion (autoriza en 45 dias, sino tacita).</li><li>Lealtad comercial (22.802/DNU 274/2019): <span class='art'>art. 9</span> publicidad enganosa; <span class='art'>7</span> denominacion de origen.</li></ul>"
  },
  {
    "unit": 8,
    "title": "Caso Pacheco c/ Cetrogar",
    "html": "<ul><li>TV publicitado online a un precio, mayor en el checkout.</li><li>Se aplico: publicidad vinculante (8 LDC), oferta electronica (1108 CCyC), publicidad enganosa (9 DNU 274/2019), carga probatoria agravada (40 in fine), <strong>dano punitivo</strong> (52 bis).</li></ul>"
  },
  {
    "unit": 9,
    "title": "Base constitucional",
    "html": "<ul><li><span class='art'>Art. 14 CN</span>: libertades civiles (trabajar, comerciar, ensenar...).</li><li><span class='art'>Art. 14 bis</span> (1957): condiciones dignas, jornada limitada, vacaciones pagas, <strong>SMVyM</strong>, proteccion contra despido arbitrario, sindicatos, huelga, seguridad social. <strong>Trampa</strong> tipica del parcial.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Contrato y dependencia",
    "html": "<ul><li><span class='art'>Art. 21 LCT</span>: persona fisica que presta servicios bajo dependencia mediante remuneracion.</li><li>Triple subordinacion: <strong>tecnica, economica, juridica</strong>.</li><li><span class='art'>23</span>: la prestacion de servicios hace <strong>presumir</strong> el contrato de trabajo.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Los 8 principios",
    "html": "<ul><li>Protectorio (3 reglas: in dubio pro operario, norma mas favorable, condicion mas beneficiosa).</li><li>Irrenunciabilidad (<span class='art'>12</span>), Continuidad (<span class='art'>10</span>), Primacia de la realidad, Buena fe (<span class='art'>63</span>), No discriminacion (<span class='art'>17/81</span>), Gratuidad (<span class='art'>20</span>), Razonabilidad.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Jornada y remuneracion",
    "html": "<table><tr><th>Jornada</th><th>Diaria/Semanal</th></tr><tr><td>Diurna</td><td>8 / 48</td></tr><tr><td>Nocturna</td><td>7 / 42</td></tr><tr><td>Insalubre</td><td>6 / 36</td></tr></table><ul><li>SMVyM inembargable salvo alimentos; SAC = 50% mejor sueldo del semestre; retenciones max 20% (total 50%).</li></ul>"
  },
  {
    "unit": 9,
    "title": "Licencias",
    "html": "<ul><li>Vacaciones: 14 / 21 / 28 / 35 dias segun antiguedad.</li><li>Maternidad: 45+45; presuncion de despido <strong>7,5 meses</strong> antes/despues del parto = 1 ano de salarios.</li><li>Enfermedad inculpable: 3/6 meses (12 con cargas de familia).</li></ul>"
  },
  {
    "unit": 9,
    "title": "Extincion e indemnizacion",
    "html": "<ul><li><span class='art'>245</span> despido sin causa: 1 mes por ano (mejor remuneracion). <strong>Vizzoti</strong>: tope no reduce mas del 33%.</li><li><span class='art'>245 bis</span> discriminatorio (Ley Bases): +50% a 100%.</li><li><span class='art'>247</span> fuerza mayor/muerte/quiebra: 50%.</li><li>Preaviso: 15 dias / 1 mes / 2 meses (segun antiguedad).</li><li>Jubilacion (<span class='art'>252</span>): sin indemnizacion.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Deberes y poder del empleador",
    "html": "<ul><li>Empleador: organizacion (64), direccion (65), <strong>ius variandi (66)</strong>, disciplinario (67: amonestacion, suspension max 30 dias, despido).</li><li>Trabajador: diligencia (84), fidelidad (85), obediencia (86), custodia (87), no concurrencia (88). Responde solo por dolo o culpa grave.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Reformas recientes (clave del P5)",
    "html": "<ul><li><strong>DNU 70/2023</strong>: base del 245 sin SAC/bonos; deroga multas.</li><li><strong>Ley Bases 27.742</strong>: periodo de prueba <strong>6 meses</strong> (ampliable 8/12 por CCT); art. 245 bis.</li><li><strong>Ley 27.802 (FAL)</strong>: fondo de cese obligatorio, aporte 1-2,5% de la nomina, administrado por la CNV.</li></ul>"
  },
  {
    "unit": 9,
    "title": "Derecho colectivo",
    "html": "<ul><li>Sindicatos (Ley 23.551): personeria gremial a la asociacion mas representativa; delegados protegidos (desafuero).</li><li>CCT (Ley 14.250): homologacion, efecto <strong>erga omnes</strong>, ultraactividad.</li><li>Huelga (14 bis CN): derecho de los gremios; conciliacion obligatoria previa (Ley 14.786).</li></ul>"
  }
];

export const REPETIDAS: RepUnit[] = [
  {
    "unit": 8,
    "name": "Derechos del consumidor",
    "items": [
      {
        "q": "La ley permite cláusulas abusivas si el consumidor las consiente.",
        "a": "<span class=\"res\">Falso.</span> Los derechos del consumidor son de orden público (art. 65) e irrenunciables; las abusivas se tienen por no convenidas (art. 37) aunque medie conformidad.",
        "freq": "5×",
        "trap": true
      },
      {
        "q": "¿A quiénes define como usuarios?",
        "a": "Persona <span class=\"res\">física o jurídica</span>, como <span class=\"res\">destinatario final</span>, en beneficio propio o de su grupo familiar o social (art. 1).<span class=\"note\">Distractores: omiten «destinatario final» o restringen a sólo física / sólo jurídica.</span>",
        "freq": "4×",
        "trap": true
      },
      {
        "q": "Defina consumidor.",
        "a": "Persona física o jurídica que adquiere o usa bienes o servicios, a título oneroso o gratuito, como destinatario final.<span class=\"note\">No agregar «expuesto en la relación de consumo»: derogado en 2015.</span>",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Las presunciones de la ley operan a favor del…",
        "a": "<span class=\"res\">consumidor</span>, por ser la parte débil.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "El contador olvida la declaración jurada y la AFIP multa: ¿se reclama por la Ley 24.240?",
        "a": "<span class=\"res\">No.</span> El profesional liberal con título y matrícula está excluido (art. 2); sólo alcanza su publicidad.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "¿Quién costea el traslado a fábrica o taller habilitado?",
        "a": "El <span class=\"res\">responsable de la garantía</span> (art. 11).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Se tendrán por no convenidas las cláusulas que… (art. 37)",
        "a": "Desnaturalicen o limiten la responsabilidad por daños; importen renuncia de derechos del consumidor o amplíen los de la otra parte; inviertan la carga de la prueba.<span class=\"note\">«Cláusulas confusas» es distractor.</span>",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "¿Quién responde por el daño derivado del vicio o riesgo? (art. 40)",
        "a": "Solidariamente: productor, fabricante, importador, distribuidor, proveedor, vendedor y quien colocó su marca.<span class=\"note\">«El empleado del comercio» es distractor.</span>",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "La ley protege solamente a los nacionales.",
        "a": "<span class=\"res\">Falso</span>: no distingue nacionales de extranjeros.",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "Los profesionales liberales con título y matrícula están protegidos por la ley.",
        "a": "<span class=\"res\">Falso</span>: excluidos (art. 2); sólo su publicidad.",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "La responsabilidad es solidaria entre consumidor y proveedor.",
        "a": "<span class=\"res\">Falso</span>: la solidaridad recae sobre la cadena de proveedores (art. 40).",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "Tengo un comercio y los insumos vienen fallados: ¿reclamo por la ley?",
        "a": "<span class=\"res\">No</span>: no soy destinatario final (compro para producir o revender).",
        "freq": "",
        "trap": false
      }
    ]
  },
  {
    "unit": 7,
    "name": "Contratos",
    "items": [
      {
        "q": "¿Hasta cuándo puede retractarse la aceptación?",
        "a": "Antes de que <span class=\"res\">llegue al destinatario</span> (teoría de la recepción, arts. 975 y 981).",
        "freq": "4×",
        "trap": false
      },
      {
        "q": "Clasifique los contratos conmutativos y aleatorios.",
        "a": "<span class=\"res\">Conmutativo</span>: prestaciones ciertas y equivalentes desde el inicio. <span class=\"res\">Aleatorio</span>: la prestación depende de un hecho futuro e incierto (sin tutela por desequilibrio).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Complete: dos o más partes ___ para crear relaciones patrimoniales.",
        "a": "<span class=\"res\">manifiestan su consentimiento</span> (art. 957).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "El contrato es un «acto jurídico»: ¿qué significa?",
        "a": "Es un acto voluntario lícito cuyo fin inmediato es producir efectos jurídicos patrimoniales entre las partes.",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "¿Cuál es el modo natural de extinción de los contratos?",
        "a": "El <span class=\"res\">cumplimiento</span> (pago) de las obligaciones.",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "Onerosos y gratuitos: diferencia y consecuencia.",
        "a": "Oneroso: obligaciones económicas para ambas partes; gratuito: sólo una. Los onerosos gozan de mayor protección (las cláusulas dudosas se interpretan para reequilibrar).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "Unilateral y bilateral.",
        "a": "Unilateral: se obliga una parte; bilateral: ambas (doble ejemplar, excepción de incumplimiento, pacto comisorio).<span class=\"note\">El seguro es bilateral pero aleatorio.</span>",
        "freq": "",
        "trap": true
      },
      {
        "q": "¿Cómo se expresa el consentimiento?",
        "a": "<span class=\"res\">Expreso</span> (verbal, escrito o signos inequívocos) o <span class=\"res\">tácito</span> (hechos que lo presuponen).",
        "freq": "4×",
        "trap": false
      },
      {
        "q": "¿Qué transfiere la cesión de derechos?",
        "a": "Un <span class=\"res\">derecho</span>; rigen las reglas de compraventa, permuta o donación según la contraprestación. Oponible al deudor desde la notificación (art. 1620).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "¿Qué se transmite en la locación de cosa?",
        "a": "El locador entrega el uso y goce temporario de una cosa; el locatario paga un precio en dinero.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Ejemplos de contratos prohibidos.",
        "a": "Entre cónyuges; abogados o jueces sobre bienes litigiosos en que intervienen; mandatario sobre el bien del mandato; objeto imposible; objeto ilícito.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "El objeto del contrato.",
        "a": "La prestación (dar, hacer o no hacer): determinada, posible, lícita y conforme a la moral (arts. 1003-1004).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Invente un contrato y analice sus elementos esenciales.",
        "a": "Aplicar a un caso: capacidad, consentimiento, objeto, causa y forma. La mera enunciación no suma.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Dos ejemplos de rescisión y dos de resolución.",
        "a": "<span class=\"res\">Rescisión</span>: acuerdo de partes, hacia el futuro. <span class=\"res\">Resolución</span>: incumplimiento o hecho sobreviniente, con efecto retroactivo.<span class=\"note\">Ninguna es revocación.</span>",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "Un principio para interpretar los contratos.",
        "a": "Buena fe, usos y costumbres (el contrato como unidad); condiciones al contratar; conducta de las partes; finalidad.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Oferta, contraoferta y aceptación con cinco intercambios.",
        "a": "Narrar cinco idas y vueltas y el acuerdo final (p. ej. kiosco y proveedor: contrato formal, exclusividad y heladera en comodato).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "¿Para qué se utiliza el mandato?",
        "a": "Encargar la ejecución de actos jurídicos por cuenta de otro, con o sin representación; se presume oneroso (art. 1319).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "Vicio de lesión: ¿qué dos condiciones exige?",
        "a": "Aprovechamiento de la necesidad, ligereza o inexperiencia, y desproporción patrimonial notable. Habilita la nulidad o el reajuste (art. 332).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "¿Un menor de 18 años puede adquirir una propiedad?",
        "a": "<span class=\"res\">No por sí mismo</span>: por medio de sus representantes o si está emancipado. Con título habilitante administra lo que gana.",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "¿Qué es el contrato por adhesión?",
        "a": "Una parte no negocia las cláusulas predispuestas: sólo se adhiere. Las dudosas se interpretan contra el predisponente; las abusivas, por no escritas (arts. 987-988).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "¿Filial o sucursal?",
        "a": "<span class=\"res\">Sucursal</span>: sin personalidad propia, responde la casa matriz. <span class=\"res\">Filial</span>: persona jurídica independiente, responde con su propio patrimonio.",
        "freq": "",
        "trap": false
      }
    ]
  },
  {
    "unit": 9,
    "name": "Derecho laboral",
    "items": [
      {
        "q": "Planos de subordinación del vínculo laboral.",
        "a": "<span class=\"res\">Económico, técnico y jurídico</span> (art. 23).<span class=\"note\">Distractores: moral, dolo, culpa, sancionatorio, organizacional, regulatorio.</span>",
        "freq": "5×",
        "trap": true
      },
      {
        "q": "Deberes del empleador.",
        "a": "Pago, seguridad, ocupación, diligencia, obligaciones sindicales y de la seguridad social con entrega del certificado, no discriminar, llevar libros, formación profesional.<span class=\"note\">No concurrencia, custodia y colaboración corresponden al trabajador; sancionar es poder disciplinario.</span>",
        "freq": "4×",
        "trap": true
      },
      {
        "q": "Principio protectorio: sus tres reglas.",
        "a": "<span class=\"res\">In dubio pro operario; norma más favorable; condición más beneficiosa</span> (art. 9).",
        "freq": "3×",
        "trap": false
      },
      {
        "q": "Empleador y empleado pactan libremente, sin límite alguno.",
        "a": "<span class=\"res\">Falso</span>: rigen pisos mínimos irrenunciables (LCT, convenios, art. 14 bis).",
        "freq": "4×",
        "trap": false
      },
      {
        "q": "Causas de extinción de la relación laboral.",
        "a": "Renuncia, despido (directo o indirecto, con o sin causa), mutuo acuerdo, jubilación, muerte del trabajador, muerte o quiebra del empleador, incapacidad total, abandono, fuerza mayor.<span class=\"note\">No la muerte del accionista mayoritario ni el «factor de atribución».</span>",
        "freq": "3×",
        "trap": true
      },
      {
        "q": "La irrenunciabilidad impide renunciar al empleo.",
        "a": "<span class=\"res\">Falso</span>: prohíbe renunciar a los derechos (art. 12); al empleo se puede renunciar (art. 240).",
        "freq": "",
        "trap": true
      },
      {
        "q": "La primacía de la realidad prioriza lo ocurrido sobre las formas.",
        "a": "<span class=\"res\">Verdadero</span> (art. 14).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "El art. 14 regula jornada limitada, vacaciones pagas y salario mínimo.",
        "a": "<span class=\"res\">Falso</span>: eso es el art. 14 bis; el art. 14 enuncia derechos civiles (trabajar, comerciar, navegar).",
        "freq": "2×",
        "trap": true
      },
      {
        "q": "Por el principio de continuidad, en el plazo fijo no se puede despedir antes del vencimiento.",
        "a": "<span class=\"res\">Falso</span>: se puede, con indemnización y daños. La continuidad favorece la subsistencia del vínculo (art. 10).",
        "freq": "2×",
        "trap": false
      },
      {
        "q": "Avisa por teléfono que no podrá concurrir por enfermedad: ¿qué puede hacer el empleador?",
        "a": "Enviar el servicio médico y pedir certificado; si lo presenta, abonar normalmente.<span class=\"note\">No descontar vacaciones ni sueldo, ni suspender, ni usarlo como antecedente. Con el aviso alcanza.</span>",
        "freq": "",
        "trap": true
      },
      {
        "q": "Poder disciplinario del empleador.",
        "a": "Amonestar, suspender (hasta treinta días por año) y despedir por incumplimiento; proporcional y acumulativo.",
        "freq": "",
        "trap": false
      }
    ]
  },
  {
    "unit": 6,
    "name": "Sociedades",
    "items": [
      {
        "q": "Una S.R.L. carece de capital para sus deudas: ¿responde el patrimonio de los socios?",
        "a": "<span class=\"res\">No</span>: responsabilidad limitada al aporte; la sociedad va a concurso o quiebra.",
        "freq": "",
        "trap": false
      },
      {
        "q": "Una sociedad de hecho sin capital: ¿qué responsabilidad?",
        "a": "Según el libro, <span class=\"res\">solidaria e ilimitada</span> (patrimonio personal).<span class=\"note\">Reforma de 2015: la Sección IV responde de manera mancomunada y por partes iguales (art. 24).</span>",
        "freq": "",
        "trap": true
      },
      {
        "q": "¿Qué elementos incorporar al estatuto?",
        "a": "Denominación, duración, objeto, domicilio, inicio de operaciones, capital, acciones o cuotas, órganos de gobierno y reglas de acuerdos (art. 11).",
        "freq": "",
        "trap": false
      }
    ]
  }
];

export const REPETIDAS_FEATURES: RepFeature[] = [
  {
    "unit": 9,
    "title": "La pregunta variable — «Hoy es 21 de diciembre… ¿qué modalidad de contratación?»",
    "freq": "7 apariciones",
    "html": "<table>\n    <thead><tr><th style=\"width:34%\">Escenario</th><th style=\"width:38%\">Fundamento</th><th>Respuesta</th></tr></thead>\n    <tbody>\n      <tr><td>Se accidenta o enferma; retorno incierto (operación de rodilla)</td><td>Ausencia temporaria de plazo incierto; el contrato eventual la cubre y no exige preaviso</td><td><span class=\"res\">Eventual, jornada completa</span></td></tr>\n      <tr><td>Toma licencia anual; plazo cierto y conocido (viaje de esquí, 36 años de antigüedad)</td><td>Reemplazo por un período determinado y previsible</td><td><span class=\"res\">Plazo fijo, jornada completa</span></td></tr>\n      <tr><td>Renuncia o «año sabático»; sólo tres horas, lunes-miércoles-viernes</td><td>Renuncia = vacante permanente → indeterminado; menos de 2/3 de jornada → parcial</td><td><span class=\"res\">Indeterminado, tiempo parcial</span></td></tr>\n      <tr><td>La secretaria se jubila; tareas habituales de jornada completa</td><td>Jubilación = vacante permanente → indeterminado; jornada completa</td><td><span class=\"res\">Indeterminado, jornada completa</span></td></tr>\n    </tbody>\n  </table>"
  },
  {
    "unit": 8,
    "title": "Garantía legal (Ley 24.240) — el tema de consumidor más evaluado",
    "freq": "en varias formas",
    "html": "<table>\n    <thead><tr><th style=\"width:42%\">Variante del enunciado</th><th>Respuesta</th></tr></thead>\n    <tbody>\n      <tr><td>Plazo de garantía de un producto nuevo / usado</td><td><span class=\"res\">Seis meses / tres meses</span> (art. 11) — mínimo, sólo ampliable, irrenunciable</td></tr>\n      <tr><td>Firmé una garantía menor y el producto falló después: ¿puedo reclamar?</td><td><span class=\"res\">Sí, si es nuevo</span>: la cláusula que reduce la garantía es nula</td></tr>\n      <tr><td>Una librería compra una computadora que falla a los tres meses</td><td><span class=\"res\">Sí si es nueva</span> (6 m); no si es usada (3 m cumplidos). La librería es consumidor final</td></tr>\n      <tr><td>¿Quién costea el traslado a fábrica o taller habilitado?</td><td><span class=\"res\">El responsable de la garantía</span> (flete y seguro)</td></tr>\n    </tbody>\n  </table>"
  },
  {
    "unit": 6,
    "title": "Sociedades — «invente un emprendimiento y compare al menos tres tipos»",
    "freq": "la de desarrollo más repetida, 8 apariciones",
    "html": "<table>\n    <thead><tr><th></th><th>S.A.S. (Ley 27.349)</th><th>S.R.L. (arts. 146-162)</th><th>S.A. (arts. 163 y ss.)</th></tr></thead>\n    <tbody>\n      <tr><td>Socios</td><td>uno o más</td><td>de dos a cincuenta</td><td>dos o más (uno = S.A.U.)</td></tr>\n      <tr><td>Capital en</td><td>acciones</td><td>cuotas ($10)</td><td>acciones</td></tr>\n      <tr><td>Capital mínimo</td><td>2 SMVyM</td><td>no fijado por ley</td><td>lo fija el P.E.N.</td></tr>\n      <tr><td>Responsabilidad</td><td>limitada</td><td>limitada</td><td>limitada</td></tr>\n      <tr><td>Administración</td><td>administrador/es</td><td>gerencia</td><td>directorio (mín. 3 si art. 299)</td></tr>\n      <tr><td>Inscripción</td><td>digital, 24 horas</td><td>contrato ante el Registro</td><td>estatuto ante el Registro</td></tr>\n    </tbody>\n    <caption>Debe aplicarse a un ejemplo concreto (capital, socios, administración, duración, inscripción). La comparación abstracta no suma puntos: es taxativo en la corrección.</caption>\n  </table>"
  }
];

export const BANK_1ER: Flashcard[] = [
  {
    "id": "p1-1-1",
    "unit": 1,
    "kind": "vf",
    "tema": "Verdadero o Falso",
    "enunciado": "<p>El Derecho se ubica dentro de las ciencias <strong>del ser</strong> (como la Ingeniería), no del <strong>deber ser</strong>.</p>",
    "respuesta": "<p>El Derecho es ciencia del \"deber ser\" — estudia cómo debe ser la conducta, no cómo es. A diferencia de la Ingeniería (ciencia del ser), que describe la realidad física, el Derecho prescribe normas de conducta obligatorias.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-2",
    "unit": 1,
    "kind": "completar",
    "tema": "Pirámide Jurídica de Kelsen",
    "enunciado": "<p>La <strong>pirámide jurídica de Kelsen</strong> establece la jerarquía de normas. Ordena de mayor a menor jerarquía:</p><p>__________ > __________ > __________ > __________ > __________ > __________</p>",
    "respuesta": "<p>La estructura correcta incluye a los tratados internacionales en su jerarquía (con y sin jerarquía constitucional), lo que es fundamental. La estructura completa es:</p><ul><li>Constitución Nacional (norma suprema)</li><li>Tratados con jerarquía constitucional</li><li>Tratados sin jerarquía constitucional</li><li>Leyes nacionales</li><li>Decretos del Poder Ejecutivo</li><li>Reglamentos y regulaciones administrativas</li><li>Actos individuales (contratos)</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-3",
    "unit": 1,
    "kind": "desarrollo",
    "tema": "Validez vs Vigencia",
    "enunciado": "<p>Explica brevemente qué diferencia existe entre <strong>validez</strong> y <strong>vigencia</strong> de una norma jurídica. Incluye un ejemplo.</p>",
    "respuesta": "<p>La distinción se aclara con un ejemplo:</p><ul><li><strong>Validez:</strong> La ley fue sancionada correctamente por el Congreso (conforme al procedimiento). Es válida.</li><li><strong>Vigencia:</strong> La ley está en vigor, se aplica actualmente. Es vigente.</li></ul><p>Un ejemplo: Una ley derogada puede ser válida (fue creada correctamente) pero no vigente (ya no se aplica).</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-4",
    "unit": 1,
    "kind": "mc",
    "tema": "Fuentes del Derecho",
    "enunciado": "<p>¿Cuál de las siguientes NO es considerada una <strong>fuente del derecho</strong>?</p>",
    "opts": [
      "La Ley",
      "La Costumbre",
      "La Jurisprudencia",
      "La Opinión de un periodista reconocido",
      "La Doctrina"
    ],
    "respuesta": "<p>Solo hay cuatro fuentes del derecho: Ley, Costumbre, Jurisprudencia y Doctrina. La opinión de un periodista, aunque sea reconocido, no es fuente formal del ordenamiento jurídico.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-5",
    "unit": 1,
    "kind": "vf",
    "tema": "Common Law",
    "enunciado": "<p>El <strong>Common Law</strong> es el sistema jurídico utilizado en Argentina y se basa principalmente en los precedentes judiciales.</p>",
    "respuesta": "<p>Argentina utiliza el sistema de <strong>Derecho Codificado</strong> (continental europeo), basado en códigos escritos (como el Código Civil y Comercial). El Common Law es característico de países angloamericanos (Reino Unido, EE.UU.) y se basa en precedentes judiciales. Ver comparación entre ambos sistemas.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-6",
    "unit": 1,
    "kind": "completar",
    "tema": "Derecho Público y Privado",
    "enunciado": "<p>El Derecho se divide en dos ramas principales: <strong>Derecho Público</strong> (que regula las relaciones con el __________ ) y <strong>Derecho Privado</strong> (que regula las relaciones entre __________).</p>",
    "respuesta": "<p>La división es clara:</p><ul><li><strong>Derecho Público:</strong> regula relaciones con el Estado (Derecho Constitucional, Penal, Administrativo, etc.)</li><li><strong>Derecho Privado:</strong> regula relaciones entre particulares (Derecho Civil, Comercial, etc.)</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-7",
    "unit": 1,
    "kind": "desarrollo",
    "tema": "Deber Ser vs Ser",
    "enunciado": "<p>Eres un estudiante de ingeniería que debe explicar a un compañero por qué el Derecho es una ciencia del \"deber ser\" y no del \"ser\". ¿Cómo lo explicarías?</p>",
    "respuesta": "<p>La explicación completa requiere el contraste claro con la Ingeniería:</p><ul><li><strong>Ciencias del ser</strong> (Ingeniería, Física): Describen la realidad tal como es. Ej: \"El acero tiene una resistencia de X kg/cm²\"</li><li><strong>Ciencias del deber ser</strong> (Derecho): Prescriben cómo debe ser la conducta. Ej: \"No debes conducir si has bebido alcohol\"</li></ul><p>Respuesta modelo:</p><p>*\"La Ingeniería es ciencia del ser porque describe cómo funcionan las cosas en la realidad. El Derecho es ciencia del deber ser porque no describe cómo la gente actúa, sino cómo debe actuar según normas obligatorias. El Derecho prescribe conductas, no las observa.\"*</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-1-8",
    "unit": 1,
    "kind": "mc",
    "tema": "Características de Norma Jurídica",
    "enunciado": "<p>¿Cuáles de los siguientes enunciados son características de una <strong>norma jurídica</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Es obligatoria",
      "Está impuesta por el Estado",
      "Orienta la conducta hacia la justicia",
      "Es voluntaria y sugiere conductas",
      "Prevé sanciones ante su incumplimiento"
    ],
    "respuesta": "<p>Dos opciones suelen pasarse por alto:</p><ul><li><strong>(a) Es obligatoria:</strong> Fundamental. Una norma jurídica NO es voluntaria; su cumplimiento es forzoso.</li><li><strong>(b) Está impuesta por el Estado:</strong> El Estado es el único que puede crear normas jurídicas vinculantes.</li></ul><p>Las cuatro características son:</p><ul><li>Obligatoria (no voluntaria)</li><li>Impuesta por el Estado</li><li>Orienta la conducta hacia la justicia</li><li>Prevé sanciones ante incumplimiento</li></ul><p>La opción (d) es incorrecta porque las normas jurídicas no son voluntarias.</p>",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-1-9",
    "unit": 1,
    "kind": "caso",
    "tema": "Ley vs Costumbre",
    "enunciado": "<p>Un ingeniero diseña una plataforma de software. En el país donde opera, hay costumbre entre las empresas de no pedir consentimiento explícito para recopilar datos de usuarios, pero hace poco se aprobó una <strong>nueva ley</strong> que prohíbe esto.</p>",
    "opts": [
      "¿Cuál [[fuentes-del-derecho|fuente del derecho]] prevalece: la costumbre o la ley? ¿Por qué?",
      "Si el ingeniero continúa recopilando datos sin consentimiento, ¿su norma es válida? ¿Es vigente?"
    ],
    "respuesta": "<p>El análisis correcto integra tres ideas:</p><ul><li>La <strong>jerarquía de fuentes del derecho:</strong> La ley está por encima de la costumbre.</li><li>El <strong>rol subsidiario de la costumbre:</strong> Se aplica solo cuando no hay ley.</li><li><strong>Validez y vigencia:</strong> La acción del ingeniero no tiene respaldo legal.</li></ul><p>Ampliación: El ingeniero está actuando <strong>ilícitamente</strong> — viola la ley vigente. Podría ser sancionado.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-1-10",
    "unit": 1,
    "kind": "desarrollo",
    "tema": "Derecho Natural vs Positivo",
    "enunciado": "<p>Compara el <strong>Derecho Natural</strong> y el <strong>Derecho Positivo</strong>. ¿Cuál crees que es más importante para regular la vida en sociedad? Justifica tu respuesta con un ejemplo.</p>",
    "respuesta": "",
    "correccion": "❌ SIN RESPUESTA"
  },
  {
    "id": "p1-2-1",
    "unit": 2,
    "kind": "vf",
    "tema": "Poder Ejecutivo",
    "enunciado": "<p>El Poder Ejecutivo es: \"Es el jefe supremo de la Nación, jefe de gobierno y responsable político de la administración general del país\".</p>",
    "respuesta": "<p>El enunciado describe específicamente al <strong>Presidente de la República</strong>, no al Poder Ejecutivo en su totalidad. El Poder Ejecutivo es una rama del gobierno que incluye al presidente, gabinete de ministros, secretarías y organismos administrativos.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-2",
    "unit": 2,
    "kind": "completar",
    "tema": "Duración del Mandato Presidencial",
    "enunciado": "<p>¿Cuántos años dura el mandato de un presidente de la República Argentina?</p>",
    "respuesta": "<p>Correcto según el art. 94 de la Constitución Nacional. El mandato es de 4 años, y es renovable <strong>consecutivamente una sola vez</strong> (máximo 2 mandatos consecutivos). Después de dos mandatos consecutivos, debe mediar al menos un mandato sin ocupar la presidencia.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-3",
    "unit": 2,
    "kind": "desarrollo",
    "tema": "Derechos y Garantías Constitucionales",
    "enunciado": "<p>Explica brevemente qué son los <strong>derechos y garantías constitucionales</strong>. ¿Cuál es la diferencia entre un derecho y una garantía?</p>",
    "respuesta": "<p>La distinción puede precisarse del siguiente modo:</p><p><strong>Derechos:</strong> Son facultades o prerrogativas reconocidas a las personas. Ej: Derecho a la vida, libertad de expresión, derecho de propiedad.</p><p><strong>Garantías:</strong> Son los <strong>mecanismos de protección</strong> para que esos derechos se respeten. Ej: El habeas corpus es garantía del derecho a la libertad; el juicio previo es garantía del derecho de defensa.</p><p><strong>La relación:</strong></p><ul><li>Todo derecho debe tener una garantía para protegerlo.</li><li>No hay derecho sin garantía (art. 18 CN: \"Ningún habitante puede ser penado sin juicio previo\").</li></ul><p><strong>Ejemplo aplicado:</strong></p><ul><li>Derecho a vivienda: reconocido en la CN (art. 14 bis, vivienda digna)</li><li>Garantía: El Estado debe proveer políticas de acceso a vivienda</li></ul><p>Síntesis:</p><p>*\"Los derechos son facultades reconocidas a los ciudadanos. Las garantías son mecanismos que aseguran que esos derechos se respeten y protejan. Toda garantía existe para proteger un derecho.\"*</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-2-4",
    "unit": 2,
    "kind": "mc",
    "tema": "Última Reforma Constitucional",
    "enunciado": "<p>¿Cuál es la última reforma constitucional que tuvo Argentina?</p>",
    "opts": [
      "1949",
      "1957",
      "1994",
      "2005",
      "2008"
    ],
    "respuesta": "<p>Correcto. La reforma de 1994 fue la última reforma constitucional argentina. Fue muy importante porque:</p><ul><li>Introdujo el art. 75 inc. 22: <strong>jerarquía constitucional</strong> a tratados de derechos humanos (Pacto de San José, Pacto Internacional de Derechos Civiles y Políticos, etc.)</li><li>Permitió la reelección presidencial consecutiva (limitada a dos términos)</li><li>Amplió derechos de tercera generación (ambiente, consumidor, etc.)</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-5",
    "unit": 2,
    "kind": "vf",
    "tema": "Iglesia como Persona Jurídica",
    "enunciado": "<p>La Iglesia es una persona jurídica de carácter público.</p>",
    "respuesta": "<p>Técnicamente, la <strong>Iglesia Católica Argentina</strong> es la única iglesia que tiene reconocimiento de carácter público en nuestro ordenamiento jurídico. Otras iglesias (evangélicas, protestantes, etc.) son personas jurídicas pero de carácter <strong>privado</strong>. Esta es una sutileza importante del derecho argentino ligada al art. 2 CN que menciona al catolicismo apostólico romano.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-6",
    "unit": 2,
    "kind": "mc",
    "tema": "Composición del Congreso Nacional",
    "enunciado": "<p>El Congreso Nacional está compuesto por:</p>",
    "opts": [
      "Senado y Diputados",
      "Solo Senadores",
      "Solo Diputados",
      "Senado, Diputados y Jueces",
      "Poder Ejecutivo y Legislativo"
    ],
    "respuesta": "<p>Correcto. El Congreso Nacional es <strong>bicameral</strong> (dos cámaras):</p><ul><li><strong>Cámara de Senadores:</strong> 3 senadores por provincia + 3 por CABA = 72 senadores. Mandato de 6 años, renovación cada 2 años (1/3 de los senadores).</li><li><strong>Cámara de Diputados:</strong> Representación proporcional según población. ~257 diputados. Mandato de 4 años, renovación cada 2 años (la mitad).</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-7",
    "unit": 2,
    "kind": "desarrollo",
    "tema": "División de Poderes",
    "enunciado": "<p>Explica brevemente la <strong>división de poderes</strong> según la Constitución Nacional. ¿Cuál es el rol de cada poder?</p>",
    "respuesta": "<p>Los roles de cada poder se distribuyen del siguiente modo:</p><ul><li><strong>Poder Ejecutivo:</strong> Ejecuta las leyes, administra la república, dirige política exterior, es jefe de fuerzas armadas.</li><li><strong>Poder Legislativo:</strong> Sanciona leyes, controla presupuesto, ratifica tratados, tiene poder de veto sobre actos del PE.</li><li><strong>Poder Judicial:</strong> Administra justicia, interpreta leyes, controla constitucionalidad de actos, garantiza derechos.</li></ul><p>Este sistema de <strong>pesos y contrapesos</strong> (checks and balances) evita concentración de poder.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-8",
    "unit": 2,
    "kind": "mc",
    "tema": "Selección Múltiple — Atribuciones del Poder Legislativo",
    "enunciado": "<p>¿Cuáles de las siguientes son <strong>atribuciones del Poder Legislativo</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Sancionar leyes",
      "Dictar sentencias",
      "Crear impuestos",
      "Disolver el Congreso",
      "Ratificar tratados internacionales"
    ],
    "respuesta": "<p>La opción <strong>(c) Crear impuestos</strong> también es correcta. Según el art. 75 de la Constitución, el Congreso tiene la atribución de \"Imponer contribuciones directas y indirectas\". Es una de sus facultades más importantes.</p><p>Análisis de cada opción:</p><ul><li><strong>(a) Sancionar leyes:</strong> ✅ Correcta. Es atribución fundamental.</li><li><strong>(b) Dictar sentencias:</strong> ❌ Incorrecta. Eso es función del Poder Judicial.</li><li><strong>(c) Crear impuestos:</strong> ✅ Correcta. Art. 75 CN.</li><li><strong>(d) Disolver el Congreso:</strong> ❌ Incorrecta. El Congreso no puede disolverse a sí mismo; eso sería autodestrucción.</li><li><strong>(e) Ratificar tratados:</strong> ✅ Correcta. El Senado debe ratificar tratados internacionales.</li></ul>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-2-9",
    "unit": 2,
    "kind": "caso",
    "tema": "División de Poderes en Infraestructura",
    "enunciado": "<p>El gobierno necesita invertir dinero en infraestructura de transporte. Analiza este caso según la Constitución:</p>",
    "opts": [
      "¿Qué poder debe intervenir para aprobar los fondos?",
      "¿Qué poder debe intervenir para ejecutar la obra?",
      "¿Qué poder controlaría si se realizó correctamente?"
    ],
    "respuesta": "<p>Este caso ilustra la <strong>división de poderes en acción</strong>:</p><ul><li><strong>PL (Congreso):</strong> Aprueba el presupuesto nacional con los fondos para infraestructura (art. 75, atribuciones presupuestarias).</li><li><strong>PE:</strong> Ejecuta la obra, licita a contratistas, dirige la ejecución (administración).</li><li><strong>PJ:</strong> Controla legalidad (si hubo corrupción, irregularidades en licitación, violación de derechos de terceros, etc.). Puede anular actos del PE si son inconstitucionales.</li></ul><p>Este es un <strong>ejemplo real</strong> de cómo funcionan los pesos y contrapesos.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-2-10",
    "unit": 2,
    "kind": "desarrollo",
    "tema": "Federalismo vs Sistema Unitario",
    "enunciado": "<p>Compara el sistema federal argentino con una organización unitaria. ¿Por qué Argentina eligió el federalismo? Menciona qué son las <strong>facultades delegadas</strong> y <strong>concurrentes</strong>.</p>",
    "respuesta": "<p>Una respuesta completa sobre el federalismo debe incluir:</p><ul><li>Comparación con el sistema unitario</li><li>Definición de facultades delegadas y concurrentes</li></ul><p><strong>Sistema Federal vs Unitario:</strong></p><p>| Aspecto | Federal | Unitario |</p><p>|---------|---------|----------|</p><p>| <strong>Distribución de poder</strong> | Poder compartido: Nación + Provincias | Poder centralizado en Nación |</p><p>| <strong>Autonomía provincial</strong> | Alta — provincias tienen competencias propias | Baja — provincias subordinadas |</p><p>| <strong>Legislación</strong> | Provincias dictan leyes sobre materias propias | Leyes nacionales unifican todo |</p><p>| <strong>Ejemplo real</strong> | Argentina, EE.UU., Brasil | Uruguay, Francia |</p><p><strong>¿Por qué Argentina eligió federalismo?</strong></p><ul><li>Territorios amplios y dispersos (difícil gobernar centralizadamente)</li><li>Diferentes realidades regionales (necesidad de autonomía)</li><li>Equilibrio de poder entre grandes provincias como Buenos Aires</li></ul><p><strong>Facultades delegadas vs Concurrentes:</strong></p><ul><li><strong>Facultades delegadas (art. 121 CN):</strong> Las que las provincias cedieron a la Nación. Solo la Nación las ejerce. Ej: Relaciones exteriores, defensa, aduanas.</li><li><strong>Facultades concurrentes:</strong> Ambas jurisdicciones (Nación y provincias) las ejercen simultáneamente. Ej: Educación, salud, obras públicas.</li><li><strong>Facultades reservadas:</strong> Las que retienen las provincias para sí. Ej: Policía local, justicia local.</li></ul><p><strong>Síntesis:</strong></p><p>*\"Argentina eligió federalismo para distribuir el poder entre la Nación y las provincias. A diferencia de un sistema unitario donde todo está centralizado en la capital, el federalismo permite que las provincias mantengan autonomía en ciertos temas. Las facultades delegadas (relaciones exteriores, defensa) son solo de la Nación. Las facultades concurrentes (educación, transporte) las ejercen ambas jurisdicciones.\"*</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-3-1",
    "unit": 3,
    "kind": "vf",
    "tema": "Nacimiento sin vida",
    "enunciado": "<p>Si una persona humana nace sin vida, se considera que nunca existió.</p>",
    "respuesta": "<p>Correcto según el art. 19 del Código Civil y Comercial de la Nación. La existencia de la persona humana comienza con el <strong>nacimiento con vida</strong>. Si no hay vida al nacer, jurídicamente no existe la persona. Esto tiene implicaciones en herencias, derechos sucesorios, etc.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-2",
    "unit": 3,
    "kind": "completar",
    "tema": "Tipos de Personas",
    "enunciado": "<p>El CCyCN distingue entre dos tipos de personas: persona jurídica y persona __________.</p>",
    "respuesta": "<p>Correcto. El Código Civil y Comercial distingue claramente entre:</p><ul><li><strong>Persona humana (o física):</strong> Seres humanos con capacidad de derechos.</li><li><strong>Persona jurídica:</strong> Entidades creadas por ley (sociedades, asociaciones, fundaciones, etc.) que actúan como sujetos de derecho.</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-3",
    "unit": 3,
    "kind": "desarrollo",
    "tema": "Capacidad de Derecho vs Ejercicio",
    "enunciado": "<p>Explica brevemente qué es la <strong>capacidad de derecho</strong> y la <strong>capacidad de ejercicio</strong>. ¿Cuál adquieren antes los menores?</p>",
    "respuesta": "<p>El orden de adquisición es el siguiente:</p><ul><li><strong>Capacidad de derecho</strong> (art. 22 CCyCN): Aptitud para ser titular de derechos y obligaciones. Se adquiere con el nacimiento con vida.</li><li><strong>Capacidad de ejercicio</strong> (art. 23 CCyCN): Aptitud para ejercer por sí mismo esos derechos. Se adquiere a los 18 años (mayoría de edad).</li></ul><p><strong>Orden cronológico:</strong></p><ul><li>Nace el bebé → Adquiere capacidad de derecho (puede heredar, tener bienes, aunque no pueda administrarlos)</li><li>Cumple 18 años → Adquiere capacidad de ejercicio (puede actuar legalmente por sí mismo)</li></ul><p>Un menor de edad es una <strong>persona con capacidad de derecho pero sin capacidad de ejercicio</strong> — necesita representación de padres/tutores.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-4",
    "unit": 3,
    "kind": "mc",
    "tema": "Mayoría de Edad en Argentina",
    "enunciado": "<p>¿A qué edad se adquiere la mayoría de edad en Argentina?</p>",
    "opts": [
      "16 años",
      "18 años",
      "21 años",
      "25 años",
      "Depende del contexto"
    ],
    "respuesta": "<p>Correcto según el art. 24 del CCyCN. La mayoría de edad se adquiere a los 18 años. A partir de ese momento, la persona adquiere plena capacidad de ejercicio y puede actuar jurídicamente sin necesidad de representación. Esto fue modificado por el CCyCN 2015 (antes era 21 años en el Código Civil de 1869).</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-5",
    "unit": 3,
    "kind": "vf",
    "tema": "Plazo vs Condición",
    "enunciado": "<p>Sujetar una obligación a un plazo es superditarla al acontecimiento de un hecho.</p>",
    "respuesta": "",
    "correccion": "❌ SIN RESPUESTA"
  },
  {
    "id": "p1-3-6",
    "unit": 3,
    "kind": "mc",
    "tema": "Selección Múltiple — Elementos Esenciales de Obligaciones",
    "enunciado": "<p>¿Cuáles son los <strong>elementos esenciales</strong> de las obligaciones? (Marca todas las correctas)</p>",
    "opts": [
      "Sujetos (acreedor y deudor)",
      "Objeto (prestación)",
      "Causa",
      "Plazo",
      "Lugar"
    ],
    "respuesta": "<p>Los tres elementos esenciales son:</p><ul><li><strong>(a) Sujetos:</strong> Acreedor (quien tiene derecho a exigir) y deudor (quien debe cumplir). Art. 724 CCyCN.</li><li><strong>(b) Objeto:</strong> La prestación (dar, hacer o no hacer). Debe ser lícito, posible y determinado.</li><li><strong>(c) Causa:</strong> El fundamento o razón de la obligación (por qué existe). Ej: contrato, ley, delito.</li></ul><p><strong>Elementos accidentales</strong> (no esenciales pero pueden agregarse):</p><ul><li><strong>(d) Plazo:</strong> Cuándo se cumple (accidental)</li><li><strong>(e) Lugar:</strong> Dónde se cumple (accidental)</li></ul><p>Conviene diferenciar los elementos esenciales de los accidentales.</p>",
    "correccion": "✅ CORRECTA (pero requiere aclaración)"
  },
  {
    "id": "p1-3-7",
    "unit": 3,
    "kind": "desarrollo",
    "tema": "Responsabilidad Civil",
    "enunciado": "<p>Explica brevemente qué es la <strong>responsabilidad civil</strong> y cuáles son sus tres funciones principales.</p>",
    "respuesta": "<p>Una respuesta completa requiere:</p><ul><li>Definición más precisa</li><li>Las <strong>tres funciones</strong> (que es lo pedido)</li></ul><p><strong>Definición completa:</strong></p><p>La responsabilidad civil es el <strong>sistema de imputación de responsabilidad</strong> que obliga a quienes causaron daño a otros a repararlo. Busca proteger derechos patrimoniales y extrapatrimoniales.</p><p><strong>Las tres funciones principales:</strong></p><ul><li><strong>Función preventiva:</strong> Disuade conductas dañosas. \"Si se que respondo, tengo cuidado.\"</li><li><strong>Función punitiva:</strong> Sanciona al responsable con una indemnización (daño punitivo). El responsable sufre una pena económica.</li><li><strong>Función resarcitoria:</strong> Repara el daño causado al damnificado. Busca dejarlo en la situación anterior al daño.</li></ul><p><strong>Formulación completa:</strong></p><p>*\"La responsabilidad civil es el sistema que obliga a quienes causan daño a repararlo. Tiene tres funciones: preventiva (disuade conductas dañosas), punitiva (sanciona al responsable) y resarcitoria (repara el daño del damnificado).\"*</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-3-8",
    "unit": 3,
    "kind": "mc",
    "tema": "Selección Múltiple — Presupuestos de la Función Resarcitoria",
    "enunciado": "<p>Marque los <strong>presupuestos de la función resarcitoria</strong> de la responsabilidad civil: (Marca todas las correctas)</p><ul><li>f) Intención dolosa</li></ul>",
    "opts": [
      "Autoría",
      "Antijuridicidad",
      "Factor de atribución",
      "Daño",
      "Relación de causalidad"
    ],
    "respuesta": "<p>Los <strong>cinco presupuestos de la función resarcitoria</strong> son:</p><ul><li><strong>Autoría:</strong> Quién causó el daño (identificación del autor).</li><li><strong>Antijuridicidad:</strong> El acto viola una norma jurídica (es ilícito).</li><li><strong>Factor de atribución:</strong> Fundamento para atribuir responsabilidad (culpa, dolo, responsabilidad objetiva).</li><li><strong>Daño:</strong> Lesión de un derecho o interés jurídicamente protegido (económico o moral).</li><li><strong>Relación de causalidad:</strong> Nexo causal entre el acto y el daño (fue la causa del daño).</li></ul><p><strong>Opción f) rechazada correctamente:</strong></p><p>La intención dolosa (f) no es presupuesto — la responsabilidad civil existe incluso por culpa leve. No se requiere dolo obligatoriamente.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-9",
    "unit": 3,
    "kind": "caso",
    "tema": "Responsabilidad Civil por Daño Ambiental",
    "enunciado": "<p>Una empresa de transporte de combustible sufre un accidente que derrama gasolina en un río. El daño afecta a pescadores locales que pierden su actividad durante 3 meses. Analiza desde la responsabilidad civil:</p>",
    "opts": [
      "¿Quién es responsable civilmente por los daños a los pescadores?",
      "¿Se trata de responsabilidad contractual o extracontractual? ¿Por qué?",
      "¿Cuál de las tres funciones de la responsabilidad civil (preventiva, punitiva, resarcitoria) se aplica aquí?"
    ],
    "respuesta": "<p>El caso permite analizar toda la estructura de responsabilidad civil:</p><p><strong>a) Responsable:</strong> la <strong>empresa de transporte</strong> es responsable civilmente. Es quien causó el daño (violó deberes de cuidado en transporte de combustible).</p><p><strong>b) Tipo de responsabilidad:</strong> ✅ Responsabilidad extracontractual.</p><ul><li><strong>Extracontractual</strong> (aquiliana, delictual): Surge de actos ilícitos sin relación contractual previa. No hay contrato entre la empresa y los pescadores; surge de la violación de una norma (negligencia en transporte).</li><li>(No es contractual porque no hay relación contractual entre partes)</li></ul><p><strong>c) Funciones aplicables:</strong> ✅ Resarcitoria y punitiva.</p><ul><li><strong>Resarcitoria:</strong> Reparar el daño a los pescadores (lucro cesante por 3 meses sin pesca).</li><li><strong>Punitiva:</strong> Sancionar a la empresa (daño punitivo adicional a la reparación, por negligencia grave).</li><li>(La <strong>preventiva</strong> también se aplica: la empresa debe tomar precauciones futuras)</li></ul><p>Este es un <strong>ejemplo real</strong> de responsabilidad por daño ambiental, que ha sido objeto de muchos fallos judiciales.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-3-10",
    "unit": 3,
    "kind": "desarrollo",
    "tema": "Ejemplo de Contrato Completo",
    "enunciado": "<p>Elije un ejemplo de <strong>contrato</strong> que vos inventes. Define claramente:</p>",
    "opts": [
      "Cuáles son las partes",
      "Cuál es el objeto",
      "Cuál es la causa",
      "Identifica los elementos esenciales"
    ],
    "respuesta": "<p>El ejemplo es concreto y está bien estructurado: las partes, el objeto y la causa quedan claros. El punto d) sobre elementos esenciales, que es el más importante, queda pendiente de desarrollo.</p><p><strong>Análisis del ejemplo:</strong></p><p>✅ <strong>a) Partes:</strong> Correcto. Juan Pérez (vendedor) y Domingo González (comprador). Los datos (nombres, DNI, domicilio) están correctamente identificados.</p><p>✅ <strong>b) Objeto:</strong> Correcto. La moto Honda C100 (bien especificada con serie y color). El objeto debe ser <strong>lícito, posible, determinado y patrimonial</strong>.</p><p>✅ <strong>c) Causa:</strong> Bien explicado. La causa es el intercambio: Juan da la moto para recibir dinero; Domingo da dinero para recibir la moto. Causa onerosa (ambas partes dan algo).</p><p>❌ <strong>d) Elementos esenciales (FALTANTE):</strong> Corresponde identificar:</p><p><strong>Elementos esenciales del contrato:</strong></p><ul><li><strong>Consentimiento:</strong> Acuerdo de voluntades entre Juan y Domingo.</li><li><strong>Objeto:</strong> La moto (lícito, posible, determinado, patrimonial).</li><li><strong>Causa:</strong> Intercambio de dinero por cosa.</li><li><strong>Forma:</strong> Contrato de compraventa de bien mueble (puede ser informal, verbal o escrito).</li></ul><p><strong>Formulación completa:</strong></p><p>*\"Los elementos esenciales son: 1) Consentimiento (acuerdo entre Juan y Domingo), 2) Objeto (la moto, bien determinado y patrimonial), 3) Causa (intercambio oneroso).\"*</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-4-1",
    "unit": 4,
    "kind": "vf",
    "tema": "Derecho Comercial y Comerciantes",
    "enunciado": "<p>El Derecho Comercial es una rama autónoma del Derecho Privado que se aplica solo a comerciantes, no a personas comunes.</p>",
    "respuesta": "<p>Bien. Esta es una distinción importante después de la reforma del CCyCN 2015. Con la unificación del Código Civil y Comercial:</p><ul><li><strong>Antes:</strong> Existía un \"Código de Comercio\" separado que se aplicaba a \"comerciantes\" que realizaban \"actos de comercio\".</li><li><strong>Ahora:</strong> El concepto es más amplio — se aplica a cualquier persona (física o jurídica) que realice una <strong>\"actividad económica organizada\"</strong> o sea titular de una empresa/establecimiento.</li></ul><p>La distinción entre comerciante/no comerciante ya <strong>no existe</strong> en el CCyCN. Lo importante es si hay <strong>actividad económica organizada</strong>, sin importar si la persona es \"comerciante\" de profesión.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-4-2",
    "unit": 4,
    "kind": "completar",
    "tema": "Ley de Transferencia de Fondo de Comercio",
    "enunciado": "<p>El régimen de transferencia de Fondo de Comercio está establecido en la _____________.</p>",
    "respuesta": "<p>Error puntual pero importante. La ley que regula la transferencia de fondo de comercio en Argentina es la <strong>Ley 11.867</strong> (no 14.486).</p><p><strong>Ley 11.867 — Transferencia de Fondo de Comercio:</strong></p><ul><li>Regula cómo se transmite un fondo de comercio (por venta, herencia, etc.)</li><li>Define elementos constitutivos del fondo</li><li>Establece responsabilidades del comprador hacia acreedores del vendedor</li><li>Exige publicidad mediante edictos</li></ul><p><strong>Memorización:</strong> Ley <strong>11.867</strong> = fondo de comercio. Es una ley antigua pero todavía vigente y fundamental.</p>",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-4-3",
    "unit": 4,
    "kind": "desarrollo",
    "tema": "Fondo de Comercio vs Empresa",
    "enunciado": "<p>Define brevemente qué es el <strong>fondo de comercio</strong>. ¿Cuál es la diferencia entre fondo de comercio y empresa?</p>",
    "respuesta": "<p>La <strong>diferencia conceptual clave</strong> es la siguiente:</p><p><strong>Fondo de Comercio:</strong></p><ul><li><strong>Concepto estático:</strong> Conjunto de bienes, marcas, clientela, nombre comercial organizados como unidad.</li><li><strong>Elementos:</strong> Clientela, nombre comercial, derechos de propiedad intelectual, ubicación, inventario, elementos materiales.</li><li><strong>No requiere ser empresa:</strong> Un kiosco de barrio es un fondo de comercio aunque sea operado por una persona sin ser \"empresa\" formal.</li></ul><p><strong>Empresa:</strong></p><ul><li><strong>Concepto dinámico:</strong> La actividad económica organizada de producción o cambio de bienes/servicios.</li><li><strong>Organización de fuerzas:</strong> Capital + trabajo + dirección del empresario.</li><li><strong>Relación:</strong> La empresa utiliza el fondo de comercio como su instrumento.</li></ul><p><strong>Ejemplo:</strong> Un kiosco de barrio trabajado por un monotributista es un fondo de comercio (tiene clientela, ubicación, marca, inventario) pero puede no ser una \"empresa\" en sentido formal.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-4-4",
    "unit": 4,
    "kind": "mc",
    "tema": "Elemento NO Constitutivo del Fondo de Comercio",
    "enunciado": "<p>¿Cuál de los siguientes NO es un elemento constitutivo del fondo de comercio según la <strong>Ley 11.867</strong>?</p>",
    "opts": [
      "Clientela",
      "Nombre comercial",
      "Invenciones patentadas",
      "Ubicación del local",
      "Elementos materiales (maquinaria, inventario)"
    ],
    "respuesta": "<p>Bien identificado. Según el art. 8 de la Ley 11.867, los elementos constitutivos del fondo de comercio son:</p><p><strong>Sí son elementos:</strong></p><ul><li>a) <strong>Clientela:</strong> Conjunto de clientes habituales</li><li>b) <strong>Nombre comercial:</strong> Denominación del negocio</li><li>c) <strong>Invenciones patentadas:</strong> Derechos de propiedad intelectual</li><li>e) <strong>Elementos materiales:</strong> Maquinaria, inventario, muebles</li></ul><p><strong>NO es elemento:</strong></p><ul><li>d) <strong>Ubicación del local:</strong> El inmueble (local) NO forma parte del fondo de comercio. El fondo es independiente del local donde funciona. Se puede trasladar el fondo a otro lugar.</li></ul><p><strong>Detalle importante:</strong> El derecho a usar el local (alquiler/propiedad) es una obligación o activo del comprador, pero el inmueble en sí no es elemento del fondo.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-4-5",
    "unit": 4,
    "kind": "vf",
    "tema": "Cheque No a la Orden",
    "enunciado": "<p>Un cheque no a la orden puede ser cobrado por cualquier persona que lo presente, sin necesidad de endoso.</p>",
    "respuesta": "<p>Correcto. \"No a la orden\" es una clausula restrictiva según la Ley 24.452 de Cheques:</p><p><strong>Cheque \"no a la orden\":</strong></p><ul><li>Es <strong>intransferible</strong> — no se puede endosar</li><li>Solo la persona cuyo nombre aparece puede cobrarlo</li><li>Si alguien intenta endosarlo, el endoso es inválido</li><li>Es una medida de <strong>seguridad</strong> para evitar que terceros cobren el cheque</li></ul><p><strong>Ejemplo:</strong> Si escribo \"no a la orden\" en un cheque a nombre de \"Juan García\", solo Juan García puede cobrarlo. No puede cederlo a Pedro.</p><p><strong>Marcación:</strong> \"No a la orden\" se escribe en el dorso o en la parte frontal del cheque.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-4-6",
    "unit": 4,
    "kind": "mc",
    "tema": "Selección Múltiple — Títulos de Crédito",
    "enunciado": "<p>¿Cuáles de los siguientes son <strong>títulos de crédito</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Cheque",
      "Letra de cambio",
      "Pagaré",
      "Obligaciones negociables",
      "Facturas"
    ],
    "respuesta": "<p>Bien en la mayoría, pero hay dos cuestiones:</p><p><strong>Sí son títulos de crédito (clásicos):</strong></p><ul><li>a) <strong>Cheque:</strong> Sí. Orden de pago a la vista (Ley 24.452).</li><li>b) <strong>Letra de cambio:</strong> Sí. Promesa de pago a plazo (Dec. Ley 5965/63).</li><li>c) <strong>Pagaré:</strong> Sí. Promesa incondicional de pago.</li><li>d) <strong>Obligaciones negociables:</strong> Sí. Títulos de crédito emitidos por sociedades (Ley 23.576). A menudo se omiten, pero son títulos de crédito.</li></ul><p><strong>Dudoso:</strong></p><ul><li>e) <strong>Facturas:</strong> Discutible. En algunas jurisdicciones se consideran documentos comerciales pero <strong>no títulos de crédito en sentido estricto</strong> (no tienen la literalidad ni autonomía de un cheque o letra).</li></ul><p><strong>Mejor respuesta: A, B, C y D</strong></p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-4-7",
    "unit": 4,
    "kind": "desarrollo",
    "tema": "Cheque Cruzado",
    "enunciado": "<p>Explica brevemente qué es un <strong>cheque cruzado</strong> y cuál es su diferencia con un cheque común.</p>",
    "respuesta": "",
    "correccion": "❌ SIN RESPUESTA"
  },
  {
    "id": "p1-4-8",
    "unit": 4,
    "kind": "mc",
    "tema": "Selección Múltiple — Características del Contrato de Seguro",
    "enunciado": "<p>¿Cuáles de las siguientes son características del <strong>contrato de seguro</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Es un contrato bilateral (genera obligaciones para ambas partes)",
      "Es un contrato aleatorio (no se sabe de antemano quién ganará)",
      "Requiere pago de prima (contraprestación del asegurado)",
      "La aseguradora siempre debe pagar la indemnización sin importar las circunstancias",
      "Requiere denuncia de siniestro en tiempo y forma"
    ],
    "respuesta": "<p>Dos características importantes suelen omitirse:</p><p><strong>Características del contrato de seguro:</strong></p><p>✅ <strong>a) Es bilateral:</strong> Genera obligaciones para ambas partes:</p><ul><li>Asegurado: Pagar la prima</li><li>Asegurador: Cubrir el riesgo y pagar indemnización si ocurre siniestro</li></ul><p>(Es fundamental.)</p><p>✅ <strong>b) Es aleatorio:</strong> El resultado es incierto para ambas partes:</p><ul><li>No se sabe si ocurrirá el siniestro</li><li>No se sabe cuándo ocurrirá</li><li>La ganancia/pérdida depende de un evento futuro e incierto</li></ul><p>✅ <strong>c) Requiere prima:</strong> Contraprestación del asegurado.</p><p>❌ <strong>d) Aseguradora siempre paga:</strong> FALSO. La aseguradora se puede negar si:</p><ul><li>No hay denuncia de siniestro</li><li>El asegurado cometió fraude</li><li>El evento no está cubierto por la póliza</li><li>Vencimiento de términos</li></ul><p>✅ <strong>e) Requiere denuncia de siniestro:</strong> Correcto. El asegurado debe comunicar el siniestro en tiempo y forma (generalmente 10 días), o pierde derecho a indemnización.</p><p><strong>Mejor respuesta: A, B, C y E</strong></p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-4-9",
    "unit": 4,
    "kind": "caso",
    "tema": "Cheque Post-Datado No a la Orden",
    "enunciado": "<p>Un comerciante recibe un cheque post-datado (con fecha futura) de pago diferido por $50.000 de su cliente. El cheque dice \"no a la orden\". Analiza:</p>",
    "opts": [
      "¿Puede el comerciante endosar (ceder) este cheque a un tercero?",
      "¿Cuándo puede cobrar el cheque?",
      "¿Qué sucede si el banco rechaza el pago cuando llega la fecha?"
    ],
    "respuesta": "<p>El análisis aplica correctamente los conceptos de cheque post-datado, cheque no a la orden, y consecuencias de rechazo:</p><p><strong>a) Endoso:</strong> ✅ Correcto. \"No a la orden\" = <strong>intransferible</strong>. El comerciante <strong>no puede endosar</strong> este cheque a un tercero. Solo el comerciante (portador nominado) puede cobrarlo.</p><p><strong>b) Fecha de cobro:</strong> ✅ Correcto. Un cheque <strong>post-datado</strong> (con fecha futura) no puede cobrarse antes de la fecha indicada. El banco rechazará el cobro si se presenta antes. El comerciante debe esperar a la fecha del cheque.</p><p><strong>c) Rechazo de pago:</strong> ✅ Correcto. Si el banco rechaza el pago cuando llega la fecha (por fondos insuficientes, cuenta cerrada, etc.):</p><ul><li>El banco devuelve el cheque</li><li>Se genera un \"protesto\" (acta de rechazo)</li><li>El comerciante puede ejercer acciones legales contra el librador (quien escribió el cheque) por <strong>incumplimiento</strong></li><li>Puede reclamar judicialmente el pago</li></ul><p>Este es un caso real frecuente en comercio.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-4-10",
    "unit": 4,
    "kind": "desarrollo",
    "tema": "Concurso Preventivo vs Quiebra",
    "enunciado": "<p>Compara brevemente el <strong>concurso preventivo</strong> y la <strong>quiebra</strong>. ¿Cuál es el objetivo de cada uno? ¿Cuándo se aplica cada uno?</p>",
    "respuesta": "<p>La diferencia y la secuencia entre ambas figuras se resumen en los objetivos y el flujo legal:</p><p><strong>Concurso Preventivo:</strong></p><ul><li><strong>Objetivo:</strong> <strong>Reorganización</strong> de la empresa en dificultades; salvar la empresa del colapso</li><li><strong>Mecanismo:</strong> Junta a acreedores, el deudor presenta plan de pagos (acuerdo preventivo)</li><li><strong>Mayoría requerida:</strong> Generalmente más del 50%, pero para ciertos créditos puede ser mayor</li><li><strong>(Nota: el 70% suele citarse como cifra aproximada — depende de la legislación específica)</strong></li><li><strong>Resultado:</strong> Si se aprueba, se implementa el acuerdo y la empresa continúa</li></ul><p><strong>Quiebra:</strong></p><ul><li><strong>Objetivo:</strong> <strong>Liquidación</strong> ordenada de bienes para pagar a acreedores</li><li><strong>Cuándo se aplica:</strong> Cuando el concurso preventivo falla o no es posible, o cuando hay insolvencia irreversible</li><li><strong>Mecanismo:</strong> Se venden los bienes, se distribuye el producido entre acreedores (según jerarquía)</li><li><strong>Resultado:</strong> Liquidación del fondo de comercio</li></ul><p><strong>La secuencia es correcta:</strong></p><ul><li>Empresa en dificultades → Concurso preventivo</li><li>Si falla el concurso → Quiebra</li><li>Liquidación de bienes → Pago a acreedores</li></ul><p>Son dos <strong>remedios diferentes</strong> para la insolvencia, con objetivos opuestos.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-5-1",
    "unit": 5,
    "kind": "vf",
    "tema": "Duración de Patentes",
    "enunciado": "<p>Las patentes tienen una duración de 15 años a partir de su registro en la República Argentina.</p>",
    "respuesta": "<p>Según la <strong>Ley 24.481</strong> (Régimen de Patentes de Invención):</p><ul><li><strong>Duración:</strong> 20 años a partir de la fecha de presentación de la solicitud</li><li><strong>Improrrogable:</strong> NO se pueden renovar ni extender (a diferencia de marcas)</li><li><strong>Protección exclusiva:</strong> Durante estos 20 años, el titular tiene monopolio de explotación</li></ul><p><strong>Comparación con otras duraciones de PI:</strong></p><ul><li><strong>Patentes:</strong> 20 años (improrrogable)</li><li><strong>Marcas:</strong> 10 años (renovable indefinidamente cada 10 años)</li><li><strong>Derechos de autor:</strong> Vida del autor + 70 años</li><li><strong>Diseños industriales:</strong> 5 años (renovable hasta 15 años)</li></ul><p>Esta es una pregunta <strong>muy frecuente en parciales</strong>: la duración es de 20 años.</p>",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-5-2",
    "unit": 5,
    "kind": "completar",
    "tema": "Ley y Duración del Derecho de Autor",
    "enunciado": "<p>El derecho de autor está protegido en Argentina por la Ley _____________ y tiene una duración de _____________ después de la muerte del autor.</p>",
    "respuesta": "<p>La ley aplicable es:</p><ul><li><strong>Ley 11.723:</strong> Régimen de propiedad intelectual de obras literarias, musicales, dramáticas, coreográficas, pictóricas, escultóricas, fotográficas y, desde 1992, <strong>software</strong>.</li><li><strong>Duración:</strong> Art. 55 de Ley 11.723 — La protección se extiende durante toda la vida del autor y <strong>70 años después de su muerte</strong> (posteriores a la reforma de 1998).</li></ul><p><strong>Nota histórica:</strong> Antes de 1998, era solo 50 años después de la muerte. Se extendió a 70 años para harmonizar con estándares internacionales (ADPIC).</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-5-3",
    "unit": 5,
    "kind": "desarrollo",
    "tema": "Marca vs Marca Registrada vs Marca Notoria",
    "enunciado": "<p>Define brevemente qué es una <strong>marca</strong> y explica la diferencia entre una <strong>marca registrada</strong> y una <strong>marca notoria</strong>.</p>",
    "respuesta": "<p>La diferencia clave entre estos conceptos es la siguiente:</p><p><strong>Marca:</strong></p><ul><li>Signo distintivo que identifica productos/servicios de una empresa</li><li>Puede ser palabra, imagen, color, forma, sonido, etc.</li><li>Protege derechos de propiedad intelectual del titular</li></ul><p><strong>Marca Registrada:</strong></p><ul><li>Marca que fue registrada ante el <strong>INPI</strong> (Instituto Nacional de la Propiedad Industrial)</li><li>Requiere trámite formal de registro</li><li>Proporciona protección oficial y exclusiva</li><li>Duración: 10 años (renovable indefinidamente)</li><li>Derecho está limitado a territorios donde está registrada</li></ul><p><strong>Marca Notoria:</strong></p><ul><li>Marca ampliamente conocida en el público, aunque <strong>no esté registrada</strong></li><li>Tiene protección especial según Ley 22.362 art. 5</li><li>Ej: Coca-Cola, Ferrari, Rolex — son tan conocidas que tienen derechos aunque no estén registradas en ciertos territorios</li><li><strong>Protección transfronteriza:</strong> Puede ser protegida en países donde no está registrada, por su notoriedad internacional</li></ul><p>Coca-Cola es un ejemplo claro de marca notoria.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-5-4",
    "unit": 5,
    "kind": "mc",
    "tema": "Selección Múltiple — Tipos de Marcas",
    "enunciado": "<p>¿Qué tipos de marcas existen según nuestra legislación? (Marca todas las correctas)</p>",
    "opts": [
      "Marcas de producto",
      "Marcas de servicio",
      "Marcas colectivas",
      "Marcas de garantía",
      "Marcas tridimensionales (formas, colores, sonidos)"
    ],
    "respuesta": "<p>La legislación reconoce cinco tipos de marcas:</p><p>✅ <strong>a) Marcas de producto:</strong> Identifican productos tangibles.</p><p>✅ <strong>b) Marcas de servicio:</strong> Identifican servicios.</p><p>✅ <strong>c) Marcas colectivas:</strong> Identifican productos/servicios de miembros de asociación. Existen en Ley 22.362 — Ej: Denominación de origen (vinos de Mendoza).</p><p>✅ <strong>d) Marcas de garantía:</strong> Certifican características comunes (calidad, material, origen). Existen en Ley 22.362 — Ej: \"Puro algodón\".</p><p>✅ <strong>e) Marcas tridimensionales:</strong> Formas, colores distintivos, sonidos.</p><p><strong>Mejor respuesta: A, B, C, D, E</strong> (todas son tipos válidos de marcas)</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-5-5",
    "unit": 5,
    "kind": "vf",
    "tema": "Derecho de Autor Protege Ideas",
    "enunciado": "<p>El derecho de autor protege las ideas en sí mismas, no solo la expresión de las ideas.</p>",
    "respuesta": "<p>Este es un error conceptual importante que aparece frecuentemente en parciales.</p><p><strong>Principio fundamental del derecho de autor:</strong></p><p>El derecho de autor protege la <strong>EXPRESIÓN</strong> de las ideas, NO las ideas en sí.</p><p><strong>Razón:</strong> Las ideas son consideradas <strong>dominio público</strong> — patrimonio cultural de la humanidad. No se pueden monopolizar. Solo la forma particular en que alguien expresa una idea es protegible.</p><p><strong>Ejemplo:</strong></p><ul><li><strong>Idea:</strong> \"Escribir una novela sobre un viaje en el tiempo\" — está disponible para cualquiera</li><li><strong>Expresión protegida:</strong> El libro específico de Stephen King \"The Stand\" — protegido por derecho de autor</li><li>Otro autor puede escribir otra novela sobre viajes en el tiempo (idea distinta) sin violar derechos</li></ul><p><strong>Corolario:</strong> Por eso los algoritmos, métodos matemáticos, conceptos científicos NO están protegidos por derecho de autor, aunque pueden estar protegidos por <strong>patentes</strong> (si cumplen requisitos).</p>",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-5-6",
    "unit": 5,
    "kind": "mc",
    "tema": "Selección Múltiple — Requisitos de Patentabilidad",
    "enunciado": "<p>¿Cuáles son requisitos de <strong>patentabilidad</strong> según la <strong>Ley 24.481</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Novedad",
      "Actividad inventiva",
      "Aplicación industrial",
      "Utilidad económica inmediata",
      "No debe contradecir el orden público"
    ],
    "respuesta": "<p>Son <strong>tres los requisitos esenciales</strong> de patentabilidad:</p><p><strong>Los tres requisitos principales de patentabilidad (art. 4 Ley 24.481):</strong></p><p>✅ <strong>a) Novedad:</strong> La invención debe ser nueva — no debe estar incluida en el estado de la técnica.</p><p>✅ <strong>b) Actividad inventiva (o nivel inventivo):</strong> La invención no debe resultar evidente para un experto en la materia. Debe aportar algo que no es obvio.</p><p>✅ <strong>c) Aplicación industrial:</strong> La invención debe ser susceptible de aplicación industrial — debe poder fabricarse o usarse en la industria. <strong>Es un requisito esencial.</strong></p><p>❌ <strong>d) Utilidad económica inmediata:</strong> NO es requisito. Puede haber patentes con utilidad económica futura.</p><p>✅ <strong>e) No contradict orden público:</strong> Correcto. Art. 6 Ley 24.481 — se rechazan invenciones contrarias a orden público/moralidad.</p><p><strong>Mejor respuesta: A, B, C</strong> (los tres requisitos esenciales)</p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-5-7",
    "unit": 5,
    "kind": "desarrollo",
    "tema": "Estado de la Técnica",
    "enunciado": "<p>Explica brevemente qué es el <strong>\"estado de la técnica\"</strong> en relación a las patentes. ¿Por qué es importante para evaluar la novedad?</p>",
    "respuesta": "<p>El concepto se define de la siguiente manera:</p><p><strong>Estado de la técnica:</strong></p><ul><li><strong>Definición:</strong> Conjunto de conocimientos públicos disponibles antes de la fecha de presentación de solicitud de patente</li><li><strong>Incluye:</strong> Patentes previas, publicaciones, documentos técnicos, congresos, internet, usos públicos conocidos</li><li><strong>No incluye:</strong> Conocimiento privado/secreto del solicitante</li></ul><p><strong>Importancia para evaluar novedad:</strong></p><ul><li>Una invención es <strong>nueva</strong> si NO está incluida en el estado de la técnica</li><li>Si la invención ya está en el estado de la técnica (publicada, patentada, usado públicamente), <strong>NO es patentable</strong></li><li>El examinador de patentes debe hacer búsqueda exhaustiva del estado de la técnica</li></ul><p>En síntesis: si la invención \"no converge\" (no coincide) con nada previo del estado de la técnica, tiene novedad y se otorga la patente.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-5-8",
    "unit": 5,
    "kind": "mc",
    "tema": "Selección Múltiple — Software",
    "enunciado": "<p>¿Cuáles de las siguientes afirmaciones sobre el software son correctas? (Marca todas las correctas)</p>",
    "opts": [
      "El software está protegido por derechos de autor según la Ley 11.723",
      "El software NO puede ser protegido por patentes en Argentina",
      "El software se protege como obra literaria en la legislación argentina",
      "Una persona que crea un software mientras trabaja en una empresa tiene propiedad total del código",
      "El software puede ser licenciado bajo términos de software libre (GPL, MIT, etc.)"
    ],
    "respuesta": "<p>Las afirmaciones correctas son tres (A, C, E):</p><p>✅ <strong>a) Protegido por derechos de autor (Ley 11.723):</strong> Correcto. Desde 1992, el software está protegido como obra literaria.</p><p>❌ <strong>b) NO puede ser patentado:</strong> Falso. El software SÍ puede ser protegido por patentes en Argentina si cumple requisitos (novedad, actividad inventiva, aplicación industrial).</p><p>✅ <strong>c) Se protege como obra literaria:</strong> Correcto. Ley 11.723 (desde reforma 1992) protege programas de computación como obras literarias. <strong>Es un punto fundamental.</strong></p><p>❌ <strong>d) Creador tiene propiedad total:</strong> Falso. Si el software se crea en el contexto de una relación de empleo, la <strong>propiedad o derechos patrimoniales pueden pertenecer al empleador</strong> según contrato o ley laboral (art. 9 de Ley 11.723).</p><p>✅ <strong>e) Puede ser licenciado bajo software libre:</strong> Correcto. El titular de derechos puede elegir cualquier modelo de licencia (GPL, MIT, Apache, etc.).</p><p><strong>Mejor respuesta: A, C, E</strong></p>",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-5-9",
    "unit": 5,
    "kind": "caso",
    "tema": "Protección de Software",
    "enunciado": "<p>Una empresa de tecnología desarrolla un nuevo software de análisis de datos. Quiere proteger su creación pero tiene presupuesto limitado. Analiza:</p>",
    "opts": [
      "¿Qué tipo de protección de PI recomendarías: patente o derecho de autor?",
      "¿Cuál es la duración de cada protección?",
      "¿Qué ventajas y desventajas tiene cada una para un software?"
    ],
    "respuesta": "",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-5-10",
    "unit": 5,
    "kind": "desarrollo",
    "tema": "Por Qué Plazo Limitado en PI",
    "enunciado": "<p>Explica brevemente por qué es importante establecer un <strong>plazo de protección limitado en el tiempo</strong> para la Propiedad Intelectual (especialmente en patentes). ¿Cuál es el equilibrio que busca el sistema?</p>",
    "respuesta": "<p>El equilibrio fundamental del sistema de PI es el siguiente:</p><p><strong>Por qué plazo limitado:</strong></p><p><strong>1. Incentivo a innovar (función privada):</strong></p><ul><li>Otorga monopolio temporal al inventor</li><li>Permite recuperar inversión en investigación</li><li>Motiva más innovación</li><li>\"Si invengo algo, tendré derechos exclusivos por X años\"</li></ul><p><strong>2. Dominio público (función pública):</strong></p><ul><li>Después de plazo, la invención pasa al dominio público</li><li>Otros pueden usar/mejorar el conocimiento</li><li>Evita monopolios perpetuos que frenarían innovación futura</li><li>Beneficia a la sociedad con conocimiento accesible</li></ul><p><strong>El equilibrio:</strong></p><ul><li><strong>Corto plazo:</strong> Inventor goza de protección exclusiva → incentivo</li><li><strong>Largo plazo:</strong> Conocimiento se libera → progreso social</li></ul><p><strong>Ejemplo:</strong></p><ul><li>Una patente de medicamento (20 años): Laboratorio recupera inversión, después el genérico es libre</li><li>Una novela (vida + 70 años): Autor/herederos protegidos, después obra es de dominio público</li></ul><p><strong>Crítica:</strong> Algunos argumentan que 20 años es poco (especialmente en farmacéutica), otros que es demasiado (softwares). Hay debate internacional sobre duración óptima.</p><p>En el fondo, el sistema de PI articula un <strong>trade-off</strong> fundamental entre protección privada e interés público.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-1",
    "unit": 0,
    "kind": "vf",
    "tema": "Acto Ilícito Civil y Penal",
    "enunciado": "<p>Un acto ilícito que viola una norma del Código Civil y Comercial genera automáticamente responsabilidad penal.</p>",
    "respuesta": "<p>La responsabilidad civil y la responsabilidad penal son <strong>sistemas diferentes e independientes</strong>:</p><ul><li><strong>Responsabilidad civil:</strong> Surge del incumplimiento de normas civiles. Objetivo: reparar daño (indemnización).</li><li><strong>Responsabilidad penal:</strong> Surge de violación de normas penales. Objetivo: castigar delito (prisión, multa).</li></ul><p>Un mismo acto puede generar ambas responsabilidades (delito) o solo civil (incumplimiento contractual). Pero una NO genera automáticamente la otra.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-2",
    "unit": 0,
    "kind": "desarrollo",
    "tema": "Venta de Fondo sin Edictos",
    "enunciado": "<p>Un comerciante vende un fondo de comercio a otro sin publicar los edictos requeridos por la <strong>Ley 11.867</strong>. ¿Qué consecuencias tiene esto para los acreedores del vendedor? ¿Qué normas de la jerarquía jurídica se aplican?</p>",
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-0-3",
    "unit": 0,
    "kind": "mc",
    "tema": "Ordenamientos con PI",
    "enunciado": "<p>¿En cuál de los siguientes ordenamientos jurídicos se encuentran disposiciones sobre Propiedad Intelectual?</p>",
    "opts": [
      "Solo en leyes especiales (Ley 24.481, Ley 11.723, Ley 22.362)",
      "Constitución Nacional (art. 17) + leyes especiales + tratados internacionales",
      "Solo en el Código Civil y Comercial",
      "En la jurisprudencia únicamente",
      "En costumbre y doctrina"
    ],
    "respuesta": "<p>La PI está regulada en <strong>múltiples niveles jerárquicos</strong>:</p><p><strong>Niveles jerárquicos de PI en Argentina:</strong></p><ul><li><strong>Constitución Nacional (art. 17):</strong> \"Todo autor o inventor es propietario exclusivo de su obra, invento o descubrimiento, por el término que le acuerde la ley.\"</li></ul><ul><li><strong>Tratados internacionales con jerarquía constitucional (art. 75 inc. 22):</strong></li><li>Convenio de París (ley 17.011)</li><li>Acuerdo ADPIC/TRIPS (ley 24.425)</li><li>Tratado de la OMPI</li></ul><ul><li><strong>Leyes especiales:</strong></li><li>Ley 11.723 (Derechos de autor)</li><li>Ley 24.481 (Patentes)</li><li>Ley 22.362 (Marcas)</li><li>Ley 23.576 (Obligaciones negociables)</li></ul><ul><li><strong>Código Civil y Comercial:</strong> Normas generales sobre obligaciones, contratos aplicables a PI</li></ul><ul><li><strong>Jurisprudencia:</strong> Fallos de jueces interpretan leyes de PI</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-4",
    "unit": 0,
    "kind": "caso",
    "tema": "Algoritmo de Ingeniero (Derechos, Protección, Duración)",
    "enunciado": "<p>Un ingeniero de software en una empresa crea un algoritmo revolucionario durante su horario laboral. Quiere patentarlo a su nombre. Analiza:</p>",
    "opts": [
      "¿Quién es titular de los derechos sobre el algoritmo: el ingeniero o la empresa?",
      "¿Qué tipo de protección sería más adecuada: patente o derecho de autor?",
      "¿Cuál sería la duración de protección en cada caso?"
    ],
    "respuesta": "<p>La relación laboral y las protecciones de PI se analizan así:</p><p><strong>a) Titular de derechos:</strong> Correcto — <strong>la empresa</strong>.</p><p>Según Ley 11.723 art. 9: Si la obra se crea en contexto de relación laboral/empleo, los derechos patrimoniales pertenecen al empleador (la empresa). El ingeniero podría retener derechos morales (paternidad de invención).</p><p><strong>b) Tipo de protección:</strong> ✅ <strong>Patente es más apropiada aquí</strong>.</p><p>Porque:</p><ul><li>El algoritmo es una <strong>invención</strong> (no solo código expresado)</li><li>Una patente protege el <strong>método/proceso</strong>, no solo la expresión</li><li>Derecho de autor protegería solo el código (expresión)</li></ul><p>Sin embargo, <strong>ambas protecciones podrían aplicarse:</strong></p><ul><li><strong>Derecho de autor</strong> (automático, código): Vida del autor + 70 años</li><li><strong>Patente</strong> (si es patentable): 20 años, pero requiere registro</li></ul><p><strong>c) Duración:</strong> ✅ <strong>Correcta.</strong></p><ul><li><strong>Patente:</strong> 20 años (improrrogable)</li><li><strong>Derecho de autor:</strong> Vida del autor + 70 años</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-5",
    "unit": 0,
    "kind": "vf",
    "tema": "Poder Ejecutivo Veta Ley Inconstitucional",
    "enunciado": "<p>El Poder Ejecutivo puede sancionar una ley como inconstitucional, pero el Poder Ejecutivo no puede hacer lo mismo al momento de ejecutarla.</p>",
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-0-6",
    "unit": 0,
    "kind": "completar",
    "tema": "Pirámide Jurídica (Continuación)",
    "enunciado": "<p>En la pirámide jurídica de Kelsen, después de la Constitución Nacional y Tratados con jerarquía constitucional, ¿cuáles son las siguientes tres fuentes de derecho en orden jerárquico?</p><p>__________ > __________ > __________</p>",
    "respuesta": "<p>La secuencia jerárquica correcta es:</p><ul><li>Constitución Nacional</li><li>Tratados internacionales con jerarquía constitucional (art. 75 inc. 22)</li><li><strong>Tratados internacionales sin jerarquía constitucional</strong></li><li><strong>Leyes nacionales</strong> (sancionadas por Congreso)</li><li><strong>Decretos y reglamentos del PE</strong></li><li>Resoluciones administrativas</li><li>Contratos privados</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-7",
    "unit": 0,
    "kind": "desarrollo",
    "tema": "Hecho Ilícito vs Moral",
    "enunciado": "<p>Define qué es un <strong>hecho ilícito</strong> y explica cómo se diferencia de un hecho simplemente contrario a la moral pero legal.</p>",
    "respuesta": "<p>La distinción clave entre órdenes normativas es:</p><p><strong>Hecho ilícito (jurídico):</strong></p><ul><li>Violación de norma jurídica</li><li>Tiene <strong>consecuencias legales</strong> (responsabilidad civil, penal, administrativa)</li><li>Se sanciona por autoridades del Estado</li><li>Ej: Robo, incumplimiento de contrato, negligencia</li></ul><p><strong>Hecho contrario a moral (pero legal):</strong></p><ul><li>Violación de normas éticas/morales</li><li>NO tiene consecuencias legales</li><li>Se sanciona solo por conciencia, opinión pública, contexto social</li><li>Ej: Ser infiel, traicionar confidencia no obligatoria, egoísmo</li></ul><p><strong>La diferencia es crucial:</strong> Lo inmoral NO es necesariamente ilegal. El Derecho es más restringido que la moral.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-8",
    "unit": 0,
    "kind": "mc",
    "tema": "Selección Múltiple — Responsabilidad Extracontractual",
    "enunciado": "<p>¿Cuáles de las siguientes situaciones generan <strong>responsabilidad civil extracontractual</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Un conductor choca a un peatón por negligencia",
      "Un prestamista no cumple con prestar dinero según contrato",
      "Una empresa contamina un río afectando pescadores",
      "Un vendedor no entrega un producto vendido",
      "Un médico comete un error quirúrgico causando daño"
    ],
    "respuesta": "<p>Las opciones B y D quedan excluidas (son contractuales):</p><p>✅ <strong>a) Conductor choca peatón:</strong> Extracontractual. No hay relación contractual; surge de acto ilícito (negligencia).</p><p>❌ <strong>b) Prestamista no presta dinero:</strong> Contractual. Hay contrato de préstamo; incumplimiento genera responsabilidad contractual.</p><p>✅ <strong>c) Empresa contamina río:</strong> Extracontractual. Daño a terceros (pescadores) sin relación contractual previa. Responsabilidad por acto ilícito (contaminación).</p><p>❌ <strong>d) Vendedor no entrega producto:</strong> Contractual. Hay contrato de venta; incumplimiento genera responsabilidad contractual.</p><p>✅ <strong>e) Médico error quirúrgico:</strong> Extracontractual. Aunque hay relación médico-paciente, el daño surge de negligencia (error quirúrgico), no incumplimiento contractual puro.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-9",
    "unit": 0,
    "kind": "caso",
    "tema": "Marca Ropa (Expansión Internacional)",
    "enunciado": "<p>Una marca de ropa quiere expandir internacionalmente. Sus productos están registrados en Argentina bajo <strong>Ley 22.362</strong>. Analiza:</p>",
    "opts": [
      "¿Su marca está automáticamente protegida en otros países?",
      "¿Qué sistema internacional debería usar para proteger su marca a nivel global?",
      "¿Qué ventajas tiene registrar la marca en múltiples países?"
    ],
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-0-10",
    "unit": 0,
    "kind": "vf",
    "tema": "Condición vs Plazo",
    "enunciado": "<p>Una obligación sujeta a condición es aquella cuya ejecución depende de un plazo futuro e incierto, mientras que una sujeta a plazo es aquella que depende de una fecha cierta.</p>",
    "respuesta": "<p>El enunciado tiene un error de redacción. Conviene aclarar:</p><p><strong>Condición:</strong> Hecho futuro e <strong>incierto</strong> (puede ocurrir o no)</p><p><strong>Plazo:</strong> Momento futuro <strong>cierto</strong> (ocurrirá inevitablemente)</p><p>El enunciado dice \"condición depende de un plazo futuro e incierto\" — esto es confuso porque el plazo es <strong>cierto</strong>. La interpretación correcta es que la condición es incierta y el plazo es cierto.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-11",
    "unit": 0,
    "kind": "mc",
    "tema": "Plazo Denuncia Siniestro (Ley 17.418)",
    "enunciado": "<p>¿Cuál es el término dentro del cual un asegurado debe denunciar un siniestro según la <strong>Ley 17.418</strong> de Seguros?</p>",
    "opts": [
      "Inmediatamente (sin plazo)",
      "Dentro de 5 días",
      "Dentro de 10 días",
      "Dentro de 30 días",
      "Dentro de 90 días"
    ],
    "respuesta": "<p><strong>72 horas</strong> es la respuesta correcta, aunque no figure entre las opciones.</p><p><strong>Ley 17.418 art. 46:</strong> El asegurado debe denunciar el siniestro <strong>dentro de 3 días hábiles</strong> (aproximadamente 72 horas) de ocurrido.</p><p>Esto es importante porque:</p><ul><li>Si no denuncia a tiempo, pierde derecho a indemnización</li><li>La aseguradora necesita tiempo para investigación</li><li>Es medida de seguridad contra fraude</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-12",
    "unit": 0,
    "kind": "desarrollo",
    "tema": "Compraventa Inmueble vs Mueble (Forma Pública)",
    "enunciado": "<p>Explica brevemente por qué en Argentina la compraventa de un inmueble requiere forma pública (escritura), pero la de un bien mueble puede ser informal.</p>",
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-0-13",
    "unit": 0,
    "kind": "caso",
    "tema": "Sentencia Viola CN (Impugnación)",
    "enunciado": "<p>Un juez dicta una sentencia que contradice el art. 18 de la Constitución Nacional (garantía de defensa). Un abogado quiere impugnar esta sentencia. Analiza:</p>",
    "opts": [
      "¿Cuál es la vía legal para impugnar esta sentencia?",
      "¿Qué poder intervendría para resolver este conflicto?",
      "¿Sobre qué bases argumentaría el abogado para anular la sentencia?"
    ],
    "respuesta": "<p>El sistema de impugnación funciona así:</p><p><strong>a) Vía legal:</strong> ✅ <strong>Apelación</strong></p><ul><li>Primera opción: Apelación ante la Cámara (instancia superior)</li><li>Si persiste la violación: Recurso extraordinario ante Corte Suprema (por inconstitucionalidad)</li></ul><p><strong>b) Poder:</strong> ✅ <strong>Poder Judicial</strong></p><p>El PJ es quien resuelve si la sentencia es inconstitucional y puede:</p><ul><li>Confirmar sentencia</li><li>Revocar sentencia</li><li>Ordenar nuevo juicio</li></ul><p><strong>c) Base legal:</strong> ✅ <strong>Violación de Constitución Nacional</strong></p><p>Específicamente:</p><ul><li>Art. 18 CN: Garantía de defensa en juicio</li><li>Art. 75 inc. 22 CN: Tratados de derechos humanos (Pacto de San José protege derecho de defensa)</li><li>Control de constitucionalidad: El juez debe respetar CN</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-14",
    "unit": 0,
    "kind": "vf",
    "tema": "Costumbre como Fuente",
    "enunciado": "<p>La costumbre es considerada fuente del derecho en Argentina, pero solo tiene validez si no contradice la ley.</p>",
    "respuesta": "<p>La jerarquía es la siguiente:</p><p><strong>Costumbre como fuente del derecho:</strong></p><ul><li><strong>Sí es fuente:</strong> Junto con Ley, Jurisprudencia y Doctrina</li><li><strong>Pero subordinada:</strong> Solo tiene validez cuando <strong>no contradice la ley</strong></li><li><strong>Rol subsidiario:</strong> Se aplica cuando no hay ley que regulate el caso</li><li><strong>Requisitos:</strong> Debe ser práctica uniforme, constante, reconocida por la comunidad</li></ul><p><strong>Jerarquía:</strong> Ley > Costumbre</p><p>Ejemplo:</p><ul><li>Si hay ley que prohíbe algo, la costumbre contraria NO tiene validez</li><li>Si NO hay ley sobre un tema, la costumbre puede ser fuente</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-15",
    "unit": 0,
    "kind": "mc",
    "tema": "Selección Múltiple — Presupuestos Responsabilidad Civil",
    "enunciado": "<p>¿Cuáles de los siguientes son presupuestos necesarios para que exista <strong>responsabilidad civil extracontractual</strong>? (Marca todas las correctas)</p>",
    "opts": [
      "Daño",
      "Intención dolosa obligatoria",
      "Relación de causalidad",
      "Factor de atribución",
      "Antijuridicidad"
    ],
    "respuesta": "<p>La opción B queda excluida. Los cinco presupuestos son:</p><p>✅ <strong>a) Daño:</strong> Lesión de derecho o interés jurídicamente protegido</p><p>✅ <strong>c) Relación de causalidad:</strong> Nexo entre acto y daño (fue la causa)</p><p>✅ <strong>d) Factor de atribución:</strong> Fundamento para atribuir responsabilidad (culpa, dolo, responsabilidad objetiva)</p><p>✅ <strong>e) Antijuridicidad:</strong> El acto viola una norma jurídica (es ilícito)</p><p>❌ <strong>b) Intención dolosa obligatoria:</strong> FALSO. La responsabilidad civil existe incluso por culpa leve. No requiere dolo obligatoriamente. Es uno de los errores más comunes.</p><p><strong>Los cinco presupuestos son esenciales.</strong> Sin uno, no hay responsabilidad civil.</p>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-16",
    "unit": 0,
    "kind": "desarrollo",
    "tema": "Common Law vs Derecho Codificado",
    "enunciado": "<p>Compara el sistema de Common Law con el de Derecho Codificado. ¿Cuál utiliza Argentina y por qué es importante para interpretar las leyes?</p>",
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  },
  {
    "id": "p1-0-17",
    "unit": 0,
    "kind": "caso",
    "tema": "Empleado Accidente Laboral",
    "enunciado": "<p>Una empresa tiene un empleado que comete un accidente de tránsito manejando un vehículo de la empresa. El tercero afectado demanda a la empresa. Analiza desde responsabilidad civil:</p>",
    "opts": [
      "¿Puede la empresa ser responsable por acto del empleado?",
      "¿Qué tipo de responsabilidad sería: directa o indirecta?",
      "¿Hay alguna ley que la ampare en esta situación?"
    ],
    "respuesta": "<p>La responsabilidad indirecta del empleador se analiza así:</p><p><strong>a) ¿Puede empresa ser responsable?</strong> ✅ Sí.</p><p>Requisitos:</p><ul><li>El empleado actuaba en el ejercicio de sus funciones</li><li>En horario laboral o usando recursos de la empresa</li><li>Causó daño a tercero</li></ul><p>En el caso planteado: el empleado manejaba un vehículo de la empresa (en ejercicio de función) → la empresa puede ser responsable ante el tercero afectado.</p><p><strong>b) Tipo de responsabilidad:</strong> ✅ <strong>Indirecta</strong></p><ul><li><strong>Responsabilidad indirecta del empleador:</strong> El empleador responde por daños causados por empleados bajo su dependencia</li><li>Es \"indirecta\" porque el responsable es el tercero (empleador), aunque el que causó daño fue otra persona (empleado)</li><li>El empleado es \"responsable directo\"; el empleador es \"responsable indirecto\"</li></ul><p><strong>c) Base legal:</strong> ✅ Art. 1753 Código Civil (ahora art. 1765 CCyCN)</p><p>\"El que está obligado a reparar el daño causado por sus dependientes, es responsable de los daños y perjuicios que causen éstos ejecutando las funciones a que están empleados.\"</p><p>Requisitos:</p><ul><li>Relación de dependencia (empleador-empleado)</li><li>Ejercicio de funciones</li><li>Culpa o negligencia del dependiente</li><li>Daño a tercero</li></ul><p>La empresa puede eximirse si prueba:</p><ul><li>Que ejerció supervisión adecuada</li><li>Que no hay negligencia del empleador</li></ul>",
    "correccion": "✅ CORRECTA"
  },
  {
    "id": "p1-0-18",
    "unit": 0,
    "kind": "vf",
    "tema": "Jerarquía Tratados vs Leyes",
    "enunciado": "<p>En Argentina, los tratados internacionales tienen menor jerarquía que las leyes nacionales dictadas por el Congreso.</p>",
    "respuesta": "",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-0-19",
    "unit": 0,
    "kind": "mc",
    "tema": "Art. 75 Inc. 22 CN",
    "enunciado": "<p>¿A qué se refiere el art. 75 inciso 22 de la Constitución Nacional?</p>",
    "opts": [
      "Facultad del Congreso de crear tribunales",
      "Jerarquía constitucional de tratados de derechos humanos",
      "Poder del Senado para ratificar leyes",
      "Autonomía de las provincias",
      "Atribuciones del Poder Ejecutivo"
    ],
    "respuesta": "",
    "correccion": "❌ INCORRECTA"
  },
  {
    "id": "p1-0-20",
    "unit": 0,
    "kind": "desarrollo",
    "tema": "Fuentes del Derecho (Orden y Ejemplo)",
    "enunciado": "<p>Explica cómo funcionan las <strong>fuentes del derecho</strong> en Argentina. Ordénalas jerárquicamente y explica un ejemplo práctico donde una ley deroga una costumbre anterior.</p>",
    "respuesta": "",
    "correccion": "⚠️ PARCIALMENTE CORRECTA"
  }
];

export const CONCEPTS_1ER: UnitConcepts[] = [
  {
    "unit": 1,
    "name": "Introduccion al Derecho",
    "concepts": [
      {
        "term": "Derecho",
        "def": "Conjunto de normas de conducta <strong>obligatorias</strong>, impuestas por el Estado y orientadas a la justicia (def. Borda). Ciencia del <strong>deber ser</strong> (no del ser como la ingenieria)."
      },
      {
        "term": "Norma juridica",
        "def": "Regla de conducta con caracter obligatorio. Debe tener <strong>validez</strong> (creada conforme al procedimiento) y <strong>vigencia</strong> (se aplica actualmente). Una ley derogada es valida pero no vigente."
      },
      {
        "term": "Piramide de Kelsen",
        "def": "CN › Tratados con jerarquia constitucional › Tratados sin jerarquia › Leyes › Decretos › Reglamentos › Contratos."
      },
      {
        "term": "Fuentes del derecho",
        "def": "Ley (primaria), Costumbre (subsidiaria: solo si no contradice la ley), Jurisprudencia (orientativa), Doctrina (auxiliar). <strong>Orden: Ley › Costumbre › Jurisprudencia › Doctrina.</strong>"
      },
      {
        "term": "Interpretacion de la ley",
        "def": "Metodos: literal (texto), logico (intencion), historico (antecedentes), analogico (caso similar). La <strong>analogia</strong> llena lagunas del derecho: si no hay ley para el caso, se aplica la norma del caso mas similar."
      },
      {
        "term": "Derecho publico vs privado",
        "def": "Publico: relaciones con el Estado (constitucional, penal, administrativo). Privado: entre particulares (civil, comercial)."
      },
      {
        "term": "Common Law vs Codificado",
        "def": "Common Law (EE.UU./UK): precedentes <strong>vinculantes</strong>, stare decisis. Codificado (Argentina): codigos escritos, precedentes <strong>orientativos</strong> solo."
      },
      {
        "term": "Derecho Natural vs Positivo",
        "def": "Natural: principios universales e inmutables anteriores al Estado. Positivo: normas vigentes dictadas por el Estado."
      }
    ],
    "errores": ""
  },
  {
    "unit": 2,
    "name": "Organizacion del Estado",
    "concepts": [
      {
        "term": "Constitucion Nacional",
        "def": "Ley suprema. Ultima reforma: <strong>1994</strong>. Sistema representativo, republicano y federal (art. 1 CN). Supremacia constitucional: ninguna norma puede contradecirla."
      },
      {
        "term": "Art. 75 inc. 22 CN",
        "def": "<em class=\"warn\">CRITICO.</em> Otorga <strong>jerarquia constitucional</strong> a tratados de DD.HH.: Pacto San Jose de Costa Rica, Pacto de Derechos Civiles y Politicos, CEDAW, CAT, CDPD, entre otros. Desde 1994 son iguales a la CN, superiores a las leyes ordinarias."
      },
      {
        "term": "Division de poderes",
        "def": "PE: ejecuta leyes y administra el Estado. PL (Congreso bicameral): sanciona leyes, aprueba presupuesto, ratifica tratados. PJ: administra justicia, controla constitucionalidad de normas."
      },
      {
        "term": "Mandatos",
        "def": "Presidente: 4 anos (reeleccion: solo 1 vez consecutiva). Senadores: 6 anos (se renuevan 1/3 cada 2 anos). Diputados: 4 anos (se renuevan la mitad cada 2 anos). Vicepresidente: preside el Senado, vota en caso de empate."
      },
      {
        "term": "Derechos y Garantias",
        "def": "Derechos = facultades reconocidas (propiedad, libertad). Garantias = mecanismos de proteccion: <strong>Habeas corpus</strong> (libertad fisica), <strong>Amparo</strong> (derechos constitucionales), <strong>Habeas data</strong> (datos personales)."
      },
      {
        "term": "Federalismo",
        "def": "Facultades <strong>delegadas</strong>: solo Nacion (relaciones exteriores, defensa, aduanas). Facultades <strong>concurrentes</strong>: Nacion + Provincias (educacion, salud, obras publicas). Facultades <strong>reservadas</strong>: solo Provincias (policia local, justicia local)."
      },
      {
        "term": "Control de constitucionalidad",
        "def": "El PJ puede declarar inconstitucional una ley o acto que viole la CN. Recurso extraordinario ante la Corte Suprema."
      },
      {
        "term": "Tratados internacionales",
        "def": "Con jerarquia constitucional (art. 75 inc. 22) = iguales a CN. Sin jerarquia: igual nivel que leyes. Antes de 1994 todos eran inferiores a leyes."
      }
    ],
    "errores": "<em class=\"err\">Errores cometidos:</em> Tratados = menor jerarquia que leyes (FALSO desde 1994). Art. 75 inc. 22 respondido como autonomia de provincias (FALSO, es jerarquia de tratados de DD.HH.)."
  },
  {
    "unit": 3,
    "name": "Derecho Civil",
    "concepts": [
      {
        "term": "Persona humana",
        "def": "Todo ser humano es persona desde el <strong>nacimiento con vida</strong>. Si nace sin vida, se considera que nunca existio."
      },
      {
        "term": "Persona juridica",
        "def": "Ente al que el ordenamiento le reconoce aptitud para adquirir derechos: publica (Estado, Iglesia Catolica) o privada (SA, SRL, asociaciones, fundaciones)."
      },
      {
        "term": "Capacidad de derecho",
        "def": "Aptitud para <strong>ser titular</strong> de derechos y obligaciones (art. 22 CCyCN). Nace con el nacimiento. No puede ser privada absolutamente."
      },
      {
        "term": "Capacidad de ejercicio",
        "def": "Aptitud para <strong>ejercer por si mismo</strong> esos derechos (art. 23 CCyCN). Se adquiere a los <strong>18 anos</strong>. Los menores actuan por representantes."
      },
      {
        "term": "Patrimonio",
        "def": "Conjunto de bienes y deudas de una persona. Es la garantia comun de los acreedores. Toda persona tiene un unico patrimonio (indivisible, inalienable)."
      },
      {
        "term": "Obligacion",
        "def": "Vinculo juridico acreedor-deudor. Elementos <strong>esenciales</strong>: Sujetos (acreedor y deudor), Objeto (prestacion: dar, hacer, no hacer), Causa. Elementos accidentales: plazo, lugar, modo."
      },
      {
        "term": "Extincion de obligaciones",
        "def": "Pago (principal modo), novacion, compensacion, confusion, remision, imposibilidad de cumplimiento, prescripcion."
      },
      {
        "term": "Plazo vs Condicion",
        "def": "<em class=\"warn\">TRAMPA FRECUENTE.</em> Plazo = hecho futuro <strong>cierto</strong> (ocurrira). Condicion = hecho futuro <strong>incierto</strong> (puede no ocurrir). Ej: plazo = “en 30 dias”; condicion = “si llueve manana”."
      },
      {
        "term": "Contrato",
        "def": "Acto juridico bilateral que crea, modifica o extingue relaciones juridicas patrimoniales. Elementos: consentimiento, objeto licito, causa, forma. Rescision (acuerdo mutuo) vs Resolucion (incumplimiento) vs Revocacion (voluntad unilateral)."
      },
      {
        "term": "Dolo vs Culpa",
        "def": "Dolo = intencion de danar. Culpa = negligencia, imprudencia o impericia sin intencion. Ambos generan responsabilidad civil."
      },
      {
        "term": "Responsabilidad civil",
        "def": "Funciones: Preventiva (evitar), Punitiva (sancionar con dano punitivo), Resarcitoria (reparar). Presupuestos: <strong>Autoria, Antijuridicidad, Factor de atribucion, Dano, Relacion de causalidad.</strong> La intencion dolosa NO es presupuesto obligatorio."
      },
      {
        "term": "Dano resarcible",
        "def": "Debe ser cierto, personal, subsistente. Rubros: <strong>Dano emergente</strong> (perdida efectiva sufrida), <strong>Lucro cesante</strong> (ganancia frustrada), <strong>Dano moral</strong> (afectacion espiritual). La responsabilidad civil es subsidiaria, resarcitoria y <strong>preventiva</strong>."
      },
      {
        "term": "Resp. indirecta",
        "def": "El principal responde por los danos causados por sus dependientes en ejercicio de sus funciones (art. 1765 CCyCN). Ej: empleador por empleado."
      }
    ],
    "errores": ""
  },
  {
    "unit": 4,
    "name": "Derecho Comercial",
    "concepts": [
      {
        "term": "Fondo de comercio",
        "def": "Conjunto <strong>estatico</strong> de elementos de un negocio: clientela, nombre comercial, marcas, patentes, inventario, instalaciones. <strong>No incluye el inmueble.</strong> Regulado por <em class=\"warn\">Ley 11.867.</em>"
      },
      {
        "term": "Empresa vs Fondo",
        "def": "Empresa = concepto <strong>dinamico</strong> (la actividad economica organizada). Fondo = concepto <strong>estatico</strong> (los bienes)."
      },
      {
        "term": "Transferencia fondo (Ley 11.867)",
        "def": "Requiere publicacion de <strong>edictos</strong> para proteger acreedores. Sin edictos, el comprador igual responde ante acreedores del vendedor hasta el valor del fondo."
      },
      {
        "term": "Titulos de credito",
        "def": "Cheque (Ley 24.452), Letra de cambio, Pagare (Dec. 5965/63), Obligaciones negociables (Ley 23.576). Son literales, autonomos y cartulares."
      },
      {
        "term": "Cheque",
        "def": "No a la orden = <strong>intransferible</strong>, solo cobra el destinatario. Cruzado = <strong>solo deposito bancario</strong> (rayas diagonales en angulo superior izquierdo). Posdatado = no se cobra antes de la fecha indicada."
      },
      {
        "term": "Pagare",
        "def": "Promesa incondicional de pago firmada por el deudor. A diferencia del cheque, no requiere cuenta bancaria."
      },
      {
        "term": "Seguro (Ley 17.418)",
        "def": "Contrato <strong>bilateral</strong> (obligaciones para ambas partes), <strong>aleatorio</strong> (resultado incierto), requiere pago de <strong>prima</strong>. Denuncia de siniestro: <strong>72 horas</strong>. Falta de pago de prima no produce caducidad inmediata automatica."
      },
      {
        "term": "Cesacion de pagos",
        "def": "Estado de impotencia patrimonial para cumplir obligaciones. Habilita concurso o quiebra."
      },
      {
        "term": "Concurso preventivo vs Quiebra",
        "def": "Concurso = <strong>reorganizacion</strong>: acuerdo con acreedores, empresa continua. Quiebra = <strong>liquidacion</strong>: venta de bienes, empresa cesa. La quiebra puede ser voluntaria o forzada."
      }
    ],
    "errores": "<em class=\"err\">Errores cometidos:</em> Ley 11.867 confundida con Ley 14.486 (MEMORIZAR: <strong>11.867 = Fondo de Comercio</strong>). Cheque cruzado no respondido. Seguro: faltaron “bilateral” y “aleatorio”."
  },
  {
    "unit": 5,
    "name": "Propiedad Intelectual",
    "concepts": [
      {
        "term": "Marco constitucional",
        "def": "Art. 17 CN: “Todo autor o inventor es propietario exclusivo de su obra, invento o descubrimiento por el termino que le acuerde la ley.” Jerarquia: CN › Tratados (OMPI, ADPIC/TRIPS, Convenio de Paris) › Leyes especiales (11.723, 24.481, 22.362)."
      },
      {
        "term": "Patentes (Ley 24.481)",
        "def": "Duracion: <em class=\"warn\">20 anos improrrogables</em>. Requisitos: <strong>Novedad</strong> (no en estado de la tecnica), <strong>Actividad inventiva</strong> (no obvia para expertos), <strong>Aplicacion industrial</strong> (fabricable/usable en industria). Organismo: <strong>INPI</strong>."
      },
      {
        "term": "Estado de la tecnica",
        "def": "Todo conocimiento publico anterior a la solicitud (patentes previas, papers, publicaciones, usos publicos). Si la invencion ya esta en el estado de la tecnica, NO es patentable."
      },
      {
        "term": "Licencia obligatoria",
        "def": "El Estado puede obligar al titular de una patente a licenciarla a terceros por razones de interes publico (ej: medicamentos esenciales). El titular conserva la propiedad pero pierde exclusividad."
      },
      {
        "term": "Derecho de autor (Ley 11.723)",
        "def": "Duracion: <em class=\"warn\">vida del autor + 70 anos</em>. Protege la <strong>EXPRESION</strong> de las ideas, NO las ideas en si. El software es protegido como <strong>obra literaria</strong> desde 1992. Organismo: <strong>DNRPA</strong> (Direccion Nacional del Derecho de Autor)."
      },
      {
        "term": "Software en relacion de dependencia",
        "def": "Si el empleado crea software en horario laboral con recursos de la empresa, los <strong>derechos patrimoniales</strong> pertenecen a la empresa. El empleado retiene derechos morales (paternidad)."
      },
      {
        "term": "Marcas (Ley 22.362)",
        "def": "Duracion: 10 anos, <strong>renovable indefinidamente</strong>. Tipos: producto, servicio, colectivas, garantia, tridimensionales. Organismo: <strong>INPI</strong>. Principio de especialidad: la proteccion es por clase de producto/servicio."
      },
      {
        "term": "Marca notoria",
        "def": "Goza de proteccion especial por su amplio reconocimiento publico, incluso en clases o paises donde no esta registrada. Ej: Coca-Cola, Apple."
      },
      {
        "term": "Disenos industriales",
        "def": "Formas ornamentales nuevas. Duracion: 5 anos, renovable hasta 15. Protege la <strong>apariencia</strong>, no la funcion (eso es patente)."
      },
      {
        "term": "Sistema internacional",
        "def": "Convenio de Paris: prioridad entre paises miembros. ADPIC/TRIPS: estandares minimos de PI en la OMC. OMPI: organismo internacional. Sistema de Madrid: registro de marcas en multiples paises con una sola solicitud."
      },
      {
        "term": "Por que plazo limitado",
        "def": "Equilibrio entre incentivo privado (monopolio temporal = recuperar inversion) e interes publico (dominio publico al vencer = libre uso del conocimiento)."
      }
    ],
    "errores": "<em class=\"err\">Errores cometidos:</em> Patentes = 15 anos (FALSO: <strong>20 anos</strong>). Derecho de autor protege ideas (FALSO: protege la <strong>expresion</strong>). Omitio “aplicacion industrial” como requisito. Software protegido por confidencialidad (FALSO: por <strong>derecho de autor</strong>)."
  }
];

export const ERRORES_1ER: string[] = [
  "<em class=\"err\">1. Art. 75 inc. 22 CN [PREGUNTA SEGURA]:</em> Jerarquia constitucional a tratados de DD.HH. desde la reforma de 1994. Son iguales a la CN y superiores a leyes ordinarias.",
  "<em class=\"err\">2. Orden de fuentes [INVERTIDO EN SESION]:</em> Ley › Costumbre › Jurisprudencia › Doctrina. La costumbre solo aplica si no hay ley.",
  "<em class=\"err\">3. Jerarquia de tratados:</em> Desde 1994: Tratados DD.HH. = CN › Leyes. Antes de 1994 eran menores a las leyes.",
  "<em class=\"err\">4. Duraciones PI:</em> Patentes <strong>20 anos</strong>. Autor <strong>vida + 70 anos</strong>. Marcas <strong>10 anos renovable</strong>. Disenos <strong>5 a 15 anos</strong>.",
  "<em class=\"err\">5. Ley 11.867:</em> Fondo de Comercio (NO 14.486)."
];

export const CHECKLIST_1ER: string[] = [
  "Art. 75 inc. 22 = jerarquia DD.HH.",
  "Patentes = 20 anos improrrogables",
  "Autor = vida + 70 anos (Ley 11.723)",
  "Ley 11.867 = Fondo de Comercio",
  "Plazo = cierto / Condicion = incierto",
  "Fuentes: Ley › Costumbre › Jurisprudencia",
  "Derecho de autor protege EXPRESION",
  "Requisito patente: aplicacion industrial",
  "Seguro: bilateral + aleatorio + prima",
  "Resp. civil: 5 presupuestos (NO requiere dolo)",
  "Resp. indirecta: empleador por empleado",
  "Cheque cruzado = solo deposito bancario"
];

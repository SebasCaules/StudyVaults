// Datos de "Parcial simulado" — portados verbatim desde la app de estudio de
// Inge2 (js/data/exercises.js, enunciados.js, quality-attributes.js).
//
//  • EXERCISES         — casos de práctica (sólo los campos que usa el wizard).
//  • ENUNCIADOS        — enunciados en texto plano (string[]), COPIADOS VERBATIM.
//  • QA_CATALOG        — atributos de calidad (id + name) agrupados, para el
//                        picker del paso 1.
//  • SET_LABELS        — metadatos de cada source_set para la lista agrupada.

export interface Exercise {
  id: string;
  source_set: string;
  title: string;
  domain: string;
}

export interface QaGroup {
  id: string;
  name: string;
  attrs: { id: string; name: string }[];
}

export interface SetLabel {
  num: string;
  label: string;
  desc: string;
}

/* ── Casos ──────────────────────────────────────────────────────────────── */

export const EXERCISES: Record<string, Exercise> = {
  "bibliotecas-nacionales": {
    id: "bibliotecas-nacionales",
    source_set: "parciales-6",
    title: "Bibliotecas Nacionales",
    domain:
      "Red federada de bibliotecas distribuidas en el país que deben consolidar sus catálogos locales en un sistema nacional consultable online.",
  },
  "compraventa-acciones": {
    id: "compraventa-acciones",
    source_set: "parciales-6",
    title: "Compraventa de Acciones",
    domain:
      "Mercado electrónico de acciones — matching de órdenes de compra/venta, confirmación, settlement y reporting regulatorio.",
  },
  logistica: {
    id: "logistica",
    source_set: "parciales-6",
    title: "Logística — tracking de flota propia con GPS",
    domain:
      "Empresa de logística nacional con flota propia de móviles (camiones) que necesita información posicional en tiempo real de sus cargamentos, planificación de hoja de ruta para el chofer e integración con la aduana argentina y con nómina.",
  },
  cms: {
    id: "cms",
    source_set: "parciales-6",
    title: "CMS — Content Management System",
    domain:
      "Plataforma editorial multi-canal con múltiples redactores, publicación programada y entrega a web, mobile y feeds.",
  },
  "pdv-electrodomesticos": {
    id: "pdv-electrodomesticos",
    source_set: "parciales-6",
    title: "Punto de Venta — cadena de electrodomésticos",
    domain:
      "Cadena retail con múltiples sucursales, terminales POS en cada una, integración con stock central y financiación.",
  },
  sia: {
    id: "sia",
    source_set: "parciales-6",
    title: "SIA — Sistema Integral de Atención",
    domain:
      "Sistema de atención al cliente multi-canal (teléfono, email, chat, redes sociales) con tickets, escalamiento y métricas de servicio.",
  },
  "banco-pyme": {
    id: "banco-pyme",
    source_set: "cross-challenge-3",
    title: "Banco — minitiendas PYME",
    domain:
      "Banco que lanza una línea de medios de cobro electrónico (POS, link de pago, QR) para pequeños comercios integrados con su cuenta bancaria.",
  },
  "turismo-corporativo": {
    id: "turismo-corporativo",
    source_set: "cross-challenge-3",
    title: "Turismo corporativo",
    domain:
      "Plataforma de gestión de viajes corporativos: solicitudes de empleados, flujos de aprobación, booking con múltiples proveedores y facturación corporativa.",
  },
  "seguros-autos": {
    id: "seguros-autos",
    source_set: "cross-challenge-3",
    title: "Seguros de autos",
    domain:
      "Gestión integral de seguros automotor: cotización, emisión de pólizas, endosos, gestión de siniestros, peritajes y pagos de indemnizaciones.",
  },
  "control-fabrica-2013": {
    id: "control-fabrica-2013",
    source_set: "2013",
    title: "Control de fábrica con sensores serie (parcial 2013)",
    domain:
      "Sistema industrial que instrumenta una planta con sensores conectados por puerto serie (RS-232/485), agregando, presentando y archivando mediciones con detección temprana de anomalías.",
  },
  "tp-general-cuentas": {
    id: "tp-general-cuentas",
    source_set: "tp-general",
    title: "TP general — Sistema Admin Cuentas + satélites",
    domain:
      "Sistema principal de Administración de Cuentas para una empresa de logística más cuatro sistemas satélite que se integran con él (Cartilla Online, Red de Compensación Bancaria, Sistema Tintométrico, Gestor de Documentos P2P).",
  },
  "ecommerce-add-clase": {
    id: "ecommerce-add-clase",
    source_set: "clase",
    title: "ADD aplicado a e-commerce (ejercicio en clase)",
    domain:
      "Plataforma de e-commerce multi-canal con sitio web, tablets en puntos físicos, back office de depósito/envío y procesadores de pago externos.",
  },
};

/* ── Metadatos de cada banco/source_set ─────────────────────────────────── */

export const SET_LABELS: Record<string, SetLabel> = {
  "parciales-6": {
    num: "§ I",
    label: "Banco de parciales",
    desc: "Casos clásicos de exámenes recientes.",
  },
  "cross-challenge-3": {
    num: "§ II",
    label: "Cross challenge",
    desc: "Casos para comparar soluciones entre equipos.",
  },
  "2013": {
    num: "§ III",
    label: "Parcial 2013",
    desc: "Control de fábrica — el caso canónico.",
  },
  "tp-general": {
    num: "§ IV",
    label: "Trabajo Práctico",
    desc: "Sistema integral con satélites coordinados.",
  },
  clase: {
    num: "§ V",
    label: "Ejercicios de clase",
    desc: "Trabajados en pizarra durante la cursada.",
  },
};

/* ── Enunciados en texto plano (VERBATIM) ───────────────────────────────── */

export const ENUNCIADOS: Record<string, string[]> = {
  "bibliotecas-nacionales": [
    "Se ha abierto una licitación para un sistema de catálogo para bibliotecas nacionales. El objetivo principal de este sistema es que todo usuario pueda realizar búsquedas de libros, en la biblioteca y desde sus casas. Este nuevo sistema será el punto obligado de entrada de toda búsqueda y reserva de libros, y como tal, la caída del sistema obliga a la biblioteca a cerrar por el día. Téngase en cuenta que el sistema debe adecuarse al mínimo denominador tecnológico posible (no se puede hacer una inversión tecnológica grande), pero soportar el mayor espectro posible de sistemas cliente y usuarios.",
    "El sistema debe permitir buscar libros rápidamente, otorgando un listado en pocos segundos. La búsqueda debe permitir no sólo títulos, sino autores, ISBN, texto de la sinopsis y número de catálogo. Si el libro no se encuentra en la biblioteca, debe sugerir otra biblioteca donde sí se encuentre en catálogo en ese momento. De existir el libro en catálogo, el sistema debe permitir el préstamo o la reserva según corresponda. Las búsquedas las pueden hacer todos los usuarios, las reservas sólo son permitidas en persona, y realizadas por un bibliotecario.",
    "Adicional a los libros, el sistema debe poder comunicarse con otras fuentes de datos, de diarios y revistas internacionales de divulgación, así como de otras bases de datos internacionales que puedan ir surgiendo en base a acuerdos. No se conocen en este momento las APIs de cada sistema, sólo que son en tiempo real. En un corto plazo, se quiere habilitar una API propia, para que bibliotecas extranjeras puedan comunicarse con el catálogo nacional, y debe ser contemplado.",
    "Los bibliotecarios deben poseer una interfaz de carga de datos, así como la posibilidad de extraer reportes de libros consultados. Estos reportes deben permitir cruzar datos de todas las bibliotecas alcanzadas por el sistema.",
  ],
  "compraventa-acciones": [
    "La empresa Inversiones SA nos contacta para la elaboración de un sistema online para la compraventa de acciones.",
    "El sistema debe cubrir la operatoria por parte del usuario final, esto es, los clientes de Inversiones SA usarán el sistema para revisar los precios de las acciones en la bolsa y efectuar compras y ventas. El sistema debe poder utilizarse desde internet en todo el mundo.",
    "El sistema mantendrá una conexión con la bolsa de comercio utilizando dos APIs, la primera para que la bolsa informe al sistema en tiempo real las cotizaciones, y la segunda para informar a la bolsa las operaciones de compra y venta. Esta API se utiliza a través de una VPN interna.",
    "El sistema sólo puede comprar y vender. Una compra consiste en el usuario que elige un activo en el mercado, una cantidad, y un precio. El sistema debe validar la existencia de saldo, realizar la operatoria, e informar del resultado. El caso de la venta, el usuario debe realizar un activo propio, una cantidad, y un precio de venta. El sistema valida y realiza la operación. Para este caso se suponen las operatorias inmediatas.",
    'El usuario final debe ver en todo momento el valor actual de los activos existentes para tomar decisiones, y puede setear alarmas "avisar cuando X suba/baje de $ X". Las alarmas el sistema las notifica por email.',
    'El usuario final puede, como item avanzado, agendar una operación "condicional", que puede ser o bien comprar cuando el activo baje de un precio X o vender cuando el activo supere un precio Y. Luego de agendada, la operación se realiza "por detrás", de igual manera que si hubiese sido realizada interactivamente.',
    'La operatoria se realiza con dinero acreditado previamente, que el usuario final transfiere por fuera del sistema, y luego en el sistema se notifica su acreditación para que empleados de Inversiones SA verifiquen "offline". Las operaciones de backend de staff de Inversiones SA sólo consisten en cargar saldos, y crear nuevos usuarios en el sistema.',
    "La empresa tiene capital acotado, y todo lo que se haga para reducir los costos del sistema es bienvenido.",
  ],
  logistica: [
    "El cliente, una empresa de logística nacional, pide la construcción de un sistema que provea información posicional de sus móviles.",
    "El sistema deberá proveer, como principal función, una vista del mapa de la República Argentina y países limítrofes, con la ubicación en tiempo real de cada cargamento. Este mapa debe ser de fácil filtrado por conductor, carga, valor transportado, tiempo a destino y condiciones del contrato. Cada móvil se verá como un punto en el mapa, que cambia de color según el estado.",
    "La ubicación de cada carga se obtiene de un GPS ubicado en el container, en el momento de despacho. Este GPS se contrata a otra empresa, que provee un servicio JSON a través del cual se puede pedir el estado y ubicación de un móvil, dado un ID. Este ID es ingresado al sistema por el operario que autoriza la salida del camión en cada almacén, previo chequeo de la carga.",
    "La información original de cada móvil deberá provenir del sistema interno de ventas, que almacena el contrato, y del sistema de la aduana argentina, que provee la información de cargas ingresadas al país. Se sabe que ambos sistemas cuentan con algún tipo de conectividad, pero no hubo tiempo de investigar a fondo.",
    "El operario del despacho también debe poder imprimir una hoja de ruta para el chofer al momento de autorizar la salida del cargamento. Esta hoja será entregada al operario de destino y en los pasos intermedios (distribuidos en todo el país), y cada operador asentará en el sistema el pasaje del móvil.",
    "El control de móviles es realizado por un equipo de operadores en simultáneo, cada cual marca una serie de móviles a seguir. De esta manera, las alarmas y más novedades, son informadas al operador adecuado. El sistema debe soportar alarmas por móvil, que sean configurables para casos diversos: móvil detenido más de X minutos, móvil fuera de ruta, etc. La empresa se compromete a este control por medio de un SLA con sus clientes y con su propia aseguradora.",
    "El gerente de operaciones debe poder obtener un reporte diario con las novedades de importancia del día anterior. El reporte lo tiene que poder abrir con el Excel.",
    "El sistema debe controlar el tiempo en movimiento de cada móvil, ya que una vez al mes deberá exportar esta información al sistema de nómina, para el pago de horas extras de cada chofer.",
  ],
  cms: [
    "Un cliente nos pide la realización de un sistema para publicación de contenidos. Será usado como base de conocimiento para su empresa, y la idea del sistema es que los usuarios finales puedan entrar a esta plataforma para buscar información. Se conocen, por ahora, varios tipos posibles de usuarios: redactores, editores, administradores, y usuarios finales.",
    'El usuario final quiere buscar información. La información debe ser relevante, precisa y ser encontrada inmediatamente por cualquier palabra del documento (no sólo el título). Una vez encontrada la información, el usuario la querrá leer, imprimir y marcar como favorita. Puede comentar en los documentos y darle un "rating". La búsqueda debe ser posible desde dispositivos variados, como ser "kiosks" en las salas de uso común de la empresa, estaciones de trabajo, o tablets de los usuarios finales.',
    'El redactor quiere crear contenido. El sistema, como plataforma, debe facilitar esta actividad mediante la provisión de herramientas de corrección, y de guardado de apuntes. Los artículos escritos pasan a un estado de "borrador", para ser aprobados a su publicación. El editor necesita poder ver los artículos en borrador, aprobarlos o pedir cambios, mediante "workflows". Todo cambio debe registrarse. El editor es quien publica. El administrador maneja el "back-office", y para ello necesita crear y borrar usuarios y proveer moderación a los comentarios.',
    "El sistema debe proveer a los distintos usuarios reportes de acuerdo a sus necesidades: esto incluye reportes uso del sistema, de rating de artículos, de tiempo promedio a publicación, etc. El sistema maneja todo el ciclo de vida de los artículos, y por lo tanto debería ser posible manejar un log de uso para que cualquier cambio sea auditable.",
    "A partir de su puesta en funcionamiento, y luego de un proyecto de migración, el sistema será la única fuente de datos para todos los procesos de la empresa, volviendo obsoleta la documentación en papel, y a múltiples sistemas existentes. Por lo tanto, entre otras cosas, se espera que exista resistencia al cambio en los usuarios.",
    "El sistema debe ser cubierto con un presupuesto razonable, sin gastos superfluos de infraestructura o desarrollo, ya que debe quedar dinero para la migración y entrenamiento.",
  ],
  "pdv-electrodomesticos": [
    "El cliente, una empresa de ventas de electrodomésticos minorista a nivel nacional, nos pide un sistema de gestión y control de ventas. El sistema debe guardar todas las ventas realizadas por los vendedores, en cada una de las sucursales. El número de sucursales es ya cercano a los cientos, y está en rápida expansión. El próximo paso es la expansión internacional, y el sistema debe estar preparado.",
    "Se pide el manejo de promociones, cupones, tarjetas de afinidad, y diferentes esquemas de precio. Estos esquemas podrán depender de la sucursal, el cliente, el medio de pago, etc.",
    "Como interfaz, el sistema debe poder recibir y enviar a depósito los cambios en stock en tiempo real. Del mismo modo, se desea poder tomar compras realizadas a partir del sitio de e-commerce que la empresa ya ha desarrollado anteriormente. Ante una compra exitosa, el sistema debe disparar el pedido al depósito, los procesos de embalaje, y envío ya sea a la zona de retiro por parte del cliente, o mismo a la casa del cliente si éste así lo solicitase.",
    "Se espera que la gerencia pueda tomar reportes desde el sistema, particularmente de los resultados de ventas en tiempo real. Estos reportes deberán poder exportarse a Excel, y estar disponibles como un dashboard visible en todo momento en monitores de la casa matriz.",
    "Los productos deben poder buscarse rápidamente, considerando que un cliente no puede pasar más de 5 segundos promedio para obtener la respuesta de un agente de ventas respecto de la disponibilidad y ubicación de un producto. Además se provee a los agentes de ventas con una interfaz en tablet para responder dudas sin acudir a un punto de caja.",
    "El sistema debe tolerar el mayor pico anual que sucede los días anteriores al día de la madre.",
    "El procesamiento de pagos se hará mediante servicios de terceros. Sin embargo, se espera tener múltiples proveedores y poder switchear cual usar según diversos criterios:\n1. Poder cursar ciertos medios de pago por uno u otro según costos de procesamiento.\n2. Poder hacer fallback cuando un procesador da error.\n3. Poder reintentar pagos por otro proveedor cuando un pago es rechazado.",
  ],
  sia: [
    "Una empresa de telecomunicaciones desea mejorar significativamente la atención al público a través de sus canales: call center, web y chatbot. Para lo cual nos ha encargado el desarrollo de un sistema integral de atención (SIA).",
    "Los procesos que debe cubrir el SIA son: administración de clientes (altas, bajas, modificaciones), consultas de facturación y pago, consultas de consumos, altas y bajas de servicios (incluyendo la instalación del servicio en casa del cliente), consulta de deuda y pago online/telefónico, reclamos técnicos (problemas con algún servicio de un cliente), ventas de nuevos servicios a un cliente. En el caso de recibir un reclamo, se debe proveer una funcionalidad de seguimiento del mismo, con notificación al cliente durante las diversas etapas.",
    "El SIA debe estar operativo 24x7, y mantener un tiempo de respuesta adecuado, aún en momentos pico tales como problemas generales con algún servicio o problemas en la facturación.",
    "Para brindar su funcionalidad, el SIA deberá interactuar con todos los sistemas de la compañía: sistema de clientes, sistema de ventas, sistema de facturación, sistema de recaudación, sistemas técnicos (uno para cada producto), sistemas de servicio técnico. Dado que la compañía tiene una estrategia de adquisición de nuevas compañías de telecomunicaciones, se espera que haya nuevos sistemas (no conocidos a la fecha) que haya que integrar en el futuro.",
    'Los agentes del call center deben tener pantallas que integren toda la información del cliente y que permitan responder con rapidez las consultas, sin necesidad de poner al cliente "en espera".',
    "Los chatbots, así como el call center y la web, elaboran sus respuestas en función de las APIs y datos de los sistemas de la compañía.",
    "Para fines de marketing, se desean consultar las interacciones con los clientes, mediante reportes diarios, pero también con la posibilidad de que analistas de marketing elaboren consultas ad hoc.",
    "La cantidad estimada de clientes de la compañía es aproximadamente 5M, y crecerá con las adquisiciones futuras; sus servicios incluyen telefonía básica, internet, televisión por cable y conectividad empresarial para PYMEs.",
  ],
  "control-fabrica-2013": [
    "Se requiere realizar un sistema de control en una fábrica. Para esto se tomarán datos de sensores distribuidos por la planta por medio de una interfaz serie, que tiene una velocidad de transferencia bastante limitada. La comunicación con los sensores es por medio de polling: ante un pedido del sistema, el sensor retorna el valor actualmente sensado. Dado que se utiliza una interfaz serie, sólo se puede hablar con un sensor por vez.",
    "Las métricas que importa controlar dentro de la fábrica, no siempre son directamente las censadas, sino que estos valores deben ser procesados de diversas formas (integrados en el tiempo, combinados con otras métricas, etc.). Por ejemplo, interesa medir volumen de agua que pasa por un caño (metros cúbicos), pero el sensor utilizado es un caudalímetro (metros cúbicos por segundo); o interesa medir el consumo eléctrico (Watts), y para ello se cuenta con voltímetros y amperímetros. Estos cómputos no siempre son sencillos.",
    "Dado que el sistema es de control, es fundamental que la frecuencia de sensado sea lo más alta posible, de modo de poder disparar alertas cuando algún parámetro está fuera del rango aceptable. Adicionalmente interesa almacenar esta información para poder generar reportes de tendencia. Estos reportes obviamente no precisan la información en tiempo real, sino que la necesitan agregada, de forma de minimizar los puntos a ser utilizados en los reportes y así permitir consultas más veloces. Siendo así, alcanza con un punto por hora por métrica.",
    "No todos los reportes son accesibles a todos los usuarios, debiéndose implementar un ACL.",
    "El sistema deberá funcionar en la fábrica por varios años. Los sensores, como dispositivos físicos que son, se romperán y deberán ser cambiados con el transcurso del tiempo. Como es natural en el mundo del hardware, las marcas, modelos y prestaciones de los sensores que se usarán en el futuro muy posiblemente sean distintos (mayor resolución, menor error de sensado, etc.).",
    "Analizar:\n  a. Necesidad del cliente (en menos de 40 palabras).\n  b. Punteo de funcionalidades de alto nivel (al menos 5 items).\n  c. Atributos de calidad prioritarios en un árbol de utilidad (los primeros 2 niveles).\nDefinir:\n  d. Una arquitectura candidata y justificarla (texto, gráficos, lo que sea necesario).\n  e. Indicar cómo se resuelven los atributos de calidad del punto (1.c).\n  f. Indicar riesgos/no riesgos, supuestos y tradeoffs tomados.",
  ],
  "banco-pyme": [
    "Un banco desea dar un servicio a sus cuentas PYME para que puedan crear sus propios sites de venta de sus productos. Las cuentas PYME podrán montar minitiendas virtuales, y usar los servicios de pago del banco para que sus clientes paguen las compras. A tal efecto, debemos proveer un software para armar minitiendas virtuales.",
    "El software debe ser fácilmente configurable, sin necesidad de programación. Debe estar disponible 24x7, y con un tiempo de respuesta aceptable para una transacción de compra. Debe soportar hasta 100.000 tiendas virtuales, se estima que cada tienda virtual tiene un promedio de 500 productos a la venta, y realiza unas 100 transacciones diarias, con fuertes picos por estacionalidad.",
    "Las cuentas PYME pueden configurar y administrar su minitienda virtual, con diversos templates de estilos prefabricados que pueden customizarse en forma limitada en cuanto a colores, fonts y gráficos.",
    "Las cuentas PYME tienen un perfil administrador a tal fin, para mantener los productos en el catálogo, para administrar los clientes registrados y para obtener un conjunto de reportes analíticos predefinidos, que permiten conocer los clientes registrados, las transacciones realizadas, los productos vendidos por período de tiempo, etc.",
    "Se debe brindar la funcionalidad básica de registración de usuario mediante email.",
    "Los clientes pueden visitar cada mini tienda, viendo los productos y seleccionando los que van a comprar en un carrito. Una vez seleccionados los productos pueden seleccionar el método de envío y pagarlos. Para pagar los productos deben estar registrados y logearse.",
    "Las minitiendas usan servicios de pago del banco (debito en cuenta o tarjeta de crédito) y de logística de terceros (correos, etc.).",
    "Para administrar este sistema, se debe brindar funcionalidad de administrador al banco. Este administrador del banco puede consultar las minitiendas virtuales establecidas y las transacciones de las cuentas PYMEs que las establecieron, pero no puede acceder a los datos de las mismas dado que son confidenciales de cada minitienda.",
  ],
  "turismo-corporativo": [
    "Una compañía de turismo desea ofrecer un servicio de viajes de negocio para empresas, ofreciendo tarifas especiales y la posibilidad de emitir facturas A y B. Para esto, cada empresa debe registrarse con su CUIT y generar así un portal propio (customizando paleta de colores, logos, etc.).",
    "El portal ofrece hoteles y vuelos, que se recuperan de integración con diversos canales agregadores (Sabre, Booking.com, etc.). Los mismos son varios y diversos, y a futuro podrían agregarse nuevos. El sistema debe recolectar la oferta de todos estos y unificarla, ordenarla y priorizarla. Estos servicios son múltiples y complejos; se debe evitar que esto impacte negativamente en la experiencia de usuario al realizar una búsqueda.",
    "Cada compañía debe poder establecer fácilmente reglas de política de viajes, definiendo compañías predilectas, costos máximo por noche, categorías de viajes (turista, business, primera) según el nivel jerárquico del empleado, etc.",
    "Es importante asegurar que los usuarios honren estas políticas, así como no deben poder acceder al portal quienes no son empleados de la compañía; ni hacer uso de estos precios promocionales para viajes personales.",
  ],
  "seguros-autos": [
    "El cliente, una aseguradora, nos pide un sistema integral de gestión de seguros automotor. El sistema debe cubrir todo el ciclo de vida de una póliza: cotización en línea, emisión, endosos (modificaciones a lo largo de la vida de la póliza) y la gestión de los siniestros que se produzcan.",
    "La cotización se realiza aplicando reglas actuariales precisas: el precio de la prima depende de múltiples variables (vehículo, uso, zona, perfil del asegurado, etc.). Estas reglas cambian con frecuencia y el cálculo debe ser confiable y rápido, ya que el cliente las espera en línea. A partir de la cotización aceptada se emite la póliza.",
    "Ante un siniestro, el sistema debe coordinar un workflow complejo con múltiples actores externos: denuncia del asegurado, asignación de un perito o inspector, peritaje, derivación a taller, ajuste y, finalmente, el pago de la indemnización. Cada uno de estos pasos involucra a actores distintos (peritos, talleres, bancos para los pagos) y muchos estados posibles.",
    "Toda decisión tomada por el sistema —por qué se aprobó o rechazó una cotización, por qué se liquidó un siniestro de cierta forma— debe quedar registrada y ser auditable, dado que la actividad aseguradora está fuertemente regulada por la Superintendencia de Seguros.",
    "El sistema debe integrarse con proveedores de inspecciones, talleres y peritos, así como con reaseguradoras para los riesgos cedidos. La carga es estacional, con picos marcados ante eventos masivos (granizo, fin de año). Conviven, además, productos y sistemas legacy con los nuevos productos que se quieran lanzar.",
  ],
  "tp-general-cuentas": [
    "El cliente, una empresa de logística, requiere un sistema principal de Administración de Cuentas de sus clientes: alta de cuentas, registro de operaciones (envíos, facturación), estados de cuenta y cobranzas. El sistema procesa millones de operaciones mensuales, maneja datos financieros que deben ser confiables y auditables para obligaciones contables, y debe estar disponible 24×7 porque los clientes esperan ver su cuenta en cualquier momento.",
    "Alrededor de este sistema principal conviven varios sistemas satélite que se integran con él. Cada satélite tiene su propio conjunto de drivers de arquitectura, pero se exige coherencia global del conjunto. No alcanza con diseñar el sistema principal: hay que diseñar también cómo cada satélite se integra manteniendo cohesión, contratos claros y una política de fuente de verdad.",
    "Satélite 1 — Cartilla Online: catálogo online de servicios contratables por los clientes, self-service para consultar y adquirir servicios logísticos. Prioriza usabilidad para el cliente final, carga rápida del catálogo y alta disponibilidad, tolerando consistencia eventual con el sistema principal en precios y disponibilidad.",
    "Satélite 2 — Red de Compensación Bancaria: integración con la red bancaria para la conciliación de pagos (débitos, créditos, reversas). Ningún pago puede perderse, cada movimiento debe ser rastreable (auditabilidad extrema), debe interoperar con protocolos bancarios y maneja datos financieros sensibles.",
    "Satélite 3 — Sistema Tintométrico: sistema para mezclar colores (contexto retail/industrial — pinturas, textiles) que se integra con el sistema de cuentas para la facturación y el ajuste de stock de insumos. Requiere fórmulas exactas (precisión), respuesta en tiempo real mientras el cliente espera, integración con dispositivos físicos (dispensadores) y capacidad de operar offline en puntos de venta sin conectividad.",
    "Satélite 4 — Gestor de Documentos P2P: gestión de documentos relacionados a las cuentas (contratos, remitos, facturas) con una arquitectura peer-to-peer entre nodos (sucursales, partners). Cada nodo debe seguir operando aislado (disponibilidad descentralizada), con consistencia eventual entre nodos, firma digital e integridad, y trazabilidad de quién creó, modificó o accedió a cada documento.",
    "Se debe coordinar el conjunto en tres dimensiones: los contratos de integración entre cada satélite y el principal (REST, gRPC o eventos asincrónicos; autenticación; versionado; SLA), la consistencia entre sistemas (qué tipo de consistencia es aceptable en cada integración, dónde está la fuente de verdad de cada entidad, cómo se reconcilian divergencias) y la governance arquitectónica (guardrails comunes de observabilidad, seguridad y contratos; qué se decide en forma centralizada y qué local a cada satélite; cómo se presenta al cliente final).",
  ],
  "ecommerce-add-clase": [
    "Ejercicio tipo parcial trabajado en clase aplicando Attribute Driven Design (ADD) sobre una plataforma de e-commerce con múltiples canales de entrada y procesadores de pago externos.",
    "Los canales de entrada son tres: el sitio principal de e-commerce (web), tablets ubicadas en puntos físicos, y un back office de depósito / envío. Todos confluyen en un componente de aplicación central, con una SPA (Single Page App) y un Load Balancer (LB) por delante.",
    "La plataforma se integra con dos procesadores de pago externos (Procesador Pago 1 y Procesador Pago 2 — típicamente Prisma, Mercado Pago, etc.), sistemas sobre los que el equipo no tiene control.",
    "La persistencia es una base de datos SQL OLTP con replicación primario / secundario.",
    "Consigna: a partir de los requerimientos funcionales, identificar la lista candidata de atributos de calidad y seleccionar hasta 4 como drivers de arquitectura. Construir una arquitectura candidata cuyo blueprint inicial incluya TODOS los sistemas externos (procesadores de pago, depósito, dispositivos cliente) más el mínimo de componentes internos para cumplir los requerimientos funcionales. Luego generar escenarios sobre cada atributo seleccionado e iterar la arquitectura candidata, validando que cada escenario sobreviva y re-validando los anteriores.",
  ],
};

/* ── Catálogo de atributos de calidad (para el picker del paso 1) ───────── */

export const QA_CATALOG: { groups: QaGroup[] } = {
  groups: [
    {
      id: "runtime",
      name: "Run-time qualities",
      attrs: [
        { id: "availability", name: "Availability" },
        { id: "fault-tolerance", name: "Fault Tolerance" },
        { id: "interoperability", name: "Interoperability" },
        { id: "manageability", name: "Manageability" },
        { id: "customizability", name: "Customizability" },
        { id: "performance", name: "Performance" },
        { id: "precision", name: "Precision" },
        { id: "reliability", name: "Reliability" },
        { id: "scalability", name: "Scalability" },
        { id: "auditability", name: "Auditability" },
        { id: "security", name: "Security" },
      ],
    },
    {
      id: "design",
      name: "Design qualities",
      attrs: [
        { id: "conceptual-integrity", name: "Conceptual Integrity" },
        { id: "maintainability", name: "Maintainability" },
        { id: "portability", name: "Portability" },
        { id: "reusability", name: "Reusability" },
      ],
    },
    {
      id: "system",
      name: "System qualities",
      attrs: [
        { id: "supportability", name: "Supportability" },
        { id: "testability", name: "Testability" },
      ],
    },
    {
      id: "user",
      name: "User qualities",
      attrs: [
        { id: "accessibility", name: "Accessibility" },
        { id: "usability", name: "Usability" },
      ],
    },
  ],
};

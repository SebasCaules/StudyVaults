---
title: Inge2 Wiki Log
type: log
updated: 2026-05-20
---

# Inge2 Wiki — Bitácora

Registro cronológico append-only de operaciones sobre el wiki. Cada entrada empieza con `## [YYYY-MM-DD]` para permitir `grep "^## \[" log.md | tail -N`.

Operaciones: `ingest`, `class-summary`, `exercise`, `case-study`, `query`, `lint`, `schema-update`.

---

## [2026-04-22] schema-update | Bootstrap del wiki

Creación inicial del wiki siguiendo el patrón "LLM Wiki" de Karpathy, adaptado al contexto académico de Ingeniería de Software II (ITBA, 2026-1C). Persona del agente: profesor senior de ingeniería de software; todas las respuestas deben justificar decisiones con cita a clase/wiki/bibliografía/web.

**Creadas:**
- `CLAUDE.md` — schema completo con persona, reglas, operaciones y bibliografía canónica probable.
- `wiki/index.md` — índice categorizado (vacío, a poblar con ingestas).
- `wiki/log.md` — este archivo.

**Estructura de directorios creada:**
- `raw/{classes,readings,exercises,assets}` — fuentes inmutables.
- `wiki/{classes,concepts,exercises,case-studies,sources,analyses}` — páginas del wiki.

**Próximos pasos sugeridos al usuario:**
1. Ingerir el programa/syllabus oficial de la cátedra cuando lo tengas a mano para poblar la sección "Dominio" del schema con los ejes reales del curso.
2. Ingerir el material de la primera clase que ya hayan dado.
3. Confirmar la bibliografía que la cátedra efectivamente recomienda (la del schema es una lista probable, no verificada con la cátedra).

---

## [2026-04-22] ingest | Material completo Clases 0-4 + casos + ejercicios

Ingesta masiva del material acumulado en `raw/` tras completarse las Clases 0 a 4 y publicarse la consigna del TP general y el caso Healthcare.gov.

**Fuentes ingeridas (`raw/`):**
- `classes/Clase 0 — Introducción al curso.ppt` (convertido a tabla-de-contenidos parcial — docentes, evaluación, Katas de Arquitectura).
- `classes/Clase 1.pdf` — Introducción a Arquitectura (ABC, atributos de calidad, cono de incertidumbre, SLA/SLO/SLI, MTBF/MTTR).
- `classes/Clase 2.pdf` — Construcción de la arquitectura (ADD, trade-offs, catálogo de estilos POSA).
- `classes/Clase 3.pdf` — Documentación de arquitecturas (4+1, C4, enfoque híbrido).
- `classes/Clase 4.pdf` — ¿Cuándo diseñamos? (BDUF/YAGNI/JEDUF, guardrails, platform engineering, SAAM/ATAM/Lightweight, árbol de utilidad).
- `classes/Clase V - Caso Healthcare.gov.pdf` — consigna de kata ATAM sobre Healthcare.gov.
- `classes/oei-06-14-00350.pdf` — reporte HHS OIG sobre Healthcare.gov (leídas pp 1-20 de 92 — exec summary, lessons learned, chapter 1).
- `assets/Atributos de Calidad.pdf` — tabla ISO 25000/25010 (cátedra).
- `exercises/Ejercicio 2013.pdf` — parcial clásico sistema de control fábrica con sensores serie.
- `exercises/Ingesoft 2 - Enunciados de Parciales.pdf` — 6 casos de parcial (Bibliotecas, Acciones, Logística, CMS, PDV, SIA).
- `exercises/Cross challenge.pdf` — 3 casos (Banco/PYME, Turismo, Seguros).
- `exercises/TPgeneral.pdf` — TP integrador Sistema Admin Cuentas + satélites.

**Notas:**
- `Katas Presentation.ppt` (formato Microsoft PowerPoint binario legacy): no pudo convertirse a texto con las herramientas disponibles (textutil da binario, python-pptx requiere .pptx, LibreOffice no está instalado). Pendiente: que el usuario lo convierta a `.pptx` o `.pdf`, o instalar `soffice`.

**Páginas creadas (22):**

*Clases (5):*
- `wiki/classes/clase-00-introduccion-curso.md`
- `wiki/classes/clase-01-introduccion-arquitectura.md`
- `wiki/classes/clase-02-construccion-arquitectura.md`
- `wiki/classes/clase-03-documentacion-arquitectura.md`
- `wiki/classes/clase-04-cuando-disenamos.md`

*Conceptos (16):*
- `wiki/concepts/arquitectura-software-definicion.md`
- `wiki/concepts/architecture-business-cycle.md`
- `wiki/concepts/atributos-de-calidad.md`
- `wiki/concepts/attribute-driven-design.md`
- `wiki/concepts/estilos-arquitectonicos.md`
- `wiki/concepts/modelo-4-mas-1.md`
- `wiki/concepts/c4-model.md`
- `wiki/concepts/bduf-yagni-jeduf.md`
- `wiki/concepts/emergent-vs-intentional-design.md`
- `wiki/concepts/architectural-guardrails.md`
- `wiki/concepts/platform-engineering.md`
- `wiki/concepts/saam.md`
- `wiki/concepts/atam.md`
- `wiki/concepts/lightweight-atam.md`
- `wiki/concepts/arbol-de-utilidad.md`
- `wiki/concepts/cono-de-incertidumbre.md`
- `wiki/concepts/sla-slo-sli.md`
- `wiki/concepts/mtbf-mttr.md`

*Ejercicios (4):*
- `wiki/exercises/ejercicio-2013-control-fabrica.md`
- `wiki/exercises/parciales-6-casos.md`
- `wiki/exercises/cross-challenge-3-casos.md`
- `wiki/exercises/tp-general.md`

*Casos de estudio (1):*
- `wiki/case-studies/healthcare-gov.md`

*Sources (2):*
- `wiki/sources/oei-06-14-00350-healthcare-gov.md`
- `wiki/sources/atributos-de-calidad-iso-25000.md`

**Actualizado:**
- `wiki/index.md` — poblado con todas las categorías (Clases, Conceptos de arquitectura, Conceptos de proceso, Ejercicios, Casos de estudio, Sources).

**Wikilinks pendientes (referencias a páginas aún no creadas):**
- `[[Pipes and Filters]]`, `[[Publish-Subscribe]]`, `[[Broker]]`, `[[MVC — Model View Controller]]` y otros estilos individuales — referenciados desde `estilos-arquitectonicos.md`. Crearlos a demanda cuando aparezcan como tema principal en alguna clase.
- `[[ADR — Architecture Decision Record]]` — mencionado en múltiples páginas; crear página propia cuando la cátedra lo trate explícitamente.
- `[[Peer-to-Peer]]`, `[[Blackboard]]`, `[[Microkernel / Plug-in]]` — catálogo de estilos secundarios.
- `[[Golden Paths]]` — sub-concepto de Platform Engineering, por ahora vive dentro de esa página.

**Próximos pasos sugeridos:**
1. Pedir al usuario conversión de `Katas Presentation.ppt` a `.pdf`/`.pptx`.
2. Crear páginas individuales de estilos arquitectónicos a medida que sean protagonistas (no preventivamente).
3. Si aparecen preguntas transversales del alumno (p. ej. "ATAM vs Lightweight vs SAAM en profundidad"), crear páginas de `analyses/`.

---

## [2026-05-06] schema-update | Reorganización de raw/classes por fecha + reasignación Healthcare a Clase 4

Reordenamos `raw/classes/` poniendo cada clase en su propia carpeta con la fecha del jueves hábil correspondiente (clases dadas los jueves desde el 2026-03-05; saltado 2026-04-02 por feriado de Malvinas + Jueves Santo).

**Estructura nueva en `raw/classes/`:**
- `2026-03-05 - Clase 0/Clase 0.pdf`
- `2026-03-12 - Clase 1/Clase 1.pdf`
- `2026-03-19 - Clase 2/Clase 2.pdf`
- `2026-03-26 - Clase 3/Clase 3.pdf`
- `2026-04-09 - Clase 4/Clase 4.pdf` + `Clase V - Caso Healthcare.gov.pdf` + `oei-06-14-00350.pdf`
- `2026-04-16 - Clase 5/Clase 5.pdf`
- `2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf`

**Corrección importante:** el caso `Clase V - Caso Healthcare.gov.pdf` y el reporte `oei-06-14-00350.pdf` se entregaron en **Clase 4** (2026-04-09), no como una "Clase V" separada — el "V" del filename refiere al ID interno de la kata. Reasignación reflejada en wiki:

**Modificadas:**
- [[Clase 4 — ¿Cuándo diseñamos?]] — frontmatter: paths actualizados a la nueva carpeta; agregadas `Clase V - Caso Healthcare.gov.pdf` y `oei-06-14-00350.pdf` a sources; agregada sección "Caso Healthcare.gov" en el desarrollo.
- [[Caso Healthcare.gov]] — paths de sources actualizados; aclaración de que se trabajó en Clase 4 (no en una "Clase V" separada); referencias al wikilink [[Clase 4 — ¿Cuándo diseñamos?]] agregadas.
- [[OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)]] — análogo: paths actualizados, referencia explícita a Clase 4.

**Memoria persistida (auto-memoria):**
- Regla: papers/cases que la cátedra reparte junto con una clase específica viven dentro de la carpeta de esa clase en `raw/classes/`, **no** en `raw/readings/`. `readings/` queda reservado para readings independientes no atados a una clase puntual.

---

## [2026-05-06] class-summary + ingest | Clase 5 — Persistencia

Ingesta completa del slide deck `Clase 5.pdf` (39 slides). Tema central: el menú completo de mecanismos de persistencia y los criterios para elegir entre ellos. Narrativa de la clase: el RDBMS dominó hasta que la web 2.0 lo empujó al borde, generando workarounds creativos que terminaron productizándose como NoSQL.

**Fuente ingerida:** `raw/classes/2026-04-16 - Clase 5/Clase 5.pdf`.

**Páginas creadas (13):**

*Clase (1):*
- [[Clase 5 — Persistencia]] — TL;DR, mapa conceptual, desarrollo, decisiones canónicas, 10 preguntas para parcial.

*Conceptos (12):*
- [[Persistencia]] — definición + criterios + taxonomía global + decisiones canónicas.
- [[Prevalencia]] — patrón in-memory + WAL + snapshots; Prevayler/Madeleine/Bamboo.
- [[Bases de datos relacionales]] — RDBMS, OLTP, normalización, escalabilidad, workarounds (sharding manual, JSON blobs, tablas-como-columnas).
- [[OLAP y ETL]] — reporting analítico desnormalizado y append-only; pipeline Extract/Transform/Load (y la variante moderna ELT).
- [[Bases de datos de objetos]] — OODBMS; por qué casi nunca se eligen.
- [[ORM e impedancia objeto-relacional]] — el choque + 5 dimensiones de impedancia + patrones (Active Record, Data Mapper, Repository, Unit of Work, Identity Map, Lazy Load).
- [[Replicación de BD]] — Primario-Secundario y Primario-Primario; sync vs async; trade-offs O(N²); failover.
- [[Sharding]] — definición + 5 estrategias de partición (rango, hash, lookup, geográfica, temporal) + locality + ejemplo Twitter + heurística para migrar de RDBMS sharded a NoSQL.
- [[Teorema CAP]] — enunciado + lectura "elegir entre C y A durante una partición" + PACELC + aplicación a sistemas reales.
- [[Bases no relacionales]] — origen como productización de hacks sobre RDBMS + 3 familias (columnar, KV, documentos) + polyglot persistence.
- [[Map-Reduce]] — paradigma funcional + ejemplo word-count + por qué no sirve para online + evolución a Spark/Flink.
- [[Principio de localidad]] — espacial y temporal; aplicaciones (caches, sharding, columnar); Twitter como ejemplo.

**Actualizado:**
- [[Inge2 Wiki Index|index]] — agregada nueva categoría 💾 *Conceptos — Persistencia y datos* con los 10 conceptos de persistencia. [[Teorema CAP]] sumado a la sección de Arquitectura. [[Principio de localidad]] y [[Memory hierarchy]] sumados a Principios de diseño.

---

## [2026-05-06] class-summary + ingest | Clase 6 — Big Data en tiempo real (Twitter, Kallen)

Ingesta del deck completo de Nick Kallen *Big Data in Real-Time at Twitter* (QCon 2010, 71 slides). La clase camina íntegramente este deck como caso integrador de la unidad de persistencia: cuatro sub-problemas (Tweets, Timelines, Social graphs, Search indices) cada uno con su propia combinación de partition/replicate/index.

**Fuente ingerida:** `raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf`.

**Páginas creadas (6):**

*Clase (1):*
- [[Clase 6 — Big Data en tiempo real (Twitter)]] — TL;DR, mapa conceptual, desarrollo de los 4 problemas, principios universales, vínculo con Clase 5, 8 preguntas para parcial.

*Caso de estudio (1):*
- [[Caso Twitter — Big Data en tiempo real]] — el desarrollo completo del caso: 4 problemas con sus implementaciones original/actual/futura, números reales (1.2m deliveries/s, fanout 600:1), summary statistics, 5 principios, lecciones para el alumno.

*Source (1):*
- [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]] — síntesis del deck por problema + principios universales de cierre + por qué es valioso académicamente + limitaciones.

*Conceptos (3):*
- [[Partition, Replicate, Index]] — el mantra de Kallen; los 3 mecanismos universales de escalabilidad y cómo se combinan en Twitter.
- [[Off-line vs Online computation]] — cuándo precomputar (timelines) vs cuándo no se puede (set algebra); read amplification vs write amplification.
- [[Memory hierarchy]] — todas las queries online en RAM; *"Disk is for writes only"*; la jerarquía completa de medios de almacenamiento con latencias.

**Actualizado:**
- [[Inge2 Wiki Index|index]] — agregadas Clase 6, caso Twitter, source Kallen, y los 3 conceptos.

**Wikilinks pendientes (referencias a páginas aún no creadas):**
- *Ninguno crítico de las 2 clases nuevas; los wikilinks dentro de los conceptos nuevos resuelven entre páginas creadas en este batch o ya existentes.*

**Próximos pasos sugeridos:**
1. Si la cátedra introduce **DDD** (estratégico o táctico), la sección 📐 *Proceso, calidad, evolución* del index se llenará rápido.
2. Si aparece la pregunta transversal "OLTP + OLAP + Data Lake + ML feature store: ¿cómo conviven?", crear página en `analyses/`.
3. Buen candidato para `analyses/`: una comparación lado a lado de los 4 sub-problemas de Twitter con un ejemplo análogo de otro dominio (Spotify, MercadoLibre, Netflix) — repetir el ejercicio con un sistema distinto consolida los principios.

---

## [2026-05-06] lint | Pasada completa de cross-linking + aliases

Auditoría exhaustiva de todos los wikilinks del wiki. Estado inicial: 728 wikilinks, 36 sin resolver (a páginas inexistentes o con mismatches title/filename).

**Acciones:**

1. **Aliases agregados a 49 páginas.** Cada página de `concepts/`, `classes/`, `case-studies/`, `sources/` y `exercises/` ahora tiene `aliases:` en frontmatter. Esto resuelve wikilinks que usan formas naturales (con espacios, signos, acentos) cuando el filename está hifenado/ascii. También agregué siglas comunes (ABC, ADD, ATAM, CAP, OLTP, OLAP, RDBMS, NoSQL, ORM, IDP, etc.).

2. **3 páginas nuevas creadas para resolver wikilinks huérfanos:**
   - [[ADR — Architecture Decision Record]] — concepto canónico de Nygard; estaba referenciado desde 7 páginas sin existir.
   - [[Golden Paths]] — concepto hermano de Platform Engineering; referenciado desde architectural-guardrails.
   - [[Katas de Arquitectura]] — vehículo pedagógico central de la cátedra; referenciado desde clase-00.

3. **Sub-estilos arquitectónicos consolidados como aliases del catálogo.** Wikilinks como `[[Pipes and Filters]]`, `[[MVC]]`, `[[Broker]]`, `[[Publish-Subscribe]]`, `[[Peer-to-Peer]]`, `[[Microkernel / Plug-in]]`, etc. ahora resuelven a [[Estilos arquitectónicos]] que los aloja. No se crearon páginas separadas para cada sub-estilo (sería sparse); el catálogo los agrupa.

4. **Bidireccionalidad de `related:` reforzada en 37 archivos.** Para cada página, los wikilinks que aparecen en el cuerpo se agregaron al `related:` del frontmatter cuando faltaban. Pasada automatizada con script.

**Estado final:**
- **893 wikilinks totales** — 0 sin resolver. ✓
- **In-degree mínimo: 2** (sólo `sources/atributos-de-calidad-iso-25000.md` — natural para un handout específico).
- **In-degree top 5:** Atributos de calidad (22), ATAM (19), Árbol de utilidad (18), Clase 5 (18), Clase 4 (18).
- **Distribución saludable:** la mayoría de páginas tienen 5-12 incoming links; el grafo está bien conectado, no fragmentado.

**Modificadas:** todas las páginas excepto `index.md` (frontmatter) y `log.md` (este archivo).

**Creadas:** [[ADR — Architecture Decision Record]], [[Golden Paths]], [[Katas de Arquitectura]].

**Actualizado:** [[Inge2 Wiki Index|index]] — agregadas las 3 páginas nuevas a la sección 🧩 *Principios de diseño*.

---

## [2026-05-07] class-summary + ingest | Clase 7 — Caso Compraventa de Acciones

Ingesta de la Clase 7 (jueves 2026-05-07): kata integral aplicando [[Attribute Driven Design]] iterativamente sobre el [[Caso Compraventa de Acciones|Caso 2 del banco de parciales]] (mercado electrónico de acciones). El profesor desarrolló el caso en vivo, demostrando la metodología de **diseño iterativo por atributo de calidad**.

**Reorganización raw/:** los 3 diagramas de pizarra (`Diagrama en blanco (3).png`, `(4).png`, `(5).png`) fueron movidos del root del vault a `raw/classes/2026-05-07 - Clase 7/` para que los embeds tipo `![[Diagrama en blanco (3).png]]` sigan resolviendo en Obsidian (matching por filename) y queden junto a sus fuentes.

**Fuentes ingeridas:**
- `raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md` (notas de clase, parcialmente desarrolladas — la 3ª iteración Availability se cortó mid-line).
- `raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png` (1ª iteración: sistemas externos).
- `raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (4).png` y `(5).png` (2ª iteración: Security aplicada).

**Páginas creadas (3):**

*Clase (1):*
- [[Clase 7 — Caso Compraventa de Acciones]] — TL;DR, mapa conceptual, filosofía de Security ("threshold defense"), ranking final de atributos, metodología de iteración por atributo, decisiones canónicas, 8 preguntas para el parcial.

*Caso de estudio (1):*
- [[Caso Compraventa de Acciones]] — el caso desarrollado integralmente: dominio + stakeholders + ranking de atributos + 3 iteraciones (1ª sistemas externos → 2ª Security → 3ª Availability parcial) + diagrama final + tabla comparativa con Twitter y Healthcare.

*Concepto (1):*
- [[Mecanismos de seguridad]] — catálogo arquitectónico aplicado en la 2ª iteración: **WAF**, **MFA**, **sanitización de inputs**, **encriptación at-rest**, **reverse proxy / LB-as-Nginx**, **VPN** + estrategia *defense in depth*. Filosofía *"ser lo suficientemente difícil de entrar para que sea más atractivo hackear a otro"*.

**Modificadas:**
- [[Enunciados de parciales — 6 casos]] — sección del caso 2 ahora linkea al desarrollo en vivo de la clase + frontmatter actualizado con related a Clase 7, Caso, Mecanismos.
- [[Atributos de calidad]] — related actualizado con Clase 7, Caso y Mecanismos de seguridad.
- [[Attribute Driven Design]] — related actualizado con casos donde el método se aplicó (Compraventa, Twitter, Healthcare) + Mecanismos.
- [[Clase 6 — Big Data en tiempo real (Twitter)]] — related apunta a Clase 7 (siguiente).
- [[Inge2 Wiki Index|index]] — agregada Clase 7 a 🎓 Clases, Caso Compraventa a 🧪 Casos de estudio, Mecanismos de seguridad a 🏛️ Arquitectura.

**Takeaways pedagógicos clave:**

1. **La naturaleza del dato manda en el ranking.** En este dominio Security > Performance, contraintuitivo si pensás "matching de microsegundos = Performance #1".
2. **Threshold defense.** No defensa absoluta — subir costo del ataque hasta que el adversario racional cambie de target.
3. **Iteración por atributo.** El método ADD se aplica iterativamente: primero sistemas externos, luego escenarios del atributo #1, luego escenarios del #2. Las decisiones de baja prioridad **no deben romper** las de alta.
4. **Blast radius y segregación.** Mover Ops a infraestructura separada con VPN limita la superficie de un compromiso público — decisión arquitectónica de seguridad, no operativa.
5. **WebSocket vs Request-Response.** Patrón de comunicación según frecuencia: streaming continuo → WebSocket; operación discreta → Request-Response.

**Pendiente para futuras clases:**
- Completar la 3ª iteración (Availability) — replicación, failover, multi-DC para el caso.
- Si se aplican iteraciones 4ª (Performance) y 5ª (Scalability), ingestar.

---

## [2026-05-12] ingest | Notas a mano de clase (PDFs `claseN.pdf`) — Clases 1 a 5

El alumno subió **5 PDFs nuevos** con notas a mano tomadas de las slides en clase, uno por cada folder de `raw/classes/2026-03-12` a `2026-04-16`. Los archivos tienen filename `claseN.pdf` (en minúsculas), conviven con el slide deck oficial `Clase N.pdf` en el mismo folder. Tema declarado por cada nota:

| Folder | Hand-note declara | Wiki existente | Resultado |
|---|---|---|---|
| `2026-03-12 - Clase 1` | "Introducción a la Arquitectura" | `clase-01-introduccion-arquitectura.md` | ✓ match — enriquecida con detalle del ABC (Nintendo, paradoja del ciclo, innovación incremental en features no críticas) |
| `2026-03-19 - Clase 2` | "Construcción de Arquitectura" | `clase-02-construccion-arquitectura.md` | ✓ match — enriquecida con ADD operativo (Paso 0 orden absoluto, drivers, "convertir riesgos en no-riesgos", 5 outputs) y detalle por estilo (recuperación batch, SPOF del broker, MVC trickle-effect, etc.) |
| `2026-03-26 - Clase 3` | "Ejercicio tipo Parcial" (e-commerce) | `clase-03-documentacion-arquitectura.md` | ✗ MISMATCH temático — el folder tiene `Clase 3.pdf` sobre Documentación, pero la hand-note es un ejercicio práctico de ADD aplicado a e-commerce. Resolución: crear página de ejercicio nueva. |
| `2026-04-09 - Clase 4` | "Video Residuality Theory / Ejercicio Parcial 2013" | `clase-04-cuando-disenamos.md` | parcial — match con el wiki (residuality complementa la sección de evaluación). El "Parcial 2013" desarrollado en pizarra enriquece el ejercicio existente. |
| `2026-04-16 - Clase 5` | "Documentación de Arquitecturas" | `clase-05-persistencia.md` | ✗ MISMATCH temático — el folder tiene `Clase 5.pdf` sobre Persistencia, pero la hand-note es sobre Documentación. Resolución: agregar la hand-note como **source adicional** a `clase-03-documentacion-arquitectura.md` (unidad temática), documentar el descalce en una nota cronológica en esa página. |

**Descalce de orden cronológico ↔ orden temático del wiki — observación:** las hand-notes sugieren que la secuencia que vivió el alumno en clase fue: (1) Intro Arq, (2) Construcción Arq, (3) Ejercicio aplicado ADD, (4) Residuality + Ejercicio 2013, (5) Documentación. El wiki actual mapea Clase 3 → Documentación, Clase 4 → ¿Cuándo diseñamos? (donde encaja Residuality), Clase 5 → Persistencia. Posibles interpretaciones:

1. La cátedra avanzó por temas con un orden distinto al del wiki — y el wiki está bien ordenado por *unidad temática*, no por *fecha de exposición*.
2. Los slide decks oficiales (`Clase N.pdf`) tienen numeración por tema, no por fecha; el alumno los puso en folders cronológicos pero los temas no se dictaron en ese orden.

**No se renumera el wiki** sin confirmación del alumno — sería invasivo. La nota cronológica en `clase-03-documentacion-arquitectura.md` deja constancia para futuras revisiones.

**Fuentes ingeridas (5 hand-notes):**
- `raw/classes/2026-03-12 - Clase 1/clase1.pdf`
- `raw/classes/2026-03-19 - Clase 2/clase2.pdf`
- `raw/classes/2026-03-26 - Clase 3/clase3.pdf`
- `raw/classes/2026-04-09 - Clase 4/clase4.pdf`
- `raw/classes/2026-04-16 - Clase 5/clase5.pdf`

**Páginas creadas (1):**
- [[Ejercicio en clase — ADD aplicado a e-commerce]] — captura el ejercicio del 2026-03-26 con: lista candidata de atributos, top 4 elegidos (Security/Availability/Scalability/Interoperability), blueprint con sistemas externos (procesadores de pago, tablets, depósito), introducción OLTP vs OLAP. Linkeada desde [[Clase 2 — Construcción de la arquitectura]] como aplicación práctica.

**Páginas modificadas (5):**
- [[Clase 1 — Introducción a Arquitectura]] — frontmatter: agregada hand-note a `sources`. Nueva sub-sección **"Las fuerzas del ABC con detalle"** (stakeholders, negocio inmediato vs largo plazo, estructura organizacional, sesgo del arquitecto, ambiente tecnológico con Nintendo como ejemplo) y **"La paradoja del ciclo"** (innovación incremental controlada como salida).
- [[Clase 2 — Construcción de la arquitectura]] — frontmatter: agregada hand-note. Nueva sub-sección **"ADD paso a paso — versión operativa de la cátedra"** con Paso 0 (orden absoluto), Paso 1 (sistemas externos), Pasos 2-3 (escenarios y validación), 5 outputs del proceso, cita *"convertir riesgos en no-riesgos"*. Catálogo de estilos enriquecido con detalle por estilo (batch error-recovery, broker SPOF, pub-sub analogía repartidor, MVC trickle-effect, event-based observability). Linkeada al nuevo ejercicio.
- [[Clase 3 — Documentación de arquitecturas]] — frontmatter: paths actualizados al folder fechado + agregada hand-note de Clase 5. Nota cronológica al inicio explicando el descalce. Secciones enriquecidas con citas y detalle: nivel de detalle (máximo vs mínimo balanceado), Modelo 4+1 interacciones entre vistas, +1 escenarios, mapa de audiencias por vista, C4 con tabla detallada por nivel, tailoring híbrido como aproximación dominante.
- [[Clase 4 — ¿Cuándo diseñamos?]] — frontmatter: agregada hand-note. Nuevas sub-secciones **"Video — Residuality Theory (Barry O'Reilly)"** (mención del video y framework, relación con ATAM) y **"Ejercicio en clase — Parcial 2013 desarrollado en pizarra"** (lista de 8 atributos candidatos, top-4 elegidos: Reliability/Precision/Performance/Interoperability, link al ejercicio enriquecido). Heurística "sistema externo = sin control" capturada.
- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — frontmatter: agregada hand-note como source secundario + tags `producer-consumer, heartbeat` + relateds nuevos (Clase 4, Pipes&Filters, Pub-Sub, MVC). Nueva sub-sección **"(c) Arquitectura propuesta — desarrollo en clase (2026-04-09)"** con el diagrama de pizarrón: Daemon sin UI, Pollers redundantes con Heartbeat, Processor, Alarma, DB compartida, Webapp MVC, patrón Producer-Consumer. Justificaciones por componente.

**Actualizado:**
- [[Inge2 Wiki Index|index]] — agregado [[Ejercicio en clase — ADD aplicado a e-commerce]] a 📝 Ejercicios; descripción del Ejercicio 2013 enriquecida con la mención del pizarrón.

**Conceptos mencionados sin página propia (pendientes):**
- **Residuality Theory** (Barry O'Reilly) — mencionado en la nueva sub-sección de Clase 4. No se crea página dedicada porque la hand-note sólo dice *"Video Residuality Theory"* sin contenido; falta material para una página rica. Pendiente: ver el video o leer material primario y entonces crear `wiki/concepts/residuality-theory.md`.
- **Producer-Consumer pattern** y **Heartbeat pattern** — surgen en el desarrollo del Ejercicio 2013 en pizarra. Por ahora viven dentro de esa página; si reaparecen en otras clases vale la pena promoverlos a `wiki/concepts/`.

**Pendiente para el alumno:**
- Confirmar si el orden cronológico real fue Intro → Construcción → Ejercicio ADD → Residuality+Parcial2013 → Documentación → Persistencia → Twitter → Compraventa. Si sí, considerar renombrar las páginas wiki para que el "N" coincida con la fecha de exposición (es decir, mover Documentación a Clase 5, Persistencia a Clase 6, etc.) o aceptar que el wiki usa numeración temática y dejarlo así.

> *Resuelto en operación `schema-update` siguiente (2026-05-12) — renumeración aplicada.*

---

## [2026-05-12] schema-update | Renumeración cronológica de clases 3, 5 y 6

Reordenamiento de la numeración del wiki para reflejar el **orden cronológico real de exposición** de la cátedra (derivado de las hand-notes ingestadas el mismo día). El orden anterior usaba numeración temática del filename `Clase N.pdf` que la cátedra distribuye, pero ese filename refleja el **orden temático** del deck, no la **fecha** de exposición.

**Movimientos aplicados:**

| Antes | Después | Fecha real | Razón |
|---|---|---|---|
| `clase-03-documentacion-arquitectura.md` | `clase-05-documentacion-arquitectura.md` | 2026-04-16 | Hand-note del 2026-04-16 confirma que ese día se vio Documentación, no Persistencia. |
| (no existía) | `clase-03-ejercicio-add-ecommerce.md` | 2026-03-26 | Nueva página de clase. Lo que realmente se vio el 2026-03-26 fue un **ejercicio de ADD en pizarra** sobre e-commerce, no Documentación. El ejercicio detallado vive en [[Ejercicio en clase — ADD aplicado a e-commerce]]; esta página de clase lo enmarca pedagógicamente y captura los takeaways. |
| `clase-05-persistencia.md` | `clase-06-persistencia.md` | 2026-04-23 | Si Documentación es C5 (2026-04-16), Persistencia se corre a C6 (2026-04-23). Comparte fecha con [[Clase 6 — Big Data en tiempo real (Twitter)]] — la jornada del 2026-04-23 cubrió **teoría + caso aplicado** secuencialmente. |
| `clase-06-big-data-twitter.md` | (sin renombrar) | 2026-04-23 | Twitter sigue siendo Clase 6, comparte día con Persistencia. Nota cronológica agregada en el cuerpo. |

**Filenames con prefix `clase-06` duplicado:** sí, hay dos archivos `clase-06-*` (persistencia y big-data-twitter). Es intencional — ambos cubren la misma jornada (2026-04-23) en partes distintas: teoría y caso aplicado. Mantenerlos separados preserva la estructura de cada uno; fusionarlos hubiera diluido la cobertura. Los `title:` los distinguen ("Clase 6 — Persistencia" vs "Clase 6 — Big Data en tiempo real (Twitter)").

**Wikilinks actualizados globalmente:**
- `[[Clase 3 — Documentación de arquitecturas]]` → `[[Clase 5 — Documentación de arquitecturas]]` (7 archivos: classes/clase-02, classes/clase-04, classes/clase-05-documentacion (self-ref en quote), concepts/c4-model, concepts/modelo-4-mas-1, index, log no-tocado).
- `[[Clase 5 — Persistencia]]` → `[[Clase 6 — Persistencia]]` (18 archivos: case-studies/twitter, classes/clase-04, classes/clase-06-persistencia (self-ref en quote), 13 concepts/, index, sources/kallen).

Aplicado vía `sed -i ''` excluyendo `log.md` (bitácora histórica que conserva referencias originales para que cada entrada se lea con el contexto vigente cuando se escribió).

**Aliases legacy conservados** en frontmatter de las páginas renombradas para que wikilinks o búsquedas que usen la forma vieja sigan resolviendo:
- `clase-05-documentacion-arquitectura.md` conserva alias `"Clase 3 — Documentación de arquitecturas"`.
- `clase-06-persistencia.md` conserva alias `"Clase 5 — Persistencia"`.

**Páginas creadas (1):**
- [[Clase 3 — Ejercicio en clase: ADD aplicado a e-commerce]] — clase del 2026-03-26 enmarcada pedagógicamente. Linkea al ejercicio existente [[Ejercicio en clase — ADD aplicado a e-commerce]] (página de tipo `exercise`).

**Páginas renombradas (3):**
- `clase-03-documentacion-arquitectura.md` → `clase-05-documentacion-arquitectura.md` — title actualizado, `date: 2026-04-16` agregado, related ajustado (vecinos: Clase 4 y Clase 6 — Persistencia), nota cronológica reescrita.
- `clase-05-persistencia.md` → `clase-06-persistencia.md` — title actualizado, `date: 2026-04-23` (era 2026-04-16), related ajustado (vecinos: Clase 5 — Documentación y Clase 6 — Twitter), nota cronológica agregada.
- `clase-06-big-data-twitter.md` — sin renombrar pero updated: nota cronológica de "comparte día con Persistencia", related apunta ahora a `Clase 6 — Persistencia`.

**Modificadas (cuerpo y/o frontmatter):**
- [[Clase 2 — Construcción de la arquitectura]] — related: `Clase 3 — Documentación` → `Clase 5 — Documentación` (vía sed).
- [[Clase 4 — ¿Cuándo diseñamos?]] — related: ambas referencias actualizadas (Clase 5 = Documentación, Clase 6 = Persistencia).
- [[C4 Model]], [[Modelo 4+1]] — wikilinks Clase 3 → Clase 5 actualizados.
- 13 conceptos de persistencia + [[Caso Twitter — Big Data en tiempo real]] + [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]] — wikilinks Clase 5 → Clase 6 actualizados.
- [[Inge2 Wiki Index|index]] — entradas de clase reordenadas y fechas corregidas; agregada Clase 3 (Ejercicio ADD); nota global al inicio de la sección "Clases" explicando que la numeración refleja orden cronológico, no orden de filename del deck.

**Sin tocar:**
- `raw/classes/` — inmutable. Los folders `2026-03-26 - Clase 3` y `2026-04-16 - Clase 5` conservan sus filenames `Clase N.pdf` originales (cubren temas distintos a los que el alumno presenció ese día, pero son los archivos que la cátedra distribuyó con esos nombres).
- Páginas wiki C0, C1, C2, C4, C7 — no afectadas (sus números cronológicos y temáticos ya coinciden).

**Razón de la reorganización (registrada para futuras revisiones):**

Las hand-notes del alumno son evidencia de **lo que efectivamente ocurrió en clase cada jueves**. Los slide decks (`Clase N.pdf`) son material que la cátedra organiza por **secuencia temática del temario**, no por la fecha en que cada uno se va a exponer. El alumno colocó los decks en folders fechados (`raw/classes/YYYY-MM-DD - Clase N/`) asumiendo que la N del deck = la N cronológica, lo cual resultó ser cierto para clases 0-2 y 4 pero no para 3, 5 y 6. Renumerar el wiki para que la numeración refleje fechas reales:

1. **Reduce ambigüedad** — al estudiar para un parcial, "Clase 5" del wiki coincide con lo que el alumno vivió esa fecha.
2. **Hace explícitas las jornadas compuestas** — el 2026-04-23 cubrió Persistencia + Twitter, lo cual ahora se ve directamente en el index.
3. **Preserva integridad de `raw/`** — los folders no se tocan; sólo los nombres del wiki cambian.

**Trade-off asumido:** duplicación visual de "Clase 6" en el filename (`clase-06-persistencia.md` y `clase-06-big-data-twitter.md`). Aceptable porque los titles son distintos y la convención (clase = jueves de la cátedra) lo justifica.


## [2026-05-13] case-study | Banco de casos mock de parcial

Generado un banco de **6 casos mock** con la misma estructura y nivel de detalle que los casos reales de la cátedra ([[Caso Healthcare.gov]], [[Caso Twitter — Big Data en tiempo real]], [[Caso Compraventa de Acciones]]). Cada caso tiene contexto largo, stakeholders, drivers, decisiones arquitectónicas, lecciones aprendidas, trampas y conceptos relacionados.

El banco vive en dos lados que se mantienen en paralelo:

1. **`study/js/data/mock-cases.js`** — datos consumibles por el generador (`MOCK_CASES` object).
2. **`wiki/case-studies/mock-*.md`** — una página Markdown navegable por caso, más un índice del banco.

**Página `study/js/tools/case-simulator.js` refactorizada:** antes sorteaba un domain × variation seco; ahora sortea un caso completo del banco y lo muestra con la misma estructura visual que `study/js/tools/cases.js` (contexto largo, stakeholders, drivers). La sección "Decisiones curadas / lecciones / trampas" queda en un `<details>` colapsado al final como **guía de resolución** — el alumno la abre sólo después de intentar. Persistencia en localStorage por caso (clave `case-sim-answers-<id>`). Markdown exportable incluye enunciado completo + respuestas + guía de resolución para corrección.

**Creadas (7):**
- [[Banco de casos mock de parcial]] — índice y reglas del banco, tabla cruzada con casos reales hermanos.
- [[Caso mock — Plataforma de telemedicina interregional]] — salud, privacidad, FHIR; hermana de [[Caso Compraventa de Acciones]] en "naturaleza de los datos manda".
- [[Caso mock — Sistema nacional de voto electrónico]] — adversarial, verifiability, E2E-V, air-gap.
- [[Caso mock — Plataforma de streaming de video on-demand]] — Kallen aplicado fuera de Twitter: PRI, off-line precompute, memory hierarchy.
- [[Caso mock — Plataforma de monitoreo de smart city]] — event-driven, CEP, polyglot persistence, privacy by design.
- [[Caso mock — Plataforma de subastas en tiempo real]] — order book, CP CAP, anti-sniping, Fairness como atributo.
- [[Caso mock — Logística de última milla a escala]] — scaleup 25→90 eng, bounded contexts antes que microservicios, OLTP/OLAP separados.

**Modificadas:**
- [[Inge2 Wiki Index|index]] — agregada sub-sección "Banco de casos mock de parcial" dentro de "🧪 Casos de estudio".
- `study/js/data/mock-cases.js` — nuevo data file con `MOCK_CASES`.
- `study/js/tools/case-simulator.js` — refactorizado para consumir `MOCK_CASES` y mostrar enunciado completo + guía de resolución colapsada.
- `study/index.html` — agregado `<script src="js/data/mock-cases.js"></script>` antes del script de tools.

**Trade-off asumido:** los casos son sintéticos, no históricos — marcados como tales en cada página y en el banco-índice. No reemplazan a los reales: complementan. La práctica deliberada exige variedad; tres casos canónicos no alcanzan sin caer en memorización.

**Sin tocar:** `raw/`, casos canónicos reales (`wiki/case-studies/healthcare-gov.md`, `twitter-real-time-scaling.md`, `compraventa-acciones.md`) y `study/js/data/cases.js`.


## [2026-05-15] ingest | Clase 8 — Consultas pre-parcial (2026-05-14)

Ingesta de la clase de consultas pre-parcial del 2026-05-14. Material breve (1 archivo, ~50 líneas de notas del alumno) pero **muy denso operativamente** — la cátedra dejó explícito la estructura mínima de la respuesta de parcial, una lista de anti-patrones que descalifican ("2 automático"), criterios formales para decidir hosting, refinamientos de distinciones entre atributos de calidad que se confunden seguido y una definición operativa de riesgo.

**Fuente ingerida:**
- `raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md` — apuntes del alumno tomados durante la clase.

**Creadas (3):**
- [[Clase 8 — Consultas pre-parcial]] — página de clase con TL;DR, estructura mínima del parcial, anti-patrones, criterios de hosting, refinamientos de atributos, definición de riesgo, ejemplos, preguntas para el parcial.
- [[Anti-patrones de parcial]] — concept dedicado al catálogo del "2 automático": cola como request-response, escalado horizontal sin LB, cache sin invariantes documentados, olvidarse sistemas externos, OLAP para transaccional. Más anti-patrones cercanos no enumerados pero penalizan (microservicios prematuros, big bang sin staging, dibujar antes de articular drivers, métricas vagas).
- [[Criterios de hosting y data residency]] — concept nuevo: tres criterios (regulatorio, costos, latencia), tabla con ejemplos de jurisdicciones (Corea del Sur, México, UE, AR, sector financiero, salud), implicancia arquitectónica de cada criterio, comparativa cloud/on-prem/colocation, falacias comunes.

**Modificadas:**
- [[Atributos de calidad]] — nueva sección "Distinciones finas refinadas en clase" con Availability vs Reliability (ejemplo del programa que reinicia cada hora), Interoperability con sus dos caras (cliente y servidor) y cómo se distingue de Fault Tolerance, Manageability orientada al sysadmin, Customizability orientada al usuario final, Auditability con la implicancia arquitectónica concreta (logs en storage separado + control de acceso distinto). Frontmatter actualizado: `updated: 2026-05-15`, source de Clase 8 agregado, related links a las 3 páginas nuevas.
- [[Inge2 Wiki Index|index]] — agregada entrada de Clase 8 en sección "🎓 Clases"; agregadas entradas de Anti-patrones de parcial y Criterios de hosting en sección "📐 Conceptos — Proceso, calidad, evolución".

**Notas sobre el material:**
- El archivo fuente es un `.md` (apuntes hand-typed por el alumno), no un PDF de la cátedra. Es la primera vez en el wiki que ingerimos hand-notes como source primario; las citas usan el path del archivo `.md`.
- "Elasticsearch" quedó marcado como pendiente de profundizar — la cátedra invitó a investigarlo pero no lo desarrolló. Si aparece en clases futuras o en el TP, expandir.

**Implicancia para los casos mock del banco:**
Los 6 casos del [[Banco de casos mock de parcial]] con Auditability prioritario (telemedicina, voto, smart-city, subastas, logística) ahora tienen una directriz explícita: en el inciso (d) del diagrama, el log store debe aparecer como componente aparte con control de acceso distinto. Esto ya estaba implícito en las "Decisiones arquitectónicas curadas" de cada caso, pero ahora hay un concepto formal al cual citar ([[Atributos de calidad#Auditability — implicancia arquitectónica concreta]]).

**Sin tocar:**
- `raw/` — inmutable.
- Páginas wiki de clases anteriores — no afectadas.
- Casos canónicos (Healthcare.gov, Twitter, Compraventa) — no afectados.

---

## [2026-05-20] ingest | Cheat Sheet Inge II — Bucket de soluciones (estudio pre-parcial)

Ingesta del documento `raw/assets/Inge II - Cheat Sheet.docx` (752KB, ~388 párrafos), aportado por el alumno como material de estudio para el parcial del día siguiente. El documento es un derivado del corpus de la cursada (no introduce conceptos nuevos respecto a Clases 1–8), pero reorganiza el material como **playbook de respuesta de parcial**: catálogo de mecanismos arquitectónicos ("Bucket de Soluciones") seguido de mapeo problema→solución por atributo de calidad (Availability, Security, Performance, Precision, Scalability, Interoperabilidad, Fault Tolerance, Accessibility) y tradeoffs canónicos.

**Decisión de ingesta:** dada la proximidad del parcial, prioricé generar una **guía de estudio comprehensiva en `wiki/analyses/`** sobre propagar conceptos atómicos faltantes (queues, SPA-vs-Webapp, JWT/HTTPS/WAF/VPN/Websockets/Webhooks, punto-fijo-vs-flotante, encryption-at-rest-vs-in-transit, Adapter, CDN). Esos conceptos quedan mencionados en el analysis con definición operativa, pero sin página `concepts/` dedicada — se pueden extraer en futuras pasadas si reaparecen en otras clases.

**Creadas (2):**
- [[Cheat Sheet Inge II — Bucket de soluciones por atributo de calidad]] *(source)* — registro de la fuente con estructura del documento, qué cubre, qué falta, y cita al derivado.
- [[Cheat Sheet — Guía de estudio pre-parcial]] *(analysis)* — destilado de estudio en 14 secciones (§0 metodología, §1–§8 bucket expandido con definiciones operativas y trade-offs por mecanismo, §9 mapa problema→solución completo por atributo, §10 tradeoffs canónicos, §11 anti-patrones que dan 2, §12 runbook de 7 pasos, §13 lo que la cheat sheet no cubre pero podría caer, §14 frase de cierre). Linkea masivamente a concepts existentes ([[Atributos de calidad]], [[Mecanismos de seguridad]], [[Anti-patrones de parcial]], [[Criterios de hosting y data residency]], [[Teorema CAP]], [[Replicación de BD]], [[Sharding]], [[OLAP y ETL]], [[Bases no relacionales]], [[SLA, SLO, SLI]], [[MTBF y MTTR]]) y a los casos canónicos ([[Caso Healthcare.gov]], [[Caso Twitter — Big Data en tiempo real]], [[Caso Compraventa de Acciones]]).

**Modificadas:**
- [[Inge2 Wiki Index|index]] — agregada entrada del cheat sheet en sección "📖 Sources" y de la guía de estudio en sección "🔍 Analyses". Sección Analyses pasa de vacía a tener su primera entrada. `updated: 2026-05-20`.

**Notas sobre el material:**
- El documento original tiene secciones **incompletas** (Interpolación, Frecuencia de Polling, Archivos con placeholders "asd", Manejo de Sensores). Cubiertas en el analysis usando contenido de [[Clase 6 — Persistencia]] y [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]].
- El cheat sheet no menciona [[Anti-patrones de parcial]] ni [[Criterios de hosting y data residency]] — ambos críticos para el parcial. La guía los incorpora explícitamente.
- El cheat sheet no menciona métricas cuantitativas ([[SLA, SLO, SLI]], [[MTBF y MTTR]]) ni vistas de documentación ([[Modelo 4+1]], [[C4 Model]]) ni métodos de evaluación ([[SAAM]], [[ATAM]], [[Lightweight ATAM]]). La guía lista estas omisiones en §13 como repaso recomendado.

**Pendientes (post-parcial):**
- Crear `concepts/queues-mensajeria-asincronica.md` consolidando lo que está disperso en mecanismos-de-seguridad + anti-patrones + analysis.
- Crear `concepts/frontend-spa-vs-webapp.md` (SSR/CSR, SEO, híbridos como Next.js).
- Expandir [[Mecanismos de seguridad]] con secciones dedicadas a JWT, WebSockets, Webhooks que hoy aparecen sólo en el analysis.
- Crear `concepts/cdn-content-delivery-network.md` (mencionado en bucket de scalability pero sin página propia).
- Crear `concepts/precision-numerica-punto-fijo-vs-flotante.md` (atributo de calidad poco cubierto en el resto del wiki).

**Sin tocar:**
- `raw/` — inmutable.
- Todas las páginas wiki existentes — solo agregadas; ningún update destructivo.

---

## [2026-05-29] ingest | TPE 2026-1C — Consigna de investigación y presentación

Ingesta de la consigna del **Trabajo Práctico Especial** (`raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf`, 1 página): investigar + exponer (15 min estrictos) un tema del catálogo de la cátedra con la lente negocio + [[Atributos de calidad]]. Documento de logística/consigna, sin conceptos nuevos.

**Decisión de alcance:** el usuario optó por *solo ingestar el enunciado* (vía AskUserQuestion). NO se propagaron páginas de conceptos nuevos para los temas sin página propia (Domain Specific Languages, Staging Environments) ni se armó research específico de tema. Esas extracciones quedan pendientes para cuando el grupo elija tema.

**Creadas (1):**
- [[TPE 2026-1C — Investigación y presentación de un tema]] *(exercise)* — enunciado literal + encuadre en el enfoque de la materia (4 preguntas obligatorias: problema de negocio, atributos que mueve, cuándo NO aplica, comparativa), tabla de los dos tracks (técnico con demo / funcional con comparativa), catálogo de 8 temas mapeado a conceptos del wiki, logística (entrega 10/6, oral 11/6, grupos 4×5 + 3×4, FIFO por mail), errores típicos.

**Modificadas:**
- [[Inge2 Wiki Index|index]] — agregada entrada en sección "📝 Ejercicios", debajo de [[TP general]]. `updated: 2026-05-29`.

**Observaciones:**
- **Platform Engineering** (tema funcional #3) ya tiene página completa y madura ([[Platform Engineering]]) — head-start si un grupo lo toma.
- Temas sin página propia en el wiki: **Domain Specific Languages** y **Staging Environments** (candidatos a `concepts/` si se eligen).
- No hay contradicción con material previo. El TPE es ortogonal al [[TP general]]: aquel es diseño-integrador, este es investigación-exposición.

**Sin tocar:**
- `raw/` — inmutable.
- Conceptos del wiki — ninguno creado ni modificado (alcance acotado por el usuario).

---

## [2026-05-29] class-summary + ingest | Clase 9 — Integración / SOA / Microservicios

Ingesta de la **Clase 9 cronológica** (dictada 2026-05-28, primera post-parcial; deck de la cátedra `raw/classes/2026-05-28 - Clase 9/Clase 6.pdf`, 45 slides). Clase muy densa: recorrido histórico de la integración de sistemas y catálogo completo de patrones de microservicios (Richardson, microservices.io).

**Nota de numeración:** el deck se llama `Clase 6.pdf` pero es topic-deck, no cronológico. La Clase 6 cronológica (Persistencia) usó el deck `Clase 5.pdf` + el PDF de Twitter, así que no hay conflicto: este deck `Clase 6.pdf` es contenido nuevo, dictado como 9.ª clase.

**Decisión de alcance:** el usuario eligió *Completa* (vía AskUserQuestion) — página de clase + propagar los ~17 conceptos nuevos como páginas propias. Esto **llena la categoría "🔨 Patrones de diseño" del índice**, que estaba vacía desde el bootstrap.

**Creadas — clase (1):**
- [[Clase 9 — Integración de Sistemas / SOA / Microservicios]] *(class)* — TL;DR, mapa conceptual, desarrollo (la escalera de exposición, SOA y sus piezas, el pivote SOA↔microservicios, las 3 familias de patrones, el monolito hexagonal FTGO), tabla de decisiones clave, ejemplos (FTGO/BIAN/DORA), 7 preguntas de final, lecturas.

**Creadas — conceptos de arquitectura/integración (6):**
- [[Integración de sistemas]] — matriz 3×3, evolución point-to-point → hub/ESB → SOA → API/microservicios, escalera de exposición.
- [[SOA — Service-Oriented Architecture]] — granularidad, governance, límites; driver integración+gobernanza.
- [[ESB — Enterprise Service Bus]] — bus con adapters; ESB vs API Gateway.
- [[Microservicios]] — triángulo Conway, métricas DORA, desventajas, cuándo es over-engineering.
- [[Service Mesh]] — sidecar, mTLS, resiliencia; **marcado como tema del [[TPE 2026-1C — Investigación y presentación de un tema|TPE]]**.
- [[Evolución del deployment — VM, Containers, Kubernetes, Serverless]] — timeline físico→VM→container→serverless, K8s, trade-offs.

**Creadas — patrones de microservicios (10):**
- [[Descomposición en microservicios]], [[Aggregate (DDD)]], [[Database per Service]], [[Patrón Saga]], [[CQRS — Command Query Responsibility Segregation]], [[Event Sourcing]], [[API Gateway]], [[Backend for Frontend (BFF)]], [[Circuit Breaker]], [[Orquestación vs Coreografía]].

**Creadas — proceso (1):**
- [[BPM y BAM]] — BPMN/BPEL, monitoreo en tiempo real.

**Modificadas:**
- [[Inge2 Wiki Index|index]] — entrada de Clase 9 en "🎓 Clases"; 6 conceptos en "🏛️ Arquitectura"; 10 patrones poblando "🔨 Patrones de diseño" (antes vacía, ahora con sub-secciones Application/Data, Communication); BPM/BAM en "📐 Proceso y calidad". `updated: 2026-05-29`.

**Conexiones marcadas:**
- **Service Mesh** ↔ TPE 2026-1C (tema funcional) — esta clase es material directo para ese grupo.
- Extiende [[Estilos arquitectónicos]], [[Teorema CAP]], [[Replicación de BD]], [[ORM e impedancia objeto-relacional]], [[Mecanismos de seguridad]], [[Platform Engineering]], [[MTBF y MTTR]]. Sin contradicciones con material previo (capa "macro" de integración sobre la "micro" de persistencia/estilos).

**Sin tocar:**
- `raw/` — inmutable.
- Páginas previas — solo se agregó al índice; ningún update destructivo.

---

## [2026-05-29] exercise | TPE 2026-1C — Expansión del catálogo de temas

A pedido del usuario, se expandió la sección "Catálogo de temas" de [[TPE 2026-1C — Investigación y presentación de un tema]]: cada uno de los 8 temas ahora tiene descripción breve con la lente de la materia (qué es / decisión de negocio / atributo de calidad / demo o comparativa), en lugar del mapeo de una línea anterior. Sin nuevas páginas de conceptos.

**Modificadas:**
- [[TPE 2026-1C — Investigación y presentación de un tema]] — sección de catálogo reescrita y ampliada.

---

## [2026-05-29] analysis | TPE — Tema elegido: Apache Airflow (track técnico)

El grupo eligió **Apache Airflow** (tema técnico) para el TPE. Se creó la página de investigación + scaffold de presentación, y se registró la elección en la página del enunciado.

**Creadas (1):**
- [[TPE — Apache Airflow (investigación + PoC)]] *(analysis)* — concepto y arquitectura (DAG, Scheduler, Executor, UI, metadata DB), lente de la materia (problema de negocio, decisión offline/online, tabla de atributos de calidad, cuándo NO), comparativa con cron/Luigi/Dagster/Prefect/cloud-managed, propuesta de PoC (ETL diario con fallo+retry+backfill+Gantt), estructura minuto a minuto de los 15', errores que bajan la nota, fuentes.

**Modificadas:**
- [[TPE 2026-1C — Investigación y presentación de un tema]] — marcado Apache Airflow como tema elegido; link a la investigación; recordatorio de reclamar por mail (FIFO).
- [[Inge2 Wiki Index|index]] — entrada en "🔍 Analyses".

**Nota:** la PoC propuesta (ETL diario de ventas) es un default a confirmar/redirigir con el usuario según el dominio que prefieran para la demo.

---

## [2026-05-29] ingest | Repo AirflowDemo — entregable del TPE clonado e ingestado

Se clonó `https://github.com/FranciscoFerrutti/AirflowDemo` en `raw/TPE/AirflowDemo/` (604 KB) e ingestó. El repo es un **entregable de TPE terminado**: presentación de 13 diapositivas (`presentacion.md`/`.pdf`, ~9:30 de teoría, enfoque ADD) + demo ejecutable sobre Docker (`reporte_ventas_diario`, DAG de 6 tasks, Postgres + LocalExecutor, datasets válido/corrupto). La demo coincide con el escenario que el grupo ya había elegido (ETL diario de ventas).

**Decisión de ingesta:** *update sobre create*. En vez de una página nueva, se **reescribió** [[TPE — Apache Airflow (investigación + PoC)]] para que sea **companion fiel del repo** (lo resume y lo conecta con el corpus, sin duplicar el material original que vive en `raw/`). El scaffold genérico previo (PoC "propuesta") fue reemplazado por el demo real con su guion (variantes A: fallo transitorio recuperable, B: `ventas_corrupto.csv` fail-fast).

**Modificadas:**
- [[TPE — Apache Airflow (investigación + PoC)]] — reescrita: sección 0 (mapa del repo + cómo levantar la demo), tesis de las 13 diapositivas, arquitectura, tabla de 6 atributos de calidad ADD con sus trade-offs, comparativa cron/NiFi/Prefect/Dagster, guion de demo, presupuesto de tiempo, checklist de presentación. `sources` ampliado a los 7 archivos del repo.
- [[TPE 2026-1C — Investigación y presentación de un tema]] — Airflow marcado como entregable terminado, link al repo.
- [[Inge2 Wiki Index|index]] — entrada de Analyses actualizada (repo + demo + comparativa NiFi).

**Notas:**
- Comparativa del repo usa **NiFi** (no Luigi como en el scaffold previo); la página quedó alineada al repo (que es lo que se va a presentar).
- El vault NO está bajo git → el `.git` anidado del clon es inofensivo.
- `raw/` — inmutable; el repo es fuente de sólo lectura.

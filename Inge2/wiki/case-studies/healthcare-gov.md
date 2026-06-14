---
title: Caso Healthcare.gov
aliases:
  - "Caso Healthcare.gov"
  - "Healthcare.gov"
  - "Caso Healthcare"
  - "CMS Federal Marketplace"
type: case-study
created: 2026-04-22
updated: 2026-05-06
tags: [case-study, healthcare-gov, aca, cms, fracaso, leccion-aprendida]
sources:
  - "raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf"
  - "raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf"
related:
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Atributos de calidad]]"
  - "[[Architecture Business Cycle]]"
  - "[[Cono de incertidumbre]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Architectural Guardrails]]"
  - "[[Platform Engineering]]"
---

# Caso Healthcare.gov

## Por qué la cátedra lo usa

Healthcare.gov es el **caso de estudio canónico** de fracaso de lanzamiento en software de alto perfil de la década 2010. Es un vehículo pedagógico para aplicar [[ATAM]] en **modo post-mortem**: dado que sabemos cómo terminó, ¿qué *debería* haberse evaluado, y cómo? La cátedra lo trabajó en [[Clase 4 — ¿Cuándo diseñamos?]] como kata de aplicación del árbol de utilidad y ATAM (source: raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf — el "V" del filename refiere al ID interno de la kata, no a un número de clase distinto).

## Contexto

- **Affordable Care Act (ACA)**, firmada en 2010 por la administración Obama.
- **CMS** (Centers for Medicare & Medicaid Services) a cargo de construir el **Federal Marketplace** — el portal para que millones de ciudadanos elijan y adquieran planes de salud subsidiados.
- **Lanzamiento:** 1 de octubre de 2013, "open enrollment" de 6 meses.
- **Plazo político duro** — la ley entraba en vigor el 1 de enero de 2014.

## Qué se rompió en el lanzamiento

Según el reporte **OEI-06-14-00350** de la Oficina del Inspector General del HHS (source: raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf):

- **Availability** ~43% en las primeras semanas.
- **Latencia p95** > 8 segundos bajo carga.
- **Concurrencia máxima** sostenida < 1,100 usuarios cuando se esperaban decenas de miles.
- **Enrollment rate** < 30% — la mayoría de las sesiones fallaban antes de completar la compra.
- **26,000 usuarios concurrentes en el primer día**, muy por debajo del target, y aún así el sistema colapsó.

Impacto político: crisis de confianza pública en la ACA; necesidad de "rescate" con un equipo tipo tech-surge externo (Todd Park, Mikey Dickerson y otros).

## Las 10 lecciones aprendidas (OEI exec summary)

Del reporte OEI (source: raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf):

1. **Leadership** — liderazgo fragmentado entre CMS, HHS, y contratistas. Nadie era dueño end-to-end.
2. **Alignment** — objetivos de negocio y técnicos desalineados. Scope escalaba sin ajustar presupuesto o fechas.
3. **Culture** — cultura de ocultar malas noticias a niveles superiores; optimismo tóxico.
4. **Simplification** — scope excesivamente complejo (integraciones con 36 estados, IRS, Homeland Security, carriers, identity providers). Sin estrategia de simplificación.
5. **Integration** — cada contratista entregaba su pieza sin pruebas integradas end-to-end hasta el último momento.
6. **Communication** — comunicación pobre entre contratistas, CMS y stakeholders políticos.
7. **Execution** — procesos de ingeniería inmaduros (sin CI/CD serio, sin load testing realista, sin staging).
8. **Oversight** — supervisión de contratistas insuficiente; auditorías tardías.
9. **Planning** — planificación optimista, sin buffers, sin gestión de riesgo formal.
10. **Learning** — falta de mecanismos para incorporar lecciones de fases tempranas al plan vigente.

Cada lección se mapea a un **atributo de calidad** o a un **factor contribuyente** del fracaso.

## Análisis arquitectónico post-hoc

### Árbol de utilidad implícito

Lo que *debería* haber sido priorizado (y no lo fue):

| Atributo | Escenario | Importancia real | Lo que pasó |
|---|---|---|---|
| Availability | 99% uptime durante enrollment | H | Colapso sostenido semanas |
| Performance | p95 < 3s con 50k concurrent users | H | p95 > 8s con < 1k |
| Scalability | Scaling horizontal bajo picos estacionales | H | Arquitectura monolítica sin elasticidad |
| Integration | Interoperar con 36 state marketplaces + IRS + DHS | H | Integraciones tardías, fallas en cascada |
| Security | PII encriptada, auth robusta | H | Parcialmente logrado; no fue lo peor |
| Usability | Enrollment < 15 min flow | M | Flow complicado por falla intermitente |

### Sensitivity points ignorados

- **Dependencia en el identity verifier (Experian) como single point of failure** — cuando colapsaba, todo el flow se detenía.
- **Base de datos central compartida** entre subsistemas — cuellos de botella agudos.
- **Falta de queuing entre front-end y back-end** — picos de tráfico llegaban directo al core, sin absorción.

### Tradeoff points no reconocidos

- **Time-to-market vs reliability** — se priorizó cumplir la fecha política sacrificando reliability.
- **Scope vs performance** — se agregaron features hasta el final (múltiples carriers, cálculos de subsidio complejos) sin revisar implicancias de performance.
- **Centralización vs autonomía** — se intentó una plataforma federal monolítica que requería decisiones de 36 estados distintos.

## Factores contribuyentes (del OEI)

Más allá de los 10 lessons, el OEI identifica causas estructurales:

1. **Contratación federal** — reglas de procurement que favorecen el contratista más barato sobre el más capaz.
2. **Múltiples contratistas sin integrador** — CMS actuó como integrador sin capacidad técnica.
3. **Regulación cambiante** — el scope técnico cambiaba con cada regulación subsidiaria.
4. **Capacidad ingenieril interna limitada** — CMS tenía poco staff técnico senior para supervisar.
5. **Plazos políticos no-negociables** — la fecha 1-oct-2013 era inmovible, y toda calibración de alcance debía hacerse sobre esa restricción.

Relación con [[Architecture Business Cycle]]: los *stakeholders* políticos, la *development organization* (CMS + contratistas), y el *technical environment* (stack legacy gubernamental) presionaban en direcciones incompatibles. El arquitecto no tenía autoridad para balancear.

## Aplicación como kata ATAM

La consigna repartida en [[Clase 4 — ¿Cuándo diseñamos?]] propone simular **Fase 0 y Fase 1 de ATAM** como si fuéramos los arquitectos en 2012 (source: raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf). Ejercicios:

1. **Business drivers** — listar en orden los drivers que CMS debería haber declarado formalmente.
2. **Árbol de utilidad** — construir con (importancia, dificultad) para los top-10 escenarios.
3. **Identificar sensitivity points** — dónde están las decisiones-de-las-que-todo-depende.
4. **Identificar tradeoffs** — dónde se negocia un atributo contra otro.
5. **Recomendaciones** — qué decisión arquitectónica habría reducido riesgo con mayor impacto.

## Relación con otros conceptos

- **[[Cono de incertidumbre]]** — las estimaciones de 2010-2011 quedaron obsoletas cuando el scope creció, pero el plan no se ajustó.
- **[[BDUF vs YAGNI vs JEDUF]]** — se intentó BDUF (arquitectura federal definida arriba) pero sin la rigurosidad que BDUF exige para funcionar.
- **[[Architectural Guardrails]]** — no existían guardrails que disciplinaran a los múltiples contratistas.
- **[[Platform Engineering]]** — no había IDP; cada contratista reinventó su stack. El "tech surge" post-lanzamiento impuso guardrails ex-post.

## Qué aprendió el gobierno de EE.UU.

Post-Healthcare.gov se crearon:
- **US Digital Service (USDS)** — unidad tech interna en la Casa Blanca.
- **18F** — equipo de GSA con prácticas modernas de ingeniería.

Ambos institucionalizan muchas de las lecciones del reporte OEI.

## Pregunta a profundizar

¿Cómo se habría evaluado un Healthcare.gov moderno con [[Platform Engineering]] maduro? ¿El problema era arquitectura, proceso, o contratación?

## Fuentes y lecturas

- OEI-06-14-00350 — *HealthCare.gov: Case Study of CMS Management of the Federal Marketplace* (HHS Office of Inspector General, 2016).
- Brill — "Obama's Trauma Team" (Time, 2014) — crónica del tech surge.
- USDS / 18F — documentación oficial.
- Consigna *Caso Healthcare.gov* (cátedra Inge2, repartida en [[Clase 4 — ¿Cuándo diseñamos?]] del 2026-04-09).

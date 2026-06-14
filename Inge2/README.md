# Ingeniería de Software II — Wiki de estudio

Apuntes curados de **Ingeniería de Software II (ITBA, 2026-1C)**. Una base de conocimiento navegable sobre **las decisiones clave de diseño que dan vida a un proyecto de software**: cómo elegir entre alternativas, qué trade-offs hay detrás de cada decisión y en qué contexto conviene cada una.

Es una **copia publicable, de solo lectura**, de un vault de Obsidian. Está pensada para leerse en Obsidian (wikilinks `[[…]]`) o en cualquier visor de Markdown.

## Qué temas cubre

- **Arquitectura de software** — definición, Architecture Business Cycle, estilos arquitectónicos, Attribute Driven Design (ADD), modelo 4+1 y C4.
- **Atributos de calidad y evaluación** — ISO 25000, SLA/SLO/SLI, MTBF/MTTR, árbol de utilidad, métodos SAAM / ATAM / Lightweight ATAM.
- **Persistencia y datos** — bases relacionales, NoSQL, ORM, replicación, sharding, teorema CAP, OLAP/ETL, Map-Reduce, big data en tiempo real.
- **Integración de sistemas** — point-to-point, ESB, SOA y microservicios; patrones de Richardson (Saga, CQRS, Event Sourcing, API Gateway, Circuit Breaker, Service Mesh).
- **Proceso y diseño** — BDUF / YAGNI / JEDUF, emergent vs intentional design, guardrails, platform engineering, golden paths, ADRs.
- **Resúmenes de clase, ejercicios y parciales resueltos, y casos de estudio** (reales como Healthcare.gov y Twitter, y casos mock para practicar).

## Cómo navegarlo

1. **Empezá por [`wiki/index.md`](wiki/index.md):** es el catálogo completo, organizado por categoría (clases, conceptos, ejercicios, casos de estudio, fuentes, análisis), con una descripción por entrada.
2. Seguí los **wikilinks** `[[…]]` entre páginas para moverte entre conceptos relacionados; cada página cierra con una sección **"Ver también"**.
3. La **bitácora** de cambios está en [`wiki/log.md`](wiki/log.md).

> El contenido está en español, con terminología técnica en inglés cuando es la convención del área (dependency injection, bounded context, etc.).

## Más allá de esta materia

- Índice de todos los vaults de estudio del repo: [`../HOME.md`](../HOME.md).
- Estándar de formato de las páginas: [`../_estandar/DESIGN.md`](../_estandar/DESIGN.md).

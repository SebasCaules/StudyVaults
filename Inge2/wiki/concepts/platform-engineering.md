---
title: Platform Engineering
aliases:
  - "Platform Engineering"
  - "IDP"
  - "Internal Developer Platform"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [plataforma, idp, platform-engineering, golden-paths, devops]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[Architectural Guardrails]]"
  - "[[Golden Paths]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Emergent vs Intentional Design]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Caso Healthcare.gov]]"
---

# Platform Engineering

## ¿Qué es?

Disciplina que construye y opera **Internal Developer Platforms (IDPs)**: productos internos que **reducen la carga cognitiva** del ingeniero de aplicación, materializando los [[Architectural Guardrails]] como herramientas consumibles (source: raw/classes/Clase 4.pdf).

**No es DevOps renombrado.** DevOps es la filosofía; Platform Engineering es el equipo/producto que la **implementa a escala**. El rol del platform team es construir *la plataforma que los devs de producto usan* — tratarla como producto, con su propio roadmap y usuarios.

## El problema que resuelve

A escala, cada equipo de aplicación reinventa:
- CI/CD pipelines.
- Infra provisioning (terraform, k8s manifests).
- Observabilidad (logging, metrics, traces).
- Secrets management.
- Políticas de seguridad y compliance.

El resultado es **fragmentación** — mismos errores repetidos en 40 equipos, incidentes imposibles de correlacionar, duplicación de esfuerzo.

La IDP centraliza estas capabilities como **self-service**: crear un servicio, agregar una DB, exponer un endpoint se vuelve un comando/botón único.

## Ejemplos citados en clase (source: raw/classes/Clase 4.pdf)

- **Fury** — plataforma interna de MercadoLibre. Deploy, observabilidad, secrets, gobernanza, todo integrado.
- **Backstage** — framework open-source de Spotify para IDPs. Donado a CNCF. Permite construir el "single pane of glass" de un org.
- **Jarvis** — plataforma interna (industria).

Cada uno es un instance del mismo patrón: *plataforma como producto interno*.

## Conceptos clave

### Golden Paths

**Caminos "felices"** pre-construidos para casos de uso comunes:

- "Crear un nuevo microservicio Java" → template pre-configurado con todo: repo, CI, deploy, observabilidad, auth, healthchecks.
- "Agregar una base de datos Postgres" → provisionada vía la plataforma, con backups, encriptación, monitoring ya activados.
- "Exponer un endpoint público" → pasa por el API Gateway, tiene rate limiting, auth, logs estructurados.

Los golden paths hacen que **el camino correcto sea también el camino fácil**. Quien sale del golden path acepta conscientemente una carga operacional extra — no se sale por accidente.

### Single Pane of Glass

Una **sola UI** donde el dev ve todo lo relevante para sus servicios:

- Deployments recientes y su estado.
- Métricas, logs, traces enlazados por `trace-id`.
- Alertas activas.
- Costos del servicio.
- Dependencies (servicios upstream/downstream).
- Documentación generada (ADRs, runbooks, APIs).

Evita el "context switch tax" de saltar entre Jenkins, Grafana, PagerDuty, AWS Console, Confluence, Jira, etc.

### Self-service

La plataforma **no es una mesa de entrada** — es un producto que los devs consumen sin tickets ni esperas. Filosofía: *"you build it, you run it, we pave the road"*.

## Platform team como product team

Diferencia clave con el enfoque tradicional de Ops:

| Dimensión | Ops tradicional | Platform team |
|---|---|---|
| Modelo | Ticket queue | Product backlog |
| Relación con equipos | Proveedor ("hacenos el deploy") | Cliente ("usá la plataforma") |
| Medida de éxito | Uptime del entorno | Adoption, NPS interno, tiempo a producción |
| Evolución | Reactiva (tickets) | Proactiva (roadmap) |

Ver *Team Topologies* (Skelton & Pais) — modela el platform team como un **topology primitivo**.

## Costo organizacional

No es gratis:
- Requiere un equipo dedicado (5-15 personas según tamaño del org).
- La IDP misma necesita madurar — los primeros 6-12 meses no rinden.
- Riesgo de over-engineering: construir plataforma para el 1% edge case y no para el 99% común.
- Requiere "consumer research" interno — si los devs no la adoptan, falla.

En organizaciones chicas (<20 devs), Platform Engineering es **overkill** — un par de convenciones y scripts compartidos alcanzan.

## Madurez: escalera de adopción

1. **Silos** — cada equipo resuelve todo localmente.
2. **Shared ops team** — un equipo Ops que atiende tickets.
3. **Internal tools** — scripts compartidos, templates, wiki de best-practices.
4. **Platform** — IDP con self-service, golden paths, single pane of glass.
5. **Platform as product** — platform team con métricas de adopción, NPS interno, roadmap.

## Relación con [[Architectural Guardrails]]

Guardrails son las **reglas**; la IDP es la **estructura que las hace cumplir por construcción**. Sin IDP, guardrails son doc; con IDP, son ley física del ecosistema interno.

## Anti-patrones

- **Platform ivory tower** — platform team desconectado de los devs reales, construye features que nadie pide.
- **Platform como prisión** — cero flexibilidad fuera del golden path; los devs migran a shadow infra.
- **Platform como free-for-all** — no hay opinión, ofrece todo, nadie sabe qué usar.

## Pregunta a profundizar

¿En qué punto del crecimiento organizacional conviene empezar a invertir en Platform Engineering? Señales tempranas (N° de equipos, fragmentación de tooling, tiempo a first-deploy de un nuevo servicio).

## Fuentes y lecturas

- Skelton, Pais — *Team Topologies*, cap. sobre platform teams.
- Humanitec — *State of Platform Engineering Report* (anual).
- Backstage docs (backstage.io).
- CNCF Platforms White Paper.
- Kim et al. — *The DevOps Handbook*, cap. sobre platform teams.

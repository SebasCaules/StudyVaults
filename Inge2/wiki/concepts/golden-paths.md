---
title: Golden Paths
type: concept
aliases:
  - "Golden Paths"
  - "Golden Path"
  - "Camino dorado"
created: 2026-05-06
updated: 2026-05-06
tags: [golden-paths, platform-engineering, idp, productividad, paved-road]
sources: []
related:
  - "[[Platform Engineering]]"
  - "[[Architectural Guardrails]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Caso Healthcare.gov]]"
---

# Golden Paths

## Idea

Un **Golden Path** (a veces *paved road*, *paved path*) es un **camino feliz pre-construido** dentro de la organización para realizar una tarea común de desarrollo: crear un servicio nuevo, agregar una base de datos, exponer una API, deployar a un entorno. Es la opción **default + fácil + bendecida + observada** para la mayoría de los casos.

El concepto fue popularizado por **Spotify** alrededor de 2018 como parte de su engineering culture, y formalizado en la práctica de [[Platform Engineering]] que construye **IDPs (Internal Developer Platforms)** para materializarlos.

## Por qué importa

Sin Golden Paths:
- Cada equipo reinventa cómo crear un servicio: stack distinto, observabilidad incompatible, deploys manuales.
- Carga cognitiva enorme para devs nuevos: cada tarea común requiere arqueología.
- Inconsistencia: 17 maneras de hacer logging significan 17 superficies de bug y de migración.
- Compliance imposible: si cada servicio es distinto, ¿cómo se aplica una regla nueva (PII, auditing) sin proyecto migratorio masivo?

Con Golden Paths:
- *"Crear un servicio nuevo"* es un comando único (`platform create-service my-svc`) que produce: repo con CI configurado, deploy a staging, dashboard de observabilidad, alertas mínimas, integraciones con auth y secrets.
- El equipo de aplicación se concentra en la **lógica de negocio**, no en infraestructura recurrente.
- Cuando una regulación cambia, la plataforma se actualiza una vez y los servicios la heredan.

## Relación con [[Architectural Guardrails]]

Los Golden Paths son la **encarnación operacional** de los guardrails. Un guardrail dice *"todo servicio debe exponer métricas en `/metrics`"*; el Golden Path **lo proporciona automáticamente** al crear el servicio. El dev no decide; la plataforma se lo da resuelto.

Diferencia útil:
- **Guardrails** = reglas (qué tiene que pasar).
- **Golden Paths** = el camino más fácil para cumplirlas (cómo se logra sin pensar).

Una organización con guardrails sin golden paths obliga a cada equipo a implementarlos a mano: la regla existe pero el cumplimiento es costoso. Una organización con golden paths sin guardrails tiene defaults convenientes pero sin disciplina.

## Cuándo desviarse del Golden Path

El path es *golden*, no *forzoso*. La arquitectura de plataforma sana permite **opt-out justificado**:
- Caso especializado donde el default no aplica (ej. servicio con SLAs extremos que requiere su propio storage tuneado).
- Investigación o experimentación.
- Migración legacy.

La regla del [[Platform Engineering]] sano: **el path debe ser el más fácil**. Si desviarse es más fácil que seguirlo, la plataforma fracasó.

## Single Pane of Glass

Concepto hermano: una **única UI** donde el dev ve todo lo de su servicio (deploys, logs, métricas, costos, alertas, dependencias). Los Golden Paths producen los servicios; el Single Pane of Glass los muestra.

Productos que materializan ambos:
- **Backstage** (Spotify, ahora CNCF) — software catalog + golden paths via *templates*.
- **Fury** (Mercado Libre) — plataforma interna mencionada en clase.
- **Jarvis** y otras plataformas internas no públicas.
- **Humanitec, Port** — productos comerciales del ecosistema platform engineering.

## Antipatrones

- **Golden Path obligatorio sin escape válido** — convierte la plataforma en cárcel; los equipos la sortean creando shadow IT.
- **Golden Path sin observabilidad de adopción** — la plataforma no sabe quién la usa, qué falla, qué evitan.
- **Múltiples Golden Paths que compiten** — *"para crear servicio podés usar tooling A, B o C"* — no hay path dorado, hay paths de bronce.
- **Golden Path actualizado raramente** — los devs adoptan workarounds porque el camino oficial está obsoleto.

## Relación con [[Caso Healthcare.gov]]

El reporte OEI identifica que cada contratista reinventó su propio stack y procesos. Un **gobierno con Golden Paths** (como los que USDS y 18F construyeron post-2014) habría provisto un camino estándar para servicios federales: stack común, observabilidad, security defaults. La existencia misma de USDS y 18F es la respuesta institucional al problema *"no había golden path para servicios del gobierno federal"*.

## Pregunta a profundizar

¿Cuándo una organización es lo suficientemente grande para que invertir en Golden Paths valga la pena? Bajo cuántos equipos / cuántos servicios el ROI cruza el umbral. Hipótesis: entre 5-10 servicios productivos y 2+ equipos compartiendo infraestructura, ya conviene formalizar.

## Lecturas complementarias

- Spotify Engineering blog — *"How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem"*.
- Skelton & Pais, *Team Topologies* (2019) — *Platform Team* y su relación con Golden Paths.
- ThoughtWorks Technology Radar — entradas sobre *"Paved roads"*.
- Backstage docs — *Software Templates* y *TechDocs*.
- Humanitec, *State of Platform Engineering Report* — datos de adopción.

---
title: C4 Model
aliases:
  - "C4 Model"
  - "C4"
  - "C4 Brown"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [documentacion, arquitectura, c4, brown, diagramas]
sources:
  - "raw/classes/Clase 3.pdf"
related:
  - "[[Clase 5 — Documentación de arquitecturas]]"
  - "[[Modelo 4+1]]"
  - "[[Arquitectura de software — definición]]"
  - "[[Árbol de utilidad]]"
  - "[[ADR — Architecture Decision Record]]"
---

# C4 Model

## ¿Qué es?

Sistema de diagramación propuesto por **Simon Brown** (*Software Architecture for Developers*, ~2018) que estructura la documentación en **cuatro niveles de zoom**: Context, Containers, Components, Code (source: raw/classes/Clase 3.pdf).

El nombre viene de las iniciales de los niveles (las cuatro C).

## Los cuatro niveles

### C1 — System Context

**Audiencia:** cualquiera (técnico o no).

**Qué muestra:**
- El sistema como una caja única.
- Usuarios (personas) que interactúan con él.
- Sistemas externos con los que dialoga.

**Objetivo:** *"¿cómo encaja este sistema en el mundo?"*.

**Granularidad:** máxima — el sistema es 1 caja.

### C2 — Containers

**Audiencia:** técnicos (desarrolladores, ops).

**Qué muestra:**
- Unidades deployables del sistema: apps web, APIs, bases de datos, cachés, colas, jobs batch, mobile apps.
- Tecnología principal de cada contenedor (Postgres, Spring Boot, Next.js, Kafka).
- Comunicación entre contenedores (REST/gRPC/eventos).

**Objetivo:** *"¿qué piezas deployables lo componen y cómo hablan?"*.

**Granularidad:** un nivel más fino — cada caja es algo que corre como proceso/servicio.

**Nota:** "container" en C4 **no** significa "Docker container" — significa *unidad ejecutable*. Puede coincidir con un Docker container, pero también con una app mobile nativa o un lambda.

### C3 — Components

**Audiencia:** desarrolladores del sistema.

**Qué muestra:**
- Módulos lógicos dentro de un contenedor — controllers, services, repositories, adapters.
- Responsabilidades y dependencias entre ellos.

**Objetivo:** *"¿cómo se estructura el código dentro de este contenedor?"*.

**Granularidad:** agrupaciones lógicas de clases — no clases individuales.

### C4 — Code

**Audiencia:** desarrolladores que tocan ese componente.

**Qué muestra:**
- Clases, interfaces, relaciones concretas en código — típicamente con UML.

**Objetivo:** *"¿cuál es la estructura interna de este componente?"*.

**Granularidad:** máxima — se parece a un diagrama UML de clases.

**Opinión de Brown:** este nivel suele **no hacer falta** documentarlo — el código es su propia documentación, y mantener diagramas de clases sincronizados es costoso. Dibujar C1-C2-C3 es obligatorio; C4 sólo cuando aporta valor.

## Metáfora del zoom

```
C1 Context      ::  mapa del mundo — tu sistema es un pin
C2 Containers   ::  mapa del país   — los contenedores son ciudades
C3 Components   ::  mapa de ciudad  — los componentes son barrios
C4 Code         ::  plano de edificio — las clases son habitaciones
```

Lector decide a qué nivel mirar según su pregunta.

## Notación

Brown es deliberadamente laxo: cualquier notación sirve siempre que se siga la **regla de zoom**. Pero hay tooling dedicado:

- **Structurizr** (del propio Brown) — DSL textual para generar los 4 niveles.
- **PlantUML con stdlib C4** — cajas estándar con colores y metadatos.
- **Mermaid** — soporte creciente para C4.
- **draw.io / Lucidchart** — dibujo manual con shapes C4.

Preferencia cátedra: textual (Structurizr/PlantUML) para que los diagramas vivan en git y evolucionen con el código (source: raw/classes/Clase 3.pdf).

## Elementos gráficos estándar

- **Persona** (stick figure) — usuario humano.
- **Software System** (caja) — el sistema o externos.
- **Container** (caja con tipo: "Web App", "DB") — unidad deployable.
- **Component** (caja más fina) — módulo dentro de un contenedor.
- **Relationship** (flecha etiquetada con acción y tecnología) — "Consulta vía REST/JSON".

## Comparación con [[Modelo 4+1]]

| Dimensión | C4 | 4+1 |
|---|---|---|
| Eje organizador | Nivel de zoom | Tipo de stakeholder |
| Niveles | 4 (C1→C4) | 4 vistas + escenarios |
| Notación | Libre, tooling moderno | UML |
| Curva de adopción | Baja | Alta |
| Expresa trade-offs y QAs | Débil — hay que añadirlo | Débil — hay que añadirlo |
| Encaja en | Wikis ágiles, microservicios | Documentación formal |

Ninguno de los dos cubre explícitamente atributos de calidad ni ADRs — se complementan con [[Árbol de utilidad]] y [[ADR — Architecture Decision Record]].

## Anti-patrones

- **Dibujar los 4 niveles siempre**, aunque el sistema sea chico. Regla: producir sólo los niveles que *alguien* va a leer.
- **C4 como reemplazo completo** de documentación arquitectónica — no cubre decisiones, trade-offs, ni QAs.
- **Diagramas desactualizados** — si el C2 no coincide con lo que se deployea, peor que no tenerlo.

## Enfoque híbrido recomendado

Combinar:
- **C4 C1-C2** como diagramas vivos en el repo.
- **Escenarios clave** (inspirados en la +1 de [[Modelo 4+1]]) narrados arriba de los diagramas.
- **ADRs** para capturar decisiones arquitectónicas significativas.
- **Árbol de utilidad** para trazar atributos de calidad.

## Pregunta a profundizar

¿Cómo mantener sincronizado un C2 con la realidad cuando la infraestructura cambia semanalmente (microservicios, serverless)? Generación automática desde Terraform/Kubernetes manifests — ¿existe un standard?

## Fuentes y lecturas

- Brown, *The C4 model for software architecture* (c4model.com).
- Brown, *Software Architecture for Developers* (Leanpub).
- Structurizr docs (structurizr.com).

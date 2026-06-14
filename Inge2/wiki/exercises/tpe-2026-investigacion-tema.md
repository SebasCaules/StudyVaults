---
title: "TPE 2026-1C — Investigación y presentación de un tema"
aliases:
  - "TPE 2026-1C — Investigación y presentación de un tema"
  - "TPE 2026"
  - "TPE"
  - "Trabajo Práctico Especial 2026-1C"
type: exercise
created: 2026-05-29
updated: 2026-05-29
tags: [ejercicio, tpe, trabajo-practico, presentacion, investigacion, atributos-de-calidad]
sources:
  - "raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[Architecture Business Cycle]]"
  - "[[Árbol de utilidad]]"
  - "[[Platform Engineering]]"
  - "[[Golden Paths]]"
  - "[[Architectural Guardrails]]"
  - "[[Criterios de hosting y data residency]]"
  - "[[Teorema CAP]]"
  - "[[Replicación de BD]]"
  - "[[OLAP y ETL]]"
  - "[[Map-Reduce]]"
  - "[[Off-line vs Online computation]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[TP general]]"
---

# TPE 2026-1C — Investigación y presentación de un tema

## Rol

**Trabajo Práctico Especial** del curso: investigar un tema del catálogo de la cátedra y exponerlo oralmente en **15 minutos estrictos** (cumplido el tiempo, se suspende la presentación) (source: raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf).

A diferencia del [[TP general]] —que es un ejercicio de *diseño* de arquitectura sobre un dominio dado— este TPE es de **investigación + exposición**: el grupo elige una tecnología o concepto y lo presenta. No es un tutorial: la consigna exige encuadrarlo con la **lente de la materia**.

## Enunciado literal

> Investigar y hacer una presentación de un tema elegido de entre los propuestos por la cátedra. El tiempo de exposición deberá ser de 15 minutos por grupo (**estricto, cumplido el tiempo se suspende la presentación**).
>
> Todos los temas deben ser presentados con el mismo enfoque de la materia, es decir, basado en la **toma de decisiones orientados al negocio** y considerando los **atributos de calidad**.
>
> Los alumnos recursantes no deben presentarlo, pero sí enviar un correo a la cátedra indicando el tema y cuatrimestre en el que presentaron el trabajo para repetir la nota.
>
> **Entrega:** 10 de Junio 23:59.
> **Presentación Oral:** 11 de Junio en clase.
> **Grupos:** 4 de 5 integrantes y 3 de 4 integrantes.
>
> Se proponen dos tipos de temas:
> 1. **Técnicos:** deben incluir una explicación de la herramienta o tecnología (con un nivel de detalle que muestre la investigación realizada) y una prueba de concepto con un caso concreto. Considerar 5 minutos para la demo, y 10 la exposición.
> 2. **Funcionales:** deben incluir una explicación del concepto, ejemplos que muestren la utilidad, y una comparativa entre alternativas con pros y contras.
>
> Cada equipo debe elegir un tema, sin repetir temas entre equipos. Los temas son asignados **FIFO** según se solicitan vía correo electrónico a **todos los docentes de la cátedra**.
>
> **Temas técnicos:** 1. Domain Specific Languages — 2. K6 — 3. Infrastructure as code — 4. Apache Airflow.
> **Temas funcionales:** 1. Service Mesh — 2. Multi Cloud Strategy — 3. Platform Engineering — 4. Staging Environments.

(source: raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf)

## La restricción que manda: enfoque de la materia

El criterio de corrección no es "cuánto sabés de la herramienta", sino **cómo encuadrás la decisión de usarla**. El segundo párrafo del enunciado obliga a presentar todo "basado en la toma de decisiones orientadas al negocio y considerando los atributos de calidad" — es decir, la misma lente del [[Architecture Business Cycle]] y del [[Árbol de utilidad]], aplicada a una tecnología en vez de a un caso de diseño.

En la práctica, toda presentación debería responder:

1. **¿Qué problema de negocio resuelve?** No "qué hace", sino *por qué a alguien le importa pagar por esto*.
2. **¿Qué [[Atributos de calidad]] mueve?** (performance, scalability, maintainability, security, availability…) y a costa de cuáles otros — el trade-off explícito.
3. **¿Cuándo NO conviene?** Coherente con el espíritu anti-*silver-bullet* del curso (Brooks, "No Silver Bullet"). Una presentación que sólo vende la tecnología está incompleta.
4. **¿Contra qué se compara?** Las alternativas con sus pros y contras (obligatorio en los temas funcionales; recomendable en los técnicos).

## Dos tracks, dos entregables distintos

| | **Técnicos** | **Funcionales** |
|---|---|---|
| Estructura | Explicación detallada + **prueba de concepto** | Explicación del concepto + ejemplos + **comparativa** |
| Reparto de los 15 min | 10 expo + **5 demo** | 15 de exposición/comparativa |
| Riesgo principal | Que la demo falle o coma el tiempo | Quedarse en lo abstracto sin ejemplos concretos |

## Catálogo de temas — de qué se trata cada uno

Descripción breve de cada tema con la lente de la materia: qué es, qué decisión de negocio plantea, qué [[Atributos de calidad|atributo de calidad]] mueve, y cómo se demuestra/compara.

### Técnicos (explicación + demo / PoC)

**1. Domain Specific Languages (DSL)**
Un lenguaje "a medida" de un dominio en vez de uno de propósito general — p. ej. SQL para queries, Gherkin para tests, un mini-lenguaje para reglas de negocio. *Decisión:* invertir en construir un DSL para que expertos del dominio (no solo programadores) expresen lógica. *Atributo:* Maintainability y expresividad; el costo es construir y mantener la herramienta misma. Cercano al *ubiquitous language* de DDD. Demo natural: un DSL chico parseado/interpretado en vivo. (Sin página propia en el wiki todavía.)

**2. K6**
Herramienta de *load testing* (scripts en JavaScript) para simular miles de usuarios y medir cómo responde el sistema bajo carga. *Decisión:* cuantificar antes de prometer. *Atributo:* Performance y Scalability — es el instrumento para validar tus [[SLA, SLO, SLI]] y ver dónde se cae el p95/p99 ([[MTBF y MTTR]]). Demo natural: correr carga contra un endpoint y mostrar las métricas.

**3. Infrastructure as Code (IaC)**
Definir la infraestructura (servidores, redes, bases) en archivos versionados (Terraform, Pulumi) en vez de configurar a mano. *Decisión:* reproducibilidad y trazabilidad de entornos. *Atributo:* Maintainability y fiabilidad de despliegue; materializa los [[Architectural Guardrails]] como código y es pieza central de una [[Platform Engineering|IDP]]. Demo: levantar/destruir un recurso desde un archivo.

**4. Apache Airflow** · ⭐ **TEMA ELEGIDO POR EL GRUPO** (track técnico)
Orquestador de *pipelines* de datos: definís flujos de tareas (DAGs) que corren en orden y horario. *Decisión:* cuándo procesar en batch/offline vs online ([[Off-line vs Online computation]]). *Atributo:* ligado a [[OLAP y ETL]] y [[Map-Reduce|procesamiento de datos]]. Demo: un DAG simple ejecutándose.
→ **Entregable terminado** (presentación + demo ejecutable) en el repo `raw/TPE/AirflowDemo/`; companion del wiki en **[[TPE — Apache Airflow (investigación + PoC)]]**. **Pendiente:** reclamar el tema por mail a todos los docentes (asignación FIFO).

### Funcionales (concepto + ejemplos + comparativa pros/contras)

**1. Service Mesh**
Capa de infraestructura (Istio, Linkerd) que gestiona la comunicación *entre* microservicios: encriptación mTLS, reintentos, observabilidad, control de tráfico — sin tocar el código de cada servicio. *Decisión:* sacar esa lógica de cada servicio y centralizarla. *Atributos:* Security ([[Mecanismos de seguridad]]), observabilidad y fiabilidad en arquitecturas [[Estilos arquitectónicos|distribuidas]]. Comparativa típica: Istio vs Linkerd vs sin mesh.

**2. Multi Cloud Strategy**
Usar varias nubes (AWS + GCP + Azure) en vez de una. *Decisión:* evitar *vendor lock-in*, cumplir [[Criterios de hosting y data residency|data residency]], o resiliencia ante caída de un proveedor — a costa de mucha complejidad. *Atributos:* Availability y portabilidad; choca con [[Teorema CAP]] y [[Replicación de BD]] cuando los datos cruzan nubes.

**3. Platform Engineering**
Construir una plataforma interna (IDP) que les da a los devs self-service: crear un servicio, una base o un deploy con un comando, por [[Golden Paths|caminos pre-armados]]. *Decisión:* tratar la infra como producto interno para bajar la carga cognitiva. **Ya tiene página completa y madura en el wiki** ([[Platform Engineering]]): IDPs, golden paths, single pane of glass, escalera de madurez, anti-patrones. El track funcional pide "concepto + ejemplos + comparativa", que es justo cómo está escrita esa página → es el tema de menor esfuerzo marginal.

**4. Staging Environments**
El o los entornos intermedios (staging, QA, pre-prod) entre el desarrollo del programador y producción. *Decisión:* cuánta *paridad* con prod vale la pena pagar para atrapar bugs antes de salir. *Atributos:* fiabilidad de release y manejo de riesgo; ligado a CI/CD. Comparativa: staging fiel vs entornos efímeros por feature vs testing en prod con feature flags. (Sin página propia en el wiki todavía.)

## Logística operativa

| Ítem | Dato |
|---|---|
| Entrega | 10 de junio 23:59 |
| Oral | 11 de junio en clase |
| Grupos | 4 de 5 + 3 de 4 integrantes (7 grupos, 32 alumnos) |
| Asignación | FIFO por correo a **todos** los docentes, sin repetir tema |
| Recursantes | No presentan; mail con tema+cuatrimestre para repetir nota |

**Consecuencia del FIFO:** hay 8 temas para 7 grupos (uno queda libre), pero como es por orden de llegada y sin repetir, conviene reclamar el tema por mail apenas el grupo decida.

## Errores típicos a evitar

- **Presentar un tutorial de la herramienta** sin la lente de negocio + atributos de calidad. Es el error que la consigna previene explícitamente.
- **No decir cuándo NO aplica.** El curso es anti-*silver-bullet*; toda recomendación necesita su contexto de no-aplicación.
- **Pasarse de los 15 minutos.** Es estricto: cumplido el tiempo, se suspende. En el track técnico, ensayar la demo con margen para que no se coma la exposición.
- **Comparativa funcional sin criterios.** "Pros y contras" sin un eje de comparación (qué atributo de calidad optimiza cada alternativa) no dice nada.

## Pregunta a profundizar

Para el tema que elija tu grupo: ¿cuál es el **escenario de [[Árbol de utilidad|árbol de utilidad]]** que mejor justifica adoptar esta tecnología, y cuál es el escenario donde adoptarla sería un error? Tener esos dos escenarios concretos es lo que separa una presentación "de investigación" de una "con la lente de la materia".

## Relación con otros materiales

- [[TP general]] — el otro trabajo práctico, de naturaleza distinta (diseño-integrador vs investigación-exposición).
- [[Atributos de calidad]] y [[Architecture Business Cycle]] — la lente obligatoria de toda presentación.
- [[Platform Engineering]] — único tema del catálogo que ya tiene página propia.

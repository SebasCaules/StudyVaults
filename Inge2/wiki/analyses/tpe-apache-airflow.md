---
title: "TPE — Apache Airflow (investigación + PoC)"
aliases:
  - "TPE — Apache Airflow (investigación + PoC)"
  - "Apache Airflow"
  - "Airflow"
  - "AirflowDemo"
type: analysis
created: 2026-05-29
updated: 2026-05-29
tags: [tpe, airflow, orquestacion, batch, etl, data-pipelines, dags, demo]
sources:
  - "raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf"
  - "raw/TPE/AirflowDemo/presentacion.md"
  - "raw/TPE/AirflowDemo/demo/dags/reporte_ventas_diario.py"
  - "raw/TPE/AirflowDemo/demo/docker-compose.yaml"
  - "raw/TPE/AirflowDemo/demo/README.md"
  - "raw/TPE/AirflowDemo/README.md"
  - "raw/TPE/AirflowDemo/CLAUDE.md"
related:
  - "[[TPE 2026-1C — Investigación y presentación de un tema]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Off-line vs Online computation]]"
  - "[[OLAP y ETL]]"
  - "[[Map-Reduce]]"
  - "[[SLA, SLO, SLI]]"
  - "[[Evolución del deployment — VM, Containers, Kubernetes, Serverless]]"
  - "[[Estilos arquitectónicos]]"
---

# TPE — Apache Airflow (investigación + PoC)

> **Contexto TPE:** tema **técnico** del grupo. Entregable = explicación + **prueba de concepto** (≈10 min teoría + 5 min demo, 15 estrictos), con encuadre **decisión de negocio + atributos de calidad** (source: raw/TPE/Ingesoft II - TPE - 2026 - 1C.pdf). Ver consigna en [[TPE 2026-1C — Investigación y presentación de un tema]].

> **Estado: entregable terminado.** El grupo ya tiene un repo completo y ejecutable — presentación (13 diapositivas) + demo en Docker — clonado en `raw/TPE/AirflowDemo/`. Esta página es el **companion** del repo: lo resume, lo conecta con el corpus de la materia y deja el checklist para presentar. El material original vive en el repo; acá va el destilado.

## 0. El repo del grupo (entregable concreto)

Estructura (source: raw/TPE/AirflowDemo/README.md):

| Archivo | Qué es |
|---|---|
| `presentacion.md` / `.pdf` | Presentación completa, 13 diapositivas, ~9:30 de teoría |
| `demo/` | PoC ejecutable sobre Docker |
| `demo/dags/reporte_ventas_diario.py` | El DAG (6 tasks, retries, params) |
| `demo/data/input/ventas.csv` · `ventas_corrupto.csv` | Dataset válido + dataset roto (para la demo de validación) |
| `demo/docker-compose.yaml` | Stack: Postgres + Airflow (LocalExecutor) |
| `demo/README.md` | Guía de puesta en marcha + guion de la demo |
| `CLAUDE.md` | Spec con la que se generó (enfoque ADD obligatorio) |

**Levantar la demo** (source: raw/TPE/AirflowDemo/demo/README.md):
```bash
cd raw/TPE/AirflowDemo/demo
docker compose up -d           # Postgres + scheduler + webserver
# UI: http://localhost:8080  (admin / admin)
```
Requisitos: Docker Desktop, puerto 8080 libre, ~2 GB RAM. **Levantar el stack ANTES de presentar** — los 5 min son sólo para ejecutar el DAG, no para el arranque.

## 1. Qué es (en una frase)

Apache **Airflow** es una plataforma open-source para **crear, programar y monitorear *workflows* batch como código** (Python). Su unidad es el **DAG** (Directed Acyclic Graph): un grafo dirigido sin ciclos de tareas con dependencias. Nació en Airbnb (2014, Maxime Beauchemin), entró a la Apache Software Foundation (2016) y es Top-Level Project desde 2019 (source: raw/TPE/AirflowDemo/presentacion.md, diapositiva 3).

Lema mental: **"workflows as code"** y **"Airflow orquesta, no computa"**.

## 2. La tesis de la presentación (lo que se corrige)

La charla NO es descriptiva; es una **decisión arquitectónica** analizada con [[Attribute Driven Design|ADD]] (source: raw/TPE/AirflowDemo/CLAUDE.md). El hilo:

1. **Problema de negocio (diap. 2):** cuando la empresa depende de sus pipelines, el modelo "scripts + `cron`" se rompe — dependencias implícitas, **fallos silenciosos**, sin reintentos, conocimiento tribal, sin trazabilidad. El riesgo es *organizacional*, no técnico: decisiones sobre datos incompletos, incumplimiento regulatorio, horas apagando incendios.
2. **Qué es / orquestación vs automatización (diap. 3):** `cron` *automatiza* una tarea; Airflow *orquesta* muchas interdependientes (orden, dependencias, reintentos, paralelismo, recuperación, observabilidad).
3. **Arquitectura (diap. 4):** la idea-fuerza es la **separación planificación (Scheduler) / ejecución (Executor + Workers)**, con la **Metadata DB como única fuente de verdad** (y único *single point of failure*).
4. **Decisión arquitectónica (diap. 6):** centralizar una *capability transversal* (scheduling, retries, auditoría) en una plataforma en vez de reimplementarla mal en cada script — un "build vs. adopt".
5. **Trade-offs (diap. 8-9):** ningún atributo es gratis; Airflow **no es** motor de cómputo ni streaming.
6. **Cierre (diap. 12):** *Decisión arquitectónica = atributos de calidad ganados − costos operativos asumidos.*

## 3. Arquitectura y conceptos núcleo (diap. 4-5)

- **DAG** — el workflow completo (dirigido, acíclico). **Task** — un nodo. **Operator** — la plantilla de qué hace la task (acá vía TaskFlow API, `@task`). **Dependency** — la arista (`a >> b`). **Scheduling** — cuándo corre (`@daily`). **Trigger** — qué inicia el run. **Retry** — reintentos con backoff.
- **Scheduler** — parsea DAGs, resuelve dependencias, encola. **Executor** — *cómo/dónde* corren las tasks (`Local` → `Celery` → `Kubernetes`). **Workers** — ejecutan. **Metadata DB** — Postgres, fuente de verdad. **Web UI** — observabilidad y disparo manual.
- **Decisión clave:** pasar de `LocalExecutor` a `Celery`/`KubernetesExecutor` para escalar **no requiere tocar el DAG** — la separación planificación/ejecución es lo que habilita la [[Evolución del deployment — VM, Containers, Kubernetes, Serverless|escalabilidad]] (source: raw/TPE/AirflowDemo/demo/docker-compose.yaml).

## 4. Atributos de calidad — perspectiva ADD (diap. 7-8)

Esta es la columna vertebral para la nota. La presentación mapea Airflow a 6 [[Atributos de calidad|atributos]] y, crucialmente, su **contracara** (source: raw/TPE/AirflowDemo/presentacion.md, diap. 7-8):

| Atributo | Cómo lo fortalece | El compromiso (no es gratis) |
|---|---|---|
| **Fault Tolerance** | Retries automáticos, estado persistido, re-run selectivo de tasks fallidas | La Metadata DB es **single point of failure** → HA = más complejidad |
| **Manageability** | Web UI, logs centralizados, métricas (StatsD/OTel) | Sin naming/ownership/alerting, el historial es ruido |
| **Auditability** | Historial persistente: qué corrió, cuándo, con qué resultado | Requiere disciplina de convenciones |
| **Interoperability** | Cientos de *providers* (DBs, AWS/GCP/Azure, Spark, K8s) | — capa de integración, no de cómputo |
| **Scalability** | Cambiar el Executor sin reescribir DAGs | `Celery`/`K8s` agregan broker/clúster → superficie operativa |
| **Portability** | Mismo DAG en local/on-prem/cloud, contenedorizable | Dependencias Python + providers atan el entorno |

> **Frase a recordar (diap. 8):** *"Airflow no es un motor de cómputo distribuido — orquesta, no computa."* Meter procesamiento pesado dentro de las tasks lo convierte en cuello de botella; el cómputo se delega (Spark, dbt, el warehouse).

## 5. Cuándo NO / Trade-offs (diap. 9) — el anti-*silver-bullet*

**Resuelve:** dependencias complejas, scheduling confiable + retries + recuperación, observabilidad/auditoría, integración heterogénea.
**NO resuelve / NO es:**
- **No es motor de procesamiento** (eso es Spark/dbt/warehouse).
- **No es streaming en tiempo real** — es **batch**; para eventos continuos, Kafka/Flink (conecta con [[Off-line vs Online computation]]).
- **No es ETL visual low-code** (eso se acerca a NiFi).
- **No es trivial de operar** (scheduler, DB, workers, dependencias, upgrades).

## 6. Comparativa (diap. 11)

| Herramienta | Enfoque | Ventaja | Desventaja vs. Airflow |
|---|---|---|---|
| **Cron** | Scheduler de tareas | Trivial, ubicuo, cero infra | Sin dependencias, retries, UI ni auditoría |
| **Apache NiFi** | Dataflow visual | Bueno para streaming/ruteo, low-code | Menos batch-as-code; otra filosofía |
| **Prefect** | Orquestación moderna (Python) | API liviana, workflows dinámicos, DX | Ecosistema/madurez menor |
| **Dagster** | *Asset-oriented* | Foco en data assets, testing, lineage | Más nuevo; cambio de paradigma |

**Tesis (diap. 11):** no hay ganador absoluto, depende del driver. Streaming → NiFi; DX/dinámico → Prefect; data asset/lineage → Dagster. **Airflow gana en madurez, comunidad y ecosistema de providers** → opción "segura", menor riesgo de lock-in (gobernanza Apache); paga con API verbosa y peso operativo.

## 7. La demo — `reporte_ventas_diario` (5 min)

El DAG (source: raw/TPE/AirflowDemo/demo/dags/reporte_ventas_diario.py), flujo lineal de 6 tasks vía TaskFlow API:

```
leer_ventas → validar_datos → calcular_metricas → generar_reporte → guardar_reporte → notificar
```

- **Scheduling** `@daily` (arranca pausado, `catchup=False`). **Retries** `retries=2`, `retry_delay=15s`, backoff exponencial, en `default_args` compartidos.
- **Entrada:** `data/input/ventas.csv` → **Salida:** `data/output/reporte_ventas_<fecha>.txt`.
- **Params** (en "Trigger DAG w/ config"): `archivo` (apuntar al CSV roto) y `simular_fallo_transitorio` (forzar un fallo recuperable).
- *Cómputo trivial a propósito:* lo que se exhibe son las **capacidades del orquestador**, no las métricas.

**Guion en vivo** (source: raw/TPE/AirflowDemo/demo/README.md):
1. **Dependencias (1 min):** vista *Graph* → las 6 tasks y sus aristas; abrir el `.py` → "es código" + `default_args`.
2. **Ejecución + observabilidad (1.5 min):** activar y *Trigger*; ver las tasks ponerse verdes en *Grid/Graph*; abrir una task → *Logs*; mostrar el reporte en `data/output/`.
3. **Errores y retries (1.5 min):** elegir una variante —
   - **A (recomendada):** `{"simular_fallo_transitorio": true}` → `validar_datos` queda *up_for_retry* (amarillo) y **se recupera sola** tras ~15s. Mensaje: *los fallos transitorios se resuelven solos*.
   - **B:** `{"archivo": "ventas_corrupto.csv"}` → `validar_datos` agota retries y queda *failed* (rojo); las downstream no corren; en *Logs* se ve cada fila rechazada. Mensaje: *reintentar no arregla datos malos → fail-fast con trazabilidad*.
4. **Cierre (15 s):** Airflow no computó, **orquestó** — dependencias, retries, estado persistido, auditoría.

**Plan B sin UI** (si falla el proyector): `airflow dags test reporte_ventas_diario -c '{"archivo":"ventas_corrupto.csv"}'` dentro del contenedor.

## 8. Presupuesto de los 15 minutos

Teoría ≈ 9:30 (13 diapositivas) + demo 5:00 (source: raw/TPE/AirflowDemo/presentacion.md). Diapositivas que más pesan: Arquitectura (1:30), Problema de negocio (1:15), Atributos de calidad 1/2 y 2/2 (1:00 + 0:50), Trade-offs (1:00). **Margen ajustado** → ensayar con cronómetro; el corte de tiempo es estricto.

## 9. Checklist de presentación

- [ ] **Reclamar el tema por mail** a todos los docentes (FIFO) — *lo único con deadline de hoy*.
- [ ] `docker compose up -d` **antes** de entrar a presentar; verificar UI en `:8080`.
- [ ] Ensayar la teoría con cronómetro (margen contra 10 min).
- [ ] Ensayar la demo: variante A probada, reporte generándose, logs a la vista.
- [ ] Tener el **Plan B por CLI** listo por si falla el proyector/red.
- [ ] No caer en "tutorial": cada slide vuelve a *driver de negocio + atributo de calidad + costo*.

## 10. Pregunta a profundizar

¿Dónde está la frontera batch (Airflow) vs streaming (Kafka/Flink)? Muchos sistemas reales usan **ambos**: streaming para ingesta en vivo + Airflow para agregaciones y reprocesos nocturnos. Tener ese ejemplo eleva la charla de "una herramienta" a "una decisión arquitectónica".

## 11. Fuentes y lecturas

- **Repo del grupo:** `raw/TPE/AirflowDemo/` (presentación + demo).
- Documentación oficial — airflow.apache.org (Concepts, Executor, Best Practices).
- Astronomer — guías (astronomer.io/guides).
- Harenslak, de Ruiter — *Data Pipelines with Apache Airflow* (Manning).
- Kleppmann — *Designing Data-Intensive Applications*, caps. 10-11 (batch vs stream).

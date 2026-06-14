---
title: Replicación de BD
aliases:
  - "Replicación de BD"
  - "Replicación de bases de datos"
  - "Database replication"
  - "Primary-Secondary"
  - "Primary-Primary"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [replicacion, primario-secundario, primario-primario, master-slave, multi-master, escalabilidad]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Bases de datos relacionales]]"
  - "[[Sharding]]"
  - "[[Teorema CAP]]"
  - "[[Persistencia]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Atributos de calidad]]"
---

# Replicación de BD

## Para qué replicar

Tres motivaciones, no una:

1. **Escalabilidad de lectura** — distribuir read traffic entre N réplicas.
2. **Alta disponibilidad** — si el nodo primario cae, una réplica toma su lugar (failover).
3. **Localidad geográfica** — réplicas cerca del usuario reducen latencia.

La cátedra trata replicación dentro del marco más amplio de **escalabilidad de RDBMS**: opción horizontal antes de saltar a sharding (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Relacionales - Escalabilidad*).

## Modelos

### Primario–Secundario (Primary–Replica, antes Master–Slave)

> "Lo más común es que un sistema lea mucho más seguido de la base que lo que escribe." (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf)

Topología:
- **Un nodo Primario** acepta todas las escrituras.
- **N réplicas Secundarias** reciben los cambios en pseudo-tiempo real (replicación asincrónica via WAL streaming).
- Las N réplicas sirven **lecturas** independientemente.
- Ante falla del Primario, los Secundarios eligen entre ellos un nuevo Primario para seguir aceptando escrituras (failover automático en motores modernos).

Ventajas:
- **Es el modelo más ampliamente soportado** — todos los RDBMS serios lo implementan (Postgres, MySQL, Oracle, SQL Server).
- Operacionalmente sencillo: una sola dirección de propagación.
- Perfil natural para workloads read-heavy (≥ 80/20 lectura/escritura).

Limitaciones:
- **El primario es el cuello de botella de escritura** — escala con vertical scaling, no con N.
- **Lag de replicación** — las réplicas pueden estar atrás del primario (segundos en pseudo-real-time, mucho más bajo carga); las apps deben tolerar lecturas levemente obsoletas o leer del primario para datos críticos.
- **Failover no es instantáneo** — hay ventana de indisponibilidad de escritura durante elección y promoción.

### Primario–Primario (multi-master, Active-Active)

> "Si el cuello de botella son las escrituras, una replicación Primario–Primario permite escalar horizontalmente." (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf)

Topología:
- **Los N nodos son primarios** — todos aceptan lecturas y escrituras.
- Los cambios se propagan entre nodos en ambas direcciones.

Ventajas:
- Escala escrituras al ancho del cluster.
- Tolera caída de cualquier nodo sin failover (los demás siguen aceptando todo).

Costos enormes (que la cátedra subraya):

1. **Gestión de concurrencia explosiva.** Ejemplo del slide: ¿cómo se asignan autoincrementales únicos si 4 instancias hacen `INSERT` simultáneo? Soluciones: rangos pre-asignados, UUIDs, generación centralizada — todas con overhead.
2. **Requerimientos físicos elevados.** Las instancias deben estar **físicamente juntas**, conectadas por **fibra óptica**, y a veces requieren **OS o kernel module específico** (Oracle RAC, MySQL Galera).
3. **Overhead O(N²).** Un cluster de N nodos primarios es un grafo completo K_n: cada nodo se sincroniza con los otros (N-1). El overhead de coordinación crece como O(N²) mientras la capacidad útil crece como O(N). **Hay un techo duro al tamaño del cluster** — típicamente 8-16 nodos antes que la coordinación domine.
4. **No todos los motores lo soportan** — sólo Oracle RAC, MySQL Galera, CockroachDB, YugabyteDB, y similares.

## Replicación sincrónica vs asincrónica

Eje ortogonal a la topología:

- **Sincrónica**: el commit espera confirmación de N réplicas antes de retornar. Garantiza consistencia (no se pierde el dato en failover) a costa de **latencia** que crece con la peor red entre nodos.
- **Asincrónica**: el commit retorna apenas escribe en el primario; la propagación es best-effort. Mejor latencia, riesgo de **pérdida de datos** si el primario muere antes de propagar.
- **Semi-sincrónica**: espera confirmación de al menos K < N réplicas. Compromiso popular (MySQL semi-sync, Postgres synchronous_commit con quórum).

Esta decisión se mapea directo a [[Teorema CAP]]: sincrónica es CP-priorizante (espero o fallo); asincrónica es AP-priorizante (acepto, propago después).

## Decisiones canónicas

| Decisión | Opciones | Recomendación cátedra |
|---|---|---|
| ¿Replicación o no? | Sin replicación / P-S / P-P | **Default: P-S asincrónica.** Cubre la mayoría de casos con el menor costo operativo. |
| ¿Cuándo escalar a P-P? | P-S vs P-P | Sólo si el cuello de botella es **escritura** (no lectura) y se está dispuesto a pagar fibra + DBAs + complejidad O(N²). |
| ¿Sincrónica o asincrónica? | Async / Sync / Semi-sync | Async para read-replicas; semi-sync para alta disponibilidad con tolerancia a pérdida acotada; sync sólo para sistemas que no pueden perder ni una transacción y aceptan latencia variable. |
| ¿Cuándo abandonar replicación de RDBMS y migrar a NoSQL? | Seguir creativo con RDBMS / migrar | Cuando ya hay [[Sharding]] manual + JSON blobs + tablas-como-columnas, y la app gestiona consistencia ad-hoc, ya estás pagando complejidad sin los beneficios del RDBMS — momento de migrar. Ver [[Bases de datos relacionales]]. |

## Relación con sharding

Replicación y [[Sharding|sharding]] son ortogonales y complementarios:

- **Replicación**: misma data en N nodos, escala lecturas / disponibilidad.
- **Sharding**: data distinta en N nodos, escala volumen y escrituras.

En la práctica los sistemas grandes hacen **ambas**: sharding para particionar el dataset + replicación dentro de cada shard para alta disponibilidad.

## Pregunta a profundizar

Postgres ofrece **streaming replication** asincrónica, **logical replication** (selectiva por tablas), y **synchronous_commit** ajustable por sesión. ¿Qué decisión arquitectónica determina cuál usar en cada parte de un sistema?

## Lecturas complementarias

- Kleppmann, *Designing Data-Intensive Applications* (2017) cap. 5 — taxonomía completa de replicación.
- Bernstein & Newcomer, *Principles of Transaction Processing* (2009).
- Documentación oficial de Postgres "High Availability, Load Balancing, and Replication".

---
title: Cheat Sheet Inge II — Bucket de soluciones por atributo de calidad
type: source
created: 2026-05-20
updated: 2026-05-20
tags: [cheat-sheet, parcial, bucket-de-soluciones, atributos-de-calidad, decisiones-arquitectonicas]
sources:
  - "raw/assets/Inge II - Cheat Sheet.docx"
related:
  - "[[Atributos de calidad]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Anti-patrones de parcial]]"
  - "[[Criterios de hosting y data residency]]"
  - "[[Attribute Driven Design]]"
  - "[[Persistencia]]"
  - "[[Teorema CAP]]"
  - "[[Replicación de BD]]"
  - "[[Sharding]]"
  - "[[Cheat Sheet — Guía de estudio pre-parcial]]"
---

# Cheat Sheet Inge II — Bucket de soluciones por atributo de calidad

## Qué es este documento

Documento de estudio armado por el alumno (probablemente compartido entre la cohorte) para el **parcial de Inge2 (2026-1C)**. Funciona como **mapa rápido "problema → mecanismo arquitectónico"**, con dos partes:

1. **Bucket de Soluciones**: catálogo de mecanismos disponibles (hosting, bases de datos, frontend, colas, seguridad, autenticación, protección de datos, manejo numérico).
2. **Mapeo por atributo de calidad**: dada una preocupación (Availability, Security, Performance, Precision, Scalability, Interoperabilidad, Fault Tolerance, Accessibility), qué mecanismo aplicar.

Cierra con un listado de **tradeoffs canónicos**.

> Es un **derivado** del corpus de la cursada — no introduce conceptos nuevos respecto a [[Clase 1 — Introducción a Arquitectura]], [[Clase 2 — Construcción de la arquitectura]], [[Clase 6 — Persistencia]], [[Clase 7 — Caso Compraventa de Acciones]] y [[Clase 8 — Consultas pre-parcial]], pero los **reorganiza como playbook de respuesta de parcial**. Su utilidad principal no es aprender sino **recuperar bajo presión**.

## Estructura del documento

### Bucket de Soluciones (parte 1)

| Categoría | Mecanismos enumerados |
|---|---|
| **Hosting** | Cloud (AWS); On Premise (datacenter compartido o edificio propio); Salas Cofre (acceso físico restringido) |
| **Escalado** | Múltiples Instancias de Backend + Load Balancer |
| **Bases de Datos** | SQL OLTP; SQL OLAP; Caché; Cassandra (columnar); MongoDB (documental); Bases de objetos |
| **Esquemas de replicación** | Primario-Secundario (escala lecturas); Primario-Primario (escala escrituras, con caveats de concurrencia) |
| **Frontend** | Webapp con SSR; SPA con CSR |
| **Mensajería asincrónica** | Queues con features: clúster, persistencia, TTL, garantías (at-most/at-least/exactly once), ordenamiento, DLQ |
| **Seguridad/Conexiones** | HTTPS, JWT, WAF, VPN, Websockets, Webhooks |
| **Autenticación** | 2FA, MFA |
| **Protección de Datos** | Encryption At Rest, Encryption In Transit |
| **Manejo numérico** | Error de punto flotante, Punto fijo, Interpolación, Frecuencia de polling *(las dos últimas quedan vacías en el original)* |
| **Archivos** | *(sección incompleta en el original — placeholders "asd")* |
| **Manejo de sensores** | *(sección incompleta en el original)* |

### Mapeo problema → solución (parte 2)

Una entrada por línea, formato `<problema> → <mecanismo>`:

- **Availability**: DDoS→WAF; caída backend→multi-instancia+LB; caída BD→replicación P-S o clúster NoSQL; corte internet→múltiples proveedores; caída de cola→clúster; corte de luz→generador o doble servicio.
- **Security**: DDoS→WAF; MItM→HTTPS; insider con info privilegiada→VPN interna; robo de credenciales→MFA; gestión de accesos→ACL en backend; SQL injection→sanitización en SPA; ingreso malicioso a BD→encryption at rest; datos muy sensibles→sala cofre.
- **Performance**: lecturas lentas→caché; demasiadas solicitudes→paralelismo + multithreading; reportes real-time→réplica de sólo lectura; reportes no real-time→OLAP + ETL en horario de baja demanda; caída de activo→heartbeat + failover; lectura real-time→websocket; búsquedas multifuente→async paralelo con timeout.
- **Precision**: error de punto flotante→punto fijo; sensor que mide mal→dos en activo-activo; propagación de error→métodos numéricos; faltan mediciones→interpolación; varianza alta→intervalos de confianza; precisión exacta→guardar como string.
- **Scalability**: picos recurrentes→LB; muchos accesos a SPA→CDN; sharding para horizontal; crecen lecturas→read replicas.
- **Interoperabilidad**: patrón Adapter; exponer API read-only.
- **Fault Tolerance**: degradación parcial (sigue funcionando con info disponible si falla la carga).
- **Accessibility**: testing con usuarios; internacionalización; HCI; alt-text; lectores de pantalla.

### Tradeoffs canónicos enumerados

- **Availability vs Costos** (escalamiento horizontal cuesta).
- **Performance vs Security** (encryption at rest agrega overhead).
- **Precision vs Performance** (punto fijo es más lento).
- **Performance vs Availability** (websockets sin failover degradan availability).

## Cómo encaja en el corpus de la cátedra

El cheat sheet **no es bibliografía oficial**, pero está perfectamente alineado con el método [[Attribute Driven Design|ADD]]:

1. **Drivers**: el alumno identifica el/los atributos críticos del caso (top 4 según [[Clase 8 — Consultas pre-parcial]]: típicamente Security, Availability, Scalability, Performance).
2. **Patterns/Tactics**: el bucket es el catálogo de **tactics** del que elegir.
3. **Iteración**: el mapeo problema→solución guía el orden de iteración (un atributo por iteración).
4. **Evaluación**: los tradeoffs explicitan sensitivity/tradeoff points en el sentido [[ATAM]].

## Qué falta o está incompleto en la fuente

- **Secciones vacías**: Interpolación, Frecuencia de Polling, Archivos, Manejo de Sensores. *(Cubiertas en otras partes del wiki: ver [[Clase 6 — Persistencia]] para archivos; [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] para polling de sensores e interpolación.)*
- **Patrones GoF**: solo se menciona Adapter; no aparecen Observer, Strategy, Factory, etc. La cátedra los toca pero no son foco del parcial oral.
- **Estilos arquitectónicos**: ausentes como sección (pipes&filters, broker, pub-sub, event-driven). Ver [[Estilos arquitectónicos]].
- **Vistas/Documentación**: no aparece [[Modelo 4+1]] ni [[C4 Model]]. El parcial no las exige explícitamente pero pueden mejorar la nota.
- **Métricas de calidad**: no aparecen [[SLA, SLO, SLI]] ni [[MTBF y MTTR]]; importantes para **cuantificar** escenarios.
- **Anti-patrones**: no aparecen — pero son críticos. Ver [[Anti-patrones de parcial]] *(2 automático)*.
- **Métricas de hosting**: no aparece el marco de tres criterios (data residency, costos, latencia) — ver [[Criterios de hosting y data residency]].

## Página derivada

El destilado de estudio orientado al parcial vive en **[[Cheat Sheet — Guía de estudio pre-parcial]]** — esa es la versión a abrir mañana.

## Cita

`raw/assets/Inge II - Cheat Sheet.docx` (752KB, 388 párrafos extraídos vía pandoc, 2026-05-20). Documento sin autor explícito en el archivo; estilo y nivel sugieren autoría de alumno de la cohorte.

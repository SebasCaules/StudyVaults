---
title: Auditoría de TP1 — Workflow paralelizado
type: analysis
created: 2026-05-27
updated: 2026-06-18
tags: [workflow, auditoria, tp1, paralelizado]
---

# Auditoría de TP1 — Workflow paralelizado

Este es un workflow reutilizable para auditar la codebase de un TP1 (webapp Spring MVC) contra los documentos de feedback de la cátedra, usando agentes especializados read-only en paralelo. El objetivo es producir un plan de correcciones exhaustivo, referenciado contra la wiki, con análisis cruzado entre múltiples agentes. La idea es adaptarlo: el procedimiento por pasos (Paso 0 a Paso 7) describe una metodología, no un repo concreto.

## Paso 0 — Contexto obligatorio (leer ANTES de cualquier acción)

Leer estos materiales en orden, sin saltearse ninguno. No ejecutar código todavía.

1. **Las reglas vigentes de la cátedra** (su documento de criterios de evaluación) y las convenciones del equipo. Es la fuente de verdad para los criterios de evaluación.

2. **[[devolucion-tp1-nuestra]]** — transcripción literal del feedback de la cátedra sobre un proyecto del TP1 evaluado. Cada bullet es una corrección confirmada a aplicar.

3. **[[plan-correcciones-tp1-grupo10]]** — plan ya armado en 5 fases. No reescribirlo: se complementa y refina.

4. **[[scout-errores-otros-grupos]]** — 15 categorías con errores que la cátedra encontró en OTROS proyectos. La hipótesis es que algunos pueden estar presentes pero al corrector se le pasaron.

5. **[[index]]** — el índice de la wiki, para saber qué páginas de conceptos se pueden referenciar (p. ej. `[[Spring Security]]`, `[[Persistence (Spring JDBC)]]`, `[[Controllers & Validation]]`, `[[Testing Practices]]`, `[[Errores Comunes TP1]]`).

Después de leer, hacer un resumen de **menos de 200 palabras** confirmando que se entendió el alcance y listar las dudas sobre la codebase antes de seguir. Si no hay dudas, avisar y arrancar el Paso 1.

## Paso 1 — Reconocimiento de la codebase (sin tocar nada)

Antes de delegar, hacer un reconocimiento mínimo para que los agentes que se desplieguen no busquen a ciegas:

- Estructura de módulos Maven (`find . -maxdepth 3 -name pom.xml`).
- Lista de controllers (`find . -path '*/controller/*.java'`).
- Lista de services (`find . -path '*/service/*ServiceImpl.java'`).
- Lista de DAOs (`find . -path '*/persistence/*JdbcDao.java'`).
- Lista de tests (`find . -path '*/test/*Test.java'`).
- JSPs (`find . -name '*.jsp' -o -name '*.tag'`).

Guardar el output en un archivo temporal `.audit/inventario.md` para que los agentes lo usen como índice.

## Paso 2 — Auditoría paralelizada con agentes especializados

Lanzar **en una sola tool-call con múltiples bloques** los siguientes agentes con `subagent_type=Explore` (read-only). Cada uno tiene un ámbito disjunto para que no hagan trabajo redundante. **Que sean exhaustivos** ("very thorough" en el parámetro de búsqueda).

Cada agente debe:
- Leer [[scout-errores-otros-grupos]] (su sección asignada), [[devolucion-tp1-nuestra]] (para no duplicar lo ya conocido) y el `inventario.md`.
- Devolver un reporte estructurado: por cada hallazgo, archivo + línea + extracto del código + severidad (Grave / Medio / Menor) + sección del scout que lo cubre + referencia al concepto de wiki si aplica.
- **No proponer fix todavía**. Solo encontrar y reportar.

**Agentes a desplegar (en paralelo):**

1. **Agente A — POM & Build & Config**
   Ámbito: secciones 1 (POM/Maven) y 11 (Configuración/Spring beans) del scout. Revisar todos los `pom.xml`, `web.xml`, `WebConfig`, `WebAuthConfig`, `logback*.xml`, `.gitignore`, archivos de IDE versionados, secretos hardcoded.

2. **Agente B — Controllers (lógica + validación + seguridad declarativa)**
   Ámbito: secciones 2 (Lógica de negocio fuera de services), 3 (Bean Validation), 5 (Spring Security), 10 (URLs/HTTP). Revisar TODOS los controllers, `@ControllerAdvice`, forms en `webapp.form`, helpers tipo `*MvcSupport` / `*Helper`.

3. **Agente C — Persistencia & N+1 & RowMappers**
   Ámbito: sección 4 completa. Revisar TODOS los `*JdbcDao`, `RowMapper`s, queries SQL, transactions (`@Transactional` y `readOnly`), upserts, lecturas de columnas nullable.

4. **Agente D — Services & dominio & excepciones**
   Ámbito: secciones 2.5 (services con DAOs ajenos), 6 (excepciones), 12 (modelos/dominio), 14 (mailing). Revisar todos los `*ServiceImpl`, modelos en `models/`, excepciones custom, mailing.

5. **Agente E — Vistas / JSP / i18n / XSS**
   Ámbito: secciones 7 (XSS), 9 (i18n), 13 (JSP). Revisar TODOS los `.jsp` y `.tag`, archivos `messages*.properties`, uso de `<c:out>`, `<spring:message>`, `<sec:authorize>`, `aria-label`, `placeholder`.

6. **Agente F — Tests**
   Ámbito: sección 8 completa. Revisar TODOS los tests: uso de `verify`, `AtomicReference`/`AtomicBoolean`, tests no unitarios, falta de asserts reales, mezcla JUnit 4/5, parametrización.

Esperar a que TODOS los agentes terminen antes de pasar al Paso 3.

## Paso 3 — Cross-check (segunda pasada con agentes adversariales)

Lanzar **otros dos agentes en paralelo** para validar los reportes anteriores. Pasarles los reportes crudos de los 6 primeros agentes:

7. **Agente G — Falsos negativos**
   Tarea: re-leer el repo buscando casos que los agentes A-F **podrían haberse perdido**. Énfasis en:
   - Lógica de negocio escondida en lugares no obvios (filtros JSP, tag files, listeners, interceptors).
   - N+1 escondidos en helpers o lambdas.
   - Reglas de autorización en JS / vistas (no solo Java).
   - Validaciones manuales escondidas en getters de form.
   Devolver hallazgos nuevos con la misma estructura.

8. **Agente H — Falsos positivos**
   Tarea: re-leer los hallazgos de A-F y desafiar cada uno. Para cada hallazgo Grave, verificar abriendo el archivo si realmente es el error reportado o si hay contexto que lo justifica. Devolver lista de hallazgos a **descartar o rebajar de severidad**, con justificación.

## Paso 4 — Consolidación

El agente principal consolida los reportes en un único documento.

**Crear** `.audit/hallazgos.md`:

```markdown
# Hallazgos auditoría TP1

## Resumen ejecutivo
- Total de hallazgos: X
- Graves: Y  | Medios: Z  | Menores: W
- Ya cubiertos por la devolución oficial: A
- NUEVOS (no detectados por el corrector): B
- Secciones del scout sin hallazgos: [...]

## Hallazgos por categoría

### Sección N — Título
| ID | Archivo:línea | Severidad | Descripción | Concepto wiki | Ya en devolución oficial? |
|----|---------------|-----------|-------------|---------------|---------------------------|
| ...|               |           |             | [[Spring Security]] | Sí/No |

(... una tabla por cada sección del scout que tenga hallazgos ...)
```

## Paso 5 — Planes individuales por hallazgo

Por cada hallazgo Grave o Medio, crear un archivo `.audit/planes/{ID}-{slug}.md` con:

```markdown
---
id: H-001
severidad: Grave
seccion_scout: 4.2 RowMappers inline
en_devolucion_oficial: Sí
referencia_wiki: [[Persistence (Spring JDBC)]]
---

# H-001 — RowMapper inline en ReviewJdbcDao

## Síntoma
(extracto de código actual con líneas)

## Por qué está mal
(explicación referenciando concepto de wiki)

## Fix propuesto
(diff conceptual o código nuevo)

## Tests a agregar/modificar
(lista)

## Riesgo del cambio
(qué puede romper, cómo verificar)

## Estimación
S / M / L

## Dependencias con otros hallazgos
(IDs de otros .md de este folder)
```

## Paso 6 — Plan maestro y secuenciación

Crear `.audit/plan-maestro.md`:

1. **Topological sort** de los hallazgos por dependencia (los que tocan POMs primero, después interfaces, después implementaciones, al final tests y JSP).
2. **Agrupación en commits coherentes**: cada commit debe ser un cambio temáticamente unificado.
3. **Secuencia recomendada de PRs**: ordenadas por severidad + bajo riesgo primero.
4. **Tabla de checkpoints**: después de qué grupo de hallazgos correr `mvn verify`.
5. **Lista de actualizaciones a las reglas de la cátedra** que surjan (convenciones nuevas a documentar).

## Paso 7 — Devolución a la wiki

Al final actualizar:

- **[[scout-errores-otros-grupos]]** → completar la tabla "Resumen de hallazgos" del final con los resultados reales.
- **[[plan-correcciones-tp1-grupo10]]** → marcar `[x]` los items ya verificados como existentes y agregar la sección "Hallazgos extra (a triage)" con los hallazgos NUEVOS que encontró el scout.

## Reglas duras

1. **Read-only en esta corrida**. No modificar archivos `.java`, `.jsp`, `.xml` del repo. Solo crear los `.md` en `.audit/` y actualizar páginas de la wiki.
2. **Verificar antes de afirmar**: si el scout dice "puede haber X en archivo Y", abrir Y y confirmar. No copiar hallazgos sin verlos.
3. **Citar archivo:línea siempre**. Sin `archivo:línea` un hallazgo es opinión, no evidencia.
4. **No duplicar lo de la devolución oficial**. Si un hallazgo ya está en [[devolucion-tp1-nuestra]], marcarlo así en la tabla — sigue contando pero no es "descubrimiento".
5. **Si un agente devuelve >50 hallazgos, sospechar**. Pedirle que priorice y vuelva con los 20 más graves antes de seguir.
6. **Linkear conceptos de la wiki con `[[wikilinks]]`**. Si no existe el concepto, anotarlo en una lista al final del plan-maestro como "conceptos a documentar".

## Output final esperado

Al terminar, presentar:

1. Resumen ejecutivo en pantalla (10-15 líneas).
2. Path al `plan-maestro.md`.
3. Top 10 hallazgos por severidad/impacto.
4. Lista de hallazgos NUEVOS que el corrector no detectó (los más importantes para arreglar antes de la próxima entrega).
5. Tiempo estimado total para implementar.

Arrancar por el Paso 0. Al terminar de leer todo, frenar y confirmar antes del Paso 1.

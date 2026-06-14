---
title: Plan de correcciones TP1 — Grupo 10 (para Claude Code)
type: analysis
created: 2026-05-27
updated: 2026-05-27
tags: [plan, correcciones, tp1, grupo-10, claude-code, accionable]
sources: [Devolucion TP1.pdf]
---

# Plan de correcciones TP1 — Grupo 10

> **Para Claude Code:** este archivo es tu briefing para corregir el TP1. La fuente es [[devolucion-tp1-nuestra]] (transcripción literal del feedback). Trabajás sobre el repo `~/Desktop/ITBA/26-1C/PAW/paw-2026a-10`. Antes de tocar código, **leé `PAW_Directives.md` del repo** y la sección "Reglas de trabajo" abajo.

---

## Objetivo

Corregir **punto por punto** todas las observaciones de la devolución TP1 del Grupo 10 (nota 6). El plan está priorizado por: (1) errores conceptuales graves, (2) bugs funcionales, (3) mejoras UX/i18n.

## Reglas de trabajo (leer antes de empezar)

1. **Antes de cualquier cambio**: leer `~/Desktop/ITBA/26-1C/PAW/paw-2026a-10/PAW_Directives.md` para reglas vigentes de la cátedra, convenciones del equipo y bugs conocidos.
2. **Verificar cada hallazgo antes de actuar.** La devolución cita nombres de clases/métodos — confirmá con `grep` que existen tal cual antes de modificar. Si fueron renombrados/movidos, ajustá.
3. **Una corrección = un commit (o un PR coherente).** No mezclar fixes de distintas categorías.
4. **No introducir features nuevas** que no estén pedidas explícitamente por la devolución.
5. **Tests primero cuando sea posible**: para los fixes de lógica de negocio, agregar/ajustar el test antes de mover el código.
6. **Si un fix expone más código defectuoso del mismo patrón en otro archivo, anotarlo en el log del plan pero NO ampliarlo en el mismo commit** — abrir un item nuevo.
7. **Validar con `mvn verify` después de cada categoría** antes de seguir.

---

## Fase 0 — Setup y verificación

- [ ] Leer `PAW_Directives.md` del repo.
- [ ] Revisar `wiki/` para conceptos relevantes ([[spring-security]], [[bean-validation]], [[n+1-queries]], [[mockito-best-practices]] si existen).
- [ ] Confirmar que el repo compila y los tests pasan en main antes de empezar.
- [ ] Crear branch `correcciones-tp1` desde main.

---

## Fase 1 — Errores conceptuales graves (PRIORIDAD MÁXIMA)

### 1.1 — Lógica de negocio en controllers → mover a services

**Por qué:** la cátedra penaliza esto como error conceptual grave en casi todos los grupos. Los controllers deben ser thin: parsear request, llamar service, devolver view. Nada de reglas de dominio.

- [ ] **`DashboardController.computeReviewableRentIds`**
  - Mover la regla "rent reseñable = finalizada Y no reviewed todavía" a `ReviewService` (nuevo método `findReviewableRentsForUser(userId)` o similar).
  - El controller solo llama al service y pasa el resultado al modelo.
  - Test unitario nuevo en `ReviewServiceImplTest` que cubra: rent finalizada+sin review (incluida), rent en progreso (excluida), rent finalizada con review (excluida).

- [ ] **`CatalogController.parseCategoryFilters`**
  - La traducción de query params a `CatalogCriteria` pertenece al service.
  - Crear `CatalogService.buildCriteriaFromParams(...)` o similar que centralice: `Category.usesSize()`, `Size.isValidForCategory(category)`, descarte de combinaciones inválidas.
  - El controller solo recibe los params (idealmente vía un form bean con Bean Validation) y los pasa.
  - Test que cubra combinaciones inválidas → criteria sin size.

- [ ] **`ImageController.detectContentType`**
  - Extraer el sniffing de magic bytes (PNG `89 50 4E 47`, JPEG, GIF, WebP) a una clase de servicio: `ContentTypeDetector` (o método dentro de `ImageService`).
  - El controller solo invoca el detector y setea el header de respuesta.
  - Test unitario del detector con bytes de cada formato.

### 1.2 — `CatalogController.buildFilterQueryString` → reemplazar por form GET o `<c:url>`

**Por qué:** doble problema: (1) reinventa lo que el browser hace solo, (2) no hace URL-encoding → `&` `=` y espacios rompen la paginación.

- [ ] Identificar la JSP del catálogo. Envolver search-bar + filter-panel + sort + paginación en un único `<form action="/catalog" method="get">`. El browser serializa todo automáticamente.
- [ ] Para los links de paginación (next/prev/numéricos) que NO pueden ir dentro del form, usar `<c:url value="/catalog"><c:param name="..." value="..."/></c:url>` — `c:param` hace URL-encoding.
- [ ] Borrar `buildFilterQueryString` y la variable `filterQueryString` del modelo.
- [ ] Probar manualmente: buscar con `a&b`, categoría con espacios — la paginación debe seguir funcionando.

### 1.3 — Ownership en services → mover a Spring Security

**Por qué:** la regla es declarativa. Si está en el service y alguien crea un endpoint nuevo sin acordarse, se filtra.

- [ ] Inventariar TODOS los checks manuales de ownership en services (grep por `if (!resource.getOwner().getId().equals(...))` o patrones similares).
- [ ] Migrar a `@PreAuthorize` con SpEL, o crear `PermissionEvaluator` custom si la lógica es compleja.
- [ ] Documentar la convención en `PAW_Directives.md`: "ownership checks → `@PreAuthorize`, NO en el service".
- [ ] Tests de integración con `@WithMockUser` para confirmar que un usuario no-owner recibe 403.

---

## Fase 2 — Persistencia y tests

### 2.1 — N+1 queries

- [ ] Identificar los loops que llaman al DAO N veces. Usar `git grep` por `for (.*: .*) { .*Dao\.find` o similar.
- [ ] Reemplazar por una sola query con `WHERE id IN (...)` o `JOIN`.
- [ ] Si hay tests de service, confirmar que siguen pasando con mocks ajustados.

### 2.2 — `ReviewJdbcDao` — RowMapper duplicado e inline

- [ ] Extraer el `RowMapper<Review>` a:
  ```java
  private static final RowMapper<Review> REVIEW_ROW_MAPPER = (rs, n) -> { ... };
  ```
- [ ] Usar la misma constante en `findByProductId` y `save`.
- [ ] **Eliminar la reconstrucción inline de `User` dentro del mapper de Review.** En su lugar:
  - Opción A (recomendada): el JOIN sigue, pero el mapper de Review delega a `UserJdbcDao.USER_ROW_MAPPER` para los campos de user (extraer también esa constante si no existe).
  - Opción B: `ReviewJdbcDao.findByProductId` devuelve `Review` sin user poblado, y el service llama a `UserService.findByIds(...)` para enriquecer.
- [ ] Mismo patrón aplicado al resto de DAOs con RowMapper inline (auditar).

### 2.3 — Escapar `%` y `_` en búsquedas con `LIKE`

- [ ] Localizar todos los `LIKE` que concatenan input de usuario (probable en `UserDao`, `ProductDao`, `CatalogDao`).
- [ ] Antes de pasar al `LIKE`, escapar:
  ```java
  String escaped = input.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
  // y en el SQL: ... LIKE ? ESCAPE '\'
  ```
- [ ] Test que confirme que buscar `50%` devuelve solo filas con `50%` literal, no `500`, `5000`, etc.

### 2.4 — Tests que reimplementan `Mockito.verify`

- [ ] Buscar `AtomicReference` y `AtomicBoolean` dentro de `doAnswer(...)` en tests de service.
- [ ] Reemplazar por `Mockito.verify(mock).method(captor.capture())` con `ArgumentCaptor`.
- [ ] Tests afectados (al menos los 4 en `ProductServiceImplTest`): `testCreateProductWhenValidReturnsProduct` y los otros tres.

### 2.5 — Tests con `assertDoesNotThrow` sin asserts reales

- [ ] Localizar tests que solo hacen `Assertions.assertDoesNotThrow(...)` sin verificar comportamiento.
- [ ] Agregar asserts sobre el resultado o efecto observable. Si solo se puede afirmar que no tira excepción, **renombrar** el test para que su nombre refleje eso, o eliminarlo si es redundante.

### 2.6 — `CurrencyTest.testFromSlugWhenAllValuesRoundtrip` → `@ParameterizedTest`

- [ ] Convertir a:
  ```java
  @ParameterizedTest
  @EnumSource(Currency.class)
  void fromSlugRoundtrips(Currency c) {
      assertEquals(c, Currency.fromSlug(c.getSlug()));
  }
  ```

---

## Fase 3 — POM y configuración

### 3.1 — `commons-fileupload` versión hardcodeada

- [ ] Mover `<version>1.5</version>` de `webapp/pom.xml` al `<dependencyManagement>` del POM padre.
- [ ] En `webapp/pom.xml` dejar solo `<groupId>` + `<artifactId>` (sin version).
- [ ] Auditar el resto de dependencias en POMs hijos — toda versión hardcodeada en un hijo va al padre.

### 3.2 — `javax.servlet-api` scope provided

- [ ] En el POM padre, dentro del `<dependencyManagement>` para `javax.servlet-api`, agregar `<scope>provided</scope>`.
- [ ] Verificar con `mvn dependency:tree` que el JAR del servlet API no entre al WAR final.

### 3.3 — `ErrorController` sin `method` en `@RequestMapping`

- [ ] Agregar `method = RequestMethod.GET` (o usar `@GetMapping`) en los mapeos de `/error/403`, `/error/404`, `/error/500`.

---

## Fase 4 — UX / bugs funcionales / i18n

### 4.1 — Bug: precio especial por fecha pisa precio por defecto

- [ ] Reproducir: crear producto con precio por defecto, agregar precio especial para una fecha. Confirmar el bug.
- [ ] Investigar la lógica de resolución de precio (probable en `PriceService` o similar). El precio por defecto debe persistirse y solo "sobreescribirse" en la respuesta cuando aplica la fecha especial.
- [ ] Test que cubra: crear precio default → crear precio especial → consultar fuera del rango especial → debe volver el default.

### 4.2 — CBU faltante: avisar en UI cuando no llega el comprobante

- [ ] Localizar el flujo de generación de comprobante. Si CBU es requerido y falta, devolver/mostrar mensaje claro en la UI (no fallar silenciosamente).
- [ ] Idealmente: validación de Bean Validation en el form de configuración que exija CBU si el usuario quiere recibir comprobantes.

### 4.3 — Modales de confirmación para acciones terminales

- [ ] Identificar acciones "eliminar" y "pausar" (probable en admin / dashboard).
- [ ] Agregar modal de confirmación (puede ser `confirm()` JS simple o un modal Bootstrap si ya hay infra).

### 4.4 — CTA y mensaje en search vacío del admin

- [ ] En la vista de search de users y products del admin, cuando la lista está vacía, mostrar:
  - Mensaje claro ("No se encontraron resultados para `${query}`").
  - CTA opcional según contexto (limpiar búsqueda, ir a crear).

### 4.5 — Compartir comprobante por PDF (mejora sugerida)

- [ ] Evaluar costo/beneficio. Si tenemos templating de mails con HTML, podemos generar PDF con iText o flying-saucer. **Si toma >2h, postergar.**

### 4.6 — `aria-label`s en inglés sin i18n

- [ ] Grep por `aria-label="..."` en JSPs / tag files.
- [ ] Reemplazar el literal por `<spring:message code="aria.xxx"/>` y agregar las claves a `messages_es.properties` / `messages_en.properties`.

---

## Fase 5 — Cierre

- [ ] Correr `mvn verify` completo. Cero failures.
- [ ] Smoke test manual de los flujos tocados.
- [ ] Actualizar `PAW_Directives.md` con las convenciones nuevas que surjan (especialmente Fase 1.3 sobre ownership).
- [ ] Squash/cleanup de commits, push, PR con checklist de la devolución.
- [ ] Actualizar `wiki/log.md` con resumen de lo corregido.

---

## Checklist condensado (para tracking)

```
[ ] 1.1.a DashboardController.computeReviewableRentIds → ReviewService     ❌ SIGUE VIVO (V4 L4)
[ ] 1.1.b CatalogController.parseCategoryFilters → CatalogService          ❌ SIGUE VIVO (V4 L2)
[ ] 1.1.c ImageController.detectContentType → ContentTypeDetector          ❌ SIGUE VIVO (V4 L3)
[ ] 1.2   CatalogController.buildFilterQueryString → form GET / c:url      ❌ SIGUE VIVO (V4 L5)
[ ] 1.3   Ownership en services → @PreAuthorize                            ⚠️ PEOR: ahora hay @PreAuthorize × 9 EN RentServiceImpl mezclado con findOwnedByX (V4 S1)
[ ] 2.1   N+1 queries inventario + fix                                     ⚠️ residual: ImageJpaDao.grantAccess loop (V4 A6)
[x] 2.2   ReviewJdbcDao RowMapper extraído + dedup User mapper             ✅ ReviewJdbcDao entero comentado (migró a ReviewJpaDao). ProductImagesJdbcDao tiene patrón residual (V4 L8)
[x] 2.3   Escape % y _ en LIKE                                             ✅ UserJpaDao:109 + ProductJpaDao:293-294 con escape correcto + ESCAPE '\\'
[ ] 2.4   Tests con AtomicReference → ArgumentCaptor (4 tests)             ❌ PEOR: ahora hay 19 (V4 T1) — 13 en ProductServiceImplTest + 6 en ReportServiceImplTest
[ ] 2.5   assertDoesNotThrow sin asserts → fix o rename                    ❌ SIGUE VIVO (V4 T2) — 11 ocurrencias
[ ] 2.6   CurrencyTest → @ParameterizedTest                                ❌ SIGUE VIVO (V4 T3)
[x] 3.1   commons-fileupload version → dependencyManagement                ✅ pom.xml:40,263-265 fixeado
[x] 3.2   javax.servlet-api scope provided                                 ✅ verificado por agente INFRA
[ ] 3.3   ErrorController method= en RequestMapping                        ❌ SIGUE VIVO (V4 B3) — líneas 12, 18, 24
[ ] 4.1   Bug precio especial pisa default                                 ❌ SIGUE VIVO (V4 A3) — PriceServiceImpl + Price.EFFECTIVE_ORDER
[ ] 4.2   CBU faltante: mensaje UI                                         ❌ SIGUE VIVO (V4 A9)
[x] 4.3   Modales acciones terminales                                      ✅ 48 usos de paw:confirm-modal en JSPs
[x] 4.4   CTA / mensaje search vacío admin                                 ✅ admin/users.jsp:220 admin-empty__cta
[ ] 4.5   (opcional) PDF comprobante                                       ⏸️ postponed
[~] 4.6   aria-labels i18n                                                 ⚠️ mayormente fixeado, residual de 3 sitios (V4 I1)
```

---

## Hallazgos extra (a triage) — descubrimientos del scout V4 NO listados por el corrector

Estos hallazgos no aparecen en la devolución oficial TP1 pero fueron detectados por la auditoría general V4 sobre `main` post-TP2. Son los "más jugosos" para arreglar antes de la próxima entrega, porque demuestran patrones nuevos o residuales que el corrector probablemente marcará en TP3.

### Seguridad / Layering
- **V4 S2 — `@AuthenticationPrincipal AuthUser` × 10 en `RentRequestController` (8 sitios) + `DashboardController` (2 sitios)**. Viola `docs/security.md`: la convención es `@ModelAttribute("loggedUser") final User loggedUser`. Plan individual: `0_Plans/audits/2daEntrega/V3/critica/plan_2_S2-AuthenticationPrincipal.md`.
- **V4 S3 — `SecurityContextHolder` × 2 en validators** (`NotSelfProviderValidator:51`, `CurrentPasswordMatchesValidator:24`). Zona gris arquitectural; documentar o refactorizar para inyectar `userId` desde el form.
- **V4 L6 — `ImageController.@PreAuthorize("@imageAccessHandler.canViewImage(...)")`** mixed strategy. Mover a `WebAuthConfig`.

### Excepciones de dominio
- **V4 L1 — `IllegalArgumentException` / `IllegalStateException` × 15 como business exception** (ReportServiceImpl × 8, EmailServiceImpl × 3, BlockServiceImpl × 1, AdminActionServiceImpl × 1, ProductServiceImpl × 1, RentServiceImpl × 1). Crear excepciones de dominio + mapear en `GlobalExceptionHandler`. Plan individual: `plan_3_L1-IllegalArgumentException.md`.
- **V4 T5 — `AlreadyReviewedException` no mapeada en `GlobalExceptionHandler`** → devuelve 500 cuando debería ser 409 Conflict.

### Atomicidad / robustez
- **V4 A1 — `@Async` × 8 en `EmailServiceImpl` sin `try/catch(RuntimeException)`**. SMTP failures en flujo de pagos se pierden silenciosamente. `docs/architecture.md` es explícito.
- **V4 A2 — try-catch de `ResourceNotFoundException` en `AdminController:339-343`** (fallback a `reportedProduct = null`). Cambiar a `Optional`.
- **V4 A5 — `findOwnedByProvider` retorna `Optional` y no se `.orElseThrow`** en `RentRequestController:128`.
- **V4 A6 — N+1 en `ImageJpaDao.grantAccess(Collection<Long>)`** por insert individual en loop.
- **V4 A8 — `ProductServiceImpl.normalizePageNumber:582-584`** solo clampea floor. Page=999 con 2 totales no clampea a 2.

### Build / configuración
- **V4 B1 — `AGENTS.md` + `CLAUDE.md` ambos versionados** (PROHIBIDO: pick one).
- **V4 B2 — `hibernate.show_sql=true` + `format_sql=true` en `WebConfig.java:196-197`** (prod). `docs/logging.md` lo prohíbe.
- **V4 B4 — Jetty plugin `<path>8080</path>` en `webapp/pom.xml:213`** (config inválida en Jetty 10; debería ser `<httpConnector><port>`).

### Modelo
- **V4 M1 — `AdminActionTargetType` sin `getDisplayName()` / `HasDisplayName`**.

### Testing
- **V4 T4 — `Mockito.lenient()` × 10 como default** (oculta stubs no usados).
- **V4 T6 — Test ownership COMENTADO con TODO** en `ProductStatisticsServiceImplTest:127-136`.

### Persistencia / código
- **V4 C1 — `IN(...)` concatenado por placeholders en `ImageJdbcDao:100-104` + `ProductImagesJdbcDao:62-71`**. No es SQL injection real (los valores se parametrizan), pero es anti-patrón. Migrar a `NamedParameterJdbcTemplate`.
- **V4 C2 — 5 JdbcDaos comentados completos (~786 líneas dead code)**: `PriceJdbcDao`, `ProductJdbcDao`, `ReviewJdbcDao`, `RentJdbcDao`, `FavoriteJdbcDao`. Borrar.
- **V4 C3 — Hardcoded `Locale.forLanguageTag("en")` en `EmailVerificationServiceImpl` + `PasswordResetServiceImpl`** (fallback). Usar `user.getPreferredLanguage()`.

### Vista / i18n
- **V4 V3 — JSON inline sin escape en `views/products/detail.jsp:72`** (`${sp.priceFrom}` crudo en JSON).
- **V4 I2 — 51 keys faltantes en `messages_fr.properties` vs default** (+ 19 al revés). Auto-memory `feedback_i18n_french` ya alertó sobre esto.

### Output completo de la auditoría
- DICTAMEN: `0_Plans/audits/2daEntrega/V3/TODO_2daEntrega.md` (TREE + tabla + secciones detalladas)
- Planes individuales CRÍTICOS: `0_Plans/audits/2daEntrega/V3/critica/plan_1_S1-PreAuthorize-RentService.md`, `plan_2_S2-AuthenticationPrincipal.md`, `plan_3_L1-IllegalArgumentException.md`, `plan_4_T1-AtomicReference-tests.md`
- Apéndice A (descartados, incluye hallazgos ya cerrados de la devolución original): ver DICTAMEN.

---

## Notas para el agente

- Cuando termines una fase, **actualizá este archivo** marcando los `[x]` y comentando hallazgos.
- Si encontrás código mal del mismo patrón que NO está en la devolución, **anotalo abajo** pero no lo arregles en esta pasada (scope creep).

### Hallazgos extra (a triage)

_(vacío)_

---
title: Scout — Errores Comunes en TP1
type: analysis
created: 2026-05-27
updated: 2026-06-18
tags: [scout, auditoria, correcciones, tp1, accionable]
sources: [Devolucion TP1.pdf]
---

# Scout — Errores Comunes en TP1

> **Propósito:** la cátedra encontró estos errores en los proyectos del TP1. Este archivo es un checklist para auditar una codebase Spring MVC y verificar cada patrón. Arreglar proactivamente los que aparezcan suma calidad; si la cátedra los encuentra después, descuenta.

> **Cómo usar:** para cada sección, ejecutar los `grep`/búsquedas sugeridas. Si hay match, abrir el archivo y verificar si aplica el mismo error. Reportar resultados en el "Resumen de hallazgos" al final.

> **Cross-ref:** ya cubiertos en [[plan-correcciones-tp1-grupo10]] aparecen marcados con ✅ (no repetir trabajo). Lo de acá es **adicional**.

---

## 1. POM, Maven, configuración de build

### 1.1 — Versiones hardcoded en POMs hijos en lugar del padre
**Grupos:** 2, 4, 11, 13, 14

- [ ] `git grep -nE '<version>[0-9]' webapp/pom.xml services/pom.xml persistence/pom.xml models/pom.xml service-contracts/pom.xml` — toda versión de dependencia/plugin en hijo debe heredarse del padre.
- [ ] Verificar especialmente `spring-webmvc`, `jackson-databind`, `maven-war-plugin`, `maven-compiler-plugin`.

### 1.2 — Inconsistencia POM padre vs hijos en target/release de Java
**Grupo:** 13 (pom.xml declara `maven.compiler.target=21` mientras `models/pom.xml` redeclara `maven.compiler.release=17`)

- [ ] Confirmar misma versión de Java en todos los POMs. `grep -rE 'maven.compiler.(target|release|source)' --include=pom.xml`

### 1.3 — Versiones de plugins redeclaradas con valor distinto
**Grupo:** 13 (`maven-war-plugin.version` 2.6 padre vs 3.4.0 webapp)

- [ ] `git grep -nE '<maven-.*-plugin.version>' --include=pom.xml`

### 1.4 — Property que duplica un literal igual
**Grupo:** 13 (`junit-bom` 5.11.0 importado literal mientras existe `${junit.version}=5.11.0`)

- [ ] Buscar literales en `<dependencyManagement>` que coincidan con properties. `grep -rE 'junit|spring|hibernate' pom.xml | grep -i version`

### 1.5 — `<scope>` faltantes o incorrectos
**Grupos:** 2, 3, 14

- [ ] Dependencias a otros módulos del proyecto (`services`, `persistence`) deben revisarse: ¿necesitan scope `runtime`?
- [ ] `mockito-*` debe tener `<scope>test</scope>` declarado en el padre.
- [ ] `javax.servlet-api` debe tener `<scope>provided</scope>` ✅ (ya cubierto).

### 1.6 — Versión `1.0-SNAPSHOT` o `<groupId>` redeclarados en hijos
**Grupo:** 2

- [ ] `git grep -nE '<version>1.0-SNAPSHOT</version>|<groupId>ar.edu.itba.paw</groupId>' --include=pom.xml` — los hijos deben heredarlos del padre, no redeclararlos.

### 1.7 — Webapp depende de `persistence` en vez de `persistence-contracts`
**Grupos:** 8, 13

- [ ] Revisar `webapp/pom.xml`: debe depender de `service-contracts` y nunca de `persistence` directamente.

### 1.8 — Plugin versions en hijos en vez de `<pluginManagement>` del padre
**Grupo:** 11

- [ ] `git grep -nE '<plugin>' --include=pom.xml` — versiones de plugins solo en `<pluginManagement>` del padre.

### 1.9 — Archivos basura versionados
**Grupos:** 11 (.vscode/settings.json), 13 (.mvn/jvm.config vacíos), 14 (webapp.war, target/)

- [ ] `git ls-files | grep -E '\.vscode|\.idea|target/|\.war$|\.class$|\.mvn'` — nada de IDE configs ni binaries en el repo.
- [ ] Verificar `.gitignore`.

### 1.10 — `AGENTS.md` o `CLAUDE.md` ignorados o duplicados
**Grupos:** 2 (agregaron AGENTS.md al .gitignore), 4, 8 (ambos CLAUDE.md y AGENTS.md)

- [ ] Verificar que **solo exista uno** y que no esté en `.gitignore`. La cátedra penaliza tener ambos (no se mantienen sincronizados).
- [ ] `cat .gitignore | grep -iE 'agent|claude'`

---

## 2. Lógica de negocio fuera de los services

### 2.1 — Lógica de negocio en controllers
**Grupos:** 2, 3, 4, 5, 6, 7, 8, 9, 12, 14 (es la queja MÁS común)

- [ ] Inventario: por cada `Controller` del webapp, revisar métodos `@*Mapping` y verificar que **solo hagan**: parsear request → llamar service(s) → poblar modelo / redireccionar.
- [ ] **Patrones rojos a buscar:**
  - Loops sobre `*Service.findById(...)` en el controller → debe ser un service nuevo que devuelva la lista completa de una.
  - `if/else` que aplican reglas de dominio (estados, validez, permisos) → mover al service.
  - Cualquier `new EntidadDeDominio(...)` en el controller (excepto forms) — caso del Grupo 9: `UserServiceImpl.create` instancia `new User(...)` en service en vez de devolver del DAO, mismo antipatrón aplica si ocurre en un controller.
  - Orquestación de varios services en un POST (`serviceA.x(); serviceB.y(); serviceC.z()`) **sin** `@Transactional` ✅ (Façade).

### 2.2 — Lógica de negocio en clases helper "MvcSupport" / soporte
**Grupo:** 12 (`PublishMvcSupport`, `GalleryMvcSupport`, `PublicationAvailabilityMvcSupport.blockSlot()`)

- [ ] ¿Hay clases helpers en `webapp/`? Si tienen reglas de dominio, son service disfrazado. `find webapp/src -name '*Support*' -o -name '*Helper*' -o -name '*Util*'`

### 2.3 — Lógica de presentación en service
**Grupo:** 14 (services definen a dónde redirige la acción)

- [ ] Buscar strings tipo `"redirect:..."` o paths URL devueltos por services. `git grep -nE 'redirect:|/[a-z]+/' services/src/main/java`

### 2.4 — Reglas de seguridad/permisos en controllers
**Grupos:** 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 (queja transversal)

- [ ] `git grep -nE 'hasRole|hasAuthority|getPrincipal|isAuthenticated|currentUser' webapp/src/main/java/.../controller`
- [ ] Toda autorización debe ser **declarativa** (`@PreAuthorize`, `WebAuthConfig`, `PermissionEvaluator`).
- [ ] Buscar `if (user.isAdmin())`, `if (user.getId() != resource.getOwnerId())`, redirects manuales a `/login`, etc.

### 2.5 — Servicios que dependen de DAOs ajenos
**Grupos:** 2, 5, 9, 12, 14

- [ ] Por cada `@Service`, contar cuántos `*Dao` inyecta. Idealmente **uno solo** (el de su entidad). El resto debe venir vía otros services.
- [ ] Ejemplo grupo 5: `RequestServiceImpl` inyecta `RequestDao + AddressDao + QuoteDao` → debería inyectar `RequestDao + AddressService + QuoteService`.

---

## 3. Bean Validation vs validación manual

### 3.1 — Validaciones manuales en controllers
**Grupos:** 4, 5, 6, 7, 8, 9, 14

- [ ] `git grep -nE 'trim\(\)|isEmpty\(\)|isBlank\(\)|matches\(|\.length\(\) [<>]|parseInt|parseLong' webapp/src/main/java/.../controller` — si hay validaciones de input ahí, deben ser anotaciones JSR-303 en el form.
- [ ] Buscar comparación manual de contraseñas en `RegisterController`/`ChangePasswordController` (Grupo 14).
- [ ] Buscar `toUpperCase`/`toLowerCase`/`normalize` aplicados a inputs en el controller → mover a getters del form (sanitización).

### 3.2 — Custom validators faltantes
**Grupos:** 2, 7

- [ ] Validaciones recurrentes (existe-entidad, formato custom, regla de negocio) deben ser `@Constraint` + `ConstraintValidator` en `validation/annotations/` y `validation/validators/`.

### 3.3 — Errores como strings hardcoded en excepciones
**Grupos:** 4 (`AuthController.resolveRegisterError` depende de magic strings en mensajes), 14

- [ ] No usar `ex.getMessage().contains("...")` para decidir el flujo. Usar tipos de excepción específicos.

---

## 4. Persistencia

### 4.1 — N+1 queries (queja transversal)
**Grupos:** 1, 2, 3, 6, 7, 9, 10, 12, 14

- [ ] **Búsqueda dirigida:** `git grep -nE 'for \(.*: .*\) \{' services/src/main/java -A 5 | grep -E 'Dao\.find|Service\.find'`
- [ ] Patrones a revisar específicamente:
  - Loops con `*Dao.findById(id)` adentro.
  - `.stream().map(x -> service.findX(x.getId()))`
  - Servicios de "summary" o "dashboard" que arman vistas.
  - Resolvers de IDs preseleccionados en forms (caso Grupo 6: `ClubPollController.resolvePreselectedBooks`).

### 4.2 — RowMappers como lambda inline / en campo de instancia
**Grupos:** 3, 6, 10

- [ ] `git grep -nE 'RowMapper<.*> .*= \(rs, |new RowMapper<' persistence/src/main/java`
- [ ] Deben ser `private static final RowMapper<X> X_ROW_MAPPER = (rs, n) -> { ... };`

### 4.3 — RowMappers que duplican mapeo de otra entidad
**Grupo:** 10 ✅

- [ ] Auditar todos los `RowMapper` que hacen `JOIN` y reconstruyen entidades de otro DAO. Reusar el mapper público del otro DAO.

### 4.4 — RowMapper con subquery (N+1 disfrazado)
**Grupos:** 2, 3

- [ ] `git grep -nE 'jdbcTemplate.query.*rs, n' persistence/src/main/java -A 10 | grep -iE 'jdbcTemplate|query'` — un mapper no puede ejecutar queries adentro. Es N+1 silencioso.
- [ ] Solución: `JOIN` y agrupar en memoria, o `JOIN + GROUP_CONCAT` / agregación en SQL.

### 4.5 — Filtros, ordenamiento o paginación en memoria
**Grupos:** 1, 2, 4, 8, 11, 12, 13, 14

- [ ] `git grep -nE 'findAll\(\)|Integer\.MAX_VALUE|\.stream\(\).filter|\.subList|\.sorted\(' services/src/main/java`
- [ ] Casos típicos: `findAll().stream().filter(...).collect(...)` → debería ser `WHERE` en SQL.
- [ ] Paginación con `subList(from, to)` sobre lista completa → debe ser `LIMIT/OFFSET`.
- [ ] Ordenamiento por nombre/ID en Java → `ORDER BY` en SQL.

### 4.6 — DAOs que tocan tablas ajenas
**Grupos:** 5, 8, 9, 12, 13

- [ ] Por cada `*JdbcDao`, listar tablas referenciadas en `INSERT`/`UPDATE`/`DELETE` (no `SELECT` con JOIN).
- [ ] Cada tabla debe tener un único DAO owner que la mute. Joins de lectura son OK.
- [ ] Casos a buscar específicamente: `DELETE FROM <tabla_ajena>` desde un DAO que no es su owner.

### 4.7 — Borrado en cascada con múltiples DELETEs sin transacción
**Grupo:** 13 (`ArtworkServiceImpl.deleteArtwork` dispara 5 deletes vía `ArtworkJdbcDao.deleteById`)

- [ ] Si hay cascades manuales en services, deben estar bajo un único `@Transactional`.
- [ ] Alternativa: `ON DELETE CASCADE` en el schema.

### 4.8 — Upsert UPDATE-then-INSERT (race condition TOCTOU)
**Grupo:** 13 (`SellerJdbcDao.saveOrUpdate`)

- [ ] `git grep -nE 'saveOrUpdate|upsert' persistence/src/main/java`
- [ ] Reemplazar por `INSERT ... ON CONFLICT DO UPDATE` (Postgres) o `SELECT ... FOR UPDATE` previo.

### 4.9 — `rs.getLong()` sobre columnas nullable
**Grupo:** 13 (`techniqueId`, `mainColorId` — convierte NULL en 0L silenciosamente)

- [ ] `git grep -nE 'rs\.getLong|rs\.getInt|rs\.getDouble' persistence/src/main/java`
- [ ] Si la columna es nullable, usar `rs.getObject("col", Long.class)` o chequear `rs.wasNull()`.

### 4.10 — `IN` armado por string concatenation
**Grupo:** 9

- [ ] `git grep -nE '"IN \(" \+|IN \(" \+ String\.join' persistence/src/main/java`
- [ ] Debe pasarse la lista como parámetro JDBC (`NamedParameterJdbcTemplate` con `MapSqlParameterSource`).

### 4.11 — `findAll()` sin paginación usado para resolver listas
**Grupo:** 5 (`AddressServiceImpl` materializa `neighborhoodService.findAll()` para armar `Map<Long, Neighborhood>`)

- [ ] Reemplazar por `findByIds(Collection<Long>)` con `WHERE id IN (...)`.

### 4.12 — Migrations o queries SQL ejecutadas desde `WebConfig`
**Grupo:** 9

- [ ] `git grep -nE 'jdbcTemplate|DataSource' webapp/src/main/java/.../config` — `WebConfig` no debe ejecutar SQL.

### 4.13 — Migraciones mezcladas con DDL estructural / esquema test ≠ prod
**Grupos:** 12, 14

- [ ] Revisar `persistence/src/main/resources/schema.sql` y test resources. Datos de seed/migración deben ser archivos separados.

### 4.14 — Métodos no transaccionales / `@Transactional(readOnly=true)` faltante
**Grupos:** 2, 3, 5, 6, 12, 13

- [ ] `git grep -nE '@Transactional' services/src/main/java | grep -v readOnly` — métodos puramente de lectura deben tener `readOnly=true`.
- [ ] Métodos `create`/`update`/`delete` deben tener `@Transactional` sin `readOnly`.
- [ ] **Confirmar que NO hay métodos de escritura sin la anotación** (lo más grave): `find . -name '*ServiceImpl.java' -exec grep -l 'jdbcTemplate.update\|.create\|.delete' {} \;` → revisar uno por uno.

---

## 5. Spring Security

### 5.1 — `WebAuthConfig` no en `contextConfigLocation` del `web.xml`
**Grupo:** 3

- [ ] Revisar `webapp/src/main/webapp/WEB-INF/web.xml`. Aunque funcione por `@ComponentScan`, debe estar declarado explícitamente.

### 5.2 — Filter chain abierto con `anyRequest().permitAll()` + endpoints sin `@PreAuthorize`
**Grupo:** 5

- [ ] Revisar `WebAuthConfig.SecurityFilterChain`: si termina con `permitAll()`, todo endpoint sin anotación queda público.
- [ ] Recomendación: terminar con `.anyRequest().authenticated()` y abrir explícitamente lo público.

### 5.3 — `remember-me` key hardcoded / débil / faltante
**Grupos:** 3, 6, 9, 11, 14

- [ ] `git grep -nE 'rememberMe|remember-me|\.key\(' webapp/src/main/java`
- [ ] Debe venir de `@Value("${app.remember-me-key}")` o env variable. Nunca como literal en código.
- [ ] Verificar que `env.properties` tiene un fallback robusto (no `"paw-web-secret"`).

### 5.4 — `passwordEncoder` no asociado explícitamente al `AuthenticationManagerBuilder`
**Grupo:** 3

- [ ] Verificar que `WebAuthConfig` declare explícitamente el `PasswordEncoder` en el `auth.userDetailsService(...).passwordEncoder(...)`.

### 5.5 — `sessionManagement().invalidSessionUrl(...)` no configurado
**Grupo:** 3

- [ ] Cuando expira la cookie de sesión, Spring debe redirigir a una URL explícita.

### 5.6 — Login programático sin invalidar sesión previa
**Grupo:** 3 (`EmailVerificationController`)

- [ ] Si después de verificar email se hace login programático, debe llamarse `request.getSession().invalidate()` y crear sesión nueva (fixation attack).

### 5.7 — Recursos estáticos en filter chain en lugar de `web.ignoring()`
**Grupos:** 8, 14

- [ ] Recursos estáticos (`/css/**`, `/js/**`, `/images/**`) deben ir en `WebSecurityCustomizer.ignoring(...)` para no pagar el costo del filtro.

### 5.8 — Mezcla de `@PreAuthorize` con configuración centralizada
**Grupo:** 14

- [ ] Decidir UNA convención y aplicarla consistente. Idealmente toda regla de URL en `WebAuthConfig`, regla de método en `@PreAuthorize`.

### 5.9 — Lógica de autorización duplicada entre capas
**Grupo:** 13 (`ArtworkSecurity` duplica `SecurityServiceImpl`)

- [ ] Reglas de "es owner", "es admin", "puede leer" deben definirse UNA vez.

### 5.10 — Inyección del user autenticado redeclarada en cada controller
**Grupos:** 5, 13

- [ ] Si existe un `CurrentUserAdvice`, verificar que TODOS los controllers lo usen, no que casteen `authentication.getPrincipal()` manualmente.

### 5.11 — Filtros / componentes innecesarios que reimplementan Spring
**Grupo:** 4 (`DeviceScopedPersistentRememberMeServices`, `RequestCorrelationFilter`, `CurrentUserSynchronizationFilter`, `RequestParamParsers`, `DatabaseEncodingValidator`, `SessionInvalidator`)

- [ ] Revisar `webapp/src/main/java` por clases `*Filter`, `*Parser`, `*Validator` custom. Para cada una, justificar por qué Spring no lo provee.

### 5.12 — `WebUtils.getSessionMutex` u otra sincronización manual
**Grupo:** 4

- [ ] `git grep -nE 'synchronized|getSessionMutex|ReentrantLock|AtomicReference' webapp/src/main/java services/src/main/java` — Spring web container no necesita sync manual.

---

## 6. Manejo de excepciones / errores

### 6.1 — `IllegalArgumentException` / `IllegalStateException` / `RuntimeException` como excepciones de negocio
**Grupos:** 3, 7

- [ ] `git grep -nE 'throw new (IllegalArgumentException|IllegalStateException|RuntimeException)' services/src/main/java` — debe ser excepción de dominio custom mapeable por `@ControllerAdvice`.

### 6.2 — `instanceof` de excepciones en controllers
**Grupo:** 3

- [ ] `git grep -nE 'instanceof.*Exception' webapp/src/main/java/.../controller` — handling debe estar en `GlobalExceptionHandler`.

### 6.3 — `ImageController` devuelve 200 con placeholder en vez de 404
**Grupo:** 3

- [ ] Revisar `ImageController`: si la imagen no existe, devolver `404`, no `200 + SVG placeholder`. Sino los browsers cachean el placeholder como si fuera el recurso real.

### 6.4 — `ErrorController` sin `method=` ✅
- [ ] Ya cubierto.

### 6.5 — `GlobalExceptionHandler` envía mensaje crudo
**Grupo:** 5 (`mav.addObject("errorDetails", ex.getMessage())`)

- [ ] Confirmar que el handler no exponga stack traces ni mensajes internos al usuario final.

### 6.6 — Catches inconsistentes (genérico + específico en mismo archivo)
**Grupo:** 13 (`catch (Exception)` en un método vs `DataAccessException + RuntimeException` en otro)

- [ ] Auditar `GlobalExceptionHandler` — unificar criterios.

---

## 7. XSS, encoding y seguridad de input

### 7.1 — JSPs sin `<c:out>` / sin `escapeXml="true"`
**Grupos:** 5, 6, 7, 9

- [ ] `git grep -nE '\${[a-zA-Z_][^}]*}' webapp/src/main/webapp/WEB-INF --include='*.jsp' | grep -v 'c:out\|message\|c:url\|c:param\|c:if\|c:forEach'` — todo `${...}` que renderice valor de usuario debe ir adentro de `<c:out>` o tener `escapeXml="true"`.
- [ ] Atención especial a atributos `value="..."`, `style="..."`, `class="..."`.

### 7.2 — Búsquedas `LIKE` sin escapar `%` y `_` ✅
- [ ] Ya cubierto.

### 7.3 — Host header injection en mails (`appBaseUrl` desde request)
**Grupos:** 3, 6

- [ ] `git grep -nE 'getRequestURL|getServerName|getServletPath' webapp/src services/src` — URLs absolutas para mails deben venir de `@Value("${app.base-url}")`, NO del request.

---

## 8. Tests

### 8.1 — `AtomicReference` / `AtomicBoolean` para capturar argumentos
**Grupos:** 4, 9, 10 ✅, 12, 13, 14

- [ ] `git grep -nE 'AtomicReference|AtomicBoolean|AtomicInteger' --include='*.java' src/test` — si está adentro de `doAnswer(...)`, es reimplementar `verify`/`captor`.

### 8.2 — `Mockito.verify` usado donde está prohibido
**Grupo:** 12 (`CarServiceImplTest`)

- [ ] `git grep -nE 'Mockito\.verify|verify\(' --include='*Test.java'` — la cátedra prohíbe `verify` en tests de service. Usar `ArgumentCaptor`.

### 8.3 — Tests no unitarios (setup usa métodos del DAO bajo test)
**Grupos:** 2, 4, 6, 7, 9, 12

- [ ] Por cada `*JdbcDaoTest`, revisar `@Before` / setup: si llama métodos del mismo DAO que está testeando, debe insertar via `jdbcTemplate.execute(...)` directo.

### 8.4 — Tests que solo validan `assertDoesNotThrow`
**Grupo:** 10 ✅

### 8.5 — Múltiples valores en un `@Test` (no parametrizado)
**Grupo:** 10 ✅

### 8.6 — Tests con `Assertions.assertDoesNotThrow` sin asserts
**Grupo:** 10 ✅

### 8.7 — Tests de views acoplados a texto literal
**Grupo:** 14 (`ThymeleafMailTemplateRendererTest`)

- [ ] Revisar tests que hacen `assertThat(html).contains("Hola")` — son tests frágiles.

### 8.8 — Setup gigante con implementación custom de services
**Grupo:** 14 (`UiRouteTest`, 1400 líneas)

- [ ] Revisar tests largos, debería ser mock simple.

### 8.9 — Tests de persistencia que no validan estado final de la DB
**Grupos:** 12, 14

- [ ] Tests de DAO que solo verifican el retorno sin chequear la tabla con `JdbcTestUtils.countRowsInTable` o `SELECT` directo.

### 8.10 — Falta de tests sobre clase con mucha lógica
**Grupo:** 2 (`ProductServiceImpl`)

- [ ] Inventario: por cada `ServiceImpl`, ¿hay test? Si no, agregar.

### 8.11 — Reflection en tests
**Grupo:** 14 (acceder al ID de `auth.getPrincipal()`)

- [ ] `git grep -nE 'getDeclaredField|setAccessible|Method\.invoke' src/test`

### 8.12 — JUnit 4 y JUnit 5 mezclados
**Grupos:** 5, 7

- [ ] `grep -r 'org.junit.Test' src/test` (JUnit 4) vs `org.junit.jupiter.api.Test` (JUnit 5). Debe haber UNO solo (JUnit 5 según corrector).

---

## 9. i18n / localización

### 9.1 — Texto hardcoded en JSPs / tag files
**Grupos:** 2, 3, 6, 9, 10 ✅, 14

- [ ] `git grep -nE '>[A-Za-z][a-zñáéíóú ]{4,}<' webapp/src/main/webapp/WEB-INF --include='*.jsp' --include='*.tag'` — todo texto visible debe ser `<spring:message code="..."/>`.
- [ ] Atención a `aria-label`, `placeholder`, `title`, `alt` ✅.

### 9.2 — Mensajes de error hardcoded en controllers
**Grupos:** 9 (en español), 13 (en inglés)

- [ ] `git grep -nE 'rejectValue\(|addError\(' webapp/src/main/java` — el segundo argumento debe ser code de bundle, no string literal.

### 9.3 — Mails que usan `LocaleContextHolder.getLocale()` en `@Async`
**Grupo:** 2

- [ ] Si hay mailing async, el locale debe pasarse explícitamente al método async, no leerse del `LocaleContextHolder` (que es ThreadLocal y no se propaga).

### 9.4 — `messageSource.getMessage()` en controllers/services en vez de `spring:message` en la JSP
**Grupo:** 14

- [ ] `git grep -nE 'messageSource\.getMessage|MessageSource' webapp/src services/src` — solo válido en mails (no hay JSP). En vistas web, usar `<spring:message>`.

### 9.5 — `i18n` mal hecho via query param
**Grupo:** 13

- [ ] Verificar `LocaleChangeInterceptor`: debe usar Accept-Language o un override de UI session-based, no `?lang=es` en cada URL.

### 9.6 — `PurchaseStatus` u otros enums sin mensajes i18n
**Grupo:** 2

- [ ] Por cada enum del dominio que se muestre al usuario, verificar que tenga keys en `messages*.properties`.

---

## 10. URLs, HTTP semantics y mappings

### 10.1 — `@RequestMapping` sin `method` ✅
- [ ] Ya cubierto.

### 10.2 — Endpoints que devuelven strings inventados con `@ResponseBody`
**Grupo:** 6 (`OK:/landing`, `ERROR:...`)

- [ ] `git grep -nE '@ResponseBody' webapp/src/main/java/.../controller` — los flujos web deben usar redirect + flash, no protocolos inventados sobre HTTP.

### 10.3 — Diferenciar ajax vs no-ajax con `if` en el controller
**Grupo:** 9 (`RatingController.rateProduction`)

- [ ] Si dos clientes necesitan formatos distintos, deben ser dos endpoints (`/rate` para form, `/api/rate` para ajax).

### 10.4 — Paths con query params en vez de path variables
**Grupo:** 12 (`/reviews?carId=526` debería ser `/cars/526/reviews`)

- [ ] Revisar URLs RESTful: el ID de la entidad principal va en el path.

### 10.5 — `RequestMapping` con paths inconsistentes / sin convención
- [ ] Auditar familias de endpoints: ¿hay mix de `/product/{id}` y `/products/{id}`?

---

## 11. Configuración / Spring beans

### 11.1 — Logger config con paquetes de terceros como si fueran propios
**Grupo:** 8 (`com.zaxxer`)

- [ ] Revisar `logback.xml`: solo paquetes del proyecto + librerías que realmente queremos tunear.

### 11.2 — Logger duplicado para subpaquetes
**Grupo:** 2 (`ar.edu.itba.paw.services` y `ar.edu.itba.paw`)

- [ ] `grep '<logger' webapp/src/main/resources/logback*.xml`

### 11.3 — Logging excesivo (todo INFO/STDOUT, 30 archivos por appender)
**Grupo:** 4

- [ ] Verificar `RollingFileAppender` configs: número de archivos, niveles por paquete.

### 11.4 — `DEBUG` en producción
**Grupo:** 6

- [ ] Asegurar perfil `prod` con `WARN`/`INFO` solamente.

### 11.5 — `ThreadPoolTaskExecutor` sin shutdown handling
**Grupos:** 2, 14

- [ ] `git grep -nE 'ThreadPoolTaskExecutor' --include='*.java'` — debe tener `setWaitForTasksToCompleteOnShutdown(true)` y/o `setRejectedExecutionHandler(...)`.

### 11.6 — `@Async` + acceso a relaciones lazy / locale del thread caller
**Grupos:** 2 (mails con locale del caller)

- [ ] Cualquier `@Async` debe pasar explícitamente locale, user, tenant — nunca depender de `ThreadLocal` del request original.

### 11.7 — `logback-test.xml` en `src/test/resources` en vez de `src/main/resources`
**Grupo:** 3

- [ ] Si el `logback-test.xml` está en main, el dev environment carga config de test. Debe estar en test resources.

### 11.8 — Secretos hardcoded en código fuente
**Grupos:** 11, 13

- [ ] `git grep -nE 'secret|password|apiKey|token' --include='*.java' webapp/src/main/java` — todo secret debe venir de `@Value("${...}")` con env override.

---

## 12. Modelos / dominio

### 12.1 — Modelos sin `equals`/`hashCode` por ID
**Grupos:** 5, 13

- [ ] Por cada clase en `models/`, verificar que tenga `equals` y `hashCode` basados en `id`. Sino, `Set<User>` y `Map<User, X>` rompen.

### 12.2 — `toString` que loguea password / campos sensibles
**Grupos:** 3, 5

- [ ] `git grep -nE 'toString|@ToString' models/src/main/java`
- [ ] Lombok: `@ToString(exclude = "passwordHash")` o equivalente. Sin Lombok: implementar manualmente excluyendo password.

### 12.3 — Boxed primitives donde la tabla es `NOT NULL`
**Grupo:** 2

- [ ] Revisar campos `Integer`/`Long`/`Boolean` en modelos: si la columna es NOT NULL, usar `int`/`long`/`boolean`.

### 12.4 — Campos prácticamente `final` no declarados como tales
**Grupo:** 2 (campos de `Token`)

- [ ] Modelos value-object deben tener `private final` + sin setters.

### 12.5 — Modelos de dominio definidos en interfaces de servicios
**Grupo:** 9

- [ ] Los modelos viven en `models/`, no en `service-contracts/`.

### 12.6 — Package name del archivo no corresponde al path
**Grupo:** 9 (`ar.edu.itba.paw.persistence` en archivos bajo `ar.edu.itba.paw.interfaces.persistence`)

- [ ] `find . -name '*.java' | xargs grep -l '^package' | while read f; do pkg=$(grep '^package' "$f" | sed 's/package //;s/;//'); dir=$(dirname "$f" | sed 's|.*src/main/java/||;s|/|.|g'); [ "$pkg" != "$dir" ] && echo "MISMATCH: $f"; done`

### 12.7 — Naming de interfaces que filtra detalles de implementación
**Grupo:** 3 (`EmailVerificationTokenService` → debería ser `VerificationTokenService`)

- [ ] Auditar interfaces de service-contracts: el nombre debe ser agnóstico del canal/tecnología.

### 12.8 — DTOs en sentido service → jsp
**Grupo:** 14

- [ ] Si hay DTOs para que la JSP los renderice, probablemente sobran. Las JSPs deberían trabajar sobre el modelo directamente (con EL).

### 12.9 — Status + tokens combinados en un solo campo string
**Grupo:** 2 (`PurchaseJdbcDao` combina status + token comprador + token vendedor)

- [ ] Cada concept = una columna.

---

## 13. JSP / Views

### 13.1 — JSPs que no invocan footer / no cierran consistente
**Grupo:** 3 (`profileView.jsp` cierra `</body></html>` sin `<paw:footer/>`)

- [ ] Verificar que TODAS las JSPs usen el mismo layout/template.

### 13.2 — URI de taglib no estándar
**Grupo:** 3 (`http://java.sun.com/jstl/core_rt` en lugar de `http://java.sun.com/jsp/jstl/core`)

- [ ] `grep -rn 'taglib uri' webapp/src/main/webapp` — todas las URIs deben ser las estándares JSTL 1.2.

### 13.3 — Query strings serializados a mano con `StringBuilder` ✅
- [ ] Ya cubierto.

### 13.4 — Categorías de filtros con tags que no se hablan entre sí
**Grupos:** 4, 12 (UX) — verificar coherencia entre filtros y resultados.

### 13.5 — `ShellViewModelFactory` u otros componentes Java innecesarios
**Grupo:** 14

- [ ] Rendering por rol → `<sec:authorize>` taglib, no clases Java en webapp.

---

## 14. Mailing

### 14.1 — Recordatorios: un mail por suscripción en vez de uno por usuario
**Grupo:** 4

- [ ] Si hay jobs que envían recordatorios, agrupar por destinatario.

### 14.2 — `MailDispatchService` no es dueño de la lógica
**Grupo:** 14

- [ ] Si quien llama al mailer arma el `MailContent` con el template, el `MailDispatchService` no es Façade — debería recibir tipo de mail + payload genérico.

### 14.3 — Templates de mail distribuidos entre webapp y services
**Grupo:** 2

- [ ] Mailing es responsabilidad del módulo `services`. Templates de mail deben estar en `services/src/main/resources/mail-templates/` (no en `webapp/`).

### 14.4 — PDF viewer / comprobante roto
**Grupo:** 11 — verificar el generador de comprobante de la codebase.

### 14.5 — Auth de mails con token sin invalidar tras uso / sin chequear user actual
**Grupos:** 2, 3

- [ ] Mails con link de "confirmar acción" deben revisar que el user del token sigue siendo válido y el token no fue usado.

---

## 15. Bugs y consideraciones funcionales (verificar si están presentes)

### 15.1 — Página de número negativo da 500 en vez de 400
**Grupos:** 2, 14

- [ ] Probar `/catalog?page=-1` y `/events?page=-1` — debe devolver 400 o redirigir a página 1.

### 15.2 — Ban solo verifica login, no sesión activa
**Grupo:** 2

- [ ] Si banean a un user, su sesión activa debe invalidarse (no solo bloquear el próximo login).

### 15.3 — Validación de rangos de fechas (desde > hasta)
**Grupo:** 3

- [ ] Bean Validator que verifique `desde < hasta`.

### 15.4 — Reset password pide email cuando el user ya está logueado
**Grupo:** 2

- [ ] Si user logueado pide reset, usar el email de la sesión, no preguntarlo.

### 15.5 — i18n no cambia idioma
**Grupo:** 2

- [ ] Probar manualmente que cambiar idioma realmente cambia el contenido.

### 15.6 — Búsqueda devuelve resultados de campos que no debería
**Grupo:** 1 (no saben sobre qué campos filtra)

- [ ] Documentar claramente qué campos están en el `LIKE` del search.

### 15.7 — Verificar email deja autologueado (positivo, comportamiento deseable)
**Grupos:** 1, 3 — OK (es el comportamiento esperado).

### 15.8 — Doble submit (race condition en POST)
**Grupo:** 12

- [ ] Submits que crean entidades únicas deben tener guard (token CSRF + uniqueness constraint).

---

## Resumen de hallazgos

Por cada sección 1-15, marcar:

- [ ] **No aplica** — no hay código de ese tipo
- [ ] **Limpio** — verificado, el error no está presente
- [ ] **Encontrado** — listar archivo + línea + acción propuesta
- [ ] **Parcial** — listar dónde sí y dónde no

Resultados — completados por la auditoría General Audit V4 (commit `48c0b02`, 2026-05-27):

| Sección | Estado | Archivos afectados | Acción / referencia V4 |
|---------|--------|---------------------|--------|
| 1.1 Versiones hardcoded en POMs hijos | ✅ Limpio | (commons-fileupload ya en padre) | Fix aplicado: `pom.xml:40,263-265` |
| 1.2 Java target/release mismatch | ✅ Limpio | (Java 21 consistente) | — |
| 1.3 Versiones de plugins redeclaradas con valor distinto | ✅ Limpio | — | — |
| 1.4 Property que duplica un literal | ✅ Limpio | — | — |
| 1.5 Scopes faltantes/incorrectos | ✅ Limpio | (servlet-api `provided`, sibling modules con `runtime`) | — |
| 1.6 `1.0-SNAPSHOT` redeclarado en hijos | ✅ Limpio | — | — |
| 1.7 Webapp depende de `persistence` directamente | ✅ Limpio | — | — |
| 1.8 Plugin versions en hijos | ✅ Limpio | — | — |
| 1.9 Archivos basura versionados | ✅ Limpio | — | — |
| 1.10 AGENTS.md + CLAUDE.md ambos | ❌ Encontrado | `AGENTS.md`, `CLAUDE.md` | V4 B1 — borrar uno |
| 2.1 Lógica de negocio en controllers | ❌ Encontrado | `CatalogController.parseCategoryFilters` + `buildFilterQueryString` + `ImageController.detectContentType` + `DashboardController.computeReviewableRentIds` | V4 L2-L5 (todos en devolucion TP1) |
| 2.2 Helpers MvcSupport con lógica | ✅ Limpio | (RentProgressHelper, PublicationFormOptionsHelper son de presentación pura) | — |
| 2.3 Lógica de presentación en service | ✅ Limpio | (no hay redirects en services) | — |
| 2.4 Auth en controllers en lugar de Spring Security | ❌ Encontrado | `RentRequestController` × 8 + `DashboardController` × 2 con `@AuthenticationPrincipal AuthUser` | V4 S2 |
| 2.5 Services que dependen de DAOs ajenos | ✅ Limpio | (cross-service injection respetado) | — |
| 3.1 Validaciones manuales en controllers | ✅ Limpio | (custom validators bien estructurados) | — |
| 3.2 Custom validators faltantes | ✅ Limpio | (20 validators en webapp/validation) | — |
| 3.3 Errores como strings hardcoded | ✅ Limpio | — | — |
| 4.1 N+1 queries | ❌ Encontrado | `ImageJpaDao.grantAccess(Collection<Long>)` loop | V4 A6 |
| 4.2 RowMappers inline/instancia | ⚠️ Parcial | `ProductImagesJdbcDao:46-51` (ReviewJdbcDao ya comentado) | V4 L8 |
| 4.3 RowMappers duplicando otra entidad | ⚠️ Parcial | `ProductImagesJdbcDao` duplica `IMAGE_ROW_MAPPER` | V4 L8 |
| 4.4 RowMapper con subquery (N+1 disfrazado) | ✅ Limpio | — | — |
| 4.5 Filtros/orden/pagination en memoria | ✅ Limpio | (bulk loads + SQL ORDER BY) | — |
| 4.6 DAOs que tocan tablas ajenas | ✅ Limpio | — | — |
| 4.7 Borrado en cascada sin transacción | ✅ Limpio | — | — |
| 4.8 Upsert UPDATE-then-INSERT | ✅ Limpio | — | — |
| 4.9 `rs.getLong()` sobre nullable | ✅ Limpio | (JPA + JpaDao predominantes) | — |
| 4.10 `IN` por string concatenation | ❌ Encontrado | `ImageJdbcDao.deleteByIds:100-104` + `ProductImagesJdbcDao.removeFromProduct:62-71` | V4 C1 (no es SQL injection real pero anti-patrón) |
| 4.11 `findAll()` sin paginación | ✅ Limpio | — | — |
| 4.12 SQL en `WebConfig` | ✅ Limpio | — | — |
| 4.13 Migrations mezcladas con DDL | ✅ Limpio | — | — |
| 4.14 `@Transactional(readOnly=true)` faltante | ✅ Limpio | (cobertura consistente) | — |
| 5.1 `WebAuthConfig` no en contextConfigLocation | ✅ Limpio | (verificado en web.xml) | — |
| 5.2 Filter chain abierto con `permitAll()` | ✅ Limpio | — | — |
| 5.3 `remember-me` key hardcoded en código Java | ✅ Limpio | (verificable en código Java; `application.properties` fuera de scope) | — |
| 5.4 `passwordEncoder` no asociado a auth | ✅ Limpio | — | — |
| 5.5 `sessionManagement.invalidSessionUrl` | ✅ Limpio | — | — |
| 5.6 Login programático sin invalidar sesión | ⚠️ A revisar | (`AuthSupport.autoLogin()` posible fixation risk) | V4 (AUTH-S2 MEDIA) |
| 5.7 Recursos estáticos en filter chain | ✅ Limpio | — | — |
| 5.8 Mezcla `@PreAuthorize` con WebAuthConfig | ❌ Encontrado | `RentServiceImpl` × 9 + `ImageController` × 1 | V4 S1 + L6 |
| 5.9 Lógica de auth duplicada entre capas | ❌ Encontrado | `findOwnedByX` + `@PreAuthorize` + `WebAuthConfig` (3 capas) | V4 S1 |
| 5.10 Inyección user redeclarada en controllers | ❌ Encontrado | 10 sitios con `@AuthenticationPrincipal` | V4 S2 |
| 5.11 Filtros custom que reimplementan Spring | ✅ Limpio | (cero filters custom innecesarios) | — |
| 5.12 `getSessionMutex` u otra sync manual | ✅ Limpio | — | — |
| 6.1 `IllegalArgumentException` como business | ❌ Encontrado | `ReportServiceImpl` × 8 + 7 más en otros services | V4 L1 |
| 6.2 `instanceof` de exception en controllers | ✅ Limpio | — | — |
| 6.3 `ImageController` 200+placeholder en lugar de 404 | ⚠️ A verificar | (no se completó verificación en V4) | — |
| 6.4 `ErrorController` sin `method=` | ❌ Encontrado | `ErrorController.java:12,18,24` | V4 B3 (devolución TP1 confirmada) |
| 6.5 `GlobalExceptionHandler` envía mensaje crudo | ✅ Limpio | — | — |
| 6.6 Catches inconsistentes | ❌ Encontrado | try-catch `ResourceNotFoundException` en `AdminController:339-343` | V4 A2 |
| 7.1 JSPs sin `<c:out>` / escapeXml | ✅ Limpio | (uso consistente, 39 JSPs limpios) | — |
| 7.2 LIKE sin escape de `%`/`_` | ✅ Limpio | `UserJpaDao:109` + `ProductJpaDao:293-294` con escape | — |
| 7.3 Host header injection en mails | ✅ Limpio | (`@Value("${app.base-url}")`) | — |
| 8.1 `AtomicReference`/`AtomicBoolean` en `doAnswer` | ❌ Encontrado | `ProductServiceImplTest` × 13 + `ReportServiceImplTest` × 6 | V4 T1 (devolución TP1 mencionó 4, ahora 19) |
| 8.2 `Mockito.verify` usado donde prohibido | ✅ Limpio | (cero `verify`/`spy` reales; solo comentarios) | — |
| 8.3 Tests no unitarios | ✅ Limpio | (verificado en agente TESTING) | — |
| 8.4 `assertDoesNotThrow` sin asserts | ❌ Encontrado | 11 ocurrencias entre Rent/Product/Email/Image/Favorite ServiceImplTest | V4 T2 |
| 8.5 Múltiples valores en un @Test no parametrizado | ❌ Encontrado | `CurrencyTest.testFromSlugWhenAllValuesRoundtrip` | V4 T3 (devolución TP1) |
| 8.6 (igual a 8.4) | ❌ Encontrado | — | V4 T2 |
| 8.7 Tests de views acoplados a texto literal | ✅ Limpio | (no detectado) | — |
| 8.8 Setup gigante con services custom | ✅ Limpio | — | — |
| 8.9 Persistence tests sin validar DB | ✅ Limpio | (todos usan `JdbcTestUtils.countRowsInTableWhere`) | — |
| 8.10 Falta tests sobre clase con mucha lógica | ⚠️ Parcial | (validators sin tests unitarios) | V4 L10 |
| 8.11 Reflection en tests | ✅ Limpio | — | — |
| 8.12 JUnit 4 y 5 mezclados | ✅ Limpio | (todo JUnit 5) | — |
| 9.1 Texto hardcoded en JSPs/tags | ⚠️ Parcial | 3 `aria-label` en inglés (admin-tabs.tag, reports.jsp, reports-repeated.jsp) | V4 I1 (devolución TP1 residual) |
| 9.2 Mensajes de error hardcoded en controllers | ✅ Limpio | — | — |
| 9.3 Mails con `LocaleContextHolder.getLocale()` en `@Async` | ✅ Limpio | (usa `recipient.getPreferredLanguage()`) | — |
| 9.4 `messageSource.getMessage` en controllers | ✅ Limpio | — | — |
| 9.5 i18n via query param | ✅ Limpio | (`PersistingLocaleChangeInterceptor` con session) | — |
| 9.6 Enums sin i18n | ⚠️ Parcial | `AdminActionTargetType` sin `getDisplayName` | V4 M1 |
| 10.1 `@RequestMapping` sin `method=` | ❌ Encontrado | `ErrorController.java:12,18,24` | V4 B3 |
| 10.2 Endpoints con strings inventados `@ResponseBody` | ✅ Limpio | — | — |
| 10.3 `if` ajax vs no-ajax en controller | ✅ Limpio | — | — |
| 10.4 Query params en lugar de path variables | ✅ Limpio | (URLs RESTful) | — |
| 10.5 Paths inconsistentes | ✅ Limpio | — | — |
| 11.1 Logger config con paquetes ajenos | ✅ Limpio | — | — |
| 11.2 Logger duplicado para subpaquetes | ✅ Limpio | — | — |
| 11.3 Logging excesivo INFO/STDOUT | ⚠️ Encontrado | `hibernate.show_sql=true` + `format_sql=true` en `WebConfig:196-197` | V4 B2 |
| 11.4 DEBUG en producción | ❌ Encontrado | (mismo que 11.3) | V4 B2 |
| 11.5 `ThreadPoolTaskExecutor` sin shutdown | ✅ Limpio | — | — |
| 11.6 `@Async` + locale del caller | ⚠️ Parcial | `EmailServiceImpl` usa `payload.getXxxLocale()` correctamente; pero `@Async` × 8 SIN try-catch | V4 A1 |
| 11.7 `logback-test.xml` en wrong location | ✅ Limpio | (excluido del WAR) | — |
| 11.8 Secrets hardcoded en código fuente | ✅ Limpio | (cero en código Java) | — |
| 12.1 Modelos sin equals/hashCode | ⚠️ Parcial | (mayoría OK; algunos sin equals) | — |
| 12.2 `toString` con password | ✅ Limpio | — | — |
| 12.3 Boxed primitives donde NOT NULL | ✅ Limpio | — | — |
| 12.4 Campos prácticamente final no marcados | ⚠️ Parcial | (Hibernate requiere algunos) | — |
| 12.5 Modelos en interfaces de servicios | ✅ Limpio | — | — |
| 12.6 Package no corresponde al path | ✅ Limpio | — | — |
| 12.7 Naming de interfaces con detalles de impl | ✅ Limpio | — | — |
| 12.8 DTOs sentido service→jsp | ✅ Limpio | (DTOs son data carriers puros) | — |
| 12.9 Status + tokens combinados | ✅ Limpio | — | — |
| 13.1 JSPs sin invocar footer | ✅ Limpio | — | — |
| 13.2 URI de taglib no estándar | ✅ Limpio | — | — |
| 13.3 Query strings serializados a mano | ❌ Encontrado | `CatalogController.buildFilterQueryString` | V4 L5 (devolución TP1) |
| 13.4 Categorías de filtros incoherentes | ✅ Limpio | — | — |
| 13.5 `ShellViewModelFactory` u otros componentes Java | ✅ Limpio | — | — |
| 14.1 Mails: uno por suscripción en lugar de uno por user | ✅ Limpio | (cron consolidado) | — |
| 14.2 `MailDispatchService` no es Façade | ✅ Limpio | (EmailServiceImpl es Façade) | — |
| 14.3 Templates de mail distribuidos | ✅ Limpio | (todo en services/) | — |
| 14.4 PDF viewer / comprobante roto | ⏸️ Postponed | (opcional, en devolución TP1 como "estaría bueno") | — |
| 14.5 Tokens sin invalidar tras uso | ✅ Limpio | — | — |
| 15.1 Page negativo da 500 | ⚠️ Parcial | `ProductServiceImpl.normalizePageNumber` clampea floor pero NO ceiling | V4 A8 |
| 15.2 Ban verifica solo login | ✅ Limpio | — | — |
| 15.3 Validación rangos de fechas | ✅ Limpio | (`@ValidRentDateRange`) | — |
| 15.4 Reset password pide email cuando logueado | ⚠️ A verificar | (no completado en V4) | — |
| 15.5 i18n no cambia idioma | ✅ Limpio | — | — |
| 15.6 Búsqueda devuelve campos inesperados | ✅ Limpio | (LIKE en campos documentados) | — |
| 15.7 Verificar email deja autologueado | ✅ OK (comportamiento deseable) | — | — |
| 15.8 Doble submit (race condition) | ⚠️ A verificar | (no completado en V4) | — |

### Resumen agregado

- **Total secciones evaluadas:** 91
- **✅ Limpias:** 56
- **❌ Encontradas:** 22 (incluye duplicados cross-section como B3, L5, S2)
- **⚠️ Parciales / A verificar:** 13
- **⏸️ Postponed:** 1 (PDF comprobante)
- **Hallazgos únicos del scout reportados en DICTAMEN V4:** 16-22 (CRÍTICOS+ALTOS), 47 totales.

---

## Cross-references

- [[devolucion-tp1-nuestra]] — feedback oficial de un grupo evaluado.
- [[plan-correcciones-tp1-grupo10]] — plan principal de correcciones.
- [[devolucion-tp1]] — devolución previa (12 grupos).
- [[devolucion-tp1-referencia-15-grupos]] — referencia de 15 grupos.
- [[correcciones-segunda-entrega]] — feedback de TP2.

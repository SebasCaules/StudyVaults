---
title: Wiki Index
type: index
updated: 2026-05-28
---

# PAW Wiki Index

Catálogo completo del wiki del proyecto **Rent The Slopes** (Spring MVC, curso PAW — ITBA 2026-1C). Organizado por categoría y subcategoría. Cada entrada incluye una descripción rica del contenido para facilitar la búsqueda semántica.

> **Convención:** las entradas se leen como *"mirá acá si estás buscando X"*. Si algo no aparece, probablemente vaya como update de una página existente antes que como página nueva.

---

## 🗂️ Entities — Inventario del código

Qué hay efectivamente en el repo: clases, interfaces, tablas, archivos.

- [[Domain Models]] — Las 12 clases en `models/` (User con builder, Product, Rent, Price, Block, Image, Review + view/DTO models como `BlockedDateRange`, `CatalogCriteria`, `Page<T>`, `ReviewView`, `SpecialPriceView`). Las entidades persistidas son JPA entities (non-final, no-arg protected constructor, setters donde el service mutates). User suma admin invite fields (`invitedAsAdmin`, `adminInviteToken`, `adminInviteExpiresAt` — Issue #20) + flags de deactivation; Rent suma `paymentMethod` UPLOAD/CASH (Issue #10). 4 excepciones en `models.exception`; el resto migró a `services.exceptions` (15 excepciones).
- [[Enums]] — Los 18 enums del dominio: Category (14 valores agrupados), CategoryGroup, Size, Condition, Gender, Currency, Location, ProductStatus (5 valores: ACTIVE/PAUSED/DELETED/PENDING_LOCATION/UNDER_REVIEW), PaymentMethod (UPLOAD/CASH — #10), RentStatus (10 valores con `RentDashboardCategory`), CatalogOrderBy, OrderDirection, IdentityChoice, UserRole, FinishedDashboardRow + interfaces `HasDisplayName` y `HasSlug`.
- [[Controllers]] — Los 16 controllers del webapp module + 5 `@ControllerAdvice` (CurrentUserAdvice, GlobalExceptionHandler, LoginControllerAdvice, ProductControllerAdvice, RentRequestControllerAdvice). 19 form objects en `webapp.form` (incluye 6 forms granulares de profile y forms del flujo de pago/review). Tabla completa de excepciones con mapeo HTTP.
- [[Services]] — 12 service interfaces + 13 implementations (incluye `AdminBootstrap` que crea el admin). Documenta `RentService.findOwnedByProvider`/`findOwnedByRenter`, transiciones de RentStatus, dashboards agrupados (`groupRentsByCategory`), flujo de verificación de email y reset de password. DTOs en `services.dto` (`RentData`, `RentEmailPayload`, `SpecialPriceDto`).
- [[DAOs (Persistence Layer)]] — 9 DAO interfaces. La mayoría migrados a JPA (`UserJpaDao`, `ProductJpaDao`, `RentJpaDao`, `ReportJpaDao`, `BlockJpaDao`, `FavoriteJpaDao`, `PriceHibernateDao`); legacy `*JdbcDao` para los restantes. Schema completo (PostgreSQL/HSQLDB) y reglas de schema parity. Migraciones recientes: **V34** (`rents.payment_method`, Issue #10) y **V35** (`users.admin_invite_token` + flags, Issue #20).
- [[Views (JSP & Tags)]] — 25 páginas JSP + 40 custom tags. Bootstrap JS centralizado en `footer.tag`. i18n con 4 bundles (default/es/en/fr) y locale change interceptor en sesión. Convenciones obligatorias (no-scriptlets, `<c:out>` para XSS, `<sec:authorize>` para roles).
- [[Tests]] — 9 DAO test classes + 12 service test classes + tests utilitarios. Persistencia con HSQLDB + `populator.sql` (read tests no insertan). Services con Mockito puro. Cero `Mockito.verify` desde el refactor del corrector.

## 🧠 Concepts — Patrones, reglas y decisiones

Ideas atemporales que atraviesan el código. Si buscás *cómo* o *por qué* algo se hace así, mirá acá.

### Arquitectura y wiring

- [[Maven Module Structure]] — Layout multi-módulo (models, service-contracts, services, persistence, webapp), dirección de dependencias, scope rules (provided/runtime/test) y gestión de versiones en el parent POM.
- [[Spring Configuration]] — Beans del `WebConfig`, setup de `web.xml`, component scanning por módulo, resource handlers para estáticos, `DataSourceTransactionManager` y `@EnableTransactionManagement`.
- [[Dependency Injection]] — Stereotype annotations (`@Controller`/`@Service`/`@Repository`/`@Component`), reglas de `@Autowired` (constructor vs field), y por qué la dirección de dependencias se respeta en runtime gracias al scope de Maven.

### Controllers, validación y forms

- [[Controllers & Validation]] — Patrón PRG, orden obligatorio de `BindingResult` inmediatamente después de `@Valid`, form objects como única fuente de validación (regla 10: "validar en el form, no en el controller"), JSR-303, `@ControllerAdvice`, file upload con límites, custom validators del equipo (carpeta `validation/annotations/` + `validation/validators/`, con ejemplos de `ExistingProductIdValidator` y `ProductSizeForCategoryValidator`), **Validation Groups** (`@Validated(Group.class)` + marker interface para reutilizar la misma form en registro y edit), tabla de excepciones con mapeo HTTP.
- [[Paginación, Filtros y Búsqueda]] — Patrón de 3 formularios (searchbar + filtros + paginación) que comparten estado vía hidden fields, validación manual de query params (no `@Valid` porque son GET), `location` como query param independiente y código JSP real.
- [[JSP Views]] — Regla anti-scriptlet, referencia completa de JSTL Core tags, operadores EL, `c:url` para URLs context-relative, form binding con spring-taglibs, i18n con `MessageSource`, custom tags vía SimpleTag + TLD, **XSS prevention** (obligatorio `<c:out>`) y `<sec:authorize>` de spring-security-taglibs.

### Persistencia

- [[Persistence (Spring JDBC)]] — Patrones de `JdbcTemplate` y `SimpleJdbcInsert`, `RowMapper` reutilizable, gestión de schema con `DataSourceInitializer`, diferencias de sintaxis HSQLDB vs PostgreSQL (IDENTITY vs SERIAL, etc.). **Capa actualmente en uso**, pero con migración a Hibernate prevista.
- [[Hibernate & JPA]] — Migración hacia ORM: impedancia O-R con el ejemplo Friendship, dependencias, `EntityManagerFactory` + `JpaTransactionManager`, anotaciones de mapeo, patrón `*HibernateDao` con `@PersistenceContext`, **EntityManager stateful (no singleton)**, **dirty state detection (update sin save)**, JPQL/HQL con AST caching, propiedades de Hibernate, constructor default obligatorio, `TestConfiguration` con HSQLDB, ejemplo `Issue`, **cambios de pom para Java 9+ JPMS** (`--add-opens`). Clase pt2 (11/05): **relaciones** (`@ManyToOne`/`@OneToMany` + `mappedBy`/`orphanRemoval`/`cascade`/`optional`), **fetch LAZY vs EAGER** y `PersistentBag`/proxies, **`LazyInitializationException` + `OpenEntityManagerInViewFilter`** con su tradeoff (perder control de queries), **regla NO modificar entidades directamente** (dirty checking dispara UPDATE invisible), **`em.getReference()`** para FK sin query, **JPQL navega propiedades** del modelo (no columnas), **`@Enumerated(STRING)` preferido sobre ORDINAL**, y el patrón **paginación 1+1 queries** (CLAVE PARA APROBAR PRÓXIMO TP — native query de ids paginados + JPQL `WHERE id IN :ids ORDER BY ...`, con `List<Number>` y guard de lista vacía).

### Testing

- [[Testing Practices]] — Mockito para services, HSQLDB + `@Rollback` para DAOs, JUnit 4 vs 5 patterns, y **behavior vs implementation**: no usar `verify()`/`spy`, assertar en DB en tests de persistencia, JUnit 5 obligatorio según corrector.

### Seguridad

- [[Admin Invite Flow]] — Issue #20: token-based admin invitation con single-use TTL 7d, registro vía `/register?email=&token=`, threat model y prevención del hijack.
- [[Payment Method (UPLOAD/CASH)]] — Issue #10: escape hatch CASH para el caso "provider sin CBU"; class-level validator `@PaymentProofRequiredIfUpload` + CBU gating en `approveRent`.
- [[Spring Security]] — `WebAuthConfig` con la API moderna `SecurityFilterChain` (no el deprecated `WebSecurityConfigurerAdapter`), `UserDetailsService` del proyecto con `AuthUser` interno, `CurrentUserAdvice` reemplazando `@AuthenticationPrincipal`, **ownership checks en services** (`RentService.findOwnedByProvider`), **ownership dinámico via SpEL `access("@userSecurity.hasUserId(authentication, #id)")`** con bean propio (alternativa a chequeos en service), patrón de **refresh del SecurityContext** tras mutar el principal, uso de `SecurityContextHolder` en ControllerAdvice y consistencia WebAuthConfig vs `@PreAuthorize`.

### Infraestructura transversal

- [[Logging (Logback / SLF4J)]] — Fachada SLF4J, estrategia dev vs prod con perfiles de logback, `RollingFileAppender`, regla del `{}` placeholder (no `+`) y additivity. Incluye loggers para Hibernate (`org.hibernate.SQL`, `org.hibernate.orm.jdbc.bind`) como reemplazo limpio de `show_sql=true`.
- [[AOP & Transactions]] — Modelo proxy de Spring, restricciones del proxy (público, llamadas externas), `@Transactional` a nivel Service, estilo por método (`readOnly=true` para lecturas) con ejemplos reales de `UserServiceImpl`/`RentServiceImpl`, `@Rollback` en tests, `@Scheduled`.

### Proceso y workflow

- [[Pre-Delivery Checklist]] — Checklist completo de verificación (estructura, DI, controllers, views, persistencia, testing) derivado de las directivas de la cátedra.
- [[PAW Skills & Tools Reference]] — Referencia de las 9 skills especializadas de Claude Code (good-practice, enhancer, planning, implementation, testing, refactor, debug, schema-migrate, performance) con modelo, esfuerzo, inputs/outputs y ejemplos.
- [[PAW Skills Quick Start Guide]] — Guía rápida con tablas de referencia, workflows típicos (feature dev, bug triage, quality review, optimization) y troubleshooting.

---

## 📚 Sources — Material original ingerido

Resúmenes de documentos fuente. Cada uno es inmutable en `raw/`; acá vive su destilado.

### Cátedra — correcciones y roadmap

- [[Sprint 2 — Indicaciones del Corrector]] — Notas del corrector para el Sprint 2: bugs del Sprint 1, arquitectura de validaciones (custom validators), paginación+filtros, controller advice, tests, flujo del pseudo-chat de pago, cambios de BD y asignaciones.
- [[Devolución TP1 — Feedback Primera Entrega]] — Correcciones del TP1 para los 12 grupos: errores graves (XSS, ownership, falta de tests), errores de código, errores de demo, puntos positivos, seguimiento por grupo.
- [[Devolución TP1 — Referencia 15 Grupos]] — Segundo documento de devolución (15 grupos, proyectos variados: clubes, reservas, vinilos, lecciones, Roomify, torneos, turnos médicos). 30 errores recurrentes transversales: lógica en controllers, ownership manual, XSS, logging en prod, N+1, `Mockito.verify`, locale del sender, magic strings, versiones en hijos, etc.
- [[Correcciones Segunda Entrega (TP2)]] — Consolidado de las dos devoluciones oficiales del TP2 (Corrector A con 17 grupos + Corrector B con 15 grupos). Tabla de notas comparada, Demo + Código + Seguimiento por grupo, y 19 patrones recurrentes consolidados. Trampa nueva del TP2: `@Async` + `@Transactional` accediendo a relaciones lazy sin materializar.
- [[Devolución TP1 — Caso de un Grupo]] — Devolución oficial de la cátedra sobre un proyecto del TP1 (nota 6), tomada como caso de estudio. Transcripción completa del feedback + tabla cruzada con los patrones que la cátedra penaliza en toda la cohorte. Fuente directa para un plan de correcciones.

### Cátedra — clases teóricas

- [[Clase 2 — Spring Web y Maven]] — Setup inicial: Spring MVC, Maven multi-module, `WebConfig`, `web.xml`, `DispatcherServlet`, `ViewResolver`.
- [[Clase 3 — Spring JDBC y Unit Testing]] — `JdbcTemplate`, `SimpleJdbcInsert`, `RowMapper`, tests de services con Mockito y tests de DAOs con HSQLDB.
- [[Clase 4 — Web Forms]] — JSR-303 Bean Validation, `@Valid` + `BindingResult`, patrón PRG, Spring form taglib, i18n con `MessageSource`.
- [[Clase 5 — Spring Security y Logging]] — `WebSecurityConfigurerAdapter` (versión vieja del apunte), `DelegatingFilterProxy`, `UserDetailsService`, `GrantedAuthority`, BCrypt, setup inicial de Logback.
- [[Clase 6 — Logging parte 2 y AOP]] — Dev vs prod logback config, exclusiones de `maven-war-plugin`, modelo de proxies de AOP, `@Transactional`, `@Scheduled`.
- [[Clase 7 — Hibernate y JPA]] — Reemplazo de Spring JDBC por JPA + Hibernate: impedancia objeto-relacional, dependencias por módulo, `LocalContainerEntityManagerFactoryBean`, `JpaTransactionManager`, `UserHibernateDao` con `EntityManager` + `@PersistenceContext`, queries en JPQL, anotaciones JPA en el modelo, constructor default para Hibernate, conflicto de dependencias transitivas.
- [[Hibernate pt2 — Relaciones, Lazy, OpenEntityManagerInView, Paginación 1+1]] — Clase del 11/05 (continuación). Relaciones JPA (`@ManyToOne`/`@OneToMany` con `mappedBy`/`cascade`/`orphanRemoval`/`optional`), por qué default LAZY en `*ToMany` y EAGER en `*ToOne`, cómo Hibernate logra lazy (proxies + `PersistentBag` por reflection), **`LazyInitializationException` + `OpenEntityManagerInViewFilter`** con su tradeoff de pérdida de control, dirty checking y la regla "no modificar entidades directamente", `em.getReference()`, JPQL navegando propiedades, `@Enumerated(STRING)` vs ORDINAL, y el patrón **1+1 queries** para paginación (clave para aprobar próximo TP). Reglas de testing: un test = un comportamiento, `em.flush()` + `JdbcTestUtils.countRowsInTable` para verificar BD, prohibido `Mockito.verify`.

### Cátedra — transcripciones de clase en vivo

- [[Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice]] — Notas estructuradas + transcript literal de la clase del 13 de abril 2026 (Juan Martín Sotuyo Dodero). Cubre el mismo temario que Clase 5 + Clase 6 con matices en vivo: jerarquía de loggers con `additivity`, API fluida de SLF4J, `@Async` + `ThreadLocal`, `@Scheduled` en multi-instancia, `@ControllerAdvice` con `@ModelAttribute` y `@ExceptionHandler`. Incluye discusión de organización del frontend para Sprint 2.
- [[Notion Teoricas PAW — Apuntes en vivo]] — Apuntes manuales del cuatrimestre exportados desde Notion (36 páginas, 71 screenshots). El bloque **Lun 27/04** trae material que NO está en los PDFs de la cátedra: **Validation Groups** (`@Validated(Group.class)` + marker interface), **ownership dinámico** vía SpEL `access("@userSecurity.hasUserId(...)")`, **SecurityContext refresh** después de mutar el principal, `ExceptionManagingAdvice`, ejemplo `Issue` con `@Column(columnDefinition = "TEXT")`, configuración de logback para queries de Hibernate, cambios de pom para Java 9+ JPMS (`--add-opens`), AST caching de Hibernate, dirty state detection y la discusión de impedancia O-R con el ejemplo Friendship.

### Referencia técnica

- [[JSTL Curated — JSP, EL y JSTL]] — Referencia curada de JSP: sintaxis, operadores EL, todos los tags de JSTL Core, Custom Tag Library vía SimpleTag + TLD.

---

## 🔍 Analyses — Síntesis y roadmaps

Comparaciones, deep dives y vistas transversales que valen la pena guardar.

- [[Project Architecture Overview]] — Vista general del sistema: stack técnico, arquitectura de módulos, modelo de dominio, flujo de request, qué está implementado vs qué falta.
- [[Errores Comunes TP1]] — Guía accionable con ejemplos de código reales: XSS, lógica en controllers, tests de implementación, ownership, magic strings, checklist de 15 puntos pre-entrega.
- [[Sprint 2 — Roadmap del Proyecto]] — Cambios de BD (ProductStatus, valores nuevos de RentStatus, `payment_image_id`), flujo de estados de Rent, pantallas nuevas y desglose de tareas por área de trabajo.
- [[Plan de correcciones TP1]] — Plan accionable punto-por-punto derivado de [[Devolución TP1 — Caso de un Grupo]]. 5 fases priorizadas (graves → persistencia/tests → POM → UX/i18n → cierre), con checklist condensado y reglas de trabajo para corregir una codebase Spring MVC.
- [[Scout — Errores Comunes en TP1]] — Checklist exhaustivo de los errores que la cátedra encontró en los proyectos del TP1, organizados en 15 categorías con `grep` sugeridos y patrones a buscar. Sirve para auditar una codebase y detectar errores que una corrección manual podría pasar por alto.
- [[Auditoría de TP1 — Workflow paralelizado]] — Workflow de auditoría: lectura de los docs de feedback + reconocimiento de la codebase + auditoría paralelizada con 6 agentes especializados (read-only) + cross-check adversarial (falsos positivos/negativos) + consolidación con plan maestro y planes individuales por hallazgo.

---

## 🗃️ Mapeo raw → wiki

Qué archivo de `raw/` fue destilado en cada source. Útil para chequear cobertura de ingesta.

| Archivo en `raw/` | Página en `wiki/sources/` |
|---|---|
| `Clases/PAW - clase 2.pdf` | [[Clase 2 — Spring Web y Maven]] |
| `Clases/PAW - clase 3.pdf` | [[Clase 3 — Spring JDBC y Unit Testing]] |
| `Clases/PAW - clase 4.pdf` | [[Clase 4 — Web Forms]] |
| `Clases/PAW - clase 5.pdf` | [[Clase 5 — Spring Security y Logging]] |
| `Clases/PAW - clase 6.pdf` | [[Clase 6 — Logging parte 2 y AOP]] |
| `Clases/PAW - clase 7.pdf` | [[Clase 7 — Hibernate y JPA]] |
| `assets/hibernatept2.pdf` | [[Hibernate pt2 — Relaciones, Lazy, OpenEntityManagerInView, Paginación 1+1]] |
| `Clases/jstl-curated.pdf` | [[JSTL Curated — JSP, EL y JSTL]] |
| `Correcciones/Primera Entrega - Devolución.pdf` | [[Devolución TP1 — Feedback Primera Entrega]] |
| `Correcciones/Primera_Entrega/16391485.pdf` | [[Devolución TP1 — Referencia 15 Grupos]] |
| `Correcciones/Segunda_Entrega/Segunda Entrega - Devolución.pdf` | [[Correcciones Segunda Entrega (TP2)]] (Corrector A) |
| `Correcciones/Segunda_Entrega/fee3e87d-...Devolucin_TP2.pdf` | [[Correcciones Segunda Entrega (TP2)]] (Corrector B) |
| `Indicaciones/Sprint2.pdf` | [[Sprint 2 — Indicaciones del Corrector]] |
| `Transcripciones/Clase_13_04.pdf` | [[Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice]] |
| `Transcripciones/audio_transcript.vtt` | [[Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice]] (audio fuente) |
| `Transcripciones/Screen Recording 2026-04-13 at 21.07.05.mov` | [[Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice]] (video fuente) |
| `assets/NotionPAW.pdf` (+ `assets/notion-paw-images/img-*.png`, 71 imágenes) | [[Notion Teoricas PAW — Apuntes en vivo]] |
| `Correcciones/Devolucion TP1.pdf` | [[Devolución TP1 — Caso de un Grupo]] |

> **Cobertura:** 100%. Todo archivo en `raw/` tiene su página destilada en `wiki/sources/`. Las tres fuentes de la clase 13/04 (PDF estructurado, VTT del audio, grabación MOV) comparten una única página de destilación.

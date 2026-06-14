---
title: Wiki Log
type: log
updated: 2026-05-28
---

# PAW Wiki Log

Chronological record of wiki operations.

---

## [2026-05-19] ingest | Correcciones Segunda Entrega (TP2)

Ingestadas las dos devoluciones oficiales del TP2 desde `raw/Correcciones/Segunda_Entrega/` en una única página consolidada. La devolución del TP1 (Primera_Entrega) ya estaba ingerida — no se reingestó.

**Página creada:**
- `wiki/sources/correcciones-segunda-entrega.md` — consolidado de las dos devoluciones: Corrector A (17 grupos, `Segunda Entrega - Devolución.pdf`) + Corrector B (15 grupos, `fee3e87d-...Devolucin_TP2.pdf`). Tabla comparativa de notas, secciones por corrector con Demo + Código + Seguimiento + Nota por grupo, y 19 patrones recurrentes consolidados. Destaca la trampa nueva del TP2: `@Async` + `@Transactional` accediendo a relaciones lazy sin materializar.

**Updates:**
- `wiki/index.md` — entrada en Sources y mapeo raw→wiki.

---

## [2026-05-09] sync | Re-sync entity pages con la codebase actual

Auditoría de las entity pages contra el repo `paw-2026a-10` después de ~30 commits desde el último sync (rango ~`HEAD~40..HEAD`, mayoría 2026-05-04). El TP1 quedó cerrado y el código creció mucho — el wiki seguía con conteos del Sprint 1.

**Conteos actualizados (antes → ahora):**
- Domain Models: 6 clases → 12 (agregados `BlockedDateRange`, `CatalogCriteria`, `Page<T>`, `Review`, `ReviewView`, `SpecialPriceView`).
- Enums: 9 → 17 (agregados `CatalogOrderBy`, `FinishedDashboardRow`, `HasDisplayName`, `HasSlug`, `IdentityChoice`, `OrderDirection`, `RentDashboardCategory`, `UserRole`).
- Controllers: 10 → 16 (`AdminController`, `DashboardController`, `FavoritesController`, `PasswordResetController`, `ProfileController`, `VerifyEmailController`).
- ControllerAdvice: 2 → 5 (`LoginControllerAdvice`, `ProductControllerAdvice`, `RentRequestControllerAdvice`).
- Forms: 5 → 19 (granulares de profile, flujo de pago/review, etc.).
- Custom validators: ~7 → 20.
- Services: 7 → 12 interfaces + 13 impls (agregados `AdminBootstrap`, `EmailVerificationService`, `FavoriteService`, `PasswordResetService`, `ProductImageService`, `ReviewService`).
- DAOs: 6 → 9 (`FavoriteJdbcDao`, `ProductImagesJdbcDao`, `ReviewJdbcDao`).
- JSP páginas: 8 → 25; custom tags: ~30 → 40.
- `services.exceptions`: 2 → 12 excepciones cross-layer.
- `RentStatus`: 8 valores → 10 (agregado `PAYMENT_CANCELLED`, `PAYMENT_EXPIRED`, `PAYMENT_ACCEPTANCE_EXPIRED`; renombrado `PAYMENT_REJECTED` → `PAYMENT_CANCELLED`).

**Cambios estructurales detectados y reflejados:**
- `User` tiene Builder y 19 campos (verificación email + reset password + address + availability + cbu + role + preferredLanguage).
- `Product` ahora carga `prices` (lista) además de `images`.
- Profile granular: 6 forms separadas (`UpdateNameForm`, `UpdateSurnameForm`, `UpdateAddressForm`, `UpdateAvailabilityForm`, `UpdateCbuForm`, `UpdateProfilePictureForm`) — patrón "una form por field".
- Validation groups (`PublishGroup`, `EditGroup`) usados con `@Validated(Group.class)` en publish/edit.
- Ownership en services para todos los recursos: `findOwnedByProvider`, `findOwnedByRenter`, `findOwnedBy`. Controllers no chequean ownership.
- `EmailService` con todos los métodos `@Async` y `try/catch` interno (no más try/catch en controllers, commit `036ae54d`).
- DTOs en `services.dto` (`RentData`, `RentEmailPayload`, `SpecialPriceDto`) — usados para evitar `ThreadLocal` en `@Async` y para batchear datos de listado.
- `RentService.groupRentsByCategory` — la lógica de grouping del dashboard se movió del controller al service (commit `28a975f7`).
- `FavoriteService.showFavoriteStatus` — movido del controller al service (commit `a4b6f177`).
- `ProductController` expone `/blocked-dates` JSON para el calendar tag.
- `RentRequestController` migró de `/rent/manage` al patrón REST `/rents/{id}` con sub-acciones (`respond`, `initiate-payment`, `accept-payment`, `cancel`, `cancel-payment`, `review`).
- Bootstrap JS centralizado en `footer.tag` (commit `9fbb6ae4`).
- i18n: 4 bundles (default/es/en/fr) + locale change interceptor en `WebConfig` (commit `3f16efce`).

**Updated:**
- `wiki/entities/controllers.md` — inventario completo de 16 controllers + 5 advices + 19 forms + 20 validators + tabla expandida de excepciones.
- `wiki/entities/services.md` — inventario de 12 services + 13 impls, lista de DTOs, notas por service con patrones (`@Async` + locale del destinatario, ownership, transiciones de estado).
- `wiki/entities/daos.md` — 9 DAOs, schema actualizado con tablas de tokens, reviews, favorites, payment_image_id.
- `wiki/entities/domain-models.md` — 12 modelos + builder de User, view/DTO models, separación clara `models.exception` (4) vs `services.exceptions` (12).
- `wiki/entities/enums.md` — 17 enums, tabla completa de RentStatus con `RentDashboardCategory` y los 10 valores actuales.
- `wiki/entities/tests.md` — inventario de 9 DAO tests + 12 service tests + reglas críticas (cero `Mockito.verify`, populator.sql, `JdbcTestUtils.countRowsInTableWhere`).
- `wiki/entities/views.md` — 25 JSPs + 40 tags catalogados, Bootstrap JS centralizado, i18n con 4 bundles.
- `wiki/index.md` — descripciones de las 7 entity pages actualizadas con los conteos correctos.

**No tocadas en este sync (siguen vigentes):**
- `concepts/*` — los patrones (controllers-and-validation, spring-security, jsp-views, etc.) siguen reflejando bien las reglas; las menciones a clases específicas seguían correctas.
- `analyses/*` — `project-architecture.md` y `errores-comunes-tp1.md` no necesitaron cambios estructurales.
- `sources/*` — son inmutables por diseño.



## [2026-05-06] revise | Clase 7 Hibernate vs Java 21

Revisión de la cobertura de Clase 7 a la luz de que el proyecto compila con `<maven.compiler.release>21</maven.compiler.release>` y usa `org.hibernate.version = 5.1.0.Final` (de 2016, era Java 7/8). El PDF de la cátedra **no menciona** la incompatibilidad ni los workarounds — los detalles concretos sí los cubrimos al ingerir la Notion (clase 27/04). Esta revisión los hace explícitos en las páginas que un lector lee primero.

**Verificado en `paw-2026a-10/pom.xml`:**
- Java 21 (`maven.compiler.release=21`)
- Spring 5.3.33 (compatible con Java 17+)
- Hibernate 5.1.0.Final (incompatible directa con Java 9+, requiere `--add-opens` y `jaxb-api`)
- JPA 2.1 API en namespace `javax.persistence` (no `jakarta.persistence`)

**Updated:**
- `sources/clase-7-hibernate-jpa.md` — Aviso destacado al inicio sobre versiones desactualizadas. Sección final nueva **"Adaptación a Java 21 (no está en el PDF)"** con: por qué la combinación pincha sola (JPMS, JAXB removido en Java 11, plugins Maven viejos), los 3 workarounds requeridos (`--add-opens`, `jaxb-api` explícita, mantener `javax.persistence`) y la alternativa de actualizar Hibernate (5.6 / 6.x) con sus implicancias.
- `concepts/hibernate-jpa.md` — Sección destacada **"⚠ Aviso: stack actual del proyecto (Java 21 + Hibernate 5.1)"** justo después del título, con tabla comparativa Java/Spring/Hibernate/JPA + lista numerada de las 4 implicancias importantes que el PDF no menciona. Cross-reference a la sección "Cambios de pom — Hibernate 5.1 + Java 9+ (JPMS)" que ya tenía el detalle.
- `analyses/project-architecture.md` — tech stack table aclara que Hibernate es 5.1.0.Final + JPA 2.1; sección "En curso / próximo" agrega advertencia sobre los workarounds JPMS necesarios para la migración.

## [2026-05-06] ingest | Notion Teoricas PAW (apuntes en vivo + 71 imágenes)

Ingestado el export de Notion `raw/assets/NotionPAW.pdf` (36 páginas, 18.8MB) que contiene apuntes manuales del cuatrimestre. Imágenes extraídas con `pdfimages` a `raw/assets/notion-paw-images/img-{000..070}.png` (71 screenshots).

**Material genuinamente nuevo (no estaba en los PDFs anteriores), bloque Lun 27/04:**

- **Usos avanzados de Spring Security** — ownership dinámico con SpEL `access("@userSecurity.hasUserId(authentication, #id)")`, bean `@Component("userSecurity")` con método `hasUserId(Authentication, Long)`, refresh del `SecurityContext` después de cambiar el username.
- **Validation Groups** — patrón completo: marker interface dentro del form, `groups = {Default.class, GroupClass.class}` en cada constraint, `@Validated(Group.class)` en el controller (vs `@Valid` que no soporta groups). Cita textual del docente sobre por qué no duplicar la form.
- **`ExceptionManagingAdvice`** — ejemplo concreto de `@ControllerAdvice` con `@ExceptionHandler(Exception.class)` mapeando 500 con `logger.error(..., e)` y `EntityNotFoundException.class` mapeando 404. Lección: el handler del 500 debe loguear, sino se traga la stack trace.
- **Tests JUnit 5** — `@ExtendWith(MockitoExtension.class)` confirmado en código real, `LocaleContextHolder.setLocale(Locale.ENGLISH)` necesario para tests con i18n.
- **Hibernate intro extendida** — discusión rica de impedancia O-R con el ejemplo Friendship (NULL vs lista vacía, no isomorfismo SQL/objetos, lazy loading), `EntityManager` stateful (DAOs no son singleton), `em.persist()` polimórfico (insert/update según id), `em.find()` retorna nullable → `Optional.ofNullable`, **dirty state detection** (update sin save), `@Entity(name="users")` vs `@Entity` + `@Table`, mapeo de constraints SQL → JPA (`length`/`nullable`/`unique`/`columnDefinition`), reflection sin setters.
- **Limitaciones de `hbm2ddl=update`** — qué resuelve y qué NO. Conclusión: Flyway sigue siendo necesario para cambios destructivos.
- **Logs de Hibernate** — pipeline interno (parser → AST → SQL → cache), config de logback con `org.hibernate.SQL` y `org.hibernate.orm.jdbc.bind` como reemplazo limpio de `show_sql=true`.
- **Pom changes para Java 9+ JPMS** — `--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.persistence/javax.persistence=ALL-UNNAMED` en surefire, mismo `--add-opens` en `jvmArgs` de jetty-maven-plugin, `jaxb-api` agregada explícitamente.
- **`TestConfiguration` con JPA** — HSQLDB con `sql.syntax_pgs=true`, `LocalContainerEntityManagerFactoryBean` con `HSQLDialect`, `JpaTransactionManager`.
- **Entidad `Issue` desde cero** — ejemplo completo con `@Column(columnDefinition = "TEXT")`, `@Column(name = "created_at")`, alta automática de tabla y sequence con `hbm2ddl=update`, `ALTER TABLE ADD COLUMN` automático al agregar `resolved_at`.

**Created:**

- `sources/notion-teoricas-paw.md` — destilado completo del bloque 27/04 con imágenes embebidas (referencias a `raw/assets/notion-paw-images/img-NNN.png`) y mapeo de imágenes a temas.

**Updated:**

- `concepts/controllers-and-validation.md` — sección nueva "Validation Groups — reutilizar un form con subsets de validaciones" con código del proyecto (UserForm.UserValidationUpdate marker, `@Validated(...)` en controller).
- `concepts/spring-security.md` — secciones nuevas "Ownership dinámico via SpEL `access(...)`" (UserSecurity bean + regla en WebAuthConfig + tabla cuándo usar service vs SpEL) y "Refrescar el SecurityContext después de mutar el principal" con código completo + caveat sobre `CurrentUserAdvice`.
- `concepts/hibernate-jpa.md` — agregadas: ejemplo Friendship en "Por qué un ORM", `EntityManager` stateful, dirty state detection (update sin save), `em.find` → Optional, `@Entity(name="users")` vs `@Entity`+`@Table`, mapeo SQL → JPA, columnDefinition, hbm2ddl limitaciones (Flyway sigue), pipeline de queries y AST caching, **cambios de pom para JPMS** (surefire + jetty argLine), `TestConfiguration` con JPA, ejemplo `Issue` desde cero con ALTER TABLE automático.
- `concepts/logging-logback.md` — sección nueva "Loguear lo que hace Hibernate" con tabla de loggers útiles (`org.hibernate.SQL`, `org.hibernate.orm.jdbc.bind`, `org.hibernate.hql.internal.ast`).
- `index.md` — descripciones expandidas en [[Spring Security]], [[Controllers & Validation]], [[Hibernate & JPA]], [[Logging (Logback / SLF4J)]] reflejando el nuevo material; agregada [[Notion Teoricas PAW — Apuntes en vivo]] bajo "Cátedra — transcripciones de clase en vivo"; fila nueva en "Mapeo raw → wiki".

## [2026-05-06] reorganize + ingest + audit | Clase 7 Hibernate y revisión global

Sesión combinada de reorganización ligera, ingesta de la Clase 7 y auditoría de coherencia entre los PDFs y la wiki.

**Reorganización:**
- Renombrados a kebab-case (consistencia con el resto de las concept pages):
  - `concepts/PAW_Skills_Reference.md` → `concepts/paw-skills-reference.md`
  - `concepts/Skills_Quick_Start.md` → `concepts/paw-skills-quick-start.md`
- Las entradas históricas en este log se mantienen con los nombres viejos (documentan correctamente lo que era el estado al momento).

**Ingest — Clase 7 (Hibernate & JPA):**
- `sources/clase-7-hibernate-jpa.md` — destilado completo del PDF: dependencias por módulo (`spring-orm`, `hibernate-core`, `hibernate-entitymanager`, `hibernate-jpa-2.1-api`), versiones (5.1.0.Final, 1.0.0.Final), `LocalContainerEntityManagerFactoryBean` con `HibernateJpaVendorAdapter`, propiedades (`hbm2ddl.auto=update`, dialect PG92, `show_sql`), `JpaTransactionManager`, `UserHibernateDao` con `@PersistenceContext`+JPQL, anotaciones JPA en el modelo (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@SequenceGenerator`, `@Column`), constructor default obligatorio, conflicto de dependencias transitivas. Glosario de términos.
- `concepts/hibernate-jpa.md` — concept page nueva: por qué un ORM, impedancia objeto-relacional, configuración (deps por módulo, EM factory, transaction manager), reglas de mapeo de entidades con tabla, patrón `*HibernateDao`, JPQL/HQL con ejemplos, propiedades de Hibernate y valores comunes de `hbm2ddl.auto` (validate/update/create/create-drop), tabla comparativa Spring JDBC vs Hibernate.

**Updated por la migración prevista:**
- `concepts/persistence-spring-jdbc.md` — banner de migración cruzando a [[Hibernate & JPA]]
- `concepts/spring-configuration.md` — nota sobre cambio de transaction manager y entity manager factory
- `entities/domain-models.md` — nota sobre las anotaciones JPA y el constructor package-private que recibirán las entidades
- `entities/daos.md` — nota sobre el reemplazo de `*JdbcDao` por `*HibernateDao` y la coexistencia (sacar `@Repository` del viejo)

**Audit — wiki vs PDFs:**
- Verificación cruzada de `sources/clase-2-spring-web-maven.md` vs `PAW - clase 2.pdf`: ✓ alineado.
- Verificación de `sources/clase-3-spring-jdbc-unit-testing.md`: ✓ alineado.
- Verificación de `sources/clase-4-web-forms.md`: ✓ alineado.
- Verificación de `sources/clase-5-spring-security-logging.md`: ✓ alineado en lo esencial. Notas menores: el PDF usa la key larga `mysupersecretketthatnobodyknowsabout` (acortada en el wiki a `mysupersecretkey`); el PDF lista `logback-core` que el wiki omitió de la tabla de deps. Ninguna inconsistencia conceptual.
- Verificación de `sources/clase-6-logging-aop.md`: ✓ alineado.
- `analyses/project-architecture.md` — desactualizado vs estado real: decía "no auth", "8 enums", "pagination not implemented", listaba poco endpoints. Actualizado para reflejar Sprint 2 (auth implementado, 9 enums incluyendo ProductStatus, paginación, pseudo-chat de pago, ciclo de Rent Sprint 2) y la migración a Hibernate como próximo paso.

**Updated:**
- `index.md` — agregado [[Hibernate & JPA]] bajo Persistencia, [[Clase 7 — Hibernate y JPA]] bajo Cátedra-clases, fila nueva en el mapeo `raw → wiki` (cobertura sigue 100%).

## [2026-04-22] audit | Index & sources re-indexing
Auditoría de cobertura de `raw/` vs `wiki/sources/` y de integridad de wikilinks del índice.

**Wikilinks rotos encontrados y corregidos:**
- `[[Skills Quick Start Guide]]` → `[[PAW Skills Quick Start Guide]]` (título real de la página).
- `[[Clase 2 — Spring Web y Maven]]` → normalizado renombrando el título de la página (estaba "Clase 2 — Introducción a Spring Web y Maven"; se eliminó "Introducción a" para consistencia con el resto de las Clase N y el wikilink ya usado en el índice).
- `[[PAW Best Practices]]` (4 ocurrencias, página inexistente) → reemplazadas por combinaciones de `[[Pre-Delivery Checklist]]` y `[[Errores Comunes TP1]]` en `concepts/PAW_Skills_Reference.md` y `concepts/Skills_Quick_Start.md`.

**Sources raw sin indexar → creado:**
- `raw/Transcripciones/Clase_13_04.pdf` + `audio_transcript.vtt` + `Screen Recording 2026-04-13...mov` — creado `sources/clase-13-04-transcripcion.md` como página única que cubre las tres fuentes. Contenido: takeaways + nuevos matices respecto a clase 5/6 + referencias cruzadas a [[Logging (Logback / SLF4J)]], [[AOP & Transactions]], [[Controllers & Validation]].

**Updated:**
- `index.md` — subsección nueva "Cátedra — transcripciones de clase en vivo" y tabla "Mapeo raw → wiki" al final con los 12 archivos de `raw/` y su página destilada correspondiente. Cobertura actual: 100%.

## [2026-04-19] ingest | Devolución TP1 — Referencia 15 Grupos (16391485.pdf)
Ingested second corrections PDF covering 15 groups with varied projects (clubs, bar reservations, vinyl marketplace, online lessons, Roomify, tournaments, medical appointments, etc.). Distinct from the existing `Primera Entrega - Devolución.pdf` (12 groups, Rent The Slopes cohort).

**Created:**
- `sources/devolucion-tp1-referencia-15-grupos.md` — verbatim bullets for each group across Demo/Código/Seguimiento/Nota, plus 30 transversal recurring errors synthesized across groups.

**Updated:**
- `index.md` — added reference to new source under "Cátedra — correcciones y roadmap".

Key recurring errors identified across both devoluciones: business logic in controllers, manual ownership checks (should be Spring Security), XSS (missing `c:out`), DEBUG/INFO logging in prod, N+1 queries / joins in Java, `Mockito.verify` / non-unit tests, missing `@Transactional`, email locale of sender vs recipient, magic strings, dependency versions in child poms, credentials in repo, boxed primitives with auto-unboxing, hardcoded `rememberMeKey`, unescaped LIKE characters, instantiating domain models in controllers.

## [2026-04-11] init | Wiki initialized
Created directory structure, CLAUDE.md schema, index.md, and log.md. Wiki is ready for first source ingest.

## [2026-04-11] document | Full project documentation

Comprehensive documentation of the Rent The Slopes project, covering all layers.

**Entity pages created (7):**
- `entities/domain-models.md` — User, Product, Rent, Price, Block, Image, exceptions
- `entities/enums.md` — All 8 enums with values and display names
- `entities/controllers.md` — 7 controllers, form objects, exception handling
- `entities/services.md` — 7 service interfaces and implementations
- `entities/daos.md` — 6 JDBC DAOs, full schema, Flyway migrations
- `entities/views.md` — 8 JSP pages, ~30 tags, CSS, i18n
- `entities/tests.md` — ~80+ tests across persistence and service layers

**Concept pages created (8):**
- `concepts/maven-module-structure.md` — Module layout, dependency direction, scope rules
- `concepts/spring-configuration.md` — WebConfig, web.xml, component scanning
- `concepts/dependency-injection.md` — Stereotypes, @Autowired, runtime scope
- `concepts/controllers-and-validation.md` — PRG pattern, JSR-303, form objects
- `concepts/jsp-views.md` — No scriptlets, taglibs, c:url, i18n, custom tags
- `concepts/persistence-spring-jdbc.md` — JdbcTemplate, RowMapper, schema management
- `concepts/testing-practices.md` — Mockito + HSQLDB strategies, test principles
- `concepts/pre-delivery-checklist.md` — Full verification checklist from PAW directives

**Analysis pages created (1):**
- `analyses/project-architecture.md` — Full system overview with diagrams

Index updated with all 16 new pages.

## [2026-04-14] document | PAW Skills & Tools Reference

Created comprehensive documentation for 9 specialized Claude Code skills designed to automate common tasks in the PAW project workflow.

**Skill pages created (1):**
- `concepts/PAW_Skills_Reference.md` — Complete reference with 9 skills:
  1. **good-practice** — Code quality audit (Opus 4.6, medium effort)
  2. **enhancer** — UI/UX aesthetic improvements (Haiku 4.5, low effort)
  3. **planning** — Feature architecture planning (Opus 4.6, high effort)
  4. **implementation** — Execute feature plans (Sonnet 4.6, medium effort)
  5. **testing** — Generate JUnit 5 tests (Sonnet 4.6, medium effort)
  6. **refactor** — Safe code improvements (Sonnet 4.6, medium effort)
  7. **debug** — Root cause analysis (Opus 4.6, high effort)
  8. **schema-migrate** — Database migrations (Sonnet 4.6, medium effort)
  9. **performance** — Performance analysis & optimization (Sonnet 4.6, high effort)

Each skill includes:
- Model selection and effort estimation
- Detailed capabilities and constraints
- Input/output specifications
- Real-world usage examples
- Workflow patterns for common tasks

**Quick start guide created (1):**
- `concepts/Skills_Quick_Start.md` — Practical guide with:
  - Skill quick reference table
  - Common workflow patterns (feature development, bug triage, quality review, optimization)
  - Usage tips and best practices
  - Examples by task type
  - Troubleshooting guide

Index updated with skills reference and quick start guide links.

## [2026-04-19] document | Refactor de autenticación (commit fa4adb0)

Documentado el refactor de auth que reemplaza `@AuthenticationPrincipal AuthUser` por `@ModelAttribute("loggedUser") User` vía `CurrentUserAdvice`. También se movieron las excepciones transversales a `service-contracts` y se agregó `@Transactional` a `UserServiceImpl`, `UserDetailsService` y `RentServiceImpl`.

**Entity pages actualizadas (3):**
- `entities/controllers.md` — reescrita completa: nuevos controllers (EditProductController, MyListingsController, LoginController), removidos los endpoints `POST /rent/request` + `GET /rent/sent`, documentado `RentResponseForm`, `CurrentUserAdvice` como sección propia, `GlobalExceptionHandler` importa excepciones desde `services.exceptions`, forms actualizados (RentForm sin campos de renter, PublishProductForm sin campos de publisher)
- `entities/services.md` — `UserServiceImpl` y `RentServiceImpl` con `@Transactional`/`@Transactional(readOnly=true)`; `RentService.findOwnedByProvider` nuevo para chequeo de ownership centralizado; sección sobre el paquete `services.exceptions`
- `entities/domain-models.md` — sección Exceptions dividida en `models.exception` (validaciones del dominio) y `services.exceptions` (ForbiddenException, ResourceNotFoundException transversales)

**Concept pages actualizadas (3):**
- `concepts/spring-security.md` — `WebAuthConfig` actualizado al API `SecurityFilterChain`, sin `@ComponentScan` redundante y sin `/rent/sent` público; `UserDetailsService` del proyecto con `AuthUser` como detalle interno; `CurrentUserAdvice` reemplaza `@AuthenticationPrincipal`; ejemplo real de ownership con `RentService.findOwnedByProvider`
- `concepts/controllers-and-validation.md` — separación explícita de `CurrentUserAdvice` vs `GlobalExceptionHandler`; lista de forms actualizada (RentResponseForm nuevo, RentForm y PublishProductForm sin campos de usuario); tabla de excepciones extendida con 403 y 413
- `concepts/aop-transactions.md` — sección sobre estilo por método (`@Transactional(readOnly=true)` para lecturas) con ejemplos reales de `UserServiceImpl`, `RentServiceImpl` y `UserDetailsService`; explicación de por qué usar `readOnly = true`

## [2026-04-19] document | Convención de Custom Validators del equipo

Documentadas las reglas que compartió Azul por WhatsApp (2026-04-19, 15:07–15:15) sobre custom validators, con código real del proyecto como ejemplos.

**Concept page actualizada (1):**
- `concepts/controllers-and-validation.md` — Reemplazada la sección genérica de Custom Validators por la convención del equipo: regla de oro ("validar en el form, no en el controller"), estructura de carpetas (`validation/annotations/` + `validation/validators/`), ejemplos reales (`ExistingProductIdValidator`, `ProductSizeForCategoryValidator`), explicación del `addPropertyNode` para errores en campo específico, tabla con los 7 validators actuales del proyecto
- Regla 10 agregada a Controller Rules: "Las validaciones van en el form, no en el controller"

## [2026-04-19] ingest | Sprint 2 — Indicaciones

Ingestado el PDF de indicaciones del Sprint 2 (`raw/indicaciones/Sprint2.pdf`). Contiene correcciones del Sprint 1, clarificaciones técnicas sobre validaciones/paginación/controller advice, flujo del pseudo-chat y roadmap del Sprint 2.

**Source page creada (1):**
- `sources/sprint-2-indicaciones.md` — Indicaciones completas: bugs Sprint 1, arquitectura de validaciones, paginación+filtros, controller advice, tests, flujo reserva, cambios BD, asignaciones

**Concept pages creadas (1):**
- `concepts/pagination-search-filters.md` — Patrón completo de estado compartido entre searchbar, filtros y paginación; hidden fields; location como query param

**Analysis pages creadas (1):**
- `analyses/sprint-2-roadmap.md` — Cambios de BD (ProductStatus, RentStatus nuevos valores, payment_image_id), flujo de estados, asignaciones por integrante (SEBAS/AZU/JOSE/MAGUI/TIAGO)

**Entity pages actualizadas (2):**
- `entities/domain-models.md` — Product: campo `status` (ACTIVE/PAUSED/DELETED); Rent: campo `paymentImageId`
- `entities/enums.md` — ProductStatus nuevo; RentStatus con 4 valores nuevos (PAYMENT_PENDING, PAYMENT_ACCEPTED, PAYMENT_REJECTED, EXPIRED)

**Concept pages actualizadas (1):**
- `concepts/controllers-and-validation.md` — Secciones nuevas: Controller Advice completo con ejemplos, File Upload con límites de tamaño

Index actualizado con source, analysis y concept nuevos.

## [2026-04-19] reorganize | Index reescrito y más completo

Reescrito `wiki/index.md` con descripciones más ricas y subcategorías dentro de cada sección:
- **Entities**: sin cambios estructurales, descripciones expandidas.
- **Concepts**: subdividido en Arquitectura/Wiring, Controllers&Forms, Persistencia, Testing, Seguridad, Infraestructura, Proceso.
- **Sources**: subdividido en Cátedra-correcciones, Cátedra-clases, Referencia técnica.
- **Analyses**: descripciones expandidas.

Cada entrada ahora menciona patrones clave, nombres de clases reales y decisiones documentadas para facilitar búsqueda semántica.

## [2026-04-19] ingest | Devolución TP1

Ingestado el PDF de correcciones de la primera entrega (`raw/correcciones/Primera Entrega - Devolución.pdf`). Cubre 12 grupos, errores graves y frecuentes detectados en demo, código y seguimiento.

**Source page creada (1):**
- `sources/devolucion-tp1.md` — Resumen completo: notas por grupo, errores graves, errores frecuentes, puntos positivos

**Analysis page creada (1):**
- `analyses/errores-comunes-tp1.md` — Guía accionable con ejemplos de código: XSS, lógica en controllers, tests de comportamiento, ownership, magic strings, checklist pre-entrega

**Concept pages actualizadas (4):**
- `concepts/testing-practices.md` — Sección "Behavior vs Implementation": no usar `verify()`/`spy`, asserts de DB en persistence, JUnit 5 obligatorio
- `concepts/jsp-views.md` — Sección XSS Prevention (`<c:out>` obligatorio) y spring-security-taglibs (`<sec:authorize>`)
- `concepts/spring-security.md` — Control de acceso por ownership, SecurityContextHolder en ControllerAdvice, consistencia WebAuthConfig vs @PreAuthorize
- `concepts/controllers-and-validation.md` — Reglas ampliadas: no business logic, no try-catch, custom validators

Index actualizado con source y analysis nuevas.

## [2026-04-15] ingest | Clases 2–6 + JSTL Curated

Ingested all 6 PDF lecture files from `raw/Clases/` covering the Spring MVC course stack.

**Source pages created (6):**
- `sources/clase-2-spring-web-maven.md` — Spring MVC setup, Maven multi-module, WebConfig, web.xml, DispatcherServlet, ViewResolver
- `sources/clase-3-spring-jdbc-unit-testing.md` — JdbcTemplate, SimpleJdbcInsert, RowMapper, Mockito service tests, HSQLDB DAO tests
- `sources/clase-4-web-forms.md` — JSR-303 Bean Validation, @Valid + BindingResult, PRG pattern, Spring form taglib, i18n MessageSource
- `sources/clase-5-spring-security-logging.md` — WebSecurityConfigurerAdapter, DelegatingFilterProxy, UserDetailsService, GrantedAuthority, BCrypt, Logback setup
- `sources/clase-6-logging-aop.md` — Dev vs prod logback strategy, maven-war-plugin exclusions, AOP proxies, @Transactional, @Rollback, @Scheduled
- `sources/jstl-curated.md` — JSP syntax reference, EL operators, all JSTL Core tags, Custom Tag Library (SimpleTag + TLD)

**Concept pages created (3):**
- `concepts/spring-security.md` — Full Spring Security concept: ACL pattern, WebAuthConfig, UserDetailsService, antMatchers order, BCrypt, SecurityContextHolder
- `concepts/logging-logback.md` — SLF4J facade, dev vs prod config strategy, RollingFileAppender, additivity, {} placeholder rule
- `concepts/aop-transactions.md` — AOP proxy model, proxy restrictions (public only, external calls only), @Transactional at Service level, @Rollback, @Scheduled

**Concept pages updated (4):**
- `concepts/spring-configuration.md` — Added security config registration, @EnableTransactionManagement, DataSourceTransactionManager
- `concepts/jsp-views.md` — Added full JSTL Core tag reference, EL quick reference, Custom Tag Library via SimpleTag
- `concepts/persistence-spring-jdbc.md` — Added DataSourceInitializer pattern, HSQLDB vs PostgreSQL schema differences table
- `concepts/testing-practices.md` — Added JUnit 4 / @RunWith patterns from course materials as reference

Index updated with 6 source pages and 3 new concept pages.

## [2026-05-12] ingest | Hibernate pt2 (Clase 11/05)

Ingerido `raw/assets/hibernatept2.pdf` (44 páginas). Continuación de la clase de Hibernate/JPA: relaciones entre entidades, lazy/eager fetching, `OpenEntityManagerInViewFilter`, dirty checking, `em.getReference()`, JPQL navegando propiedades, mapeo de enums, y patrón **1+1 queries** para paginación (marcado como clave para aprobar próximo TP).

Pages created:
- `sources/hibernate-pt2.md` — destilado completo con código de referencia.

Pages updated:
- `concepts/hibernate-jpa.md` — nuevas secciones: Relaciones, LazyInitializationException + OpenEntityManagerInViewFilter, Dirty checking + regla "no modificar entidades", `getReference`, JPQL navigation, `@Enumerated`, Paginación 1+1 queries.
- `concepts/pagination-search-filters.md` — pointer al patrón 1+1 queries de JPA como obligatorio para próximo TP.
- `index.md` — agregado source, actualizado entry de Hibernate & JPA, agregada fila al mapeo raw→wiki.

## [2026-05-27] ingest | Devolución TP1 — Nuestro Grupo (10)

Ingerido `raw/Correcciones/Nuestras/Devolucion TP1.pdf` (30 páginas, 14 grupos). Es una devolución **distinta** a las dos ya ingeridas previamente (las notas no coinciden con `devolucion-tp1.md` ni con `devolucion-tp1-referencia-15-grupos.md`). Nuestro grupo es el **Grupo 10**, nota **6**.

Pages created:
- `sources/devolucion-tp1-nuestra.md` — transcripción literal del feedback del Grupo 10 (Demo + Código + Seguimiento), tabla de categorías de error y cruce con patrones que la cátedra penaliza en toda la cohorte.
- `analyses/plan-correcciones-tp1-grupo10.md` — plan accionable para Claude Code en 5 fases priorizadas: (1) errores conceptuales graves (lógica en controllers, ownership, `buildFilterQueryString`), (2) persistencia + tests (N+1, RowMapper dup, escape de `%`/`_`, `ArgumentCaptor`, `@ParameterizedTest`), (3) POM (`commons-fileupload` version, scope `provided` de `javax.servlet-api`, method en `ErrorController`), (4) UX/bugs/i18n (precio especial, CBU, modales, aria-labels), (5) cierre. Incluye reglas de trabajo y checklist condensado.

Pages updated:
- `index.md` — agregadas entradas en Sources y Analyses, nueva fila en mapeo raw→wiki.

## [2026-05-27] analysis | Scout de errores cometidos por otros grupos

Compilados todos los hallazgos de código en los grupos 1-9, 11-14 de la devolución TP1 (excluyendo el grupo 10 que ya tiene su plan). El objetivo es que Claude Code audite proactivamente nuestro repo `paw-2026a-10` buscando los mismos patrones — la cátedra podría haberse perdido cosas que sí están en nuestro código.

Pages created:
- `analyses/scout-errores-otros-grupos.md` — 15 categorías (POM, lógica en controllers, Bean Validation, persistencia, Spring Security, excepciones, XSS, tests, i18n, HTTP/mappings, config, modelos, JSP, mailing, bugs funcionales) con `grep`/búsquedas sugeridas, ejemplo de cada grupo que cometió el error, y plantilla de reporte de hallazgos.

Pages updated:
- `index.md` — agregada entrada en Analyses.

## [2026-05-27] audit | General Audit V4 de TP1 sobre `main` post-TP2

Auditoría exhaustiva del repo `paw-2026a-10` (branch `main`, commit `48c0b02`) ejecutada con el skill `/general-audit`: 7 agentes verticales en paralelo (AUTH, CATALOG, PRODUCT MGMT, RENTS, REVIEWS, MODERATION/ADMIN, PROFILE/FAVORITES/STATS) + 6 agentes horizontales (PERSISTENCE, SERVICES+DOMAIN, CONTROLLERS+FORMS+VALIDATORS, VIEWS+I18N, INFRA/BUILD, TESTING). Validación cruzada releyendo cada archivo citado.

**Total de hallazgos: 47** — 16 CRÍTICOS, 17 ALTOS, 11 MEDIOS, 3 BAJOS.

**Confirmados de la devolución oficial TP1 que SIGUEN VIVOS (8):**
- L2 — `CatalogController.parseCategoryFilters` con lógica de dominio
- L3 — `ImageController.detectContentType` magic bytes
- L4 — `DashboardController.computeReviewableRentIds` lógica en controller
- L5 — `CatalogController.buildFilterQueryString` sin URLEncoder + reinventa GET form
- A3 — Bug demo: precio especial pisa default por empate en `Price.EFFECTIVE_ORDER`
- T1 — `AtomicReference`/`AtomicInteger` × 19 en tests (eran 4 en TP1, ahora son 19)
- T2 — `assertDoesNotThrow` sin asserts × 11
- T3 — `CurrencyTest` no parametrizado
- B3 — `ErrorController.@RequestMapping` sin `method=`
- I1 — `aria-label="Admin sections"` × 3 (residuales)
- A9 — CBU `null` sin UI feedback claro

**Ya fixeados de la devolución TP1 (verificados):**
- `commons-fileupload` version → ya en padre `pom.xml:40,263-265`
- `ReviewJdbcDao` RowMapper inline → DAO entero comentado, migrado a `ReviewJpaDao`
- `javax.servlet-api` scope `provided` → ya aplicado en padre
- `LIKE` escape de `%` y `_` → `UserJpaDao:109` y `ProductJpaDao:293-294` con `replace("\\", "\\\\").replace("%", "\\%")` + `ESCAPE '\\'`
- 48 modales de confirmación implementados
- Empty state CTAs en admin/users.jsp

**Hallazgos NUEVOS no detectados por el corrector (los más jugosos para arreglar antes de la próxima entrega):**
- S1 — `@PreAuthorize` × 9 en `RentServiceImpl` (mixed authorization strategy)
- S2 — `@AuthenticationPrincipal AuthUser` × 10 en lugar de `@ModelAttribute("loggedUser")`
- S3 — `SecurityContextHolder` × 2 en validators (zona gris)
- L1 — `IllegalArgumentException`/`IllegalStateException` × 15 como business exception
- A1 — `@Async` × 8 en `EmailServiceImpl` sin `try/catch + LOGGER.error` (SMTP failures silenciosos en flujo de pago)
- A2 — try-catch de `ResourceNotFoundException` en `AdminController:339-343`
- A6 — N+1 en `ImageJpaDao.grantAccess(Collection<Long>)` loop
- B1 — `AGENTS.md` + `CLAUDE.md` ambos versionados
- B2 — `hibernate.show_sql=true` + `format_sql=true` en `WebConfig.java:196-197` (prod)
- I2 — 51 keys faltantes en `messages_fr.properties` vs default
- T4 — `Mockito.lenient()` × 10 como default
- T5 — `AlreadyReviewedException` no mapeada en `GlobalExceptionHandler`

Output en repo:
- `0_Plans/audits/2daEntrega/V3/TODO_2daEntrega.md` — DICTAMEN completo (TREE + tabla + secciones detalladas + apéndice A descartes)
- `0_Plans/audits/2daEntrega/V3/critica/plan_1_S1-PreAuthorize-RentService.md`
- `0_Plans/audits/2daEntrega/V3/critica/plan_2_S2-AuthenticationPrincipal.md`
- `0_Plans/audits/2daEntrega/V3/critica/plan_3_L1-IllegalArgumentException.md`
- `0_Plans/audits/2daEntrega/V3/critica/plan_4_T1-AtomicReference-tests.md`

Pages updated:
- `analyses/scout-errores-otros-grupos.md` — completada tabla "Resumen de hallazgos" del final con resultados reales.
- `analyses/plan-correcciones-tp1-grupo10.md` — items verificados como existentes marcados `[x]` y agregada sección "Hallazgos extra (a triage)" con los NUEVOS no detectados por el corrector.

## [2026-05-28] sync | PaymentMethod (#10), Admin Invite Token (#20), ProductStatus expansion
- Updated: `wiki/entities/enums.md` — added PaymentMethod, ProductStatus values
- Updated: `wiki/entities/domain-models.md` — User admin invite fields, Rent.paymentMethod, JPA entity framing
- Updated: `wiki/entities/daos.md` — V34/V35 migrations, JpaDao reframe, new DAO methods
- Updated: `wiki/entities/controllers.md` — new exceptions (#10, #20), CatalogDateRangeForm, MyListings filters
- Updated: `wiki/entities/services.md` — RentService CBU gating, UserService admin invite flow, LocationService cascade
- Updated: `wiki/entities/views.md` — 3 tags eliminated, admin-invite-invalid.jsp
- Updated: `wiki/entities/tests.md` — JpaDaoTest renames, LocationServiceImplTest
- Updated: `wiki/concepts/controllers-and-validation.md` — @PaymentProofRequiredIfUpload validator + Ejemplo 3
- Updated: `wiki/index.md` — refreshed entity descriptions
- Created: `wiki/concepts/admin-invite-flow.md` — Issue #20 deep dive
- Created: `wiki/concepts/payment-method-upload-vs-cash.md` — Issue #10 deep dive

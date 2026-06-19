import type { Sheet } from "../types";

// Generado por el pipeline studyvault-cheatsheets (extracción + auditoría sub-overseer).
// Editable a mano: es data pura. Ver components/vault-sheets/types.ts.

export const pawConceptos: Sheet = {
  "vault": "paw",
  "kind": "conceptos",
  "title": "Web Application Programming",
  "subtitle": "Spring MVC + JSP final exam cheat sheet — layered architecture, Spring DI, persistence (JDBC + JPA/Hibernate), validation, security, views",
  "notation": "`code` = inline code (class / annotation / file names, commands). Stack: Java 21, Spring MVC 5.3, Spring Security 5.3, JPA 2.1 + Hibernate 5.1, JSP/JSTL, PostgreSQL (prod) / HSQLDB (tests).",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Architecture & Maven Modules",
      "hint": "Contract/implementation split enforced by Maven scopes",
      "entries": [
        {
          "label": "Multi-module layout",
          "kind": "def",
          "body": "Modules: `models` (domain + enums), `persistence-contracts` (DAO interfaces) + `persistence` (impls), `service-contracts` + `services`, `webapp` (controllers, JSP, config). Root `pom` only manages versions."
        },
        {
          "label": "Dependency direction",
          "kind": "theorem",
          "body": "`webapp` → `service-contracts` (compile) + `services` (runtime); `services` → `persistence-contracts` (compile) + `persistence` (runtime); all → `models`. Controllers never touch service impls; services never touch DAO impls.",
          "cond": "Everything goes through interfaces"
        },
        {
          "label": "Maven scope rules",
          "kind": "method",
          "body": "`services` in webapp and `persistence` in services use scope `runtime`. `servlet-api` uses `provided`. `spring-test` / `hsqldb` / `mockito-core` use `test`. Everything else default (`compile`).",
          "note": "Runtime scope makes `mvn clean compile` FAIL if you write `new ServiceImpl()` — enforces DI"
        },
        {
          "label": "Version management",
          "kind": "method",
          "body": "All versions in root `pom.xml` under `<properties>` + `<dependencyManagement>`. Child modules declare deps WITHOUT `<version>` — only `groupId` + `artifactId`."
        },
        {
          "label": "Request flow",
          "kind": "def",
          "body": "Browser → `DispatcherServlet` → Controller → Service interface → DAO interface → `JdbcTemplate` / `EntityManager` → DB. Security filter chain, validation + `@Transactional`, and `ViewResolver` → JSP wrap the flow.",
          "cond": "Reference project: Rent The Slopes (ski gear rental marketplace)"
        },
        {
          "label": "Layer boundary leaks",
          "kind": "caution",
          "body": "`schema.sql` belongs to `persistence`, not webapp. `java.sql.*` (`Date`, `Timestamp`) appears ONLY in persistence — services/webapp use `java.time.*`. A service must never reference webapp resources (e.g. email templates in `WEB-INF`)."
        }
      ]
    },
    {
      "title": "Spring DI & Bean Configuration",
      "hint": "Stereotypes, injection style, annotation-based config",
      "entries": [
        {
          "label": "Stereotype annotations",
          "kind": "def",
          "body": "`@Controller` (webapp), `@Service` (services), `@Repository` (persistence DAOs), `@Configuration` (config classes). `@ComponentScan` in `WebConfig` must include all 3 packages: `webapp.controller`, `services`, `persistence`."
        },
        {
          "label": "Injection rules",
          "kind": "method",
          "body": "Always `@Autowired`; NEVER `new` for a dependency. Constructor injection preferred (required for DAOs receiving `DataSource`). Multiple impls of same type → `@Primary` or `@Qualifier`.",
          "note": "Field injection is allowed but constructor injection is the convention graded as good practice"
        },
        {
          "label": "web.xml setup",
          "kind": "def",
          "body": "Version 2.4 XSD. `contextClass = AnnotationConfigWebApplicationContext` appears TWICE: in `<context-param>` (for `ContextLoaderListener`) and in `<init-param>` of the `DispatcherServlet` `<servlet>`. Both the listener and the servlet are required.",
          "note": "`contextConfigLocation` points at `WebConfig` (+ `WebAuthConfig` when Security is added)"
        },
        {
          "label": "WebConfig",
          "kind": "def",
          "body": "`@Configuration` + `@EnableWebMvc` + `@ComponentScan` + `@PropertySource(\"classpath:application.properties\")`. Spring is bootstrapped entirely via Java annotations — no XML beyond `web.xml`."
        },
        {
          "label": "Required beans",
          "kind": "formula",
          "body": "`viewResolver` (`InternalResourceViewResolver`, prefix `/WEB-INF/views/`, suffix `.jsp`), `dataSource` (`SimpleDriverDataSource`, PostgreSQL), `messageSource` (`ReloadableResourceBundleMessageSource`, UTF-8), `validator` (`LocalValidatorFactoryBean`), `multipartResolver` (`CommonsMultipartResolver`), `mailSender` (`JavaMailSenderImpl`), `flyway`.",
          "cond": "`propertySourcesPlaceholderConfigurer` (static) enables `@Value` resolution"
        },
        {
          "label": "@Value from properties",
          "kind": "example",
          "body": "Inject config (DB url, mail creds, `app.base-url`) via `@Value(\"${app.base-url}\")` from `application.properties` — never hardcode the app's base URL."
        }
      ]
    },
    {
      "title": "MVC Controllers & Form Handling",
      "hint": "Thin controllers; PRG; binding rules",
      "entries": [
        {
          "label": "PRG pattern",
          "kind": "theorem",
          "body": "Post-Redirect-Get: after a successful POST return `new ModelAndView(\"redirect:/path\")`; on validation errors re-render the form view (NOT redirect, to preserve the model with errors). Prevents duplicate submission on refresh."
        },
        {
          "label": "BindingResult ordering",
          "kind": "caution",
          "body": "`BindingResult` MUST be the parameter immediately after the `@Valid` object — any other order throws an exception."
        },
        {
          "label": "Param binding",
          "kind": "method",
          "body": "`@RequestParam` for query string; `@PathVariable` + `{placeholder}` for URL path; `@ModelAttribute` at method level for common data (dropdowns, etc.). Form objects live in `webapp.form` — never reuse domain entities as forms."
        },
        {
          "label": "Thin-controller rules",
          "kind": "caution",
          "body": "NO business logic in controllers (only coordinate: request → service → view). NO try-catch — let exceptions bubble to `GlobalExceptionHandler`. NO `@Transactional` in controllers (services only). NO calling multiple services to assemble a result — one service method orchestrates.",
          "note": "TP1 feedback: business logic in controllers is a 'grave conceptual error'"
        },
        {
          "label": "@ControllerAdvice",
          "kind": "def",
          "body": "Cross-controller logic. `CurrentUserAdvice` exposes `@ModelAttribute(\"loggedUser\")` (scoped with `basePackages`). `GlobalExceptionHandler` maps domain exceptions to HTTP/views. Separate them: one for user injection, one for errors.",
          "cond": "`@ExceptionHandler({A.class, B.class})` can handle several exceptions at once"
        },
        {
          "label": "Exception to HTTP mapping",
          "kind": "formula",
          "body": "`ResourceNotFoundException` / `MethodArgumentTypeMismatchException` → 404; `ForbiddenException` → 403; `MaxUploadSizeExceededException` → 413; `InvalidRentStateException` → 409; `InvalidAdminInviteTokenException` → 410; `ProviderCbuRequiredException` → 409; catch-all `Exception` → 500.",
          "cond": "Domain exceptions are plain `RuntimeException` in `services.exceptions`; HTTP mapping lives only in `GlobalExceptionHandler`, not via `@ResponseStatus` on the exception"
        }
      ]
    },
    {
      "title": "Bean Validation (JSR-303/380)",
      "hint": "Validate in the form, not the controller",
      "entries": [
        {
          "label": "Golden rule",
          "kind": "theorem",
          "body": "Validation belongs in the FORM, never the controller. Use `@Valid` + Bean Validation; the controller only checks `errors.hasErrors()`."
        },
        {
          "label": "Standard constraints",
          "kind": "def",
          "body": "`@NotBlank` / `@NotNull` / `@NotEmpty` (required), `@Size(min,max)` (length), `@Email`, `@DecimalMin` (numeric min), `@Pattern` (regex). Form objects are POJOs (JavaBean getters/setters), separate from entities."
        },
        {
          "label": "messages.properties resolution",
          "kind": "method",
          "body": "Most-specific to least-specific: `Pattern.UserForm.username` → `Pattern.username` → `Pattern.String` → `Pattern`. Reference with `{message.key}` in the constraint's `message` attribute."
        },
        {
          "label": "Custom validator",
          "kind": "method",
          "body": "`@interface` in `validation/annotations/` with `@Constraint(validatedBy=...)`, `message` / `groups` / `payload`. `ConstraintValidator<A,T>` impl in `validation/validators/`. Can `@Autowired` a service to hit the DB; business logic lives in the service, validator only calls it.",
          "cond": "Field-level `@Target(FIELD)`; cross-field `@Target(TYPE)` on the whole form"
        },
        {
          "label": "Class-level to field error",
          "kind": "example",
          "body": "A `@Target(TYPE)` validator binds the error to the whole form by default. To attach it to a specific field: `context.disableDefaultConstraintViolation()` then `.buildConstraintViolationWithTemplate(msg).addPropertyNode(\"size\").addConstraintViolation()` so `<form:errors path=\"size\"/>` shows it.",
          "note": "Example validators: `@ExistingProductId`, `@NewUser`, `@PasswordMatch`, `@ProductSizeForCategory`, `@PaymentProofRequiredIfUpload`"
        },
        {
          "label": "Validation groups",
          "kind": "method",
          "body": "Reuse one form for several flows. Define a marker interface inside the form; tag constraints with `groups={Default.class, UserValidationUpdate.class}`. Trigger a subset with `@Validated(Group.class)` (Spring) — plain `@Valid` does NOT support groups.",
          "cond": "Constraints without groups go implicitly to `Default.class`; to apply in both flows list both groups explicitly"
        },
        {
          "label": "File upload limits",
          "kind": "caution",
          "body": "Two levels: `web.xml` `<multipart-config>` hard cap (Spring), and a business-limit custom validator (e.g. 10MB). Oversized upload → `MaxUploadSizeExceededException` before the controller → caught by `GlobalExceptionHandler` → 413 page."
        }
      ]
    },
    {
      "title": "Persistence — Spring JDBC",
      "hint": "JdbcTemplate + SimpleJdbcInsert, hand-written SQL",
      "entries": [
        {
          "label": "DAO pattern",
          "kind": "def",
          "body": "`@Repository` DAO with `@Autowired` constructor receiving `DataSource`, building `JdbcTemplate` and `SimpleJdbcInsert`. No ORM — every query is hand-written SQL."
        },
        {
          "label": "DAO rules",
          "kind": "method",
          "body": "`RowMapper` as `private static final` constant (never per-request). `SimpleJdbcInsert` with `.withTableName()` + `.usingGeneratedKeyColumns(\"id\")`. In `create()`, map keys = column names; insert returns generated key via `executeAndReturnKey(args)`. NEVER create tables in Java — use `schema.sql` / Flyway.",
          "cond": "One DAO per table (cátedra-graded rule)"
        },
        {
          "label": "Enum persistence",
          "kind": "method",
          "body": "Store enums as `.name()` (exact string), restore with `valueOf()` at the DAO boundary. Convert `LocalDate` / `LocalDateTime` ↔ `java.sql.Date` / `Timestamp` inside the DAO only."
        },
        {
          "label": "Schema management",
          "kind": "def",
          "body": "Prod schema via Flyway migrations at `persistence/src/main/resources/db/migration/` (e.g. `V1__initial_schema.sql`). Tests use `persistence/src/test/resources/schema.sql` for HSQLDB."
        },
        {
          "label": "Two schema files",
          "kind": "caution",
          "body": "PostgreSQL uses `SERIAL PRIMARY KEY` + CHECK constraints; HSQLDB uses `INTEGER GENERATED BY DEFAULT AS IDENTITY`. They are incompatible — that's why prod and test schema files are separate.",
          "note": "HSQLDB test URL uses `sql.syntax_pgs=true` to tolerate most PG-specific SQL"
        },
        {
          "label": "Joins in Java (N+1)",
          "kind": "caution",
          "body": "Looping per related entity (e.g. `findById` per author per post) generates N queries where 1 JOIN suffices. Do the join in SQL (`findAllWithAuthor`), hydrate both with a custom `RowMapper`."
        }
      ]
    },
    {
      "title": "Persistence — JPA / Hibernate",
      "hint": "EntityManager, JPQL, dirty checking, lazy loading",
      "entries": [
        {
          "label": "JPA vs Hibernate",
          "kind": "def",
          "body": "JPA is the Java standard (`EntityManager`, `@Entity`, `@Column`); Hibernate is the implementation — same standard/impl split as Bean Validation. Project stack: JPA 2.1 (`javax.persistence`, NOT `jakarta`) + Hibernate 5.1 on Java 21.",
          "cond": "Object-relational impedance: objects (inheritance, references) vs tables (keys, joins) don't map 1:1 — the ORM absorbs the trade-offs"
        },
        {
          "label": "Java 21 + Hibernate 5.1 traps",
          "kind": "caution",
          "body": "Hibernate 5.1 (2016) on Java 21 needs workarounds: JPMS blocks Hibernate reflection → add `--add-opens` in `maven-surefire-plugin` and `jetty-maven-plugin` (else `InaccessibleObjectException`); JAXB removed in Java 11 → declare `jaxb-api` explicitly; keep `javax.persistence` (`jakarta` only lands in Hibernate 6+).",
          "note": "Need `maven-surefire-plugin` 3.3.0+ and `jetty-maven-plugin` 9.4.58+ to tolerate Java 21"
        },
        {
          "label": "Entity mapping",
          "kind": "def",
          "body": "`@Entity` (always) + `@Table(name)` (if default class name fails), `@Id` + `@GeneratedValue` (`SEQUENCE` + `@SequenceGenerator`), `@Column(name,length,nullable,unique,columnDefinition)`. SQL mapping: `VARCHAR(n)` → `length=n`, `NOT NULL` → `nullable=false`, `UNIQUE` → `unique=true`, `TEXT` → `columnDefinition=\"TEXT\"`."
        },
        {
          "label": "No-arg constructor",
          "kind": "caution",
          "body": "Hibernate instantiates by reflection then populates fields — needs a no-arg constructor (may be package-private/protected, NOT necessarily public). Setters are NOT required; Hibernate writes private fields by reflection, so immutability for app code is preserved."
        },
        {
          "label": "EntityManager ops",
          "kind": "formula",
          "body": "`em.persist(e)` INSERT (or UPDATE if it has id), `em.find(Class,id)` read (null if absent → wrap in `Optional.ofNullable`), `em.remove(e)` delete, `em.createQuery(\"...\",Class)` JPQL. Inject with `@PersistenceContext EntityManager` (field).",
          "cond": "`EntityManager` is stateful & NOT thread-safe — the *HibernateDao is effectively request-scoped, not singleton; `@PersistenceContext` injects a thread-safe proxy"
        },
        {
          "label": "Dirty checking",
          "kind": "theorem",
          "body": "To update, just mutate a managed entity inside the transaction — NO save/merge call. On tx close Hibernate diffs against the initial snapshot and fires the UPDATE automatically.",
          "note": "Team rule: do NOT mutate entities directly — go through an explicit DAO method; `readOnly=true` disables the auto-flush"
        },
        {
          "label": "JPQL",
          "kind": "def",
          "body": "Queries over the model, not the DB: entity names (not tables), property names (not columns). `from User u where u.username = :name`. `SELECT` optional. Navigate relations (`i.assignee.username`) — JPA emits the joins.",
          "note": "`createNativeQuery` cannot take `Long.class` — read `List<Number>` and map `Number::longValue`"
        },
        {
          "label": "Relationships",
          "kind": "def",
          "body": "`@ManyToOne` (FK side), `@OneToMany(mappedBy=...)` (inverse, no new column), `@ManyToMany`, `@OneToOne`. `optional=false` → NOT NULL FK; `cascade=CascadeType.ALL` propagates persist/merge/remove; `orphanRemoval=true` deletes on collection removal."
        },
        {
          "label": "Default eager *ToOne",
          "kind": "caution",
          "body": "`@ManyToOne` / `@OneToOne` default to `FetchType.EAGER` — a trap that chains eager fetches → silent N+1. ALWAYS override to `fetch=FetchType.LAZY`. (`*ToMany` defaults to LAZY, which is correct.)"
        },
        {
          "label": "LazyInitializationException",
          "kind": "caution",
          "body": "JSP accessing a lazy collection after the service tx closed (Session gone). Fix: `OpenEntityManagerInViewFilter` in `web.xml` (keeps Session open through view render). Trade-off: lose visibility of how many queries the JSP fires.",
          "note": "Forcing `.size()` in the service = eager-always (loses lazy benefit). Better: deliberate `join fetch` / `EntityGraph` in the DAO"
        },
        {
          "label": "@Enumerated",
          "kind": "method",
          "body": "`@Enumerated(EnumType.STRING)` — readable, lets you ADD new values safely (never rename existing). `EnumType.ORDINAL` (default) stores the index — breaks if you reorder. Prefer STRING."
        },
        {
          "label": "Pagination 1+1 queries (key)",
          "kind": "theorem",
          "body": "Marked 'key to pass next TP'. (1) Native query paginates IDs with `LIMIT` / `OFFSET`; (2) JPQL fetches entities `WHERE id IN :ids ORDER BY ...`. Repeat the `ORDER BY` in BOTH; if IDs empty return `emptyList` (avoid `IN ()`).",
          "cond": "`setFirstResult` / `setMaxResults` directly on entities with joins is wrong: 1 entity is not 1 row, so `LIMIT` cuts mid-entity — a non-approval reason"
        },
        {
          "label": "hbm2ddl.auto",
          "kind": "method",
          "body": "`validate` (prod), `update` (dev — creates tables, adds columns, never destructive), `create` / `create-drop` (tests). `update` does NOT drop columns, backfill defaults, or do complex migrations — Flyway is still needed for destructive/non-trivial changes.",
          "note": "`JpaTransactionManager(EntityManagerFactory)` replaces `DataSourceTransactionManager`; `@Transactional` usage unchanged"
        },
        {
          "label": "em.getReference()",
          "kind": "example",
          "body": "To populate a FK from an id without a SELECT: `em.getReference(User.class, id)` returns a proxy that only materializes if a property is accessed. Useful for the logged-in user's id."
        }
      ]
    },
    {
      "title": "AOP & Transactions",
      "hint": "Cross-cutting concerns via proxies",
      "entries": [
        {
          "label": "Spring AOP",
          "kind": "def",
          "body": "Handles cross-cutting concerns (transactions, logging, locks, security). Spring wraps the bean in a Proxy implementing the same interface; calls route through the proxy which adds behavior around the real impl. Used over inheritance (Java is single-inheritance; DAOs/services aren't related)."
        },
        {
          "label": "Proxy restrictions",
          "kind": "caution",
          "body": "AOP annotations are SILENTLY ignored on: (1) private/protected methods (proxies only intercept public interface methods); (2) self-calls `this.method()` (bypass the proxy — only external calls are intercepted)."
        },
        {
          "label": "@Transactional",
          "kind": "def",
          "body": "Wraps a method/class in a DB transaction; rolls back if an exception propagates out. Enable with `@EnableTransactionManagement` on the config class + a `PlatformTransactionManager` bean. Use `readOnly=true` for reads, plain for writes — per-method, not class-level.",
          "note": "`readOnly=true` disables Hibernate dirty-state detection/flush; signals intent ('this method must not write')"
        },
        {
          "label": "@Transactional on service, not DAO",
          "kind": "theorem",
          "body": "On DAOs, a business op calling multiple DAOs would create multiple separate transactions — a failure wouldn't roll back earlier DAO work. At the service level the whole op (multiple DAO calls + side effects) runs in one transaction; anything fails → everything rolls back."
        },
        {
          "label": "@Scheduled",
          "kind": "method",
          "body": "`@Scheduled(fixedRate=5000)` runs a method every 5s; needs `@EnableScheduling`. Used for automatic rent expiration jobs (`EXPIRED`, `PAYMENT_EXPIRED`, `PAYMENT_ACCEPTANCE_EXPIRED`)."
        },
        {
          "label": "@Rollback in tests",
          "kind": "example",
          "body": "`@Rollback` + `@Transactional` on the DAO test class: each test runs in its own transaction auto-rolled-back afterward — DB left clean, no manual cleanup."
        }
      ]
    },
    {
      "title": "JSP, JSTL & EL Views",
      "hint": "No scriptlets; escape everything; i18n",
      "entries": [
        {
          "label": "Absolute view rules",
          "kind": "caution",
          "body": "NEVER use scriptlets `<% %>` or Java expressions `<%= %>` — only JSTL + EL `${...}`. NEVER print user/DB data with raw `${var}` — XSS (a grave TP1 error). NO business logic (filter/sort/dedupe) in JSP."
        },
        {
          "label": "XSS — c:out mandatory",
          "kind": "theorem",
          "body": "`<c:out value=\"${user.name}\"/>` escapes `<`, `>`, `\"`, `'`, `&` to HTML entities, neutralizing scripts. Required for any value from DB/user.",
          "cond": "Safe without `c:out`: `<c:url>` output, numbers, booleans, your own enum values"
        },
        {
          "label": "Required taglibs",
          "kind": "def",
          "body": "`c` (JSTL core), `spring` (spring tags), `form` (spring form), `sec` (spring-security-taglibs). Declared at the top of every JSP."
        },
        {
          "label": "JSTL core tags",
          "kind": "def",
          "body": "`<c:out>` (escape print), `<c:if test>` (no else), `<c:choose>` / `<c:when>` / `<c:otherwise>` (switch), `<c:forEach var items>` (iterate), `<c:set>` (var), `<c:url value var>` + `<c:param>` (context-aware URL/encoding)."
        },
        {
          "label": "EL quick reference",
          "kind": "def",
          "body": "`${user.name}` property, `${user.address.city}` nested, `${products[0]}` indexed, `${empty list}` (true if null/empty), operators `+ - * / % == != < > && || ! empty`."
        },
        {
          "label": "form:form binding",
          "kind": "method",
          "body": "`<form:form modelAttribute=\"registerForm\">` — the `modelAttribute` name must match the controller's `@ModelAttribute` exactly. `<form:input path=\"...\">` + `<form:errors path=\"...\">` per validated field."
        },
        {
          "label": "Static resources & i18n",
          "kind": "method",
          "body": "Always `<c:url value=\"/css/style.css\" var=\"...\"/>` for links/assets (handles context path). User-facing text via `<spring:message code=\"...\"/>` from `i18n/messages.properties`. NEVER hardcode paths or visible text.",
          "note": "Mails use `recipient.getPreferredLanguage()`, never `LocaleContextHolder.getLocale()` (= the actor's, not the recipient's)"
        },
        {
          "label": "sec:authorize",
          "kind": "method",
          "body": "Role checks in JSP via `<sec:authorize access=\"hasRole('ADMIN')\">` or `<sec:authorize url=\"/admin\">` — applies the same rules as `WebAuthConfig`. NEVER do `<c:if test=\"${loggedUser.role=='ADMIN'}\">` with magic strings. `<sec:authentication property=\"name\"/>` shows the user."
        },
        {
          "label": "Custom tag files",
          "kind": "def",
          "body": "~37 reusable tags in `WEB-INF/tags/` (navbar, footer, product-card, calendar, pagination, modal...) accept attributes and render consistent Bootstrap 5 HTML. Reusable + parameterized → tag file; plain repeated structure → `<%@ include %>`.",
          "note": "Programmatic tags: `SimpleTagSupport.doTag()` handler + TLD file declaring name/class/uri"
        }
      ]
    },
    {
      "title": "Spring Security",
      "hint": "Authentication, authorization (ACL), ownership",
      "entries": [
        {
          "label": "Architecture",
          "kind": "def",
          "body": "`DelegatingFilterProxy` (registered in `web.xml`, intercepts every request before `DispatcherServlet`) → `springSecurityFilterChain`. `WebAuthConfig` (`@EnableWebSecurity`) defines rules. `UserDetailsService` loads users at login. Spring proxies secured beans (AOP) — the app is unaware.",
          "cond": "`web.xml`: register `WebAuthConfig` in `contextConfigLocation` + add the `DelegatingFilterProxy` filter mapped to `/*`"
        },
        {
          "label": "SecurityFilterChain",
          "kind": "method",
          "body": "Modern API (`SecurityFilterChain` bean, not `WebSecurityConfigurerAdapter`): `authorizeHttpRequests` with `requestMatchers(...).permitAll()` then `anyRequest().hasRole(\"USER\")`, plus `formLogin`, `rememberMe`, `logout`, `exceptionHandling.accessDeniedPage`.",
          "cond": "Order matters — FIRST match wins. Declare all public matchers BEFORE the catch-all"
        },
        {
          "label": "UserDetailsService + AuthUser",
          "kind": "def",
          "body": "`@Component` implementing Spring's `UserDetailsService`; `loadUserByUsername(email)` calls `UserService.findByEmail`, wraps domain `User` in `AuthUser` (subclass of Spring's `User`). Annotate `@Transactional(readOnly=true)`.",
          "note": "Guard `password==null` rejects guest stub users created during a rent — they must complete `/register` first"
        },
        {
          "label": "Role naming",
          "kind": "caution",
          "body": "Prefix `ROLE_` is required: `hasRole(\"USER\")` checks `ROLE_USER` automatically. Authorities are a Collection (multiple roles possible). Project roles: `USER`, `ADMIN`."
        },
        {
          "label": "PasswordEncoder",
          "kind": "method",
          "body": "`@Bean PasswordEncoder`: `BCryptPasswordEncoder` in production (hash at creation/change). `PlainTextPasswordEncoder` dev-only, never prod."
        },
        {
          "label": "Accessing logged-in user",
          "kind": "method",
          "body": "Never touch `SecurityContextHolder` from controllers. A `@ControllerAdvice` (`CurrentUserAdvice`) resolves `Authentication` → domain `User` and exposes `@ModelAttribute(\"loggedUser\")`; controllers receive it as a param and it's available in views as `${loggedUser}`.",
          "cond": "`SecurityContextHolder` only in webapp; services receive `userId` as a parameter"
        },
        {
          "label": "Ownership control",
          "kind": "theorem",
          "body": "Checking the role is NOT enough — if a user can reach another user's resource it's a security bug. Verify ownership in the SERVICE (e.g. `findOwnedByProvider(rentId, providerId)` throws `ForbiddenException`), not the controller.",
          "note": "Alternative for trivial path-id==user-id checks: SpEL `.access(\"@userSecurity.hasUserId(authentication,#id)\")` in `WebAuthConfig` — be consistent across the module"
        },
        {
          "label": "Single ACL source",
          "kind": "caution",
          "body": "Define access policy in ONE place. Mixing `requestMatchers` in `WebAuthConfig` with `@PreAuthorize` in controllers duplicates rules. Prefer centralizing in `WebAuthConfig`; if using `@PreAuthorize` add `@EnableGlobalMethodSecurity(prePostEnabled=true)`."
        }
      ]
    },
    {
      "title": "Logging, Email & Domain Model",
      "hint": "SLF4J facade, async mail, immutability, enums",
      "entries": [
        {
          "label": "SLF4J + Logback",
          "kind": "def",
          "body": "SLF4J is the facade, Logback the impl — import only from SLF4J. `private static final Logger LOGGER = LoggerFactory.getLogger(MyClass.class)`. Use `{}` placeholders: `LOGGER.debug(\"user: {}\", u)` — Logback skips formatting if the level is disabled.",
          "note": "`logback-test.xml` (dev, Console, DEBUG) loads before `logback.xml` (prod, RollingFile); `maven-war-plugin` excludes `logback-test.xml` from the WAR"
        },
        {
          "label": "Hibernate SQL logging",
          "kind": "caution",
          "body": "Avoid `hibernate.show_sql=true` in prod (bypasses logback, can't lower level). Instead set loggers `org.hibernate.SQL` (queries) and `org.hibernate.orm.jdbc.bind` (bound params) to DEBUG in dev only."
        },
        {
          "label": "@Async email",
          "kind": "method",
          "body": "`EmailService` methods are `@Async` (SMTP via `JavaMailSender`, Gmail). Use the RECIPIENT's locale (`recipient.getPreferredLanguage()`). `@Async` swallows exceptions — wrap in `try/catch(RuntimeException)` + `LOGGER.error`. Pass resolved template Strings (no webapp reference)."
        },
        {
          "label": "Domain models",
          "kind": "def",
          "body": "JPA entities (`@Entity`, non-final fields, protected no-arg ctor, setters where the service mutates). `User` keeps a Builder (many optional fields). Mutation surface stays in services — controllers/views never mutate entity state. `equals` / `hashCode` by id where it helps tests."
        },
        {
          "label": "Magic strings to enums",
          "kind": "theorem",
          "body": "Use enums for fixed vocabularies (status, order-by, locations) instead of string literals. Persist as `.name()`, restore `valueOf()`; UI via `getDisplayName()`; URLs via `HasSlug.getSlug()` / `fromSlug(...)`.",
          "cond": "Project enums: Category(14)/CategoryGroup, Size, Condition, Gender, Currency, Location, ProductStatus, RentStatus(10), PaymentMethod, UserRole"
        },
        {
          "label": "Optional usage",
          "kind": "caution",
          "body": "`Optional` only as a function RETURN type (e.g. `findById`). Never as a class field or method parameter — model an optional field as a nullable type with a getter returning `Optional.ofNullable(...)`. Pick one representation of 'absent' (`Optional.empty` / null), never `id=-1`."
        },
        {
          "label": "Domain invariants",
          "kind": "example",
          "body": "Every Product has at least 1 default Price; `Category.usesSize()` (CLOTHING/FOOTWEAR) implies size non-null, ACCESSORIES/EQUIPMENT implies size null; 1 review per rent (UNIQUE); rent reviewable only after it ended. Enforced in form/service/DB constraint."
        }
      ]
    },
    {
      "title": "Pagination, Filters & Search",
      "hint": "GET state in the URL, three coordinated forms",
      "entries": [
        {
          "label": "State preservation",
          "kind": "theorem",
          "body": "Searchbar, filters, pagination are 3 independent forms that must preserve each other's state. Change a filter/search → reset to page 1, keep the others; change page → keep filters+search; reload → same state.",
          "cond": "Pagination ALWAYS lives in the URL — never page number only in JS state"
        },
        {
          "label": "Query-param validation",
          "kind": "method",
          "body": "GET flow → no form binding / `@Valid`. Validate query params MANUALLY in the controller: clamp page to `[1, totalPages]`; invalid enum filter (bad Location) → ignore via try/catch on `valueOf`.",
          "note": "Sprint 2: location moved from path variable to query param (`/catalog?location=...&query=...&page=1`) so all filters are optional on one endpoint"
        },
        {
          "label": "Hidden-fields approach",
          "kind": "method",
          "body": "Preferred: one `<form method=\"get\">` per control, carrying the other controls' state as `<input type=\"hidden\">` (and `page=1` to reset). Keeps server-side Spring validators usable. JS-only state is discouraged (loses server validation)."
        },
        {
          "label": "Catalog filter",
          "kind": "caution",
          "body": "Catalog must only show `status='ACTIVE'` products — apply the filter in the DAO WHERE clause (`status='ACTIVE' AND (title ILIKE ? OR ...) AND (location=? OR ? IS NULL) LIMIT ? OFFSET ?`). `DELETED` is always excluded server-side."
        }
      ]
    },
    {
      "title": "Testing",
      "hint": "JUnit 5; Mockito for services, HSQLDB for DAOs",
      "entries": [
        {
          "label": "Service tests (Mockito)",
          "kind": "method",
          "body": "No Spring context: `@ExtendWith(MockitoExtension.class)` + `@Mock` DAOs + `@InjectMocks` impl. Stub with `when(...).thenReturn(...)`. Structure Arrange-Act-Assert, one scenario per `@Test`, result vars final."
        },
        {
          "label": "Persistence tests (HSQLDB)",
          "kind": "method",
          "body": "`@Rollback` + `@Transactional` + `@ExtendWith(SpringExtension.class)` + `@ContextConfiguration(classes=TestConfiguration.class)`. In-memory HSQLDB (`sql.syntax_pgs=true`) running `schema.sql` + `populator.sql`. Each test in an auto-rolled-back transaction → isolation.",
          "note": "Read tests don't insert in Arrange (use `populator.sql`); write tests don't call another method of the same DAO in Arrange/Assert"
        },
        {
          "label": "Behavior not implementation",
          "kind": "caution",
          "body": "NEVER `Mockito.verify()` / `spy()` — they assert internal calls (implementation), so refactors break correct tests. Assert the observable RESULT (return value/state).",
          "cond": "Only valid `verify()` exception: when the side-effect IS the entire contract (e.g. a notification service whose only job is sending the mail)"
        },
        {
          "label": "DAO tests need DB asserts",
          "kind": "caution",
          "body": "A DAO test without assertions always passes. Assert DB state with `JdbcTestUtils.countRowsInTable(jdbcTemplate, \"users\")` (or `countRowsInTableWhere`) before/after the operation."
        },
        {
          "label": "JUnit version",
          "kind": "caution",
          "body": "Use JUnit 5 (`@ExtendWith`). NOT JUnit 3 (`extends TestCase`) nor JUnit 4 (`@RunWith`) — both flagged in TP1. Never mock raw JDBC (`Connection` / `Statement` / `ResultSet`) — use HSQLDB. Never use the production DB in tests.",
          "note": "Naming: `test<Method>When<Condition>Returns<Outcome>`, e.g. `testFindByIdWhenUserExistsReturnsUser`"
        }
      ]
    },
    {
      "title": "Feature Patterns (Sprint 2)",
      "hint": "Conditional validation, tokens, escape hatches",
      "entries": [
        {
          "label": "Payment UPLOAD vs CASH",
          "kind": "example",
          "body": "`PaymentMethod` enum: `UPLOAD` (default, upload proof) and `CASH` (escape hatch when provider has no CBU). Class-level `@PaymentProofRequiredIfUpload` requires proof only when `method=UPLOAD`; `@ValidPaymentProof(required=false)` handles MIME/size when a file is present.",
          "note": "`approveRent` gates on non-blank provider CBU → `ProviderCbuRequiredException` (409) — defense in depth so rents aren't uncollectable"
        },
        {
          "label": "Admin invite flow",
          "kind": "example",
          "body": "Single-use token, 7-day TTL, persisted in DB. Admin invites by email → stub user with UUID token → mail link `/register?email=...&token=...`. Registration consumes the token (clears it) and promotes to ADMIN; invalid/expired → `InvalidAdminInviteTokenException` (410 GONE).",
          "cond": "Replaces an insecure flow where anyone knowing an invited email could self-register and inherit ADMIN"
        },
        {
          "label": "Granular profile forms",
          "kind": "method",
          "body": "One small form per field (`UpdateNameForm`, `UpdateCbuForm`, ...) instead of a single `UpdateProfileForm`, so each submit carries its own `@Valid` rules and specific messages."
        },
        {
          "label": "SecurityContext refresh",
          "kind": "method",
          "body": "After a user edits their own username/email, the cached `Authentication` is stale. Rebuild a new `UsernamePasswordAuthenticationToken` with the updated principal and `setAuthentication` it.",
          "note": "Unnecessary if `CurrentUserAdvice` always re-queries the repo fresh — the next render already has updated data"
        }
      ]
    }
  ]
};

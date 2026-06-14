---
title: Pre-Delivery Checklist
type: concept
created: 2026-04-11
updated: 2026-04-11
tags: [checklist, quality, delivery]
sources: []
---

# Pre-Delivery Checklist

Verify all items before submitting.

---

## Structure & Config

- [ ] Modules with correct archetypes (pom-root / webapp / quickstart)
- [ ] Versions only in root pom; child poms without `<version>`
- [ ] scope `runtime` for services in webapp
- [ ] scope `provided` for servlet-api
- [ ] scope `test` for spring-test, hsqldb, mockito-core
- [ ] `@ComponentScan` includes all 3 packages
- [ ] web.xml v2.4 with ContextLoaderListener + AnnotationConfigWebApplicationContext in BOTH places

## Dependency Injection

- [ ] No `new` for dependencies; always `@Autowired`
- [ ] Correct stereotype annotations on implementations (`@Service`, `@Repository`, `@Controller`)
- [ ] `@Autowired` constructor in DAOs
- [ ] `@Primary` or `@Qualifier` if multiple implementations

## Controllers & Validation

- [ ] `BindingResult` immediately after `@Valid`
- [ ] On errors → return form view (not redirect)
- [ ] On success → redirect (PRG pattern)
- [ ] Form Objects separate from model entities

## JSP Views

- [ ] No scriptlets, only JSTL + EL
- [ ] Taglibs declared at top
- [ ] `<c:url>` for all static resources and links
- [ ] `<form:form modelAttribute>` matches controller
- [ ] `<form:errors>` per validated field
- [ ] `<spring:message>` for all visible text
- [ ] `messages.properties` in `src/main/resources/i18n/`

## Persistence

- [ ] RowMapper as static final constant
- [ ] SimpleJdbcInsert with tableName + generatedKeyColumns
- [ ] Schema SQL in .sql files, not Java code
- [ ] Two separate schema.sql files (PostgreSQL vs HSQLDB)
- [ ] DataSourceInitializer / Flyway in WebConfig

## Testing

- [ ] Service tests: MockitoExtension + @Mock + @InjectMocks
- [ ] DAO tests: SpringExtension + @ContextConfiguration + schema.sql
- [ ] TestConfig in src/test/java
- [ ] Setup → Exercise → Assert structure
- [ ] One scenario per @Test
---
title: Maven Module Structure
type: concept
created: 2026-04-11
updated: 2026-04-11
tags: [maven, modules, build, architecture]
sources: []
---

# Maven Module Structure

The project follows a multi-module Maven architecture with a deliberate separation between **contracts** (interfaces) and **implementations**.

---

## Modules

| Module | Archetype | Purpose |
|--------|-----------|---------|
| `(root)` | pom-root | Version management only |
| `models` | quickstart | Immutable domain objects and enums |
| `persistence-contracts` | quickstart | DAO interfaces |
| `persistence` | quickstart | JDBC DAO implementations (`@Repository`) |
| `service-contracts` | quickstart | Service interfaces |
| `services` | quickstart | Business logic implementations (`@Service`) |
| `webapp` | maven-archetype-webapp | Controllers, JSPs, Spring config, `web.xml` |

---

## Dependency Direction

```
webapp → service-contracts (compile) + services (runtime)
         → persistence-contracts (compile) + persistence (runtime)
            → models
```

This enforces that controllers never touch service implementations directly, and services never touch DAO implementations directly. Everything goes through interfaces.

---

## Scope Rules

| Dependency | Scope | Why |
|-----------|-------|-----|
| `services` in `webapp` | **runtime** | Forces DI — `mvn clean compile` fails if you do `new ServiceImpl()` |
| `persistence` in `services` | **runtime** | Same principle for DAO layer |
| `servlet-api` | **provided** | Container provides it at runtime |
| `spring-test`, `hsqldb`, `mockito-core` | **test** | Only needed for tests |
| Everything else | default (compile) | |

---

## Version Management

**All versions** are declared in the root `pom.xml` under `<properties>` + `<dependencyManagement>`. Child modules declare dependencies **without `<version>`** — only groupId + artifactId.

### Standard Versions

```
org.springframework.version = 5.3.33
org.postgresql.version = 42.2.5
mockito.version = 2.25.1
org.hsqldb.version = 2.3.1
javax.validation-api.version = 2.0.1.Final
org.hibernate.validator = 6.2.4.Final
servlet-api.version = 2.5
jstl.version = 1.2
```

When adding a new dependency:
1. Add it with its version to `<dependencyManagement>` in the root `pom.xml`
2. Reference it without a version in the relevant child module's `pom.xml`
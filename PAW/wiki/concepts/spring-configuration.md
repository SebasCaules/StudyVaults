---
title: Spring Configuration
type: concept
created: 2026-04-11
updated: 2026-04-15
tags: [spring-mvc, configuration, webconfig, web-xml, transactions]
sources: [clase-2-spring-web-maven.md, clase-5-spring-security-logging.md, clase-6-logging-aop.md]
---

# Spring Configuration

Spring is bootstrapped entirely via Java annotations — no XML Spring config beyond `web.xml`.

---

## web.xml

**Version:** 2.4 with XML Schema (not DTD 2.3 default)

Key rule: `contextClass = AnnotationConfigWebApplicationContext` appears **TWICE**:
1. In `<context-param>` (for `ContextLoaderListener`)
2. In `<init-param>` inside `<servlet>` (for `DispatcherServlet`)

Both `ContextLoaderListener` and `DispatcherServlet` are required.

```xml
<context-param>
  <param-name>contextClass</param-name>
  <param-value>...AnnotationConfigWebApplicationContext</param-value>
</context-param>
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>ar.edu.itba.paw.webapp.config.WebConfig</param-value>
</context-param>
<listener>
  <listener-class>...ContextLoaderListener</listener-class>
</listener>
<servlet>
  <servlet-name>dispatcher</servlet-name>
  <servlet-class>...DispatcherServlet</servlet-class>
  <init-param>
    <param-name>contextClass</param-name>
    <param-value>...AnnotationConfigWebApplicationContext</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>
```

Error pages: `404 → /error/404`, `500 → /error/500` (handled by [[Controllers]]#ErrorController).

---

## WebConfig

`@Configuration` + `@EnableWebMvc` + `@ComponentScan` + `@PropertySource("classpath:application.properties")`

### @ComponentScan — must include all three packages

```java
ar.edu.itba.paw.webapp.controller
ar.edu.itba.paw.services
ar.edu.itba.paw.persistence
```

### Required Beans

| Bean | Type | Config |
|------|------|--------|
| `viewResolver()` | `InternalResourceViewResolver` | prefix `/WEB-INF/views/`, suffix `.jsp` |
| `dataSource()` | `SimpleDriverDataSource` | PostgreSQL, reads from `application.properties` |
| `flyway()` | `Flyway` | Runs migrations from `classpath:db/migration` |
| `messageSource()` | `ReloadableResourceBundleMessageSource` | `classpath:i18n/messages`, UTF-8 |
| `validator()` | `LocalValidatorFactoryBean` | Integrates JSR-380 with Spring MVC |
| `multipartResolver()` | `CommonsMultipartResolver` | Max 10 MB/file, 70 MB total |
| `mailSender()` | `JavaMailSenderImpl` | Gmail SMTP, port 587, TLS |
| `propertySourcesPlaceholderConfigurer()` | static | Enables `@Value` resolution |

### Resource Handlers

- `/css/**` → `/css/`
- `/assets/**` → `/assets/`

### Properties (from `application.properties`)

- `db.url`, `db.username`, `db.password` — database
- `mail.username`, `mail.password` — Gmail SMTP
- `app.base-url`, `app.mail.from` — email service

---

## Security Configuration (WebAuthConfig)

When adding Spring Security, register `WebAuthConfig` alongside `WebConfig` in `contextConfigLocation`, and add the `DelegatingFilterProxy` filter. See [[Spring Security]] for full configuration details.

## Transaction Management

Add to `WebConfig`:

```java
@EnableTransactionManagement   // class-level annotation

@Bean
public PlatformTransactionManager transactionManager(final DataSource ds) {
    return new DataSourceTransactionManager(ds);
}
```

This enables `@Transactional` on Service beans. See [[AOP & Transactions]] for transaction strategy details.

> **Al migrar a JPA/Hibernate** (ver [[Hibernate & JPA]]) este bean se reemplaza por `JpaTransactionManager(EntityManagerFactory)` y se agrega `entityManagerFactory()` con `LocalContainerEntityManagerFactoryBean`. La anotación `@EnableTransactionManagement` y el uso de `@Transactional` no cambian.

---

## File Locations

```
webapp/src/main/webapp/WEB-INF/views/   ← JSP views
webapp/src/main/webapp/WEB-INF/tags/    ← Custom tag files
webapp/src/main/webapp/css/             ← Stylesheets
webapp/src/main/webapp/assets/          ← Static assets
src/main/resources/application.properties
src/main/resources/i18n/messages.properties
persistence/src/main/resources/db/migration/V1__initial_schema.sql
```
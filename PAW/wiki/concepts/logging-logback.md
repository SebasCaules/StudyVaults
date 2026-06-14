---
title: Logging (Logback / SLF4J)
type: concept
created: 2026-04-15
updated: 2026-04-15
tags: [logging, logback, slf4j, configuration]
sources: [clase-5-spring-security-logging.md, clase-6-logging-aop.md]
---

# Logging (Logback / SLF4J)

The project uses **SLF4J** as the logging facade and **Logback** as the implementation.

---

## The Facade Pattern

Always import from SLF4J — never directly from Logback. This keeps code decoupled from the implementation.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger LOGGER = LoggerFactory.getLogger(MyClass.class);
```

Use `{}` placeholders — never String concatenation. Logback skips formatting if the log level is disabled.

```java
LOGGER.debug("User logged in: {}", user);   // correct
LOGGER.debug("User logged in: " + user);    // wrong — concatenates even if DEBUG is off
```

---

## Dev vs Prod Configuration Strategy

Logback searches for config files in this order: `logback-test.xml` before `logback.xml`.

| File | Location | Used When | Appender | Level |
|---|---|---|---|---|
| `logback-test.xml` | `src/main/resources` | Dev (Jetty from IDE) | ConsoleAppender | DEBUG |
| `logback.xml` | `src/main/resources` | Prod (WAR in Tomcat) | RollingFileAppender | WARN/DEBUG |

`maven-war-plugin` excludes `logback-test.xml` from the WAR:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-war-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <packagingExcludes>**/logback-test.xml</packagingExcludes>
    </configuration>
</plugin>
```

---

## logback-test.xml (development)

```xml
<configuration>
    <property name="defaultPattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder><pattern>${defaultPattern:-}</pattern></encoder>
    </appender>
    <root level="DEBUG">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

---

## logback.xml (production)

Two separate log files: one for external library warnings, one for app-specific logs.

```xml
<configuration>
    <property name="defaultPattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>

    <appender name="root-appender" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <maxHistory>5</maxHistory>
            <fileNamePattern>logs/warnings.%d{yyyy-MM-dd}.log</fileNamePattern>
        </rollingPolicy>
        <encoder><pattern>${defaultPattern:-}</pattern></encoder>
    </appender>

    <appender name="paw-appender" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <maxHistory>5</maxHistory>
            <fileNamePattern>logs/paw.%d{yyyy-MM-dd}.log</fileNamePattern>
        </rollingPolicy>
        <encoder><pattern>${defaultPattern:-}</pattern></encoder>
    </appender>

    <!-- External libraries: WARN and above → warnings.YYYY-MM-DD.log -->
    <root level="WARN">
        <appender-ref ref="root-appender"/>
    </root>

    <!-- App code: DEBUG and above → paw.YYYY-MM-DD.log -->
    <logger name="ar.edu.itba" level="DEBUG" additivity="false">
        <appender-ref ref="paw-appender"/>
    </logger>
</configuration>
```

Key settings:
- `additivity="false"` — prevents the `ar.edu.itba` logger from also propagating to the root logger (avoids duplicate entries).
- `maxHistory=5` — keeps 5 rolling daily log files, then rotates.

---

## Loguear lo que hace Hibernate (en lugar de `show_sql=true`)

`hibernate.show_sql=true` imprime las queries en stdout sin pasar por logback — eso significa que en prod **siempre** loguea, no podés bajarle el nivel sin tocar la configuración de Hibernate. La forma limpia es desactivar `show_sql` y usar loggers de logback. (source: notion-teoricas-paw.md)

Snippet para `logback-test.xml` (o el dev profile):

```xml
<!-- Loguea las queries SQL generadas por Hibernate -->
<logger name="org.hibernate.SQL" level="DEBUG" additivity="false">
    <appender-ref ref="STDOUT"/>
</logger>

<!-- Loguea los parámetros bindeados a las queries -->
<logger name="org.hibernate.orm.jdbc.bind" level="DEBUG" additivity="false">
    <appender-ref ref="STDOUT"/>
</logger>
```

Loggers útiles:

| Logger | Qué loguea |
|---|---|
| `org.hibernate.SQL` | Queries SQL generadas (al equivalente de `show_sql=true`). |
| `org.hibernate.orm.jdbc.bind` | Parámetros bindeados (al equivalente de `format_sql` legible). |
| `org.hibernate.hql.internal.ast` | AST de queries JPQL (verboso — sólo para debug puntual). |
| `org.hibernate.type.descriptor.sql.BasicBinder` | Bindings (versión vieja, antes de `jdbc.bind`). |

> En producción dejar todos en `WARN` o más alto. Los DEBUG son sólo para entender qué hace Hibernate cuando estás aprendiendo o cazando un bug puntual.

---

## Dependencies (pom padre)

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.5</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.1.2</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>jcl-over-slf4j</artifactId>
    <version>1.7.5</version>
</dependency>
<dependency>
    <groupId>org.logback-extensions</groupId>
    <artifactId>logback-ext-spring</artifactId>
    <version>0.1.1</version>
    <scope>runtime</scope>
</dependency>
```

See [[AOP & Transactions]] for how logging cross-cuts are handled at the framework level.

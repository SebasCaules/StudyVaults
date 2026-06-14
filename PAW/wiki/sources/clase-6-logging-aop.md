---
title: Clase 6 — Logging parte 2 y AOP
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [logging, logback, aop, transactions, spring-tx, scheduled]
sources: [PAW - clase 6.pdf]
---

# Clase 6 — Logging parte 2 y AOP

**Archivo original:** `PAW - clase 6.pdf`

## Takeaways principales

- Dos configs de Logback: `logback-test.xml` (dev, consola) y `logback.xml` (prod, archivos).
- `maven-war-plugin` con `packagingExcludes` excluye `logback-test.xml` del WAR.
- AOP via proxies Spring: `@Transactional`, `@Scheduled`.
- Transacciones a nivel Service (no DAO) para poder rollbackear lógica de negocio.
- `@Rollback` en tests para limpiar automáticamente sin código manual.

## Notas detalladas

### Estrategia de configs de Logback

Logback busca `logback-test.xml` antes que `logback.xml`. Se aprovecha así:

| Archivo | Entorno | Contenido |
|---|---|---|
| `logback-test.xml` (en `src/main/resources`) | Dev (Jetty desde Eclipse) | ConsoleAppender, nivel DEBUG |
| `logback.xml` (en `src/main/resources`) | Prod (WAR en Tomcat) | RollingFileAppender, nivel WARN |

Maven excluye `logback-test.xml` del WAR:
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

### logback.xml producción (rolling file)

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

    <root level="WARN">
        <appender-ref ref="root-appender"/>
    </root>
    <logger name="ar.edu.itba" level="DEBUG" additivity="false">
        <appender-ref ref="paw-appender"/>
    </logger>
</configuration>
```

- Root logger en WARN (warnings de librerías externas en un archivo).
- Logger específico para `ar.edu.itba` en DEBUG (logs de la app en otro archivo).
- `additivity="false"` evita que el logger hijo también propague al root.
- `maxHistory=5` → máximo 5 archivos de log diarios, luego rota.

### Logger en código

```java
private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

// Con SecurityContextHolder para obtener usuario logueado:
@ModelAttribute
public User loggedUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    final User user = us.getByUsername((String) auth.getName());
    LOGGER.debug("Logged user is {}", user);  // NO concatenar Strings
    return user;
}
```

### AOP — Aspect Oriented Programming

Resuelve funcionalidades **cross-cutting** (transversales a la jerarquía de clases):
- Transacciones
- Logging de auditoría
- Medición de performance
- Adquirir locks

**Por qué no herencia:** los DAOs no tienen relación entre sí; herencia pondría restricciones futuras (Java solo admite herencia simple).

Spring AOP usa **proxies**:
1. Al inyectar un bean anotado, Spring crea un Proxy que decora la implementación real.
2. El Proxy cumple la misma interfaz → transparente para el resto de la app.

**Restricciones del proxy:**
- Solo intercepta métodos **públicos** (parte de la interfaz). Annotations en métodos privados son ignorados en silencio.
- Solo intercepta llamadas **desde fuera**. Si `this.metodo()` se llama dentro de la misma clase, no pasa por el proxy.

### @Transactional

Dependencia `spring-tx`:
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>${org.springframework.version}</version>
</dependency>
```

En `WebConfig`:
```java
@EnableTransactionManagement
// ...

@Bean
public PlatformTransactionManager transactionManager(final DataSource ds) {
    return new DataSourceTransactionManager(ds);
}
```

Uso en servicios:
```java
@Transactional
public class UserServiceImpl implements UserService {
    // todos los métodos públicos corren dentro de una transacción
}
```

**Transacciones a nivel Service (no DAO):** permite rollbackear si falla lógica de negocio que no opera sobre la BD (e.g., envío de mail).

### @Rollback en tests

```java
@Rollback
@Test
public void testCreate() {
    // Spring rollbackea la transacción al finalizar el test
    // No hace falta cleanup manual
}
```

### @Scheduled

```java
@Scheduled(fixedRate = 5000)
public void tareaRecurrente() {
    // Se ejecuta automáticamente cada 5 segundos
}
```

Spring ofrece múltiples annotations AOP para casos comunes.

---
title: Clase 2 — Spring Web y Maven
type: source
created: 2026-04-15
updated: 2026-04-22
tags: [spring-mvc, maven, dependency-injection, controllers]
sources: [PAW - clase 2.pdf]
---

# Clase 2 — Spring Web y Maven

**Archivo original:** `PAW - clase 2.pdf`

## Takeaways principales

- Estructura multi-módulo de Maven con `pom-root` + módulos separados para webapp, services, persistence, interfaces, model.
- `web.xml` configura el `DispatcherServlet` (Front Controller) y el contexto de Spring vía `AnnotationConfigWebApplicationContext`.
- `WebConfig` concentra la configuración MVC: `@EnableWebMvc`, `@ComponentScan`, `ViewResolver`.
- Inyección de dependencias via `@Autowired`, estereotipos `@Service`, `@Repository`, `@Controller`.
- Resolución de conflictos de beans con `@Qualifier` y `@Primary`.

## Notas detalladas

### Generación del proyecto Maven

```
mvn archetype:generate  # pom padre: org.codehaus.mojo.archetypes:pom-root
mvn archetype:generate  # webapp:   org.apache.maven.archetypes:maven-archetype-webapp
mvn archetype:generate  # otros 4:  org.apache.maven.archetypes:maven-archetype-quickstart
```

### Versión de Spring

```xml
<org.springframework.version>5.3.33</org.springframework.version>
```

### web.xml completo

```xml
<web-app id="PAW" version="2.4"
  xmlns="http://java.sun.com/xml/ns/j2ee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
    http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">

  <servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextClass</param-name>
      <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>

  <context-param>
    <param-name>contextClass</param-name>
    <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
  </context-param>
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>ar.edu.itba.paw.webapp.config.WebConfig,</param-value>
  </context-param>

  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>
</web-app>
```

### WebConfig mínimo

```java
@EnableWebMvc
@ComponentScan({ "ar.edu.itba.paw.webapp.controller" })
@Configuration
public class WebConfig {

    @Bean
    public ViewResolver viewResolver() {
        final InternalResourceViewResolver vr = new InternalResourceViewResolver();
        vr.setViewClass(JstlView.class);
        vr.setPrefix("/WEB-INF/jsp/");
        vr.setSuffix(".jsp");
        return vr;
    }
}
```

### Dependencias clave en pom padre

```xml
<!-- Servlet API -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
</dependency>
<!-- JSTL -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
```

### Scope de módulos en webapp/pom.xml

Los módulos de servicios se declaran con `<scope>runtime</scope>` para que estén en el WAR final pero no en el classpath de compilación.

### Inyección de dependencias

- `@Service` en implementación de servicio → Spring la detecta y la inyecta.
- `@Repository` en implementación de DAO.
- `@Autowired` sobre atributo o constructor.
- Conflicto de 2+ beans del mismo tipo → usar `@Qualifier("beanName")` o marcar uno con `@Primary`.

### Parámetros HTTP en controllers

```java
// Por query string: /user?userId=5
@RequestParam(value = "userId", required = true) final int id

// Por path variable: /user/5
@PathVariable final int userId   // @RequestMapping("/user/{userId}")
```

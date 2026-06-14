---
title: Clase 4 — Web Forms
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [forms, validation, jsr-303, i18n, spring-mvc, model-attribute]
sources: [PAW - clase 4.pdf]
---

# Clase 4 — Web Forms

**Archivo original:** `PAW - clase 4.pdf`

## Takeaways principales

- JSR-303 (Bean Validation) con Hibernate Validator para validar form objects.
- Form objects en paquete `ar.edu.itba.webapp.form` (propios de webapp).
- `@Valid` + `BindingResult` en controller para capturar errores de validación.
- Spring form taglib (`<form:form>`, `<form:input>`, `<form:errors>`) para binding JSP↔form.
- `MessageSource` con `ReloadableResourceBundleMessageSource` para i18n.
- `@ModelAttribute` en métodos de controller para adjuntar datos comunes a cada request.

## Notas detalladas

### Dependencias JSR-303 (pom padre)

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.4.Final</version>
</dependency>
```

### Form object

```java
// ar.edu.itba.webapp.form.UserForm
public class UserForm {
    @Size(min = 6, max = 100)
    @Pattern(regexp = "[a-zA-Z0-9]+")
    private String username;

    @Size(min = 6, max = 100)
    private String password;

    @Size(min = 6, max = 100)
    private String repeatPassword;
    // getters + setters
}
```

### Controller con validación (patrón PRG)

```java
@RequestMapping("/")
public ModelAndView index(@ModelAttribute("registerForm") final UserForm form) {
    return new ModelAndView("index");
}

@RequestMapping(value = "/create", method = RequestMethod.POST)
public ModelAndView create(
        @Valid @ModelAttribute("registerForm") final UserForm form,
        final BindingResult errors) {
    if (errors.hasErrors()) {
        return index(form);
    }
    final User u = us.create(form.getUsername(), form.getPassword());
    return new ModelAndView("redirect:/user?userId=" + u.getId());
}
```

`@Valid` dispara validación JSR-303. `BindingResult` debe ir inmediatamente después del parámetro validado. Si `hasErrors()`, se vuelve a mostrar el form con los errores preservados.

### Spring form taglib en JSP

```jsp
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<c:url value="/create" var="postPath"/>
<form:form modelAttribute="registerForm" action="${postPath}" method="post">
    <form:label path="username">Username:</form:label>
    <form:input type="text" path="username"/>
    <form:errors path="username" cssClass="formError" element="p"/>

    <form:label path="password">Password:</form:label>
    <form:input type="password" path="password"/>
    <form:errors path="password" cssClass="formError" element="p"/>

    <input type="submit" value="Register!"/>
</form:form>
```

`<form:errors>` permite customizar elemento HTML, clase CSS e inline style.

### MessageSource en WebConfig

```java
@Bean
public MessageSource messageSource() {
    final ReloadableResourceBundleMessageSource ms = new ReloadableResourceBundleMessageSource();
    ms.setBasename("classpath:i18n/messages");
    ms.setDefaultEncoding(StandardCharsets.UTF_8.displayName());
    ms.setCacheSeconds(5);
    return ms;
}
```

Jerarquía de archivos (busca el más específico primero):
1. `messages_en_US.properties`
2. `messages_en.properties`
3. `messages.properties` (default)

Formato de claves de error de validación:
- `{Annotation}` → aplica a todos los usos de esa anotación
- `{Annotation}.{ClassName}.{field}` → aplica a un campo específico

```properties
Size=El campo debe tener entre {2} y {1} caracteres
Pattern.UserForm.username=Solo se permiten letras y números
user.greeting=Hello {0}!
```

### spring:message en JSP

```jsp
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<h2><spring:message code="user.greeting" arguments="${user.username}"/></h2>
```

### @ModelAttribute en métodos (datos comunes)

```java
@ModelAttribute("userId")
public Integer loggedUser(final HttpSession session) {
    return (Integer) session.getAttribute(LOGGED_USER_ID);
}
```

Spring invoca automáticamente estos métodos en cada request del controller y agrega el resultado al modelo. Caso de uso típico: adjuntar datos del usuario logueado.

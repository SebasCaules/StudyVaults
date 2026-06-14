---
title: JSP Views
type: concept
created: 2026-04-11
updated: 2026-04-19
tags: [jsp, jstl, views, frontend, i18n, xss, security]
sources: [jstl-curated.md, devolucion-tp1.md]
---

# JSP Views

Views live in `webapp/src/main/webapp/WEB-INF/views/`. Custom tag files in `WEB-INF/tags/`.

---

## Absolute Rules

1. **NEVER** use scriptlets (`<% %>`) or Java expressions (`<%= %>`). Only JSTL + EL (`${...}`).
2. **NEVER** print user-supplied data with raw `${var}` — always use `<c:out>` to escape HTML. (XSS — error grave en TP1)

---

## XSS Prevention — `<c:out>` obligatorio

Imprimir `${user.name}` o `${product.description}` directamente en el HTML permite a un atacante inyectar scripts. **Todo** valor que provenga de la DB o del usuario debe imprimirse con `<c:out>`:

```jsp
<%-- VULNERABLE — XSS --%>
<p>${user.name}</p>
<h1>${product.title}</h1>
<td>${review.comment}</td>

<%-- SEGURO — escapa HTML entities --%>
<c:out value="${user.name}" />
<c:out value="${product.title}" />
<c:out value="${review.comment}" />
```

`<c:out>` convierte `<`, `>`, `"`, `'`, `&` en sus entidades HTML, neutralizando scripts.

Valores seguros sin `<c:out>` (controlados por la app, no por el usuario):
- URLs generadas con `<c:url>`
- Números enteros / decimales
- Booleanos
- Valores de enums que definís vos

(source: devolucion-tp1.md)

---

## spring-security-taglibs — control de acceso en JSP

No hacer chequeos manuales de roles con `c:if` + magic strings. Usar la taglib de Spring Security, que aplica las mismas reglas definidas en `WebAuthConfig`:

**Dependencia (pom padre):**
```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-taglibs</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

**Taglib en JSP:**
```jsp
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<%-- INCORRECTO — check manual con magic string --%>
<c:if test="${loggedUser.role == 'ADMIN'}">
    <a href="/admin">Panel Admin</a>
</c:if>

<%-- CORRECTO — Spring Security aplica las mismas reglas del ACL --%>
<sec:authorize access="hasRole('ADMIN')">
    <a href="/admin">Panel Admin</a>
</sec:authorize>

<%-- También podés verificar por URL (respeta el antMatchers de WebAuthConfig) --%>
<sec:authorize url="/admin">
    <a href="/admin">Panel Admin</a>
</sec:authorize>

<%-- Mostrar usuario logueado --%>
<sec:authentication property="name" />
```

(source: devolucion-tp1.md)

---

## Required Taglibs

At the top of every JSP:

```jsp
<%@ taglib prefix="c"      uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
```

---

## Static Resources — Always Use `<c:url>`

```jsp
<c:url value="/css/style.css" var="cssPath" />
<link rel="stylesheet" href="${cssPath}" />
```

Never hardcode paths. `<c:url>` handles context path automatically.

---

## Forms — `modelAttribute` Must Match Controller

```jsp
<form:form modelAttribute="registerForm" action="${postPath}" method="post">
  <form:input path="username" />
  <form:errors path="username" cssClass="formError" element="p" />
</form:form>
```

The `modelAttribute` name must match the `@ModelAttribute` name in the controller exactly.

---

## Internationalization

All user-facing text should use `<spring:message>`:

```jsp
<spring:message code="landing.howitworks.title" />
```

Messages are defined in `src/main/resources/i18n/messages.properties`.

---

## Custom Tag Files

The project has ~30 custom tags in `WEB-INF/tags/` providing reusable UI components:
- Layout: `navbar`, `footer`, `form-section`
- Typography: `h1`–`h4`, `p`
- Controls: `button`, `text-input`, `dropdown`, `calendar`
- Media: `image-carousel`, `image-upload`
- Product: `product-card`, `product-badge`, `product-attribute`, `price`, `location-card`
- Modals: `modal`, `confirm-modal`

Tags accept attributes and render consistent HTML with Bootstrap 5 styling.

See [[Views (JSP & Tags)]] for the full inventory.

---

## JSTL Core Tag Reference

Taglib declaration: `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`

### c:out — print with HTML escaping

```jsp
<c:out value="${user.name}" default="visitor" />
```

### c:if — conditional (no else branch)

```jsp
<c:if test="${user.age >= 18}">
    <p>Adult</p>
</c:if>
```

### c:choose — multi-branch conditional (switch equivalent)

```jsp
<c:choose>
    <c:when test="${score == 1}">Bad</c:when>
    <c:when test="${score == 5}">Excellent</c:when>
    <c:otherwise>Unknown</c:otherwise>
</c:choose>
```

### c:forEach — iterate over collections

```jsp
<ul>
<c:forEach var="item" items="${items}">
    <li><c:out value="${item}" /></li>
</c:forEach>
</ul>
```

### c:set — set a variable

```jsp
<c:set var="counter" value="${counter + 1}" scope="session" />
```

### c:url — generate URL with context path + params

```jsp
<c:url var="url" value="/catalog">
    <c:param name="id" value="${book.id}" />
</c:url>
<a href="${url}">View</a>
```

Prefer `c:url` over hardcoded paths — it handles context path automatically and encodes parameters.

---

## EL Quick Reference

```
${user.name}           → bean property
${user.address.city}   → nested property
${products[0]}         → indexed collection
${user.age >= 18}      → relational expression
${empty list}          → true if null, empty string, or empty collection
```

Operators: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `&&`, `||`, `!`, `empty`

---

## Custom Tag Library (SimpleTag)

When the built-in tags aren't enough, create a custom tag:

**Tag handler class:**
```java
public class MyTag extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        // tag logic — write to getJspContext().getOut()
    }
}
```

**TLD file** in `WEB-INF/`:
```xml
<taglib version="2.0" xmlns="http://java.sun.com/xml/ns/j2ee">
    <tlib-version>1.1</tlib-version>
    <short-name>my</short-name>
    <uri>http://my.app/tags</uri>
    <tag>
        <name>myTag</name>
        <tag-class>ar.edu.itba.MyTag</tag-class>
    </tag>
</taglib>
```

**Usage in JSP:**
```jsp
<%@ taglib prefix="my" uri="http://my.app/tags" %>
<my:myTag />
```

(source: jstl-curated.md)
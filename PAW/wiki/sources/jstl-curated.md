---
title: JSTL Curated — JSP, EL y JSTL
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [jsp, jstl, expression-language, views, taglib]
sources: [jstl-curated.pdf]
---

# JSTL Curated — JSP, EL y JSTL

**Archivo original:** `jstl-curated.pdf`

## Takeaways principales

- JSP combina HTML estático con contenido dinámico; se traduce a servlets.
- Scriptlets (`<% %>`) son una mala práctica — usar JSTL + EL en su lugar.
- JSP Expression Language (`${...}`) accede a beans del modelo sin código Java.
- JSTL (JSP Standard Tag Library) elimina el código Java de los JSPs.
- Custom Tag Libraries con `SimpleTag` + archivo TLD.

## Notas detalladas

### Sintaxis básica JSP

| Tipo | Sintaxis | Uso |
|---|---|---|
| Comentario | `<%-- ... --%>` | No aparece en HTML generado |
| Expresión | `<%= expr %>` | Evalúa y envía a salida |
| Scriptlet | `<% código %>` | Ejecuta código Java (evitar) |
| Declaración | `<%! campo/método %>` | Parte de la clase del servlet |
| Directiva | `<%@ ... %>` | Configuración de la página |
| Acción | `<jsp:xyz>` | Acciones en cada request |

### Directivas JSP

- `page`: `<%@ page import="java.util.*" %>`, `<%@ page contentType="text/html" %>`, `<%@ page session="true" %>`
- `include`: `<%@ include file="header.jsp" %>` — inserta en traducción (como `#include` de C)
- `taglib`: `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`

### Variables predefinidas en JSP

`request`, `response`, `session`, `out`, `application` (ServletContext)

### JSP Expression Language (EL)

```
${user.name}                    → propiedad simple
${user.address.city}            → propiedad anidada
${products[0]}                  → colección indexada
${user.age >= 18}               → operación relacional
${empty list}                   → true si null, string vacío, o colección vacía
```

Operadores: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `&&`, `||`, `!`, `empty`

### JSTL Core (`<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`)

**`c:out`** — imprime con escape de HTML:
```jsp
<c:out value="${user.name}" default="visita" />
```

**`c:if`** — condicional sin else:
```jsp
<c:if test="${user.age >= 18}">
    <p>Mayor de edad</p>
</c:if>
```

**`c:choose`** — condicional con múltiples ramas (switch equivalente):
```jsp
<c:choose>
    <c:when test="${score == 1}">MALO</c:when>
    <c:when test="${score == 5}">EXCELENTE</c:when>
    <c:otherwise>Valor desconocido</c:otherwise>
</c:choose>
```

**`c:forEach`** — iteración sobre colecciones:
```jsp
<ul>
<c:forEach var="message" items="${messages}">
    <li><c:out value="${message}" /></li>
</c:forEach>
</ul>
```

**`c:set`** — establece valor de variable:
```jsp
<c:set var="inc" value="${miVariable + 1}" />
<c:set var="cantAccesos" value="${cantAccesos + 1}" scope="session" />
```

**`c:url`** — genera URL con parámetros (importante: maneja context path):
```jsp
<c:url var="url" value="/catalog">
    <c:param name="id" value="${book.id}" />
</c:url>
<a href="${url}">Ver</a>
```

### Otros grupos de tags JSTL

| Grupo | Uso |
|---|---|
| `xml` | Procesamiento de documentos XML |
| `i18n` | Internacionalización y formato |
| `database` | Acceso a bases de datos (evitar en Spring MVC) |
| `functions` | Manipulación de colecciones y strings |

### Custom Tag Library

**Tag Handler Class:**
```java
public class MiTag extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        // lógica del tag
    }
}
```

**TLD (Tag Library Descriptor)** en `WEB-INF/`:
```xml
<taglib version="2.0" xmlns="http://java.sun.com/xml/ns/j2ee">
    <tlib-version>1.1</tlib-version>
    <short-name>mi</short-name>
    <uri>http://mi.app/tags</uri>
    <tag>
        <name>miTag</name>
        <tag-class>ar.edu.itba.MiTag</tag-class>
    </tag>
</taglib>
```

### Ventajas de JSTL sobre scriptlets

- Evita código Java en JSPs.
- Simplifica operaciones comunes.
- Compatible con JSP EL.
- JSPs más legibles y mantenibles.

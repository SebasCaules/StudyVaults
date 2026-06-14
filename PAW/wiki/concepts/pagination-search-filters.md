---
title: Paginación, Filtros y Búsqueda
type: concept
created: 2026-04-19
updated: 2026-05-12
tags: [paginacion, filtros, busqueda, query-params, forms, state, jpa, hibernate]
sources: [sprint-2-indicaciones.md, hibernate-pt2.md]
---

# Paginación, Filtros y Búsqueda

La searchbar, los filtros y la paginación son tres formularios independientes que deben **mantener el estado de los otros dos**. Este patrón se aplica en el catálogo.

> **Persistencia con JPA**: cuando los DAOs migren a JPA, **NO usar `setFirstResult/setMaxResults` directo sobre entidades** con relaciones. Es razón de no-aprobación del próximo TP. Ver [[Hibernate & JPA]] → "Paginación con JPA — patrón 1+1 queries" y [[Hibernate pt2 — Relaciones, Lazy, OpenEntityManagerInView, Paginación 1+1]] para el patrón obligatorio (native query para ids + JPQL `WHERE id IN :ids ORDER BY ...`).

---

## Reglas de estado

| Acción del usuario | Comportamiento esperado |
|--------------------|------------------------|
| Cambia un filtro | Resetear paginación a página 1; mantener búsqueda |
| Cambia la búsqueda | Resetear paginación a página 1; mantener filtros |
| Cambia de página | Mantener filtros y búsqueda |
| Recarga la página | Volver al mismo estado (paginación en URL) |

**La paginación siempre impacta en la URL.** Nunca manejar el número de página sólo con JS/estado interno.

---

## Validación de query parameters

Este flujo usa GET (no POST), por lo que no aplica Spring form binding ni `@Valid`. Los query params se validan **manualmente en el controller**:

```java
@GetMapping("/catalog")
public ModelAndView catalog(
        @RequestParam(defaultValue = "") String query,
        @RequestParam(required = false) String location,
        @RequestParam(defaultValue = "1") int page) {

    // Clampear página al rango válido
    int totalPages = productService.getPageCount(query, location);
    if (page < 1) page = 1;
    if (page > totalPages && totalPages > 0) page = totalPages;

    // Parámetros inválidos (ej: location que no existe en el enum) → ignorar o página 1
    Location loc = null;
    if (location != null) {
        try { loc = Location.valueOf(location.toUpperCase()); }
        catch (IllegalArgumentException e) { /* ignorar filtro inválido */ }
    }

    ModelAndView mav = new ModelAndView("catalog/catalog");
    mav.addObject("products", productService.findFiltered(query, loc, page));
    mav.addObject("currentPage", page);
    mav.addObject("totalPages", totalPages);
    mav.addObject("query", query);
    mav.addObject("location", location);
    return mav;
}
```

---

## Enfoque A: Un form con campos ocultos (recomendado)

Un solo `<form>` que incluye campos `hidden` para el estado de los otros formularios. Permite usar custom validators de Spring.

```jsp
<%-- Formulario de búsqueda con filtros y paginación como campos hidden --%>
<form method="get" action="<c:url value='/catalog'/>">
    <%-- Búsqueda --%>
    <input type="text" name="query" value="<c:out value='${query}'/>"/>

    <%-- Filtros como hidden (el filtro real está en otro form o select fuera) --%>
    <input type="hidden" name="location" value="<c:out value='${location}'/>"/>
    <input type="hidden" name="page" value="1"/> <%-- resetea a 1 al buscar --%>
    <button type="submit">Buscar</button>
</form>

<%-- Formulario de filtros --%>
<form method="get" action="<c:url value='/catalog'/>">
    <input type="hidden" name="query" value="<c:out value='${query}'/>"/>
    <input type="hidden" name="page" value="1"/> <%-- resetea a 1 al filtrar --%>

    <select name="location" onchange="this.form.submit()">
        <option value="">Todas las ubicaciones</option>
        <c:forEach var="loc" items="${locations}">
            <option value="${loc.name()}"
                <c:if test="${loc.name() == location}">selected</c:if>>
                <c:out value="${loc.displayName}"/>
            </option>
        </c:forEach>
    </select>
</form>

<%-- Paginación --%>
<c:if test="${totalPages > 1}">
    <c:forEach begin="1" end="${totalPages}" var="p">
        <c:url value="/catalog" var="pageUrl">
            <c:param name="query" value="${query}"/>
            <c:param name="location" value="${location}"/>
            <c:param name="page" value="${p}"/>
        </c:url>
        <a href="${pageUrl}" <c:if test="${p == currentPage}">class="active"</c:if>>
            <c:out value="${p}"/>
        </a>
    </c:forEach>
</c:if>
```

---

## Enfoque B: JS (no recomendado para este proyecto)

JS mantiene el estado en memoria y recarga la página con los parámetros correctos al cambiar cualquier control. **Desventaja**: se pierde la posibilidad de usar Spring validators del lado del servidor.

---

## Location como query param (no path variable)

A partir del Sprint 2, la ubicación pasa de ser path variable a query parameter:

```
// Sprint 1 — path variable (ya no)
GET /catalog/bariloche

// Sprint 2 — query param
GET /catalog?location=BARILOCHE&query=skis&page=1
```

Esto simplifica el routing y permite que todos los filtros sean opcionales con el mismo endpoint.

---

## Catálogo — sólo mostrar productos ACTIVE

```java
// En el DAO, el filtro de búsqueda debe incluir status = 'ACTIVE'
public List<Product> findFiltered(String query, Location location, int page) {
    // WHERE status = 'ACTIVE' AND (title ILIKE ? OR description ILIKE ?)
    // AND (location = ? OR ? IS NULL)
    // LIMIT ? OFFSET ?
}
```

(source: sprint-2-indicaciones.md)

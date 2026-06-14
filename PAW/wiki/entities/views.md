---
title: Views (JSP & Tags)
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [jsp, views, frontend, tags, bootstrap, i18n]
sources: []
---

# Views (JSP & Tags)

Inventario actual: **25 JSP páginas** + **~37 custom tags** en `webapp/src/main/webapp/WEB-INF/` (se eliminaron `admin-report-badge.tag`, `empty-state.tag` y `user-avatar.tag` por desuso). Frontend con Bootstrap 5.3.8 (CDN). Bootstrap JS vive **únicamente en `footer.tag`** desde commit `9fbb6ae4` — antes había duplicación en 24 JSPs.

## Páginas (`WEB-INF/views/`)

### Public
- `landing/landing.jsp` — hero + cards de ubicaciones + "cómo funciona".
- `catalog/catalog.jsp` — grilla paginada con searchbar + filtros (3 forms con hidden fields que preservan estado).

### Auth
- `auth/login.jsp`, `auth/register.jsp`.
- `auth/verify-email-sent.jsp`, `auth/verify-email-invalid.jsp`.
- `auth/reset-password.jsp`, `auth/reset-password-invalid.jsp`.
- `auth/admin-invite-invalid.jsp` (#20) — pantalla de error cuando el token de invitación admin es inválido o expiró. El flujo de invitación admin **no tiene controller/vista dedicada**: usa `GET /register?email=...&token=...` que prellenan `RegisterForm`; solo la pantalla de error es nueva. Ver [[Admin Invite Flow]].

### Producto
- `products/detail.jsp` — carousel, calendar tag con bloques + precios efectivos por rango, modal de rent.
- `publish/publishProduct.jsp` — multi-section form con drag-drop de imágenes y category→size dinámico.
- `edit/editProduct.jsp` — edita producto + manage de precios (default + especiales con rangos).

### Renter / Provider
- `my-listings/products.jsp` — grilla de productos del provider con badge de status + acciones pause/resume/delete.
- `dashboard/rents-list.jsp` — vista única reusable que renderiza el dashboard agrupado por `RentDashboardCategory` (lo usan `/dashboard/my-rents` y `/dashboard/my-products-rents`).
- `rent/manage.jsp` — manage de la rent (renter o provider según rol resuelto en el service); subviews por `RentStatus` con acciones específicas.
- `rent/review.jsp` — form de review (1×rent).
- `favorites/favorites.jsp` — listado de favoritos.

### Profile / Admin
- `profile/index.jsp` — granular (un form por field con su propio submit).
- `admin/users.jsp`, `admin/products.jsp` — panel admin.

### Layout / Errores
- `layout/head.jsp` — shared `<head>` con CSS y meta.
- `error/{400,403,404,413,500}.jsp` — páginas con tema "ski" del proyecto.

## Custom tags (`WEB-INF/tags/`, ~37 totales)

### Layout / chrome
`navbar.tag`, `auth-navbar.tag`, `footer.tag` (incluye Bootstrap JS 1×), `theme-toggle.tag`, `lang-toggle.tag`.

### Tipografía / inputs
`h1.tag`–`h4.tag`, `p.tag`, `text-input.tag`, `button.tag`, `dropdown.tag`, `form-section.tag`.

### Producto
`product-card.tag`, `product-badge.tag`, `product-attribute.tag`, `product-attributes-grid.tag`, `product-attribute-total.tag`, `product-details-fields.tag`, `product-images-section.tag`, `image-carousel.tag`, `image-gallery.tag`, `image-upload.tag`.

### Catálogo / paginación
`search-bar.tag`, `pagination.tag`, `filter-panel.tag`, `filter-section.tag`, `filter-checkbox.tag`, `location-card.tag`.

### Rent
`calendar.tag` — picker con bloques + precios efectivos por rango (recibe JSON desde controller).
`rent-card.tag`, `rent-tabs.tag`, `rent-status-badge.tag`, `rent-action-panel.tag`, `rent-total-price.tag`.

### UX
`modal.tag`, `confirm-modal.tag`, `feedback-modal.tag`, `price.tag`.

> Convención: si una pieza de UI es reusable con parámetros, va a tag file. Si es solo estructura repetida sin parámetros, `<%@ include %>` también es válido.

## Reglas absolutas (corrector tolera cero)

1. **NUNCA** scriptlets (`<% %>`) ni expresiones Java (`<%= %>`).
2. **NUNCA** imprimir datos de usuario/DB con `${var}` directo — siempre `<c:out value="${...}"/>`.
3. **NUNCA** hardcodear paths/URLs — `<c:url value='/...'/>`.
4. **NUNCA** hardcodear textos visibles — `<spring:message code='...'/>`.
5. **NUNCA** chequear roles con `c:if + magic strings` — `<sec:authorize>`.
6. **NUNCA** lógica de negocio en JSP (filter, sort, dedupe, etc.).

## i18n

`webapp/src/main/resources/i18n/`:
- `messages.properties` (default, español)
- `messages_es.properties` (vacío, hereda — convención del equipo: el archivo del locale soportado siempre presente)
- `messages_en.properties` (inglés completo)
- `messages_fr.properties` (francés)

`MessageSource` cargado en `WebConfig` como `ReloadableResourceBundleMessageSource` con basename `classpath:i18n/messages` y soporte para ICU MessageFormat (pluralización).

Mails usan **`recipient.getPreferredLanguage()`** — nunca `LocaleContextHolder.getLocale()` (sería el del actor, no del destinatario).

Locale change interceptor agregado en `WebConfig` (commit `3f16efce`) — el toggle del idioma persiste en sesión.

## CSS

`webapp/src/main/webapp/css/`: `colors.css` (paleta), `components.css` (utility classes propias), assets en `webapp/src/main/webapp/assets/`. Reglas: nada de `!important`, nada de `<style>` inline en JSP.

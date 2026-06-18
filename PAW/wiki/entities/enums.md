---
title: Enums
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [enums, domain, models]
sources: [sprint-2-indicaciones.md]
---

# Enums

Inventario actual: **18 enums** en `ar.edu.itba.paw.models.enums`. Display names en español. Persistidos como `.name()` (string exacto) y restaurados con `valueOf()`.

## Inventario

| Enum | Implementa | Uso |
|---|---|---|
| `Category` | `HasDisplayName`, `HasSlug` | Tipo de producto (14 valores agrupados por `CategoryGroup`) |
| `CategoryGroup` | `HasDisplayName` | Familia de Category (CLOTHING / EQUIPMENT / FOOTWEAR / ACCESSORIES) |
| `Size` | `HasDisplayName` | Talles ropa (XXS-XXL) y calzado (EU 36-48 con medios). `isValidFor(Category)` |
| `Condition` | `HasDisplayName` | NEW, LIKE_NEW, GOOD, FAIR |
| `Gender` | `HasDisplayName` | MEN, WOMEN, UNISEX |
| `Currency` | `HasDisplayName` | USD, ARS, EUR |
| `Location` | `HasDisplayName`, `HasSlug` | Centros de ski (BARILOCHE, SAN_MARTIN, MENDOZA, USHUAIA, etc.) |
| `ProductStatus` | `HasDisplayName`, `HasSlug` | ACTIVE, PAUSED, DELETED, PENDING_LOCATION, UNDER_REVIEW |
| `PaymentMethod` | `HasDisplayName` | UPLOAD (comprobante adjunto, default), CASH (pago coordinado fuera de la plataforma; escape hatch para cuando el provider no tiene CBU — Issue #10) |
| `RentStatus` | `HasDisplayName`, `HasSlug` | 10 valores (ver tabla abajo) |
| `RentDashboardCategory` | `HasDisplayName` | Bucket de RentStatus para el dashboard: ACTIVE / FINISHED / REJECTED / EXPIRED |
| `FinishedDashboardRow` | — | Vista del row de "alquileres terminados" en el dashboard |
| `CatalogOrderBy` | `HasDisplayName` | Opciones de ordenamiento del catálogo (price asc/desc, recent, etc.) |
| `OrderDirection` | — | ASC / DESC reusable |
| `IdentityChoice` | — | Flujo de registro post-guest (KEEP_GUEST_DATA, USE_FORM_DATA) |
| `UserRole` | — | USER, ADMIN. Usado por Spring Security (`ROLE_<value>`) |
| `HasDisplayName` | interface | Contrato `getDisplayName()` para UI |
| `HasSlug` | interface | Contrato `getSlug()` + helper estático `fromSlug(...)` para URLs |

## RentStatus — 10 valores y dashboard category

| Value | Slug | Display | Dashboard Category |
|---|---|---|---|
| `PENDING` | pending | Pendiente | ACTIVE |
| `APPROVED` | approved | Aprobado | ACTIVE |
| `PAYMENT_PENDING` | payment-pending | Pago pendiente | ACTIVE |
| `PAYMENT_ACCEPTED` | payment-accepted | Pago aceptado | FINISHED |
| `REJECTED` | rejected | Rechazado | REJECTED |
| `CANCELLED` | cancelled | Cancelado | REJECTED |
| `PAYMENT_CANCELLED` | payment-cancelled | Pago rechazado | REJECTED |
| `EXPIRED` | expired | Expirado | EXPIRED |
| `PAYMENT_EXPIRED` | payment-expired | Pago expirado | EXPIRED |
| `PAYMENT_ACCEPTANCE_EXPIRED` | payment-acceptance-expired | Aceptación de pago caducada | EXPIRED |

Helpers: `isRejected()`, `isExpired()`, `isCompleted()`, `isFinal()`. `valuesForDashboardCategory(category)` filtra el subset.

> El enum creció de 4 valores (Sprint 1) a 10 (Sprint 2) para soportar el flujo de pago + expiraciones automáticas. Ver [[Sprint 2 — Roadmap del Proyecto]].

## Category — los 14 valores agrupados

| Group | Categorías |
|---|---|
| CLOTHING | JACKET, PANTS, BASE_LAYER, MID_LAYER, SNOWSUIT, VEST |
| EQUIPMENT | SKIS, SKI_POLES, SNOWBOARD |
| FOOTWEAR | SKI_BOOTS, SNOWBOARD_BOOTS |
| ACCESSORIES | GLOVES, HELMET, GOGGLES |

`Category.usesSize()` retorna true para CLOTHING + FOOTWEAR. Validado en form via `@ProductSizeForCategory` → `ProductService.validateSizeForCategory`.

## Size

- Clothing: XXS, XS, S, M, L, XL, XXL.
- Footwear (EU): 36 ... 48 con medios → 25 valores.
- Equipment / Accessories: `null` obligatorio.

Helper estático `Size.isValidFor(Category)` enforced en service.

## Convenciones

- `enum.name()` para persistir y para HTTP / forms (matchea exactamente el string en BD).
- `enum.getDisplayName()` para UI.
- Slugs URL via `HasSlug`: `/{enum-slug}` se decodifica con el helper estático `fromSlug(slug, values(), "label")`.

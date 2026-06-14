---
title: Domain Models
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [models, domain, java, immutable, exceptions]
sources: [sprint-2-indicaciones.md]
---

# Domain Models

Inventario actual: **12 clases** en `models` (`ar.edu.itba.paw.models`) + **18 enums** en `models.enums` + **4 excepciones** en `models.exception`. Las entidades persistidas son **JPA entities** (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`): fields no-`final`, constructor no-arg `protected`, y setters donde el service necesita mutar (e.g. hidratar campos `@Transient` derivados como `Product.images` / `Product.effectivePrice`). `User` conserva el **builder** (es la única con muchos campos opcionales). La superficie de mutación queda en services — controllers y vistas nunca modifican estado de la entidad.

> Ver [[Hibernate & JPA]] para los patrones de mapeo, lazy/eager fetching y paginación 1+1 queries.

## Inventario

### Entidades persistidas

| Modelo | Tabla | Notas |
|---|---|---|
| `User` | `users` | Builder pattern. Campos: id, name, surname, email, password, profilePictureId, address, availabilityFrom/To, verified, verificationToken (+expiration, +issuedAt), resetToken (+expiration), preferredLanguage, cbu, role, enabled, deactivatedAt, deactivatedByUserId, deactivationReason, invitedAsAdmin, adminInviteToken, adminInviteExpiresAt (#20) |
| `Product` | `products` | id, providerId, title, description, location, condition, size (nullable), brand, gender, category, status (ACTIVE/PAUSED/DELETED/PENDING_LOCATION/UNDER_REVIEW), statusBeforeReview, images, prices |
| `Image` | `images` | id, bytes, position |
| `Block` | `blocks` | id, blockFrom, blockTo, productId |
| `Price` | `prices` | id, productId, amount, currency, priceFrom, priceTo (nullable → es default si NULL) |
| `Rent` | `rents` | id, product, block, renter, status, paymentImage (nullable), price, reminderSent, totalPrice, currency, paymentMethod (UPLOAD/CASH — Issue #10) |
| `Review` | `reviews` | id, rentId, productId, renterId, rating, comment, createdAt |

### View / DTO models en `models/`

- `BlockedDateRange` — proyección para el calendario JS del detalle de producto (rangos sin info de rent).
- `ReviewView` — review enriquecida con datos del producto/renter para listados.
- `SpecialPriceView` — precio especial con info derivada para edit form.
- `CatalogCriteria` — bag de filtros del catálogo (location, categories, condition, gender, size, currency, price range, query, orderBy). Usado por `ProductJdbcDao.findFiltered`.
- `Page<T>` — wrapper genérico de paginación (`pageNumber`, `pageSize`, `totalCount`, `content`).

## User — campos por sección

| Sección | Campos |
|---|---|
| Identidad | id, name, surname, email, password |
| Profile | profilePictureId, address, availabilityFrom, availabilityTo, cbu |
| Verificación email | verified, verificationToken, verificationTokenExpiration, verificationTokenIssuedAt |
| Reset password | resetToken, resetTokenExpiration |
| Preferencias | preferredLanguage |
| Auth | role (`UserRole.USER` por default, `UserRole.ADMIN` para admin) |
| Admin invite (#20) | invitedAsAdmin, adminInviteToken (UNIQUE), adminInviteExpiresAt — flujo de invitación admin con TTL 7d single-use |
| Deactivation | enabled, deactivatedAt, deactivatedByUserId, deactivationReason — soporte de desactivación admin |

`User.builder().id(...)... build()` es la API canónica. `User.withCredentials(...)` es un atajo para el caso post-registro.

## Excepciones

### `ar.edu.itba.paw.models.exception` (validación de dominio crudo)
Solo 4 excepciones — el resto migró a `services.exceptions`:

- `EmailAlreadyUsedException`
- `InvalidEmailException`
- `InvalidSizeForCategoryException`
- `InvalidUserException`

### `ar.edu.itba.paw.services.exceptions` (cross-layer, en `service-contracts`)
15 excepciones — ver [[Services]] y [[Controllers]] para el listado y mapeo HTTP. Las nuevas: `InvalidAdminInviteTokenException` (#20, mapea 410 GONE) y `ProviderCbuRequiredException` (#10, mapea 409 CONFLICT).

> El movimiento sostenido durante Sprint 2 fue **sacar** excepciones de `models.exception` y centralizarlas en `services.exceptions` para que no rompan la regla "models no depende de Spring ni del framework de excepciones HTTP". Sólo las que son puramente de validación de constructor del modelo viven todavía en `models.exception`.

## Reglas de mutabilidad (JPA)

- Entidades JPA: fields no-`final`, constructor no-arg `protected` (Hibernate accede por reflection).
- Setters presentes donde el service necesita mutar (incluye hidratar campos `@Transient` derivados como `Product.images`, `Product.effectivePrice`).
- La superficie de mutación queda en services — **controllers y vistas nunca modifican estado de la entidad directamente**.
- Updates: relying en dirty checking de Hibernate dentro de la transacción del service.
- `equals` / `hashCode` por `id` cuando aplica (User, Product) — útil para tests con `assertEquals(expected, actual)`.

## Invariantes de dominio (enforcement en form/service)

| Invariante | Enforced en | Implicación |
|---|---|---|
| Cada `Product` siempre tiene al menos un default `Price` | publish/edit form + `populator.sql` | Tests no construyen productos sin precio |
| `Category.usesSize()` (CLOTHING/FOOTWEAR) ⇒ size no-null | `ProductSizeForCategoryValidator` → `ProductService.validateSizeForCategory` | Fixture imposible: `JACKET` sin size |
| ACCESSORIES/EQUIPMENT ⇒ size = null | mismo validator | Fixture imposible: `HELMET` con size |
| 1 review por rent | `ReviewJdbcDao` UNIQUE + `AlreadyReviewedException` en service | — |
| Rent sólo se reviewable si terminó | `RentPeriodNotEndedException` | — |

Ver `docs/domain-and-layering.md` (proyecto) para la versión expandida.

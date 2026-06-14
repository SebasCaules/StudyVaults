---
title: Services
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [services, business-logic, spring, transactions]
sources: []
---

# Services

Inventario actual: **12 service interfaces** en `service-contracts` (`ar.edu.itba.paw.services`) + **13 implementations** en `services` (incluye `AdminBootstrap` que no tiene interface — corre `@PostConstruct` para crear el admin de fixture). Todos `@Service`, todos con constructor injection, todos con `@Transactional` por método.

## Inventario

| Service | Implementación | Foco |
|---|---|---|
| `UserService` | `UserServiceImpl` | Cuentas, password hashing, builder a partir de `RegisterForm`, ownership de profile |
| `EmailVerificationService` | `EmailVerificationServiceImpl` | Tokens de verificación con expiración + cooldown |
| `PasswordResetService` | `PasswordResetServiceImpl` | Tokens de reset, validación, expiración |
| `EmailService` | `EmailServiceImpl` | SMTP `@Async` con locale del **destinatario** |
| `ProductService` | `ProductServiceImpl` | CRUD, ownership, búsqueda paginada, `validateSizeForCategory` |
| `ProductImageService` | `ProductImageServiceImpl` | Asociación producto ↔ imágenes (junction `product_images`) |
| `PriceService` | `PriceServiceImpl` | Precio default + especiales con rangos, `getCurrentPrice`, validación de overlap |
| `BlockService` | `BlockServiceImpl` | Date-blocks de un producto |
| `RentService` | `RentServiceImpl` | Crear rent, ownership, transiciones de `RentStatus`, dashboards agrupados, expiración automática |
| `ReviewService` | `ReviewServiceImpl` | Reviews 1×rent, agregados por producto |
| `FavoriteService` | `FavoriteServiceImpl` | Toggle + listado, `showFavoriteStatus` para vistas |
| `ImageService` | `ImageServiceImpl` | Wrapper sobre `ImageJdbcDao` |
| — | `AdminBootstrap` | `@PostConstruct` que asegura un usuario admin con `UserRole.ADMIN` |

## Excepciones del paquete `services.exceptions`

15 excepciones cross-layer en `service-contracts/.../services/exceptions/`. Todas extienden `RuntimeException`:

`AlreadyReviewedException`, `CurrentPriceNotFoundException`, `ForbiddenException`, `IdentityConflictException`, `InvalidAdminInviteTokenException` (#20), `InvalidPasswordResetTokenException`, `InvalidRentStateException`, `InvalidVerificationTokenException`, `NoPriceForRentRangeException`, `ProviderCbuRequiredException` (#10), `RentNotFoundException`, `RentPeriodNotEndedException`, `ResourceNotFoundException`, `VerificationCooldownException`.

El mapeo HTTP vive en `GlobalExceptionHandler` (ver [[Controllers]]).

## DTOs en `services.dto`

- `RentData` — agregado para listar rents en dashboards (rent + product + price).
- `RentEmailPayload` — datos resueltos para el `EmailService` (locale, totals, urls). Construido en webapp/service y pasado al `@Async` para evitar `ThreadLocal`.
- `SpecialPriceDto` — comunicación entre form de edit y `PriceService` para precios especiales.

## Notas por service

### UserService
Métodos clave:
- `register(form)` — valida email único (delegado al validator), hashea password, persiste, dispara verificación (genera token + manda mail).
- `findByEmail(email)`, `findById(id)`.
- `updatePassword`, `updateName`, `updateSurname`, `updateAddress`, `updateAvailability`, `updateCbu`, `updateProfilePicture` — uno por field, granular como las forms.
- `completeGuestRegistration(...)` — completa el row creado durante una rent request.
- `inviteAdmin(actor, email, locale)` (#20) — crea stub user con `invited_as_admin=true` + UUID token + expiration 7d, manda mail con `/register?email=...&token=...`. Retorna `AdminInviteResult` enum (ALREADY_ADMIN, PROMOTED, INVITED).
- `registerOrLinkGuest(form, adminInviteToken)` (#20) — completa registro de stub user; si `invited_as_admin=true`, exige token matching no-expirado (else `InvalidAdminInviteTokenException`); en éxito promociona a ADMIN y consume el token (single-use clear). Ver [[Admin Invite Flow]].

### EmailVerificationService
- `issueToken(userId)` con cooldown configurable (`VerificationCooldownException` si se pide reenvío demasiado pronto).
- `verify(token)` valida + marca `verified=true`, lanza `InvalidVerificationTokenException`.

### PasswordResetService
Mismo patrón con `resetToken` y expiración: `requestReset(email)` (no leakea si el email existe o no), `resetPassword(token, newPassword)`.

### EmailService
- Todos los métodos públicos `@Async`.
- Locale del **destinatario** (`recipient.getPreferredLanguage()`), nunca `LocaleContextHolder.getLocale()`.
- `try/catch (RuntimeException e)` con `LOGGER.error` adentro — `@Async` se traga las excepciones.
- Templates resueltos como `String` antes de pasar al service (no referencia a `webapp/WEB-INF/`).
- Métodos: `sendVerificationEmail`, `sendPasswordResetEmail`, `sendRentRequestEmail`, `sendRentDecisionEmail`, `sendPaymentInitiatedEmail`, `sendPaymentDecisionEmail`, etc.

### ProductService
- `validateSizeForCategory(size, category)` — única fuente de verdad para "talle es válido para la categoría". Llamado desde `ProductSizeForCategoryValidator`.
- `findFiltered(CatalogCriteria, page, pageSize)` → `Page<Product>` con filtros + ordering + búsqueda.
- `findOwnedBy(productId, userId)` — ownership (404/403).
- `updateStatus(productId, userId, status)` — pause/resume/delete.
- `getProductsByProvider(providerId, filters, page, pageSize)` — variante filtrada (status/category/search query) para `MyListingsController`; `DELETED` siempre excluido.
- `activatePendingForLocation(location)` — cascada de activación cuando admin aprueba una Location: pasa todos los productos de esa location de PENDING_LOCATION → ACTIVE. Invocado desde `LocationService.approve`.

### LocationService
- Métodos admin con `@PreAuthorize` (proposal/approval/rejection de nuevas locations).
- `approve(locationId, adminId)` — marca la location como aprobada y dispara `productService.activatePendingForLocation(location)` para activar en cascada los productos que estaban esperando.

### PriceService
Modelo de **precio default + precios especiales** (Sprint 2):
- `getCurrentPrice(productId)` — el default vigente hoy.
- `getEffectivePriceFor(productId, date)` — especial si hay rango cubriendo, sino default.
- `getEffectivePricesForRange(productId, from, to)` — colapsa default+especiales para el calendario del rent.
- `addSpecialPrice`, `removeSpecialPrice`, `replaceDefaultPrice` — usados desde edit.
- Validación `NoOverlappingSpecialPricesValidator` + `NoSpecialMatchingDefaultValidator` chequean en el form.

### RentService
- `createRent(form, renterId)` — crea block + rent en una transacción, dispara mail.
- `findOwnedByProvider(rentId, providerId)`, `findOwnedByRenter(rentId, renterId)` — ownership 404/403.
- Transiciones de estado (`InvalidRentStateException` si no es válida): `respondAsProvider(accepted)`, `initiatePayment(rentId, PaymentMethod, byte[])` (Issue #10 — branchea: UPLOAD persiste Image + `payment_method=UPLOAD`; CASH skip image + `payment_method=CASH`), `acceptPayment`, `cancelPayment`, `cancel`.
- `approveRent(rentId, providerId)` — gates en `provider.cbu` no-blank (Issue #10); si está vacío tira `ProviderCbuRequiredException` (409) y no aprueba — defensa para no crear rents no-cancelables.
- `initiateReturn(rentId, renterId)` — chequea que la fecha actual sea posterior al `block.blockTo` antes de permitir la transición.
- Dashboards: `groupRentsByCategory(userId, asProvider)` retorna mapa `RentDashboardCategory → List<RentData>` — la lógica de grouping vivía en el controller y se movió al service (commit `28a975f7`).
- Expiración automática: jobs `@Scheduled` marcan `EXPIRED`, `PAYMENT_EXPIRED`, `PAYMENT_ACCEPTANCE_EXPIRED` cuando vence el plazo.

### ReviewService
- 1 review por rent — `AlreadyReviewedException` si se intenta de nuevo.
- `RentPeriodNotEndedException` si la rent todavía no terminó.
- Agregados (avg + count) por producto.

### FavoriteService
- `toggleFavorite(productId, userId)`, `isFavorite(productId, userId)`, `findByUser(userId)`.
- Validación: no podés favoritear tu propio producto (chequeo en service).
- `showFavoriteStatus(product, loggedUser)` — antes vivía en el controller, ahora en el service (commit `a4b6f177`).

## Reglas de transacciones

`@Transactional(readOnly = true)` para lecturas, `@Transactional` para escrituras. Nunca a nivel de clase. Anotación por método para que la intención sea explícita. Ver [[AOP & Transactions]].

## Reglas de capa

- Un service inyecta solo su DAO + otros **services** (nunca DAO de otro dominio).
- Toda lógica de negocio acá; los controllers solo coordinan.
- Métodos `void` que disparan side-effects (mails) deberían retornar el objeto creado o un `boolean` para poder testearse sin `Mockito.verify` — ver [[Testing Practices]].

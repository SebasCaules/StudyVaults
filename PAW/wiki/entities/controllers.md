---
title: Controllers
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [controllers, spring-mvc, webapp, auth, forms]
sources: []
---

# Controllers

Inventario actual: **~16 controllers** en `ar.edu.itba.paw.webapp.controller` + **5 `@ControllerAdvice`** clases. Todos dependen exclusivamente de las interfaces de `service-contracts`. El usuario logueado se inyecta como `@ModelAttribute("loggedUser") final User loggedUser`, populado por [[#CurrentUserAdvice]].

## Inventario

| Controller | Base path | Resumen |
|---|---|---|
| `LandingController` | `/` | Home page |
| `CatalogController` | `/catalog` | Catálogo paginado por filtros + searchbar |
| `ProductController` | `/products/{id}` | Detalle, blocked dates JSON, POST `/rent` |
| `PublishProductController` | `/publish` | Publicar producto + upload de imágenes |
| `EditProductController` | `/products/{id}/edit` + `/status` | Editar producto, cambiar `ProductStatus` |
| `MyListingsController` | `/my-listings` | Productos del provider |
| `LoginController` | `/login`, `/register` | Login + auto-login post-registro |
| `VerifyEmailController` | `/verify-email`, `/verify-email/resend`, `/verify-email/sent` | Confirmación de email + cooldown de reenvío |
| `PasswordResetController` | `/forgot-password`, `/reset-password` | Reset de contraseña por token |
| `ProfileController` | `/profile`, `/profile/{photo,password,name,surname,address,availability,cbu}` | Self-service de datos personales (granular por campo) |
| `RentRequestController` | `/rents/{rentId}` + sub-acciones | Manage de la rent (respond, initiate-payment, accept-payment, cancel, cancel-payment, review) |
| `DashboardController` | `/dashboard/my-rents`, `/dashboard/my-products-rents` | Dashboards renter / provider con grouping por categoría |
| `FavoritesController` | `/favorites`, `/favorites/{productId}/{add,remove}` | Listado y toggle de favoritos |
| `ImageController` | `/images/{id}` | Sirve `byte[]` JPEG con cache de 30 días |
| `AdminController` | `/admin/**` | Panel admin: promote/demote usuarios, reset password, pausar/resumir/eliminar productos |
| `ErrorController` | `/error/{403,404,500}` | Páginas de error |

## `@ControllerAdvice` clases

| Advice | Scope | Responsabilidad |
|---|---|---|
| `CurrentUserAdvice` | `controller` package | `@ModelAttribute("loggedUser")` resuelto vía `SecurityContextHolder` + `UserService.findByEmail` |
| `GlobalExceptionHandler` | global | Mapeo de excepciones de dominio a vistas de error (ver tabla abajo) |
| `LoginControllerAdvice` | `LoginController` | Helpers para el flujo de login/registro |
| `ProductControllerAdvice` | `ProductController` | Datos comunes para vistas de detalle/edit |
| `RentRequestControllerAdvice` | `RentRequestController` | Datos comunes para `manage.jsp` y subvistas |

`AuthSupport` es un helper (no `@ControllerAdvice`) usado por varios controllers para chequeos del usuario en sesión.

## Mapeo de excepciones (`GlobalExceptionHandler`)

| Exception | Status | View / Behavior |
|---|---|---|
| `ResourceNotFoundException`, `RentNotFoundException` | 404 | `error/404` |
| `ForbiddenException` | 403 | `error/403` |
| `MethodArgumentTypeMismatchException` | 404 | `error/404` |
| `MaxUploadSizeExceededException`, `MultipartException` | 413 | `error/413` |
| `InvalidRentStateException`, `RentPeriodNotEndedException`, `AlreadyReviewedException` | 409 | redirect con flash |
| `InvalidAdminInviteTokenException` (#20) | 410 GONE | `auth/admin-invite-invalid` |
| `ProviderCbuRequiredException` (#10) | 409 CONFLICT | redirect con flash |
| `IdentityConflictException` | re-render registro | flujo de identidad post-guest |
| `InvalidVerificationTokenException`, `InvalidPasswordResetTokenException`, `VerificationCooldownException` | 400/redirect | mensajes específicos |
| `Exception` (catch-all) | 500 | `error/500` |

> Excepciones de dominio (Sprint 2 + sprint actual): viven en `ar.edu.itba.paw.services.exceptions`. Lista completa: `AlreadyReviewedException`, `CurrentPriceNotFoundException`, `ForbiddenException`, `IdentityConflictException`, `InvalidAdminInviteTokenException` (#20), `InvalidPasswordResetTokenException`, `InvalidRentStateException`, `InvalidVerificationTokenException`, `NoPriceForRentRangeException`, `ProviderCbuRequiredException` (#10), `RentNotFoundException`, `RentPeriodNotEndedException`, `ResourceNotFoundException`, `VerificationCooldownException`. Todas son `RuntimeException` planas — el mapeo HTTP vive en `GlobalExceptionHandler`.

## Form objects (19 totales en `webapp.form`)

Auth & registro: `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ResendVerifyEmailForm`, `ChangePasswordForm`.

Producto: `PublishProductForm`, `EditProductForm`, `UpdateProductStatusForm`.

Rent / pago / reviews: `RentForm`, `RentResponseForm`, `InitiatePaymentForm` (con `paymentMethod` + `paymentProof`, class-level `@PaymentProofRequiredIfUpload` — #10), `ReviewForm`.

Catálogo: `CatalogDateRangeForm` (con `@ValidDateRange` + `@FutureOrPresentDate` en `dateFrom`/`dateTo`).

Auth: `RegisterForm` ahora acepta `adminInviteToken` opcional (prellenado desde query param cuando se llega desde el mail de invitación admin — #20).

Profile granular (uno por campo): `UpdateNameForm`, `UpdateSurnameForm`, `UpdateAddressForm`, `UpdateAvailabilityForm`, `UpdateCbuForm`, `UpdateProfilePictureForm`.

> El Sprint 2 introdujo el patrón de "form chiquita por field" en profile (en lugar de un único `UpdateProfileForm`) para que cada submit tenga sus propias reglas de `@Valid` y mensajes específicos.

## Custom validators (20 totales)

En `webapp.validation/{annotations,validators}`. Lista actualizada:

| Anotación | Aplica a |
|---|---|
| `@AtLeastOneImage` | edit (al menos una imagen final) |
| `@AvailabilityRange` | `UpdateAvailabilityForm` (`from < to`) |
| `@CurrentPasswordMatches` | `ChangePasswordForm` |
| `@ExistingProductId` | `RentForm`, `ReviewForm` |
| `@FutureOrPresentDate` | fechas de rent |
| `@NewPasswordMatch` | `ChangePasswordForm` (cross-field) |
| `@NewUser` | `RegisterForm` (email único) |
| `@NoOverlappingSpecialPrices` | `EditProductForm` (precios especiales no se solapan) |
| `@NoSpecialMatchingDefault` | `EditProductForm` (especial ≠ default vigente) |
| `@NotSelfProvider` | `RentForm` (no rentar producto propio) |
| `@PasswordMatch` / `@PasswordsMatch` | registro / reset |
| `@ProductSizeForCategory` | publish / edit (delegando en `ProductService.validateSizeForCategory`) |
| `@RequiredNewImages` | publish (mínimo 1 imagen) |
| `@ValidDateRange` | rangos de precios especiales |
| `@ValidPaymentProof` | `InitiatePaymentForm` (mime + tamaño del comprobante; ahora soporta PDF además de imágenes) |
| `@PaymentProofRequiredIfUpload` | `InitiatePaymentForm` class-level (#10) — exige `paymentProof` si `paymentMethod=UPLOAD`; ignora la regla si `CASH` |
| `@ValidProductImages` | publish + edit (count, size, mime) |
| `@ValidProfilePicture` | foto de perfil |
| `@ValidRentAvailability` | `RentForm` (no choca con bloques existentes) |

Validation groups en `webapp.validation.groups`: `EditGroup`, `PublishGroup` — usados con `@Validated(Group.class)` para reutilizar la misma form en publish/edit con subsets distintos. Ver [[Controllers & Validation]].

## Patrones obligatorios

- **PRG**: tras POST exitoso, `return new ModelAndView("redirect:/...")`. En errores, re-render del form (`BindingResult` no sobrevive a redirect).
- **`BindingResult` inmediatamente después de `@Valid`** — Spring exige ese orden.
- **Ownership en services**: `RentService.findOwnedByProvider(...)`, `ProductService.findOwnedBy(...)`, etc. El controller no chequea ownership.
- **`@ModelAttribute` métodos** para data común (categorías, locations, currencies, sizes, etc.).
- **`<sec:authorize>`** en JSP (no `c:if + role string`).
- **MyListingsController**: filtros server-side por status / category / search query; `DELETED` se excluye siempre del listado (el provider no lo ve aunque la entidad siga en BD).

## CurrentUserAdvice

`@ControllerAdvice` scoped a `ar.edu.itba.paw.webapp.controller`. Resuelve `loggedUser` en cada request:

```java
@ModelAttribute("loggedUser")
public User loggedUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
        return null;
    }
    return userService.findByEmail(auth.getName()).orElse(null);
}
```

`AuthUser` (en `webapp.auth`) es `UserDetails` interno; los controllers nunca lo ven. Ver [[Spring Security]].

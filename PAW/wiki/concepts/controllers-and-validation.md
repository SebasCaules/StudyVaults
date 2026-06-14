---
title: Controllers & Validation
type: concept
created: 2026-04-11
updated: 2026-05-28
tags: [controllers, validation, jsr-303, forms, prg-pattern, best-practices, custom-validators, team-convention, logged-user, validation-groups]
sources: [devolucion-tp1.md, sprint-2-indicaciones.md, notion-teoricas-paw.md]
---

# Controllers & Validation

---

## Controller Rules

1. **`BindingResult` must be the parameter immediately after `@Valid`** — any other order throws an exception
2. If validation errors → `return viewName(form)` (NOT redirect, to preserve model with errors)
3. After successful POST → `return new ModelAndView("redirect:/path")` (**PRG pattern**)
4. Form Objects live in `ar.edu.itba.paw.webapp.form`, never reuse domain model entities
5. `@ModelAttribute` at method level for common data (dropdown options, etc.)
6. `@RequestParam` for query string; `@PathVariable` + `{placeholder}` for URL path
7. **No business logic in controllers** — delegate entirely to the service (TP1 feedback: error conceptual grave)
8. **No try-catch in controllers** — use `GlobalExceptionHandler` (`@ControllerAdvice`) for all exception handling
9. **`@Transactional` belongs only in services**, never in controllers or DAOs directly
10. **Las validaciones van en el form, no en el controller** — usar `@Valid` + Bean Validation (`@Email`, `@NotBlank`, `@Size`) o custom validators. El controller sólo chequea `errors.hasErrors()`.

---

## PRG Pattern (Post-Redirect-Get)

Prevents duplicate form submissions on browser refresh:

```java
@RequestMapping(value = "/publish", method = RequestMethod.POST)
public ModelAndView createProduct(@Valid PublishProductForm form, BindingResult errors) {
    if (errors.hasErrors()) {
        return new ModelAndView("publish/index"); // re-render with errors
    }
    // ... process ...
    return new ModelAndView("redirect:/"); // PRG redirect
}
```

---

## Form Objects (JSR-303 Validation)

Form objects are POJOs with getters/setters (JavaBean convention). They are separate from domain model entities.

### Annotations

- `@NotBlank`, `@NotNull`, `@NotEmpty` — required fields
- `@Size(min, max)` — string length
- `@Email` — email format
- `@DecimalMin` — numeric minimum
- `@Pattern` — regex

### messages.properties Resolution

Most specific to least specific:
```
Pattern.UserForm.username → Pattern.username → Pattern.String → Pattern
```

### Current Form Objects

Ver [[Controllers]]#Form-Objects para la lista completa con tipos y anotaciones. Resumen:

- **LoginForm** — email, password, rememberMe
- **RegisterForm** (`@PasswordMatch`) — name, surname, email (`@NewUser`), password, confirmPassword, identityChoice, returnUrl
- **PublishProductForm** (`@ProductSizeForCategory`) — title, description, price, currency, location, category, brand, size, gender, condition, productImages (`@ValidProductImages`). **Ya no tiene los campos publisherName/publisherSurname/publisherEmail** — el provider sale de `loggedUser`.
- **RentForm** (`@ValidRentDateRange`) — productId (`@ExistingProductId`), startDate (`@FutureOrPresentDate`), endDate. **Ya no tiene renterName/renterSurname/email** — el renter sale de `loggedUser` en `POST /products/{id}/rent`.
- **RentResponseForm** — rentId (`@NotNull`), accepted (`@NotNull Boolean`). Nuevo: reemplaza los `@RequestParam` sueltos en `POST /rent/respond`.

---

## Validation Groups — reutilizar un form con subsets de validaciones

**Cuándo:** la misma form se usa para 2+ flujos pero querés validar campos distintos en cada uno (típico: registro vs edit de perfil — el registro pide `email` y `password`, el edit sólo `username`). Esto evita duplicar la form. (source: notion-teoricas-paw.md)

### Patrón

1. **Marker interface** dentro del form (no necesita métodos):

   ```java
   public class UserForm {
       public interface UserValidationUpdate { }   // marker, sin métodos
       // ...
   }
   ```

2. En cada constraint, declarar a qué grupos aplica con `groups = {...}`:

   ```java
   @Size(min = 8, max = 50, groups = {Default.class, UserValidationUpdate.class})
   @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9]*$", message = "{Pattern.userForm.username}")
   private String username;          // se valida en registro Y en update

   @NotEmpty
   @Email
   private String email;             // sin groups → sólo Default → no se valida en update

   @Size(min = 8, message = "{Size.userForm.password}")
   private String password;          // sin groups → sólo Default → no se valida en update
   ```

   - Constraints **sin** `groups` van implícitamente a `Default.class`.
   - Constraints con `groups = {A, B}` se evalúan cuando se valida con grupo `A` **o** `B`.
   - Para que una constraint aplique en ambos flujos, hay que listar **ambos** grupos explícitamente (`Default.class` + el grupo nuevo).

3. **`@Valid` ↔ `@Validated`**: `@Valid` (JSR-303 puro) **no soporta groups**. Usá `@Validated` (Spring) con el grupo:

   ```java
   // Registro: usa @Valid → valida grupo Default
   @RequestMapping(value = "/", method = RequestMethod.POST)
   public ModelAndView createUser(
           @Valid @ModelAttribute("registerForm") final UserForm form,
           final BindingResult errors) { ... }

   // Update: usa @Validated con grupo específico → sólo username
   @RequestMapping(value = "/profile/{id:[0-9]+}", method = RequestMethod.POST)
   public ModelAndView updateProfile(
           @PathVariable("id") final long id,
           @Validated(UserForm.UserValidationUpdate.class) @ModelAttribute("updateUserForm") final UserForm form,
           final BindingResult errors) { ... }
   ```

### Por qué no duplicar la form

> "this duplication leads to the need to keep things synchronized moving forward and is brittle. Let's try to use groups to set different validation sets for the existing UserForm."
> — anotación del docente en clase del 27/04 (source: notion-teoricas-paw.md)

Crear `RegisterForm` + `UpdateUserForm` separados es la otra opción, pero obliga a mantener sincronizadas las constraints comunes. Validation Groups concentra todo en una sola form.

---

## Exception Handling

`GlobalExceptionHandler` (`@ControllerAdvice`) catches:
- `ResourceNotFoundException` → 404 (`error/404`)
- `ForbiddenException` → 403 (`error/403`)
- `MethodArgumentTypeMismatchException` → 404 (p. ej. path params no numéricos)
- `MaxUploadSizeExceededException` / `MultipartException` → 413 (`error/413`)
- `Exception` (catch-all) → 500 (`error/500`)

`ResourceNotFoundException` y `ForbiddenException` viven en `ar.edu.itba.paw.services.exceptions` (dentro de `service-contracts`), así cualquier capa puede lanzarlas. Ambas son `RuntimeException` planas — el mapeo a HTTP lo hace **sólo** el `GlobalExceptionHandler`, no `@ResponseStatus` en la excepción.

**Never** do try-catch in controllers. All business exceptions should bubble up to `GlobalExceptionHandler`:

```java
// INCORRECTO — try-catch en controller (TP1 feedback: error)
@PostMapping("/reservations")
public ModelAndView create(@Valid ReservationForm form, BindingResult errors) {
    try {
        reservationService.create(form);
    } catch (NoAvailabilityException e) {
        errors.rejectValue("date", "no.availability");
        return createView(form);
    }
    return new ModelAndView("redirect:/reservations");
}

// CORRECTO — la validación de disponibilidad va en un custom validator
@PostMapping("/reservations")
public ModelAndView create(@Valid ReservationForm form, BindingResult errors) {
    if (errors.hasErrors()) return createView(form);
    reservationService.create(form);
    return new ModelAndView("redirect:/reservations");
}
```

`@ExceptionHandler` soporta múltiples excepciones en una sola anotación:

```java
@ExceptionHandler({NotFoundException.class, ResourceNotFoundException.class})
@ResponseStatus(HttpStatus.NOT_FOUND)
public ModelAndView handleNotFound(Exception ex) {
    return new ModelAndView("error/404");
}
```

(source: devolucion-tp1.md)

---

## Controller Advice — cómo lo implementa el proyecto

El proyecto usa **dos** `@ControllerAdvice` separados:

1. **`CurrentUserAdvice`** (paquete `webapp.controller`) — expone el usuario logueado como `@ModelAttribute("loggedUser")`. Ámbito restringido con `basePackages = "ar.edu.itba.paw.webapp.controller"` para que no se ejecute en otros contextos (p. ej., tests).
2. **`GlobalExceptionHandler`** — centraliza el manejo de excepciones.

```java
// CurrentUserAdvice.java
@ControllerAdvice(basePackages = "ar.edu.itba.paw.webapp.controller")
public class CurrentUserAdvice {

    private static final Logger LOGGER = LoggerFactory.getLogger(CurrentUserAdvice.class);
    private final UserService userService;

    @Autowired
    public CurrentUserAdvice(final UserService userService) { this.userService = userService; }

    @ModelAttribute("loggedUser")
    public User loggedUser() {
        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        final User user = userService.findByEmail(auth.getName()).orElse(null);
        LOGGER.debug("Logged user is {}", user);
        return user;
    }
}
```

```java
// GlobalExceptionHandler.java (extracto)
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ModelAndView handle404(final ResourceNotFoundException ex) {
        return new ModelAndView("error/404");
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ModelAndView handle403(final ForbiddenException ex) {
        return new ModelAndView("error/403");
    }

    @ExceptionHandler({MaxUploadSizeExceededException.class, MultipartException.class})
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public ModelAndView handleFileTooLarge(final Exception ex) {
        return new ModelAndView("error/413");
    }
}
```

**Por qué separarlos.** `CurrentUserAdvice` tiene una razón clara de existir (inyección del usuario) y un ámbito acotado. `GlobalExceptionHandler` maneja errores y puede crecer sin mezclarse con la lógica del usuario. Es más legible y más fácil de testear en aislado.

(source: sprint-2-indicaciones.md, commit fa4adb0)

---

## File Upload — Límites de tamaño

Configuración en dos niveles:

**`web.xml`** — límite duro de Spring (50MB):
```xml
<multipart-config>
    <max-file-size>52428800</max-file-size>      <!-- 50 MB -->
    <max-request-size>52428800</max-request-size>
</multipart-config>
```

**Custom validator** — límite de negocio (10MB):
```java
@Override
public boolean isValid(MultipartFile file, ConstraintValidatorContext ctx) {
    if (file == null || file.isEmpty()) return true;
    return file.getSize() <= 10 * 1024 * 1024; // 10 MB
}
```

Si el usuario sube 60MB → Spring tira `MaxUploadSizeExceededException` antes de llegar al controller → `@ControllerAdvice` la captura → pantalla de error 400 personalizada.

(source: sprint-2-indicaciones.md)

---

## Custom Validators — Convención del Equipo

### Regla de oro

**El lugar donde hay que validar es el form, NO el controller.** (Azul, 2026-04-19)

Para validar se usa:
1. **`javax.validation`** estándar: `@Email`, `@NotBlank`, `@Size`, `@NotNull`, `@DecimalMin`, `@Pattern`
2. **Custom validators** para todo lo que no cubren los anteriores

### Estructura de carpetas

Las anotaciones y los validadores viven en dos subcarpetas separadas:

```
webapp/src/main/java/ar/edu/itba/paw/webapp/validation/
├── annotations/         ← las @anotaciones custom
│   ├── ExistingProductId.java
│   ├── FutureOrPresentDate.java
│   ├── NewUser.java
│   ├── PasswordMatch.java
│   ├── ProductSizeForCategory.java
│   ├── ValidProductImages.java
│   └── ValidRentDateRange.java
└── validators/          ← las implementaciones ConstraintValidator
    ├── ExistingProductIdValidator.java
    ├── FutureOrPresentDateValidator.java
    ├── NewUserValidator.java
    ├── PasswordMatchValidator.java
    ├── ProductImagesValidator.java
    ├── ProductSizeForCategoryValidator.java
    └── RentDateRangeValidator.java
```

### Dónde va la lógica

- **Reglas simples sobre un campo** (formato, longitud, rango) → Bean Validation estándar en el form
- **Reglas que requieren BD o lógica de negocio** → custom validator que importa el service e inyecta via `@Autowired`
- **La lógica de negocio en sí vive en el service** — el validator sólo la llama
- **Es correcto que una función del service se use sólo desde un custom validator** (ej: `validateSizeForCategory`)

### Ejemplo 1 — Validator simple con acceso a DB

Verifica que un `productId` exista en la tabla `products`:

**Anotación** (`validation/annotations/ExistingProductId.java`):
```java
@Constraint(validatedBy = ExistingProductIdValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ExistingProductId {
    String message() default "{product.not.found}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validador** (`validation/validators/ExistingProductIdValidator.java`):
```java
public class ExistingProductIdValidator
        implements ConstraintValidator<ExistingProductId, Long> {

    @Autowired
    private ProductService productService;

    @Override
    public boolean isValid(final Long productId, final ConstraintValidatorContext context) {
        if (productId == null) {
            return true; // @NotNull es una validación separada
        }
        return productService.findById(productId).isPresent();
    }
}
```

**Uso en el form:**
```java
public class RentForm {
    @NotNull
    @ExistingProductId
    private Long productId;
    // ...
}
```

### Ejemplo 2 — Validator con lógica de negocio y error en campo específico

Verifica que el talle corresponde a la categoría (camperas sólo XXS-XXL, botas sólo numérico, cascos sin talle):

**Anotación** (a nivel clase, porque valida dos campos del form):
```java
@Constraint(validatedBy = ProductSizeForCategoryValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ProductSizeForCategory {
    String message() default "{product.size.invalid}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validador:**
```java
public class ProductSizeForCategoryValidator
        implements ConstraintValidator<ProductSizeForCategory, PublishProductForm> {

    @Autowired
    private ProductService productService;

    @Override
    public boolean isValid(final PublishProductForm form,
                           final ConstraintValidatorContext context) {
        if (form == null) return true;
        final Category category = form.getCategory();
        if (category == null) return true; // validar por separado con @NotNull

        final Size size = form.getSize();

        try {
            productService.validateSizeForCategory(size, category);
            return true;
        } catch (final InvalidSizeForCategoryException ex) {
            // redirigir el mensaje al campo "size" en vez de al form completo
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(ex.getMessage())
                   .addPropertyNode("size")
                   .addConstraintViolation();
            return false;
        }
    }
}
```

**Uso en el form:**
```java
@ProductSizeForCategory
public class PublishProductForm {
    @NotNull private Category category;
    private Size size; // puede ser null para cascos/accesorios
    // ...
}
```

> La función `validateSizeForCategory(size, category)` vive en `ProductService` aunque sólo se use desde el validator. Eso es correcto: la lógica de negocio siempre va en el service, el validator sólo la invoca.

### Ejemplo 3 — Validator class-level condicional sobre otro campo (Issue #10)

Cuando una constraint depende del valor de otro campo del form (e.g. "este field es obligatorio solo si otro field tiene tal valor"), va class-level (`@Target(TYPE)`) y operate sobre la form entera. Caso real: `InitiatePaymentForm` permite dos métodos de pago — `UPLOAD` (con comprobante adjunto, el flujo canónico) y `CASH` (escape hatch cuando el provider no tiene CBU configurado). El `paymentProof` debe ser obligatorio sólo en `UPLOAD`.

**Anotación** (`validation/annotations/PaymentProofRequiredIfUpload.java`):
```java
@Constraint(validatedBy = PaymentProofRequiredIfUploadValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PaymentProofRequiredIfUpload {
    String message() default "{validation.paymentProof.required}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Validador** (`validation/validators/PaymentProofRequiredIfUploadValidator.java`):
```java
public class PaymentProofRequiredIfUploadValidator
        implements ConstraintValidator<PaymentProofRequiredIfUpload, InitiatePaymentForm> {

    @Override
    public boolean isValid(final InitiatePaymentForm form, final ConstraintValidatorContext context) {
        if (form == null) return true;
        final PaymentMethod method = form.getPaymentMethod();
        if (method == PaymentMethod.CASH) {
            return true; // CASH: proof opcional, no validamos nada
        }
        // UPLOAD: paymentProof debe estar presente y no vacío.
        final MultipartFile file = form.getPaymentProof();
        if (file != null && !file.isEmpty()) {
            return true;
        }
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{validation.paymentProof.required}")
                .addPropertyNode("paymentProof")
                .addConstraintViolation();
        return false;
    }
}
```

**Form**:
```java
@PaymentProofRequiredIfUpload
public class InitiatePaymentForm {

    @ValidPaymentProof(required = false, maxSizeMb = 10)
    private MultipartFile paymentProof;

    private PaymentMethod paymentMethod = PaymentMethod.UPLOAD;

    // getters/setters...
}
```

> Notar la composición: `@ValidPaymentProof(required = false, ...)` corre las validaciones de tipo MIME (incluye PDF ahora) y tamaño del archivo cuando hay uno; la pregunta "¿es obligatorio?" la responde `@PaymentProofRequiredIfUpload` que conoce el `paymentMethod`. Separar las dos responsabilidades evita acoplar el validator de archivo a la lógica de branching del método de pago. Ver [[Payment Method (UPLOAD/CASH)]].

### Por qué el `context.buildConstraintViolationWithTemplate(...).addPropertyNode("size")`

Por defecto, los validators a nivel `@Target(TYPE)` asocian el error al form entero, así que `<form:errors path="size" />` no lo muestra. Con `addPropertyNode("size")` el error se asocia al campo específico y se renderiza donde corresponde.

### Validators actuales del proyecto

| Anotación | Validator | Qué valida |
|-----------|-----------|------------|
| `@ExistingProductId` | `ExistingProductIdValidator` | Que el `productId` exista en BD |
| `@FutureOrPresentDate` | `FutureOrPresentDateValidator` | Fecha hoy o futuro |
| `@NewUser` | `NewUserValidator` | Que el email/username no exista (llama a `UserService.findByUsername(s).isEmpty()`) |
| `@PasswordMatch` | `PasswordMatchValidator` | Que `password` y `confirmPassword` coincidan |
| `@ProductSizeForCategory` | `ProductSizeForCategoryValidator` | Que el talle sea válido para la categoría (llama a `ProductService.validateSizeForCategory`) |
| `@ValidProductImages` | `ProductImagesValidator` | Cantidad, tamaño y tipo de imágenes subidas |
| `@ValidRentDateRange` | `RentDateRangeValidator` | Que el rango de fechas de la reserva sea válido |
| `@PaymentProofRequiredIfUpload` | `PaymentProofRequiredIfUploadValidator` | Class-level sobre `InitiatePaymentForm` (#10) — exige `paymentProof` no-vacío si `paymentMethod=UPLOAD`; lo ignora si `CASH`. Ver Ejemplo 3 abajo. |
| `@ValidDateRange` | `DateRangeValidator` | Class-level — `dateFrom <= dateTo`. Reusado por `CatalogDateRangeForm` (catalog) además de los rangos de precios especiales. |

(source: sprint-2-indicaciones.md, conversación con Azul 2026-04-19)
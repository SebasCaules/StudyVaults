---
title: Sprint 2 — Indicaciones del Corrector
type: source
created: 2026-04-19
updated: 2026-04-19
tags: [sprint-2, indicaciones, validaciones, paginacion, controller-advice, tests]
sources: [Sprint2.pdf]
---

# Sprint 2 — Indicaciones del Corrector

Notas tomadas durante la reunión de corrección/planificación del Sprint 2. Incluye correcciones al Sprint 1, clarificaciones técnicas y el roadmap de pantallas y cambios de BD para el Sprint 2.

---

## Bugs del Sprint 1 a corregir

- El scroll cambia el input del precio cuando creás un producto
- El CTA "Solicitar Reserva" no puede estar tan abajo — tiene que estar más arriba
- `GetLogUser` para que aparezca el perfil en la navbar

---

## Notas técnicas

- En `normalizeAndValidateEmail` del `UserServiceImpl` sacar el chequeo del mail (revisar la regla de negocio del email)
- Agregar todas las funciones de los services a la interfaz (ningún método público del service puede quedar fuera de la interfaz)

---

## Arquitectura de validaciones

Regla clara sobre dónde va cada tipo de validación:

| Capa | Responsabilidad |
|------|----------------|
| Controller | Validar **tipos de dato** de inputs (`@Valid` con Bean Validation estándar) |
| Custom Validator | Validar **lógica de negocio compleja** que requiere llamar al service (ej: email duplicado, disponibilidad) |
| Service | **Contiene** la lógica de negocio; el validator la llama |

- Los servicios en general **no validan** — si el validator llama al service, el service tiene la lógica
- Si es sólo un pasamanos al DAO, **no hay que validar en el service**
- Los errores deben estar en **client side Y en Spring** (no sólo HTML5 validation)
- Siempre que se pueda hacer un validator, es mejor porque permite mostrar el error en el form
- En qué casos el controller tira mensaje en vez de error: cuando no podés cubrir con validation

Ver [[Controllers & Validation]] y [[Paginación, Filtros y Búsqueda]].

---

## Paginación + Filtros + Búsqueda

La searchbar, los filtros y la paginación son **tres formularios separados** pero los tres tienen que **mantener el estado de los otros dos**.

- Cambiar un filtro → resetear paginación a página 1 (tiene lógica)
- Cambiar un filtro → **no** borrar la búsqueda
- La paginación **siempre impacta en la URL** (para que refrescar vuelva a la misma página)
- Número de página inválido → clampear al más cercano válido
- Parámetro basura → redirigir a página 1

### Dos enfoques para mantener el estado

**Opción A (recomendada): Un form con campos ocultos**
Un solo `<form>` que tiene campos hidden para los otros dos estados. Permite usar Spring validators.

**Opción B: JS**
JS mantiene el estado y recarga la página con los parámetros correctos. Perdés la oportunidad de usar validators del lado del server.

> Esto es un GET, no un form de Spring — validar query params a mano en el controller.

Ver [[Paginación, Filtros y Búsqueda]].

---

## Controller Advice

`@ControllerAdvice` actúa como **controller padre** para cosas que querés disponibles siempre: autenticación y manejo de excepciones.

Usos concretos:
- `@ModelAttribute` para exponer el usuario logueado a todas las vistas
- `@ExceptionHandler` para manejar excepciones de forma centralizada

**Manejo de archivos grandes (>10MB):**
- Configurar en `web.xml`: Spring acepta hasta 50MB (límite duro), el validator rechaza los >10MB
- Si alguien manda 60MB → Spring tira `MaxUploadSizeExceededException` → `GlobalExceptionHandler` la captura → pantalla de error 400 personalizada

**Recurso no encontrado → 404**

**Recurso de otro usuario → 403** (forbidden, sin revelar si existe o no)

Ver [[Controllers & Validation]] — sección Controller Advice y File Upload.

---

## Tests (aclaración)

- Testear services **sólo cuando tienen lógica de negocio en el service**
- Si el service es sólo un pasamanos al DAO → no hace falta test de service
- Si el service tiene lógica de negocio → sí hay que testearlo
- Services que devuelven `void` → se puede cambiar a que devuelvan `boolean` aunque no se use en la lógica, para poder hacer asserts en el test
- **NO USAR `Mockito.verify()` ni `Mockito.spy()`** — validan implementación, no comportamiento
- Todos los flujos que impactan en la BD tienen que tener test (casos felices e infelices)

Ver [[Testing Practices]].

---

## Pseudo-chat de reserva (flujo de pago)

El manage.jsp pasa a ser un pseudo-chat parametrizado (no es chat real, los pasos son fijos):

1. **Provider manda CVU**
2. **Renter manda comprobante** (imagen)
3. **Provider confirma** (si rechaza: puede poner razón y dejar que lo vuelva a mandar)
4. Negociación del horario y lugar de encuentro
5. Confirmación de recibido el pedido
6. Reviews (futuramente)

- No hace falta implementar mensajes libres, pero el provider puede dejar un mensaje tipo "peya" cuando reserva
- El provider le tiene que pasar el CVU

---

## Cambios en la BD (Sprint 2)

### Tabla `products`
Agregar campo `status`:
- `"ACTIVE"` — producto visible y rentable
- `"PAUSED"` — oculto temporalmente, el provider puede despausarlo
- `"DELETED"` — eliminado (soft delete)

### Tabla `rents`
- Agregar campo `payment_image_id` (FK → `images`) para el comprobante de pago

### `RentStatus` — nuevos valores
Agregar a los existentes (PENDING, APPROVED, REJECTED, CANCELLED):
- `"PAYMENT_PENDING"` — esperando comprobante
- `"PAYMENT_ACCEPTED"` — pago confirmado por el provider
- `"PAYMENT_REJECTED"` — pago rechazado por el provider
- `"EXPIRED"` — reserva expirada

Ver [[Domain Models]] y [[Enums]].

---

## Asignación de tareas del Sprint 2

### Cambios en pantallas ya hechas

| Pantalla | Cambio | Área |
|----------|--------|------|
| Detalle de producto | Si sos el provider: editar campos + lápiz; CTA arriba; arreglar fechas antes del modal | Productos |
| Catálogo | Filtros + nueva searchbar + paginación; location como query param (no path variable); mostrar sólo active | Catálogo |
| Landing | Nueva searchbar | Catálogo |
| Validators | Custom validators para forms | Catálogo |
| Tests | Tests de DAOs y services | Catálogo |

### Nuevas pantallas

| Pantalla | Detalle | Área |
|----------|---------|------|
| Login | Nueva pantalla de login | Autenticación |
| Register | Validar que el mail no exista con custom validator que llame al service | Autenticación |
| Configurar perfil | Editar nombre, apellido, foto de perfil (contraseña: no este sprint); acceso restringido | Autenticación |
| Historial de reservas | Filtrar por rol (renter/provider), estado, tiempo; estados vacíos con CTA | Reservas |
| Solicitudes provider | Aceptar/rechazar reservas → manage; estado vacío "No hay solicitudes" | Reservas |
| Solicitudes renter | Ver estados; estado vacío + CTA al catálogo | Reservas |
| Listado mis productos | Provider ve sus productos → detalle con edición; estado vacío + CTA publish | Productos |
| Estado del producto | ACTIVE/PAUSED/DELETED + botón cambiar precio y despausar | Productos |
| Pseudo-chat reserva | manage.jsp — comprobante con fotos, flujo CVU/comprobante/confirmar | Pago |
| Manejo expiración | Expiración de estados de reserva | Pago |

---

## Ejemplos de custom validators (del corrector)

### NewUserValidator — validar username único

```java
// webapp/form/validation/NewUserValidator.java
public class NewUserValidator implements ConstraintValidator<NewUser, String> {
    private final UserService us;

    @Autowired
    public NewUserValidator(UserService us) {
        this.us = us;
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        return us.findByUsername(s).isEmpty(); // valid input if username not present
    }
}
```

### PasswordsMatch — validar contraseñas coincidentes

```java
// webapp/form/validation/PasswordsMatch.java (la anotación)
@Constraint(validatedBy = PasswordsMatchValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordsMatch {
    String message() default "Passwords must match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

### RoomAvailableValidator — validar disponibilidad

```java
// webapp/form/validation/RoomAvailableValidator.java
public class RoomAvailableValidator implements ConstraintValidator<RoomAvailable, EventForm> {
    private final EventService es;
    private final ReservationService rs;

    @Override
    public boolean isValid(EventForm eventForm, ConstraintValidatorContext context) {
        boolean result = es.getTimeTo(eventForm.getTimeFrom(),
                           eventForm.getBookedMinutes());
        if (result) {
            result = eventForm.getTimeTo() != null &&
                     rs.checkAvailability(eventForm.getTimeFrom(), ...);
            if (result) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    context.getDefaultConstraintMessageTemplate())
                    .addPropertyNode("roomId")
                    .addConstraintViolation();
                context.buildConstraintViolationWithTemplate("")
                    .addConstraintViolation();
            }
        }
        return result;
    }
}
```

(source: Sprint2.pdf)

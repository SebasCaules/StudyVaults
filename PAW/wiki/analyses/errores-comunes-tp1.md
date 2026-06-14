---
title: Errores Comunes TP1
type: analysis
created: 2026-04-19
updated: 2026-04-19
tags: [feedback, tp1, best-practices, errores-comunes, checklist]
sources: [devolucion-tp1.md]
---

# Errores Comunes TP1

Guía accionable derivada de la [[Devolución TP1 — Feedback Primera Entrega]]. Organizada por severidad para priorizar correcciones.

---

## Errores conceptuales graves (penalizan nota directamente)

### 1. XSS — nunca imprimir `${var}` con datos de usuario sin escapar

En JSP, **todo** valor que venga de la base de datos o del usuario debe imprimirse con `<c:out>`:

```jsp
<%-- INCORRECTO — vulnerable a XSS --%>
<p>${user.name}</p>
<p>${product.description}</p>

<%-- CORRECTO --%>
<c:out value="${user.name}" />
<c:out value="${product.description}" />
```

La excepción son valores que controlás completamente (URLs generadas con `<c:url>`, números, booleanos).

Ver [[JSP Views]] — sección XSS Prevention.

---

### 2. Lógica de negocio en controllers

El controller sólo coordina: recibe request → llama al service → devuelve view. **Nunca** debe:
- Hacer validaciones de negocio
- Llamar a múltiples services para ensamblar un resultado
- Hacer try-catch de excepciones de negocio
- Tener acceso a datos de la DB

```java
// INCORRECTO — el controller llama a 3 services y valida
@PostMapping("/restaurants")
public ModelAndView create(@Valid RestaurantForm form, BindingResult errors) {
    if (restaurantService.exists(form.getName())) { // validación de negocio
        errors.rejectValue("name", "restaurant.exists");
        return createView(form);
    }
    Restaurant r = restaurantService.create(form.getName());
    imageService.upload(r.getId(), form.getImage()); // llamada separada
    menuService.createDefault(r.getId());            // llamada separada
    return new ModelAndView("redirect:/restaurants/" + r.getId());
}

// CORRECTO — un solo método en el service encapsula todo
@PostMapping("/restaurants")
public ModelAndView create(@Valid RestaurantForm form, BindingResult errors) {
    if (errors.hasErrors()) return createView(form);
    Restaurant r = restaurantService.create(form); // el service orquesta
    return new ModelAndView("redirect:/restaurants/" + r.getId());
}
```

Ver [[Controllers & Validation]].

---

### 3. Tests que validan implementación en vez de comportamiento

`Mockito.verify()` y `spy` verifican que se llamó a un método — eso es testear la implementación. Los tests de service deben verificar el **resultado** (output) no cómo se llegó a él.

```java
// INCORRECTO — valida implementación
verify(mailService, times(1)).sendWelcome(user);

// CORRECTO — valida comportamiento (el resultado observable)
Optional<User> created = userService.register("john@example.com", "pass");
assertTrue(created.isPresent());
assertEquals("john@example.com", created.get().getEmail());
```

Ver [[Testing Practices]] — sección Behavior vs Implementation.

---

### 4. Service referenciando recursos de la capa webapp

Un `EmailServiceImpl` en el módulo `services` no puede referenciar templates de email que viven en `webapp/WEB-INF/`. La dependencia debe ir en la dirección correcta: `webapp` → `services`, nunca al revés.

Solución: pasar los textos ya resueltos como parámetros, o mover la resolución de templates a un componente en `webapp` que llame al service.

---

### 5. Joins en Java en lugar de SQL

Hacer consultas separadas por cada entidad relacionada y combinarlas en Java genera N consultas donde debería haber 1.

```java
// INCORRECTO — N+1 queries
List<Post> posts = postDao.findAll();
for (Post post : posts) {
    User author = userDao.findById(post.getAuthorId()); // query por cada post
    post.setAuthor(author);
}

// CORRECTO — 1 query con JOIN
List<Post> posts = postDao.findAllWithAuthor(); // JOIN en SQL
```

Ver [[DAOs (Persistence Layer)]].

---

## Errores frecuentes de arquitectura

### schema.sql en el módulo incorrecto

`schema.sql` / DDL de la base de datos pertenece al módulo `persistence`, no a `webapp`. Es un detalle de implementación del DAO.

### java.sql.* fuera de persistence

Las clases `java.sql.Date`, `java.sql.Timestamp`, etc. sólo deben aparecer en el módulo `persistence`. En `services` y `webapp` usar `java.time.*`.

### SecurityContextHolder — dónde usarlo

Obtener el usuario autenticado es responsabilidad de la **capa webapp**. La forma correcta es en un `@ModelAttribute` de un `@ControllerAdvice`:

```java
@ControllerAdvice
public class UserControllerAdvice {
    @Autowired private UserService us;

    @ModelAttribute("loggedUser")
    public User loggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return us.findByEmail(auth.getName()).orElse(null);
    }
}
```

El service **recibe** el usuario como parámetro, nunca llama a `SecurityContextHolder` directamente.

---

## Errores frecuentes de código

### Magic strings → usar enums

```java
// INCORRECTO
String orderBy = "price_asc";
List<String> days = Arrays.asList("MONDAY", "TUESDAY", ...);

// CORRECTO
OrderBy orderBy = OrderBy.PRICE_ASC;
List<DayOfWeek> days = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, ...);
```

Ver [[Enums]].

### `@Transactional(readOnly = true)` en lecturas

```java
// Métodos que sólo leen
@Transactional(readOnly = true)
public Optional<User> findById(long id) { ... }

// Métodos que escriben
@Transactional
public User create(String email, String password) { ... }
```

### Locale del destinatario en emails

```java
// INCORRECTO — usa el locale del usuario que hizo la acción
Locale locale = LocaleContextHolder.getLocale();

// CORRECTO — usa el locale del destinatario (guardado en la DB o default)
Locale locale = recipient.getPreferredLocale();
```

### URL de la app como variable de entorno

```java
// INCORRECTO — hardcodeada
String baseUrl = "http://pawserver.it.itba.edu.ar/paw-2025a-01/";

// CORRECTO — inyectada desde application.properties
@Value("${app.base-url}")
private String baseUrl;
```

### Optional — sólo para retorno de funciones

`Optional` no debe usarse como campo de clase ni como parámetro:

```java
// INCORRECTO
public class Event {
    private Optional<String> description; // campo Optional — mal
}

// CORRECTO
public class Event {
    private String description; // puede ser null

    public Optional<String> getDescription() {
        return Optional.ofNullable(description);
    }
}
```

### Consistencia en representar ausencia

Elegir **una sola** forma de representar "no existe" y mantenerla:
- `Optional.empty()` para retorno de find-by-id
- `null` para campos opcionales del modelo
- Nunca `id = -1` para indicar inexistencia

---

## Errores frecuentes de seguridad

### Control de acceso por ownership

Verificar el rol no es suficiente. También hay que verificar que el recurso pertenece al usuario:

```java
// INCORRECTO — cualquier usuario autenticado puede eliminar cualquier post
@DeleteMapping("/posts/{id}")
public ModelAndView delete(@PathVariable long id, @ModelAttribute("loggedUser") User user) {
    postService.delete(id);
    return new ModelAndView("redirect:/");
}

// CORRECTO — el service verifica ownership
@DeleteMapping("/posts/{id}")
public ModelAndView delete(@PathVariable long id, @ModelAttribute("loggedUser") User user) {
    postService.deleteIfOwner(id, user.getId()); // lanza excepción si no es dueño
    return new ModelAndView("redirect:/");
}
```

### spring-security-taglibs en JSP

No hacer checks manuales de roles en JSP. Usar la taglib de Spring Security:

```jsp
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<%-- INCORRECTO — check manual con magic string --%>
<c:if test="${loggedUser.role == 'ADMIN'}">
    <a href="/admin">Admin Panel</a>
</c:if>

<%-- CORRECTO — Spring Security aplica las mismas reglas que el ACL --%>
<sec:authorize access="hasRole('ADMIN')">
    <a href="/admin">Admin Panel</a>
</sec:authorize>

<sec:authorize url="/admin">
    <a href="/admin">Admin Panel</a>
</sec:authorize>
```

Ver [[Spring Security]] — sección Taglibs en JSP.

---

## Errores frecuentes de testing

### Tests de persistencia sin asserts de DB

```java
// INCORRECTO — no verifica que algo se insertó
@Test
public void testCreate() {
    userDao.create("john@example.com", "pass");
    // sin asserts
}

// CORRECTO — verifica estado de la DB
@Test
public void testCreate() {
    userDao.create("john@example.com", "pass");
    assertEquals(1, JdbcTestUtils.countRowsInTable(jdbcTemplate, "users"));
}
```

### Usar JUnit 5, no JUnit 3 ni 4

```java
// INCORRECTO — JUnit 3 (herencia de TestCase)
public class MyTest extends TestCase { ... }

// INCORRECTO — JUnit 4 (@RunWith)
@RunWith(MockitoJUnitRunner.class)
public class MyTest { ... }

// CORRECTO — JUnit 5 (@ExtendWith)
@ExtendWith(MockitoExtension.class)
public class MyTest { ... }
```

---

## Checklist rápido pre-entrega

Agregar a [[Pre-Delivery Checklist]]:

- [ ] No hay `${var}` de datos de usuario sin `<c:out>` en ningún JSP
- [ ] No hay lógica de negocio en ningún controller
- [ ] Tests de service usan asserts de resultado, no `verify()`/`spy`
- [ ] Tests de persistence usan `JdbcTestUtils.countRowsInTable()` para verificar estado
- [ ] `schema.sql` está en el módulo `persistence`
- [ ] No hay `java.sql.*` fuera de `persistence`
- [ ] Magic strings reemplazados por enums
- [ ] `@Transactional(readOnly = true)` en todos los métodos de lectura
- [ ] Emails usan el locale del destinatario
- [ ] URL base de la app en variable de entorno, no hardcodeada
- [ ] Control de acceso por ownership verificado en service
- [ ] JSPs usan `spring-security-taglibs` para checks de rol
- [ ] `SecurityContextHolder` sólo en webapp (`@ControllerAdvice`)
- [ ] `Optional` sólo como retorno de funciones, no como campo
- [ ] No hay try-catch en controllers — todo pasa por `GlobalExceptionHandler`

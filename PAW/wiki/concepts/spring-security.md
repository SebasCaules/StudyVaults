---
title: Spring Security
type: concept
created: 2026-04-15
updated: 2026-04-19
tags: [spring-security, authentication, authorization, acl, roles, ownership, taglibs, current-user]
sources: [clase-5-spring-security-logging.md, devolucion-tp1.md]
---

# Spring Security

Spring Security secures the web layer using the ACL pattern: Roles, Resources, Permissions.

---

## Architecture

- **`DelegatingFilterProxy`** — registered in `web.xml`, intercepts every request before it reaches the DispatcherServlet.
- **`WebSecurityConfigurerAdapter`** — Java config class that defines the security rules.
- **`UserDetailsService`** — loads users from the database at authentication time.
- **Spring creates a proxy** around secured beans — the rest of the app is unaware of the security layer.

---

## web.xml Setup

Two additions required:

```xml
<!-- 1. Register WebAuthConfig alongside WebConfig -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>
        ar.edu.itba.paw.webapp.config.WebConfig,
        ar.edu.itba.paw.webapp.config.WebAuthConfig,
    </param-value>
</context-param>

<!-- 2. DelegatingFilterProxy intercepts all requests -->
<filter>
    <filter-name>springSecurityFilterChain</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
    <filter-name>springSecurityFilterChain</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

---

## WebAuthConfig (proyecto actual)

Usa la API moderna (`SecurityFilterChain`), no `WebSecurityConfigurerAdapter`. Inyecta la interfaz estándar `UserDetailsService` de Spring — no la clase concreta — para que Spring resuelva automáticamente el `@Component` que la implementa.

```java
@Configuration
@EnableWebSecurity
public class WebAuthConfig {

    private final UserDetailsService userDetailsService;
    private final String rememberMeKey;

    @Autowired
    public WebAuthConfig(final UserDetailsService userDetailsService,
                         @Value("${rememberme.key}") final String rememberMeKey) {
        this.userDetailsService = userDetailsService;
        this.rememberMeKey = rememberMeKey;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .sessionManagement(s -> s.invalidSessionUrl("/login"))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/assets/**",
                                 "/images/**", "/favicon.ico").permitAll()
                .requestMatchers("/.well-known/**").permitAll()
                .requestMatchers("/error/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/login").permitAll()
                .requestMatchers("/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/", "/catalog/**", "/products/**").permitAll()
                .anyRequest().hasRole("USER")
            )
            .formLogin(form -> form
                .usernameParameter("email")
                .passwordParameter("password")
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler(replaceHistorySuccessHandler())
                .failureUrl("/login?error=true"))
            .rememberMe(remember -> remember
                .rememberMeParameter("rememberMe")
                .userDetailsService(userDetailsService)
                .key(rememberMeKey)
                .tokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(30)))
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login"))
            .exceptionHandling(ex -> ex.accessDeniedPage("/error/403"))
            .csrf(csrf -> csrf.disable())
            .build();
    }
}
```

Notas importantes del refactor (commit `fa4adb0`):

- **Se eliminó `@ComponentScan("ar.edu.itba.paw.webapp.auth")`** — el paquete ya está cubierto por el `@ComponentScan` global de `WebConfig`, así que era redundante. La clase es más limpia y `UserDetailsService` se inyecta por tipo.
- **Se eliminó la regla `"/rent/sent".permitAll()`** porque la pantalla `/rent/sent` y el endpoint `POST /rent/request` ya no existen — ahora el renter logueado envía la reserva vía `POST /products/{id}/rent` en `ProductController`.
- **`accessDeniedPage("/error/403")`** apunta al controlador `ErrorController.forbidden()`.
- **Custom success handler** escribe un HTML mínimo con `window.location.replace(target)` para que el back del browser no vuelva a `/login`. El target se valida contra el `HttpSessionRequestCache`.

**Critical:** el orden de los matchers sigue importando — first match wins. Todo lo público se declara antes de `anyRequest().hasRole("USER")`.

---

## UserDetailsService + AuthUser (proyecto actual)

`UserDetailsService` (paquete `ar.edu.itba.paw.webapp.auth`) implementa la interfaz estándar de Spring. Usa `UserService.findByEmail` y envuelve el dominio en `AuthUser`, un subclass de `org.springframework.security.core.userdetails.User` que guarda el `User` del dominio para poder exponerlo cuando Spring lo pida.

```java
@Component
public class UserDetailsService
        implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserService userService;

    @Autowired
    public UserDetailsService(final UserService userService) {
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String email)
            throws UsernameNotFoundException {
        final User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user with email: " + email));

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new UsernameNotFoundException("User has no password set: " + email);
        }

        return new AuthUser(user,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }
}
```

- `@Transactional(readOnly = true)` evita que Spring abra una transacción de escritura durante el flujo de login.
- El guard de `password == null` es lo que rechaza login de usuarios creados como "guest" durante un rent — deben completar el registro por `/register` primero.
- `AuthUser` sigue existiendo, pero desde el refactor de auth **los controllers ya no lo referencian**. Se usa sólo dentro del paquete `auth/` para construir el `UserDetails` que Spring guarda en sesión.

### Role naming rules

- Prefix **`ROLE_`** is required for all role names.
- `hasRole("USER")` en los matchers chequea `ROLE_USER` automáticamente.
- Authorities son una `Collection` — un usuario puede tener múltiples roles.
- En este proyecto, todos los usuarios autenticados son `ROLE_USER` (no hay admin todavía).

---

## PasswordEncoder

- **Development only:** `PlainTextPasswordEncoder` (never use in production).
- **Production:** `BCryptPasswordEncoder` — hash passwords at creation/change time.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

---

## Accessing the Logged-In User (proyecto actual)

La convención del equipo es no tocar `SecurityContextHolder` desde los controllers. El `@ControllerAdvice` [[Controllers]]#CurrentUserAdvice resuelve el usuario y lo expone como `@ModelAttribute("loggedUser")`:

```java
@ControllerAdvice(basePackages = "ar.edu.itba.paw.webapp.controller")
public class CurrentUserAdvice {

    private static final Logger LOGGER = LoggerFactory.getLogger(CurrentUserAdvice.class);

    private final UserService userService;

    @Autowired
    public CurrentUserAdvice(final UserService userService) {
        this.userService = userService;
    }

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

Los controllers reciben el usuario como parámetro normal:

```java
public ModelAndView manage(@RequestParam final Long rentId,
                           @ModelAttribute("loggedUser") final User loggedUser) { ... }
```

Y también queda disponible en todas las vistas como `${loggedUser}` (por ejemplo para mostrar el nombre en el navbar).

### ¿Por qué no `@AuthenticationPrincipal AuthUser`?

Antes del refactor de auth los controllers usaban `@AuthenticationPrincipal AuthUser authUser` y llamaban a `authUser.getUser()`. Eso acopla los controllers a la clase de `UserDetails` interna del paquete `auth/`. La convención actual es:

- Los controllers trabajan con el `User` del dominio, no con `UserDetails`.
- `AuthUser` queda como detalle de implementación del paquete `auth/`; sólo `UserDetailsService` lo construye y sólo Spring lo lee.
- Un único `@ControllerAdvice` sabe cómo mapear `Authentication` → `User`. Si cambia la estrategia de autenticación, se cambia en un solo lugar.

---

## Dependencies (pom padre)

```xml
<spring-security.version>5.3.13.RELEASE</spring-security.version>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-core</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

---

## Login JSP

```jsp
<c:url value="/login" var="loginUrl" />
<form action="${loginUrl}" method="post">
    <input name="j_username" type="text"/>
    <input name="j_password" type="password"/>
    <input name="j_rememberme" type="checkbox"/> Remember me
    <input type="submit" value="Login!"/>
</form>
```

See [[Spring Configuration]] for the full web.xml setup and [[Controllers & Validation]] for the PRG pattern used in form processing.

---

## Control de acceso por Ownership (TP1 feedback)

Verificar el rol no es suficiente. Si un usuario puede acceder a recursos de otro usuario, hay un bug de seguridad aunque el rol sea correcto.

El chequeo de ownership pertenece al **service**, no al controller:

```java
// INCORRECTO — cualquier usuario autenticado puede borrar cualquier post
@DeleteMapping("/posts/{id}")
public ModelAndView delete(@PathVariable long id) {
    postService.delete(id); // no verifica si el post es del usuario
    return new ModelAndView("redirect:/");
}

// CORRECTO — el service verifica ownership y lanza excepción si no corresponde
@DeleteMapping("/posts/{id}")
public ModelAndView delete(@PathVariable long id,
                           @ModelAttribute("loggedUser") User user) {
    postService.deleteIfOwner(id, user.getId()); // ForbiddenException si no es dueño
    return new ModelAndView("redirect:/");
}
```

### Ejemplo real del proyecto: `RentService.findOwnedByProvider`

Desde el refactor de auth, la verificación que antes vivía en `RentRequestController.requireOwnedRent` bajó a la capa de services:

```java
@Override
@Transactional(readOnly = true)
public Rent findOwnedByProvider(final Long rentId, final Long providerId) {
    final Rent rent = rentDao.findById(rentId)
            .orElseThrow(() -> new ResourceNotFoundException("Rent not found: " + rentId));
    final Product product = productService.findById(rent.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + rent.getProductId()));
    if (!product.getProviderId().equals(providerId)) {
        throw new ForbiddenException("User " + providerId + " is not owner of rent " + rentId);
    }
    return rent;
}
```

El controller queda limpísimo — sólo pasa el `loggedUser.getId()`:

```java
final Rent rent = rentService.findOwnedByProvider(rentId, loggedUser.getId());
```

`EditProductController` sigue el mismo principio inline (chequea `product.getProviderId().equals(loggedUser.getId())` y tira `ForbiddenException`), así que hay espacio para mover eso también al service cuando crezca.

Las excepciones viven en `ar.edu.itba.paw.services.exceptions` (dentro de `service-contracts`), **no** en `webapp.controller`. El `GlobalExceptionHandler` las importa desde ahí y las mapea a 403 / 404.

---

## Ownership dinámico via SpEL `access(...)` (clase 27/04)

Alternativa al chequeo en service: declararlo **en el `WebAuthConfig` mismo** usando una expresión SpEL que invoca un bean. Útil cuando el chequeo es puro "el id del path coincide con el del usuario logueado", sin lógica de negocio que justifique pasar por service. (source: notion-teoricas-paw.md)

### El bean que decide

```java
@Component("userSecurity")
public class UserSecurity {

    public boolean hasUserId(Authentication authentication, Long userId) {
        if (authentication != null
            && authentication.getPrincipal() instanceof PawAuthUser) {
            PawAuthUser pawAuthUser = (PawAuthUser) authentication.getPrincipal();
            return pawAuthUser.getUser().getId().equals(userId);
        }
        return false;
    }
}
```

### La regla en `WebAuthConfig`

```java
.antMatchers(HttpMethod.POST, "/profile/{id:\\d+}")
    .access("@userSecurity.hasUserId(authentication, #id)")
.antMatchers("/profile/**").hasRole("USER")
```

- `@userSecurity` → resuelve al bean `@Component("userSecurity")`.
- `#id` → la `@PathVariable` del request actual.
- `authentication` → variable implícita de SpEL en este contexto.
- **Orden importa**: la regla específica del `POST /profile/{id}` con `access(...)` va **antes** que la regla general `/profile/**`. La primera que matchea gana.

### Cuándo usar cada estilo

| Estilo | Cuándo |
|---|---|
| Chequeo en **service** (`findOwnedByProvider`) | El chequeo necesita queries adicionales (Rent → Product → Provider) o forma parte de la lógica de negocio. |
| **SpEL `access()`** con bean | El chequeo es trivial (path id == user id) y no quiero contaminar el service con un método sólo para auth. |

Las dos son válidas; lo importante es **ser consistente** en todo el módulo.

---

## Refrescar el `SecurityContext` después de mutar el principal

Cuando el usuario edita su propio username/email, el `Authentication` cargado en el contexto sigue trayendo el viejo. Para evitar forzar un logout, se puede armar un nuevo `Authentication` con el principal actualizado y pisarlo en el contexto:

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
PawAuthUser oldPrincipal = (PawAuthUser) auth.getPrincipal();
User updatedUser = userService.findById(id).orElseThrow(EntityNotFoundException::new);
PawAuthUser newPrincipal = new PawAuthUser(
    oldPrincipal.getUsername(),
    oldPrincipal.isEnabled(),
    oldPrincipal.isAccountNonExpired(),
    oldPrincipal.isAccountNonLocked(),
    oldPrincipal.getAuthorities(),
    updatedUser);
Authentication newAuth = new UsernamePasswordAuthenticationToken(newPrincipal, auth.getCredentials());
SecurityContextHolder.getContext().setAuthentication(newAuth);
```

> **Cuidado:** si tu app usa `CurrentUserAdvice` (`@ModelAttribute("loggedUser")`) que **siempre** consulta el repositorio fresco, ese refresh es innecesario — el siguiente render ya trae el dato actualizado. El patrón aplica si tu principal se cachea en el `SecurityContext` y se accede directamente desde la vista. (source: notion-teoricas-paw.md)

---

## SecurityContextHolder — dónde usarlo

**Sólo en la capa webapp**, nunca en services. La forma correcta es en un `@ControllerAdvice` con `@ModelAttribute` para que el usuario logueado esté disponible en todos los controllers:

```java
@ControllerAdvice
public class UserControllerAdvice {
    @Autowired private UserService us;

    @ModelAttribute("loggedUser")
    public User loggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof AnonymousAuthenticationToken) return null;
        return us.findByEmail(auth.getName()).orElse(null);
    }
}
```

Luego los controllers reciben el usuario como parámetro:
```java
public ModelAndView show(@ModelAttribute("loggedUser") User user) { ... }
```

Los services reciben el `userId` como parámetro, nunca llaman a `SecurityContextHolder`.

(source: devolucion-tp1.md)

---

## Consistencia del ACL — WebAuthConfig vs @PreAuthorize

Definir el ACL en **un solo lugar**. Mezclar `antMatchers` en `WebAuthConfig` con `@PreAuthorize` en controllers genera duplicación y confusión sobre cuál tiene precedencia.

**Preferido:** centralizar todo en `WebAuthConfig`. Es el único lugar donde se lee la política de acceso.

```java
// Si se usa @PreAuthorize, agregar @EnableGlobalMethodSecurity en WebAuthConfig:
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebAuthConfig extends WebSecurityConfigurerAdapter { ... }
```

(source: devolucion-tp1.md)

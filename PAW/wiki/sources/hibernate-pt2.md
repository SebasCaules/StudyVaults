---
title: Hibernate pt2 — Relaciones, Lazy, OpenEntityManagerInView, Paginación 1+1
type: source
created: 2026-05-12
updated: 2026-05-12
tags: [hibernate, jpa, lazy-loading, relationships, pagination, jpql, enums, dirty-checking, open-entity-manager-in-view]
sources: [hibernatept2.pdf]
---

# Hibernate pt2 — Clase del Lun 11/05

Continuación de [[Clase 7 — Hibernate y JPA]]. El docente arranca desde el setup ya hecho (defaults de JPA + Hibernate, `EntityManagerFactory`, `JpaTransactionManager`) y avanza a **relaciones entre entidades**, **lazy loading**, **`OpenEntityManagerInViewFilter`**, **dirty checking**, **enums**, **JPQL navigation** y termina con el patrón **1+1 queries** para paginación (marcado como **CLAVE PARA APROBAR PRÓXIMO TP**).

> **Archivo fuente:** `raw/assets/hibernatept2.pdf` (44 páginas, screenshots de IntelliJ + apuntes en vivo).

---

## Takeaways clave

1. **El default de `fetch` en `@ManyToOne`/`@OneToOne` es EAGER**, en `@OneToMany`/`@ManyToMany` es LAZY. La recomendación es **LAZY siempre, salvo excepción muy justificada**.
2. Hibernate logra lazy loading **con proxies + `PersistentBag`** vía reflection — por eso pisa los campos privados directamente y necesita constructor sin args. Cuando se accede a la propiedad, hace la query.
3. **`LazyInitializationException`** ocurre cuando se intenta acceder a una colección lazy **fuera de un contexto transaccional** (típicamente desde el JSP). Solución: **`OpenEntityManagerInViewFilter`** en `web.xml`.
4. **Tradeoff del OpenEntityManagerInView**: ganamos comodidad, **perdemos control de cuántas queries se ejecutan y cuándo**. Hay que revisar activamente que las pantallas no estén trayendo data de más.
5. **Dirty checking**: si modificás una entidad gestionada en un contexto `readOnly=false`, al cerrar la transacción Hibernate dispara un `UPDATE` **implícito** sin que llames a ningún método. ➜ **No modificar entidades directamente**.
6. **`em.getReference(Class, id)`** devuelve un proxy para usar como FK sin hacer query.
7. **JPQL navega propiedades** (`i.assignee.username`), no columnas. Habla del modelo, no de la BD.
8. **`@Enumerated(EnumType.STRING)`** preferido sobre `ORDINAL`. Nunca renombrar valores de enum.
9. **Paginación con `setFirstResult/setMaxResults` está MAL** cuando hay joins (row ≠ entidad). Patrón correcto: **1+1 queries** (native query para ids paginados + JPQL `WHERE id IN :ids ORDER BY ...`).
10. **Tests**: 1 test = 1 comportamiento. **`em.flush()`** antes de asertar contra BD. **`JdbcTestUtils.countRowsInTable`** para verificar persistencia. **`Mockito.verify` prohibido** (testea implementación, no contrato).

---

## 1. Relaciones entre entidades

### El problema previo

Antes, en `Issue`, la FK al autor se modelaba como `private Long authorId`. Eso es **un mapeo de la BD**, no del modelo de objetos. En el mundo de objetos no existe el concepto de "id de otra cosa": ponemos directamente el objeto referenciado.

```java
// ANTES — pensando en la BD
private Long authorId;

// DESPUÉS — pensando en el modelo
@ManyToOne
private User author;
```

JPA nos permite **abstraernos de la base de datos** y modelar en términos del dominio.

### Anotaciones de relación

Hay 4, una por cada tipo de cardinalidad del diagrama entidad-relación:

| Anotación | Cuándo |
|---|---|
| `@ManyToOne` | Lado "muchos" de una relación 1:N (ej. el issue tiene UN autor; muchos issues por user). |
| `@OneToMany` | Lado "uno" de una relación 1:N (ej. el user tiene muchos `reportedIssues`). |
| `@ManyToMany` | N:M con tabla intermedia. |
| `@OneToOne` | 1:1. |

### `@ManyToOne` — atributos importantes

```java
@ManyToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private User author;

@ManyToOne(optional = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private User assignee;
```

| Atributo | Default | Notas |
|---|---|---|
| `optional` | `true` | `false` = NOT NULL en la FK. |
| `cascade` | `{}` | `CascadeType.ALL` propaga persist/merge/remove al asociado. |
| `fetch` | **EAGER** | ⚠ Default malo — sobreescribir a LAZY casi siempre. |
| `targetEntity` | tipo del campo | Para compat con versiones viejas de Java sin generics. |

### `@OneToMany` — `mappedBy` y `orphanRemoval`

La FK física vive en la tabla del lado "muchos" (`issues.author_id`). En el lado del `User` no se agrega columna nueva; sólo hay que decirle a JPA **qué propiedad del lado opuesto representa esta relación** mediante `mappedBy`.

```java
@OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
private List<Issue> reportedIssues;

@OneToMany(mappedBy = "assignee", fetch = FetchType.LAZY)
private List<Issue> assignedIssues;
```

Sin `mappedBy`, JPA no sabría que `author` se corresponde con `reportedIssues` y `assignee` con `assignedIssues` — porque del lado de `User` no hay columnas que mapear; el mapeo se resuelve por el atributo Java del otro lado.

| Atributo | Default | Notas |
|---|---|---|
| `mappedBy` | `""` | Nombre del atributo dueño de la relación en la otra entidad. |
| `fetch` | **LAZY** | Default correcto. |
| `cascade` | `{}` | Igual que ManyToOne. |
| `orphanRemoval` | `false` | Si `true`, sacar un elemento de la colección dispara DELETE en la BD. Usar sólo cuando el hijo es una **entidad débil**. |

### Por qué el default de fetch en `*ToMany` es LAZY

```java
@OneToMany(mappedBy = "author", fetch = FetchType.EAGER)  // ⚠
private List<Issue> reportedIssues;
@OneToMany(mappedBy = "assignee", fetch = FetchType.EAGER) // ⚠
private List<Issue> assignedIssues;
```

Si fueran eager, al levantar UN usuario JPA traería:

1. `SELECT * FROM users WHERE id = ?`
2. `SELECT * FROM issues WHERE author_id = ?` (reportedIssues)
3. `SELECT * FROM issues WHERE assignee_id = ?` (assignedIssues)
4. Para cada issue de la lista, popular su `assignee` (otro `User`) → puede explotar en recursión.

Consume mucha memoria y dispara muchas queries → **baja performance**. El default LAZY existe porque cargar toda la trama no es lo común.

### Cómo funciona LAZY por dentro

Hibernate **modifica las instancias que nos devuelve** (proxies / reflection). Para colecciones, devuelve un `PersistentBag` que se comporta como `List` pero **intercepta el primer acceso** (consultar size, iterar) — sólo ahí ejecuta la query y popula. También trackea inserts/removes para reflejarlos.

Para `@ManyToOne` lazy, Hibernate genera un **proxy de la entidad** que dispara la query al acceder a cualquier método.

> Por eso necesita constructor sin args + acceso por reflection: tiene que poder crear instancias vacías y rellenar los campos sin que el código de aplicación se entere.

---

## 2. `LazyInitializationException` y `OpenEntityManagerInViewFilter`

### El error típico

```text
org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role:
ar.edu.itba.paw.models.User.reportedIssues, could not initialize proxy - no Session
```

Pasa cuando:

1. El controller llama a `userService.findById(id)` (envuelto en `@Transactional(readOnly=true)`).
2. La transacción cierra al volver del service → sesión Hibernate se cierra.
3. El JSP intenta iterar `user.reportedIssues` → no hay sesión activa para hacer la query lazy.

### Solución cruda (mala): forzar el fetch en el service

```java
@Transactional(readOnly = true)
public Optional<User> findById(long id) {
    Optional<User> user = userDao.findById(id);
    user.ifPresent(u -> {
        u.getReportedIssues().size();   // fuerza la query dentro de la sesión
        u.getAssignedIssues().size();
    });
    return user;
}
```

Equivale a eager fetch: **siempre populamos**, perdemos el beneficio de lazy.

### Solución correcta: `OpenEntityManagerInViewFilter`

Filter que **abre una sesión al entrar el request y la cierra cuando sale**. Mientras el JSP renderiza, la sesión sigue viva → las queries lazy funcionan.

```xml
<!-- web.xml -->
<filter>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <filter-class>org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

> Va **antes** del `springSecurityFilterChain`.

### Tradeoff (importante)

| Lo bueno | Lo malo |
|---|---|
| Abstracción de la BD: modelamos el negocio. | **Perdemos el control de cuántas queries se ejecutan y en qué momento.** |
| Acceso transparente: navegamos propiedades sin pensar. | El JSP puede disparar queries silenciosas con cada `${user.reportedIssues}`. |

> "La mayoría de las apps usan ORMs igual. Hay que revisar cuánto están tardando en cargar las pantallas si estoy trayendo mucha data." — Sotuyo.

**Convención del equipo**: ser **intencionales y explícitos** sobre qué cargamos. Cuando el costo del lazy molesta, traer las cosas en el DAO de forma deliberada (join fetch, `EntityGraph`, o queries específicas).

Ver también [[Errores Comunes TP1]] — N+1 es uno de los errores recurrentes señalados por el corrector.

---

## 3. Dirty checking — el UPDATE invisible

Dentro de una transacción **no-readOnly**, modificar una entidad gestionada dispara un `UPDATE` al cerrar la transacción **sin llamar a ningún método del DAO**:

```java
@Transactional(readOnly = false)
@Override
public Optional<User> findById(final long id) {
    Optional<User> user = userDao.findById(id);
    if (user.isPresent()) {
        user.get().getReportedIssues().add(new Issue("a new issue", "...", user.get()));
    }
    return user;
}
```

Los logs muestran un `INSERT INTO issues ...` aunque sólo llamamos a `findById`. Cada refresh suma un nuevo issue. Lo mismo si cambiás `user.setUsername(...)` — sale un `UPDATE` implícito.

### Por qué pasa

Al cerrar el contexto transaccional, Hibernate compara los snapshots iniciales contra el estado actual de las entidades gestionadas (**dirty checking**). Si hay diferencias, sintetiza las queries.

### Regla práctica

> **NO MODIFICAR ENTIDADES EN FORMA DIRECTA.**

- Hacer la modificación **en el DAO**, con un método explícito (`updateUsername`, `addReportedIssue`, etc).
- O usar `@Transactional(readOnly = true)` para que el dirty checking quede bloqueado (Hibernate no flushea cambios).
- Se puede desactivar dirty checking con properties, pero la recomendación del docente es: **no modificar entidades de forma directa**.

> Esto es un "grado de lock-in" con JPA. La abstracción del ORM nos hace olvidar la BD, pero también nos hace perder visibilidad: hay que ser conscientes de cuándo se ejecutan queries.

---

## 4. `em.getReference()` — FK sin query

Cuando el método recibe un `id` y necesita armar una entidad con esa FK, **no hace falta** traer la entidad completa:

```java
public Issue createIssue(String title, String description, Long authorId) {
    User authorProxy = em.getReference(User.class, authorId);
    return em.persist(new Issue(title, description, authorProxy));
}
```

`getReference` devuelve un proxy que se materializa **sólo si alguien accede a sus propiedades**. Para popular la FK en `issues.author_id` no hace falta ninguna query.

Útil cuando ya tenemos el id (típicamente del usuario logueado) y no queremos un `SELECT * FROM users` innecesario.

---

## 5. JPQL — habla del modelo, no de la BD

```java
// Issues sin asignar O con assignee con un username particular
em.createQuery(
    "FROM Issue i WHERE i.assignee IS NULL OR i.assignee.username = :username",
    Issue.class
).setParameter("username", "alice").getResultList();
```

- En la BD existe `assignee_id`, **no** `assignee`. Pero en JPQL hablamos en términos de la **propiedad del modelo** (`assignee`), no de la columna.
- Podemos navegar relaciones arbitrariamente (`i.assignee.username`) — JPA traduce a los joins necesarios.
- "Nuestro único concern es asegurarnos de que nuestro modelo sea correcto y las queries que ejecuta sean correctas." — Sotuyo.

---

## 6. Mapeo de enums — `@Enumerated`

```java
public enum Priority { LOW, MEDIUM, HIGH }

@Enumerated(EnumType.STRING)
private Priority priority;
```

| Estrategia | Qué guarda | Pros | Contras |
|---|---|---|---|
| `EnumType.ORDINAL` | Número (índice en el enum) | Compacto. | **Si reordenás el enum se rompe todo.** Legible solo en código. |
| `EnumType.STRING` | Texto del valor | Autodescriptivo, legible en la BD, tolerante a **agregar** valores al final o medio. | Ocupa más espacio. |

> **Recomendación**: usar **`EnumType.STRING`** salvo razón fuerte de espacio.

**Regla dura**: con STRING, **se pueden agregar valores**, pero **NO se pueden renombrar** (rompe los registros viejos). Con ORDINAL pasa lo opuesto: podés renombrar pero no reordenar.

Ver también [[Enums]] para el inventario del proyecto.

---

## 7. Paginación — **CLAVE PARA APROBAR PRÓXIMO TP**

### El approach naive (MAL)

```java
public List<Issue> findAssignedIssues(final long userId, final int page) {
    return em.createQuery("FROM Issue i WHERE i.assignee = :userId", Issue.class)
        .setParameter("userId", userId)
        .setFirstResult(page * PAGE_SIZE)
        .setMaxResults(PAGE_SIZE)
        .getResultList();
}
```

### Por qué está mal

JPQL trabaja con entidades; SQL trabaja con rows. **`setFirstResult/setMaxResults` se traducen a `OFFSET/LIMIT`**, asumiendo implícitamente que **1 row = 1 entidad**.

Esa premisa **falla en cuanto hay un join** (relación 1:N con fetch eager, fetch join explícito, `@ElementCollection`, etc.). Si una entidad tiene 3 issues asociados eager-fetched, la query interna devuelve 3 rows por entidad y el `LIMIT PAGE_SIZE` corta a mitad de las entidades — el resultado tiene **menos elementos de los esperados**.

> Las versiones modernas de Hibernate detectan el caso y, como no pueden saber cuántas rows saltar, **traen TODO el resultado en memoria** y filtran. Peor en performance: trajimos toda la tabla cuando queríamos sólo una página.

Nuestro código no es estático: aunque hoy no haya joins, mañana alguien agrega un `@OneToMany` eager y la paginación silenciosamente devuelve resultados rotos.

### El patrón correcto: **1+1 queries**

```java
@Override
public List<Issue> findReportedIssues(final long userId, final int page) {
    // 1) native query: pagina ids (no entidades) — sí podemos confiar en LIMIT/OFFSET
    @SuppressWarnings("unchecked")
    List<Number> issueIds = em.createNativeQuery(
            "SELECT id FROM issues WHERE author_id = :userId ORDER BY created_at ASC")
        .setParameter("userId", userId)
        .setFirstResult(page * PAGE_SIZE)
        .setMaxResults(PAGE_SIZE)
        .getResultList();

    if (issueIds.isEmpty()) {
        return Collections.emptyList();    // evita la 2da query si no hay nada
    }

    // 2) JPQL: trae las entidades por id — REPETIR EL ORDER BY
    return em.createQuery(
            "FROM Issue i WHERE i.id IN :ids ORDER BY i.createdAt ASC",
            Issue.class)
        .setParameter("ids",
            issueIds.stream().map(Number::longValue).collect(Collectors.toList()))
        .getResultList();
}
```

Reglas/gotchas:

- **`createNativeQuery`** se usa para la query de ids porque queremos paginar SQL puro, sin abstracción JPQL.
- **`Long.class` NO se puede pasar como segundo argumento de `createNativeQuery`** (no es entidad). Usar `List<Number>` y mapear a `Long` con `stream().map(Number::longValue)`.
- **REPETIR el `ORDER BY` en ambas queries** — el orden de la primera query no se preserva en `WHERE id IN (...)`. Si la primera ordena por `createdAt ASC`, la segunda también.
- **`if (issueIds.isEmpty()) return Collections.emptyList()`** — si no hay ids, evitar la 2da query (el `IN ()` vacío es error de sintaxis en muchos drivers).
- El método del DAO recibe **el `page` (0-indexed)**; el `PAGE_SIZE` es constante del DAO.

### Controller que usa el service

```java
@RequestMapping(value = "/profile/{id:[0-9]+}", method = RequestMethod.GET)
public ModelAndView profile(
        @PathVariable("id") final long id,
        @RequestParam(name = "page", defaultValue = "0") final int page,
        @ModelAttribute("updateUserForm") final UserForm form) {
    ModelAndView mav = new ModelAndView("helloworld/profile");
    Optional<User> user = userService.findById(id);
    mav.addObject("user", user.orElseThrow(EntityNotFoundException::new));
    mav.addObject("reportedIssues", issueService.findReportedIssues(id, page));
    mav.addObject("assignedIssues", issueService.findAssignedIssues(id, page));
    return mav;
}
```

> El docente lo marca explícitamente: **"CLAVE PARA APROBAR PRÓXIMO TP"**. Cualquier paginación naive con `setFirstResult/setMaxResults` sobre entidades con relaciones es razón de no-aprobación.

Ver también [[Paginación, Filtros y Búsqueda]].

---

## 8. Testing — reglas afinadas con JPA

Las reglas se incorporan a `GEMINI.md` del proyecto:

### Persistence tests (DAOs JPA)

- Usar **HSQLDB en memoria** (`TestConfiguration.java` ya existente).
- Para operaciones que **alteran la BD** (inserts/updates/deletes), **verificar el estado de la BD explícitamente** con `JdbcTestUtils.countRowsInTable(jdbcTemplate, "issues")` u otras helpers — **no confiar en `em.find()` sobre el objeto retornado** (puede salir del cache de primer nivel sin tocar la BD).
- **Llamar `em.flush()` explícitamente** antes de asertar contra la BD — el EM acumula operaciones y sin flush no han llegado al motor.

```java
@Test
public void testCreateIssueReturnsIssue() {
    // 1. Arrange
    final String title = "Test Issue";
    final String description = "Test Description";

    // 2. Exercise
    final Issue issue = issueDao.createIssue(title, description, author);

    // 3. Assert — comportamiento del método (devuelve la entidad)
    Assertions.assertNotNull(issue);
    Assertions.assertNotNull(issue.getId());
    Assertions.assertEquals(title, issue.getTitle());
    Assertions.assertEquals(description, issue.getDescription());
    Assertions.assertEquals(author.getId(), issue.getAuthor().getId());
}

@Test
public void testCreateIssuePersistsData() {
    // 1. Arrange
    final String title = "Test Issue";
    final String description = "Test Description";

    // 2. Exercise
    issueDao.createIssue(title, description, author);
    em.flush();                                              // ← obligatorio

    // 3. Assert — estado real en BD
    Assertions.assertEquals(1, JdbcTestUtils.countRowsInTable(jdbcTemplate, "issues"));
}
```

> El test del docente que mezcla `createIssue` + `em.find()` en un solo `@Test` está **MAL hecho** porque testea dos cosas — si falla, no sabés cuál.

### Service tests

- Servicios se testean **mockeando el DAO**.
- Tests deben enfocarse **estrictamente en el comportamiento y contrato** (assertions sobre los valores devueltos o las excepciones lanzadas).
- **Evitar testear detalles de implementación → NO usar `Mockito.verify`** para chequear interacciones.

```java
@Test
public void testFindById() {
    // Arrange
    final long id = 1L;
    final Issue expected = new Issue(1L, "title", "description", null);
    Mockito.when(issueDao.findById(Mockito.eq(id))).thenReturn(Optional.of(expected));

    // Exercise
    final Optional<Issue> issue = issueService.findById(id);

    // Assert
    Assertions.assertTrue(issue.isPresent());
    Assertions.assertEquals(expected, issue.get());
}
```

Ver [[Testing Practices]] para la doctrina completa, y [[Errores Comunes TP1]] donde `Mockito.verify` aparece como anti-pattern recurrente del corrector.

---

## Apéndices: snippets concretos

### Entidad `Issue` final

```java
@Entity
@Table(name = "issues")
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "issues_id_seq")
    @SequenceGenerator(name = "issues_id_seq", sequenceName = "issues_id_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at", nullable = true)
    private LocalDateTime resolvedAt;

    @ManyToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User author;

    @ManyToOne(optional = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User assignee;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    /* package-private */ Issue() { /* For Hibernate */ }
    public Issue(String title, String description, User author) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.createdAt = LocalDateTime.now();
        this.priority = Priority.MEDIUM;
    }
    // ... getters
}
```

### Entidad `User` con colecciones lazy

```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(...) private Long id;
    @Column(length = 255, unique = true, nullable = false) private String email;
    @Column(length = 255, nullable = false) private String password;
    @Column(length = 255, nullable = false) private String username;

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<Issue> reportedIssues;

    @OneToMany(mappedBy = "assignee", fetch = FetchType.LAZY)
    private List<Issue> assignedIssues;

    /* package-private */ User() {}
    // ... constructor + getters
}
```

### Tabla generada

```text
issues:
  id            bigint        not null
  created_at    timestamp     not null
  description   text
  title         varchar(255)  not null
  resolved_at   timestamp
  assignee_id   bigint
  author_id     bigint        not null
  priority      varchar(...)

Foreign keys:
  assignee_id REFERENCES users(id)
  author_id   REFERENCES users(id)
```

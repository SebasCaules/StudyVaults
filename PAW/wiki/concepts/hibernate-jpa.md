---
title: Hibernate & JPA
type: concept
created: 2026-05-06
updated: 2026-05-12
tags: [hibernate, jpa, orm, persistence, entity-manager, jpql, dirty-state, jpms, relationships, lazy-loading, open-entity-manager-in-view, pagination]
sources: [clase-7-hibernate-jpa.md, notion-teoricas-paw.md, hibernate-pt2.md]
---

# Hibernate & JPA

Migración de la capa de persistencia desde **Spring JDBC** (ver [[Persistence (Spring JDBC)]]) hacia un ORM. Usamos **JPA** como standard y **Hibernate** como implementación concreta — el mismo patrón que ya usábamos para Bean Validation (standard JSR-303 con la implementación de Hibernate Validator, ver [[Controllers & Validation]]).

> **Estado del proyecto:** los DAOs reales todavía usan JdbcTemplate; la migración a JPA/Hibernate está prevista. Esta página describe el destino, no el estado actual del repo. (source: clase-7-hibernate-jpa.md)

## ⚠ Aviso: stack actual del proyecto (Java 21 + Hibernate 5.1)

Combinación verificada en el `pom.xml` del proyecto:

| | Versión | Año | Comentario |
|---|---|---|---|
| Java | **21** (`maven.compiler.release`) | 2023 | LTS actual |
| Spring | 5.3.33 | 2024 | Soporta Java 17+ — ✅ OK |
| Hibernate | **5.1.0.Final** | **2016** | Era Java 7/8 — ⚠ requiere workarounds |
| JPA API | `hibernate-jpa-2.1-api` 1.0.0.Final | 2014 | Namespace `javax.persistence` (no `jakarta.persistence`) |

**Implicancias importantes** que el PDF de Clase 7 no menciona pero que sí cubre [[Notion Teoricas PAW — Apuntes en vivo]] (clase 27/04):

1. **JPMS bloquea la reflection de Hibernate** → hace falta `--add-opens` en `maven-surefire-plugin` y `jetty-maven-plugin`. Sin esto, los tests tiran `InaccessibleObjectException` y `mvn jetty:run` no levanta.
2. **JAXB fue removido del JDK en Java 11** → `javax.xml.bind:jaxb-api 2.3.1` debe declararse explícitamente en `pom` padre y `persistence/pom.xml`.
3. **Versiones nuevas de Maven plugins** — `maven-surefire-plugin` 3.3.0+ y `jetty-maven-plugin` 9.4.58+ son las que sí toleran Java 21.
4. **Mantener `javax.persistence`**, no migrar a `jakarta.persistence` — `jakarta.*` recién aparece en Hibernate 6+, lo cual obligaría a migrar Spring también. No es algo a tocar en este TP.

Los detalles concretos de pom están en [[Notion Teoricas PAW — Apuntes en vivo]] y replicados abajo en la sección **"Cambios de pom — Hibernate 5.1 + Java 9+ (JPMS)"**.

---

## Por qué un ORM

**Impedancia Objeto-Relacional**: el modelo de objetos (herencia, referencias, polimorfismo) y el modelo relacional (tablas, claves, joins) son distintos. No todo se mapea de forma directa — hay que aceptar trade-offs y seguir convenciones. Un ORM se encarga de esos trade-offs por nosotros.

**Hibernate vs JPA:**

- **Hibernate** existe desde antes que JPA y prácticamente lo definió.
- **JPA** es el standard de Java; Hibernate lo implementa.
- Programamos contra el API de JPA (`EntityManager`, `@Entity`, `@Column`, etc.); Hibernate es invisible salvo en propiedades específicas (dialect, hbm2ddl.auto, etc.).

### El ejemplo Friendship — por qué la impedancia duele

Una relación many-to-many entre usuarios (amigos): en SQL hace falta una **tabla intermedia** con FKs. En el mundo de objetos, esa tabla **no existe**. Tres problemas concretos al mapear `User → List<Long> friendIds`: (source: notion-teoricas-paw.md)

1. **NULL vs lista vacía** — `friendIds = null` ("no sé") y `friendIds = Collections.emptyList()` ("sé que no tiene") son semánticamente distintos en Java pero se mapean al mismo "no hay filas en la tabla". Es una transformación **LOSSY**.
2. **No isomorfismo SQL ↔ objetos** — en SQL `NULL = NULL` es **false**, en objetos `null == null` es **true**. No hay función biyectiva entre los dos paradigmas: siempre se pierde info.
3. **¿Cuándo populo la lista?** — cargarla siempre obliga a un JOIN/query extra que rara vez se necesita. Solución: **lazy loading** — el ORM popula el atributo recién cuando se lo accede.

> Convención del equipo: preferir **lista vacía** a `null` para evitar `NullPointerException`. Los ORMs imponen esta convención por nosotros y garantizan consistencia.

---

## Configuración

### Dependencias

| Módulo | Dependencias añadidas |
|---|---|
| `pom` padre | `spring-orm`, `hibernate-core`, `hibernate-entitymanager`, `hibernate-jpa-2.1-api` |
| `persistence` | `spring-orm`, `hibernate-core`, `hibernate-entitymanager` |
| `model` | `hibernate-jpa-2.1-api` (sólo el API, las anotaciones viven en el modelo) |
| `webapp` | `spring-orm` |

Versiones del proyecto: `org.hibernate.version = 5.1.0.Final`, `org.hibernate.jpa.version = 1.0.0.Final`.

### EntityManagerFactory en WebConfig

```java
@Bean
public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
    final LocalContainerEntityManagerFactoryBean factoryBean =
        new LocalContainerEntityManagerFactoryBean();
    factoryBean.setPackagesToScan("ar.edu.itba.model");
    factoryBean.setDataSource(dataSource());

    final JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    factoryBean.setJpaVendorAdapter(vendorAdapter);

    final Properties properties = new Properties();
    properties.setProperty("hibernate.hbm2ddl.auto", "update");
    properties.setProperty("hibernate.dialect",
        "org.hibernate.dialect.PostgreSQL92Dialect");
    properties.setProperty("hibernate.show_sql", "true");
    properties.setProperty("format_sql", "true");

    factoryBean.setJpaProperties(properties);
    return factoryBean;
}
```

### Transaction Manager

Cambia respecto del setup de JDBC: ahora se usa `JpaTransactionManager`, no `DataSourceTransactionManager`.

```java
@Bean
public PlatformTransactionManager transactionManager(final EntityManagerFactory emf) {
    return new JpaTransactionManager(emf);
}
```

Las anotaciones `@Transactional` siguen funcionando igual (ver [[AOP & Transactions]]).

### Eliminación de DataSourceInitializer

Con `hibernate.hbm2ddl.auto = update`, Hibernate administra el schema. `databasePopulator` y `databaseInitializer` se pueden eliminar — a menos que se usen para algo más allá del setup de la BD.

---

## Mapeo de entidades

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
                    generator = "users_userid_seq")
    @SequenceGenerator(sequenceName = "users_userid_seq",
                       name = "users_userid_seq",
                       allocationSize = 1)
    @Column(name = "userid")
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String username;

    @Column(length = 100, nullable = false)
    private String password;

    /* package */ User() {
        // Just for Hibernate, we love you!
    }
    // ... resto: constructor con args, getters
}
```

### Reglas de mapeo

| Anotación | Cuándo es necesaria | Notas |
|---|---|---|
| `@Entity` | **Siempre** | Sin esto, Hibernate no la considera. |
| `@Table(name = "...")` | Sólo si el default no sirve | Default = nombre de la clase, con casing. Ej: `User` → tabla `User`, no `users`. |
| `@Id` | **Siempre** en la PK | Una entidad sin `@Id` no compila. |
| `@Column(name = "...")` | Sólo si el default no sirve | Default = nombre de la propiedad. |
| `@Column(columnDefinition = "...")` | Para tipos no-VARCHAR | Ej: `@Column(columnDefinition = "TEXT")` para campos largos sin límite. (source: notion-teoricas-paw.md) |
| `@GeneratedValue` | Para PKs auto-generadas | Estrategias: `IDENTITY`, `SEQUENCE`, `TABLE`, `AUTO`. |
| `@SequenceGenerator` | Para usar una secuencia específica | Hibernate por defecto crea una única `hibernate_sequence` para todo. |

### Mapeo SQL constraint → anotación JPA

| Constraint en SQL | Anotación JPA equivalente |
|---|---|
| `VARCHAR(255)` | `@Column(length = 255)` |
| `NOT NULL` | `@Column(nullable = false)` |
| `UNIQUE` | `@Column(unique = true)` |
| `TEXT` (PG-specific, sin límite) | `@Column(columnDefinition = "TEXT")` |
| Nombre custom de columna | `@Column(name = "snake_case_name")` |
| Optional | `@Column(nullable = true)` (default si se omite) |

### `@Entity(name = "users")` vs `@Entity` + `@Table(name = "users")`

Dos formas equivalentes para que la entidad `User` mapee a la tabla `users`:

```java
// Forma 1 — atajo
@Entity(name = "users")
public class User { ... }

// Forma 2 — más explícita y convencional
@Entity
@Table(name = "users")
public class User { ... }
```

Preferir la forma 2 — es más clara y permite agregar otros atributos de tabla (schema, indexes, etc.).

### Constructor default obligatorio

Hibernate crea instancias **por reflection** y luego popula las propiedades. Necesita un constructor sin argumentos. Buena práctica: hacerlo `/* package */` para que el código de aplicación use el constructor con args, pero Hibernate (mismo paquete del modelo) puede instanciar sin restricciones desde fuera vía reflection.

```java
/* package */ User() {
    // Just for Hibernate, we love you!
}
```

> Tensión con [[Domain Models]]: las entidades del proyecto son **inmutables** (constructor-only, sin setters). Hibernate puede hidratar campos privados directamente por reflection — los setters no son obligatorios. La inmutabilidad para el código de aplicación se mantiene.
>
> Aclaración del docente: "Hibernate va a hacer un uso intensivo de reflection. Nos va a pedir siempre tener un constructor default que **ni siquiera tiene que ser público**. Cuando lee de la BD va a generar una instancia nueva y luego sobre esa instancia vacía por reflection le va a setear los valores. **Ni siquiera necesito setters** para las propiedades, por reflection pisa los valores." (source: notion-teoricas-paw.md)

---

## DAO con JPA — patrón Hibernate

Reemplaza al `JdbcTemplate` por el `EntityManager`. La interfaz del DAO no cambia; sí cambia su implementación.

```java
@Repository
public class UserHibernateDao implements UserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public User create(final String username, final String password) {
        final User user = new User(username, password);
        em.persist(user);
        return user;
    }

    @Override
    public User getByUsername(final String username) {
        final TypedQuery<User> query = em.createQuery(
            "from User as u where u.username = :username", User.class);
        query.setParameter("username", username);
        final List<User> list = query.getResultList();
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public User findById(long id) {
        return em.find(User.class, id);
    }
}
```

### Operaciones básicas del EntityManager

| Operación | API de JPA |
|---|---|
| Insertar / actualizar | `em.persist(entity)` — evalúa si la entidad tiene id: sin id → INSERT (y popula el id); con id → UPDATE |
| Leer por id | `em.find(EntityClass, id)` — retorna `null` si no existe → wrap en `Optional.ofNullable(...)` |
| Update implícito | Modificar la entidad gestionada — Hibernate detecta dirty state al cerrar la tx |
| Delete | `em.remove(entity)` |
| Query | `em.createQuery("...", EntityClass)` |

### `EntityManager` es stateful (¡no thread-safe!)

> El `EntityManager` está asociado a una conexión de base de datos y **tiene estado** (cache de primer nivel, dirty tracking, etc.). No puede compartirse entre threads.
> (source: notion-teoricas-paw.md)

**Implicancia:** el `*HibernateDao` **NO es singleton**. Spring genera tantas instancias como necesite (efectivamente request-scoped). Es transparente: el `UserService` nunca se entera de que hay múltiples instancias del DAO por debajo. Esto lo resuelve `@PersistenceContext` automáticamente — inyecta un proxy thread-safe que delega al EM apropiado.

### Update sin `save()` — dirty state detection

Gran diferencia respecto de JDBC: para actualizar una entidad **no hay que llamar a ningún método de save**.

```java
@Override
public void updateUsername(long id, String username) {
    final User user = em.find(User.class, id);
    if (user != null) {
        user.setUsername(username);   // ← suficiente
    }
    // NO hace falta em.merge() ni em.persist()
}
```

Hibernate trackea las entidades cargadas en el `EntityManager`. Al **cerrar la transacción** hace flush comparando el estado actual contra el snapshot inicial — si detecta cambios, dispara el UPDATE automáticamente.

> **Trade-off:** este es el motivo por el cual `@Transactional(readOnly = true)` importa más con Hibernate que con JDBC — sin el flag, Hibernate hace el diff aunque no hayas tocado nada (gasto de memoria/CPU para comparar snapshots).

### Coexistencia con DAOs JDBC

Durante la migración, **quitar el `@Repository` del DAO viejo** para que Spring no encuentre dos candidatos del mismo bean. Alternativa: usar `@Primary` o `@Qualifier`.

---

## JPQL / HQL — el query language

Las queries no se escriben en SQL, sino en **JPQL** (basado en HQL).

### Diferencias clave

| SQL | JPQL |
|---|---|
| Nombres de **tablas** | Nombres de **entidades** (la clase Java) |
| Nombres de **columnas** | Nombres de **propiedades** del bean |
| `SELECT * FROM users` | `from User` (el `select` es opcional) |
| `WHERE username = ?` | `WHERE u.username = :username` (parámetros nombrados o posicionales) |

### Ejemplos

```jpql
-- Todos los usuarios
from User

-- Por username
from User as u where u.username = :username

-- Con join (relaciones de objetos, no de tablas)
select p from Product p join p.images i where i.id = :imageId

-- Agregaciones
select count(u) from User u
```

### Parámetros

```java
TypedQuery<User> q = em.createQuery("from User u where u.username = :name", User.class);
q.setParameter("name", username);            // nombrado
List<User> result = q.getResultList();
```

---

## Propiedades de Hibernate

| Propiedad | Valor en el proyecto | Qué hace |
|---|---|---|
| `hibernate.hbm2ddl.auto` | `update` | Crea/actualiza el schema según las entidades. **No usar `create` en prod** (borra todo). |
| `hibernate.dialect` | `org.hibernate.dialect.PostgreSQL92Dialect` | SQL generado optimizado para PG 9.2+. |
| `hibernate.show_sql` | `true` (en dev) | Loguea el SQL generado. ⚠ "Si ponen esto en prod, hay tabla!!!" |
| `format_sql` | `true` | Formatea el SQL logueado para que sea legible. |

### Valores comunes de `hbm2ddl.auto`

| Valor | Comportamiento | Cuándo |
|---|---|---|
| `validate` | Valida que el schema coincida; falla si no | **Producción** |
| `update` | Sincroniza schema (no borra) | Desarrollo |
| `create` | Drop + create al arranque | Tests, exploración |
| `create-drop` | `create` al arranque + drop al cerrar | Tests |

### `hbm2ddl.auto = update` — qué resuelve y qué NO

> Cuando la aplicación levanta, va a encontrar las entidades del dominio, se fija a qué tablas mapea y va a comparar eso con la base de datos. **En caso de diferencias, hace best-effort.** (source: notion-teoricas-paw.md)

Lo que **sí** hace:

- Crea tablas nuevas para entidades nuevas (con sequences correspondientes).
- Hace `ALTER TABLE ADD COLUMN` cuando agregás un atributo a una entidad existente.
- Detecta inconsistencias de tipos.

Lo que **NO** hace:

- ❌ Operaciones destructivas (no borra columnas/tablas que ya no estén en el modelo).
- ❌ Defaults para columnas nuevas en filas existentes (si tenés filas viejas, queda en `NULL`).
- ❌ Migraciones complejas (renombrar columnas, cambiar tipos, FKs nuevas).

> **Conclusión:** `hbm2ddl=update` no reemplaza a Flyway. **Vamos a tener que seguir usando Flyway** para todo cambio destructivo o no trivial. (source: notion-teoricas-paw.md)

---

## Pipeline interno de queries y caching del AST

Cuando ejecutás una query JPQL custom (no es INSERT/UPDATE/DELETE estándar):

1. **Parser**: lee el JPQL y construye el AST (Abstract Syntax Tree).
2. **Compiler**: transforma el AST en SQL específico del dialecto.
3. **Cache**: guarda el resultado parseado en memoria → la próxima vez sólo reemplaza valores.

Las **INSERT/UPDATE/DELETE estándar** (las que dispara `em.persist()`/dirty state) ya tienen el SQL **precocido** — no pasan por el parser.

Cuando configurás logs de Hibernate (ver [[Logging (Logback / SLF4J)]]) podés ver:

- El AST como árbol (con nodos `[SELECT_FROM]`, `[FROM]`, `[WHERE]`, `[EQ]`, etc.).
- El AST convertido a SQL final con parámetros bindeados.

Esto es útil para entender por qué un JPQL produce un SQL determinado (especialmente con joins implícitos por relaciones).

---

## Cambios de pom — Hibernate 5.1 + Java 9+ (JPMS)

Por usar Hibernate 5.1 (con módulos `javax.persistence`) corriendo en Java 9+ (con JPMS), Maven Surefire y Jetty necesitan `--add-opens` para que la reflection funcione contra módulos JDK encapsulados. Sin esto, los tests y el run de Jetty fallan con `InaccessibleObjectException`. (source: notion-teoricas-paw.md)

### `pom.xml` padre — properties

```xml
<properties>
    <org.hibernate.version>5.1.0.Final</org.hibernate.version>
    <org.hibernate.jpa.version>1.0.0.Final</org.hibernate.jpa.version>
    <javax.xml.version>2.3.1</javax.xml.version>
</properties>
```

### `pom.xml` padre — pluginManagement

```xml
<!-- Surefire con --add-opens para que los tests no fallen contra módulos JDK -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <argLine>--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.persistence/javax.persistence=ALL-UNNAMED</argLine>
    </configuration>
</plugin>

<!-- Jetty para correr la app: mismo --add-opens en jvmArgs -->
<plugin>
    <groupId>org.eclipse.jetty</groupId>
    <artifactId>jetty-maven-plugin</artifactId>
    <version>9.4.58.v20250814</version>
    <configuration>
        <jvmArgs>--add-opens java.base/java.lang=ALL-UNNAMED</jvmArgs>
        <scanIntervalSeconds>10</scanIntervalSeconds>
        <port>8080</port>
        <useTestScope>true</useTestScope>
    </configuration>
</plugin>
```

### Distribución por módulo (resumen)

| Módulo | Dependencias agregadas |
|---|---|
| `pom` padre | `spring-orm`, `hibernate-core`, `hibernate-entitymanager`, `hibernate-jpa-2.1-api`, `jaxb-api` |
| `persistence` | `spring-orm`, `hibernate-core`, `hibernate-entitymanager`, `jaxb-api` |
| `model` | `hibernate-jpa-2.1-api` |
| `webapp` | `spring-orm`, `hibernate-core`, `hibernate-jpa-2.1-api` |

> `jaxb-api` desaparece del JDK en Java 9+ — por eso hay que sumarla explícitamente.

---

## TestConfiguration con JPA

Reemplazo del setup de JdbcTemplate. Mantiene `dataSource()` (apuntando a HSQLDB en memoria) y suma el `EntityManagerFactory` y el `JpaTransactionManager`.

```java
@Configuration
@EnableTransactionManagement
public class TestConfiguration {

    @Bean
    public DataSource dataSource() {
        SimpleDriverDataSource ds = new SimpleDriverDataSource();
        ds.setDriverClass(JDBCDriver.class);
        ds.setUrl("jdbc:hsqldb:mem:paw;sql.syntax_pgs=true");   // ← sintaxis PG en HSQLDB
        ds.setUsername("ha");
        ds.setPassword("");
        return ds;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setPackagesToScan("ar.edu.itba.paw.models");
        factoryBean.setDataSource(dataSource());

        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        factoryBean.setJpaVendorAdapter(vendorAdapter);

        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", "update");
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");  // ← HSQL, no PG
        properties.setProperty("hibernate.show_sql", "true");
        properties.setProperty("format_sql", "true");

        factoryBean.setJpaProperties(properties);
        return factoryBean;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}
```

> **Tip:** `jdbc:hsqldb:mem:paw;sql.syntax_pgs=true` — el flag `sql.syntax_pgs` activa sintaxis PostgreSQL en HSQLDB, lo que permite que más SQL específico de PG funcione en tests.

---

## Ejemplo: entidad nueva `Issue` desde cero

Caso típico de mapping de una entidad nueva (sin entidades preexistentes que respetar):

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

    /* package-private */ Issue() { /* For Hibernate */ }

    public Issue(String title, String description, LocalDateTime createdAt) { ... }
    // getters
}
```

Al levantar la app por primera vez con esta entidad y `hbm2ddl.auto = update`:

```sql
create table issues (
    id int8 not null,
    created_at timestamp not null,
    description TEXT,
    title varchar(255) not null,
    primary key (id)
);
create sequence issues_id_seq start 1 increment 1;
```

Si después agrego `@Column(name = "resolved_at", nullable = true) private LocalDateTime resolvedAt;`, al recompilar Hibernate detecta la inconsistencia y dispara un `ALTER TABLE issues ADD COLUMN resolved_at timestamp`.

> **Regla de oro de mapping:** entidades **nuevas** → usar defaults libremente. Entidades que **ya existen** en BD → verificar que cada `@Column` matchee nombre/tipo; **probarlo en BD local antes**; los cambios destructivos siguen yendo por **Flyway**. (source: notion-teoricas-paw.md)

---

## Conflictos de dependencias

Al introducir Hibernate puede aparecer un conflicto de dependencias transitivas (incompatibilidad de versión con algo que ya teníamos). Solución: **excluir la dependencia conflictiva** desde el pom padre con `<exclusions>`. La clase 7 no detalla cuál — depende del estado del classpath de cada equipo.

---

## Diferencias respecto a Spring JDBC

| Aspecto | Spring JDBC | Hibernate / JPA |
|---|---|---|
| API principal | `JdbcTemplate`, `SimpleJdbcInsert` | `EntityManager`, `@PersistenceContext` |
| Lenguaje de query | SQL | JPQL / HQL |
| Mapeo | `RowMapper<T>` manual | Anotaciones (`@Entity`, `@Column`, ...) |
| Identidad | Manual (vos pasás id) | Gestionada (`@Id` + `@GeneratedValue`) |
| Schema | `schema.sql` / Flyway | `hbm2ddl.auto` (dev) o Flyway (prod) |
| Transaction Manager | `DataSourceTransactionManager` | `JpaTransactionManager` |
| Inyección | `@Autowired DataSource` (constructor) | `@PersistenceContext EntityManager` (field) |
| Pendiente de bean | `@Repository` | `@Repository` |

Ver [[Persistence (Spring JDBC)]] para el patrón anterior.

---

## Relaciones entre entidades (clase 11/05)

JPA modela FKs como **referencias a objetos**, no como ids sueltos. Anotaciones por cardinalidad:

| Anotación | Lado |
|---|---|
| `@ManyToOne` | "muchos" de una 1:N (FK física del lado de esta entidad). |
| `@OneToMany` | "uno" de una 1:N (sin columna nueva; usa `mappedBy`). |
| `@ManyToMany` | N:M con tabla intermedia. |
| `@OneToOne` | 1:1. |

```java
// Issue.java — lado "muchos"
@ManyToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private User author;

@ManyToOne(optional = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private User assignee;

// User.java — lado "uno"
@OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
private List<Issue> reportedIssues;

@OneToMany(mappedBy = "assignee", fetch = FetchType.LAZY)
private List<Issue> assignedIssues;
```

| Atributo | Default | Notas |
|---|---|---|
| `optional` (`*ToOne`) | `true` | `false` → FK con NOT NULL. |
| `cascade` | `{}` | `CascadeType.ALL` propaga persist/merge/remove al asociado. |
| `fetch` en `*ToOne` | **EAGER** ⚠ | Sobreescribir a `LAZY` en casi todos los casos. |
| `fetch` en `*ToMany` | LAZY | Default correcto. |
| `mappedBy` (`@OneToMany`) | `""` | Nombre del atributo dueño de la relación en la entidad del otro lado. Sin esto JPA no sabe qué propiedad del otro lado le corresponde. |
| `orphanRemoval` (`@OneToMany`) | `false` | Si `true`, sacar un elemento de la colección dispara DELETE. Sólo cuando el hijo es entidad **débil**. |

> El default eager de `@ManyToOne` es trampa. Trae además sus propios `@ManyToOne` eager (cadena) → 1 query por entidad relacionada → N+1 silencioso. Siempre **`fetch = FetchType.LAZY`**.

### Cómo Hibernate logra LAZY

- Para colecciones: devuelve un **`PersistentBag`** (no un `ArrayList` real). Cada operación (size, iterator, add) se intercepta — la primera consulta dispara la query.
- Para entidades `*ToOne` lazy: devuelve un **proxy generado** que materializa la entidad al acceder a cualquier método.
- Por eso necesita constructor sin args y popular campos privados por reflection: para poder devolver objetos vacíos e ir rellenándolos.

---

## `LazyInitializationException` y `OpenEntityManagerInViewFilter`

Síntoma típico desde el JSP:

```text
org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role:
ar.edu.itba.paw.models.User.reportedIssues, could not initialize proxy - no Session
```

El controller devuelve el `User` con la colección sin tocar. Cuando el JSP itera `${user.reportedIssues}`, la sesión Hibernate **ya cerró** (la `@Transactional` del service terminó) → no se puede ejecutar la query lazy.

### Forzar el fetch en el service (mala solución)

```java
@Transactional(readOnly = true)
public Optional<User> findById(long id) {
    Optional<User> user = userDao.findById(id);
    user.ifPresent(u -> u.getReportedIssues().size());   // fuerza la query
    return user;
}
```

Esto es **equivalente a eager fetch siempre**. Perdemos el beneficio del lazy.

### `OpenEntityManagerInViewFilter` (recomendada)

Filter de Spring que abre la sesión Hibernate al entrar el request y la cierra al salir → mientras el JSP renderiza, la sesión sigue activa.

```xml
<!-- web.xml — ANTES del springSecurityFilterChain -->
<filter>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <filter-class>org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### Tradeoff (importante)

| Lo bueno | Lo malo |
|---|---|
| Abstracción transparente: navegamos relaciones en el JSP sin pensar. | **Perdemos visibilidad de cuántas queries se ejecutan y cuándo.** |
| Resolvemos `LazyInitializationException` de un saque. | El JSP puede disparar queries silenciosas (`${user.reportedIssues}` → SELECT). |

**Convención del equipo**: ser intencionales con qué cargamos. Cuando el lazy molesta, hacer el fetch deliberado en el DAO (`join fetch`, `EntityGraph`, query específica). Ver [[Errores Comunes TP1]] — N+1 es uno de los anti-patterns recurrentes del corrector. (source: hibernate-pt2.md)

---

## Dirty checking — el UPDATE invisible

En un contexto transaccional **no-readOnly**, modificar una entidad gestionada dispara un `UPDATE`/`INSERT` **implícito** al cerrar la transacción, **sin llamar a ningún método del DAO**.

```java
@Transactional(readOnly = false)
public Optional<User> findById(long id) {
    Optional<User> user = userDao.findById(id);
    user.ifPresent(u -> u.getReportedIssues().add(new Issue("a new issue", "...", u)));
    return user;
}
// Log de hibernate: insert into issues ... ← sin que llamemos a ningún save
```

Cada refresh ejecuta el `INSERT`. Lo mismo ocurre con `user.setUsername(...)`: sale un `UPDATE` automático cuando la transacción termina.

### Regla del equipo

> ⚠ **NO MODIFICAR ENTIDADES EN FORMA DIRECTA.**

- Hacer modificaciones a través de un método **explícito del DAO** (`updateUsername`, `addReportedIssue`, etc.).
- `@Transactional(readOnly = true)` desactiva el flush automático → más defensivo para queries.
- Se puede desactivar dirty checking con properties, pero la recomendación del docente es **no modificar entidades directamente**. (source: hibernate-pt2.md)

> Este es el "grado de lock-in" del ORM. La abstracción nos hace olvidar la BD; también nos hace perder control. Hay que ser conscientes.

---

## `em.getReference()` — FK sin query

Cuando ya tenemos el `id` y sólo necesitamos popular la FK, **no hace falta** traer la entidad entera:

```java
public Issue createIssue(String title, String description, Long authorId) {
    User authorProxy = em.getReference(User.class, authorId);
    return em.persist(new Issue(title, description, authorProxy));
}
```

`getReference` devuelve un proxy que **sólo se materializa si alguien accede a sus propiedades**. Para popular `issues.author_id` no hace falta query. Útil para usar el id del usuario logueado sin un `SELECT * FROM users` extra. (source: hibernate-pt2.md)

---

## JPQL — navegación por propiedades

JPQL habla en términos del **modelo**, no de la BD: la propiedad `assignee` (objeto `User`), no la columna `assignee_id`.

```java
// "FROM Issue i WHERE i.assignee IS NULL OR i.assignee.username = :username"
List<Issue> result = em.createQuery(
        "FROM Issue i WHERE i.assignee IS NULL OR i.assignee.username = :username",
        Issue.class)
    .setParameter("username", "alice")
    .getResultList();
```

JPA traduce a los joins necesarios (`LEFT JOIN users ON ...`). Podemos navegar relaciones arbitrariamente — el ORM se ocupa de la traducción. (source: hibernate-pt2.md)

---

## Mapeo de enums — `@Enumerated`

```java
@Enumerated(EnumType.STRING)
private Priority priority;
```

| Estrategia | Guarda | Pros | Contras |
|---|---|---|---|
| `EnumType.ORDINAL` (default) | número (índice) | compacto | **se rompe si reordenás el enum**; ilegible en BD |
| `EnumType.STRING` | texto del valor | autodescriptivo, legible, tolerante a **agregar** valores | más espacio |

**Recomendación**: usar **`STRING`** salvo razón fuerte de espacio. Con STRING podés **agregar** valores nuevos sin romper datos viejos, pero **NUNCA renombrar** un valor existente (rompe los registros ya guardados). Con ORDINAL es lo opuesto: podés renombrar pero no reordenar. (source: hibernate-pt2.md)

Ver [[Enums]] para el inventario de enums del proyecto.

---

## Paginación con JPA — patrón **1+1 queries** ⭐

> El docente lo marcó explícitamente como **"CLAVE PARA APROBAR PRÓXIMO TP"**. Cualquier paginación naive sobre entidades con relaciones es razón de no-aprobación. (source: hibernate-pt2.md)

### Approach naive — MAL

```java
public List<Issue> findAssignedIssues(long userId, int page) {
    return em.createQuery("FROM Issue i WHERE i.assignee = :userId", Issue.class)
        .setParameter("userId", userId)
        .setFirstResult(page * PAGE_SIZE)
        .setMaxResults(PAGE_SIZE)
        .getResultList();
}
```

`setFirstResult/setMaxResults` se traduce a `OFFSET/LIMIT` SQL, asumiendo **1 row = 1 entidad**. Esa premisa **falla** cuando hay joins (relaciones eager, `@ElementCollection`, `join fetch`): la query SQL devuelve N rows por entidad, el `LIMIT` corta a mitad de entidades → resultados con menos elementos de los esperados.

> Hibernate moderno detecta el caso, pero como no sabe cuántas rows saltar **trae TODO en memoria** y filtra. Peor en performance: trajimos toda la tabla por una página.

Y aunque hoy no haya joins, una relación nueva (eager) puede romper la paginación sin que nadie lo note.

### Patrón correcto: 1+1 queries

```java
@Override
public List<Issue> findReportedIssues(final long userId, final int page) {
    // 1) Native query: pagina IDs (no entidades) — sí podemos confiar en LIMIT/OFFSET
    @SuppressWarnings("unchecked")
    List<Number> issueIds = em.createNativeQuery(
            "SELECT id FROM issues WHERE author_id = :userId ORDER BY created_at ASC")
        .setParameter("userId", userId)
        .setFirstResult(page * PAGE_SIZE)
        .setMaxResults(PAGE_SIZE)
        .getResultList();

    if (issueIds.isEmpty()) {
        return Collections.emptyList();          // evita la 2da query si no hay nada
    }

    // 2) JPQL: trae las entidades por id — REPETIR EL ORDER BY
    return em.createQuery(
            "FROM Issue i WHERE i.id IN :ids ORDER BY i.createdAt ASC", Issue.class)
        .setParameter("ids",
            issueIds.stream().map(Number::longValue).collect(Collectors.toList()))
        .getResultList();
}
```

### Gotchas

- **`Long.class` no se pasa a `createNativeQuery`** (no es entidad). Usar `List<Number>` y mapear con `stream().map(Number::longValue)`.
- **Repetir el `ORDER BY` en ambas queries**: el orden de la primera no se preserva en `IN (...)`.
- **`if (issueIds.isEmpty()) return Collections.emptyList()`**: evita un `IN ()` vacío (error de sintaxis en muchos drivers).
- El `page` es 0-indexed; `PAGE_SIZE` es constante del DAO.

Ver [[Paginación, Filtros y Búsqueda]] para los patrones de UI (3 forms compartiendo estado) y [[Hibernate pt2 — Relaciones, Lazy, OpenEntityManagerInView, Paginación 1+1]] para el desarrollo completo.

---
title: Clase 7 — Hibernate y JPA
type: source
created: 2026-05-06
updated: 2026-05-06
tags: [hibernate, jpa, orm, persistence, entity-manager, jpql, hql, java-21, jpms]
sources: [PAW - clase 7.pdf]
---

# Clase 7 — Hibernate y JPA

**Archivo original:** `PAW - clase 7.pdf`

> ⚠ **Aviso de versiones — el PDF está desactualizado para el setup del proyecto.** El PDF asume implícitamente Java 7/8 (Hibernate 5.1 es de 2016). El proyecto corre con **Java 21 + Spring 5.3.33 + Hibernate 5.1.0.Final**, combinación que requiere ajustes que el PDF no menciona. Ver la sección final **"Adaptación a Java 21"** y los apuntes de [[Notion Teoricas PAW — Apuntes en vivo]] (bloque 27/04) para los detalles. Esta página deja el contenido literal del PDF y suma las correcciones.

## Takeaways principales

- Se reemplaza Spring JDBC por **JPA + Hibernate** en la capa de persistencia.
- **JPA** es el standard de Java para persistencia; **Hibernate** es la implementación concreta usada (mismo patrón que Bean Validation con la implementación de Hibernate).
- Concepto clave: **Impedancia Objeto-Relacional** — el desajuste entre el modelo de objetos y el relacional obliga a trade-offs y convenciones (no todo se mapea de forma directa).
- La nueva configuración requiere `LocalContainerEntityManagerFactoryBean`, `JpaTransactionManager`, y propiedades de Hibernate (`hbm2ddl.auto`, `dialect`, `show_sql`).
- Las queries se escriben en **JPQL/HQL** (no SQL) — usan nombres de entidades y propiedades, no de tablas/columnas.
- Hibernate exige un **constructor default** (puede ser package-private) para crear instancias por reflection.
- Las entidades se anotan con `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@SequenceGenerator`, `@Column`.

## Notas detalladas

### Hibernate y la Impedancia Objeto-Relacional

Hibernate es un **ORM** (*Object-Relational Mapper*) que establece una función biyectiva entre el mundo de objetos y la base de datos relacional. Como ambos mundos tienen diferencias profundas, **hay cosas que no pueden ser mapeadas de forma completa o directa**, y deben hacerse trade-offs y seguirse convenciones — esto se llama *Impedancia Objeto-Relacional*.

Hibernate es el ORM más popular y prácticamente definió el concepto de ORM moderno. El standard de Java para persistencia (**JPA**) está fuertemente basado en Hibernate.

Vamos a usar **JPA con Hibernate como implementación concreta** del estándar — análogo a usar el standard de validación de beans con la implementación concreta de Hibernate (ver [[Clase 4 — Web Forms]]).

### Dependencias

**En el pom padre:**

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
    <version>${org.springframework.version}</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>${org.hibernate.version}</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-entitymanager</artifactId>
    <version>${org.hibernate.version}</version>
</dependency>
<dependency>
    <groupId>org.hibernate.javax.persistence</groupId>
    <artifactId>hibernate-jpa-2.1-api</artifactId>
    <version>${org.hibernate.jpa.version}</version>
</dependency>
```

**Versiones:**

```xml
<org.hibernate.version>5.1.0.Final</org.hibernate.version>
<org.hibernate.jpa.version>1.0.0.Final</org.hibernate.jpa.version>
```

**Distribución por módulo:**

| Módulo | Dependencias |
|---|---|
| `persistence` | `spring-orm`, `hibernate-core`, `hibernate-entitymanager` |
| `model` | `hibernate-jpa-2.1-api` (sólo el API JPA) |
| `webapp` | `spring-orm` |

Después de modificar el pom: `mvn eclipse:eclipse` y refrescar Eclipse.

### Configuración del EntityManager en WebConfig

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

    // Si ponen esto en prod, hay tabla!!!
    properties.setProperty("hibernate.show_sql", "true");
    properties.setProperty("format_sql", "true");

    factoryBean.setJpaProperties(properties);
    return factoryBean;
}
```

### Cambio de Transaction Manager

Se reemplaza `DataSourceTransactionManager` por `JpaTransactionManager`:

```java
@Bean
public PlatformTransactionManager transactionManager(final EntityManagerFactory emf) {
    return new JpaTransactionManager(emf);
}
```

### Eliminación de DataSourceInitializer / DatabasePopulator

`databasePopulator` y `databaseInitializer` **pueden eliminarse** mientras dejamos que Hibernate administre el schema (con `hbm2ddl.auto = update`). Si se usaban para algo más allá del setup de la BD, podrían mantenerse.

### Implementación del DAO con JPA

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

**Notas:**

- `@PersistenceContext` inyecta el `EntityManager` (es el equivalente JPA del `JdbcTemplate`).
- La query **no es SQL, sino JPQL** (JPA Query Language, basado en HQL — Hibernate Query Language). Usa **nombres de entidades** (`User`) y **nombres de propiedades** (`u.username`), no de tablas/columnas.
- Quitar el `@Repository` del `UserJdbcDao` para que Spring no encuentre dos candidatos para el mismo bean.

### Anotaciones JPA en el modelo

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

    // ... getters / constructor con args
}
```

**Reglas:**

- **`@Entity`** es obligatorio para que Hibernate considere la clase.
- **Constructor default obligatorio**: Hibernate crea instancias por reflection y luego popula las propiedades. Puede ser package-private (no hace falta exponerlo).
- **`@Table(name = "users")`** sólo es necesario si querés evitar el default. Por defecto, la tabla toma el nombre de la clase (`User` → `User`, sin `s`, con casing). Acá queremos seguir usando `users`.
- **`@Column(name = "userid")`** análogo: sólo si el nombre por defecto no sirve. Sin `@Column`, alcanza con tener `@Id`.
- **`@GeneratedValue` + `@SequenceGenerator`**: Hibernate en PostgreSQL crea por defecto **una única secuencia llamada `hibernate_sequence`** y la usa para todas las entidades. Como nosotros ya teníamos `users_userid_seq`, hay que indicarle explícitamente cuál usar.

### Conflicto de dependencias transitivas

Al correr la aplicación aparece un error porque Hibernate trae una dependencia transitiva que entra en conflicto con otra preexistente. Solución: **modificar el pom padre para excluir la dependencia conflictiva** (la clase no detalla cuál — es un caso a resolver puntualmente).

> En el setup con Java 21 los conflictos concretos están detallados en la sección siguiente.

---

## Adaptación a Java 21 (no está en el PDF)

> Esta sección **NO está en el PDF de la cátedra**. Se incluye acá porque el proyecto compila con `<maven.compiler.release>21</maven.compiler.release>` y Hibernate 5.1.0.Final fue liberado en 2016 para Java 7/8 — la combinación necesita workarounds. Material verificado con los apuntes de clase del 27/04 (ver [[Notion Teoricas PAW — Apuntes en vivo]]).

### Por qué la combinación pincha sola

| Problema | Causa |
|---|---|
| Reflection contra módulos JDK | Java 9+ introduce JPMS (módulos) — Hibernate 5.1 hace reflection sobre `java.base/java.lang` y `javax.persistence`, lo que está restringido por defecto desde Java 9. |
| `javax.xml.bind` no compila | JAXB fue **removido del JDK en Java 11**. Hibernate 5.1 lo necesita para algunas operaciones internas. |
| Versiones de Maven plugins viejas no soportan Java 21 | `maven-surefire-plugin` < 3.x y `jetty-maven-plugin` < 9.4.50 no levantan en JDK reciente. |

### Workarounds requeridos

#### 1) `--add-opens` para que Hibernate pueda hacer reflection

En el `pom.xml` padre, configurar `maven-surefire-plugin` (para tests) y `jetty-maven-plugin` (para correr la app):

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <argLine>--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.persistence/javax.persistence=ALL-UNNAMED</argLine>
    </configuration>
</plugin>

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

Sin esto, los tests fallan con `InaccessibleObjectException` y `mvn jetty:run` ni siquiera levanta el contexto Spring.

#### 2) `jaxb-api` explícita (porque JDK 11+ ya no la trae)

En el `pom.xml` padre:

```xml
<properties>
    <javax.xml.version>2.3.1</javax.xml.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>${javax.xml.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Y declararla en `persistence/pom.xml`:

```xml
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
</dependency>
```

#### 3) Mantener `javax.persistence` (no migrar a `jakarta.persistence`)

Hibernate 5.1 usa el namespace **legacy `javax.persistence`** (JPA 2.1). La migración a `jakarta.persistence` recién aparece en Hibernate 6+ y no corresponde en este proyecto. Las dependencias `org.hibernate.javax.persistence:hibernate-jpa-2.1-api` son las correctas para este setup.

### Alternativa: actualizar Hibernate

Si en algún momento se quiere evitar los workarounds, hay que migrar a:

- **Hibernate 5.6.x** (último de la serie 5.x, soporta Java 17+ con menos fricción) — sigue usando `javax.persistence`.
- **Hibernate 6.x** (recomendado para Java 21) — pero usa `jakarta.persistence`, lo cual requiere también migrar Spring de 5.x a 6.x. **Eso es un cambio grande**, no apto para mitad del cuatrimestre.

Para el TP corresponde quedarse con Hibernate 5.1 + los workarounds documentados arriba (que es lo que hizo la cátedra).

---

## Glosario rápido

| Término | Significado |
|---|---|
| **ORM** | Object-Relational Mapper. Mapea objetos ↔ tablas. |
| **JPA** | Java Persistence API. Standard de Java. |
| **Hibernate** | Implementación de JPA (entre otras cosas; predates JPA). |
| **JPQL / HQL** | Query languages basados en entidades, no en tablas. |
| **EntityManager** | El "JdbcTemplate" del mundo JPA. |
| **`@PersistenceContext`** | Inyección del `EntityManager`. |
| **`hbm2ddl.auto = update`** | Hibernate sincroniza el schema en cada arranque (apto en dev). |
| **Impedancia O-R** | El desajuste fundamental entre objetos y tablas. |

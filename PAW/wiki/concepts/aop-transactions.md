---
title: AOP & Transactions
type: concept
created: 2026-04-15
updated: 2026-04-19
tags: [aop, transactions, spring-tx, scheduled, cross-cutting, readonly]
sources: [clase-6-logging-aop.md]
---

# AOP & Transactions

AOP (Aspect Oriented Programming) solves **cross-cutting concerns** — functionality that spans multiple unrelated classes (transactions, audit logging, performance measurement, locks). Spring implements AOP via proxies by default.

---

## How Spring AOP Proxies Work

1. When Spring creates a bean annotated with an AOP annotation (e.g., `@Transactional`), it wraps it in a **Proxy** object.
2. The Proxy implements the same interface as the original bean — it's transparent to the rest of the app.
3. Calls to the bean go through the proxy, which adds cross-cutting behavior around the real implementation.

**Why not inheritance?** DAOs and Services don't have relationships between each other. Forcing them into an inheritance hierarchy would impose future constraints and Java only supports single inheritance.

---

## Proxy Restrictions

Two situations where AOP annotations are **silently ignored**:

1. **Private methods** — proxies only intercept calls to public interface methods. Annotations on private/protected methods do nothing.
2. **Self-calls (`this.method()`)** — calling an AOP-annotated method from within the same class bypasses the proxy entirely. Only external calls are intercepted.

---

## @Transactional

Wraps a method (or entire class) in a database transaction. If an exception propagates out, the transaction rolls back.

### Setup in WebConfig

```java
@EnableTransactionManagement   // on the @Configuration class
// ...

@Bean
public PlatformTransactionManager transactionManager(final DataSource ds) {
    return new DataSourceTransactionManager(ds);
}
```

Dependency:
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>${org.springframework.version}</version>
</dependency>
```

### Usage on Service classes

Se puede anotar la clase entera (todos los métodos en una transacción) o cada método para afinar el modo. El proyecto usa el estilo por método — `readOnly = true` para lecturas, sin flags para escrituras:

```java
@Service
public class UserServiceImpl implements UserService {

    @Override
    @Transactional
    public User createUser(...) { ... }          // escritura — rollback on exception

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(...) { ... } // lectura — puede optimizarse a no-flush

    @Override
    @Transactional
    public void updatePassword(...) { ... }
}
```

`RentServiceImpl` sigue el mismo patrón desde el refactor de auth:

```java
@Override @Transactional(readOnly = true)
public Rent findOwnedByProvider(final Long rentId, final Long providerId) { ... }

@Override @Transactional
public Rent createRent(...) { ... }
```

**`UserDetailsService`** también está anotado `@Transactional(readOnly = true)` — al loguearse, Spring abre una única transacción de sólo lectura para buscar el usuario.

### Por qué `readOnly = true`

- El JdbcTemplate no se auto-flushea sobre lecturas, así que el flag es más importante como señal de intención: "este método no debe escribir".
- Si en el futuro se mueve a Hibernate/JPA, `readOnly = true` evita la detección de dirty state y los flushes implícitos, que son más caros.
- Vuelve explícito qué métodos son puras queries. Un reviewer ve el `readOnly = true` y sabe que no va a mutar BD.

### Why @Transactional belongs on the Service, not the DAO

If `@Transactional` were on DAOs, a business operation that calls multiple DAOs would create multiple separate transactions. A failure in one DAO wouldn't roll back the work done by a previous DAO call.

At the Service level, the entire business operation (multiple DAO calls + any side effects like sending email) runs inside one transaction. If anything fails, everything rolls back.

---

## @Rollback in Tests

```java
@Rollback
@Test
public void testCreate() {
    // Spring rolls back the transaction after the test completes
    // No manual cleanup code needed
}
```

Combined with `@Transactional` on the test class, this is the standard pattern for DAO integration tests — each test runs in its own transaction that is automatically rolled back, leaving the DB clean for the next test.

See [[Testing Practices]] for the full DAO test setup.

---

## @Scheduled

```java
@Scheduled(fixedRate = 5000)
public void recurringTask() {
    // Executes automatically every 5 seconds
}
```

Spring manages the thread scheduling via AOP. Add `@EnableScheduling` to the `@Configuration` class to activate it.

---

## Other AOP Use Cases

- **Audit logging** — log every call to Service methods with user/time/args
- **Performance measurement** — time method execution
- **Lock acquisition** — acquire locks before entering critical sections
- **Security** — Spring Security itself is implemented as an AOP layer (see [[Spring Security]])

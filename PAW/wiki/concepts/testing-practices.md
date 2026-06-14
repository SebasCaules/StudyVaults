---
title: Testing Practices
type: concept
created: 2026-04-11
updated: 2026-04-19
tags: [testing, junit, mockito, hsqldb, best-practices]
sources: [clase-3-spring-jdbc-unit-testing.md, clase-6-logging-aop.md, devolucion-tp1.md]
---

# Testing Practices

All tests use **JUnit 5** (`junit-jupiter-api`). Two testing strategies: Mockito for services, HSQLDB for persistence.

---

## Service Tests (Mockito)

No Spring context loaded — plain JUnit 5 + Mockito.

```java
@ExtendWith(MockitoExtension.class)
public class SomeServiceTest {
    @Mock private SomeDao someDao;
    @InjectMocks private SomeServiceImpl someService;

    @Test
    public void testSomething() {
        // Setup
        when(someDao.findById(1L)).thenReturn(Optional.of(entity));
        // Exercise
        Optional<Entity> result = someService.findById(1L);
        // Assert
        assertTrue(result.isPresent());
    }
}
```

---

## Persistence Tests (HSQLDB)

Use in-memory HSQLDB with `sql.syntax_pgs=true` for partial PostgreSQL compatibility.

```java
@Rollback
@Transactional
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestConfiguration.class)
public class SomeDaoTest {
    @Autowired private SomeDao dao;
    @Autowired private DataSource dataSource;
}
```

`TestConfiguration.java` wires up:
- In-memory `DataSource` (`jdbc:HSQLDB:mem:paw`)
- `DataSourceTransactionManager`
- `DataSourceInitializer` running test `schema.sql`

Each test runs in a transaction that auto-rolls back → isolation.

---

## Good Test Principles

1. **One scenario per `@Test`**
2. **Deterministic** — same result regardless of execution order
3. **Succinct** — one call to class under test, few asserts
4. **Structure** — Setup → Exercise → Assert (Arrange-Act-Assert)
5. `@Mock` reinitializes before each test
6. Never mock JDBC directly (Connection/Statement/ResultSet) — use HSQLDB
7. Never use production database in tests
8. Use `JdbcTestUtils.countRowsInTable()` for DB state assertions

---

## Running Tests

```bash
# All tests
mvn test

# Specific module
mvn test -pl persistence
mvn test -pl services

# Single test class
mvn test -pl persistence -Dtest=UserJdbcDaoTest
```

---

## JUnit 4 Pattern (course material style)

The class slides use JUnit 4 + `@RunWith` instead of JUnit 5 extensions. Both achieve the same goal — the project uses JUnit 5 (`@ExtendWith`). Provided here for reference when reading course code examples:

```java
// Service test — JUnit 4 style
@RunWith(MockitoJUnitRunner.class)
public class UserServiceImplTest {
    @InjectMocks
    private UserServiceImpl userService = new UserServiceImpl();
    @Mock
    private UserDao mockDao;
}

// DAO test — JUnit 4 style
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class)
@Sql("classpath:schema.sql")
public class UserJdbcDaoTest {
    @Before
    public void setUp() {
        JdbcTestUtils.deleteFromTables(jdbcTemplate, "users");
    }
}
```

`@Sql` runs the specified SQL before each test. The project uses `DataSourceInitializer` in `TestConfig` instead.

---

## Current Coverage

See [[Tests]] for the full inventory (~80+ tests across persistence and service layers).

---

## Behavior vs Implementation (TP1 feedback)

### Error conceptual grave: testear implementación con `verify()` / `spy`

`Mockito.verify()` y `spy` comprueban que se llamó a un método interno — eso es validar la *implementación*, no el *comportamiento observable*. Si refactorizás el internals, el test falla aunque el comportamiento sea correcto.

```java
// INCORRECTO — valida implementación
@Test
public void testRegisterSendsEmail() {
    userService.register("john@example.com", "pass");
    verify(mailService, times(1)).sendWelcome(any()); // esto es lo que el corrector penaliza
}

// CORRECTO — valida comportamiento (resultado que el resto del sistema observa)
@Test
public void testRegisterCreatesUser() {
    Optional<User> result = userService.register("john@example.com", "pass");
    assertTrue(result.isPresent());
    assertEquals("john@example.com", result.get().getEmail());
}
```

La única excepción válida para `verify()` es cuando el efecto secundario **es** el comportamiento a verificar y no hay otro observable (ej: un service de notificaciones cuyo único contrato es enviar el mail).

### Error grave: tests de persistencia sin asserts de DB

Los tests del DAO deben verificar el estado de la base de datos usando `JdbcTestUtils`:

```java
// INCORRECTO — no verifica nada
@Test
public void testInsert() {
    userDao.create("john@example.com", "pass");
    // sin asserts — el test siempre pasa
}

// CORRECTO — verifica que se insertó 1 fila
@Test
public void testInsert() {
    assertEquals(0, JdbcTestUtils.countRowsInTable(jdbcTemplate, "users"));
    userDao.create("john@example.com", "pass");
    assertEquals(1, JdbcTestUtils.countRowsInTable(jdbcTemplate, "users"));
}
```

### Usar JUnit 5, nunca JUnit 3

```java
// INCORRECTO — JUnit 3 (herencia de TestCase, detectado en TP1)
public class UserServiceTest extends TestCase { ... }

// CORRECTO — JUnit 5
@ExtendWith(MockitoExtension.class)
public class UserServiceTest { ... }
```

(source: devolucion-tp1.md)
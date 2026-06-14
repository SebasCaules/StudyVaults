---
title: Clase 3 — Spring JDBC y Unit Testing
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [spring-jdbc, testing, mockito, hsqldb, datasource, postgresql]
sources: [PAW - clase 3.pdf]
---

# Clase 3 — Spring JDBC y Unit Testing

**Archivo original:** `PAW - clase 3.pdf`

## Takeaways principales

- Persistencia con `JdbcTemplate` y `SimpleJdbcInsert` contra PostgreSQL.
- `RowMapper<T>` para convertir `ResultSet` a objetos de dominio.
- `DataSource` configurado como `@Bean` en `WebConfig`.
- Tests de servicios con Mockito (`@Mock`, `@InjectMocks`, `MockitoJUnitRunner`).
- Tests de DAOs con HSQLDB en memoria + Spring Test + `@Sql` + `JdbcTestUtils`.

## Notas detalladas

### Dependencias (pom padre)

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${org.springframework.version}</version>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.2.5</version>
</dependency>
<!-- Testing -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.hsqldb</groupId>
    <artifactId>hsqldb</artifactId>
    <version>2.3.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>2.25.1</version>
    <scope>test</scope>
</dependency>
```

### DataSource en WebConfig

```java
@Bean
public DataSource dataSource() {
    final SimpleDriverDataSource ds = new SimpleDriverDataSource();
    ds.setDriverClass(org.postgresql.Driver.class);
    ds.setUrl("jdbc:postgresql://localhost/paw");
    ds.setUsername("root");
    ds.setPassword("root");
    return ds;
}
```

La BD se crea con: `createdb paw -O root`

### UserJdbcDao

```java
@Repository
public class UserJdbcDao implements UserDao {
    private JdbcTemplate jdbcTemplate;
    private final SimpleJdbcInsert jdbcInsert;

    private static final RowMapper<User> ROW_MAPPER = (rs, rowNum) ->
        new User(rs.getString("username"), rs.getInt("userid"));

    @Autowired
    public UserJdbcDao(final DataSource ds) {
        jdbcTemplate = new JdbcTemplate(ds);
        jdbcInsert = new SimpleJdbcInsert(jdbcTemplate)
            .withTableName("users")
            .usingGeneratedKeyColumns("userid");
    }

    @Override
    public User findById(final long id) {
        final List<User> list = jdbcTemplate.query(
            "SELECT * FROM users WHERE userid = ?", ROW_MAPPER, id);
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public User create(final String username) {
        final Map<String, Object> args = new HashMap<>();
        args.put("username", username);
        final Number userId = jdbcInsert.executeAndReturnKey(args);
        return new User(username, userId.longValue());
    }
}
```

### Schema SQL

`src/main/resources/schema.sql` (PostgreSQL — prod):
```sql
CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    username varchar(100)
);
```

`src/test/resources/schema.sql` (HSQLDB — tests):
```sql
CREATE TABLE IF NOT EXISTS users (
    userid INTEGER IDENTITY PRIMARY KEY,
    username varchar(100)
);
```

HSQLDB usa `INTEGER IDENTITY` en lugar de `SERIAL`.

### DataSourceInitializer en WebConfig (para prod)

```java
@Value("classpath:schema.sql")
private Resource schemaSql;

@Bean
public DataSourceInitializer dataSourceInitializer(final DataSource ds) {
    final DataSourceInitializer dsi = new DataSourceInitializer();
    dsi.setDataSource(ds);
    dsi.setDatabasePopulator(new ResourceDatabasePopulator(schemaSql));
    return dsi;
}
```

### Unit testing de servicios (Mockito)

```java
@RunWith(MockitoJUnitRunner.class)
public class UserServiceImplTest {
    @InjectMocks
    private UserServiceImpl userService = new UserServiceImpl();

    @Mock
    private UserDao mockDao;

    @Test
    public void testCreate() {
        Mockito.when(mockDao.create(eq(USERNAME), eq(PASSWORD)))
               .thenReturn(new User(1, USERNAME, PASSWORD));
        Optional<User> result = userService.create(USERNAME, PASSWORD);
        Assert.assertTrue(result.isPresent());
        Assert.assertEquals(USERNAME, result.get().getUsername());
    }
}
```

- `@Mock` → crea mock nuevo antes de cada test (equivale a `@Before` + `Mockito.mock(...)`)
- `@InjectMocks` → inyecta los mocks respetando los `@Autowired`

### Unit testing de DAOs (Spring Test + HSQLDB)

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class)
@Sql("classpath:schema.sql")
public class UserJdbcDaoTest {
    @Autowired private DataSource ds;
    @Autowired private UserJdbcDao userDao;
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() {
        jdbcTemplate = new JdbcTemplate(ds);
        JdbcTestUtils.deleteFromTables(jdbcTemplate, "users");
    }

    @Test
    public void testCreate() {
        final User user = userDao.create(USERNAME, PASSWORD);
        assertNotNull(user);
        assertEquals(USERNAME, user.getUsername());
        assertEquals(1, JdbcTestUtils.countRowsInTable(jdbcTemplate, "users"));
    }
}
```

`TestConfig` (en mismo paquete que el test):
```java
@ComponentScan({ "ar.edu.itba.paw.persistence" })
@Configuration
public class TestConfig {
    @Bean
    public DataSource dataSource() {
        final SimpleDriverDataSource ds = new SimpleDriverDataSource();
        ds.setDriverClass(JDBCDriver.class);
        ds.setUrl("jdbc:hsqldb:mem:paw");
        ds.setUsername("ha");
        ds.setPassword("");
        return ds;
    }
}
```

- `JdbcTestUtils.deleteFromTables()` → limpia sin depender de queries propias
- `JdbcTestUtils.countRowsInTable()` → verifica filas sin depender del DAO

---
title: Dependency Injection
type: concept
created: 2026-04-11
updated: 2026-04-11
tags: [spring, dependency-injection, di, autowired]
sources: []
---

# Dependency Injection

All service and DAO beans are Spring-managed. Constructor injection is preferred; field injection via `@Autowired` is also used.

---

## Stereotype Annotations

| Annotation | Module | Use |
|------------|--------|-----|
| `@Controller` | webapp | Spring MVC controllers |
| `@Service` | services | Service implementations |
| `@Repository` | persistence | DAO implementations |
| `@Configuration` | webapp/persistence | Config classes |

---

## Rules

1. **NEVER** instantiate dependencies with `new` inside controllers or services
2. Use `@Autowired` always
3. Multiple implementations of same type → use `@Primary` or `@Qualifier`
4. Constructor injection preferred for DAOs (required for `DataSource` → `JdbcTemplate`/`SimpleJdbcInsert`)

---

## Why `runtime` Scope Matters

The `services` module is declared with **scope runtime** in `webapp/pom.xml`. This means:
- Eclipse/IDE compiles fine with the import
- But `mvn clean compile` **fails** if you write `new ServiceImpl()`
- This forces you to always inject via interfaces, enforcing the contract/implementation split

Same applies to `persistence` from `services`.

---

## Example Pattern

```java
// In webapp (controller) — depends on interface only
@Controller
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
}

// In services — depends on DAO interface only
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductDao productDao;

    @Autowired
    public ProductServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }
}

// In persistence — receives DataSource
@Repository
public class ProductJdbcDao implements ProductDao {
    private final JdbcTemplate jdbcTemplate;
    private final SimpleJdbcInsert jdbcInsert;

    @Autowired
    public ProductJdbcDao(DataSource ds) {
        this.jdbcTemplate = new JdbcTemplate(ds);
        this.jdbcInsert = new SimpleJdbcInsert(ds)
            .withTableName("products")
            .usingGeneratedKeyColumns("id");
    }
}
```

---

## Ver también

- [[Spring Configuration]] — dónde se declaran los beans y el `@ComponentScan` que los detecta.
- [[Maven Module Structure]] — el scope `runtime` del módulo `services` que hace fallar `new ServiceImpl()`.
- [[Persistence (Spring JDBC)]] — inyección de `DataSource` por constructor en los DAOs.
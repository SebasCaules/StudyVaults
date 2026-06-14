---
title: Tests
type: entity
created: 2026-04-11
updated: 2026-05-28
tags: [testing, junit, mockito, hsqldb]
sources: []
---

# Tests

Inventario actual: **9 DAO test classes** (`persistence/src/test/`, mix de `*JpaDaoTest` para los DAOs migrados a JPA y `*JdbcDaoTest` para los legacy) + **13 service test classes** (`services/src/test/`) + **1 webapp test** (`CommaDecimalEditorTest`) + **1 enum test** (`CurrencyTest`). Todos JUnit 5, sin `@RunWith` legacy.

## Persistence Tests (HSQLDB + populator.sql)

Configuración: `TestConfiguration.java` levanta HSQLDB en memoria con `sql.syntax_pgs=true` y corre `schema.sql` + `populator.sql` al boot.

| Clase | Cobertura |
|---|---|
| `UserJpaDaoTest` | CRUD, lookup por email/id, tokens (verification + reset), updates por field, búsqueda paginada, **admin invite tokens** (`createInvitedAdmin`, `findByAdminInviteToken`, `consumeAdminInvite` — #20) |
| `ProductJpaDaoTest` | CRUD, paginación con filtros (`CatalogCriteria`), `findOwnedBy`, `updateStatus`, **`findByProvider` con filtros server-side** (status / category / search query), cobertura de PENDING_LOCATION/UNDER_REVIEW |
| `ProductImagesJdbcDaoTest` | Junction product↔image, `position`, delete |
| `ImageJdbcDaoTest` | Insert binario + `findById` |
| `BlockJdbcDaoTest` | Crear bloque, listar bloques activos, integridad fechas |
| `PriceJdbcDaoTest` | Default + especiales, overlap, `getCurrentPrice`, `getEffectivePricesForRange` |
| `RentJpaDaoTest` | Status transitions, dashboards renter/provider, paginación 1+1, **`updatePaymentMethod`** (#10) |
| `ReviewJdbcDaoTest` | Insert con UNIQUE rent_id, agregados (avg/count) por producto |
| `FavoriteJdbcDaoTest` | Toggle (insert/delete), `existsByUserAndProduct`, listado paginado |

Todas las clases anotadas con `@Rollback` + `@Transactional` + `@ExtendWith(SpringExtension.class)` + `@ContextConfiguration(classes = TestConfiguration.class)`.

### Reglas que aplican (cátedra-graded)

- Read tests no insertan: `Arrange` vacío o solo declara IDs/valores que ya están en `populator.sql`.
- Write tests assertan con `JdbcTestUtils.countRowsInTableWhere(jdbcTemplate, TABLE, "condition")`.
- Write tests no usan otro método del mismo DAO en `Arrange` ni `Assert`.
- Pagination tests con `private static final int PAGE_SIZE = 2;`, 8 escenarios canónicos (ver `docs/testing.md`).
- Tabla y constantes en class fields (`USERS_TABLE = "users"`).

## Service Tests (Mockito)

| Clase | Resumen |
|---|---|
| `UserServiceImplTest` | Register flow, password hashing, updates granulares, `completeGuestRegistration` |
| `EmailVerificationServiceImplTest` | Issue token, cooldown, verify (válido/expirado/inválido) |
| `PasswordResetServiceImplTest` | Request reset (no leakea), reset con token (válido/expirado) |
| `ProductServiceImplTest` | Validación talla/categoría, ownership, status transitions |
| `ProductImageServiceImplTest` | Junction product↔imágenes |
| `PriceServiceImplTest` | `getCurrentPrice`, especiales con rangos, overlap, `getEffectivePricesForRange` |
| `BlockServiceImplTest` | Crear bloque |
| `RentServiceImplTest` | `createRent`, ownership, transiciones de estado, `groupRentsByCategory` |
| `ReviewServiceImplTest` | 1×rent (`AlreadyReviewedException`), `RentPeriodNotEndedException` |
| `FavoriteServiceImplTest` | Toggle, no-self-favorite, `showFavoriteStatus` |
| `ImageServiceImplTest` | Wrapper |
| `EmailServiceImplTest` | Validación de payloads, locale del destinatario, error logging |
| `LocationServiceImplTest` | Approval flow + cascada de activación (`productService.activatePendingForLocation`), ownership admin |

> Updates a tests existentes: `UserServiceImplTest` cubre `inviteAdmin` + `registerOrLinkGuest` (#20); `RentServiceImplTest` cubre CBU gating en `approveRent` (#10), block-end check en `initiateReturn` y el branching UPLOAD/CASH de `initiatePayment`; `ProductServiceImplTest` cubre `activatePendingForLocation` y `getProductsByProvider` con filtros.

Setup: `@ExtendWith(MockitoExtension.class)` + `@Mock` para los DAOs + `@InjectMocks` para la impl. Sin `@ContextConfiguration` ni Spring.

### Reglas críticas

- **Cero `Mockito.verify()` / `Mockito.spy()`.** Todo se assertea por valor de retorno. Cuando no había return útil, varios services se refactorizaron para retornar `boolean` o el objeto creado (commit `111c0c67`).
- AAA con comentarios `// 1. Arrange` / `// 2. Exercise` / `// 3. Assert`.
- Variables de resultado `final`.
- Mocks con `Mockito.when(...).thenReturn(...)`. `lenient()` solo donde el stub es opcional.
- Tras el refactor de email try/catch (commit `036ae54d` + `3975e1d1`), los tests de `RentServiceImpl` no validan mas el bloque `try/catch` interno del email.

## Webapp tests

- `CommaDecimalEditorTest` — `PropertyEditor` para parsear "1,50" como BigDecimal en forms multilenguaje.

## Modelos

- `CurrencyTest` — sanity check del enum (display names, `valueOf`).

## Naming convention

`test<MethodName>When<Condition>Returns<ExpectedOutcome>` — e.g. `testFindByIdWhenUserExistsReturnsUser`. Ver [[Testing Practices]].

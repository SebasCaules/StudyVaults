---
title: Devolución TP1 — Caso de un Grupo
type: source
created: 2026-05-27
updated: 2026-06-18
tags: [feedback, tp1, correcciones, accionable]
sources: [Devolucion TP1.pdf]
---

# Devolución TP1 — Caso de un Grupo

Devolución de la cátedra sobre la entrega de TP1 de un grupo evaluado (archivo `raw/Correcciones/Devolucion TP1.pdf`). Este documento es **distinto** de la devolución previa ya ingerida en [[devolucion-tp1]] (las notas no coinciden — esta corresponde a otra instancia de evaluación). Cubre 14 grupos.

**La nota asignada fue 6** — sin puntos por seguimiento pendientes.

---

## Devolución del grupo evaluado — transcripción completa

### Demo

- No escapan `%` ni `_` (búsquedas con `LIKE`, el usuario puede alterar el patrón).
- Cuando pongo precio especial por fecha se me pisa el precio por defecto.
- Estaría bueno que se pueda compartir comprobante por PDF.
- Cuando no hay CBU no llega el comprobante pero la UI no indica nada de eso.
- Las acciones terminales (eliminar, pausar) deberían tener modal de confirmación.
- Falta un CTA y un mensaje en el search de users y productos del admin (estado vacío).

### Código

#### POM / dependencias

- `commons-fileupload` está declarado con `<version>1.5</version>` **hardcodeada** dentro de `webapp/pom.xml` en vez de centralizarse en `<dependencyManagement>` del POM padre. Todas las versiones de terceros tienen que vivir en el POM padre para evitar drift entre módulos.
- El POM padre define `javax.servlet-api` en `<dependencyManagement>` **sin `<scope>provided</scope>`**. El scope `provided` tiene que estar una sola vez en el padre para garantizar que ningún módulo termine empaquetando el JAR del servlet API al WAR final (el contenedor ya lo aporta).

#### Lógica de negocio en controllers (error conceptual grave)

- `DashboardController.computeReviewableRentIds` decide en el controller qué rents son reseñables. La regla "rent reseñable = finalizada y no reviewed todavía" **es de dominio** y tiene que vivir en `ReviewService`. **Esto es un error conceptual grave.**
- `CatalogController.parseCategoryFilters` interpreta los query params aplicando reglas de dominio dentro del controller: `Category.usesSize()` para decidir si la categoría lleva size, `Size.isValidForCategory(category)` para descartar combinaciones inválidas. La traducción de params a un `CatalogCriteria` con esas reglas **es lógica de búsqueda y pertenece al service**.
- `ImageController.detectContentType` inspecciona magic bytes del archivo (PNG: `89 50 4E 47`, JPEG, GIF, WebP) para deducir el `Content-Type`. **Procesamiento binario que pertenece a un servicio o componente especializado, no al controller.**
- `CatalogController.buildFilterQueryString` serializa el query string de filtros con `StringBuilder` y `appendMulti` / `appendParam` y lo expone como `${filterQueryString}` para que la vista lo concatene en la URL de paginación. **Doble problema**: (1) el browser ya serializa eso solo si se envuelve search-bar + filter-panel + sort en un único `<form action="/catalog" method="get">`, y (2) los valores se concatenan **SIN `URLEncoder.encode`**, así que un search/category con `&`, `=` o espacios rompe los links de paginación. **Reemplazar por un `<form method="get">` o usar `<c:url><c:param></c:url>` que ya hace URL-encoding.**

#### Errores / mapeos

- `ErrorController` mapea `/error/403`, `/error/404` y `/error/500` con `@RequestMapping("/error/403")` **sin declarar el `method`**.

#### Seguridad / autorización

- La validación de **ownership** está implementada **manualmente dentro de los services** en vez de centralizarse en la capa de seguridad. **Esto viola la separación de responsabilidades.** Si bien la programación defensiva dentro del service es deseable, el acceso debe restringirse antes a la entrada.

#### Persistencia

- Hay métodos que iteran un ciclo llamando múltiples veces a la base de datos. **Potencial problema de performance (N+1).**
- En `ReviewJdbcDao` el `RowMapper<Review>` se define como **lambda anónima inline** en `findByProductId` y se duplica casi idéntico en `save`. **Extraer a `private static final RowMapper<Review> REVIEW_ROW_MAPPER = (rs, n) -> { ... };`** y reusarlo desde ambos métodos, como ya lo hacen los demás DAOs del proyecto.
- `ReviewJdbcDao.findByProductId` hace `JOIN` a la tabla `users` y reconstruye una entidad `User` (con builder) inline dentro de su `RowMapper`, **duplicando la lógica de mapeo que ya vive en `UserJdbcDao`**. Si mañana cambia un campo de `User` el mapper de `Review` queda desincronizado en silencio y no hay test que lo agarre. **Los RowMappers se pueden compartir y reutilizar para evitar esto.**
- No escapan `%` ni `_` en el search (mismo bug que aparece en la demo).

#### Tests (graves problemas)

- Cuatro tests en `ProductServiceImplTest` usan `AtomicReference` dentro de `doAnswer` para capturar los argumentos pasados al mock y luego hacer asserts sobre ellos (ej.: `testCreateProductWhenValidReturnsProduct` captura las bytes pasadas). **Es reimplementar `Mockito.verify`. Esto verifica la implementación y no el comportamiento.**
- Hay tests del service que solo validan `Assertions.assertDoesNotThrow(...)` **sin validar el comportamiento prometido por el nombre del test**.
- `CurrencyTest.testFromSlugWhenAllValuesRoundtrip` ejecuta `Currency.fromSlug` tres veces (una por cada valor del enum) en un único `@Test`. Si falla para alguno, JUnit reporta el método entero sin indicar qué valor falló, y un fallo aborta el loop tapando otros posibles fallos. **Convertir a `@ParameterizedTest` con `@EnumSource(Currency.class)`.**

#### Otros

- Los `aria-label`s están hardcodeados en inglés, deberían también estar internacionalizados.

### Seguimiento

No resta puntos por seguimiento.

### Nota

**6**

---

## Resumen de categorías de error

| Categoría | Cantidad | Severidad |
|-----------|----------|-----------|
| Lógica de negocio en controllers | 4 | Grave (conceptual) |
| Configuración POM / dependencias | 2 | Medio |
| Persistencia / N+1 / RowMappers | 4 | Grave |
| Tests no unitarios / testean implementación | 3 | Grave |
| Seguridad declarativa / ownership | 1 | Grave |
| HTTP / URL encoding / mapeos | 2 | Medio |
| UX / mensajes / i18n | 6 | Menor |
| Bugs funcionales (precio especial, CBU, escapes) | 4 | Medio |

---

## Patrones que se castigan en TODA la cohorte (transversal)

Para contextualizar, estos son patrones que aparecen como **error conceptual grave** en múltiples grupos — no solo en este grupo. Conviene cruzarlos con [[devolucion-tp1]] (otra devolución) y [[correcciones-segunda-entrega]]:

1. **Lógica de negocio en controllers** (grupos 2, 4, 5, 6, 7, 8, 9, 10, 12, 14 — casi todos).
2. **Validaciones manuales en controllers en vez de Bean Validation** (grupos 4, 6, 8, 9, 10, 14).
3. **Chequeos de autorización en controllers en vez de Spring Security** (grupos 4, 6, 7, 8, 9, 10, 11, 12).
4. **N+1 queries** (grupos 1, 2, 6, 7, 9, 10, 12, 14).
5. **Tests con `AtomicReference`/`AtomicBoolean` para reimplementar `Mockito.verify`** (grupos 4, 9, 10, 12, 14).
6. **Tests no unitarios (usan el mismo DAO para setup)** (grupos 2, 4, 6, 7, 9).
7. **Hardcoded secrets / remember-me key débil** (grupos 3, 6, 11, 13).
8. **`RowMapper` como lambda inline en vez de `private static final`** (grupos 3, 6, 10).
9. **No escapan `%` ni `_` en búsquedas con `LIKE`** (grupos 6, 9, 10, 14).
10. **Hardcoded text sin i18n** (grupos 3, 6, 9, 10, 14).
11. **Paginación / filtros / ordenamiento en memoria en vez de SQL** (grupos 1, 8, 11, 12, 14).
12. **Servicios que dependen de DAOs de otras entidades** (grupos 5, 9, 12).
13. **`@Transactional(readOnly=true)` ausente en métodos de lectura** (grupos 2, 5, 6, 13).

---

## Cross-references

- [[devolucion-tp1]] — devolución previa (12 grupos, otra evaluación).
- [[devolucion-tp1-referencia-15-grupos]] — referencia de 15 grupos.
- [[correcciones-segunda-entrega]] — feedback general de segunda entrega.
- Plan accionable para una codebase Spring MVC: ver `wiki/analyses/plan-correcciones-tp1-grupo10.md`.

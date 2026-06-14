---
title: Devolución TP1 — Feedback Primera Entrega
type: source
created: 2026-04-19
updated: 2026-04-19
tags: [feedback, tp1, correcciones, best-practices, errores-comunes]
sources: [Primera Entrega - Devolución.pdf]
---

# Devolución TP1 — Feedback Primera Entrega

Documento de correcciones del TP1 para los 12 grupos del curso PAW 2026-1C. Cubre observaciones sobre **Demo** (funcionalidad y UX), **Código** (calidad y arquitectura) y **Seguimiento** (planificación en Plane/Linear).

---

## Notas por grupo

| Grupo | Nota |
|-------|------|
| 1 | 7 |
| 2 | 7 |
| 3 | 5 (entrega tardía −14 min) |
| 4 | 6 |
| 5 | 5 |
| 6 | 7 |
| 7 | 7.5 |
| 8 | 4 |
| 9 | 8 |
| 10 | 7 |
| 11 | 8 |
| 12 | — (página cortada) |

---

## Errores graves recurrentes

Estos aparecen en múltiples grupos y son penalizados explícitamente como **"error grave"** o **"error conceptual grave"**:

### XSS — imprimir sin escapar en JSP (grupos 4, 6, 8)
Imprimir valores de usuario directamente en el JSP con `${var}` o concatenaciones sin `<c:out>` genera vulnerabilidades XSS. Ver [[JSP Views]] — sección XSS Prevention.

### Lógica de negocio en controllers (grupos 3, 4, 8)
Los controllers deben delegar toda lógica al service. Hacer validaciones de negocio, joins en Java o llamadas directas a múltiples servicios desde el controller es error conceptual grave. Ver [[Controllers & Validation]].

### Tests que validan implementación (grupos 4, 5, 10)
Usar `Mockito.verify()` o `spy` para comprobar que se llamó a cierto método valida la *implementación*, no el *comportamiento*. Es error conceptual grave. Ver [[Testing Practices]].

### Joins en Java en lugar de SQL (grupos 3, 4)
Iterar resultados en Java para combinar datos de distintas tablas genera N+1 queries. Debe resolverse con JOINs en la query SQL. Ver [[DAOs (Persistence Layer)]].

### Service referenciando capa webapp (grupo 8)
Un `EmailServiceImpl` que referencia templates o recursos que sólo existen en `webapp` viola el modelo de capas. La capa `services` no debe conocer nada de `webapp`. Es error conceptual grave.

### Loguear a stdout en producción (grupos 5, 8)
`System.out.println`, `exception.printStackTrace()`, o logs a nivel `Info`/`Debug` en producción sin un logger configurado correctamente. Ver [[Logging (Logback / SLF4J)]].

### ConcurrentMapCacheManager para imágenes (grupo 10)
No tiene eviction ni TTL — si se cachean suficientes imágenes, el sistema se cae por OutOfMemory. Error grave de configuración.

---

## Errores de código frecuentes

### Arquitectura de capas
- `schema.sql` en el módulo `webapp` en lugar de en `persistence` (grupos 1, 4, 9)
- Clases de `java.sql.*` usadas fuera de la capa de persistencia (grupos 3, 5, 7)
- Controladores hacen try-catch de excepciones — deben usar `@ControllerAdvice` + `@ExceptionHandler` (grupos 4, 5)
- Implementar servicios en la capa web (grupo 8) — violación del modelo jerárquico

### Spring Security
- Control de acceso solo por rol (rutas), sin chequeo de ownership del recurso (grupos 4, 5)
- Checks de acceso duplicados: en `WebAuthConfig` Y con `@PreAuthorize` en controllers — debe ser consistente (grupos 5, 10)
- Chequeos manuales en JSPs en lugar de usar `spring-security-taglibs` (grupo 6)
- No usar `accountNonLocked` del `UserDetails` para bloquear usuarios, validarlo manualmente (grupo 10)

### Validación
- Validar forms a mano en el controller en lugar de usar custom validators (grupos 1, 3)
- Validaciones en capa service sin reflejo en los forms → catch de excepciones para mostrar errores en lugar de `BindingResult` (grupo 1)
- Abusar de validaciones HTML5 sin contraparte en backend (grupo 3)
- No validar `@RequestParam` / query parameters (ej: `pag=-1`) (grupos 3, 5)

### Internacionalización (i18n)
- Usar `LocaleContextHolder` (locale del actor) para enviar emails en lugar del locale del destinatario (grupos 1, 5, 6)
- Modelos con fechas formateadas como String — el formato es responsabilidad de la vista (grupos 6, 10)
- Concatenar textos en la vista en lugar de usar interpolación i18n (grupos 6, 8)
- Mensajes de error sin internacionalizar (grupo 5)

### Magic strings y enums
- Usar listas de Strings para días de la semana donde debería haber un enum (grupo 1)
- `orderBy` como String en lugar de enum (grupo 1)
- El string `tab` como parámetro en lugar de enum (grupo 9)
- Múltiples magic strings repetidos a lo largo de todas las capas (grupo 2)

### `@Transactional`
- No usar `@Transactional(readOnly = true)` en métodos que sólo leen (grupos 3, 5)
- Usar `@Transactional` en muy pocos métodos (grupo 4)

### `SecurityContextHolder`
- Uso inconsistente: a veces en `webapp` para pasar el userId al service, a veces directamente en el service (grupo 4)
- Correcto: obtener el usuario en un `@ModelAttribute` del controller o `@ControllerAdvice`, y pasarlo como parámetro al service

### Primitivos y Optional
- Boxed primitives mal usados → auto-unboxing genera `NullPointerException` (grupos 3, 4, 5, 6)
- `Optional` como campo de clase — incorrecto. `Optional` es sólo para retorno de funciones (grupo 10)
- Inconsistencia en representar "no existe": `null`, `Optional.empty()` y `id = -1` mezclados (grupos 1, 11)

### Maven / Dependencias
- Versiones de dependencias definidas en el pom hijo en lugar del padre (grupo 1)
- Uso de `spring-boot` (que no es parte del stack del curso) (grupo 1)
- Archivos de configuración de IDE (`.vscode`, `.mvn` vacíos) commiteados (grupo 1)

### Otros
- `$`{pageContext.request.contextPath}/ en lugar de `<c:url>` (grupo 1) — ver [[JSP Views]]
- URL de la aplicación hardcodeada — desacoplar con variable de entorno/properties (grupos 1, 5)
- Loguear a nivel `debug` en producción (grupo 1)
- Modificadores de acceso: métodos públicos que deberían ser privados (grupo 4)
- DTOs sin builders ni métodos `.fromModel()` (grupo 1)
- Nombres de clases que no siguen convenciones Java (`Relation_Task_TaskSchedule`) (grupo 2)
- Clases `Utils` instanciables — revisar Effective Java ítem 4 (grupo 7)
- Usar `[]` en lugar de `List` — revisar Effective Java ítem 28 (grupo 5)

---

## Errores en Testing

- Usar JUnit 3 (no JUnit 5) — grupo 2
- Tests de persistencia que no validan el estado de la DB (grupo 2) — error grave
- Todos los tests de persistence comentados (grupo 3)
- Tests de service con múltiples `replyToEvent`, `delete`, `update` sin asserts — mal diseño de contrato (grupo 10)
- `assertEquals` en resultado de creación sin sobrescribir `equals` → compara identidad, no igualdad (grupo 10)
- Usar `Mockito.spy` para validar implementación en lugar de comportamiento (grupos 4, 5) — error conceptual grave

---

## Observaciones de Demo / UX recurrentes

- Falta feedback visual tras realizar acciones (grupos 5, 7)
- Mails básicos sin CTA claro (grupos 4, 9)
- No hay recuperación de contraseña (grupo 1)
- Al cambiar contraseña no pide la contraseña actual (grupos 5, 7)
- Mensajes i18n con keys sin resolver (ej: `El nombre del proceso debe tener hasta processName caracteres`) (grupo 2)
- Query params no validados → UX rota con `pag=-1` (grupo 3)
- Flujos sin salida o sin login innecesarios (grupos 3, 4)

---

## Observaciones de Seguimiento

- Tareas sin tipo definido (feature/chore/bug) (grupo 2)
- Chores que en realidad son features (grupos 2, 7, 10)
- Bugs no marcados como bugs (grupo 5)
- Descripciones de chores poco claras, ej: "Reformular modelos", "Deuda técnica" (grupos 5, 7)

---

## Puntos positivos destacados

- Grupo 1: catchean tipo de archivo en subida de imagen, precio promedio de reviews, link de maps
- Grupo 7: buena cobertura de tests, buen asignar jugadores por estadísticas
- Grupo 9: nota 8, ok planificación
- Grupo 11: filtros activos, UI agradable, mails bien (i18n + CTA)

---

Ver [[Errores Comunes TP1]] para la guía accionable derivada de este documento.

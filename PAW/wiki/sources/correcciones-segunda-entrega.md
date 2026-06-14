---
title: Correcciones Segunda Entrega (TP2)
type: source
created: 2026-05-19
updated: 2026-05-19
tags: [feedback, tp2, correcciones, best-practices, errores-comunes, segunda-entrega]
sources: [Segunda Entrega - Devolución.pdf, fee3e87d-efbd-4136-bcd8-750ef00de6e4_Devolucin_TP2.pdf]
---

# Correcciones Segunda Entrega (TP2)

Consolidado de las **dos devoluciones oficiales** del TP2:

- **Corrector A** — `Segunda Entrega - Devolución.pdf` — 17 grupos.
- **Corrector B** — `fee3e87d-...Devolucin_TP2.pdf` — 15 grupos.

Cada grupo tiene tres secciones: **Demo**, **Código** y **Seguimiento**, más la **Nota** final con el promedio (TP1 + TP2).

> La cátedra **penaliza explícitamente la reincidencia**: errores marcados en TP1 que aparecen en TP2 reciben el comentario `"Esto ya se marcó en la primer entrega"` y bajan nota más fuerte.

---

## Tabla de notas TP2

| Grupo | Nota A | Prom. A | Nota B | Prom. B |
|-------|--------|---------|--------|---------|
| 1 | 3 | 5 | 8 | 7 |
| 2 | 6 | 6.5 | 7 | 7 |
| 3 | 1 | 3 | 4 | 5 |
| 4 | 1 | 3.5 (tarde 20:52) | 4 | 4.5 |
| 5 | 8 | 6.5 | 6 | 6.5 |
| 6 | 8 | 7.5 | 6.5 | 6 (+0.5 seguim. TP1) |
| 7 | 7 | 7 | 4 | 3 |
| 8 | 6 | 5 | 8 | 8 |
| 9 | 9 | 8.5 | 7 | 7 |
| 10 | 8 | 7.5 | 6 | 5.5 |
| 11 | 7 | 7.5 | 5 | 5.5 |
| 12 | 9 | 7.5 | 4 | 6 |
| 13 | 9 | 7 | 6 | 6 |
| 14 | 5 | 6.5 | 6 | 6.5 |
| 15 | 5 | 6 | 8 | 8 |
| 16 | 8 | 7 | — | — |
| 17 | 7 | 7.5 | — | — |

---

# Corrector A — `Segunda Entrega - Devolución.pdf`

## Grupo 1 (restaurantes/reservas)

**Demo:**
- Falta volver para atrás en anuncios.
- Falta eliminar filtros.
- Chips en la página de restaurante no son clickeables (en la búsqueda sí).
- Hacer reserva no está en lugar claro, escondido en solapa de información.
- No hay notificación explícita de los announcements (ni mail al estar suscrito ni aviso in-app).
- No hay edición de reseña (se pueden agregar extra cada 7 días — decisión de negocio rara).
- Falta confirmación de eliminación de review.
- No hay mail de que te borraron una reseña.
- No hay razón de baneo para el dueño en la página (solo avisan por mail), pero sí aparece que está baneado.
- Podría mejorarse el UX de selección de horario de atención.
- Podría haber una página dedicada a administración de reservas (mesero que valida).
- Puedo acceder al `/ban` de un restaurante a pesar de no ser mod o admin (tira 403 al POST).
- Máximo de reservas: 10 personas — número arbitrario, debería configurarse por restaurante.

**Código:**
- Siguen teniendo `schema.sql` a nivel webapp. **Este es un error mencionado en devolución TP1.**
- Varios mal usos de excepciones / manejo planos (o `IllegalArgumentException`) en vez de custom.
  - Catchean `NoSuchElementException` en `UserDetailsService` (es RuntimeException de estructura de datos, no apropiado).
  - `ExceptionHandler` maneja `DataAccessException` y `BusinessException` pero recibe `ImagePersistenceException` como parámetro.
- Configuran `taskExecutor` con `queueCapacity` de 25, limitando arbitrariamente tareas con `@Async`.
- Cachean imágenes con `ConcurrentMapCacheManager`, sin estrategia de eviction → uso de memoria.
- En toda página con paginación no validan que `page` o `size` no sean negativos (genera 500).
- `getHomeModel` de `HomeDisplayService` popula `Map<String, Object>`. Acopla `ModelAndView` al service. La sola existencia de `HomeDisplayService` es un error conceptual. **Error conceptual grave.**
- **Lógica de negocio en el controller. Errores conceptuales graves.**
  - Varias llamadas a `menuService.addItem` desde el controller + chequeos a nivel Controller.
  - Lo mismo en `editMenu` (peor, hacen `findById`).
  - Obtienen `Reservation` y `ReservationTurnInstance` antes de lanzar `modifyReservation`.
  - `editRestaurant` realiza múltiples updates a nivel controller. **Ya corregido en entrega anterior y reincide.**
- Validan form a mano en controller en vez de custom validator. **Ya corregido previamente.**
- Al crear imagen permiten JPEG, WEBP y PNG, pero `getImage` siempre setea ContentType JPEG.
- Buen uso del decorador que valida capacidad de reserva.
- Falta `final` en `UserReservationDTO` para campos no modificables (Effective Java).
- Bien uso de custom exceptions y enums para ordenamiento.
- Servicio de email no encapsula bien lógica de envío: encarga a otros rellenar sujeto, template, variables. Altísimo acoplamiento.
  - En `createReservation` tienen sólidamente 10 líneas solo para enviar mail.
- Automatic unboxing de `Long` a `long` sin chequeo de null.
- Funciones públicas del service sin `@Transactional(readOnly=true)` en `ProfileServiceImpl`.
- Usan `findById` múltiples veces para fetchear relaciones 1:1 que pueden obtenerse mediante gets del modelo.
- Al cancelar reserva piden userId para validar ownership a nivel service. Podría delegarse a Spring Security (`@PreAuthorize`).
- Usan varias veces representación String de fecha en vez de `LocalDateTime`/`LocalTime`. **Ya mencionado.**
  - Al crear restaurante usan 2 `Map<String, String>` (apertura y clausura por día). Mala representación de horario.
- **Utilizan `Mockito.verify` — testean implementación y no comportamiento. Error conceptual grave.**
- En varios tests validan ausencia de error con `assertTrue(true)`. Mejor: que la función devuelva valor.
- Precaria cobertura de tests en funciones con pesada lógica (`createBatchTemplates`, todo `RestaurantService`). Ningún test en queries complejas.
- Varias funciones en DAOs devuelven X for Restaurants en Mapa cuando pueden crearse llamando función del modelo.

**Seguimiento:** correcto uso del plane y chores/bugs.

**Nota:** 3 — Promedio: 5

---

## Grupo 2 (gestión empresarial)

**Demo:**
- En formulario de creación de empresa, error de `maxlength` no aclara límite.
- Teléfono se puede crear como secuencia de letras.
- Al cambiar página de gestión, aparece botón para borrar usuario logueado.
- Falta restringir queryParam `page` (`page=-1` arroja 500).
- Descripción no está bien encodeada.
- No es consistente el uso del asterisco para campos obligatorios.
- Puedo acceder a tareas de otros usuarios.
- Duración de tareas parece estar módulo 24.
- Periodicidad aparece en inglés en página en español.
- Le agregaría filtro por estado crítico a vista de stock.
- El cambio de contraseña podría hacer login.
- Algunos links de mails van a 404 (URL mal formada).

**Código:**
- Spring Security ya ofrece parsear path params para autorización.
- Falta granularidad en Spring Security. Cualquier autenticado puede acceder/modificar activities. Sólo admins eliminan usuarios pero de cualquier empresa.
- `ManagementData` parece creado para encapsular modelos del endpoint `/management`, pero acoplan a nivel service qué se muestra.
- Ciertos emails recibidos como request params necesitan verificación en backend.
- Role, day y status deberían ser enums.
- Tienen validaciones en controllers y en servicios que pertenecen en los forms.
- Hacen chequeos de null por objetos traídos de Optionals.
- En SupplyStock, faltan validaciones de tamaño y tipo para `MultipartFile image_content` (debería ser `imageContent`).
- En `SupplyAndStockController.handleForm`, distintas ejercitaciones deberían encapsularse en un único método.
- No aprovechan Hibernate. En `CompanyInvitationServiceImpl` piden cada campo y verifican por separado, en lugar de traerse la invitación.
- Manejo de errores poco claro. `createCompanyForCurrentUser` retorna sin distinguir inexistencia de usuario. `getCurrentCompanyId` retorna 0 ante inexistencia.
- Falta cobertura de testing para `TaskScheduleServiceImpl` y `TaskServiceImpl`.
- **Hay métodos que no utilizan el modelo 1+1. Error grave.**

**Seguimiento:** correcto uso del plane.

**Nota:** 6 — Promedio: 6.5

---

## Grupo 3 (anki/decks)

**Demo:**
- Durante demo se vio server error.
- Botones sin padding, terminan donde termina el texto.
- Al apretar add card muestra loading, pero otros botones siguen clickeables.
- Lupa del search no alineada verticalmente.
- Botones para completar deck no alineados, sin margins ni código de colores.
- En general UI con muchos problemas.
- Modal de creación de deck random todo chico y apretado.
- Desplegable de deck con textos desalineados, hovers que exceden ancho del popup.

**Código:**
- **Peso del repositorio muy llamativo:**
  - Copias de todas las versiones de font "Fira Sans" (20 variantes, 0.4–0.5MB cada una). Innecesario — Google Fonts CDN.
  - Embeben fatjar `google-java-format-1.15.0-all-deps.jar` con script manual. Innecesario, existen plugins de Maven.
- **Mucha lógica de negocio en controllers, error conceptual grave ya indicado en primer entrega.**
- No buen uso de BD, métodos que retornan ids interpretados/consultados por separado. **Ya indicado.**
  - Bajo JPA los ids son detalle de implementación al modelar relaciones.
- Aplicación trae listas sin paginación.
- **Tests no unitarios, usando más de un método de la class under test. Error conceptual grave.**
- **`java.sql` en capa de modelos. Ya indicado.**
- Omiten modificadores de acceso (ej. `CommunityPostWithUserData`). Ya indicado.
- Una sola operación termina ejecutando N queries. **Error conceptual grave.**
- **Queries que sí paginan, sin usar modelo 1+1. Error conceptual grave.**
- **Entidades mal mapeadas. Mapean relaciones con id pelado, sin foreign keys. Son columnas comunes sin semántica o constraints. Error conceptual grave.**

**Seguimiento:** quedaron varias cards en progress o todo. Bien estimación de features.

**Nota:** 1 — Promedio: 3

---

## Grupo 4 (viajes/transportistas) — entrega tardía 20:52

**Demo:**
- Al registrarme no soy redirigido a donde estaba.
- Imágenes rotas "de sprints pasados".
- ¿Por qué toggle para "administrar mis intenciones de viaje"? Ya tienen modal.
- ¿Por qué no puedo editar/cancelar mis solicitudes?
- No puedo pedir más de 1 slot de una vez.
- Intención de viaje no necesita scheduler.
- Tabs en mis viajes amontonados.
- Mails apuntan a localhost.
- UX confusa: mayor botón visible ("Nuevo viaje") es para conductores.
- No hay forma fácil de convertirse en conductor.

**Código:**
- `schema.sql` debería estar en persistence. **Ya marcado en primer entrega.**
- Innecesario almacenar `webapp_base_url` (con `<c:url>` resuelve). **Ya marcado.**
- **Imprimen mensajes sin `<c:out>`, vulnerables a XSS. Error grave ya marcado.**
- **Lógica de negocio en controllers. Error conceptual grave ya indicado.**
- Try-catch de exception en controllers — usar `ExceptionHandler`. **Ya marcado.**
- Solo validan roles en rutas, falta control de accesos fino. Posible aceptar trip request de cualquier viaje siendo conductor. **Ya indicado.**
- En `HomeServiceImpl`, `parseMaxPrice` debería ser `private`. **Ya indicado.**
- La sola existencia de `HomeService` es errónea. "Home page" concierne al frontend.
- Usan boxed primitives sin razón. **Ya indicado.**
- `LocaleContextHolder` para envío de mails en lugar del locale del destinatario. **Ya indicado.**
- `SecurityContextHolder` + lógica repetitiva, evitable con `@ControllerAdvice`.
- **No hacen uso correcto de `@Transactional`. Ya indicado.**
- No siguen convención de nombres de Java (paquetes con mayúscula).
- Hacen uso sin razón de `em.unwrap(Session.class)` y `addScalar`.

**Seguimiento:** quedaron tareas In Progress o Todo.

**Nota:** 1 — Promedio: 3.5

---

## Grupo 5 (reseñas/restaurantes)

**Demo:**
- Usuarios sin reseñas se muestran con 0 estrellas.
- Tras registrarte te manda a home, no retoma flujo.
- "Verificación requerida" permite reenviar código, pero no ingresarlo.
- Mail no tiene paleta del sitio.
- Imágenes en botones de cambiar contraseña/editar perfil se pisan con texto.

**Código:**
- Corrigen problemas de primer entrega satisfactoriamente.
- **Queries paginadas sin usar modelo 1+1. Potencialmente tabla entera para paginar en memoria. Error grave.**
- Tests de persistencia que no validan estado de BD.
- Repositorio con archivos del IDE (`*.iml`).

**Seguimiento:** correcto uso del plane.

**Nota:** 8 — Promedio: 6.5

---

## Grupo 6 (eventos/comunidad)

**Demo:**
- Bien múltiples filtros.
- Bien que en URL se ven parámetros de filtros.
- Al crear perfil instagram es obligatorio pero en frontend no tiene `*`.
- Bien que delete de evento tiene confirmación.
- Edit del announcement raro, solo deja editar el más antiguo.
- Comentar evento si estoy rechazado tira 500 (es custom).
- Share copia URL con todos los query params (debería dejar solo paginación).
- Editar review raro como el del announcement.
- Estado "pendiente" de eventos pasados no tiene sentido — debería ser "vencido".

**Código:**
- Repositorio con archivos generados (`.mvn`).
- **Concatenan textos en la vista en lugar de interpolar. Ya marcado.**
- Realizan chequeos de security en controller.
- Lógica de mostrar botón si usuario es dueño es parte de spring-security taglib.
- Métodos que no utilizan modelo 1+1 para colecciones.
- **Utilizan boxed primitives sin razón. Ya marcado.**

**Seguimiento:** correcto uso de Plane.

**Nota:** 8 — Promedio: 7.5

---

## Grupo 7 (torneos/equipos)

**Demo:**
- Podría marcarse qué equipo es cada color.
- Info agregada en tabs.
- Muestran opción de cambiar lenguaje al visitar perfil ajeno.
- Al ingresar a algunos events: error 500 (ej. event/22).
- Textos i18n muestran la clave (ej. "invite.friends.send").
- Ver invitaciones a grupos del lado del equipo y de quien las recibe.

**Código:**
- TODOs en código (`// TODO ya mismo tengo que entender que hace esto. lo hizo gpt y si no entiendo lo que hace no lo pienso usar`).
- Cumplen a medias con no instanciabilidad de clases utils. **Ya marcado.**
- Commits con mensajes poco claros ("aaaaaa").
- **Usan clases de `java.sql`. Ya marcado.**
- **Boxed primitives sin diseño. Ya marcado.**
- Definen clases que luego no utilizan.
- Definen enum para Location pero luego como String en el modelo.
- `getNumberOfMatchesPlayedLastMonth()` de `Session` filtra en Java en lugar de en BD.

**Seguimiento:** correcto uso de Plane.

**Nota:** 7 — Promedio: 7

---

## Grupo 8 (boliches/reservas)

**Demo:**
- No se puede recuperar contraseña.
- Bien feedback al navegar.
- Algunos textos sin i18n.
- Asumen que archivos de pago son siempre PDFs.
- En panel de administración estaría bueno ver puntuación y reseñas.

**Código:**
- **Vistas concatenan strings en lugar de interpolarlos. Error grave ya marcado.**
- Validaciones en controllers en lugar de Forms.
- Clases que piden atributos inyectados que luego no usan. **Ya marcado.**
- **Tests no unitarios — usan misma class under test para setup. Error conceptual grave.**
- Tests de persistencia no validan estado final de BD.
- Expresan intención de no hacer N+1, pero inmediatamente hacen N queries.
- **`java.sql`. Detalle del DAO.**
- Overridean `hashCode` para que siempre retorne el mismo valor.

**Seguimiento:** uso correcto de Plane.

**Nota:** 6 — Promedio: 5

---

## Grupo 9 (libros/marketplace)

**Demo:**
- Usan dos términos (softcover y paperback) para el mismo concepto.
- Cambio de imagen en edición de posteo arroja 500 y no cambia.
- Buena experiencia el multiselect con autocomplete.
- Intento de XSS en reviews tira 400 pero se genera la review.
- Enter en location no envía form de búsqueda.
- Unsuspend lleva a 500 pero sí realiza acción y envía mail.
- Al contraofertar, mensaje de error sin i18n.

**Código:**
- Query de `/books/authors` no paginada — lista de tamaño desconocido.
- `/books/authors` sin queryParam query: 500 (`MissingServletRequestParameterException`).
- Lógica de cuándo una publicación puede pausarse debería estar en services.
- Aceptan JPEG, PNG, WEBP pero al devolverlas siempre ContentType jpeg.
- Instancias donde, pudiendo arrojar excepciones custom, arrojan `NoSuchElementException` con `orElseThrow()`.
- Salvo `ReportDaoJpaImpl`, buena cobertura de tests.
- `PageableQueryBuilder` y `PagingJpa` son muy buenos recursos. Caveat: no implementar `getId` pasa a ser error de Runtime en vez de compilación.
- Uso de Dtos entre servicios y mailing parece innecesario (modelos podrían usarse).
- Tiene puntaje a favor de la primera entrega.

**Seguimiento:** correcto uso de Plane.

**Nota:** 9 — Promedio: 8.5

---

## Grupo 10 (eventos/viajes)

**Demo:**
- Bien múltiples filtros y URL con filtros.
- Attend de event escondido en el flujo.
- Muy buena vista de reportes.
- Funcionalidad de admin muy completa.

**Código:**
- **Lógica de negocio en controllers. Error conceptual grave.**
- Utilizan `pageContext.request.isUserInRole('ADMIN')` en lugar de spring-security taglib.
- **`java.sql`. Detalle del DAO.**
- Mucho uso de EAGER en `@ManyToOne`, algunas innecesarias.
- Falta coverage en algunos casos core como `createJourney`.

**Seguimiento:** buen uso de herramienta. Agregar paginación a vista que faltaba **no es chore** — agrega valor.

**Nota:** 8 — Promedio: 7.5

---

## Grupo 11 (médicos/turnos)

**Demo:**
- Muy bien de features.
- Componentes custom muy bien implementados.
- Bien perfil de médico y sistema de oficinas.
- Sin errores o dead ends.

**Código:**
- Se mezcla `optional.empty` con `id = -1` para detectar imagen inexistente. **Ya marcado.**
- Mapeos `toMany` con relación eager (ej. `appointmentFiles`) → innecesario cargar todos los archivos cada vez.
  - Archivos deberían accederse vía endpoint aparte (no arrastrarse — impide caching).
- **Controllers con lógica de negocio (ej. `doctorAppointmentDetails`). Error conceptual grave.**
- Excelente cobertura de tests.
- Bien mapeo de Hibernate.

**Seguimiento:** ok.

**Nota:** 7 — Promedio: 7.5

---

## Grupo 12 (tallas/ropa)

**Demo:**
- Cambiar tamaños no anda.
- Bien de features.
- Flujo principal correcto.

**Código:**
- Buen uso del builder pattern.
- Relaciones JPA que pueden crecer indefinidamente (ej. requests de `AllocationPost`).
  - Agravado por no usar `FetchType.Lazy`.
  - Agravado porque llaman a la colección sólo para `.size()`.
- Buen uso de `@Formula`.
- Capa de servicios sin buena cobertura (`SizeService` sin tests).
- Buena cobertura de persistencia. Faltan tests para casos de error.

**Seguimiento:** ok.

**Nota:** 9 — Promedio: 7.5

---

## Grupo 13 (reservas/equipos)

**Demo:**
- Home por defecto sin filtros (correcto), pero al pasar página aplica min $2 y máx $1.000.000 automáticamente.
- Al buscar por nombre lo mismo.
- Acceder a "Reservas de mis equipos" → 403. Nunca un link al usuario debiera llevar a este tipo de error.
- Poder unirse unilateralmente a cualquier equipo es peligroso.

**Código:**
- Clases como `EmailTemplates` no debieran ser instanciables.
- Omiten modificadores de acceso.
- **Paginan sin modelo 1+1. Error conceptual grave.**
- Repositorio incluye archivos de backup de vim (`*~`).

**Seguimiento:** buen uso del plane.

**Nota:** 9 — Promedio: 7

---

## Grupo 14 (vacaciones/empresarial)

**Demo:**
- Mandan 2 mails de onboarding (saludo y creación). Combinar o CTAs más relevantes.
- Enums de área no traducidas.
- Scroll raro en anuncios cuando hay pocos.
- Efecto hover a pesar de no ser clickeable.
- En `/user/profile` si bio vacío: `Bio: "" {0} ""`. En onboarding bio no es required pero al editar sí.
- Indicar cuántas vacaciones puedo pedir. No se resetean tras año.
- Permite crear edificios de mayor longitud que la permitida en búsqueda.
- Falta ir para atrás en un equipo.
- Faltan confirmaciones en cancelaciones o borrados.
- Muchos lugares enum de área no traducido.
- Errores al buscar lugar para reservar mueven layout feo.
- Opciones de edificio muestran `<script>alert(22)</script>` textuales.
- Sujeto de email "You have left an event" debería estar en español.
- Algo raro con timezones — tira error si buscás unas horas después de ahora.
- "No hay Usuarios..." a pesar de no tener búsqueda hecha.
- En login/register no hay forma de volver a página principal.
- Bien cambio de idioma.
- Bien estadísticas de reservas.
- Con sesión iniciada, ir a `/` tira 403. Cada cuenta tiene 1 enterprise → podría redirigir.

**Código:**
- En `resolveLocale` try-catchean `NullPointerException` en lugar de chequear null proactivamente. Mala práctica.
- Faltan chequeos de tipos y tamaño de imágenes en forms.
- **Varias funciones del controller tienen lógica de negocio. Error conceptual.**
- Mal estilo: prints, `accept_request` en snake_case.
- Estructura jerárquica de roles podría implementarse con `AccessDecisionVoter`.
- **XSS por falta de `<c:out>`. Error grave ya corregido en entrega anterior.**
- Falta validación de existencia de `enterpriseId` en forms. Acceden con `findById(id).get()` sin chequear Optional. Varios `Optional.get()` sin verificar.
- Crean función de servicio que solo devuelve lista vacía. No útil. `getPreviousParams` limpia query params — podrían ser utilidades.
- Interfaces del DAO en create devuelven Optional, pero implementación nunca está empty. Mal contrato.
- `join` y `leave` de event devuelven ints 0/1 — deberían ser booleans.
- Servicios con gets sin `@Transactional(readOnly=true)`.
- Varias funciones de service reciben `Long` sin manejar null. También Boolean en mayúscula pero DAO devuelve boolean → boxing innecesario.
- **No se validan overlap de peticiones de vacaciones. Error de negocio.**
- Pocos tests en service en funciones no triviales (`AnnouncementServiceImpl`, `EventServiceImpl`). **Reincidencia.**
- `Defaults` tiene constructor default. Falta privado.
- Faltan logs en `ControllerAdvice` y services loggeando acciones no triviales.
  - En `AmenityHibernateDao` obtienen logger de clase foránea (copy-paste).
- Algunas queries paginadas sin 1+1.
- Queries nativas pudiendo usar HQL.
- Decente cobertura persistencia, nulos tests en DAO de estadísticas.
- Buen uso de Javadocs a nivel dao.

**Seguimiento:** bien uso de plane y features canceladas. Quedaron TODOs sin hacer (PAW14-185 "Migracion a hibernate" en Todo).

**Nota:** 5 — Promedio: 6.5

---

## Grupo 15 (médicos/turnos)

**Demo:**
- Busco página más allá del máximo: "Página 55 / 3" (debería ser "Página 3/3").
- Helper text en teléfono para create.
- Falta mensaje de error en peso, altura y fecha de nacimiento.
- Falta CTA en vista de turnos cuando no tengo turnos.
- Modal de autorizar se rompe si lo abro 2da vez.
- Mail de estudio recibido lleva a 404.
- Estudios y "mis médicos" deberían estar paginados.

**Código:**
- Archivos `en_US` heredan de `en`, no necesario copiar keys. **Ya marcado.**
- **Imprimen valores a JSP con `${...}` y no `<c:out>`. XSS. Error grave ya marcado.**
- Usan alt texts (positivo!) pero no internacionalizados. **Ya marcado.**
- `if (user instanceof Patient)` / `else if (user instanceof Doctor)` no recomendado. Método abstracto en User.
- `if (user == null) throw new UnauthorizedException("User not found")` corresponde a security.
- No hace falta catch en controllers — usar `ExceptionControllerAdvice`.
- **Lógica de negocio en controllers. Error conceptual grave.**
- `getActiveSingleShifts` trae de BD todos los singleShifts y filtra en memoria. Igual `getAvailableDays`, `getAuthorizedDoctors`.
- Lo único paginado es lista de doctores de home. Múltiples casos sin paginar (Appointments pasados, estudios, doctores autorizados, turnos futuros).
- Doctor con Insurances como `OneToMany` y `fetchType.Lazy` → paginación funciona sin 1+1, pero propenso a errores si se modifica a Eager.

**Seguimiento:** buen uso de herramienta.

**Nota:** 5 — Promedio: 6

---

## Grupo 16 (series/episodios)

**Demo:**
- Proceso de onboarding está bueno.
- Chequeo del máximo de links solo en front.
- Animaciones y feedback bien implementadas.
- Flujo principal completo. Bien de features.

**Código:**
- Omiten modificadores de acceso. **Ya marcado.**
- Mapeo de relaciones correctamente implementado en JPA.
- Mucho uso de EAGER en `ManyToOne`, algunas innecesarias (ej. `episodeReview` carga todo el episode).
- Funciones en services sin cobertura con bastante lógica.
- Cobertura de tests de persistencia parcial y discrecional (`FriendJpaDao` sin tests).

**Seguimiento:** ok.

**Nota:** 8 — Promedio: 7

---

## Grupo 17 (torneos/match)

**Demo:**
- Bien por loguear al usuario al recuperar contraseña.
- Al agregar favorito, popup "Could not toggle favorite. Please try again.".
- Likes no funcionan, retornan 404. Path incorrecto.
- En team ranking no claro cuándo equipo es de 1+ personas.
- Mostrar imágenes de perfil en solicitudes de amistad, participantes de torneo.
- En match deberían mostrar cuántas partidas debería ganar para pasar de ronda.
- Sesiones de torneos deberían tener nombre.
- Deberían notificar torneos ganados.
- Filtrar si torneo terminó (en demo se sigue mostrando como futuro).
- Al añadir amigo: 500. Al reportar jugador: 404.
- Lógica de reportes no clara.
- Sería adecuado filtrar por tipo de notificaciones.
- Al crear sesión, se queda cargando infinitamente al clickear notificar amigos.
- Validación de resultados de sesiones sin utilidad.
- Bien feedback al navegar.

**Código:**
- Validaciones en controllers en lugar de forms.
- Tests vacíos.
- **Tests no unitarios — usan misma class under test para setup o verificación. Error conceptual grave.**
- Métodos de persistencia que cuando crean entidad devuelven id en lugar de la entidad creada.
- **No realizan paginación usando modelo 1+1. Error conceptual grave.**
- Acceden a listas sin paginación adecuada, pudiendo traer número violento (ej. `getAllFriends`).
- Credenciales del README no funcionan. No se proveen para admin.

**Seguimiento:** buen uso de Plane.

**Nota:** 7 — Promedio: 7.5

---

# Corrector B — `fee3e87d-...Devolucin_TP2.pdf`

> Este corrector pone foco fuerte en: **`@Async` + `@Transactional` accediendo a relaciones lazy sin materialización explícita**, **modelo 1+1**, **`Mockito.verify`** y **N+1 por EAGER en cascada (200+ queries)**.
>
> Todos los grupos: "No resta puntos por seguimiento." (excepto grupo 6 que **suma 0.5**).

## Grupo 1 (eventos)

**Demo:**
- Volver a eventos hace back en lugar de volver realmente.
- Etiquetas no clickeables para buscar otros eventos.
- Search por tag sin autocomplete.
- Eventos en rows de 3, pero 8 por página.
- Popup "glass" con texto verde — poco contraste.
- Me inscribí al evento `"/><script>alert(22)</script><"` y dice "pendiente".
- "Para ti" no considera si ya estás inscrito.

**Código:**
- Omiten modificadores de acceso.
- Clases con 600+ LoCs que podría refactorearse.
- Corrigen errores de primer entrega.
- Implementan correctamente paginación.

**Nota:** 8 — Promedio: 7

---

## Grupo 2 (rooms/reservas)

**Demo:**
- No puedo usar room si tiene estadía no marcada como completa.
- Datos inconsistentes de reservas previas.
- Falta aclarar años en fechas de bookings.
- Botón back después de booking quiere reenviar info.
- "Go back to home page" hace back en stack.
- Comentarios no paginados.

**Código:**
- Corrigen primer entrega satisfactoriamente.
- **Loop infinito en `remindUpcomingBookingsCronJob` que causa envío de infinitos mails a un mismo usuario. Error grave.**
- En `getUserBookings`, condición incorrecta en subquery: `WHERE pinner.id < pinner.id`. **Error grave — falta cobertura en tests unitarios.**
- **Métodos como `sendBookingCancellationMessages` marcados con `@Async` y `@Transactional` acceden a relaciones lazy sin materialización explícita. Error conceptual.** Ejemplo:
  ```java
  bookings.forEach(booking -> {
      booking.getUser().getId(); // Forzar inicialización
      messageSender.sendBookingCancellationMessage(booking.getUser(), booking);
  });
  ```
  Materializar explícitamente relaciones lazy antes de usarlas en async, o fetch joins en DAO.

**Nota:** 7 — Promedio: 7

---

## Grupo 3 (lessons/educación)

**Demo:**
- Me deja registrarme con email vacío.
- Suben fotos como recursos y luego no se visualizan.
- Caracteres especiales mal manejados: "ÄÂÃÂÂÂÂÂÂÂ".
- Al generar error los tags se pierden.
- Explore incompleto.
- No puedo elegir lessons porque selector no paginado.
- Faltó `<c:out>` en selector de lesson.
- Falta paginación de hijos de comentarios.
- Problemas UX: paginación inconsistente, doble click, elementos que aparentan clickeables y no lo son.

**Código:**
- **Rutas suscripción/de-suscripción sin protección. `if (loggedUser != null)` manual. Debería ser Spring Security. Vulnerabilidad grave ya marcada en primer entrega.**
- Acceden a Optional con `.get()` sin verificación. **Ya marcado.**
- **No usan estrategia 1+1 para paginación. Error conceptual grave.**
- Colecciones que pueden crecer desmedidamente (ej. `comments`) mapeadas vía `toMany`.
- Muy buena cobertura de tests.
- `HomeController` y `home.jsp` viejos que no se usan.
- **Dependencia hsqldb sin scope test en módulo persistence. Error conceptual.**
- Usan `.clear()` que materializa toda la lista para simple modificación (ej. tags).
- **Métodos `@Async` y `@Transactional` acceden a relaciones lazy sin materialización explícita.**

**Nota:** 4 — Promedio: 5

---

## Grupo 4 (fletes)

**Demo:**
- Si cambio idioma del browser se queda en inglés.
- Hover de trips muestra dropdown cuando no debería.
- En perfil request/process/completed podrían ser clickeables.
- 400 Bad request custom: bien.
- Bueno el dashboard del perfil del fletero.
- Me deja cargar imágenes/editar a camiones de otros fleteros.
- Puedo asignar camiones de otras empresas a mis drivers.
- No hay filtro de UTF-8.

**Código:**
- **Incluyen hsqldb en `compile` en pom de webapp (padre y persistence lo declaran en `test`). Error conceptual.**
- Moneda no internacionalizada en JSP.
- En lugar de `SessionLocaleResolver`, podrían usar `AcceptHeaderLocaleResolver`.
- `getCurrentUserId` en `ControllerUtils` debería ser `@ModelAttribute`.
- Try-catch en controllers podrían manejarse por `ExceptionHandlerController`.
- `session.getAttribute("emailForRegistration")` confuso. Mejor: input hidden en forms.
- Lógica de validación en `uploadReceipt` podría simplificarse con custom validator.
- Clases utilitarias deberían ser `final`. `ControllerUtils` no es final.
- **No aplican modelo 1+1. Error conceptual grave.**
- **`FetchType.EAGER` en MUCHOS modelos. 20 ofertas en lista paginada → ~121 queries en lugar de 1. Lazy + JOIN FETCH para métodos que requieran datos. Error conceptual grave.**
- Entidad image trae siempre bytes.
- Mal uso de `JOIN FETCH c.transportes`: flete con 20 conductores y 5 transportes cada uno → 100 transportes en una query. **Error conceptual grave.**
- Usan `.add()` y `.remove()` en Locations, materializa toda la lista. Igual con imágenes.
- **Tests no unitarios. Error conceptual grave.**
- **Usan `mockito.verify`, valida implementación. Error conceptual grave.**

**Nota:** 4 — Promedio: 4.5

---

## Grupo 5 (vinilos/marketplace)

**Demo:**
- Bien volver desde login a home.
- 400 y 500 custom bien.
- Modal de confirmar compra con 2 steps friccionante.
- Validation para no dejar enviar comprobante vacío.
- Si subo imagen como comprobante y toco ver imagen, PDF preview se rompe.
- Estaría bueno modal para subir comprobante.
- Country debería ser autocomplete.
- URL de editar vinilo ajeno: nada me frena, puedo editarlo.

**Código:**
- Versiones de dependencias en poms hijos repitiendo padre. **Ya marcado.**
- Setean java 11 y 15 en plugin compile en lugar de heredar.
- En lugar de `extractVinylIdFromUri(uri)` podrían sumar vinyl ID en la exception. **Ya marcado.**
- Versiones en pom padre que no establecen versión como variable.
- No tienen logback-test en repo, solo producción.
- **`UserController` con lógica de negocio. Error conceptual.**
  - `becomeSeller` actualiza info del user pero el rol se agrega en controller.
  - `if(roleService.userHasRole(currentUser.getId(), "SELLER"))` debería ser security.
  - `/resetPassword` usa `emailService.sendPasswordResetEmail` directamente.
- **Métodos `@Async` y `@Transactional` acceden a relaciones lazy sin materialización explícita.**
- Query de `similarVinyls` con error en precedencia: `WHERE v.publicationStatus = 'ACTIVE' AND v.stock > 0 AND v.genre = :g OR v.sellerId = :sellerId` evalúa como `(... AND ... AND ...) OR (...)`. **Trae cualquier vinilo del seller sin importar active o stock. Error grave.**
- Tests que no hacen `em.flush()` → validación del estado de BD incorrecta.

**Nota:** 6 — Promedio: 6.5

---

## Grupo 6 (reservas/UUID)

**Demo:**
- "Validar tu cuenta" dice que vayas a loguearte, pero usuario ya está logueado.
- Reserva muestra UUID — ¿usable para el usuario?
- Dropdown de fechas muestra las que no tienen disponibilidad.
- Mail de reserva confirmada: "Hola {0}", "mostrar tu código" (qué código?), dice confirmada aunque no pagué.

**Código:**
- **Módulo interfaces declara depender sobre `spring-web`. Las capas son agnósticas del contexto web. Error conceptual grave ya marcado en entrega anterior.**
- Repositorio incluye `out/artifacts` con artefactos autogenerados.
- Referencia a propiedad `security.rememberme.key` que no existe.
- **Lógica de negocio en controllers (ej. `edit club` obtiene club, evalúa qué dato cambiar, lo cambia, vuelve a llamar al servicio). Error conceptual grave ya marcado.**
- **Pocas relaciones mapeadas, mayoría columnas con UUIDs opacos. Imposibilita queries del modelo de dominio. Error conceptual.**

**Seguimiento:** Suma 0.5 por seguimiento de TP1.

**Nota:** 6.5 — Promedio: 6

---

## Grupo 7 (organizaciones)

**Demo:**
- Encoding raro: "â Volver al dashboard".
- Error en form de creación de organización deja de mostrar botón de perfil.
- Tags de entidades no internacionalizados.
- Falta verificación de email y cambiar contraseña.
- Editar organización como administrador.
- Error de orden no válido al crear puesto sin mensaje.
- Algunas páginas sin favicon.
- Mails siempre en español.

**Código:**
- Definen versión de `commons-fileupload` en pom de webapp.
- Mejoró cobertura, faltan tests para services con lógica compleja. **`Mockito.verify` valida implementación. Error conceptual grave.**
- Primer entrega marcó i18n. Avances pero **se ven todavía graves problemas**:
  - `lang="es"` hardcodeado en jsps.
  - Mensajes en `GlobalExceptionHandler` no i18n.
  - Valores de validaciones hardcodeados en mensajes localizados.
- Oportunidades de enums como request params.
- Podrían usar spring-security taglib para roles en jsp.
- En `OrgController` hardcodeado que siempre se ve página 0.
- **Lógica de negocio en controllers (`OrgCreateController`, `OpenPositionManagementController`). Error conceptual grave.**
- **Funciones que devuelven colecciones de cardinalidad variable (enrollments, likes, suscriptores) sin paginar. Error grave.**
- **Tests de persistencia no unitarios. Error conceptual grave.**
- Lógica de services en daos (asignar rol default USER implica borrar roles).
- Cantidades de likes/comentarios como campo calculado modificando misma tabla desde varios daos. Podrían usar `@Formula`.
- Uso extenso de join fetch (positivo).
- Podrían usar `@ManyToMany` y `@JoinTable`.
- No siguen convención de nombres de Java.

**Nota:** 4 — Promedio: 3

---

## Grupo 8 (boliches/reservas)

**Demo:**
- "1 reseña**s**".
- Mail muestra info de cuándo se reservó pero no detalles.
- No queda evidente que tengo que cargar el comprobante.
- Estaría bueno dejar al usuario con sesión iniciada tras cambio de contraseña.
- No evidente que tengo que agregar mesas o eventos para que mi boliche sea descubrible.

**Código:**
- Corrigen errores de primera entrega.
- Request Params que no sean strings (números, enums), delegando parsing a Spring.
- `saveReceipt` debería mantener estilo de otros servicios.
- Validaciones a nivel service (ej. `createTable`) estaría bueno tenerlas en forms.
- Queries paginadas con sentencias `orderBy` extras.
- Getters de listas de cardinalidad grande en entidades (ej. Club), aunque no los usen.
- TypedQueries sin `distinct` al obtener ids para 1+1.

**Nota:** 8 — Promedio: 8

---

## Grupo 9 (médicos)

**Demo:**
- Header en login para saber qué página es.
- En algunos mails falta header con info de web.
- Al recuperar contraseña dejar al usuario logueado.
- Bien por recomendar duración de turnos.
- Calendario bien hecho, faltaría borrar intervalos cortos.
- **Campos susceptibles a XSS (Coverage y plan). Error grave.**
- No se puede poner precio de consulta u obras sociales.
- Si aprieto dos veces "pedir estudio" se pide dos veces.
- App completa, buen flujo médico-paciente.

**Código:**
- Para validar BD utilizan `queryForMap` y `countRowsInTableWhere`. Sería deseable uno consistentemente.
- Cobertura muy completa.
- Corrigen satisfactoriamente.
- **Implementaciones de `findAll` sin paginación adecuada. Error grave.**

**Seguimiento:** "Correcciones demo entrega" muy general — debió descomponerse.

**Nota:** 7 — Promedio: 7

---

## Grupo 10 (viajes/trips/swap)

**Demo:**
- Inconsistencia al manejo de errores de forms.
  - Llenar form de swap con error quita lo que había puesto de fechas. **Error.**
- Buena cantidad de features, UX, Trip y planear trip.
- Problemas pasados arreglados.
- Explore quedó muy simple: falta ordenamiento, cards sin reviews/comentarios, faltan amenities en search.

**Código:**
- Corregido parcialmente: "Faltan muchos `@Transactional` [...]":
  - Queda: `RoomAvailabilityService.addAvailability` sin `@Transactional`.
  - Queda: `ImageServiceImpl.upload` y `deleteImage` sin `@Transactional`.
- Cobertura de tests pobre. DAOs grandes sin tests. No cubren casos borde ni no felices.
- Mensajes hardcodeados sin i18n en `GlobalExceptionHandler`.
- **No usan modelo 1+1. Error conceptual grave.**
- Clases Utils no final o con constructor público.
- Mapeo de Image incorrecto que trae bytes cuando solo se necesita id.

**Nota:** 6 — Promedio: 5.5

---

## Grupo 11 (jobs)

**Demo:**
- Recomendar default usando reseñas en vez de hardcodeadas.
- Bien que se puede cancelar trabajo porque dejan cambiar precio.
- No se muestra slot elegido de una application.
- Back de un Job no funciona.
- Se muestran reviews del usuario en perfil del Job.

**Código:**
- **Lógica de negocio en controllers** (`JobApplicationController`: `canCancelApplication()`, `canCancelApplicationByOfferOwner()`, `canAcceptApplication()` están en service pero deberían ser parte de DTO en service). **Ya marcado en primer entrega.**
  - En `declineApp` no buscar jobApplication primero y luego pasar ID. Llamar al service una vez.
  - Validación de email con `userService.isValidEmail()` debería ser Custom Validator.
- En `LoginController` manejo de sesión HTTP manual — debería ser Spring Security.
- **Siguen usando `@PreAuthorize` en services. Ya marcado.**
- Faltan `@Transactional` en algunos métodos (`deleteCalendarEvent()`). **Ya marcado.**
- `FetchType.EAGER` en algunos modelos.
  - Con valores máximos de 10 IDs de imágenes, cargar 10 ofertas paginadas → ~200 queries en lugar de 1. **Error conceptual grave.**
- Filtrado y agregación en Java que debería ser SQL.

**Nota:** 5 — Promedio: 5.5

---

## Grupo 12 (emprendimientos/marketplace)

**Demo:**
- Iconos de categoría no centrados.
- Mayoría de emprendimientos dicen "No estar disponible en este momento" porque vendedores sin datos de pago.

**Código:**
- En entrega anterior se marcó: `ensureAcceptedBelongsToRequester` y `ensurePendingBelongsToSeller` realizan ownership — debería ser Spring Security. **Esto no ha sido corregido.**
- **Concatenan textos en el front en lugar de interpolar mensajes. Asume que orden no es dependiente del idioma — falso. Error grave.**
- **Tests no unitarios, usando múltiples operaciones. Reflejado en nombre (`create_and_findById_ok`). Error conceptual grave.**
- **Tests de persistencia no validan estado de BD, solo respuesta del método. Error conceptual grave.**
- Código evita chequeos de tipos. Enums como `Province`, `Category` los reciben como `String`, y quien los invoca convierte enum a String proactivamente. **Error grave.**

**Nota:** 4 — Promedio: 6

---

## Grupo 13 (eventos/notificaciones)

**Demo:**
- Mensajes de longitud invertidos (primero max, luego min).
- Inputs numéricos aceptan negativos.
- 200 caracteres para descripción es poco.
- Copy link copia el nombre del evento en lugar del link.
- No puedo cambiar contraseña o foto de perfil.
- Mostrar más info de organizadores en vista de evento.
- Acciones destructivas sin modal de confirmación.
- Como asistente nunca me entero si mi postulación fue aceptada.
- En mail de notificaciones falta título.
- Notificaciones inconsistentes.
- Deberían mostrar fecha de mensajes.
- Organizador entrando a su evento debe ver todas las opciones.
- Para ver historial de notificaciones, clickear en send a notification.
- Recordatorio cuando se acerca un evento.

**Código:**
- Bean para `CharacterEncodingFilter` que no se usa, filtro configurado en `web.xml`. **Ya marcado en primera entrega.**
- Controllers con switch cases que usan magic strings para definir operación, en lugar de endpoints apropiados.
- En Tags atributo de cantidad de eventos con ese tag, obligando a manejar consistencia. Forma simple: `@Formula`. Igual con Presenter.
- **Tests no unitarios. Error conceptual.**

**Seguimiento:** stories no etiquetadas por tipo (feature, chore, bug).

**Nota:** 6 — Promedio: 6

---

## Grupo 14 (torneos/games)

**Demo:**
- Página no funciona en inglés — deploy mal.
- Exponer cantidad de calificaciones del usuario.
- Estaría bueno poder decidir irte de un equipo.
- Limitar sugerencia de usuarios.
- UI se atiene bien al público.

**Código:**
- `FetchType.EAGER` en algunos modelos.
  - Ej: `Game` trae SIEMPRE todos sus formatos. No hay justificación. **Error conceptual grave.**
- `.size()` en colección Lazy materializa toda. Usar `COUNT` en query. Más aún, no parece utilizarse el valor.
- **Varias queries sin paginación. Error grave.**
  - `ParticipantHibernateDao.getTournamentParticipantUsers`.
  - `GameHibernateDao.getUserTeams()` y `searchByGenre()`.
- Falta cobertura de tests del servicio `TournamentService` (`setFinished`, `startTournament`). **Ya marcado en primer entrega.**

**Nota:** 6 — Promedio: 6.5

---

## Grupo 15 (libros/intercambio)

**Demo:**
- Mail de validación sin link para validar directamente — siempre copy/paste del código.
- Mail de oferta aceptada no incluye datos de pago y monto a pagar.
- "Aceptar y eliminar publicación" en rojo, pero operación es positiva (aceptar). Colores incorrectos.
- Revisar delta de funcionalidad vs entrega anterior.

**Código:**
- Omiten modificadores de acceso.
- Crean queries ineficientes (múltiples queries anidadas).
- Métodos auxiliares para generar queries complejas privados — no se pueden testear directamente.
  - Métodos auxiliares totalmente acoplados (mismos nombres de parámetros). Refuerza necesidad de testing.

**Nota:** 8 — Promedio: 8

---

# Patrones recurrentes en TP2 (consolidado)

Errores que aparecen en **múltiples grupos** y que ya estaban marcados en TP1 (reincidencia, penalización fuerte):

1. **Paginación sin modelo 1+1** — A: grupos 3, 5, 13, 17. B: grupos 3, 4, 10, 17. Ver [[Hibernate & JPA]] y [[Paginación, Filtros y Búsqueda]].
2. **Lógica de negocio en controllers** — A: grupos 1, 3, 4, 7, 10, 11, 14, 15. B: grupos 5, 6, 7, 11. Reincidente en muchos.
3. **Tests no unitarios / `Mockito.verify`** — A: grupos 1, 3, 8, 17. B: grupos 4, 7, 12, 13. Ver [[Testing Practices]].
4. **XSS por falta de `<c:out>`** — A: grupos 4, 14, 15. B: grupo 9. Ver [[JSP Views]].
5. **Clases `java.sql` en modelos** — A: grupos 3, 7, 8, 10. Detalle del DAO. Ver [[DAOs (Persistence Layer)]].
6. **EAGER en cascada generando N+1 (100–200+ queries)** — A: grupos 1, 3, 4, 10, 11, 14, 16. B: grupos 4, 11, 14.
7. **🆕 `@Async` + `@Transactional` accediendo a relaciones lazy sin materializar** — B: grupos 2, 3, 5. **Trampa nueva del TP2.** Materializar relaciones lazy antes de usarlas en contexto async, o usar fetch joins en queries del DAO.
8. **`Optional.get()` sin verificar `isPresent`** — A: grupos 3, 14. B: grupo 3.
9. **Locale del sender en mails (no del destinatario)** — A: grupo 4 (reincidencia).
10. **Boxed primitives innecesarios** — A: grupos 4, 6, 7.
11. **`schema.sql` en webapp** — A: grupos 1, 4 (reincidencia).
12. **No usar `@PreAuthorize` / `<sec:authorize>`** — A: grupos 1, 6, 10, 15. B: grupos 3, 12.
13. **hsqldb con scope `compile` en webapp** — B: grupos 3, 4.
14. **i18n incompleta** — B: grupos 4, 7, 10.
15. **`@PreAuthorize` en capa de services** — B: grupo 11 (reincidente).
16. **Falta de `@Transactional` en métodos de inserción** — B: grupos 10, 11.
17. **Errores en precedencia de queries SQL/HQL** — B: grupo 5 (paréntesis con OR/AND).
18. **Loops infinitos en cronjobs** — B: grupo 2 (mails repetidos).
19. **Tags/categorías con campo calculado en BD** en lugar de `@Formula` — B: grupo 13.

---

# Lecciones para próximas entregas

- **Pre-entrega:** revisar exhaustivamente la [[Devolución TP1 — Feedback Primera Entrega]] y la [[Devolución TP1 — Referencia 15 Grupos]] — todos los puntos marcados ahí deben estar corregidos.
- **Paginación:** ningún endpoint que devuelva colección debe estar sin paginar, y **toda paginación con relaciones `*ToOne` o `*ToMany` debe usar 1+1**.
- **`@Async` (nuevo):** nunca acceder a relaciones lazy desde un método `@Async` sin materializarlas antes (con `.getId()` o equivalente forzado) o sin un fetch join en la query del DAO. Esta es la **trampa más sutil** de TP2.
- **Tests:** prohibido `Mockito.verify`. Un test = un comportamiento de un método público. Los tests de persistencia deben validar el estado de la BD (no solo el return). Hacer `em.flush()` cuando aplica.
- **Controllers:** capa fina. Sin `findById` + lógica + update. Sin parseo de roles. Sin chequeos de ownership manual — `@PreAuthorize` con SpEL.
- **JPA:** mapear relaciones (`@ManyToOne`/`@OneToMany`) con entidades, no con ids. Foreign keys explícitas. **Lazy por default**, EAGER solo justificado. Tener en cuenta el efecto cascada: una EAGER en una `@ManyToOne` puede arrastrar 100+ queries al paginar.
- **i18n:** `<c:out>` siempre. `lang="es"` jamás hardcodeado. Mails en locale del destinatario. Mensajes en `GlobalExceptionHandler` también internacionalizados.
- **Scopes de Maven:** hsqldb siempre `test`. spring-web jamás en módulos que no sean webapp.

Ver también: [[Errores Comunes TP1]], [[Pre-Delivery Checklist]], [[Hibernate & JPA]] (1+1, lazy, fetch joins), [[Testing Practices]].

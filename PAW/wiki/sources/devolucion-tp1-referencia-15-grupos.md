---
title: Devolución TP1 — Referencia 15 Grupos
type: source
created: 2026-04-19
updated: 2026-04-19
tags: [feedback, tp1, correcciones, best-practices, errores-comunes, referencia]
sources: [16391485.pdf]
---

# Devolución TP1 — Referencia 15 Grupos

Segundo documento de devolución del TP1 (archivo `16391485.pdf`), distinto del ya ingerido [[Devolución TP1 — Feedback Primera Entrega]]. Cubre **15 grupos** con proyectos variados (gestión de clubes, reservas de mesas, marketplace de vinilos, lecciones online, intercambio de cuartos / Roomify, turnos médicos, torneos, etc.). Cada grupo tiene tres secciones: **Demo**, **Código** y **Seguimiento**, más la **Nota** final.

Valor principal: identificar **patrones de error recurrentes** que la cátedra castiga sistemáticamente. Cada bullet de cada grupo está transcripto textualmente para no perder detalle.

---

## Tabla de notas

| Grupo | Nota | Observación de entrega |
|-------|------|------------------------|
| 1 | 6 | — |
| 2 | 7 | — |
| 3 | 6 | Resta 0.5 UX sprint 1, 0.5 Pivotal sprint 2 |
| 4 | 5.5 | Resta 0.5 UX sprint 1 |
| 5 | 7 | — |
| 6 | 5 | Resta 0.5 UX sprint 1. Entrega 3 min tarde |
| 7 | 2.5 | Entrega tardía 20:08. Resta 0.5 pivotal sprint 2 |
| 8 | 7.5 | Resta 0.5 UX sprint 1 |
| 9 | 7 | — |
| 10 | 5 | — |
| 11 | 6 | — |
| 12 | 8 | — |
| 13 | 6 | — |
| 14 | 7 | Stories sprint 2 marcadas TODO, no DONE |
| 15 | 8 | — |

---

## Grupo 1

**Demo:**
- Dejan avanzar más de lo que existe en la paginación.
- Discovery pobre, faltan maneras de explorar la información. Los tags no se pueden utilizar para indexar la data.
- UX pobre, ej: cards, discovery.
- El register no deja al usuario logueado.
- Algunos forms poseen errores default.
- Tags no persisten frente a submits de form (si hay errores).
- Invitados debería estar paginado y no lo está.
- Echar debería tener modal de confirmación.
- Chequear si se puede ingresar a un evento ya lleno y del pasado.
- Flujo simple; agregaría complejidad al modelo (tipo de evento, si es virtual, de qué trata) e interacción al flujo por sobre simplemente clickear para anotarse.

**Código:**
- Setean el MIME type con una constante mágica.
- **Lógica de negocios en los controllers** ej: `event/{id}`. **Error conceptual grave.**
- Validación manual de pertenencia que debería delegarse a Spring Security.
- Números mágicos en controllers sin explicación.
- Funciones con **auto-unboxing** que puede lanzar `NullPointerException` si se pasa `null`.
- Uso consistente de `@Transactional`.
- Los emails propagan correctamente el locale del destinatario.
- **Orden de reglas rompe autorización por rol.** `/**.authenticated()` antecede a rutas de `ORGANIZER`, por lo que esas quedan solo autenticadas. **Error grave.**
- Excelente cobertura de tests. Faltarían tests de casos no felices.
- Textos sin `c:out` que descansan en patterns bien implementados desde forms → texto libre del usuario abre puerta a XSS (ej: `<h3>${event.name}</h3>`).
- Textos hardcodeados sin i18n (ej: `<h2>Lista de eventos</h2>`).
- Buen uso de Bean validation.

**Seguimiento:** No resta puntos. **Nota: 6**

---

## Grupo 2

**Demo:**
- Los botones de reenviar código y confirmar código de validación de cuenta no se distinguen claramente.
- La aplicación al loguearme sin una estadía en progreso me deja literalmente bloqueado, con sólo un botón de refresh. Esperaría un esquema mucho más interactivo:
  - Indicarme cuándo empieza mi próxima reserva y dónde es, idealmente listado completo si tengo más de una.
  - Poder explorar opciones disponibles para ir planificando mi estadía, incluso si no puedo hacer nada aún.

**Código:**
- Tiene algunas definiciones de versiones de dependencias en los poms hijos, repitiendo o cambiando la del pom padre.
- Se recomienda tener unificadas y consistentes las restricciones de seguridad en los endpoints. Ya sea mediante anotaciones o mediante user access en el `WebAuthConfig`.
- La creación de DTOs se mejoraría con métodos en los builders `.toDTO`, para achicar la complejidad de los Controllers.
- En `ActivityService`, particularmente en `categoriesIds.stream().map(categoryId → categoryDao.findById(categoryId)...)` causa **N+1 queries**. Se debería crear un método `CategoryDao.findByIds(List<Long> ids)` con `WHERE id IN (...)`. Mismo error encontrado en `BookingService`. **Error conceptual grave.**
- No escapan los caracteres especiales de LIKE.
- Uso de boxed primitives innecesarios (el valor null no tiene significado).
- **Lógica de negocio en controllers**, particularmente en `AccountController`. **Error conceptual.**

**Seguimiento:** No resta puntos. **Nota: 7**

---

## Grupo 3

**Demo:**
- La landing es un form de login. Hay un botón "proceder sin cuenta" y ahí caemos al explore. Debería estar más visible, o la landing debería ser pública.
- El usuario anónimo solo puede ver el contenido, pero no puede ver a los profesores. No parece haber lógica detrás de esta decisión.
- Settings y otras tabs se deberían esconder al usuario anónimo.
- El register debería hacer login.
- Tienen un buen CTA para subir una nueva clase.
- El icono de calendario no se ve porque está en negro.
- Agarrar el día y horario del usuario que está utilizando la página para programar el envío del documento.
- Mejorar UI de filtros.
- Redirigir el login.
- Error de tags duplicadas, no deja poner más de dos.
- Upload Date no se persiste.
- El rating debería tener cuántas personas ratearon.
- Página sólida, UI simple y funcional. Detalles bien cuidados.

**Código:**
- Los módulos hijos declaran explícitamente `<version>` cuando estos se heredan del padre.
- `.gitignore`: `.properties` sin prefijo no coincide con archivos `.properties`, solo aplicaría al archivo llamado literalmente `.properties`.
- La validación de si un usuario puede editar una lección se hace manualmente en el controller. **Error conceptual grave.** Debería ser una regla de seguridad declarativa mediante Spring Security.
- Rutas de suscripción / desuscripción sin protección explícita. `if (loggedUser != null)` manual. Debería estar protegida por Spring Security. **Vulnerabilidad grave.**
- Texto hardcodeado no internacionalizado en uno de los archivos JSP.
- Se accede a objetos Optional con `.get()` sin previa verificación de ausencia.
- `lessonId` se maneja como `long` y `int` de forma inconsistente, particularmente en `WatchController`.
- Faltan `@Transactional` en métodos de Servicio, particularmente en `LessonService`.
- Emails a suscriptores usan el locale del contexto actual en lugar del de cada destinatario.
- `LessonJdbcDao` está instanciando directamente `UserJdbcDao` en lugar de inyectarlo. En el `RowMapper`, se llama a `userDao.findById()` por cada fila → **N+1 queries**. **Error conceptual grave.**

**Seguimiento:** Resta 0.5 por UX primer sprint, 0.5 por Pivotal segundo sprint. **Nota: 6**

---

## Grupo 4

**Demo:**
- La página de resultados no está bien resuelta: decenas con la misma imagen y sin información relevante que diferencie a los prestadores (ej: rating).
- El paginado no está bien resuelto: paginan por empresa cuando muestran vehículos. El número de resultados entre páginas varía y no necesariamente está alineado al diseño.
- Los vehículos tienen dimensiones y volúmenes, pero no puedo buscar por esos criterios.
- No ordenan por precio, no se puede controlar el sorting, parece ser en función de cuándo se creó el registro en base — no es un buen criterio de relevancia.

**Código:**
- Incluyen la dependencia sobre `hsqldb` en `compile`. **Error conceptual.**
- `EmailService` (capa de servicio) conoce nombres y paths relativos de templates que no existen en ninguna capa que services conozca, sino que están en `webapp`. **Violación al modelo de capas jerárquicas y error conceptual.**
- No hay tests en la capa de servicio, pese a que existen múltiples servicios con lógica propia.
- El código mezcla nombres en inglés y en español, ej misma clase expone `buscarConFiltrosExtendidos` y `findByEmail`.
- Omiten modificadores de acceso y no parece ser por diseño.
- La `rememberMeKey` podría ser un `@Value` en lugar de un método, delegando la deserialización a Spring.
- Instancian modelos en el controller; lo mejor sería utilizar un DTO para asegurarse que todos los modelos creados provienen de la capa de persistencia.
- Hay casos donde evitan usar JOINs en SQL pero luego fetchean los datos individualmente.
- Los títulos de las páginas no están internacionalizados.
- Los JSP imprimen valores a salida sin escapar → susceptibles a **XSS**. **Error grave.**
- La tabla `fletes_transporte` es modificada desde dos DAOs distintos.

**Seguimiento:** Resta 0.5 por UX primer sprint. **Nota: 5.5**

---

## Grupo 5

**Demo:**
- El form de editar perfil no me deja guardarlo si no tengo CBU, pero sólo me deja cambiar el CBU al ser vendedor → implica que debo ser vendedor para editar mi perfil.
- Cambian el layout de la página; en algunas pantallas ocupan parte o toda la ventana.
- Noticia de editar perfil no me doy cuenta.
- El detalle de disco tiene un botón para redirigir al vendedor pero no funciona.
- Dilatar el mail de contacto por afuera.
- Falta validación de que el comprobante sea imagen o que se puedan ver los PDFs en la página.
- El botón de edición de publicación sólo aparece en las cards y no en detalle.
- Página en -1 arroja un 500.
- No parecen escapar los `%%%` en la búsqueda por texto.

**Código:**
- El paquete `models` usa Java 17 (sobreescribiendo la versión del pom padre).
- Tiene algunas definiciones de versiones de dependencias en los poms hijos, repitiendo o cambiando la del padre.
- Tienen credenciales (e.g. mailing, db) en el repositorio.
- Tienen chequeos de que el usuario no sea nulo o tenga permisos en los controllers, cuando pertenece a Spring Security. **Error conceptual.**
- Oportunidad desaprovechada en el manejo de excepciones. En vez de heredar todas de `VinylsVaultException`, podrían agrupar `NotFound` e `Invalid...` para el `GlobalExceptionHandler` y agregar parámetros que den info particular, en vez de parsearla de la URI.
- **Loguean a nivel DEBUG en prod.** **Error grave.**
- El archivo `messages_en.properties` es innecesario en vista de que `messages.properties` está en inglés.
- Tienen magic strings para setear y comparar ciertos request params.
- En `updateUserInfo`, el caso de username repetido podría manejarse con validators.
- El método `findByIdWithInfo` no agrega información al user, pero a veces se lo llama para reemplazar al `currentUser`.
- A veces tienen endpoints donde el id de la entidad que modifican es un RequestParam y no una PathVariable.
- Hay casos en los que arrojan `RuntimeException` teniendo una custom exception apropiada implementada.
- Uso excesivo de try/catch para loggear errores, donde a veces las únicas excepciones posibles son las que arrojan en el mismo bloque try; a veces atrapan únicamente `Exception` y otras donde el único manejo es relanzar la excepción.
- Tienen tests que no son unitarios pues tienen dos llamados a métodos de la clase a testear.
- Falta testing en la capa de servicios, por ejemplo de las excepciones arrojadas. Investigar `assertThrows`.
- Si bien la mayoría de los modelos usa correctamente tipos primitivos, tienen casos donde usan boxed primitives y no revisan por null.

**Seguimiento:** No resta puntos. **Nota: 7**

---

## Grupo 6 *(Entrega 3 minutos tarde)*

**Demo:**
- La página posee errores de encoding.
- No hay internacionalización.
- El flujo de register tiene bugs:
  - Registrar tira un 500.
  - Register no loguea.
  - La verificación requiere refresh.
  - Cada vez que logueo me dice de verificar cuenta (primera cuenta bugeada sin poder ser utilizada).
- Al cambiar de ROL el usuario debe desloguear y reloguear. Esto no se le avisa al usuario.
- Puedo ingresar a ver MyClubs por más de no tener el ROL correcto.
- Tarda mucho la reserva (probablemente envían emails sin ASYNC).
- Muestran reviews (cantidad y resultado) a pesar de no tener feature de review disponible.
- Mails bien.
- El discovery está completo y funcional.
- El flujo funciona correctamente y cumple con resolver el problema.

**Código:**
- Falta centralizar versiones en el padre; hay versiones en hijos.
- `interfaces` depende de `spring-jdbc`/`spring-web` (infraestructura) → viola límites de capa / expone detalles de implementación. **Error conceptual.**
- Remember-me key hardcodeada y débil; debe ser externa y robusta.
- Textos hardcodeados en controladores (no i18n).
- Chequeos manuales de acceso/pertenencia en controllers (debe ser declarativo en Spring Security). **Error.**
- Hay archivos que no deberían estar en el repositorio (carpeta `PVS-Studio`).
- Bastante lógica de negocio en controllers, ej: el edit club obtiene el club primero, cambia los datos y luego vuelve a llamar al servicio para editarlo. No solo rompe la división en capas sino que para algo transaccional evita toda transaccionalidad. **Error conceptual grave.**
- Se hacen loops para obtener información de la db donde se podrían hacer JOINS, perdiendo eficiencia.
- Emails se envían con el idioma del sender.
- Para actualizaciones, cada tabla debe ser modificada por un solo DAO. `ClubJDBCDao` actualiza `users` rompiendo esta regla.
- Buen uso de `@Transactional`.
- Buen uso de excepciones de dominio.
- Excelente cobertura de tests de los happy paths.
- Cobertura casi nula de los paths de errores.
- Los tests no son unitarios, especialmente los de persistencia. Utilizan los mismos DAOs para generar el contexto de los tests, muchas veces también para chequear los asserts. **Error conceptual grave.**

**Seguimiento:** Resta 0.5 por UX primer sprint. **Nota: 5**

---

## Grupo 7 *(Entrega tardía a las 20:08)*

**Demo:**
- No manejan bien los textos con tildes.
- Aplicar a un trabajo da un 404 por una URL mal formada (sin web context).
- Otras URLs en la aplicación están mal formadas, pero por doble web context.
- La aplicación muestra la opción "crear organización" en el menú lateral incluso si no tengo permisos, lo que siempre termina en un 403.
- Falta contenido para ver bien la página.

**Código:**
- Poms hijos redefinen versiones de dependencias que son heredadas del padre.
- Aunque incluyen las dependencias de logback, no hay configuración para el mismo. Están logueando todo por defecto en `catalina.out` / `localhost.log`. **Error grave y era pedido por enunciado.**
- Imprimen valores en el JSP sin escapar correctamente → vulnerables a **XSS**. **Error conceptual grave.**
- La lógica de autenticación está partida: parte de las reglas en `WebAuthConfig` y el resto regado por el código en distintos controllers vía `@PreAuthorize`.
- Usan `@PathVariable` y similares sin indicar explícitamente el nombre del parámetro. Esto sólo se garantiza funciona correctamente cuando se compila con `-parameters`, lo que no hacen. El mecanismo de fallback mira la tabla de variables locales, pero requiere que la compilación retenga info de debug y no esté optimizada — es un riesgo latente dependiente del setup local.
- **La aplicación no está internacionalizada.** Pese a que definen un `MessageSource`, referencia archivos inexistentes. **Era pedido explícitamente por enunciado.**
- **La aplicación no tiene ni un test unitario.** **Era pedido explícitamente por enunciado.**
- **La aplicación no hace uso de transacciones.**
- La aplicación está incluyendo un dockerfile y configuración de desarrollo como parte del binario final.

**Seguimiento:** Resta 0.5 por pivotal segundo sprint. **Nota: 2.5**

---

## Grupo 8

**Demo:**
- No aceptan fotos como comprobante de pago.
- Faltó un validator en la longitud de la descripción y tira 500 entre 255 y 500.
- No me deja ver las mesas sin estar logueado innecesariamente.
- Buen flujo de creación de mesas y eventos.
- El discovery deja mucho que desear, la búsqueda por fecha no funciona como esperaría. No hay cómo indexar por disponibilidad o precio (2 principales problemas a resolver del producto). Se ve muy poco en la card como para tomar la decisión de entrar a ver más.
- No se puede descargar el comprobante por permisos.
- El flujo de reservar y enviar comprobante está bien.
- Borrar evento no envía emails.
- Los formularios de edición y creación están muy bien armados.
- El flujo para aceptar y manejar reservas del lado del boliche está bien pero requiere ajustes: centralizar las reservas sin necesidad de ingresar a cada evento individualmente.
- Bien implementada la paginación.

**Código:**
- Declaran dependencias con versiones en los pom hijos en lugar de heredar del padre.
- El pom de `models` declara java 17 cuando a nivel global debería ser 21. También declara en el dependency management JUnit 5.
- Agregan SpringFramework a la capa de interfaces de manera innecesaria.
- `DateTimeUtils` en la capa de `models` hace referencia a `java.sql.Timestamp`. El de una base de datos SQL es un detalle de implementación que la capa de modelos no debería conocer.
- Hay tests de persistence que no validan el estado de la DB luego de una alteración.
- Utilizar `Mockito.verify` es incorrecto ya que testea la implementación y no el comportamiento.
- El Bean `WebSecurity` debería estar anotado como `@Component` y no como `@Service`.
- La `rememberMeKey` podría ser un `@Value` en lugar de un método.
- Bien por utilizar custom validators.
- Bien por validar acceso en spring security, pero queda medio mezclado: a veces usan `WebSecurity` para algunas reglas y otras `@PreAuthorize` (`@RequiresVerifiedEmail`). Lo mejor es ser consistente.
- Para los updates, crean el modelo en el controller. Esto hace que existan modelos en la app que no fueron creados por la capa de persistencia. Lo correcto es pasar los datos o tener otra estructura que no sea el modelo.
- `clubAdminService.validateAdmin(clubId)` en varios controllers debería ser verificado por Spring Security.
- El `UserController` tiene **lógica de negocio** en gran parte de sus endpoints. **Error conceptual grave.**

**Seguimiento:** Resta 0.5 por UX primer sprint. **Nota: 7.5**

---

## Grupo 9

**Demo:**
- Código postal muy largo es un error ambiguo y poco claro.
- El botón de guardar edición de perfil redirige mal.
- La sección de doctores me muestra una lista vacía pues todavía no tengo citas, pero no existe aclaración que primero debo concertar una.
- El toggle de show all o sólo míos.
- Resulta contraproducente que el filtro por especialidad sea exacto.
- No se ve la disponibilidad del doctor de primera; tengo que scrollear.
- Elegir un horario pasado arroja un 500 con stacktrace.
- Página de detalle de doctor, ver detalle de cita arroja un 400 por doble `/paw-2025b-09`.
- Cambiar tamaño de página tiene el mismo error de arriba.
- Falta botón de acción para cuando no tiene estudios.
- Página de seleccionar doctor para cita, "1 resultados" (falta pluralización).
- Al doctor le aparecen los estudios "pendientes" en su inicio, pero son los estudios a los que les falta subir el resultado; no parece faltar una acción del lado del doctor.

**Código:**
- Tienen duplicada la dependencia `validation-api`.
- **Loguean a nivel INFO en producción.**
- Tienen credenciales en el repositorio.
- Tienen validaciones para los formularios en los controllers, las cuales deberían ser *constraint validators*. Ciertas validaciones dependen de lógica de negocio que no corresponde en controllers.
- Al validar si `currentPatient` o `currentMedic` es null en los controllers, están haciendo un doble chequeo de seguridad que debería manejarse por Spring Security. También tienen otros chequeos de permisos en controllers.
- Las actualizaciones a un perfil deberían estar encapsuladas en un único método de un servicio. No debería ser necesario actualizar cada entidad relacionada (médico, paciente, usuario base) con una invocación diferente. Algo similar con la creación de una lista de recursos.
- Usan `null` para indicar valores inexistentes, a veces usan `Optional`, o incluso arrojan excepción como `ScheduleNotFoundException`.
- Manejan `"/{path:[^.]*}"`, `/{section:[a-zA-Z]+}/{path:[^.]*}`, `/{level1:[a-zA-Z]+}/{level2:[a-zA-Z]+}/{path:[^.]*}` para casos de PageNotFound en vez de delegarlos a Spring.
- Tienen magic numbers como el tamaño de página máximo y default a lo largo de la aplicación.
- El validador de que coincidan las contraseñas está fuertemente acoplado a los forms (revisa si el form recibido es un `instanceof` de los implementados). Se puede parametrizar.
- Para buscar los exámenes pendientes, se traen 1000 exámenes y filtran en memoria.
- Instancian entidades del dominio a nivel servicio (parece ser sólo para ahorrarse los parámetros). En conjunto con el punto siguiente, hay instancias con información parcial que no se corresponden con su versión en la base de datos.
- Sus modelos no guardan el id de referencia a la entidad relacionada sino que usan composición. Esto causa que los rowmappers a nivel DAO deban traerse todas las entidades relacionadas cuando quieren traerse una instancia.
- No escapan los caracteres especiales de LIKE.
- Buena cobertura de tests. Les recomiendo el uso de `AssertThrows`. Sin embargo, tienen tests que no son unitarios (a veces usan la misma clase a testear para hacer la validación del test) y, en persistencia, les falta validar el estado de la base de datos. Tampoco es correcto el uso de `Mockito.verify`. **Errores conceptuales graves.**

**Seguimiento:** No resta puntos. **Nota: 7**

---

## Grupo 10

**Demo:**
- El sign up form está muy finito.
- Deberían mostrar las habitaciones si no está logueado el usuario.
- Bien que el sign up hace login.
- La pantalla de verify está muy rara y no es user friendly.
- Si no tengo email verificado, me deberían mandar a la pantalla del explore con un mensaje de error en rojo arriba, en vez de a una landing vacía.
- Falta favicon en Roomify your home.
- Deberían redirigir al room creado después de crearlo.
- Las tags son clickeables pero no lo parecen.
- No mostrar el form de swap my room si el room es mío.
- La location filtra por país pero muestra que filtra por ciudad. Cambiar el botón.
- Filters está a la izquierda, deberían centrarlo con Search.
- El mail de *swap was accepted* tiene mal el contenido.
- Misma oferta por misma plata no debería ser posible.
- Queda pendiente una oferta si hay dos para la misma fecha por distinto dinero → se pueden aceptar las dos. No debería ser posible.
- Filtros funcionan bien.
- CSS de las cosas no está muy prolijo. En todos lados.
- No se pueden agregar más fechas a los rooms. Hay que volver a publicar el room.
- La UI de edit profile tiene lugar para mejoras.
- Tienen un problema de encoding.
- Se pueden cancelar swaps pero no se muestran más ni se detallan en el email.
- Editar propiedades de un cuarto que tiene un swap pendiente no notifica a nadie.
- Tienen funcionalidad de dejar comentarios pero no se puede testear porque debe haber un trip completado.
- No mostrar página 7 si no hay resultados para popular.

**Código:**
- Los módulos hijos declaran explícitamente `<version>` cuando se heredan del padre.
- Credenciales de Gmail hardcodeadas y trackeadas en git.
- La remembeme key está hardcodeada y es trivial. Compromete la seguridad de "recordarme".
- Falta el `c:out` en varios mensajes de error.
- El controller `TripsController` popula listas pasadas por referencia. **Violación grave de OOP y principios SOLID.**
- Excesivo logging a info, se recomienda reducir estas llamadas en código productivo.
- El controller `RoomController` instancia objetos de dominio. **Error conceptual grave.**
- La validación de si un usuario es owner de un room se hace manualmente en el `RoomController`. **Error conceptual grave.** Debería ser una regla de seguridad declarativa mediante Spring Security.
- Faltan **muchos** `@Transactional` en métodos de Servicio que utilizan inserts, deletes o updates. En `UserService`, `RoomAvailabilityService`, `ImageService`, entre otros.
- Los servicios no deben instanciar entidades de dominio. Es responsabilidad del DAO.
- Loop de usuarios innecesario en `ContactService`. Para cada trip se consulta el nombre del usuario asignado. Se debería evitar incluyendo el dato necesario en el modelo de trip (userName).
- Se está haciendo un loop de envío de emails en `ContactService`. Se recomienda manejarlo en un hilo asincrónico aparte para no deteriorar el tiempo de procesamiento de la request principal.
- Uso incorrecto e innecesario de boxed primitives en varias clases.
- No se está utilizando el enum `SwapStatus` en el modelo `Contact`; en cambio se utiliza con un String y permite valores inválidos en la BD.
- Muchos textos hardcodeados en varios JSP.
- Hay dependencias en los tests, por lo que no son unitarios. Se utilizan métodos aparte del que se está testeando varias veces, lo que causa que si los otros métodos fallan, el test va a fallar también. **Error conceptual grave.**

**Seguimiento:** No resta puntos. **Nota: 5**

---

## Grupo 11

**Demo:**
- La página sin resultados del search le falta un clear de los filtros (CTA).
- Falta escapar `%` y `_` en el search.
- Posible XSS en el searchbar.
- Si sobreescribo el filtro de page en la URL se me defaultea a la última página, bien.
- Falta error 500 custom.
- Tienen 403 custom.
- Estaría bueno una página donde te indique que luego de registrarte tenés que verificar la cuenta.
- Falta el fav icon en algunas páginas.
- Puedo crear ofertas sin ningún dato.
- Bien el modal de confirmación ante acciones finales.
- En algunos casos los 403 deberían ser 404.
- En la parte de postulaciones le falta completar más el flujo, queda simplemente en un contacto por mail y una review. Lo mismo para la parte de trabajos, no termina de entenderse bien para qué es el estado.
- En la oferta de trabajo las imágenes les falta `c:url`.
- Falta recuperar contraseña.

**Código:**
- Hay algunos toasts que no poseen i18n sino que tienen un mensaje hardcodeado.
- Hay **MUCHA** lógica de negocio en los controllers, solo para ejemplificar el `JobApplicationController` tiene lógica de negocio en TODOS sus métodos. Esto hace que los controllers no sean verdaderos facades. **Error conceptual grave.**
- Es incorrecto tener un endpoint POST `/logout` ya que eso lo maneja el propio Spring Security.
- No usan Custom Validators y toda la lógica de validación más compleja está en los controllers.
- El `SecurityErrorBridgeController` no tiene sentido que exista.
- Hay versiones declaradas en la dependencia y no como property.
- **Loguean a debug en producción. Error conceptual grave.**
- La `rememberMeKey` podría ser un `@Value` en lugar de un método delegando la deserialización a Spring.
- Hay muchos métodos sin `@Transactional`. Todos los métodos deberían tenerlo y no únicamente los que realizan escrituras. **Era pedido por el enunciado.**
- Utilizan `@PreAuthorize` en la capa de servicios; debería ser evaluado antes de ingresar a los controllers y estar gestionado todo el control de acceso uniformemente.
- Hay muchas operaciones realizadas en Java que implican JOINs o filtros de datos. Estas deberían realizarse en la capa de persistencia, ya que pueden generar inconsistencias en los datos devueltos o cargar en memoria un gran número de objetos.

**Seguimiento:** No resta puntos.
- Hay features que no están correctamente definidas.
- Auto-login no es una chore.
- Bien por utilizar prioridades y módulos.

**Nota: 6**

---

## Grupo 12

**Demo:**
- Si sobreescribo el filtro de categoría en la URL se me defaultea a sin filtros, bien. Lo mismo con el page, me manda al último.
- Emprendimientos con información faltante que no se pueden contactar debería aclararlo en el detalle del emprendimiento.
- 404, 403 Custom bien.
- Autologin al registrarme.
- Bien CTA en los mails.
- Los mails solo me llegan en inglés.
- Los rating son por emprendimiento pero sólo puedo colocarlo una única vez (no es por compra).
- En el login falta un botón para volver a la home.

**Código:**
- Hay versiones de dependencias en el módulo de interfaces y models. Todas las versiones deberían ser declaradas en el pom padre.
- En el email service, obtienen el Locale del `LocaleContextHolder` o del Locale que inyecta el controller en lugar de utilizar el `preferredLanguage` que guardan en el modelo de User. Esto hace que si hay emails cruzados entre users siempre se envíen con el idioma del user que dispara el mail y no del destinatario.
- El método `ensureAcceptedBelongsToRequester` y `ensurePendingBelongsToSeller` suena a que realiza lógica de verificación de "ownership" de recursos. Esta lógica debería ser ejecutada por spring security y no estar directamente en el controller (en el controller, si lo necesitan, sería simplemente obtener el dato).
- No internacionalizan todo, por ejemplo símbolos de monedas y alt de los tag `img`. Además, si bien usan argumentos para los mensajes, una mejora para no tener que tener 2 keys (una singular y una plural) es realizar algo así:
  `myKey=Tengo {0} {0, plural, one{banana}other{bananas}}`
  Esto con 3 quedaría "Tengo 3 bananas" y con 1 "Tengo 1 banana".
- Hay algunas rutas en `WebConfig` que poseen primero un nivel más restrictivo pero luego hacen un `permitAll()`.

**Seguimiento:** No resta puntos. **Nota: 8**

---

## Grupo 13

**Demo:**
- Funcionalidad super limitada, no alcanza para un MVP. El ver mis eventos no filtra los pasados ni los ordena cronológicamente.
- Las píldoras para filtrar resultados no se aplican automáticamente y muestran todas las opciones, incluso si no hay resultados compatibles con la búsqueda actual.
- Mails mal formateados, con texto como `Eventoattend.confirmation.date=Fecha Recorrido por las oficinas de Globant Argentina`.
- El `Readme.md` no incluye credenciales de todos los tipos de usuario.
- Al hacerme administrador no puedo crear eventos / ir a gestionarlos sin que dé un error.

**Código:**
- Concatenan valores en los JSP en lugar de interpolar variables.
- Pasan por todos lados un atributo `role` y hardcodean reglas de acceso en base a estos magic strings, en lugar de usar la taglib de spring security para validar si un usuario tiene o no acceso a cierta parte de la aplicación.
- `messages_es.properties` es innecesario cuando el default en `messages.properties` es en español.
- El paquete de configuraciones de spring no necesita escanearse a sí mismo, las clases ya están mapeadas en el `web.xml`.
- Se crea un bean para `CharacterEncodingFilter` que luego no se usa; el filtro está configurado directamente en el `web.xml`.
- Se configura para escanear múltiples veces los mismos paquetes en forma innecesaria. Los distintos `@Configuration` no parecen tener en claro qué cosas configuran y usan.
- El `EmailServiceImpl` está anotado como `@Transactional` pese a no usar la base de datos y que todos los métodos públicos están marcados como `@Async`.

**Seguimiento:** No resta puntos. **Nota: 6**

---

## Grupo 14

**Demo:**
- A los emails les falta un header.
- Al restablecer contraseña, estaría bueno loguear al usuario al final del proceso.
- La imagen de banner no se muestra; se muestra siempre la de perfil.
- Algunos botones no funcionan (llevan a la url root).
- Si bien lo validan al mandar el form, permiten ingresar un valor negativo.
- Estaría faltando un mail que notifica al creador del torneo cuando una persona se inscribe.
- La sección de last participations y favorite games no muestra la información correctamente.
- No se pueden marcar partidos como empate.
- Cuando una vista tiene múltiples paginaciones, no manejan queries params separados.
- Al aplicar ciertos filtros tira 500.
- Estaría bueno taguear los torneos en la miniatura con el estado (coming soon, in progress, finished, etc).
- La búsqueda de participantes es incómoda. No sugiere nombres de usuario y si se introduce un usuario inválido tira error.

**Código:** *(Commit corregido: ffaf3eaee4c2799ae7288024bc9eb7936f60c29f)*
- Pushean archivos propios del IDE al repositorio. Ie: `webapp.iml`.
- Pushean archivos de configuración vacíos.
- El módulo webapp está dividido en dos directorios raíces, `src` y `bin`. No parece tener sentido.
- El validador `PasswordMatcher` está fuertemente acoplado con el `UserForm`, volviendo imposible su reutilización, teniendo que implementarlo de nuevo para `ResetPasswordForm`.
- No aplican ninguna validación en los `MultipartFile`, como formato o tamaño máximo.
- Usan `snake_case` en algunos casos, siendo `camelCase` el estándar en Java.
- Utilizan boxed primitives a pesar de no hacer uso de la semántica Null.
- Realizan `get()` de un Optional sin validar que tenga un valor.
- Los métodos de una interface no necesitan ser anotados como `public`.
- Utilizan magic numbers en diferentes lugares; por ejemplo en los DAOs hardcodean que el tamaño de página es 9.
- En la lógica de `resetPassword` envían el `userId` además del token. Un token tiene asociado un usuario; enviar el usuario por parámetro parece ser innecesario.
- La función `checkTokenValidity` tiene TODOs no resueltos. La función `resetPassword` retorna `Optional<Token>`.
- Exponen endpoints para crear Games en el controller de Tournaments.
- El endpoint de torneos debiera recibir el id del torneo por PathParam y no como QueryParam.
- Al hacer un GET a "/", se actualiza el Locale del usuario en la base de datos.
- Los TeamSizes son una lista de 5 valores hardcodeados.
- Realizan filtrado de resultados en Java. Debería realizarse directamente en la base de datos.
- Retornan colecciones sin una paginación adecuada.
- Las "secciones" se usan como magic strings; además definen diferentes métodos para cada una de ellas, en lugar de utilizar una sola query con el filtrado adecuado.
- Definen distintos métodos en los servicios que podrían ser simples getters de los modelos.
- `TournamentServiceImpl` tiene mucha lógica de negocio, sin embargo no está testeado.
- La cobertura de tests en la capa de servicios es muy pobre.
- Todas las capas tienen un directorio `bin`. Además pushean el directorio `out`.
- Realizan inserciones en la base de datos en los diferentes tests para setear precondiciones, en lugar de partir de un estado global definido adecuadamente en un script sql.
- En los tests de persistencia luego de insertar una entidad, realizan un get con `jdbcTemplate`; deberían solo usar `countRowsInTable`.
- El `schema.sql` está vacío.

**Seguimiento:** No resta puntos. Todas las stories del sprint 2 están marcadas como TODO (y no como DONE). **Nota: 7**

---

## Grupo 15

**Demo:**
- Algunos mails no tienen call to actions ni header.
- Bien por dejar logueado al usuario al registrarse.
- No manejan stock pero asumen que el stock es "infinito".
- Estaría bueno que acepten PDFs como comprobante de pago. Y faltaría poder ver un CBU o alias del vendedor. Ahora mismo este intercambio se debe realizar enteramente por mail.
- Estaría bueno mostrar los datos del producto al seleccionarlo en el publish.

**Código:** *(Commit corregido: 4028cba100a905a2620691d5f0c30eecc5aa3d47)*
- **Loguean a DEBUG en producción.** **Error grave.**
- Tienen los forms desparramados en diferentes directorios.
- En algunos tests de servicios no mockean las llamadas a los DAOs.
- Pushean archivos de configuración vacíos.
- Tienen tests comentados.
- No testean los métodos `create` en algunos DAOs. Por ejemplo en `ListingOffer`.
- No siguen la convención de nombres de Java, teniendo paquetes con mayúscula; métodos en PascalCase, etc.

**Seguimiento:** No resta puntos. **Nota: 8**

---

## Errores recurrentes destacados (transversales)

Patrones sistemáticamente castigados como **error conceptual grave** o **error grave** en múltiples grupos.

### 1. Lógica de negocio en controllers
Grupos **1, 2, 6, 8, 10, 11**. Controllers deben ser facades; obtener datos → delegar a service → responder. Casos emblemáticos: `event/{id}` (G1), `AccountController` (G2), edit club con lógica de obtener+modificar+actualizar (G6), `UserController` (G8), `RoomController` (G10), `JobApplicationController` (G11). Ver [[Controllers & Validation]].

### 2. Validación de ownership / acceso manual en controllers
Grupos **1, 3, 5, 8, 9, 10, 11**. `if (loggedUser != null)`, chequeos manuales de pertenencia, `validateAdmin()` llamado desde controller. Debe ser declarativo en Spring Security (`@PreAuthorize`, `SecurityFilterChain`). Ver [[Spring Security]].

### 3. XSS — imprimir en JSP sin `c:out`
Grupos **1, 4, 7, 10, 11**. Texto libre del usuario en `${var}` sin escape. Obligatorio usar `<c:out>` o `<spring:escapeBody>`. Ver [[JSP Views]] — sección XSS Prevention.

### 4. Loguear a nivel DEBUG/INFO en producción
Grupos **5, 9, 11, 15**. Y el G7 que directamente no configuró logback y está logueando a `catalina.out`. Ver [[Logging (Logback / SLF4J)]].

### 5. N+1 queries / JOINs en Java
Grupos **2, 3, 6, 11**. `.stream().map(id → dao.findById(id))`, loops sobre resultados para poblar relaciones, filtrar en memoria 1000 registros (G9), joins que se evitan en SQL para luego fetchear individualmente (G4). Ver [[DAOs (Persistence Layer)]] y [[Persistence (Spring JDBC)]].

### 6. Tests que validan implementación con `Mockito.verify` / tests no unitarios
Grupos **5, 6, 8, 9, 10**. `Mockito.verify()` testea implementación, no comportamiento. Tests de persistencia que usan los mismos DAOs para setup Y asserts (G6, G10). Tests con múltiples llamadas a la clase a testear (G5, G9). Ver [[Testing Practices]].

### 7. Falta `@Transactional`
Grupos **3, 10, 11**. G11: *todos* los métodos de servicio deberían tener `@Transactional` (readOnly para lecturas), era pedido por enunciado. G10: faltan en `UserService`, `RoomAvailabilityService`, `ImageService`. Ver [[AOP & Transactions]].

### 8. i18n — locale del sender en lugar del destinatario
Grupos **3, 6, 12**. Usar `LocaleContextHolder` o el Locale inyectado por Spring envía el mail en el idioma del *usuario activo*, no del destinatario. Guardar `preferredLanguage` en `User` y usarlo al construir el email.

### 9. Magic strings / magic numbers
Grupos **1, 5, 9, 13, 14**. Números mágicos como tamaño de página (G1, G9, G14), strings para roles (G13), request params hardcodeados (G5), MIME types (G1), TeamSizes hardcodeados (G14), "secciones" como strings (G14). Usar enums o properties.

### 10. Violación de capas
- G4: `EmailService` (services) conoce templates de `webapp`. **Error conceptual.**
- G6: `interfaces` depende de `spring-jdbc`/`spring-web`. **Error conceptual.**
- G8: `DateTimeUtils` en `models` referencia `java.sql.Timestamp`. 
- G6: `ClubJDBCDao` actualiza la tabla `users` (debe ser un único DAO por tabla).

### 11. Versiones en poms hijos
Grupos **1, 2, 3, 5, 7, 8, 10, 12**. Las versiones deben declararse en el pom padre (dependency management). Los hijos sólo declaran el artefacto. G5 y G8 incluso sobreescriben la versión de Java.

### 12. Credenciales en el repositorio
Grupos **5, 9, 10**. Mailing, DB, Gmail. Deben ir en variables de entorno / properties externos.

### 13. `@PathVariable` sin nombre explícito
Grupo **7**. Depende de compilar con `-parameters` o de retener info de debug. Riesgo latente.

### 14. Auto-unboxing y boxed primitives innecesarios
Grupos **1, 2, 5, 10, 14**. `Integer`/`Long` cuando `null` no tiene significado → NPE al auto-unboxar. Usar primitivos.

### 15. `Optional.get()` sin verificación
Grupos **3, 14**. Llamar `.get()` sin `isPresent()` / `orElseThrow()` es un antipatrón.

### 16. Magic strings para roles en lugar de spring-security-taglibs
Grupo **13**. Pasar un atributo `role` y hardcodear reglas. Usar `<sec:authorize>`.

### 17. Emails síncronos
Grupos **6, 10**. Enviar emails en el hilo de la request deteriora el tiempo de respuesta. Usar `@Async`.

### 18. Endpoint POST `/logout` manual
Grupo **11**. Lo maneja Spring Security automáticamente, no hay que escribirlo.

### 19. `@Async` + `@Transactional` en el mismo bean sin BD
Grupo **13**. `EmailServiceImpl` anotado como `@Transactional` sin tocar BD y todos los públicos son `@Async`.

### 20. Archivos basura en el repositorio
Grupos **6, 10, 14, 15**. Carpetas de IDE (`.vscode`, `webapp.iml`, `bin/`, `out/`), archivos de análisis estático (`PVS-Studio`), configs vacíos, tests comentados.

### 21. `remembermeKey` hardcodeada / débil
Grupos **4, 6, 8, 10, 11**. Debe ser externa, robusta, e inyectada con `@Value`.

### 22. Escape de LIKE (`%` y `_`)
Grupos **2, 9, 11**. No escapar caracteres especiales en búsqueda por texto.

### 23. Validación con `@RequestParam` / query params no validados
Grupos **5 (página `-1` → 500)**, **G9 (elegir horario pasado → 500)**. Validar explícitamente.

### 24. Mezcla de `null` / `Optional.empty()` / excepciones para "no existe"
Grupo **9**. Inconsistencia peligrosa. Elegir una estrategia y ser consistente.

### 25. Spring stereotype incorrecto
Grupo **8**. `WebSecurity` anotado como `@Service` en lugar de `@Component`.

### 26. Instanciar modelos de dominio en controllers/services
Grupos **4, 9, 10**. Los modelos deben venir de la capa de persistencia; para updates pasar datos o DTOs, no el modelo.

### 27. Listas mutables pasadas por referencia
Grupo **10**. `TripsController` popula listas pasadas por referencia. Violación de OOP/SOLID.

### 28. Falta `c:url`
Grupos **10, 11**. URLs sin prefijo de contexto → rotas en producción detrás de un reverse proxy.

### 29. Exception handling abusivo
Grupo **5**. try/catch solo para loggear; catchear `Exception` genérico; relanzar sin agregar info. Usar `@ControllerAdvice` / `@ExceptionHandler`.

### 30. Tests que no cubren paths de error
Grupos **1, 6**. Solo happy paths. Usar `assertThrows`.

---

## Puntos positivos destacados

- **G1**: excelente cobertura de tests; uso consistente de `@Transactional`; emails propagan locale del destinatario; buen uso de Bean validation.
- **G2**: nota 7, devolución balanceada.
- **G6**: excelente cobertura de happy paths; buen uso de `@Transactional`; buen uso de excepciones de dominio; discovery completo y funcional.
- **G8**: formularios muy bien armados; paginación bien implementada; custom validators.
- **G12**: nota 8 — la más alta; 404/403 custom; autologin al registrarse; buen CTA en mails.
- **G15**: nota 8; registro con auto-login.

---

## Tip i18n pluralización (del G12)

Formato ICU MessageFormat soportado por Spring 5+ via `ReloadableResourceBundleMessageSource` con `messageInterpolator`:

```properties
myKey=Tengo {0} {0, plural, one{banana}other{bananas}}
```

Evita tener keys separadas singular/plural.

---

Ver [[Errores Comunes TP1]] para la guía accionable, y [[Devolución TP1 — Feedback Primera Entrega]] para la devolución específica del curso actual (12 grupos, proyecto Rent The Slopes).

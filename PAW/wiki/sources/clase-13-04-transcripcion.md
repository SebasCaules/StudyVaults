---
title: Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice
type: source
created: 2026-04-22
updated: 2026-04-22
tags: [logging, logback, aop, transactions, async, scheduled, controller-advice, transcript]
sources: [Clase_13_04.pdf, audio_transcript.vtt, Screen Recording 2026-04-13 at 21.07.05.mov]
---

# Transcripción Clase 13/04 — Logging, AOP y ControllerAdvice

**Archivo original:** `raw/Transcripciones/Clase_13_04.pdf` (notas estructuradas de la clase del 13 de abril 2026, 19:01).
**Material adicional:** `raw/Transcripciones/audio_transcript.vtt` (VTT literal del audio, ~4k líneas) y la grabación `Screen Recording 2026-04-13 at 21.07.05.mov`.

Esta es una **clase en vivo** (profesor: Juan Martín Sotuyo Dodero) que cubre el mismo temario que [[Clase 5 — Spring Security y Logging]] + [[Clase 6 — Logging parte 2 y AOP]] con aclaraciones y preguntas del curso. El contenido conceptual ya está destilado en las páginas de concepts; este archivo vive como referencia cruzada.

---

## Takeaways principales

1. **Configuración dual de Logback** — `logback-test.xml` en `src/test/resources` tiene prioridad sobre `logback.xml` en `src/main/resources` cuando ambos existen. Ver [[Logging (Logback / SLF4J)]].
2. **Interpolación SLF4J obligatoria** — `logger.debug("User: {}", email)` en vez de concatenar con `+`. El logger sólo construye el string si el nivel está habilitado. Ver [[Logging (Logback / SLF4J)]].
3. **Proxies dinámicos de Spring** — Spring AOP usa `java.lang.reflect.Proxy` (similar a Mockito). El proxy solo existe "desde afuera": llamadas locales (`this.method()`) y métodos privados **no se interceptan**. Ver [[AOP & Transactions]].
4. **`@Transactional` a nivel de servicios** — Demasiado grueso en web, demasiado granular en DAO. Anotar *todos* los métodos públicos del service, con `readOnly = true` para lecturas.
5. **`@Async` y ThreadLocal** — `LocaleContextHolder` y `SecurityContextHolder` usan `ThreadLocal`, por lo que NO están disponibles en el thread asíncrono. Solución: pasar `Locale` y datos del usuario como parámetros explícitos.
6. **`@Scheduled` y múltiples instancias** — Se ejecuta en CADA instancia. Para este proyecto (servidor único) es válido; en producción multi-servidor se necesitan soluciones centralizadas.
7. **`@ControllerAdvice` para cross-cutting en controllers** — `@ModelAttribute` para compartir datos (ej. `currentUser`, ver [[Controllers]]#CurrentUserAdvice) y `@ExceptionHandler` para manejo centralizado de excepciones (ver [[Controllers]]#GlobalExceptionHandler).

---

## Nuevos matices respecto al material escrito

- **Jerarquía de loggers y additivity** — Un logger raíz (warning en prod) + loggers específicos por paquete (`ar.edu.itba.paw` en info/debug). `additivity="false"` corta la propagación hacia arriba.
- **Política de rolling files** — Un archivo por día, máximo 5 archivos guardados. Trade-off entre predictibilidad temporal y control de espacio en disco.
- **API fluida de SLF4J** — `logger.atDebug().addKeyValue("email", form::getEmail).log("Message")` permite suppliers lazy. Optimizado por la JVM para eliminar overhead cuando el nivel no está habilitado.
- **Organización recomendada** — Archivo separado de errores + archivo general; prefijo con nombre de aplicación para no mezclar logs si hay varias apps.
- **`@Transactional(readOnly = true)`** — Permite al driver optimizar el tipo de conexión. En esquemas de replicación primaria/secundaria dirige lecturas a réplicas.
- **Atributos avanzados de `@Transactional`** — Nivel de aislamiento (`isolation`), propagación (`propagation`), excepciones que no causan rollback.
- **Configuración de aspectos custom** — Raramente necesaria; la mayoría de las necesidades están cubiertas por Spring (security, tx, logging, validation).

---

## Preguntas y discusión (transcript literal)

La clase incluye una discusión de preguntas abiertas antes de entrar al temario. Destacados:

- **Organización del frontend del Sprint 2** — jerarquía de vistas y uso de tags vs includes directos. Recomendación: "no es un Golden Hammer" — usar tags cuando hay lógica reusable, includes cuando sólo hay estructura. Ver [[Views (JSP & Tags)]] y [[JSP Views]]#Custom-Tags.
- **Setup Logback del proyecto** — confirmación de la diferenciación entre `logback-test.xml` (dev local) y `logback.xml` (productivo empaquetado en el WAR).

---

## Cross-references

- **Logging detallado** → [[Logging (Logback / SLF4J)]]
- **AOP + Transacciones** → [[AOP & Transactions]]
- **ControllerAdvice + GlobalExceptionHandler** → [[Controllers & Validation]]
- **Apuntes teóricos paralelos** → [[Clase 5 — Spring Security y Logging]], [[Clase 6 — Logging parte 2 y AOP]]

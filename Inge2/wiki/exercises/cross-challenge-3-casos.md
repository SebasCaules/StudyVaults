---
title: "Cross Challenge — 3 casos"
aliases:
  - "Cross Challenge — 3 casos"
  - "Cross challenge — 3 casos"
  - "Cross challenge"
type: exercise
created: 2026-04-22
updated: 2026-04-22
tags: [ejercicio, cross-challenge, casos, banco, turismo, seguros]
sources:
  - "raw/exercises/Cross challenge.pdf"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Katas de Arquitectura]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Architecture Business Cycle]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[TP general]]"
  - "[[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]]"
  - "[[Arquitectura de software — definición]]"
---

# Cross Challenge — 3 casos

## Rol del ejercicio

Tres casos breves, pensados para trabajar **en paralelo** por equipos distintos y luego **cruzar** (por eso "cross") las soluciones para comparar decisiones arquitectónicas frente a restricciones similares (source: raw/exercises/Cross challenge.pdf).

Cada caso ejercita el mismo flujo de [[Attribute Driven Design]] sobre un dominio distinto.

## Los 3 casos

### Caso 1 — Banco / minitiendas PYME

**Dominio:** un banco lanza una línea de producto para **minitiendas PYME** — pequeños comercios que necesitan medios de cobro electrónico (POS, link de pago, QR) integrados con su cuenta bancaria.

**Drivers clave probables:**
- **Security** — manejo de dinero.
- **Availability** alta — un POS caído = ventas perdidas del comercio.
- **Usability** — PYMEs sin IT interno.
- **Scalability** — potencialmente miles de tiendas.
- **Time-to-market** — competencia con fintechs ágiles.

**Trade-offs clásicos:**
- Security vs Usability — MFA vs fricción.
- Integración con core bancario legacy vs time-to-market.

**Estilos candidatos:** Microservicios fintech + API Gateway; Event-driven para settlement; Offline-first para POS físico.

### Caso 2 — Turismo empresarial

**Dominio:** plataforma de **gestión de viajes corporativos** — empleados solicitan viajes, flujos de aprobación, booking con múltiples proveedores, facturación corporativa.

**Drivers clave probables:**
- **Interoperability** — GDS (Amadeus, Sabre), hoteleras, aerolíneas.
- **Workflow configurability** — cada empresa tiene reglas de aprobación distintas.
- **Auditability** — expenses corporativos con compliance.
- **Performance** — búsquedas de vuelos razonablemente rápidas.
- **Availability** — útil 24×7 para viajeros en cualquier zona horaria.

**Trade-offs clásicos:**
- Integración profunda (mejor UX) vs agilidad de onboarding de nuevos proveedores.
- Personalización por empresa vs simplicidad de plataforma.

**Estilos candidatos:** Layers + Broker hacia GDS; Workflow engine para aprobaciones; Microservicios por dominio (search, booking, expense).

### Caso 3 — Seguros de autos

**Dominio:** **gestión de seguros automotor** — cotización, emisión de pólizas, endosos, gestión de siniestros, peritajes, pagos de indemnizaciones.

**Drivers clave probables:**
- **Reliability** de cálculos actuariales.
- **Integration** con proveedores de inspecciones, talleres, peritos.
- **Auditability** extrema — regulación aseguradora.
- **Workflow** complejo en siniestros — muchos estados, muchos actores.
- **Scalability** con fluctuaciones estacionales.

**Trade-offs clásicos:**
- Time-to-decision en cotizaciones (Performance) vs precisión actuarial (Reliability, Precision).
- Workflow rígido (Auditability) vs flexibilidad para casos atípicos.

**Estilos candidatos:** Core legacy con layer de modernización (strangler fig); workflow engine; event sourcing para historial de póliza; CQRS para separar emisión de consulta.

## Patrón de resolución

Para cada caso:

1. **Identificar stakeholders** — banco/dueños de comercio; empresas/empleados/proveedores; asegurado/perito/banco/regulador.
2. **Priorizar atributos** de la tabla ISO 25000.
3. **Construir [[Árbol de utilidad]]** con 3-5 escenarios hoja por atributo dominante.
4. **Elegir [[Estilos arquitectónicos]]** justificando.
5. **Cruzar resultados entre equipos** — ¿cuándo equipos distintos frente al mismo caso llegan a arquitecturas distintas? ¿Qué driver hicieron dominar?

## Valor pedagógico del "cross"

El insight principal no es *la* arquitectura "correcta" de cada caso — es **observar la divergencia**:

- Mismo enunciado, arquitecturas distintas según qué driver priorizó cada equipo.
- Ilustra [[Architecture Business Cycle]] — equipos con distinta "experience" y "tech environment" llegan a decisiones distintas.
- Hace concreto el punto de [[Arquitectura de software — definición|Brooks (No Silver Bullet)]]: no hay arquitectura universal.

## Patrones de error frecuentes

- **Copiar arquitecturas de moda** sin justificar contra los drivers (ej: "usamos microservicios porque sí").
- **Ignorar restricciones** de integración con legacy.
- **Sub-estimar auditability** en los casos regulados (banco, seguros).
- **Olvidar scalability** o definirla solamente como "horizontal" sin aterrizar.

## Relación con otros materiales

- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — otro ejemplo con más nivel de detalle.
- [[Enunciados de parciales — 6 casos]] — banco más amplio.
- [[TP general]] — integra varios de estos dominios (logística con satélites).
- [[Architecture Business Cycle]] — marco teórico del "cruce".

## Pregunta a profundizar

¿Cómo convertir un ejercicio Cross Challenge en una kata de Platform Engineering? — no sólo "cuál arquitectura elige cada equipo" sino "qué guardrails debería tener el banco/empresa/aseguradora para que cualquier arquitectura elegida por los equipos sea consistente con la estrategia corporativa".

## Fuentes y lecturas

- Bass, Clements, Kazman — *Software Architecture in Practice*.
- Richards, Ford — *Fundamentals of Software Architecture*, case studies.
- Hohpe, Woolf — *Enterprise Integration Patterns*.

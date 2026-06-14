---
title: Sprint 2 — Roadmap y Asignaciones
type: analysis
created: 2026-04-19
updated: 2026-04-19
tags: [sprint-2, roadmap, tareas, bd, pantallas]
sources: [sprint-2-indicaciones.md]
---

# Sprint 2 — Roadmap y Asignaciones

Planificación del Sprint 2 según indicaciones del corrector. Incluye cambios en BD, pantallas a modificar, pantallas nuevas y asignaciones por integrante.

---

## Cambios en la BD

### Tabla `products` — agregar campo `status`

```sql
ALTER TABLE products ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
-- Valores: 'ACTIVE', 'PAUSED', 'DELETED'
```

### Tabla `rents` — agregar `payment_image_id`

```sql
ALTER TABLE rents ADD COLUMN payment_image_id INTEGER REFERENCES images(id);
-- Nullable: sólo se llena cuando el renter sube el comprobante
```

### `RentStatus` — nuevos valores

A los existentes (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`) agregar:

| Valor | Significado |
|-------|-------------|
| `PAYMENT_PENDING` | Reserva aprobada, esperando comprobante del renter |
| `PAYMENT_ACCEPTED` | Provider confirmó el pago |
| `PAYMENT_REJECTED` | Provider rechazó el comprobante (renter puede volver a mandar) |
| `EXPIRED` | Reserva expirada (manejo automático) |

Ver [[Enums]] y [[Domain Models]].

---

## Flujo de estados de una reserva

```
PENDING
  ├── APPROVED → PAYMENT_PENDING
  │     ├── PAYMENT_ACCEPTED → (completada)
  │     └── PAYMENT_REJECTED → PAYMENT_PENDING (renter puede reintentar)
  └── REJECTED
  └── CANCELLED
  └── EXPIRED
```

---

## Flujo del pseudo-chat de reserva (manage.jsp)

| Paso | Actor | Acción |
|------|-------|--------|
| 1 | Provider | Manda CVU al renter |
| 2 | Renter | Sube imagen del comprobante de pago |
| 3 | Provider | Confirma o rechaza el comprobante |
| — | Provider rechaza | Puede dejar razón; renter puede volver a mandar |
| 4 | Ambos | Negocian horario y lugar de encuentro |
| 5 | Renter | Confirma recibido |
| 6 | Ambos | Reviews (sprint futuro) |

---

## Asignaciones Sprint 2

### SEBAS

- [ ] **Login** — nueva pantalla de login
- [ ] **Register** — validar email no existe con custom validator que llame al service (`NewUserValidator`)
- [ ] **Configurar perfil** — editar nombre, apellido, foto de perfil (contraseña: no este sprint)
  - Acceso restringido: sólo usuarios logueados, sólo su propio perfil (403 si intenta acceder a otro)
- [ ] **Auth** — agregar tabla users / configurar Spring Security

### AZU

- [ ] **Catálogo** — filtros + nueva searchbar + paginación
  - Location como query param (no path variable)
  - Siempre mostrar sólo productos ACTIVE
  - Mantener estado: filtros + búsqueda + paginación
- [ ] **Landing** — nueva searchbar
- [ ] **Validators** — custom validators para forms del catálogo
- [ ] **Tests** — DAOs y services con cobertura de casos felices e infelices

### JOSE

- [ ] **Historial de reservas** — filtrar por:
  - Rol: reservas donde soy renter / donde soy provider
  - Tiempo: pasadas, actuales, futuras
  - Estado: pending, approved, etc.
  - Estado vacío: "no tenés reservas" + CTA para hacer tu primera reserva
- [ ] **Solicitudes provider** — aceptar/rechazar reservas → lleva a manage; estado vacío "No hay solicitudes"
- [ ] **Solicitudes renter** — ver estados; estado vacío + CTA al catálogo sin filtros

### MAGUI

- [ ] **Detalle de producto** — si sos el provider:
  - Mostrar lápiz para editar campos
  - CTA "Solicitar Reserva" arriba (no hay que scrollear)
  - Arreglar fechas antes del modal
  - Al editar: abrir el mismo form con datos pre-llenados (sin fotos por ahora)
- [ ] **Listado mis productos** — productos del provider con link al detalle editable
  - Estado vacío: "No has publicado productos todavía ¿Querés publicar el primero?" + CTA publish
- [ ] **Estado del producto** — ACTIVE/PAUSED/DELETED
  - Botón para cambiar precio
  - Botón para despausar

### TIAGO

- [ ] **Pseudo-chat de reserva** — manage.jsp con fotos para comprobante
  - Provider manda CVU, renter manda comprobante, provider confirma/rechaza
- [ ] **Manejo de expiración** — lógica de expiración de estados de reserva

---

## Bugs Sprint 1 pendientes

- [ ] El scroll cambia el input del precio al crear un producto
- [ ] CTA "Solicitar Reserva" demasiado abajo — mover arriba
- [ ] `GetLogUser` para mostrar perfil en la navbar
- [ ] En `UserServiceImpl.normalizeAndValidateEmail` — sacar el chequeo del mail (ver con Jose)
- [ ] Agregar todas las funciones de los services a las interfaces

---

## Notas técnicas del Sprint 2

- Fotos de más de 10MB: configurar en `web.xml`, Spring limite 50MB, validator rechaza >10MB, `GlobalExceptionHandler` captura `MaxUploadSizeExceededException` → pantalla 400
- 403 al acceder a recurso ajeno (sin revelar si existe)
- Services que devuelven `void` y necesitan tests → cambiar a `boolean`

Ver [[Controllers & Validation]] para file upload y [[Sprint 2 — Indicaciones del Corrector]] para el detalle completo.

---
title: Project Architecture Overview
type: analysis
created: 2026-04-11
updated: 2026-05-06
tags: [architecture, overview, rent-the-slopes]
sources: []
---

# Project Architecture Overview

**Rent The Slopes** — a snow sports equipment rental marketplace built with Spring MVC for the PAW course at ITBA (2026-1C).

---

## What It Does

Users can:
- **Browse** rental equipment by Argentine ski resort location (Bariloche, San Martín, Mendoza, Ushuaia)
- **Publish** equipment for rent (clothing, skis, snowboards, boots, accessories) with images and pricing
- **Rent** equipment by selecting date ranges, with email notifications to both parties
- **Manage** rental requests — providers can accept or reject incoming requests
- **Pay** through a pseudo-chat de pago: el renter sube comprobante; el provider acepta o rechaza el pago (Sprint 2)

Autenticación con Spring Security (login/registro/remember-me) ya implementada — ver [[Spring Security]].

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21 (`maven.compiler.release=21`), Spring MVC 5.3.33 |
| Database | PostgreSQL (prod), HSQLDB (tests) |
| Persistence | Spring JDBC (`JdbcTemplate`, `SimpleJdbcInsert`) — migración a JPA/Hibernate **5.1.0.Final** + JPA 2.1 API planificada (ver [[Hibernate & JPA]]) |
| Migrations | Flyway (en uso); Hibernate `hbm2ddl.auto` durante la migración |
| Security | Spring Security 5.3.13 (form login, remember-me, BCrypt) |
| Frontend | JSP + JSTL + Bootstrap 5.3.8 + custom tag files |
| Validation | Bean Validation 2.0 + Hibernate Validator 6.2.4 |
| Email | JavaMailSender via Gmail SMTP |
| Build | Maven multi-module |
| Server | Jetty 9.x (dev), WAR for deployment |

---

## Module Architecture

```
                    ┌──────────┐
                    │  webapp   │  Controllers, JSPs, WebConfig
                    └────┬─────┘
                         │ compile          runtime
              ┌──────────┴──────────┐
              ▼                     ▼
    ┌─────────────────┐   ┌──────────────┐
    │service-contracts│   │   services    │  Business logic
    └────────┬────────┘   └──────┬───────┘
             │ compile           │ runtime
             ▼                   ▼
    ┌─────────────────────┐ ┌──────────────┐
    │persistence-contracts│ │  persistence  │  JDBC DAOs
    └─────────┬───────────┘ └──────┬───────┘
              │                    │
              └────────┬───────────┘
                       ▼
                 ┌──────────┐
                 │  models   │  Domain objects + enums
                 └──────────┘
```

The contract/implementation split enforces loose coupling. Controllers never import service implementations; services never import DAO implementations. Everything goes through interfaces, enforced by Maven `runtime` scope.

---

## Domain Model

6 entities, 9 enums (incluye `ProductStatus` de Sprint 2), 5 custom exceptions del dominio + 2 transversales en `services.exceptions` (ver [[Domain Models]]).

```
User ──< Product ──< Price (time-bound, per-day pricing)
              │──< Block (date range reservations)
              │──< ProductImage ──< Image (binary blobs)
              └──< Rent (links product + block + renter, has status)
```

Key business rules:
- **Size/category compatibility**: equipment and accessories have no size; clothing uses XXS–XXL; footwear uses EU 36–48
- **Price overlap detection**: no two prices for the same product can overlap in date range
- **Blocked dates**: blocks with PENDING or APPROVED rents prevent new bookings
- **Rent lifecycle (Sprint 2)**: PENDING → APPROVED → PAYMENT_PENDING → PAYMENT_ACCEPTED / PAYMENT_REJECTED. También REJECTED, CANCELLED, EXPIRED. Ver [[Sprint 2 — Roadmap del Proyecto]].

---

## Request Flow

```
Browser → DispatcherServlet → Controller → Service Interface → DAO Interface → JdbcTemplate → PostgreSQL
                ↕                 ↕                                  ↕
        Spring Security    Form validation              RowMapper → Domain Object
        Filter Chain         + @Transactional                  (futuro: EntityManager + JPQL)
                                  ↕
                         ViewResolver → JSP + Tags → HTML
```

---

## Pages & URLs

| URL | Method | Description |
|-----|--------|-------------|
| `/` | GET | Landing page with location cards |
| `/catalog/{location}` | GET | Product grid for a location |
| `/products/{id}` | GET | Product detail with rent form |
| `/products/{id}/rent` | POST | Submit rent request |
| `/publish` | GET/POST | Publish new product |
| `/rent/manage` | GET | Seller manages rent request |
| `/rent/respond` | POST | Accept/reject rent |
| `/images/{id}` | GET | Serve image binary |

---

## Testing

~80+ tests across two strategies:
- **Service tests** (Mockito): validate business logic, input validation, edge cases
- **Persistence tests** (HSQLDB): verify SQL queries, RowMappers, CRUD operations

See [[Tests]] and [[Testing Practices]] for details.

---

## Estado actual y próximos pasos

**Implementado:**
- Autenticación con Spring Security (login, registro, remember-me, BCrypt) — ver [[Spring Security]]
- Edición de productos (`EditProductController`) y "Mis publicaciones" (`MyListingsController`)
- Paginación + filtros + búsqueda en catálogo — ver [[Paginación, Filtros y Búsqueda]]
- Flujo de pseudo-chat de pago (Sprint 2): subida de comprobante + aceptación/rechazo
- ProductStatus (ACTIVE/PAUSED/DELETED) — soft delete y pausa
- Custom validators del equipo (`validation/annotations/` + `validation/validators/`)

**En curso / próximo:**
- **Migración a Hibernate/JPA** (Clase 7) — reemplazo de los `*JdbcDao` por `*HibernateDao`. ⚠ Stack del proyecto es Java 21 + Hibernate 5.1 (de 2016): requiere `--add-opens` JVM args para JPMS y `jaxb-api` explícita porque JAXB no está en Java 11+. Ver [[Hibernate & JPA]] sección "Aviso: stack actual del proyecto" y [[Notion Teoricas PAW — Apuntes en vivo]] (clase 27/04).
- Review/rating system (no priorizado)
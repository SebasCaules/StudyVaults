---
title: Admin Invite Flow
type: concept
created: 2026-05-28
updated: 2026-05-28
tags: [security, admin, sprint-2]
sources: []
---

# Admin Invite Flow (Issue #20)

Flujo de invitación de un nuevo administrador con **token single-use de TTL 7 días**, registrado en la BD y consumido en el registro. Reemplaza el patrón inseguro previo en el que cualquiera que supiera el email de un invitado podía registrarse y heredar el rol ADMIN.

---

## Threat model

**Vector previo (vulnerable):** un admin promocionaba a otro usuario marcándolo como ADMIN basándose sólo en su email. Si el invitado todavía no se había registrado, el sistema creaba un stub user con `role=ADMIN`. Cualquier persona que conociera ese email (interno o externo) podía registrarse en `/register` y recibir el rol ADMIN automáticamente — **hijack puro**.

**Solución (#20):** el admin invita por mail. Se persiste un **token único, no-expuesto en la UI**, que el invitado recibe por mail y que el sistema exige al completar el registro. Sin token válido y no-expirado, el registro no promueve a ADMIN (tira `InvalidAdminInviteTokenException` → 410 GONE).

---

## Schema (V35)

Migración `V35__admin_invite_token.sql` agrega tres columnas a `users`:

```sql
ALTER TABLE users
    ADD COLUMN invited_as_admin BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN admin_invite_token VARCHAR(128) UNIQUE,
    ADD COLUMN admin_invite_expires_at TIMESTAMP;
```

- `invited_as_admin` — flag que marca al stub user como destinatario de una invitación admin pendiente.
- `admin_invite_token` — UUID único (UNIQUE constraint a nivel BD).
- `admin_invite_expires_at` — TTL 7 días desde la invitación.

Schema parity: `persistence/src/test/resources/schema.sql` espeja la migración (HSQLDB). Ver [[DAOs (Persistence Layer)]].

---

## Flujo end-to-end

### 1. Admin invita

El admin (autenticado, con `ROLE_ADMIN`) llama a `UserService.inviteAdmin(actor, email, locale)`. El método retorna un `AdminInviteResult` enum con tres casos:

| Resultado | Cuándo | Acción |
|---|---|---|
| `ALREADY_ADMIN` | el email ya pertenece a un usuario con `role=ADMIN` | no-op, no manda mail |
| `PROMOTED` | el email pertenece a un usuario existente con `role=USER` | promueve inmediatamente a ADMIN (no necesita registro) |
| `INVITED` | el email no existe — se crea stub con `role=USER`, `invited_as_admin=true`, UUID token, expiration 7d | manda mail con link `/register?email=...&token=...` |

### 2. Invitado abre el mail

El mail contiene un link `/register?email=invitado@example.com&token=<UUID>`. El `LoginController` lee ambos query params, prefilla `RegisterForm.email` y `RegisterForm.adminInviteToken` (campo nuevo, opcional, hidden o type=text deshabilitado en la UI).

### 3. Completa el registro

POST a `/register` con la form (`@Valid RegisterForm`). El controller llama a `UserService.registerOrLinkGuest(form, adminInviteToken)`. La lógica del service:

1. Busca al usuario por email. Si existe con `invited_as_admin=true`:
   - Si `adminInviteToken` no matchea el persistido **o** el token está expirado (`admin_invite_expires_at < now()`), lanza `InvalidAdminInviteTokenException` → 410 GONE → `auth/admin-invite-invalid.jsp`.
   - Si matchea y no expiró: completa el registro (hashea password, etc.), marca `verified=true`, promueve a ADMIN, y **consume el token**: limpia `admin_invite_token`, `admin_invite_expires_at`, `invited_as_admin` (single-use).
2. Si no hay invitación admin pendiente para ese email, sigue el registro normal sin promoción.

### 4. Token expirado / inválido

Si el invitado tarda más de 7 días o el token fue alterado, el flujo muestra `auth/admin-invite-invalid.jsp` (única vista nueva del feature; la pantalla de éxito es el `/login` regular). El admin debe re-invitar.

---

## Por qué single-use

Una vez consumido, el token se limpia en la misma transacción que la promoción. Si el atacante intercepta el mail después de que el invitado se registró, el token ya no sirve — el `findByAdminInviteToken` no lo encuentra y lanza la excepción. Ver `UserDao.consumeAdminInvite(userId)`.

---

## Componentes nuevos

| Componente | Ubicación |
|---|---|
| Schema migration | `persistence/src/main/resources/db/migration/V35__admin_invite_token.sql` |
| DAO methods | `UserDao.createInvitedAdmin`, `findByAdminInviteToken`, `consumeAdminInvite` |
| Service methods | `UserService.inviteAdmin(actor, email, locale)`, `UserService.registerOrLinkGuest(form, adminInviteToken)` |
| Exception | `InvalidAdminInviteTokenException` (en `services.exceptions`) → 410 GONE |
| Form field | `RegisterForm.adminInviteToken` (opcional) |
| View | `auth/admin-invite-invalid.jsp` (única pantalla nueva — no hay controller dedicado al flujo, sólo el reuso de `/register`) |
| Tests | `UserServiceImplTest.inviteAdmin` + `registerOrLinkGuest`; `UserJpaDaoTest` para los métodos de admin invite |

---

## Cross-refs

- [[Domain Models]] — campos nuevos en `User` (`invitedAsAdmin`, `adminInviteToken`, `adminInviteExpiresAt`).
- [[Services]] — `UserService.inviteAdmin` y `registerOrLinkGuest`.
- [[Controllers]] — mapeo `InvalidAdminInviteTokenException → 410` en `GlobalExceptionHandler`.
- [[Spring Security]] — promoción a `ROLE_ADMIN` en el flujo, single-use clear del token.

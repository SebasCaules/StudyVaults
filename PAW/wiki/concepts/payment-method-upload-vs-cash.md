---
title: Payment Method (UPLOAD/CASH)
type: concept
created: 2026-05-28
updated: 2026-05-28
tags: [payment, validation, sprint-2]
sources: []
---

# Payment Method — UPLOAD vs CASH (Issue #10)

Escape hatch para el caso "provider sin CBU configurado": cuando el provider no tiene CBU, el renter no puede hacer la transferencia bancaria y el flujo de comprobante queda trabado. El feature introduce un segundo método de pago (`CASH`) que permite marcar la rent como pago coordinado fuera de la plataforma, sin adjuntar comprobante.

---

## Problema

Pre-feature: el único camino para confirmar el pago era subir un comprobante (`payment_image_id`). Si el provider olvidaba completar su CBU en el perfil, el renter aceptaba la rent, intentaba pagar, no podía transferir, y la rent quedaba en `PAYMENT_PENDING` indefinidamente — eventualmente expiraba (`PAYMENT_EXPIRED`). Frustración para ambos lados y rent muerta.

---

## Solución

### 1. Enum nuevo

`PaymentMethod` con dos valores:

- `UPLOAD` (default) — flujo canónico. Renter sube comprobante.
- `CASH` — escape hatch. Renter declara que pagó fuera de la plataforma; no se adjunta archivo.

### 2. Migración V34

`V34__add_rent_payment_method.sql`:

```sql
ALTER TABLE rents
    ADD COLUMN payment_method VARCHAR(16) NOT NULL DEFAULT 'UPLOAD'
        CHECK (payment_method IN ('UPLOAD', 'CASH'));
```

Schema parity reflejado en `persistence/src/test/resources/schema.sql`. Ver [[DAOs (Persistence Layer)]].

### 3. CBU gating en `approveRent`

`RentService.approveRent(rentId, providerId)` verifica que `provider.cbu` sea no-blank **antes** de pasar a `APPROVED`. Si está vacío:

```java
if (provider.getCbu() == null || provider.getCbu().isBlank()) {
    throw new ProviderCbuRequiredException(providerId);
}
```

→ mapeado a **409 CONFLICT** en `GlobalExceptionHandler`. Defensa en profundidad: no permitir crear rents que después serán imposibles de cobrar limpiamente.

### 4. InitiatePaymentForm con validador class-level

```java
@PaymentProofRequiredIfUpload
public class InitiatePaymentForm {
    @ValidPaymentProof(required = false, maxSizeMb = 10)
    private MultipartFile paymentProof;
    private PaymentMethod paymentMethod = PaymentMethod.UPLOAD;
    // getters/setters
}
```

- `@ValidPaymentProof(required = false, ...)` corre las validaciones de tipo MIME (incluye PDF además de imágenes) y tamaño cuando hay archivo.
- `@PaymentProofRequiredIfUpload` (class-level) decide si el archivo es obligatorio: si `paymentMethod=UPLOAD`, exige `paymentProof` no-vacío; si `CASH`, lo ignora.

Separar las responsabilidades evita acoplar el validador de archivo a la lógica de branching del método de pago. Ver [[Controllers & Validation]] Ejemplo 3.

### 5. Service branching

`RentService.initiatePayment(rentId, PaymentMethod, byte[])`:

- **UPLOAD**: persiste `Image` con los bytes, asigna `payment_image_id`, set `payment_method=UPLOAD`.
- **CASH**: skip image (no se persiste nada en `images`), set `payment_method=CASH`.

Ambos caminos hacen la transición de estado a `PAYMENT_PENDING` y disparan el mail al provider.

---

## Componentes nuevos

| Componente | Ubicación |
|---|---|
| Enum | `models.enums.PaymentMethod` (`HasDisplayName`) |
| Schema migration | `persistence/src/main/resources/db/migration/V34__add_rent_payment_method.sql` |
| Field en Rent | `Rent.paymentMethod` |
| Exception | `ProviderCbuRequiredException` (en `services.exceptions`) → 409 CONFLICT |
| Form field | `InitiatePaymentForm.paymentMethod` |
| Validator class-level | `@PaymentProofRequiredIfUpload` + `PaymentProofRequiredIfUploadValidator` |
| Service method modificado | `RentService.initiatePayment(rentId, PaymentMethod, byte[])` |
| DAO method | `RentDao.updatePaymentMethod(rentId, paymentMethod)` |
| Tests | `RentServiceImplTest` cubre CBU gating + branching UPLOAD/CASH; `RentJpaDaoTest.updatePaymentMethod` |

---

## Cross-refs

- [[Enums]] — `PaymentMethod` con sus dos valores.
- [[Domain Models]] — `Rent.paymentMethod`.
- [[Controllers & Validation]] — validator `@PaymentProofRequiredIfUpload` (Ejemplo 3).
- [[Services]] — `RentService.approveRent` con CBU gating; `RentService.initiatePayment` branching.

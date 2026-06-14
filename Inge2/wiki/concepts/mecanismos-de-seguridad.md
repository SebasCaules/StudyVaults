---
title: Mecanismos de seguridad
type: concept
aliases:
  - "Mecanismos de seguridad"
  - "Patrones de seguridad"
  - "WAF"
  - "MFA"
  - "Sanitización de inputs"
  - "Encriptación at-rest"
  - "Reverse proxy"
  - "VPN"
created: 2026-05-07
updated: 2026-05-07
tags: [seguridad, waf, mfa, sanitizacion, encriptacion, vpn, reverse-proxy, defense-in-depth]
sources:
  - "raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md"
related:
  - "[[Atributos de calidad]]"
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Architectural Guardrails]]"
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Architecture Business Cycle]]"
  - "[[Caso Healthcare.gov]]"
---

# Mecanismos de seguridad

## Idea general

Catálogo de **mecanismos arquitectónicos** que materializan el atributo de calidad **Security** ([[Atributos de calidad]]). No son recetas: son **opciones que se eligen ante escenarios de amenaza concretos** del [[Árbol de utilidad]].

> **Filosofía de la cátedra (Clase 7, 2026-05-07):**
> *"Lo más importante que tiene una empresa es la información de sus usuarios."*
> *"El objetivo es ser lo suficientemente difícil de entrar para que sea más atractivo hackear a otro."*
> (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md)

La segunda cita es central: **Security no es defensa absoluta**, es *threshold defense*. Subir el costo del ataque hasta que el adversario racional elija otro target. Aplica el principio económico de defensa: defenderse perfecto es imposible y carísimo; defenderse "lo suficiente" es viable y mueve el ataque hacia objetivos más blandos.

La importancia del atributo se determina por **la naturaleza de los datos**: cuán sensibles son, qué regulación los protege, qué consecuencia tiene su exposición.

## Catálogo de mecanismos (Clase 7)

Cada mecanismo se aplica a un escenario específico y se ubica en un punto del flujo de la arquitectura.

### 1. WAF — Web Application Firewall

**Escenario:** ataque DDoS, scraping abusivo, payloads maliciosos en requests HTTP.

**Qué es:** un firewall de capa 7 que inspecciona el tráfico HTTP/S **antes** de que llegue al backend. Filtra patrones conocidos de ataque (SQLi, XSS, path traversal), aplica rate limiting, geo-blocking, y reglas WAF (OWASP CRS).

**Ubicación arquitectónica:** entre internet y el Load Balancer/edge (ver sección *Reverse proxy / Load Balancer como proxy* abajo). En la 2da iteración del [[Caso Compraventa de Acciones]] aparece como bloque rojo justo después del cloud y antes del LB (source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png).

**Productos típicos:** AWS WAF, Cloudflare, Akamai, ModSecurity (open source).

### 2. MFA — Multi-Factor Authentication

**Escenario:** un atacante obtiene las credenciales de un usuario y quiere acceder a su cuenta.

**Qué es:** la autenticación requiere **al menos dos factores** de naturaleza distinta:
- Algo que **sabés** (password).
- Algo que **tenés** (TOTP en app, SMS, hardware key tipo YubiKey, push a dispositivo confiable).
- Algo que **sos** (biometría: huella, face ID).

Robar el password ya no alcanza: el atacante necesita también el segundo factor, que está físicamente con el usuario.

**Trade-off:** Security ↑ vs Usability ↓. La fricción es real; aplicar MFA en operaciones sensibles (login, cambio de contraseña, transferencia de fondos) es estándar; aplicarlo en cada interacción mata la experiencia.

**Productos típicos:** Authy, Google Authenticator, Auth0/Okta MFA, AWS Cognito MFA, WebAuthn/FIDO2 para passkeys.

### 3. Sanitización de inputs

**Escenario:** un atacante envía un input malformado para ejecutar código no intencionado (SQL Injection, XSS, command injection, LDAP injection, XXE).

**Qué es:** **validar y normalizar** todo input externo antes de usarlo. Dos formas complementarias:

- **Allow-list (whitelist)**: definir qué es válido y rechazar el resto. Más seguro pero más restrictivo.
- **Escaping/parametrización**: para queries SQL, prepared statements; para HTML output, escape de caracteres `<`, `>`, `&`, `"`, `'`; para shell, evitar `system()` con concatenación.

**Regla:** *"Never trust user input"*. La validación va **en cada capa** que recibe input del exterior.

**Conexión con el principio:** si tu BD ya guarda datos sanitizados, una vulnerabilidad nueva en el frontend no compromete los datos. Es **defense in depth**.

### 4. Encriptación at-rest

**Escenario:** un atacante obtiene acceso al storage físico (disco, backup, snapshot) y quiere leer los datos.

**Qué es:** los datos se almacenan **cifrados en disco**. La clave vive en un [[Architectural Guardrails|sistema separado]] (KMS, HSM, vault) y el motor de BD descifra in-memory cuando lee.

Modalidades:
- **Transparent Data Encryption (TDE)**: el motor cifra a nivel de archivos sin que la app lo sepa.
- **Column-level encryption**: sólo columnas sensibles (PII, credit card) — más control granular, más complejidad de queries.
- **Encriptación de backups**: clave separada, retención independiente.

**Complementario:** encriptación **in-transit** (TLS 1.2+). At-rest sin in-transit deja un flanco; in-transit sin at-rest expone los datos cuando hay leak físico.

### 5. Reverse proxy / Load Balancer como proxy

**Escenario:** múltiples preocupaciones de seguridad (TLS termination, IP whitelisting, rate limiting, header injection) que no deben vivir en cada servicio.

**Qué es:** un **proxy reverso** entre internet y el backend que centraliza:
- Terminación TLS — los certificados viven en un solo lugar.
- Distribución de carga ([[Replicación de BD]]).
- Rate limiting por IP/usuario.
- Inyección/limpieza de headers (`X-Forwarded-For`, etc.).
- IP whitelisting/blacklisting.

**Productos típicos:** Nginx, HAProxy, Traefik, Envoy, AWS ALB.

En el [[Caso Compraventa de Acciones]], el LB es un **Nginx** que cumple este rol (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md).

### 6. VPN — Virtual Private Network

**Escenario:** sistemas externos (proveedores de cotización, sistemas de Ops internos) deben acceder al backend pero no deben estar expuestos a internet.

**Qué es:** un **túnel cifrado** punto a punto entre redes confiables. El sistema externo "entra" a la red privada del backend como si fuera local; el resto de internet no ve esa conexión.

**Patrón típico:** segmentar el sistema en zonas de confianza:
- **Zona pública** (internet) → entra por WAF + LB.
- **Zona privada** (intranet) → backend, BDs, servicios internos.
- **Sistemas externos confiables** → conectan a la zona privada via VPN.

En el [[Caso Compraventa de Acciones]], la consola de Ops se mueve a una infraestructura separada con su propio Back y BD, accedida vía VPN (source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png). Esto reduce el **blast radius**: una vulnerabilidad en el SPA público no afecta al sistema de Ops.

## Composición — Defense in Depth

Ninguno de estos mecanismos es suficiente por sí solo. La estrategia es **defensa por capas**:

```
Internet
   │ HTTPS (in-transit encryption)
   ▼
[ WAF ]              ← filtra payloads conocidos
   │
   ▼
[ LB / Reverse proxy ]  ← termina TLS, rate-limit
   │
   ▼
[ Backend ]
   │ - MFA en login crítico
   │ - Sanitización de inputs
   ▼
[ DB encriptada at-rest ]
```

Cada capa atrapa una clase de ataque. Si una falla, las otras siguen. Esto materializa la filosofía *threshold defense*: el atacante necesita romper varias defensas, lo que multiplica costo y tiempo.

## Decisiones canónicas

| Pregunta | Heurística |
|---|---|
| ¿Cuánto invertir en seguridad? | Proporcional a la **naturaleza de los datos**. Healthcare/financial: altísimo. Catálogo público de productos: bajo. |
| ¿Dónde poner el WAF? | Lo más afuera posible — antes que cualquier servicio aplicativo. |
| ¿MFA en todo? | No. En **operaciones sensibles** (login, cambio de credenciales, transacciones). En el resto fricciona. |
| ¿Encriptación at-rest siempre? | Sí, especialmente para PII / datos financieros / cualquier cosa con regulación. La sobrecarga es marginal con motores modernos. |
| ¿VPN o exponer endpoints públicos con auth? | VPN cuando podés controlar ambos extremos (sistemas internos, proveedores fijos). Exposición pública con auth para clientes finales. |

## Trade-offs canónicos

- **Security ↔ Usability** — MFA, timeouts, captchas. Toda fricción tiene costo de adopción.
- **Security ↔ Performance** — WAF agrega latencia (1-10ms típico); sanitización con allow-list pesa CPU.
- **Security ↔ Maintainability** — más capas = más componentes que parchear, monitorear, rotar claves de.
- **Security ↔ Time-to-market** — el mismo trade-off que llevó a [[Caso Healthcare.gov]] a colapsar: presión política bajó la barra de seguridad operacional.

## Conexión con el resto del wiki

- [[Atributos de calidad]] — este es el catálogo aplicado al atributo Security.
- [[Architectural Guardrails]] — los mecanismos suelen incorporarse como guardrails ("todo servicio detrás de WAF", "TLS 1.3 mínimo").
- [[Architecture Business Cycle]] — la regulación + naturaleza del dato (stakeholders y tech environment) determinan qué mecanismos son no-negociables.
- [[Caso Compraventa de Acciones]] — caso canónico de aplicación de estos mecanismos en clase.
- [[Caso Healthcare.gov]] — contraejemplo: lo que pasa cuando la sanitización + auth + auditoría son tardíos.

## Pregunta a profundizar

¿Cómo se cuantifica el **costo de un ataque** para validar que estás "lo suficientemente difícil"? ¿Hay heurística objetiva (red-team budget, bug bounty rates) o sigue siendo arte cualitativo? Hipótesis: para sistemas regulados (banca, salud) los reguladores definen el piso; para el resto, el seguro cibernético es el thermómetro.

## Lecturas complementarias

- OWASP Top 10 — referencia canónica de vulnerabilidades aplicativas.
- OWASP Cheat Sheet Series — recetas concretas.
- NIST SP 800-53 — controles de seguridad para sistemas federales.
- Saltzer & Schroeder, *The Protection of Information in Computer Systems* (1975) — origen de los principios (least privilege, fail-safe defaults, etc.).
- Anderson, *Security Engineering* (3ª ed., 2020) — referencia moderna integral.

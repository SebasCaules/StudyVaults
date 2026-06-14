---
title: "Fuente — TP final escrito (Vitae_TP_Derecho.docx)"
type: fuente
unidades: [3, 5, 6, 7, 8, 9]
fuentes: ["Vitae_TP_Derecho.docx"]
fecha_creacion: 2026-06-01
ultima_actualizacion: 2026-06-01
---

# Fuente — TP final escrito (Vitae_TP_Derecho.docx)

> Resumen de `raw/TPE/Vitae_TP_Derecho.docx`. ⭐ Es el **documento final y completo del grupo** (10 secciones): ya incorpora el reencuadre de la docente (eje civil/consumeril, mala praxis simulada de "Pedro", solución REFEPS) y supera al borrador [[fuente-tp-borrador]]. Es el guion del que sale la presentación. Ver [[caso-vitae]], [[problematica-juridica-vitae]] y [[mala-praxis-y-deber-seguridad]].

## Datos de la fuente

| Campo | Detalle |
|---|---|
| Archivo | `Vitae_TP_Derecho.docx` (~20 KB) |
| Título | VITAE — Plataforma de conexión entre pacientes y profesionales médicos |
| Contexto | TP Derecho para Ingenieros · 4° año Ing. Informática · ITBA · 2025 |
| Estado | **Versión final completa** (secciones 1 a 10) |

## Estructura (10 secciones)

**1. Datos generales.** Vitae = plataforma de **intermediación** (marketplace) entre pacientes y médicos: buscar especialistas, consultar disponibilidad, reservar turnos; el profesional gestiona agenda y amplía cartera. **No** presta el acto médico; **verifica credenciales al registro** y provee infraestructura.

**2. Forma jurídica → `Vitae S.A.S.`** (Ley 27.349): constitución ágil (un socio, digital, 24 h), capital mínimo = 2× SMVM, responsabilidad limitada, clases de acciones para inversores. Mayorías: ordinarias = simple; extraordinarias = absoluta del capital.
> ⚠️ **Discrepancia con el deck:** la presentación ([[fuente-presentacion-slides]]) titula "¿Por qué una **S.A.**?". El escrito final dice **S.A.S.** Hay que unificar antes de exponer. Ver [[caso-vitae]].

**3. Representación legal.** Administrador Titular designado en el acto constitutivo; apoderados por área (legal/comercial/técnica) con poderes acotados (art. 58 LGS supletorio).

**4. Propiedad intelectual.** (4.1) Marca "Vitae" + logo en **INPI**, clases **42** (informática) y **44** (salud), Ley 22.362. (4.2) Software/código fuente como obra (Ley 11.723; registro en DNDA). (4.3) Base de datos protegida por Ley 11.723 + Ley 25.326 (datos sensibles de salud, consentimiento expreso).

**5. Contratos clave.** (5.1) **T&C de pacientes** (adhesión electrónico; privacidad art. 5 Ley 25.326; reclamos). (5.2) **Acuerdo de prestación para profesionales**: condición esencial = **matrícula vigente** + obligación de **notificar cambios en 48 h**; incumplir habilita suspensión inmediata. (5.3) Infraestructura: cloud (SLA AWS/GCP), licencias, pasarelas de pago, derecho argentino.

**6. Aspectos comerciales.** (6.1) Consumidor (art. 1 Ley 24.240): deber de info (art. 4), no cláusulas abusivas (art. 37). (6.2) Lealtad comercial (Ley 22.802): no publicidad engañosa sobre los médicos. (6.3) Defensa de la competencia (Ley 27.442): evitar abuso si alcanza posición dominante.

**7. Contrataciones laborales.** Equipo interno en relación de dependencia (Ley 20.744): devs (CCT informática), soporte, legal/compliance. **Los médicos NO tienen vínculo laboral** con Vitae (rigen por el acuerdo del punto 5.2) — clave para evitar relación laboral encubierta (art. 23 LCT).

**8. Problemática jurídica.**
- **8.1 Caso hipótesis ("Pedro"):** un médico verificado al alta sufre **revocación de matrícula como medida cautelar**, no la notifica y sigue atendiendo por Vitae. **Pedro** reserva turno; el médico le **prescribe un fármaco en dosis incorrecta** → descompostura severa con urgencia. Pedro demanda al médico **y a Vitae**.
- **8.2 Marco normativo:** Ley 17.132 (art. 5 matrícula); art. 208 inc. 1 CP (mención, la civil opera independiente); **CCyC art. 1716** (deber de reparar), **art. 1723** (responsabilidad **objetiva** cuando se comprometió un **resultado** — Vitae promete presentar solo profesionales habilitados), **art. 732** (incumplimiento de **auxiliares** se equipara al del deudor); **art. 40 Ley 24.240** (solidaria en la cadena).
- **8.3 Fallos:** ver tabla abajo.
- **8.4 Resolución:** el **médico** responde como principal (subjetiva, art. 1724; daño cierto art. 1739). **Vitae** responde **solidariamente** por (i) **obligación de seguridad/resultado** (art. 1723) y (ii) **integración en la cadena de consumo** (art. 40 LDC), liberándose solo con culpa exclusiva del médico/paciente. Rubros de Pedro: daño físico, daño moral, eventual lucro cesante (art. 1746).

**9. Solución de hecho (prevención).** (9.1) **Verificación automática diaria contra REFEPS** (microservicio que consulta la API pública; suspende el perfil ante baja). (9.2) **Cláusula contractual de autodeclaración** (48 h) + retención de fondos + acción de regreso. (9.3) **Notificación transparente al paciente** + reagendamiento (cumple art. 4 LDC y **corta el nexo causal**).

**10. Referencias** normativas y jurisprudenciales (ver abajo).

## Fallos citados en el TP final

| Fallo | Rol | Aporte |
|---|---|---|
| **B. E. C. c/ D. R. S. y OSDE** (Cám. Civ. Com. **Mercedes**, 29/04/2020) | Cartilla | Quemadura en penescopía; OSDE responde solidariamente por **cartilla** y **art. 732 CCyC** (auxiliares). Analogía directa: Vitae = "cartilla digital" → [[mala-praxis-y-deber-seguridad]] |
| **Juzgado Civ. y Com. N°10 La Plata** (SAIJ SUC0411048) | Cartilla | Quien ofrece **catálogo de profesionales** asume **obligación de seguridad/resultado** sobre su habilitación; no es "mero intermediario" |
| **Lambaré (Lamboré) Cristina Anabel c/ Mercado Libre** | Intermediario (defensa) | ML = intermediario tecnológico sin control ni beneficio directo → **no** responde. ⚠️ Cita a verificar (no localizada en bases públicas — ver [[fuente-investigacion-vitae]]) |
| **Fernández Dotzel c/ Central Autos** (Neuquén) | Cadena de consumo | Plataforma con beneficio + intervención → responde por **art. 40 LDC**. Vitae se parece más a este caso |

## Diferencias vs. la investigación de 54 pp.

El TP final **destila** la investigación ([[fuente-investigacion-vitae]]) y la **reordena según la docente**:
- Pasa el **eje a lo civil/consumeril** (art. 1716/1723/732 + art. 40 LDC); lo penal queda como mención.
- Adopta la **doctrina de la cartilla** (OSDE Mercedes + La Plata N°10) como columna vertebral.
- Usa **art. 1723 (obligación de resultado)** y **art. 732 (auxiliares)** como base — más afilado que el abanico de 10 vías de la investigación.
- Cierra con la **solución de hecho** técnica (REFEPS) detallada.

## Relación con otras páginas

- [[caso-vitae]] — encuadre integral (Esquema A).
- [[problematica-juridica-vitae]] — el problema y las dos ópticas.
- [[mala-praxis-y-deber-seguridad]] — cartilla + deber de seguridad + art. 732.
- [[fuente-tp-borrador]] — versión anterior incompleta.
- [[fuente-presentacion-slides]] — el deck (con la discrepancia S.A./S.A.S.).
- [[responsabilidad-civil]], [[responsabilidad-solidaria-consumo]], [[sociedad-acciones-simplificada]].

## Fuentes citadas

- `raw/TPE/Vitae_TP_Derecho.docx` (10 secciones completas).

---
title: Lightweight ATAM
aliases:
  - "Lightweight ATAM"
  - "ATAM ligero"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [evaluacion, atam, lightweight, pragmatica]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[ATAM]]"
  - "[[SAAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Caso Healthcare.gov]]"
---

# Lightweight ATAM

## ¿Qué es?

Versión **comprimida y pragmática** del [[ATAM]] formal, diseñada para equipos pequeños o iteraciones ágiles donde no se justifican 20-30 person-days (source: raw/classes/Clase 4.pdf).

Mantiene el **espíritu** del método — árbol de utilidad, análisis de sensitivity points y tradeoffs — pero reduce la carga de proceso.

## Características

- **Duración:** 1-2 días de workshop vs 4-6 semanas de calendario del ATAM completo.
- **Participantes:** el equipo del sistema + 1-2 stakeholders clave vs panel amplio.
- **Alcance:** enfoque en las decisiones más riesgosas o en una parte específica del sistema.
- **Output:** reporte interno del equipo vs documento formal externo.

## Cuándo aplicar

1. **Iteración agile** donde cada 3-6 meses se valida la arquitectura contra evolución del negocio.
2. **Equipos chicos** (< 10 personas) donde un ATAM completo colapsaría el proceso.
3. **Checkpoint inicial** — arquitectura en fase temprana, se quiere una revisión antes de que sea costoso cambiar.
4. **Antes de un ATAM completo** — para llegar con los deberes hechos y optimizar las 20-30 person-days.

## Cuándo NO aplicar

- **Decisiones de alto impacto e irreversibles** — un sistema crítico con regulación requiere ATAM completo (ver [[Caso Healthcare.gov]] como ejemplo de lo que pasa cuando se subestima).
- **Stakeholders diversos con conflictos** — Lightweight no da el espacio para dirimir; hace falta el Round 2 formal de ATAM.

## Agenda típica (1 día)

| Hora | Actividad |
|---|---|
| 09:00-09:30 | Presentación business drivers (PO/Stakeholder lead). |
| 09:30-10:30 | Presentación arquitectura (arquitecto técnico). |
| 10:30-12:00 | Construir árbol de utilidad (workshop). |
| 13:00-14:30 | Priorizar escenarios (H/M/L importancia y dificultad). |
| 14:30-16:00 | Analizar top 5 escenarios — approach, sensitivity, tradeoffs. |
| 16:00-17:00 | Síntesis — risks, themes, next actions. |

## Riesgos de la versión liviana

- **Falta de diversidad de stakeholders** — el equipo termina validándose a sí mismo.
- **Escenarios sesgados** — sin challenge externo, se omiten los atributos incómodos.
- **Documentación flaca** — el reporte es informal y decae con el tiempo.

Mitigaciones:
- Invitar al menos un stakeholder **externo** al equipo (otro arquitecto, un SRE, alguien de seguridad).
- Usar una plantilla estándar de reporte para preservar los outputs.
- Agendar el próximo Lightweight ATAM antes de que termine éste.

## Relación con fitness functions

Ford et al. (*Building Evolutionary Architectures*) proponen reemplazar evaluaciones puntuales por **fitness functions**: chequeos automáticos y continuos de atributos arquitectónicos en CI. Lightweight ATAM complementa bien — las fitness functions verifican lo conocido, el workshop identifica lo nuevo.

## Pregunta a profundizar

¿Qué frecuencia óptima para Lightweight ATAM en un equipo? Trimestral, por release major, o triggered por eventos (nuevo stakeholder, cambio de stack, post-incidente)?

## Fuentes y lecturas

- Kazman et al. — literatura ATAM del SEI.
- Ford, Parsons, Kua — *Building Evolutionary Architectures*.
- Nord, Bass, Ozkaya — variantes modernas de ATAM.

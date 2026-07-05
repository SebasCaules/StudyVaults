# Triage de materias — apuntes GoodNotes 2023-2026 (2026-07-05)

> Resultado del análisis paralelo (18 agentes + 3 Físicas) sobre los PDFs organizados en
> `~/Desktop/ITBA/XX-YC/Apuntes/`. Detalle por materia en el scratchpad de la sesión
> (`triage/<id>-detalle.md`, `fisica-triage/fN-temas.md`). Esta tabla es la base aprobable
> del fan-out de creación de vaults + transcripción.

## Veredictos

**COMPLETO (12)** — dan para wiki entera:
| id | Materia | Cuatri | math | Lo distintivo |
|---|---|---|---|---|
| fisica1 | Física 1 (mecánica + fluidos) | 23-2C | ✔ | teórica 5/5 casi transcribible 1:1; toolkits de simulación |
| fisica2 | Física 2 (oscilaciones/ondas/óptica/termo) | 24-2C | ✔ | resumen color-codeado 5/5 cubre todo |
| fisica3 | Física 3 (electromagnetismo + relatividad) | 24-1C | ✔ | resumen 5/5; práctica con 8 guías resueltas |
| algebra | Álgebra | 23-1C | ✔ | resumen "joya" 5/5; práctica enunciado+resolución |
| discreta | Matemática Discreta (= teoría de grafos) | 23-2C | ✔ | resumen 44pp 5/5 autosuficiente, P1..P9 |
| pi | Programación Imperativa (C, c99) | 23-2C | ✘ | teórica cubre el temario completo en bullets |
| quimica | Química (2 cursadas fusionadas) | 24-1C+25-1C | ✔ | teórica 24-1C = esqueleto; 25-1C = versión limpia parcial |
| logica | Lógica Computacional (2 cursadas) | 24-1C+24-2C | ✔ | 8 fuentes; bloque lógica + bloque computabilidad (Lenguaje S, Gödel) |
| eda | EDA | 24-2C | ✔ | el Final (37pp) barre todo el temario; simuladores AVL/RBT/B-tree |
| arqui | Arquitectura (x86 concreto) | 24-2C | ✔ | teórica 10 clases end-to-end 5/5 |
| tla | TLA / Autómatas | 25-2C | ✔ | práctica 52pp + 3 parciales resueltos. ⚠ DESPERSONALIZAR (nombre+legajo visibles) |
| bd1 | Base de Datos I (diseño + normalización) | 25-2C | ✔ | cuaderno integral 63pp 5/5 con parciales; sin SQL |

**DELGADO (7)** — wiki chica pero honesta, con huecos marcados:
| id | Materia | Cuatri | math | Cobertura real |
|---|---|---|---|---|
| am1 | Análisis Matemático I | 23-1C | ✔ | solo mitad integral + Taylor; estructurar por técnica de integración |
| am2 | Análisis Matemático II | 23-2C | ✔ | hasta diferenciación prolijo; práctica 79pp con parciales fechados es la joya |
| metnum | Métodos Numéricos (introductorio) | 24-2C | ✔ | ≠ MNA (confirmado: es OTRA materia) — 5pp práctica: raíces, interpolación, Simpson, EDOs |
| so | Sistemas Operativos | 25-1C | ✘ | primera mitad del curso; fuerte en concurrencia (Petersen, TSL) |
| poo | POO (Java) | 24-1C | ✘ | tablas-decisión de Collections + 6 trazas de herencia de parciales reales |
| protos | Protocolos de Comunicación | 25-2C | ✘ | solo teórica 6pp útil (slides de cátedra exportaron sin fondo) |
| info | Informática (Assembler Z80) | 23-1C | ✔ | 4pp útiles: intro Z80; wiki mínima (index + 2-3 notas) |

**INVIABLE (2)** — no se crean vaults:
- **xml** (24-1C): 1 página real (diagrama de pipeline XML). Se archiva; a lo sumo una nota huérfana futura.
- **isw1** (25-1C): 2pp, 1 en blanco + 6 renglones. Se archiva.

## Decisiones transversales
- Los PDFs fuente NO van al repo público (tamaño >100MB algunos, límite GitHub): quedan como
  originales externos read-only en `~/Desktop/ITBA/XX-YC/Apuntes/`; cada vault lleva manifiesto
  con procedencia (archivo + páginas).
- Vaults existentes (Proba, Derecho, Economía, SDS, Inge2, PAW, MNA) NO se tocan (decisión del usuario).
- `metnum` se crea como vault propio, separado de MNA (materias distintas, confirmado por contenido).
- TLA: transcripción con despersonalización obligatoria (aparece "CAULES SEBASTIAN 64331" en carátulas).
- PI: ignorar 2 páginas con garabatos de otra materia. AM1: `sin resolver.pdf` descartado (no aporta).
- F1 práctica: p.16 contiene un limerick vulgar de un alumno → omitir. Respuestas cortadas en
  ej. 3.9/6.15/6.17/8.9 → verificar antes de publicar.
- Notación: en F1 el símbolo tipo "∂" de los apuntes es `a` (aceleración) → normalizar al transcribir.

## Toolkit estrella por materia (propuesta corta)
am1 clasificador de técnica de integración · algebra Rouché-Frobenius paso a paso · am2 decisor de
límites 2D · discreta visualizador de grafos + Dijkstra/Floyd player · pi visualizador de punteros ·
quimica predictor VSEPR + calculadora de pH · poo traza de herencia (formato parcial) · logica
intérprete de Lenguaje S + tablas de verdad · eda simulador AVL/RBT/B-tree · arqui stack tracer +
paginación · metnum iterador Newton/punto fijo con tabla · so visualizador de Petersen/TSL · tla
simulador AFD/AFND + minimizador · bd1 normalizador (X⁺, claves, 3NF/BCNF) · protos visualizador de
encapsulamiento · fisica1/2/3 laboratorios de simulación (demo en curso).

## Estado del pipeline (actualizado 2026-07-05 ~16:00)
- [x] F0 organización (100 PDFs en XX-YC/Apuntes)
- [x] F0 triage (18 + 3 Físicas analizadas)
- [x] Aprobación del usuario: GO con las 19
- [x] Alta de los 19 vaults (vaults.ts + esqueletos + banners temáticos) — build verde
- [x] Demo Físicas ronda 1 (15 sims verificadas) — feedback: más temas / más pulido / tocable
- [x] **Ola 1 transcripción**: 33/33 unidades transcriptas (96 páginas) en F1/F2/F3/Álgebra — commit f01ba7d

### Interrumpido por límite de sesión (resetea 19:30 AR) — cómo reanudar
1. **Verificación adversarial pendiente** de F2/F3/Álgebra (24 verificadores) + 4 índices:
   `Workflow({scriptPath: "<session>/workflows/scripts/transcribir-ola-wf_d99f203b-9af.js", resumeFromRunId: "wf_d99f203b-9af", args: <mismos args>})`
   — los 33 transcriptores salen de caché, solo re-corren verify/idx caídos.
2. **Demo ronda 2**: relanzar los 3 agentes (F1/F2/F3) — murieron sin trabajar; prompts en el transcript de esta sesión. Core ya upgradeado (addHandle/grid/arrow/chips, commit b18a246).
3. **Olas 2 y 3**: mismas del plan — Ola 2: discreta, logica, eda, arqui, tla, bd1, quimica, pi · Ola 3 (delgadas): am1, am2, metnum, so, poo, protos, info.

### Pulido pendiente detectado
- Unificar frontmatter `fuente:` a la forma descriptiva ("Apuntes manuscritos de la cursada XXXX-XC (…)") — algunas páginas de F1 usan paths tipo `raw/...` que no existen.
- Los 4 index.md siguen siendo stubs (los idx agents cayeron) — los regenera el resume.

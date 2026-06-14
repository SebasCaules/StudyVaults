---
title: OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)
aliases:
  - "OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)"
  - "OEI-06-14-00350"
  - "OEI Healthcare report"
  - "HHS OIG report"
type: source
created: 2026-04-22
updated: 2026-05-06
tags: [source, reporte-oficial, healthcare-gov, oei, hhs, lecciones-aprendidas]
sources:
  - "raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf"
related:
  - "[[Caso Healthcare.gov]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[ATAM]]"
  - "[[Atributos de calidad]]"
---

# OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)

## Identificación

- **Título completo:** *HealthCare.gov: Case Study of CMS Management of the Federal Marketplace*.
- **Agencia emisora:** U.S. Department of Health & Human Services, Office of Inspector General (HHS OIG).
- **Código:** OEI-06-14-00350.
- **Publicación:** 2016.
- **Longitud:** ~92 páginas.
- **Rol:** reporte oficial post-mortem del lanzamiento fallido de Healthcare.gov (1-oct-2013).

## Qué contiene

El reporte investiga las causas del fracaso del lanzamiento, identifica lecciones aprendidas y propone recomendaciones para futuros proyectos federales de software a gran escala (source: raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf).

### Estructura

1. **Executive Summary** — síntesis ejecutiva con 10 lecciones.
2. **Table of Contents**.
3. **Background** — contexto político y legal (ACA, rol de CMS).
4. **Chapter 1 — Preparation & Development** — planeamiento, contratación, desarrollo.
5. Chapters 2-N — ejecución, lanzamiento, recuperación, evaluación.
6. **Key Contributing Factors**.
7. **Recommendations**.

## Las 10 Lessons Learned (pág. Exec Summary)

Cada una mapea a un **atributo organizacional/arquitectónico** subóptimo:

1. **Leadership.** No hubo liderazgo único end-to-end.
2. **Alignment.** Metas de negocio y técnicas desalineadas.
3. **Culture.** Cultura que desincentivaba reportar malas noticias.
4. **Simplification.** Falta de estrategia para reducir complejidad del scope.
5. **Integration.** Integraciones entre contratistas probadas tarde.
6. **Communication.** Entre stakeholders políticos, CMS, contratistas.
7. **Execution.** Procesos de ingeniería inmaduros (testing, deployment).
8. **Oversight.** Supervisión débil de contratistas externos.
9. **Planning.** Planes optimistas, sin gestión formal de riesgo.
10. **Learning.** Sin feedback loop de aprendizaje continuo.

Ver [[Caso Healthcare.gov]] para el análisis arquitectónico de estas lecciones.

## Key Contributing Factors (del propio reporte)

Factores estructurales identificados:

- **Political deadlines inflexibles.**
- **Regulaciones subsidiarias cambiantes** — el scope técnico se movía.
- **Procurement federal** — reglas que favorecen precio sobre capacidad.
- **Múltiples contratistas sin integrador competente.**
- **Capacidad técnica interna de CMS limitada.**

## Recommendations

El reporte recomienda a CMS/HHS:

- Designar project management integrado con autoridad clara.
- Mejorar contratación técnica (capacidad, supervisión).
- Instituir testing integrado y realista antes de milestones.
- Fortalecer canales para escalar malas noticias.
- Fortalecer gestión formal de riesgo.
- Documentar lecciones de proyectos previos.

## Por qué este reporte es útil académicamente

1. **Auditoría oficial** — no es periodismo ni blog, es un documento gubernamental con metodología explícita y trazable.
2. **Cubre dimensiones organizacionales + técnicas** — evita el reduccionismo típico ("fue culpa del código" o "fue culpa de los contratistas").
3. **Narrativa longitudinal** — desde planning (2010) hasta lanzamiento (2013) hasta recuperación (2014).
4. **Generalizable** — aunque específico al sistema federal de EE.UU., muchas lecciones aplican a cualquier proyecto grande de software con plazos duros.

## Limitaciones

- **Sesgo institucional** — es auto-reporte del gobierno sobre el gobierno; es probable que suavice responsabilidades políticas.
- **No cubre perspectiva de los contratistas** — CGI Federal, QSSI (luego adquirida por UnitedHealth) tienen sus propias narrativas que el OEI toca tangencialmente.
- **No cubre el "tech surge"** con el detalle que sí tiene la cobertura periodística (Brill, *Time*).

## Cómo lo usa la cátedra

[[Clase 4 — ¿Cuándo diseñamos?]] entrega este reporte junto a la consigna `Clase V - Caso Healthcare.gov.pdf` (source: raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf) como **input material** para una simulación de ATAM Fase 0/1 sobre Healthcare.gov. Los estudiantes leen el reporte, reconstruyen el árbol de utilidad que *debería* haber existido en 2012, identifican sensitivity points y tradeoffs, y discuten qué habrían decidido distinto.

## Recursos complementarios

- Brill, Steven — *"Obama's Trauma Team"* (Time, marzo 2014) — crónica del tech surge.
- GAO-14-694 — reporte paralelo del Government Accountability Office.
- Congressional testimonies (Sebelius, Tavenner) — disponibles en C-SPAN.
- *Code for America* — cómo se crearon USDS y 18F como respuesta institucional.

## Pregunta a profundizar

El reporte identifica causas pero ofrece recomendaciones relativamente genéricas. ¿Qué mecanismos organizacionales concretos adoptaron USDS y 18F para prevenir un segundo Healthcare.gov, y cuáles se pueden trasladar a sector privado / a cátedras universitarias?

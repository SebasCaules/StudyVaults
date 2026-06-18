# PAW — Programación de Aplicaciones Web (ITBA, 2026-1C)

Base de conocimiento del proyecto de la materia **Programación de Aplicaciones Web** (PAW): una webapp Spring MVC apodada **Rent The Slopes**. Documenta el código, los patrones y las decisiones de arquitectura del proyecto, pensada como referencia para estudiar y para construir/mantener la app.

Es una **copia publicada read-only**: se lee y se consulta, no es el vault de trabajo editable.

## Qué temas cubre

- **Inventario del código** (`wiki/entities/`): domain models, enums, controllers, services, DAOs, views (JSP + custom tags) y tests del proyecto.
- **Patrones y decisiones** (`wiki/concepts/`): arquitectura Maven multi-módulo, Spring config e inyección de dependencias, validación y forms (PRG, JSR-303, validation groups), persistencia (Spring JDBC → Hibernate/JPA), seguridad (Spring Security, ownership checks, admin invite flow), logging, paginación y búsqueda.
- **Resúmenes de fuentes** (`wiki/sources/`): una página por clase, corrección o material de cátedra ingerido.
- **Análisis** (`wiki/analyses/`): comparaciones y deep dives que valió la pena guardar.

## Cómo navegarlo

1. Empezar por **`wiki/index.md`**: es el catálogo completo, organizado por categoría, con una descripción rica de cada página para encontrar lo que buscás.
2. Seguir los `[[wikilinks]]` entre páginas para moverte entre conceptos relacionados.
3. Abrir el vault con Obsidian (`File → Open vault → PAW`) o con cualquier editor de Markdown.

## Notas

- El `raw/` de fuentes (PDFs de clases, correcciones, transcripciones) **no se incluye** en esta copia. Solo se conservan las imágenes embebidas bajo `raw/assets/notion-paw-images/` para que no se rompan los enlaces del wiki.
- El idioma es mayormente español rioplatense; los nombres de código y términos técnicos se mantienen en inglés.

## Enlaces

- **Home del repo:** [`../HOME.md`](../HOME.md) — índice de los 7 vaults de StudyVaults.
- **Estándar de diseño de páginas:** [`../_estandar/DESIGN.md`](../_estandar/DESIGN.md) — cómo se estructura una página del wiki.

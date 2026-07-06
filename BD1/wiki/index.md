# Base de Datos I — Índice

Catálogo completo del wiki de **Base de Datos I**, organizado por unidad. La materia
cubre el diseño y la teoría del modelo relacional: del **modelo entidad-relación** al
esquema relacional, los lenguajes de consulta (**álgebra** y **cálculo relacional**), y
toda la **teoría de normalización** (dependencias funcionales y multivaluadas, formas
normales, descomposición y el método del tableau), cerrando con los ejercicios recurrentes
de parcial.

> Para navegar rápido en Obsidian: abrí la vista de grafo. En el sitio web, el índice
> lateral también está agrupado por unidad.

## Unidad 1 — Modelo entidad-relación

- [[01-der/01-modelo-entidad-relacion|Modelo entidad-relación (DER)]] — entidades, atributos, relaciones y cardinalidades; notación del diagrama.
- [[01-der/02-ejercicios-der|Ejercicios de modelado E/R]] — casos resueltos: de la prosa al DER (cardinalidades, jerarquías, entidades débiles).

## Unidad 2 — Álgebra relacional

- [[02-algebra-relacional/01-operaciones-basicas|Álgebra relacional: operaciones básicas y de conjuntos]] — selección, proyección, producto cartesiano, renombramiento y operadores de conjuntos.
- [[02-algebra-relacional/02-joins-y-division|Álgebra relacional: joins y división]] — theta-join, equi/natural join y la división.

## Unidad 3 — Cálculo relacional

- [[03-calculo-relacional/01-calculo-de-tuplas|Cálculo relacional de tuplas (TRC)]] — lenguaje declarativo con variables sobre tuplas; fórmulas seguras.
- [[03-calculo-relacional/02-calculo-de-dominios|Cálculo relacional de dominios (DRC)]] — variables sobre valores de dominio.
- [[03-calculo-relacional/03-equivalencia-algebra-calculo|Equivalencia entre álgebra y cálculo relacional]] — mismo poder expresivo; correspondencia entre operadores.

## Unidad 4 — Dependencias funcionales

- [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong|Dependencias funcionales y axiomas de Armstrong]] — definición de DF y reglas de inferencia.
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas|Clausura de atributos y claves candidatas]] — cálculo de $X^+$, superclaves y el método de la tabla para hallar claves.
- [[04-dependencias-funcionales/03-recubrimiento-minimo|Recubrimiento mínimo]] — cobertura mínima $F_m$ como punto de partida de la síntesis a 3NF.

## Unidad 5 — Formas normales

- [[05-formas-normales/01-formas-normales|Formas normales: de 1NF a 5NF y BCNF]] — la escala de formas normales y las anomalías que evitan.
- [[05-formas-normales/02-descomposicion-3nf-bcnf|Descomposición en 3NF y BCNF]] — junta sin pérdida, preservación de dependencias y los algoritmos de descomposición.
- [[05-formas-normales/03-mvd-4nf-5nf|Dependencias multivaluadas, 4NF y 5NF]] — DMV, dependencias de junta y las formas normales superiores.
- [[05-formas-normales/04-metodo-del-tableau|Método del tableau (chase)]] — chase para probar junta sin pérdida e inferir dependencias.

## Unidad 6 — Ejercicios de parcial

- [[06-parciales/01-tableau-chase-inferir-fd|Método del tableau para inferir una DF (chase)]] — chase con DF y MVD mezcladas.
- [[06-parciales/02-lossless-join-por-tableau|Verificación de lossless join por tableau]] — descomposiciones de más de dos subesquemas, paso a paso.
- [[06-parciales/03-mvd-y-coalescencia|Dependencias multivaluadas y coalescencia en parciales]] — de MVD a DF por coalescencia y construcción de instancias.
- [[06-parciales/04-parcial-integrador-normalizacion|Parcial integrador de normalización]] — claves, forma normal, descomposición y proyección de dependencias sobre un mismo esquema.

## Fuentes

El wiki se construye a partir del material de la cursada **2025-2C**: la **teórica** de la
cátedra, las **prácticas** (guías de ejercicios de modelado E/R, álgebra y cálculo) y los
**apuntes manuscritos** de teoría y de ejercicios de parcial resueltos. Las referencias del
tipo `raw/...` que aparecen en el frontmatter de cada página son citas documentales al origen,
no enlaces a archivos presentes en esta copia publicable.

---
_Catálogo organizado por el campo `unidad` del frontmatter de cada página. Volver al [[HOME]] del repo._

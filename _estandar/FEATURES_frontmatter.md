# FEATURES_frontmatter.md — Guía temática: Frontmatter YAML

> Documento del **Designer de documentación** (StudyVaults). Profundiza el tema **frontmatter**
> más allá de lo que fija `DESIGN.md` §2. Si hay conflicto, manda `DESIGN.md`; acá se detalla,
> se dan ejemplos copy-paste por tipo de página y se cierran las ambigüedades.
>
> **Output en español rioplatense, conciso.** Los 7 vaults originales son **SOLO LECTURA**:
> esta guía describe el frontmatter del **repo publicable**, nunca toca los vaults fuente.
> Convenciones medidas en la auditoría (Fase 0): frontmatter YAML casi universal, claves
> `tags:`, `fuente:`/`fuentes:` y por materia `unidad:`; kebab-case con prefijo numérico;
> cero callouts, cero Dataview.

Archivos compañeros: `DESIGN.md` (estándar canónico), `TEMPLATE_pagina.md`, `EJEMPLO_pagina.md`.

---

## 0. Qué es y para qué sirve el frontmatter

El frontmatter es el bloque YAML delimitado por `---` que abre **toda** página `.md` del wiki.
No se renderiza en el cuerpo: es **metadata estructurada** que sirve para tres cosas concretas.

1. **Filtrar.** Encontrar todas las páginas de un tipo (`tipo: teoria`), de una unidad
   (`unidad: 3`), o que tocan un tema (`tags: [..., autovalores]`) sin abrir cada archivo.
2. **Organizar.** El primer tag y `tipo` deciden en qué carpeta temática vive la página
   (`teoria/`, `parciales/`, etc., ver `DESIGN.md` §7) y cómo la lista `index.md`.
3. **Trazar.** `fuente`/`fuentes` ancla cada página al material crudo de `raw/` (la fuente de
   verdad solo-lectura), y `actualizado` da la fecha de última edición para auditoría.

> **Regla de oro.** El frontmatter es la **primera línea del archivo**: `---` arranca en la
> línea 1, sin BOM, sin línea en blanco antes, sin comentario antes. Si no está en la línea 1,
> Obsidian no lo parsea como frontmatter y se rompe el filtrado.

---

## 1. Anatomía del bloque

```yaml
---
tags: [tipo, unidad-N, tema-principal, subtema]
fuente: raw/ruta/al/archivo-fuente.pdf
unidad: N
tipo: teoria
actualizado: AAAA-MM-DD
---
```

Reglas duras (deterministas):

- Abre con `---` en la **línea 1** y cierra con `---` solo. Nada de `...` como cierre.
- **Una sola** línea en blanco entre el `---` de cierre y el `# H1` (`DESIGN.md` §1).
- Las claves van **siempre en el orden canónico** (§4 de esta guía). No reordenar por gusto.
- Una clave por línea, formato `clave: valor`. Dos puntos + **un** espacio. Sin tabs (YAML
  prohíbe tabs para indentar).
- Sin comentarios `#` dentro del frontmatter publicable (ensucian el diff y algunos parsers
  los tratan distinto). Si hace falta una nota, va como `> **Nota.**` en el cuerpo.

---

## 2. Claves: tabla de referencia

| Clave | Estado | Tipo / formato | Para qué se usa |
|---|---|---|---|
| `tags` | **Obligatoria** | Lista inline `[a, b, c]`, valores kebab-case sin tildes/ñ | Filtrado transversal. **Primer tag = tipo de página.** |
| `fuente` / `fuentes` | **Obligatoria** | `fuente:` string (ruta `raw/…`) **o** `fuentes:` lista | Trazabilidad al material crudo. Singular si una, plural si varias. |
| `tipo` / `type` | Recomendada | String del vocabulario controlado (§3) | Filtrado por tipo; redundante con el 1er tag a propósito. |
| `unidad` / `unit` | Recomendada si aplica | Entero (`2`) o romano (`II`), según la materia | Agrupar por unidad. Omitir si la página es transversal. |
| `actualizado` / `updated` | Opcional | Fecha ISO `AAAA-MM-DD` | Auditoría / orden por recencia. |
| `tema` | Opcional | String kebab-case o frase corta | Tema dentro de la unidad. |
| `titulo` / `title` | Opcional | String con tildes/mayúsculas, = al H1 | Solo si el H1 no alcanza (alias largo). |
| `aliases` | Opcional | Lista YAML de strings | Nombres alternativos para resolver `[[wikilinks]]`. |
| `tiene_resolucion` | Opcional (parciales/guías) | `true` / `false` (booleano, sin comillas) | Marca si el enunciado trae resolución. |
| `related` | Opcional | Lista de `[[wikilinks]]` | Cross-links destacados, además de "Ver también". |
| `fecha` | Opcional (clases) | Fecha ISO `AAAA-MM-DD` | Fecha del dictado de una clase. |

Vocabulario para nombres de clave: usar la variante en **español** por defecto
(`fuente`, `unidad`, `tipo`, `actualizado`) y mantenerla **consistente dentro de cada vault**.
Las variantes en inglés (`source`, `unit`, `type`, `updated`) se permiten solo en los vaults
que ya nacen en inglés (PAW, Inge2); no mezclar idiomas de clave en un mismo vault.

---

## 3. Vocabulario controlado de `tipo` y primer tag

El **primer tag** y la clave `tipo` comparten un único vocabulario cerrado. Elegir exactamente
uno de estos valores (kebab-case, singular, sin tildes):

| Valor | Cuándo | Carpeta destino |
|---|---|---|
| `teoria` | Apunte teórico, desarrollo conceptual | `teoria/` |
| `clase` | Notas de una clase con fecha | `clases/` |
| `guia` | Guía / práctica de ejercicios (el set) | `guias/` |
| `resuelto` | Ejercicio(s) resuelto(s) con desarrollo | `resueltos/` |
| `parcial` | Parcial/examen (enunciado, con o sin resolución) | `parciales/` |
| `concepto` | Concepto suelto, transversal a unidades | `conceptos/` |
| `distribucion` | Distribución de probabilidad (Proba) | `distribuciones/` |
| `teorema` | Página dedicada a un teorema | `teoremas/` |
| `tecnica` | Método/algoritmo paso a paso | `tecnicas/` |
| `formulario` | Tabla/resumen de fórmulas | `formularios/` |
| `fuente` | Ficha de una fuente del material crudo | `fuentes/` |
| `moc` | Map of Content / índice temático intermedio | raíz de la carpeta que organiza |

> **Regla determinista.** `tipo` debe ser **idéntico** al primer elemento de `tags`. Si decís
> `tipo: parcial`, el primer tag es `parcial`. No hay excepciones.

**Distinción "examen" vs "ejercicio".** En este vocabulario no existe ni `examen` ni
`ejercicio` como valores: un **examen** (parcial/recuperatorio/final) es `parcial`; un
**ejercicio** resuelto es `resuelto` y el **set de ejercicios** (la guía/práctica) es `guia`.
Mantener el vocabulario cerrado evita que el filtrado se fragmente.

---

## 4. Orden canónico de claves (no negociable)

Siempre este orden; omitir las que no apliquen sin alterar la secuencia de las presentes:

```
1. tags
2. fuente | fuentes
3. unidad        (si aplica)
4. tipo
5. actualizado   (si aplica)
6. tema          (si aplica)
7. titulo        (si aplica)
8. aliases       (si aplica)
9. tiene_resolucion | fecha  (según tipo de página)
10. related      (si aplica)
```

Las claves específicas de un tipo (`tiene_resolucion` para parciales/guías, `fecha` para
clases) van al final del bloque, después de las comunes.

---

## 5. Reglas de tipos y formato YAML

### 5.1 Listas

- **Inline** (preferida para `tags` y `related`, cortas): `tags: [teoria, unidad-2, normas]`.
- **En bloque** (para `fuentes` con varias rutas o listas largas):

  ```yaml
  fuentes:
    - raw/teoricas/clase-03.pdf
    - raw/apuntes/normas-vectoriales.pdf
  ```

- No mezclar inline y bloque en la **misma** clave.

### 5.2 Strings

- Sin comillas por defecto: `tipo: teoria`, `tema: descomposicion-lu`.
- **Con comillas** solo si el valor contiene `:` seguido de espacio, empieza con `[`, `{`, `@`,
  `` ` ``, `*`, `&`, `!`, `|`, `>`, `%`, `#`, `?`, o si es un valor que YAML interpretaría mal
  (`yes`/`no`/`on`/`off`/`null` como texto literal). Ejemplo: `titulo: "Caso: González c/ Estado"`.
- `fuente` es un string de **ruta** sin comillas salvo que tenga espacios:
  `fuente: raw/teoria 2024/clase 1.pdf` → mejor `fuente: "raw/teoria 2024/clase 1.pdf"`.

### 5.3 Números

- `unidad: 3` (entero, sin comillas) **o** `unidad: III` (romano, string sin comillas). Elegir
  la convención de la materia y mantenerla. **No** `unidad: "3"` ni `unidad: 03`.

### 5.4 Booleanos

- `true` / `false` en minúscula, sin comillas: `tiene_resolucion: true`.

### 5.5 Fechas

- **Siempre** ISO `AAAA-MM-DD`, sin comillas: `actualizado: 2026-06-14`. Nunca `14/06/2026`.

### 5.6 Wikilinks dentro del frontmatter

- `related` y a veces `fuente` admiten `[[wikilinks]]`. En YAML inline hay que **encomillar**
  porque `[[` arranca como lista anidada y rompe el parse:

  ```yaml
  related: ["[[03-matrices]]", "[[teoria/04-determinantes]]"]
  ```

---

## 6. `tags` — diseño y reglas

- Estructura recomendada (de lo general a lo específico):
  `[tipo, unidad-N, tema-principal, subtema-opcional]`.
- **Primer tag = tipo** (§3). El resto: la unidad como `unidad-N` (con guion, kebab-case), el
  tema principal y, si suma, un subtema. 2 a 5 tags es lo sano; más de 6 es ruido.
- Todo en **kebab-case, sin tildes ni ñ**: `numeros-complejos`, no `números complejos`.
- Tags reutilizables entre páginas (que coincidan exactamente) para que el filtrado agrupe:
  el tema "autovalores" es siempre `autovalores`, nunca a veces `autovalor` o `eigen`.
- La unidad aparece **dos veces** a propósito: como tag `unidad-N` (filtrado por tags) y como
  clave `unidad: N` (filtrado por campo). Es redundancia deliberada, no error.

---

## 7. Ejemplos copy-paste-ready por tipo de página

### 7.1 Teoría (p. ej. MNA, LaTeX fuerte)

```yaml
---
tags: [teoria, unidad-2, normas-vectoriales, espacios-normados]
fuente: raw/teoricas/02-normas-y-productos-internos.pdf
unidad: 2
tipo: teoria
actualizado: 2026-06-14
---
```

### 7.2 Clase (notas fechadas)

```yaml
---
tags: [clase, unidad-3, descomposicion-lu]
fuente: raw/clases/clase-2026-04-22.pdf
unidad: 3
tipo: clase
fecha: 2026-04-22
actualizado: 2026-06-14
---
```

### 7.3 Ejercicio resuelto

```yaml
---
tags: [resuelto, unidad-2, normas-vectoriales]
fuente: raw/guias/guia-02.pdf
unidad: 2
tipo: resuelto
tiene_resolucion: true
actualizado: 2026-06-14
---
```

> **Nota.** El **set** de ejercicios (la guía entera) usa `tipo: guia`; un ejercicio puntual
> desarrollado usa `tipo: resuelto`. `tiene_resolucion` marca si el enunciado trae resolución.

### 7.4 Examen / parcial (con varias fuentes)

```yaml
---
tags: [parcial, unidad-1, unidad-2, primer-parcial]
fuentes:
  - raw/parciales/1p-2024-tema-a.pdf
  - raw/parciales/1p-2024-tema-b.pdf
unidad: 2
tipo: parcial
tiene_resolucion: false
actualizado: 2026-06-14
---
```

### 7.5 MOC (Map of Content / índice temático)

```yaml
---
tags: [moc, unidad-2]
fuente: raw/
unidad: 2
tipo: moc
actualizado: 2026-06-14
related: ["[[teoria/02-normas-vectoriales]]", "[[teoremas/cauchy-schwarz]]"]
---
```

### 7.6 Materia sin LaTeX, en inglés (PAW / Inge2)

```yaml
---
tags: [theory, unit-3, spring-mvc, controllers]
source: raw/lectures/03-spring-mvc.pdf
unit: 3
type: theory
updated: 2026-06-14
---
```

> **Nota.** PAW e Inge2 nacen en inglés: usar variantes de clave en inglés (`source`, `unit`,
> `type`, `updated`) y **valores de `tags`/`tipo` en inglés** coherentes (`theory`, `lecture`,
> `exercise`...), pero respetando el **mismo esquema y orden**. No mezclar idiomas dentro del vault.

---

## 8. Cómo el frontmatter alimenta filtrado y organización

- **Por carpeta:** el `tipo` decide la carpeta temática (§3). Una página `tipo: parcial` vive
  en `parciales/`. La carpeta y el `tipo` nunca se contradicen.
- **Por `index.md`:** el catálogo del vault (`wiki/index.md`, o la raíz en SDS) lista cada
  página agrupándolas por `tipo` y `unidad`. El frontmatter es la fuente de esos grupos.
- **Por tags:** búsqueda transversal por tema (todas las páginas con `autovalores`) o por unidad
  (`unidad-3`) sin importar la carpeta.
- **Por `fuente`:** permite rastrear qué páginas del wiki derivan de un mismo archivo de `raw/`,
  útil para detectar material crudo aún no procesado.
- **Sin Dataview.** Los vaults **no** usan Dataview (0 ocurrencias). El filtrado es por la
  búsqueda nativa de Obsidian (`tag:#teoria`, `path:parciales`) y por el listado manual de
  `index.md`. No diseñar frontmatter asumiendo queries Dataview.

> **SDS — desviación conocida.** En SDS `index.md` está en la **raíz** del vault,
> no en `wiki/`. El frontmatter de las páginas SDS sigue el mismo esquema; solo cambia dónde
> vive el catálogo que las lista. No "corregir" SDS: es solo lectura.

---

## 9. Errores frecuentes (y cómo evitarlos)

| Error | Por qué rompe | Correcto |
|---|---|---|
| Línea en blanco o BOM antes del `---` inicial | Obsidian no lo parsea como frontmatter | `---` en línea 1 exacta |
| `tags: teoria, unidad-2` (sin corchetes) | YAML lo lee como un solo string | `tags: [teoria, unidad-2]` |
| `tipo` distinto del primer tag | Filtrado inconsistente | `tipo` == primer tag |
| `related: [[03-matrices]]` sin comillas | `[[` rompe el parse YAML | `related: ["[[03-matrices]]"]` |
| Fecha `14/06/2026` | No es ISO; no ordena | `2026-06-14` |
| `unidad: "3"` o `unidad: 03` | Tipo/forma inconsistente | `unidad: 3` |
| Tildes/ñ en `tags` | Fragmenta el filtrado | `numeros-complejos` |
| Indentar con tabs | YAML prohíbe tabs | Indentar con espacios |
| Mezclar `fuente:` y `fuentes:` en la misma página | Ambigüedad | Una sola: singular si 1, plural si varias |
| Clave obligatoria vacía (`fuente:` sin valor) | Pierde trazabilidad | `fuente: raw/` con la subcarpeta más específica conocida |

---

## 10. Mini-checklist de frontmatter

Antes de cerrar una página, verificar:

- [ ] `---` en la **línea 1**; cierre con `---` solo; una línea en blanco antes del `# H1`.
- [ ] `tags` presente, inline, kebab-case sin tildes/ñ; **primer tag = tipo de página**.
- [ ] `fuente:` (string) **o** `fuentes:` (lista) presente y **no vacía**; no ambas.
- [ ] `tipo` presente y **idéntico** al primer tag; valor del vocabulario controlado (§3).
- [ ] `unidad` presente si aplica; entero o romano coherente con la materia (sin comillas/ceros).
- [ ] Fechas en ISO `AAAA-MM-DD` (`actualizado`, `fecha`).
- [ ] `tiene_resolucion` booleano en parciales/guías cuando aplica; `fecha` en clases.
- [ ] Wikilinks en `related`/`fuente` **encomillados** dentro de listas inline.
- [ ] Claves en el **orden canónico** (§4).
- [ ] Idioma de claves coherente con el vault (español por defecto; inglés solo en PAW/Inge2).
- [ ] Sin comentarios `#`, sin tabs, sin Dataview.

---

*Fin de FEATURES_frontmatter.md*

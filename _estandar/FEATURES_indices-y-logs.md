# FEATURES — Índices y Logs (`index.md` y `log.md`)

> Documento del **Designer de documentación**. Profundiza un único tema de `DESIGN.md`
> (ver §9 "Navegación", último bullet): **cómo se construye y se mantiene** el catálogo
> (`index.md`) y la bitácora append-only (`log.md`) de cada vault del repo publicable.
>
> **No repite** `DESIGN.md`: las reglas de páginas hoja (frontmatter, headings, blockquotes,
> LaTeX, naming) viven allá. Acá solo se trata el par índice + log.
>
> **Output en español rioplatense, conciso.** Los vaults originales son **SOLO LECTURA**:
> este estándar describe el formato del repo publicable; **nunca** se modifica el material fuente.

Archivos compañeros: `DESIGN.md` (estándar de páginas), `TEMPLATE_pagina.md`, `EJEMPLO_pagina.md`.
Este documento agrega dos plantillas más: la de `index.md` (§2) y la de `log.md` (§5).

---

## 0. Por qué existen estos dos archivos

El repo sigue el **"LLM Wiki pattern"** (documentado en el `CLAUDE.md` de los 7 vaults):

- **`raw/`** = fuente de verdad, **solo lectura**, auxiliar. **No** se publica.
- **`wiki/`** = base de conocimiento **generada por Claude**, permanente. **Sí** se publica.

Dentro de `wiki/` hay dos archivos de servicio que **no son páginas de contenido** y por eso
tienen reglas propias:

| Archivo | Rol | Naturaleza | Se reescribe |
|---|---|---|---|
| `index.md` | **Catálogo** navegable de todas las páginas del vault, agrupado por secciones. | Mutable: refleja el estado **actual** del vault. | Sí, se edita y reordena cuando cambia el vault. |
| `log.md` | **Bitácora append-only** de operaciones sobre el wiki (alta/edición/baja/movimiento). | Inmutable hacia atrás: solo se **agrega** al final. | **No**, nunca se reescribe ni reordena lo ya escrito. |

Regla de oro de la relación entre ambos:

> **Toda operación que toca `index.md` deja una entrada en `log.md`.** El índice dice *qué hay
> ahora*; el log dice *qué pasó y cuándo*. Si editaste el índice y no anotaste el log → la tarea
> **no** está terminada (ver checklist §11 de `DESIGN.md`).

---

## 1. Ubicación de los archivos (regla determinista)

| Caso | `index.md` | `log.md` |
|---|---|---|
| **Por defecto** (6 de 7 vaults: MNA, Economía, Proba, Derecho, PAW, Inge2) | `wiki/index.md` | `wiki/log.md` |
| **SDS** (desviación histórica conocida) | **raíz** del vault `index.md` | **raíz** del vault `log.md` |

Reglas:

- **No "corregir" la ubicación de SDS.** Es una desviación medida y aceptada. Para SDS, los archivos
  viven en la raíz y los wikilinks internos se ajustan a esa estructura (ver §7).
- En vaults nuevos, **siempre** `wiki/index.md` y `wiki/log.md`. No replicar la excepción de SDS.
- Hay **exactamente uno** de cada por vault. Nada de `index-teoria.md` sueltos: las divisiones
  internas se hacen con **secciones** dentro del único `index.md` (§2), no con archivos separados.

---

## 2. `index.md` — catálogo por secciones

### 2.1 Anatomía (orden OBLIGATORIO)

```
1. Frontmatter YAML       (igual que cualquier página; tipo=indice)
2. H1 único               (# Índice — <Materia>)
3. Línea de intro         (1 frase: qué es el vault, opcional pero recomendada)
4. Secciones H2           (una por carpeta temática del vault)
   └─ lista de items      (- [[link]] — descripción corta)
5. Separador final        (---)
6. "## Navegación"        (link de vuelta a HOME del repo)
```

Aplica el espaciado determinista de `DESIGN.md` §1 (una línea en blanco antes de cada heading,
`---` final rodeado de líneas en blanco, una newline al final del archivo).

### 2.2 Frontmatter del índice

Sigue las reglas de `DESIGN.md` §2, con valores fijos para este archivo:

```yaml
---
tags: [indice]
fuente: wiki/
tipo: indice
actualizado: 2026-06-14
---
```

Reglas:

- Primer (y único necesario) tag: `indice`. Sin tilde (kebab-case, regla de `DESIGN.md`).
- `fuente: wiki/` — el índice no deriva de un archivo de `raw/`, deriva del propio wiki.
- `actualizado:` se **actualiza en cada edición del índice** (fecha ISO `AAAA-MM-DD`). Esta fecha
  debe coincidir con la fecha de la última entrada de `log.md` que tocó el índice.

### 2.3 Secciones del catálogo

- **Una `## H2` por carpeta temática** del vault (`teoria/`, `clases/`, `guias/`, `resueltos/`,
  `parciales/`, `conceptos/`, `distribuciones/`, `teoremas/`, `tecnicas/`, `formularios/`,
  `fuentes/` — el subconjunto que aplique a la materia, ver `DESIGN.md` §7).
- El **título de la sección es legible** (con tildes y mayúscula inicial), aunque la carpeta sea
  kebab-case: carpeta `teoria/` → sección `## Teoría`.
- **Orden de las secciones (determinista):** primero las de contenido principal en orden didáctico
  (`Teoría` → `Clases` → `Guías` → `Resueltos` → `Parciales`), después las transversales
  (`Conceptos`, `Distribuciones`, `Teoremas`, `Técnicas`, `Formularios`) y al final `Fuentes`.
  Si la materia tiene un orden propio establecido, respetarlo y mantenerlo.
- **Orden de los items dentro de una sección:** por prefijo numérico ascendente si lo hay
  (`01-`, `02-`…); si no hay prefijo, **orden alfabético** por nombre de archivo.

### 2.4 Formato de cada item (regla EXACTA)

Cada entrada es un bullet con **wikilink + guion largo (em dash `—`) + descripción corta**:

```markdown
- [[01-numeros-complejos]] — cuerpo $\mathbb{C}$, forma binómica y polar
```

Reglas no ambiguas:

- Bullet con `-` (no `*`, no `+`).
- El wikilink usa el **nombre de archivo sin `.md`** en kebab-case (`DESIGN.md` §5). Para SDS, que
  usa `_`, respetar el nombre real del archivo.
- Separador entre link y descripción: **espacio + `—` (em dash U+2014) + espacio**. No usar `-`
  (guion corto) ni `:` ni `–` (en dash) como separador. Determinista: siempre `—`.
- Descripción: **una frase corta**, sin punto final, en español rioplatense, que explique de qué
  trata la página (no repetir el título textual). Minúscula inicial salvo nombre propio.
- LaTeX inline permitido en la descripción **solo si la materia usa LaTeX** (`DESIGN.md` §6.1):
  MNA/Economía/Proba/SDS sí; Derecho/PAW/Inge2 no.
- Si una página tiene alias o título humano largo, usar `[[archivo|texto visible]]` para que el
  catálogo se lea natural.

### 2.5 Plantilla copy-paste de `index.md`

```markdown
---
tags: [indice]
fuente: wiki/
tipo: indice
actualizado: 2026-06-14
---

# Índice — Métodos Numéricos Avanzados

Catálogo de la base de conocimiento de la materia. Cada página deriva del material en `raw/`.

## Teoría

- [[01-numeros-complejos]] — cuerpo $\mathbb{C}$, forma binómica y polar
- [[02-vectores-cn-rn]] — espacios $\mathbb{C}^n$ y $\mathbb{R}^n$, operaciones y norma
- [[03-matrices]] — arreglos $n \times m$, operaciones y tipos especiales
- [[04-determinantes]] — definición, propiedades y cálculo

## Guías

- [[guia-01-complejos]] — ejercitación de la unidad 1
- [[guia-02-algebra-lineal]] — ejercitación de matrices y determinantes

## Parciales

- [[ip-tema-01]] — primer parcial, tema 1 (con resolución)
- [[final-tema-01]] — final, tema 1

## Teoremas

- [[teorema-espectral]] — diagonalización de matrices simétricas
- [[teorema-de-la-base]] — toda base de $\mathbb{K}^n$ tiene $n$ vectores

## Fuentes

- [[fuente-apunte-catedra]] — apunte oficial de la cátedra (PDF en `raw/`)

---

## Navegación

- [[HOME]] — índice general del repo (los 7 vaults)
```

### 2.6 Notas por vault (desviaciones aceptadas)

- **SDS:** `index.md` en la raíz; los nombres de archivo usan `_` y la sección `## Navegación`
  apunta con ruta relativa correcta hacia el HOME del repo. No se usa LaTeX en descripciones salvo
  donde la materia lo justifique.
- **Derecho, PAW, Inge2:** **sin LaTeX** en las descripciones (`DESIGN.md` §6.1). PAW/Inge2 pueden
  mantener su idioma original (inglés) en títulos/descr. si el vault ya nació así (`DESIGN.md` §0.5).
- **Materias con LaTeX fuerte (MNA, Economía, Proba):** se permite `$...$` inline en descripciones,
  pero **breve**: una fórmula identificatoria, no un desarrollo.

---

## 3. Reglas de mantenimiento de `index.md`

Determinista, sin ambigüedad. Cada vez que cambia el contenido del vault:

| Operación en el vault | Acción en `index.md` |
|---|---|
| **Se crea** una página nueva | Agregar su item en la sección correspondiente, en la posición que dicta el orden (§2.3). |
| **Se renombra/mueve** una página | Actualizar el wikilink (y, si cambió de carpeta, mover el item a la sección nueva). |
| **Se borra** una página | Quitar su item del catálogo. |
| **Se reescribe** el contenido de una página | Revisar que la descripción del item siga siendo fiel; ajustar si cambió el alcance. |
| **Se agrega** una carpeta temática nueva | Agregar la `## H2` de sección en la posición de orden (§2.3). |

Reglas adicionales:

- **El índice nunca tiene wikilinks rotos.** Si un item apunta a un archivo que no existe → o se
  crea la página, o se quita el item. No se dejan placeholders muertos.
- **Toda página publicable está en el índice.** Excepción: el propio `index.md` y `log.md` **no**
  se listan a sí mismos.
- **Actualizar `actualizado:`** en el frontmatter en cada edición del índice (§2.2).
- **No reordenar caprichosamente.** El orden lo fija §2.3; mantenerlo entre ediciones para que el
  diff sea mínimo y legible.
- Tras cada cambio del índice → **anotar la operación en `log.md`** (§4–§6).

---

## 4. `log.md` — bitácora append-only

### 4.1 Qué es y qué no es

- **Es** un registro cronológico, **append-only**: las entradas nuevas van **al final** del archivo.
- **No es** un changelog editorializado ni un README. No se reescribe el pasado, no se reordena,
  no se borran entradas. Si una entrada quedó mal, se agrega una **entrada correctiva nueva**
  (`fix` / `nota`) — no se edita la vieja.
- **No** registra cambios del material `raw/` (es solo lectura). Registra cambios del **wiki**.

### 4.2 Formato EXACTO de una entrada

Cada entrada es un heading `## H2` con esta estructura fija:

```
## [AAAA-MM-DD] <op> | <subject>
```

Desglose determinista:

- `## ` — heading nivel 2 (cada entrada es un H2; el archivo tiene un único `# H1` de título).
- `[AAAA-MM-DD]` — fecha ISO entre corchetes. Día en que se hizo la operación.
- ` ` — un espacio.
- `<op>` — **verbo de operación** en minúscula, del vocabulario cerrado de §4.3.
- ` | ` — separador: **espacio + barra vertical + espacio**.
- `<subject>` — sujeto de la operación: nombre de archivo (kebab-case, sin `.md`) o frase corta.

Debajo del heading, **opcionalmente**, una o dos líneas de detalle (qué cambió, por qué, de dónde
salió). Sin viñetas decorativas; texto plano o lista `-` corta si hace falta.

### 4.3 Vocabulario cerrado de `<op>` (usar SOLO estos)

| `<op>` | Cuándo | `<subject>` típico |
|---|---|---|
| `add` | Se creó una página nueva. | nombre del archivo nuevo |
| `edit` | Se modificó el contenido de una página existente. | nombre del archivo editado |
| `rename` | Se cambió el nombre de archivo (sin cambiar carpeta). | `viejo → nuevo` |
| `move` | Se movió a otra carpeta/sección. | `origen → destino` |
| `delete` | Se eliminó una página. | nombre del archivo borrado |
| `merge` | Se fusionaron dos o más páginas en una. | `a + b → c` |
| `split` | Se partió una página en varias. | `a → b + c` |
| `index` | Se actualizó `index.md` (reorden, nueva sección, etc.) sin tocar páginas. | `index.md` |
| `fix` | Corrección puntual (link roto, typo de metadato, entrada de log previa errónea). | qué se arregló |
| `nota` | Anotación de criterio/decisión que no es un cambio de archivo. | tema de la nota |

Reglas:

- **No inventar verbos.** Si una operación no encaja, es combinación de varias: registrar **una
  entrada por operación atómica** (p. ej. crear + actualizar índice = una `add` y, si querés
  explicitarlo, una `index`; en la práctica el `add` ya implica el alta en el índice — usar `index`
  solo cuando el cambio del índice es independiente de una página).
- `<op>` siempre en **minúscula** y en **inglés** (vocabulario técnico estable, aunque el detalle se
  escriba en español rioplatense).
- Para `rename`/`move`/`merge`/`split` usar la flecha `→` (U+2192) entre origen y destino.

### 4.4 Reglas de orden y agrupación

- **Cronológico ascendente:** la entrada más vieja arriba, la más nueva al final del archivo.
  (Append-only literal: agregás abajo.)
- **Una entrada = una operación atómica.** Varias operaciones del mismo día → varias entradas
  `## [misma-fecha] …` consecutivas, una por operación. No agrupar varias operaciones bajo un solo
  heading.
- **Fecha = día real de la operación** (hoy, `2026-06-14` en este contexto). No backdatear.
- Nunca dos `# H1` (el de título del archivo es el único H1; las entradas son H2).

---

## 5. Plantilla copy-paste de `log.md`

```markdown
---
tags: [log]
fuente: wiki/
tipo: log
actualizado: 2026-06-14
---

# Bitácora — Métodos Numéricos Avanzados

Registro append-only de operaciones sobre el wiki. Entrada más nueva al final.
Formato: `## [AAAA-MM-DD] <op> | <subject>`. Verbos: add, edit, rename, move, delete, merge, split, index, fix, nota.

## [2026-06-10] add | 01-numeros-complejos

Página de teoría creada desde `raw/apunte-catedra.pdf`, unidad 1. Listada en `index.md` → Teoría.

## [2026-06-10] add | 02-vectores-cn-rn

Espacios $\mathbb{C}^n$ y $\mathbb{R}^n$. Agregada a `index.md` → Teoría.

## [2026-06-11] edit | 02-vectores-cn-rn

Agregada sección de norma y desigualdad de Cauchy-Schwarz. Descripción del índice ajustada.

## [2026-06-12] rename | vectores → 02-vectores-cn-rn

Se agregó prefijo numérico para fijar el orden didáctico. Wikilink del índice actualizado.

## [2026-06-12] split | 03-matrices-y-determinantes → 03-matrices + 04-determinantes

La página crecía sin foco (ver `DESIGN.md` §0.4). Dos páginas nuevas, ambas en `index.md` → Teoría.

## [2026-06-13] index | index.md

Reordenada la sección Teoría tras el split; agregada sección Teoremas.

## [2026-06-14] fix | 04-determinantes

Corregido wikilink roto a `[[03-matrices]]` en "Ver también".
```

### 5.1 Frontmatter del log

- Primer tag: `log`. `tipo: log`. `fuente: wiki/`.
- `actualizado:` = fecha de la **última entrada** agregada.
- Igual que el índice, el log **no se lista a sí mismo** en `index.md`.

---

## 6. Flujo de trabajo (cómo se usan juntos)

Secuencia determinista al hacer cualquier cambio en el wiki:

1. **Hacer el cambio** en la(s) página(s) (alta/edición/rename/move/delete/merge/split), siguiendo
   `DESIGN.md`.
2. **Actualizar `index.md`:** agregar/mover/quitar el item, reordenar si corresponde (§3), tocar
   `actualizado:`.
3. **Agregar al final de `log.md`** una entrada por operación atómica, con el formato exacto de §4.2
   y un verbo del vocabulario de §4.3; tocar `actualizado:` del log.
4. **Verificar** que no haya wikilinks rotos en el índice y que la fecha `actualizado:` del índice
   coincida con la de la última entrada de log que lo tocó.

Caso "página nueva" (el más común), resumido:

> `add` la página → ítem nuevo en `index.md` (sección + orden) → entrada
> `## [hoy] add | <archivo>` en `log.md`. Tres pasos, siempre los tres.

---

## 7. Wikilinks dentro de índice y log (ubicación-aware)

- En el **índice**, los wikilinks a páginas usan el nombre de archivo relativo al wiki
  (`[[01-numeros-complejos]]` o `[[teoria/01-numeros-complejos]]` si hay ambigüedad entre carpetas,
  ver `DESIGN.md` §5).
- El **HOME del repo** se enlaza desde el índice como `[[HOME]]` (o ruta relativa correcta). Las
  páginas hoja **no** linkean a HOME: la cadena es página → `index.md` → `HOME.md` (`DESIGN.md` §9).
- En **SDS** (índice y log en la raíz), ajustar los wikilinks a esa estructura: las páginas del wiki
  pueden estar en subcarpetas relativas a la raíz; verificar que el link resuelva.
- El **log normalmente no necesita wikilinks** (usa nombres de archivo como texto plano en el
  `<subject>`). Si querés que un nombre sea clickable, podés usar `[[archivo]]`, pero **no es
  obligatorio** y no debe romper el formato `## [fecha] <op> | <subject>`.

---

## 8. Errores comunes a evitar (anti-patrones)

- **Editar entradas viejas del log.** Prohibido. El log es append-only; corregí con una entrada
  `fix`/`nota` nueva.
- **Reordenar el log** por fecha "para que quede prolijo". No: ya está en orden de inserción
  ascendente; agregar siempre abajo.
- **Olvidar el log** tras tocar el índice (o viceversa). Van juntos, siempre.
- **Inventar verbos de `<op>`** fuera del vocabulario de §4.3.
- **Separador equivocado** en los items del índice (`-`, `:` o `–` en vez de `—`).
- **Wikilinks rotos** en el índice (apuntar a archivos inexistentes).
- **Listar `index.md`/`log.md` a sí mismos** en el catálogo.
- **Mover index/log de SDS** a `wiki/` "para uniformar". Es una desviación aceptada: no tocar.
- **LaTeX en descripciones de Derecho/PAW/Inge2.** Esas materias no usan LaTeX (`DESIGN.md` §6.1).
- **Callouts `[!note]` o Dataview** en estos archivos. Cero, igual que en las páginas
  (`DESIGN.md` §0.1).
- **Backdatear** entradas del log: la fecha es el día real de la operación.

---

## 9. Mini-checklist

### `index.md`

- [ ] Frontmatter con `tags: [indice]`, `tipo: indice`, `fuente: wiki/`, `actualizado:` al día.
- [ ] Un único `# H1` (`# Índice — <Materia>`).
- [ ] Una `## H2` por carpeta temática, en el orden de §2.3.
- [ ] Items en orden (prefijo numérico, si no alfabético) dentro de cada sección.
- [ ] Cada item: `- [[archivo]] — descripción corta` con em dash `—` exacto.
- [ ] Descripciones en español rioplatense, sin punto final; LaTeX solo donde la materia lo usa.
- [ ] Sin wikilinks rotos; toda página publicable listada; `index.md`/`log.md` **no** se listan.
- [ ] Sección `## Navegación` con link a `[[HOME]]` al pie.
- [ ] Ubicación correcta (`wiki/` salvo SDS = raíz).

### `log.md`

- [ ] Frontmatter con `tags: [log]`, `tipo: log`, `fuente: wiki/`, `actualizado:` = última entrada.
- [ ] Un único `# H1` (`# Bitácora — <Materia>`); entradas como `## H2`.
- [ ] Cada entrada: `## [AAAA-MM-DD] <op> | <subject>`, fecha ISO, verbo del vocabulario cerrado.
- [ ] Una entrada por operación atómica; orden cronológico ascendente (nuevas al final).
- [ ] Flecha `→` en rename/move/merge/split.
- [ ] Sin reescritura del pasado: correcciones como entrada `fix`/`nota` nueva.
- [ ] Ubicación correcta (`wiki/` salvo SDS = raíz).

### Coherencia del par

- [ ] Toda operación que tocó el índice tiene su entrada en el log.
- [ ] `actualizado:` del índice coincide con la fecha de la última entrada de log que lo tocó.
- [ ] Cero callouts, cero Dataview, cero HTML de render (solo comentarios `<!-- -->` si hicieran falta).

---

*Fin de FEATURES_indices-y-logs.md*

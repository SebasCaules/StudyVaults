# FEATURES — Índices (`index.md`)

> Documento del **Designer de documentación**. Profundiza un único tema de `DESIGN.md`
> (ver §9 "Navegación", último bullet): **cómo se construye y se mantiene** el catálogo
> (`index.md`) de cada vault del repo publicable.
>
> **No repite** `DESIGN.md`: las reglas de páginas hoja (frontmatter, headings, blockquotes,
> LaTeX, naming) viven allá. Acá solo se trata el índice.
>
> **Output en español rioplatense, conciso.** Los vaults originales son **SOLO LECTURA**:
> este estándar describe el formato del repo publicable; **nunca** se modifica el material fuente.

Archivos compañeros: `DESIGN.md` (estándar de páginas), `TEMPLATE_pagina.md`, `EJEMPLO_pagina.md`.
Este documento agrega una plantilla más: la de `index.md` (§2).

---

## 0. Por qué existe este archivo

El repo sigue el **"LLM Wiki pattern"** (documentado en el `CLAUDE.md` de los 7 vaults):

- **`raw/`** = fuente de verdad, **solo lectura**, auxiliar. **No** se publica.
- **`wiki/`** = base de conocimiento **generada por Claude**, permanente. **Sí** se publica.

Dentro de `wiki/` hay un archivo de servicio que **no es una página de contenido** y por eso
tiene reglas propias:

| Archivo | Rol | Naturaleza | Se reescribe |
|---|---|---|---|
| `index.md` | **Catálogo** navegable de todas las páginas del vault, agrupado por secciones. | Mutable: refleja el estado **actual** del vault. | Sí, se edita y reordena cuando cambia el vault. |

Regla de oro del índice:

> **Toda página publicable está en el índice.** El índice dice *qué hay ahora*. Si creaste una
> página y no la listaste → la tarea **no** está terminada (ver checklist §11 de `DESIGN.md`).

---

## 1. Ubicación del archivo (regla determinista)

| Caso | `index.md` |
|---|---|
| **Por defecto** (6 de 7 vaults: MNA, Economía, Proba, Derecho, PAW, Inge2) | `wiki/index.md` |
| **SDS** (desviación histórica conocida) | **raíz** del vault `index.md` |

Reglas:

- **No "corregir" la ubicación de SDS.** Es una desviación medida y aceptada. Para SDS, el archivo
  vive en la raíz y los wikilinks internos se ajustan a esa estructura (ver §6).
- En vaults nuevos, **siempre** `wiki/index.md`. No replicar la excepción de SDS.
- Hay **exactamente uno** por vault. Nada de `index-teoria.md` sueltos: las divisiones
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
- `actualizado:` se **actualiza en cada edición del índice** (fecha ISO `AAAA-MM-DD`).

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
- **Toda página publicable está en el índice.** Excepción: el propio `index.md` **no**
  se lista a sí mismo.
- **Actualizar `actualizado:`** en el frontmatter en cada edición del índice (§2.2).
- **No reordenar caprichosamente.** El orden lo fija §2.3; mantenerlo entre ediciones para que el
  diff sea mínimo y legible.

---

## 4. Wikilinks dentro del índice (ubicación-aware)

- En el **índice**, los wikilinks a páginas usan el nombre de archivo relativo al wiki
  (`[[01-numeros-complejos]]` o `[[teoria/01-numeros-complejos]]` si hay ambigüedad entre carpetas,
  ver `DESIGN.md` §5).
- El **HOME del repo** se enlaza desde el índice como `[[HOME]]` (o ruta relativa correcta). Las
  páginas hoja **no** linkean a HOME: la cadena es página → `index.md` → `HOME.md` (`DESIGN.md` §9).
- En **SDS** (índice en la raíz), ajustar los wikilinks a esa estructura: las páginas del wiki
  pueden estar en subcarpetas relativas a la raíz; verificar que el link resuelva.

---

## 5. Errores comunes a evitar (anti-patrones)

- **Separador equivocado** en los items del índice (`-`, `:` o `–` en vez de `—`).
- **Wikilinks rotos** en el índice (apuntar a archivos inexistentes).
- **Listar `index.md`** a sí mismo en el catálogo.
- **Mover el index de SDS** a `wiki/` "para uniformar". Es una desviación aceptada: no tocar.
- **LaTeX en descripciones de Derecho/PAW/Inge2.** Esas materias no usan LaTeX (`DESIGN.md` §6.1).
- **Callouts `[!note]` o Dataview** en este archivo. Cero, igual que en las páginas
  (`DESIGN.md` §0.1).
- **Olvidar listar** una página nueva: toda página publicable va en el índice.

---

## 6. Mini-checklist

### `index.md`

- [ ] Frontmatter con `tags: [indice]`, `tipo: indice`, `fuente: wiki/`, `actualizado:` al día.
- [ ] Un único `# H1` (`# Índice — <Materia>`).
- [ ] Una `## H2` por carpeta temática, en el orden de §2.3.
- [ ] Items en orden (prefijo numérico, si no alfabético) dentro de cada sección.
- [ ] Cada item: `- [[archivo]] — descripción corta` con em dash `—` exacto.
- [ ] Descripciones en español rioplatense, sin punto final; LaTeX solo donde la materia lo usa.
- [ ] Sin wikilinks rotos; toda página publicable listada; `index.md` **no** se lista a sí mismo.
- [ ] Sección `## Navegación` con link a `[[HOME]]` al pie.
- [ ] Ubicación correcta (`wiki/` salvo SDS = raíz).
- [ ] Cero callouts, cero Dataview, cero HTML de render (solo comentarios `<!-- -->` si hicieran falta).

---

*Fin de FEATURES_indices-y-logs.md*

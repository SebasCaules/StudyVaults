# FEATURES_navegacion.md — Sistema de navegación del repo publicable

> Guía temática del **Designer**. Profundiza la sección 9 de `DESIGN.md` (no la repite): cómo se
> teje el grafo de navegación entre páginas, vaults y el repo, para que **cualquier página sea
> alcanzable en pocos saltos** y el grafo no tenga huérfanos ni callejones sin salida.
>
> Output en **español rioplatense**, conciso. Los vaults originales son **SOLO LECTURA**: esto
> describe la estructura de navegación del repo *publicable*, **nunca** modifica los vaults fuente.
> Calibrado contra MNA (`wiki/index.md`, `wiki/00-mapa-temas.md`) y SDS (que pone `index.md`
> en la raíz, no en `wiki/` — ver §7).

Lo que `DESIGN.md` ya fija y acá **no** se repite: anatomía de página, frontmatter, headings,
formato de `## Ver también`, sintaxis básica de wikilink. Acá se define **el sistema**: las cinco
piezas (wikilinks, `index.md`, `HOME.md`, MOC, breadcrumbs), cómo se conectan y las reglas
deterministas de **cuándo y a qué** enlazar.

---

## 0. Las piezas y cómo encajan

```
HOME.md (raíz del repo)
   │  enlaza los 7 vaults
   ▼
index.md (1 por vault)
   │  cataloga TODAS las páginas del vault, agrupadas por tipo
   ├──► 00-mapa-temas.md (MOC, opcional pero recomendado)
   │       tabla Tema → {teoría, clase, guía, parcial...}: navegación POR CONCEPTO
   ▼
páginas hoja (teoria/, guias/, parciales/, ...)
   │  cuerpo: wikilinks inline (conceptuales)
   └──► ## Ver también: wikilinks laterales (hermanas/relacionadas)
```

Regla mental: **toda página debe ser alcanzable de dos formas** — por jerarquía (HOME → index →
página) y por concepto (MOC o wikilink inline desde una página vecina). Si una página solo es
alcanzable de una forma, falta tejido.

| Pieza | Vive en | Qué resuelve | Dirección |
|---|---|---|---|
| `HOME.md` | raíz del repo | "¿qué materias hay?" | repo → vaults |
| `index.md` | `wiki/` de cada vault (SDS: raíz) | "¿qué páginas tiene esta materia?" | vault → páginas |
| `00-mapa-temas.md` (MOC) | `wiki/` de cada vault | "¿dónde repaso *este tema*?" | concepto → páginas |
| Wikilinks inline | cuerpo de cada página | "este término tiene página propia" | página → página |
| `## Ver también` | pie de cada página | "páginas hermanas/relacionadas" | página → páginas |
| Breadcrumb (§6) | tope de páginas profundas | "¿dónde estoy? ¿cómo subo?" | página → index |

---

## 1. Wikilinks `[[ ]]` — reglas de cuándo enlazar (deterministas)

`DESIGN.md §5` ya da la **sintaxis** (`[[pagina]]`, `[[carpeta/pagina]]`, `[[pagina|alias]]`). Acá
las reglas de **decisión**, para que dos editores enlacen igual.

### 1.1 Regla de la primera mención

- Enlazá la **primera** aparición, en el cuerpo, de un término que **tiene página propia**. Las
  siguientes menciones en la misma página van en texto plano (no re-enlazar).
- "Tiene página propia" = existe (o existirá en este mismo lote de ingesta) un archivo en el wiki
  cuyo tema es ese concepto. Si la página todavía no existe pero se va a crear, enlazá igual
  (link rojo intencional, no huérfano) y mantené pendiente la creación dentro del mismo lote.
- **No** enlaces términos que solo son una página candidata difusa ("álgebra lineal" en general):
  enlazá conceptos con archivo concreto, no categorías.

### 1.2 Qué SÍ y qué NO enlazar inline

SÍ (alto valor de navegación):

- El concepto del que esta página **depende** ("usa el [[02-vectores-cn-rn|producto interno]]").
- El concepto que esta página **generaliza o especializa** ("caso particular de [[03-matrices]]").
- La fuente, cuando hay página en `fuentes/` ("según [[fuentes/teoria_4]]").
- El enunciado desde su resolución y viceversa (par enunciado↔resolución, ver §5.3).

NO (ruido):

- Términos genéricos sin página (`matriz`, `función`, `límite` usados como palabra común).
- Re-enlazar en cada párrafo el mismo destino.
- Enlazar dentro de fórmulas LaTeX (`$...$` / `$$...$$`): **nunca** va wikilink adentro del math.
- Auto-enlace (una página no se enlaza a sí misma).

### 1.3 Alias `|`: cuándo es obligatorio

El archivo es **kebab-case sin tildes** (`02-vectores-cn-rn`), pero el texto debe leerse natural.
Usá alias siempre que el nombre de archivo quede mal en la prosa:

```markdown
El [[teorema-central-del-limite|TCL]] garantiza convergencia.
Definimos el [[02-vectores-cn-rn|producto interno]] como...
Ver la [[clases/clase-2026-04-09|clase del 09/04]] para Gram–Schmidt.
```

Regla determinista: **si el nombre de archivo, leído tal cual en medio de la frase, no es español
gramatical → usá alias.** Prefijos numéricos (`01-`, `clase-2026-…`) casi siempre piden alias.

### 1.4 Densidad objetivo

- Página hoja típica: **3 a 8** wikilinks inline en el cuerpo + 2 a 5 en `## Ver también`.
- Menos de 2 links totales → la página es probablemente un huérfano: revisá si falta tejido (§8).
- Más de ~15 inline → estás sobre-enlazando; dejá solo dependencias reales.

---

## 2. `index.md` por vault — el catálogo

Es la página más enlazada del vault: lista **todas** las páginas, agrupadas por tipo de contenido.
No es mapa conceptual (eso es el MOC): es el **directorio**.

### 2.1 Estructura canónica (copy-paste)

```markdown
# Índice — <Materia> Wiki

<N> páginas, <M> fuentes ingestadas. Última actualización: AAAA-MM-DD.

## Meta

- [[00-mapa-temas]] — árbol Tema → Páginas (a dónde ir para repasar)

## Teoría

- [[teoria/01-numeros-complejos]] — $\mathbb{C}$, forma polar, De Moivre, raíces
- [[teoria/02-vectores-cn-rn]] — vectores en $\mathbb{K}^n$, PI, normas, ortogonalidad

## Clases

- [[clases/clase-2026-03-12]] — vectores en $\mathbb{K}^n$, matrices

## Guías TP

- [[guias/guia-01-complejos]] (11 ej.)

## Parciales

- ...
```

### 2.2 Reglas del index

- **Una entrada por página existente.** Si creás una página y no la listás acá → es huérfana. El
  index es la red de seguridad contra huérfanos: cada archivo nuevo entra acá en el mismo commit.
- **Agrupar por las carpetas temáticas de `DESIGN.md §7`** (`Teoría`, `Clases`, `Guías`,
  `Resueltos`, `Parciales`, `Conceptos`, `Métodos`, `Fuentes`...). Usá solo los grupos que el vault
  tenga; el orden de grupos va de lo conceptual (teoría) a lo aplicado (parciales/fuentes).
- **Cada entrada lleva descripción corta** tras ` — ` (un guion largo con espacios): de qué trata,
  o conteo entre paréntesis para guías/parciales (`(11 ej.)`). Sin punto final.
- **El nombre dentro de `[[ ]]` incluye la subcarpeta** (`[[teoria/01-...]]`), porque el index vive
  en la raíz del wiki y los archivos están en subcarpetas.
- El index **puede** abrir con un bloque de estado (TPs en curso, gaps de cobertura, parcial
  próximo) — patrón real de SDS y MNA. Va antes de los grupos, bajo el H1.
- Para familias muy grandes (30 parciales en MNA) se permite **formato compacto inline** separando
  con ` · ` en vez de una línea por ítem:
  ```markdown
  I [[parciales/ip-tema-01-resolucion]] · II [[parciales/ip-tema-02-resolucion]] · III [[parciales/ip-tema-03-resolucion]]
  ```

### 2.3 El index NO lleva `## Ver también`

Es el destino de navegación, no una página hoja. No necesita frontmatter completo de página
(`tags: [meta, indice]` alcanza si se le pone alguno) ni sección "Ver también". Su único link
"hacia arriba" es a `HOME.md` (§3.2).

---

## 3. `HOME.md` — la raíz del repo

Una sola página en la raíz del repo publicable. Enlaza los 7 vaults. Es el único punto que ve
"todas las materias juntas".

### 3.1 Estructura canónica (copy-paste)

```markdown
# StudyVaults — Inicio

Wiki de apuntes de ITBA. Cada materia es un vault con su propio índice.

## Materias

- [[MNA/wiki/index|MNA — Métodos Numéricos Avanzados]] — álgebra lineal numérica, Fourier, SVD/QR/LU
- [[Economia/wiki/index|Economía]] — micro/macro, optimización
- [[Proba/wiki/index|Probabilidad y Estadística]] — distribuciones, TCL, inferencia
- [[Derecho/wiki/index|Derecho]] — ...
- [[SDS/index|Simulación de Sistemas]] — Vicsek, EDMD, dinámica molecular
- [[.../PAW/wiki/index|PAW]] — ...
- [[.../Inge2/wiki/index|Ingeniería de Software 2]] — ...

## Cómo navegar

- Cada materia: entrá por su índice y de ahí a las páginas.
- Para repasar **un tema**, buscá el *mapa de temas* (`00-mapa-temas`) dentro del vault.
```

### 3.2 Reglas de HOME

- **HOME enlaza a `index.md` de cada vault, no a páginas hoja.** La cadena es siempre
  `HOME → index → página`. HOME nunca apunta a `teoria/03-matrices` directamente.
- Cada `index.md` apunta **de vuelta** a HOME (link hacia arriba). Forma recomendada: una línea al
  pie del index — `[[HOME|← Inicio del repo]]` — o en el bloque Meta.
- **Las páginas hoja NUNCA enlazan a HOME.** Suben vía su `index.md` (o breadcrumb, §6). Esto
  mantiene HOME con pocas aristas entrantes y el grafo jerárquico limpio.
- Atención a la **ruta del wikilink entre vaults**: HOME vive en la raíz del repo y los index están
  en `<vault>/wiki/index.md`, así que el link lleva ruta completa + alias legible (ej.
  `[[MNA/wiki/index|MNA]]`). Para SDS la ruta es `SDS/index` (sin
  `wiki/`, ver §7).

---

## 4. MOC (`00-mapa-temas.md`) — navegación por concepto

El **Map of Content**: la pieza que convierte el repo de "lista de archivos" en "grafo navegable
por tema". Responde "quiero repasar *diagonalización*, ¿dónde está todo lo de diagonalización?"
cruzando teoría, clases, guías, resueltos y parciales en **una tabla**.

### 4.1 Cuándo crear un MOC

- **Obligatorio** cuando un mismo tema se reparte en ≥3 tipos de página (teoría + guía + parcial,
  típico de materias con parcial: MNA, Proba, Economía).
- **Opcional** en materias chicas o muy lineales (un MOC de 4 filas no aporta sobre el index).
- Si existe, se llama `00-mapa-temas.md` (prefijo `00-` para que ordene primero) y se lista en el
  bloque **Meta** del index.

### 4.2 Forma canónica: tabla "qué entrena qué" (copy-paste)

Patrón real de MNA. Filas = temas; columnas = tipos de página + una columna de "peso" (frecuencia
en parciales / prioridad):

```markdown
---
tags: [meta, mapa]
actualizado: AAAA-MM-DD
---

# Mapa de temas — qué entrena qué

Cada tema se entrena en varios lugares del wiki. Esta tabla dice **a dónde ir** para repasarlo.

| # | Tema | Teoría | Clase | Guía TP | Resueltos | Peso en parciales |
|---|------|--------|-------|---------|-----------|-------------------|
| 5 | TL: núcleo, imagen, matriz asociada | — | [[clases/clase-2026-04-16]] | [[guias/guia-04-transformaciones-lineales]] | — | **9/9 IPs Ej. 1** |
| 7 | Diagonalización | — | [[clases/clase-2026-04-30]] | [[guias/guia-05-diagonalizacion]] | [[resueltos/resueltos-diagonalizacion]] | **7/9 IPs** con parámetro |

## Prioridades

Si el parcial es de IP + clases hasta 14/05, los temas obligatorios son **#5, #7, #9, #10**.
```

### 4.3 Reglas del MOC

- **Celda vacía = `—`** (guion), no en blanco: deja explícito que ese tema no tiene página de ese
  tipo (señal de gap, ver §8).
- Una celda puede tener **varios** wikilinks separados por `, ` (un tema entrenado en dos clases).
- La columna de **peso/prioridad** es texto libre corto (`Baja`, `**9/9 IPs Ej. 1**`, `sub-paso`):
  es lo que hace al MOC útil para estudiar, no solo para navegar.
- El MOC **no reemplaza** al index: el index lista *todas* las páginas (incluidas las que no caen
  en ningún tema del parcial); el MOC organiza solo los **temas examinables**.
- Variante temática (no-parcial): para materias sin parcial (PAW, Inge2, SDS) el MOC puede ser un
  árbol por **subsistema/módulo** en vez de "qué entrena qué" — mismas reglas de tabla, columnas
  adaptadas (ej. `Concepto | Método | Fuente | Estado`).

---

## 5. `## Ver también` — navegación lateral

`DESIGN.md §9.1` fija el **formato** (lista de wikilinks con ` — descripción`). Acá las reglas de
**a qué enlazar** para que la navegación lateral sea consistente y no redundante.

### 5.1 Qué poner (en este orden de prioridad)

1. **Hermanas en la misma carpeta/secuencia**: la página anterior y la siguiente de la serie
   (`01-` ↔ `02-`), las otras unidades del mismo bloque.
2. **Dependencias conceptuales** ya enlazadas inline pero que valen como "para profundizar".
3. **El par cruzado**: desde teoría → la guía/parcial que la ejercita; desde resolución → su
   enunciado (§5.3).

Ejemplo real (MNA `04-determinantes`):

```markdown
## Ver también

- [[03-matrices]] — matriz, menor, cofactor en el contexto general
- [[02-vectores-cn-rn]] — columnas de una matriz como vectores
- [[01-numeros-complejos]] — cuerpo base $\mathbb{C}$
```

### 5.2 Reglas

- **2 a 5 entradas.** Más de 5 → probablemente algunas deberían ser inline, o falta un MOC.
- **Descripción obligatoria** tras ` — `: *por qué* importa el link, no qué es el archivo
  (`— cuerpo base $\mathbb{C}$`, no `— página de complejos`).
- **No duplicar el grueso** de los links inline: "Ver también" es para lo lateral/hermano; lo que
  ya está bien enlazado en el cuerpo no necesita repetirse salvo que sea una hermana de secuencia.
- Dentro de "Ver también" **sí** se permite LaTeX inline en la descripción (es prosa, no math
  aislado). Coherente con el uso de la materia (LaTeX en MNA/Proba/Economía; ausente en Derecho/PAW).
- Las páginas que solo existen para catalogar (`index`, MOC) **no** llevan "Ver también".

### 5.3 Pares enunciado ↔ resolución (regla específica)

Cuando hay `*-tema-NN.md` y su par `*-tema-NN-resolucion.md`:

- El **enunciado** linkea a su resolución en "Ver también": `- [[ip-tema-01-resolucion]] — resolución completa`.
- La **resolución** linkea de vuelta al enunciado: `- [[ip-tema-01]] — enunciado`.
- Es un enlace **bidireccional obligatorio**: nunca dejar un par a medias.

---

## 6. Breadcrumbs — orientación en páginas profundas

Obsidian no tiene breadcrumb nativo sin plugin, y el estándar prohíbe plugins
(`DESIGN.md §0`). El breadcrumb se hace **a mano con wikilinks**, y es **opcional**: solo donde la
profundidad lo justifica.

### 6.1 Cuándo poner breadcrumb

- Páginas que viven a ≥2 niveles de subcarpeta o en familias grandes (los 30 parciales de MNA), donde
  desde la página no es obvio cómo volver al catálogo.
- Páginas largas donde scrollear hasta "Ver también" para volver es molesto.
- **No** poner breadcrumb en páginas cortas de primer nivel: el `index` ya está a un salto.

### 6.2 Forma canónica (copy-paste)

Una sola línea, **inmediatamente debajo del H1**, antes del primer `## H2`:

```markdown
# IP Tema 01 — Resolución

> [[index|Índice]] › [[00-mapa-temas|Mapa de temas]] › Parciales › IP Tema 01
```

Reglas:

- Va como **blockquote de una línea** con separador ` › ` (carácter `›`, U+203A).
- El **último segmento es el texto plano** de la página actual (sin link a sí misma).
- Solo los segmentos que **son páginas reales** van con `[[ ]]`; los que son solo agrupadores
  (`Parciales`) van en texto plano.
- El breadcrumb **complementa, no reemplaza** a `## Ver también`: uno sube (navegación vertical),
  el otro va de lado (lateral).
- Como va antes del primer `## H2`, respeta la regla de espaciado de `DESIGN.md §1` (una línea en
  blanco entre H1 y el primer bloque).

---

## 7. Caso SDS — `index.md` en la raíz

SDS es la desviación medida: su `index.md` está en la **raíz del vault**, no en
`wiki/`. **No se corrige** (vaults son solo lectura, y es una convención consolidada del vault).
Implicaciones de navegación:

- Los wikilinks del index de SDS a sus páginas usan rutas **relativas a la raíz** (`[[tps/TP5]]`,
  `[[conceptos/vicsek]]`), no `[[wiki/...]]`.
- El link desde `HOME.md` a SDS apunta a `SDS/index` (sin `wiki/`), a diferencia del
  resto (`<vault>/wiki/index`).
- Para vaults **nuevos**: seguí el patrón mayoritario (`index.md` dentro de `wiki/`).
  SDS es excepción histórica, no modelo a copiar.

---

## 8. Mantener el grafo navegable — anti-huérfanos y anti-callejones

Un grafo navegable cumple dos invariantes. Verificalas al cerrar cada lote de ingesta:

### 8.1 Invariante A — cero huérfanos (todo es alcanzable)

Una página es **huérfana** si nada la enlaza. Para evitarlo, **toda página nueva** debe quedar
enlazada desde al menos:

1. su `index.md` (obligatorio, siempre), **y**
2. el MOC si el tema cae en la tabla, **o** un wikilink inline desde una página vecina.

Chequeo rápido (grep, solo-lectura sobre el repo publicable):

```bash
# Páginas .md del wiki que NO aparecen citadas en ningún index/MOC/otra página:
# 1) listar archivos    2) por cada uno, grep su nombre-sin-.md en el resto del wiki
```

### 8.2 Invariante B — cero callejones sin salida (todo tiene salida)

Una página es **callejón** si no enlaza a ninguna otra. Toda página hoja debe tener, como mínimo:

- `## Ver también` con ≥2 wikilinks (`DESIGN.md §9.1`), **o**
- breadcrumb que suba al index (§6), **o** (idealmente) ambos.

Si una página genuinamente no tiene hermanas ni dependencias, al menos el breadcrumb al index la
saca del callejón.

### 8.3 Links rotos vs. links rojos intencionales

- **Link roto** = wikilink a un archivo que no existe ni se va a crear → **error**, corregir el
  nombre o quitar el link.
- **Link rojo intencional** = wikilink a una página que **se va a crear en este mismo lote** →
  permitido, pero la creación debe quedar pendiente dentro del mismo lote para no perderlo.

---

## 9. Mini-checklist de navegación (al cerrar un lote)

Verificá **todos** estos puntos antes de dar por publicable el grafo:

**Por página hoja nueva:**

- [ ] Listada en `index.md` del vault, en el grupo correcto, con descripción tras ` — `.
- [ ] Tiene `## Ver también` con 2–5 wikilinks descriptivos **o** breadcrumb al index (idealmente ambos).
- [ ] Primera mención de cada concepto con página propia enlazada inline (regla §1.1); sin re-enlaces.
- [ ] Sin wikilinks dentro de `$...$`/`$$...$$`; alias `|` donde el nombre de archivo no lee natural.
- [ ] Si es par enunciado/resolución: enlace **bidireccional** entre ambos (§5.3).
- [ ] No es huérfana (≥1 entrada entrante) ni callejón (≥1 salida).

**Por vault:**

- [ ] `index.md` cubre el 100% de las páginas existentes (cero archivos sin catalogar).
- [ ] MOC `00-mapa-temas.md` presente si el tema se reparte en ≥3 tipos; celdas vacías como `—`.
- [ ] `index.md` linkea de vuelta a `HOME.md`; ninguna página hoja linkea a HOME directo.
- [ ] Links rojos pendientes (páginas a crear en el lote) resueltos antes de cerrar.
- [ ] SDS: rutas sin `wiki/` (`index.md` en raíz); resto: dentro de `wiki/`.

**Por repo:**

- [ ] `HOME.md` enlaza los 7 vaults vía su `index` (ruta completa + alias legible), no páginas hoja.
- [ ] Cero links rotos (todo `[[destino]]` resuelve a un archivo existente o a un rojo intencional anotado).

---

*Fin de FEATURES_navegacion.md*

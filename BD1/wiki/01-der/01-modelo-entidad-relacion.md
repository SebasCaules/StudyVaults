---
tags: [teoria, unidad-1, entidad-relacion, entidades, atributos, relaciones, cardinalidades]
fuente: raw/practicas/der-practica.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Modelo entidad-relación (DER)

El modelo entidad-relación (E/R) es una notación gráfica para el diseño conceptual de una
base de datos: describe el dominio en términos de **entidades**, sus **atributos** y las
**relaciones** que las vinculan, con **cardinalidades** que acotan cuántas instancias
participan. El resultado es un **diagrama entidad-relación (DER)**, previo a traducirlo al
modelo relacional.

> **Nota.** En los apuntes de la cursada 2025-2C el modelo E/R se presenta casi por completo
> a través de **diagramas de ejemplo resueltos**, no de definiciones formales. Esta página
> reconstruye la notación tal como aparece dibujada en esos ejemplos; los casos completos
> están en [[02-ejercicios-der]].

## Elementos de un DER

Cada elemento del diagrama tiene una forma gráfica fija:

| Elemento | Forma en el diagrama | Ejemplos de los apuntes |
|---|---|---|
| Entidad | rectángulo | `Auto`, `Modelo`, `Departamento`, `Empleado`, `Cliente`, `Avión` |
| Relación | rombo | `tiene`, `Provee`, `Escribe`, `Suministra`, `es_recetado`, `Otorga` |
| Atributo | elipse unida a su entidad/relación | `Nombre`, `Salario`, `Stock`, `Precio` |
| Identificador (clave) | atributo **subrayado** | `DNI`, `matrícula`, `código`, `ISBN`, `legajo` |
| Cardinalidad | etiqueta $1$, $N$, $M$, $P$ sobre la arista | ver [Cardinalidades](#cardinalidades) |

## Entidades

Una **entidad** representa un objeto del dominio con existencia propia (una persona, un
artículo, un préstamo). Se dibuja como un rectángulo con el nombre adentro. En los ejemplos
aparecen entidades como `Empleado`, `Artículo`, `Proveedor`, `Préstamo`, `Cliente`,
`Modelo`, `Técnico` o `Alumno`.

## Atributos

Los **atributos** son las propiedades de una entidad (o de una relación). Se dibujan como
elipses colgando del rectángulo (o del rombo). Los apuntes usan varias clases:

- **Atributo identificador (clave).** Se marca **subrayado**: distingue unívocamente a cada
  instancia. Ejemplos: `DNI` de un paciente, `matrícula` de un doctor, `código` de un
  artículo o préstamo, `ISBN` de una publicación, `legajo` de un alumno o técnico.
- **Atributo común.** El resto de las propiedades, sin subrayar: `Salario`, `Stock`,
  `Descripción`, `Dirección`, `Teléfono`, `Nombre`.
- **Atributo de relación.** Cuelga del rombo, no de una entidad (ver
  [Atributos de relación](#atributos-de-relacion)).
- **Atributo derivado.** Un valor que se calcula a partir de otros. En el enunciado de la
  universidad (Ej9) el **monto total** de un proyecto es *la suma de todos sus presupuestos
  parciales*: no se almacena, se deriva.

## Relaciones

Una **relación** vincula dos o más entidades y se dibuja como un rombo con el nombre del
vínculo. En los ejemplos: `Departamento` **tiene** `Empleado`, `Proveedor` **Provee**
`Artículo`, `Cliente` es quien recibe un préstamo mediante **Otorga**, `Avión` **ES** de un
`Modelo`.

El **grado** de una relación es la cantidad de entidades que conecta:

- **Binaria** (grado 2): la mayoría. `Auto`–`Modelo`; `Libro` **Escribe** `Autor`.
- **Ternaria** (grado 3): `Proveedor` **Suministra** `Pieza` y `Proyecto` — un mismo rombo
  toca tres rectángulos.
- **De grado mayor**: en la prescripción médica (Ej2a) el rombo `es_recetado` conecta
  `doctor`, `paciente`, `prescripción` y `droga`.

## Cardinalidades

Cada arista que une una entidad con una relación lleva una **etiqueta de cardinalidad**. En
la notación de los apuntes la etiqueta se ubica **del lado de su entidad** e indica cuántas
instancias de esa entidad participan en una ocurrencia de la relación. Se usan:

- $1$ — a lo sumo una instancia.
- $N$, $M$, $P$ — muchas instancias (se usan letras distintas para cardinalidades de
  relaciones distintas dentro del mismo diagrama).

Las combinaciones binarias que aparecen:

| Tipo | Ejemplo del diagrama | Lectura |
|---|---|---|
| $1$ : $N$ | `Departamento` $1$ — **tiene** — $N$ `Empleado` | un departamento tiene muchos empleados; cada empleado, un solo departamento |
| $1$ : $N$ | `Modelo` $1$ — **ES** — $N$ `Avión` | un avión responde a un modelo; un modelo, muchos aviones |
| $N$ : $M$ | `Artículo` $N$ — **Provee** — $M$ `Proveedor` | un artículo lo proveen varios proveedores y viceversa |
| $1$ : $1$ | `Departamento` $1$ — **tiene** — $1$ `Jefe` | cada departamento tiene un único jefe |

**Observación.** La etiqueta se lee sobre la propia entidad: en `Departamento` $1$ — $N$
`Empleado`, el $N$ colgado de `Empleado` significa "hay $N$ empleados por departamento" y el
$1$ colgado de `Departamento` significa "hay $1$ departamento por empleado".

## Atributos de relación

Cuando una propiedad no pertenece a ninguna entidad sino al **hecho de estar relacionadas**,
se cuelga del rombo. Casos de los apuntes:

- `Precio`: en `Artículo` $N$ — **Provee** — $M$ `Proveedor`, el precio depende del par
  (artículo, proveedor), porque un mismo artículo puede ofrecerse a distintos precios según
  el proveedor.
- `Cantidad`: en `Artículo` — **Contiene** — `orden de compra`, la cantidad pedida es del
  ítem dentro de esa orden.
- `Año`: en `Alumno` — **Inscribe** — `Curso`, el año identifica cada inscripción.
- El **detalle** y la **fecha** de una reparación cuelgan del rombo `Arreglo` que vincula
  `Avión` con `Técnico` (Ej7).

## Jerarquías de especialización (ISA)

Los apuntes usan una **jerarquía** (relación *is-a*) para modelar que una entidad es un caso
particular de otra. Se dibuja con una **flecha hueca** que apunta de la subentidad hacia la
entidad general. En la tienda (Ej4), `Jefe` es un `Empleado` particular:

- todo `Jefe` **es un** `Empleado` (hereda `Nombre` y `Salario`),
- pero solo uno de los empleados de cada departamento cumple ese rol.

## Entidades débiles

Una **entidad débil** no puede identificarse por sí sola: depende de otra entidad (la
**fuerte**) a través de una **relación identificadora**, que los apuntes dibujan con un
**rombo de doble borde**. Caso del banco (Ej6):

- `Pago` (las cuotas de un préstamo) es débil: una cuota solo tiene sentido asociada a su
  `Préstamo`.
- La relación identificadora es **Pactado en**, entre `Pago` y `Préstamo`.
- El **número de pago** identifica a la cuota **dentro** de un préstamo (identificador
  parcial), no de forma global.

---

## Ver también

- [[02-ejercicios-der]] — los DER completos de tienda, banco, aeropuerto y universidad resueltos paso a paso

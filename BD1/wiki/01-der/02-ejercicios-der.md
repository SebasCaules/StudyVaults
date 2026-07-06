---
tags: [resuelto, unidad-1, entidad-relacion, modelado, cardinalidades, entidades-debiles]
fuente: raw/practicas/der-practica.pdf
unidad: 1
tipo: resuelto
actualizado: 2026-07-05
---

# Ejercicios de modelado E/R

Ejercicios de la práctica de la cursada 2025-2C: pasar de un enunciado en prosa a un
diagrama entidad-relación. Cada caso ejercita un elemento distinto del modelo (ver
[[01-modelo-entidad-relacion]]): cardinalidades, atributos de relación, jerarquías y
entidades débiles.

## Completar cardinalidades

> **Ejercicio (Ej2).** Completar cada relación con la cardinalidad correcta según el
> enunciado.

**a) Prescripción médica.** La relación modela la prescripción (por ejemplo, una toma cada
6 hs) que un médico hace a su paciente sobre cierta droga. Las entidades y sus claves son
`doctor` (`matrícula`), `paciente` (`DNI`), `droga` (`código`) y `prescripción`
(clave `código`, con el atributo `detalle`), todas unidas por el rombo `es_recetado`. Las cardinalidades
dibujadas:

| Entidad | Cardinalidad en `es_recetado` |
|---|---|
| `doctor` | $N$ |
| `paciente` | $N$ |
| `droga` | $M$ |
| `prescripción` | $1$ |

**b) Publicaciones científicas.** Cada publicación puede ser revisada por hasta 3 personas
antes de publicarse. Dos relaciones binarias:

- `corrector` (`DNI`, `nombre`) $M$ — **revisa** — $N$ `publicación` (`ISBN`, `Título`).
- `publicación` $P$ — **escrita_por** — $N$ `autor` (`DNI`, `nombre`).

## Tienda virtual (tipo Amazon)

> **Ejercicio (Ej4).** Diagrama E/R extendido de una tienda por internet con estos
> requerimientos: muchos departamentos identificados por nombre; cada departamento con
> muchos empleados y uno solo de ellos su jefe; empleados identificados por nombre, con
> salario, cada uno en un solo departamento; artículos identificados por código, con
> descripción y stock, provistos por un solo departamento pero muchos por departamento;
> proveedores identificados por nombre, con dirección, que ofrecen muchos artículos a un
> precio, y un artículo puede tener varios proveedores (a distintos precios); si un
> proveedor deja de ofrecer artículos, sus datos igual se conservan.

Entidades, atributos y vínculos:

| Entidad | Atributos | Relación | Cardinalidad |
|---|---|---|---|
| `Departamento` | `Nombre` (clave) | **tiene** `Empleado` | $1$ : $N$ |
| `Empleado` | `Nombre` (clave), `Salario` | — | — |
| `Jefe` | *(hereda de `Empleado`)* | **tiene** `Departamento` | $1$ : $1$ |
| `Artículo` | `Código` (clave), `Descripción`, `Stock` | `Departamento` **Provee** `Artículo` | $1$ : $N$ |
| `Proveedor` | `Nombre` (clave), `Dirección` | `Artículo` **Provee** `Proveedor` | $N$ : $M$ |

Puntos de modelado:

- **Jerarquía ISA:** `Jefe` es un `Empleado` (flecha hueca hacia `Empleado`); solo un
  empleado por departamento cumple ese rol.
- **Atributo de relación:** `Precio` cuelga del rombo `Provee` entre `Artículo` y
  `Proveedor`, porque el precio depende del par artículo-proveedor.
- Cuidar de **no confundir** los dos usos de "provee": `Departamento`–`Artículo` ($1$:$N$)
  vs. `Artículo`–`Proveedor` ($N$:$M$).

## Órdenes de compra

> **Ejercicio (Ej5).** Al modelo de la tienda se le agrega: recibe solicitudes de órdenes
> de compra, con un código que las identifica, fecha de solicitud, lugar de entrega y los
> ítems solicitados, cada uno con su cantidad.

Se extiende el DER anterior con una entidad y una relación:

- `orden de compra`: `Código` (clave), `fecha`, `dirección de entrega`.
- `Artículo` $M$ — **Contiene** — $N$ `orden de compra`.
- La **cantidad** requerida de cada ítem es un **atributo de la relación** `Contiene`.

El inciso b) es de criterio: discutir si la información alcanza para una orden de compra
real y qué otros datos convendría agregar.

## Banco: préstamos y cuotas

> **Ejercicio (Ej6).** Base de datos de un sector de un banco: se ofrecen préstamos
> individuales a los clientes sin límite de cantidad; cada préstamo se identifica por un
> código, con importe otorgado y fecha de firma, y puede devolverse en varias cuotas, cada
> una con fecha, importe a devolver y número de pago; los clientes se identifican por
> código, con nombre, dirección, DNI y teléfono.

Diagrama:

- `Cliente` (`Código` clave, `Nombre`, `Dirección`, `DNI`, `Teléfono`) $1$ — **Otorga** —
  $N$ `Préstamo`: un cliente puede tener muchos préstamos.
- `Préstamo`: `Código` (clave), `Importe`, `Fecha`.
- `Pago` (las cuotas): `Importe`, `Fecha`, `Nro` de pago.

**Entidad débil.** `Pago` es débil respecto de `Préstamo`: una cuota no existe sin su
préstamo. La relación identificadora es **Pactado en** ($N$ pagos : $1$ préstamo), dibujada
con rombo de doble borde; el `Nro` de pago identifica la cuota solo dentro de su préstamo.

## Aeropuerto

> **Ejercicio (Ej7).** Base de datos de un aeropuerto: cada avión se identifica por un
> código y responde a un modelo (aunque el avión salga de la empresa, sus datos se
> conservan); los modelos se identifican por número, con capacidad y peso (se conservan
> aunque no queden aviones); los técnicos se identifican por legajo, con nombre, dirección,
> teléfono y sueldo (se conservan aunque el técnico deje de trabajar); cada técnico es
> experto en uno o más modelos (los expertos pueden solaparse); al dañarse un avión se
> llama a un técnico especialista y se registra su legajo, el detalle del problema y la
> fecha exacta de la reparación.

Diagrama:

- `Avión` (`Código` clave) $N$ — **ES** — $1$ `Modelo` (`Nro` clave, `Capacidad`, `Peso`).
- `Modelo` $N$ — **Experto** — $M$ `Técnico` (`Legajo` clave, `Nombre`, `Dirección`,
  `Teléfono`, `Sueldo`): un técnico es experto en varios modelos y un modelo tiene varios
  expertos.
- `Avión` — **Arreglo** — `Técnico`: cada reparación registra `Fecha` y `detalle` como
  **atributos de la relación** `Arreglo`.

## Universidad: inscripción a cursos

> **Ejercicio (Ej8).** Esquema E/R de la inscripción de alumnos a cursos: alumnos
> identificados por legajo, con nombre, sexo y nombre de carrera; cursos identificados por
> código, con nombre; los cursos se dictan una vez por año, y al inscribirse se registra
> solo el año; un alumno puede inscribirse más de una vez en un curso siempre que el año
> sea distinto (no dos veces el mismo año).

Diagrama:

- `Alumno` (`Legajo` clave, `Nombre`, `Sexo`, `Nombre carrera`) $N$ — **Inscribe** — $M$
  `Curso` (`Código` clave, `Nombre`).
- El **año** de la inscripción se registra como parte de la relación (etiqueta $P$): al
  poder repetirse la inscripción en años distintos, el `Año` pasa a formar parte de lo que
  identifica cada inscripción.

## Universidad: proyectos de investigación

> **Ejercicio (Ej9).** Esquema E/R de una universidad con proyectos de investigación:
> profesores identificados por código, con nombre y sueldo que depende de los proyectos en
> que participan; la universidad se forma de departamentos, cada uno dirigido por un solo
> profesor (un profesor no dirige varios departamentos), identificados por nombre; los
> profesores pueden trabajar en varios departamentos; participan obligatoriamente de algún
> proyecto registrando las horas invertidas (para liquidar el sueldo); los proyectos se
> identifican por título, pueden pertenecer a varios departamentos, y su presupuesto parcial
> lo aportan los departamentos involucrados, siendo el **monto total** la suma de los
> parciales; cada proyecto tiene un único profesor responsable, que puede dirigir más de
> uno; los alumnos participan de varios proyectos, con un profesor coordinador por cada uno
> (no necesariamente el responsable) y un informe de participación; los alumnos se
> identifican por legajo, con plan y nombre.

> **Nota.** En los apuntes este ejercicio figura **solo con el enunciado, sin el diagrama
> resuelto**. Elementos que el enunciado sugiere modelar: un atributo **derivado** (`monto
> total` = suma de presupuestos parciales), **atributos de relación** (horas invertidas,
> presupuesto parcial, informe), y **dos roles distintos** de un profesor sobre un proyecto
> (dirigir vs. coordinar la participación de un alumno).

---

## Ver también

- [[01-modelo-entidad-relacion]] — notación del DER: entidades, atributos, cardinalidades, jerarquías y entidades débiles

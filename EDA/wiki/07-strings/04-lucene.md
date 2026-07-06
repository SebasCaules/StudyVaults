---
tags: [concepto, unidad-7, strings, lucene, indexado, tokenizacion]
fuente: apuntes de la cursada 2024-2C (teórica, Práctico 21/8)
unidad: 7
tipo: concepto
actualizado: 2026-07-05
---

# Lucene: documentos, campos y términos

**Lucene** es una biblioteca de indexado y búsqueda de texto. En la cursada se ven sus tres
unidades básicas de datos —documento, campo y término—, que definen cómo se organiza el texto
para poder buscarlo.

## Documento

> **Definición.** Un documento Lucene es una secuencia de **campos** (*fields*). A cada
> documento se le asocia un identificador (*docId*).

## Campo (*field*)

> **Definición.** Un campo es un **nombre** más una secuencia de muchos **términos**. La
> información contenida en el campo se puede **tokenizar**.

La tokenización es el paso que parte el contenido del campo en los términos que después se
indexan; se conecta con las técnicas de *string matching* vistas en
[[07-strings/02-string-matching-q-grams|Q-grams]].

## Término

> **Definición.** Un término es una secuencia de **bytes**.

---

## Ver también

- [[07-strings/02-string-matching-q-grams]] — tokenización y similaridad entre strings
- [[07-strings/03-kmp-tabla-de-fallos]] — búsqueda exacta de patrones en texto

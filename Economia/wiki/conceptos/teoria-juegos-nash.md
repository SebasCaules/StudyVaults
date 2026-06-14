---
tags: [unit-04, micro]
---

## Definición

**Teoría de juegos:** marco para analizar decisiones de agentes con **interdependencia estratégica** — cuando el resultado para cada uno depende de lo que hagan los demás. Se aplica a oligopolio, negociación, regulación, votaciones.

**Equilibrio de Nash:** combinación de estrategias en la que **ninguna firma (jugador) puede mejorar cambiando unilateralmente su estrategia**, dado lo que hacen las demás. Es un punto de **estabilidad estratégica**.

## Forma matricial — el dilema del prisionero (caso emblemático)

Dos firmas eligen entre **Cooperar** (mantener precio alto, replicar monopolio) o **Desviarse** (bajar precio, capturar mercado).

Pagos (firma fila, firma columna):

| | Coop. | Desv. |
|---|---|---|
| **Coop.** | (10, 10) | (2, 15) |
| **Desv.** | (15, 2) | (5, 5) |

**Análisis:**
- Si la otra coopera, conviene **desviarse** (15 > 10).
- Si la otra se desvía, conviene **desviarse** (5 > 2).
- "Desviarse" es **estrategia dominante** para ambas.
- **Equilibrio de Nash: (Desv., Desv.) → (5, 5).**

Pero (Coop., Coop.) → (10, 10) sería **mejor para ambas**. El equilibrio de Nash *no es eficiente*. Esa tensión es el corazón del dilema.

## Intuición / Por qué importa

Explica por qué los **cárteles tienden a romperse**: aunque a todas les convendría cooperar, cada una tiene incentivo individual a trampear. Sin mecanismos de sanción ([[cartel|cárteles]] reales con monitoreo y castigo), el equilibrio competitivo (o casi-competitivo) emerge.

**Aplicaciones cotidianas:**
- Carrera armamentista entre países.
- Publicidad en oligopolio (todas gastan más sin ganar cuota).
- Acuerdos OPEP de cuotas de producción.
- Pago de impuestos en sociedades con baja fiscalización.

## Ejemplo numérico

Dos países deciden si poner aranceles:

| | No aranc. | Aranc. |
|---|---|---|
| **No aranc.** | (5, 5) | (-1, 6) |
| **Aranc.** | (6, -1) | (1, 1) |

Equilibrio de Nash: ambos ponen aranceles → (1, 1). Pero ambos ganarían más con (No, No) → (5, 5). De ahí la importancia de tratados internacionales (mecanismo de enforcement).

## Errores comunes / Distinciones

- **Asumir que el Nash siempre es eficiente.** No: el dilema del prisionero es justo el caso donde **no lo es**.
- **Pensar que "estrategia dominante" y "Nash" son lo mismo.** Si todos tienen estrategia dominante, hay un Nash único. Pero hay Nash sin estrategias dominantes.
- **Confundir cooperación con altruismo.** En el dilema, "cooperar" significa elegir la opción que beneficia colectivamente; el incentivo individual va para el otro lado.

## Relacionado con
- [[oligopolio]]
- [[cartel]]
- [[estructuras-mercado]]

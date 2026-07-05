---
tags: [teoria, unidad-9, termodinamica, calorimetria, calor-latente, cambio-de-fase]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Temperatura, calor y calorimetría

La termodinámica estudia cómo los sistemas intercambian energía con su entorno. Esta primera
página cubre las nociones de base: qué es un sistema, la ley cero, la transferencia de calor por
diferencia de temperatura, el calor específico y el calor latente de los cambios de fase. Los
[[02-procesos-termicos|procesos térmicos]] (dilatación y conducción) y las
[[03-primera-ley-gases-ideales|leyes de la termodinámica]] se tratan en páginas aparte.

## Sistema y entorno

Todo sistema puede intercambiar con el exterior tres cosas: **materia**, **energía** e
**información**. El conjunto sistema + entorno se llama **universo**. Según qué se intercambie, los
sistemas se clasifican en:

| Tipo de sistema | Intercambia con el exterior |
|---|---|
| Abierto | Energía y materia |
| Cerrado | Energía, pero no materia |
| Aislado | Nada |

**Observación.** Siempre que se realiza cualquier intercambio, el sistema manifiesta un cambio en
su estado.

## Ley cero de la termodinámica

> **Ley cero.** Si un sistema $C$ está en equilibrio térmico con $A$ y con $B$, entonces $A$ y $B$
> están en equilibrio entre ellos. Dos sistemas están en equilibrio térmico si y solo si tienen la
> misma temperatura.

Esta ley es la que da sentido a la propia noción de temperatura: es la magnitud que comparten dos
sistemas cuando dejan de intercambiar calor entre sí.

## Calor y flujo de calor

La transferencia de energía que se da **exclusivamente por una diferencia de temperatura** se
denomina **flujo de calor**; la energía así transferida se llama **calor** ($Q$).

## Calor específico y capacidad calorífica

El **calor específico** $c$ es la cantidad de calor que debe suministrarse a una unidad de masa
para que suba su temperatura en una unidad:

$$c = \frac{1}{m}\,\frac{dQ}{dT}$$

donde $m$ es la masa y $dQ$ el calor suministrado. De ahí, el **calor intercambiado** para llevar
una masa $m$ de una temperatura a otra es

$$Q = m\,c\,\Delta T$$

con $\Delta T$ la variación de temperatura. Se define además la **capacidad calorífica**
$C = m\,c$, propia del cuerpo entero (no por unidad de masa).

Las unidades habituales:

$$[Q] = \text{cal} = \text{J} = \text{l}\cdot\text{atm}, \qquad [c] = \frac{\text{cal}}{\text{g}\cdot{}^\circ\text{C}} = \frac{\text{cal}}{\text{g}\cdot\text{K}}$$

**Nota.** Si en lugar de la masa $m$ se usa el número de moles $n$, se habla de **calor específico
molar** y las unidades pasan a ser por mol.

### Calor específico a presión y a volumen constante

Las mediciones en sólidos suelen hacerse a presión atmosférica constante; los valores
correspondientes se llaman calor específico $c_p$ y capacidad calorífica $C_p$ **a presión
constante**. En el caso de un gas suele ser más fácil mantener la sustancia en un recipiente con
volumen constante; los valores correspondientes son $c_v$ y $C_v$ **a volumen constante**. Para
una sustancia dada, $c_p$ y $c_v$ son **diferentes** (ver [[03-primera-ley-gases-ideales]]).

## Calor latente

Durante un **cambio de fase** la temperatura permanece constante: todo el calor que entra o sale
se invierte en la transición, no en variar $T$. La energía requerida por una sustancia para
cambiar de fase se describe con el **calor latente** $L$:

$$L = \pm\frac{Q}{m} \qquad\Longrightarrow\qquad Q = \pm\,m\,L$$

donde $m$ es la masa que cambia de fase. Se distinguen:

- $L_f$: **calor de fusión** (sólido ↔ líquido).
- $L_v$: **calor de vaporización** (líquido ↔ gas).

El signo sigue la convención de calor:

- $Q > 0$: el sistema **recibe** calor.
- $Q < 0$: el sistema **pierde** calor.

### Curva de calentamiento $T$–$Q$

Al entregar calor de forma sostenida a una sustancia, la temperatura sube en tramos inclinados
(donde vale $Q = mc\,\Delta T$) intercalados con **mesetas horizontales** en los cambios de fase
(donde vale $Q = \pm mL$ y $T$ no cambia):

- Tramo inclinado sobre la **fase sólida** → $T$ sube hasta la temperatura de fusión.
- **Meseta de fusión** a temperatura constante (sólido → líquido).
- Tramo inclinado sobre la **fase líquida** → $T$ sube hasta la temperatura de ebullición.
- **Meseta de ebullición** a temperatura constante (líquido → gas).
- Tramo inclinado sobre la **fase gaseosa**.

Cada tramo inclinado usa el $c$ de la fase correspondiente; cada meseta consume $m\,L$ sin variar
la temperatura. Este perfil es la clave de los problemas de **mezclas con cambio de fase** (por
ejemplo, hielo + agua + vapor), donde el equilibrio térmico puede caer sobre una meseta.

---

## Ver también

- [[02-procesos-termicos]] — dilatación, esfuerzo térmico y conducción del calor
- [[03-primera-ley-gases-ideales]] — primera ley, gas ideal y calores específicos $c_v$, $c_p$
- [[04-segunda-ley-entropia]] — segunda ley, máquinas térmicas y entropía

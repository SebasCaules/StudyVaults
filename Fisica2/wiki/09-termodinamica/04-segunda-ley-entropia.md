---
tags: [teoria, unidad-9, termodinamica, segunda-ley, maquinas-termicas, carnot, entropia]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Segunda ley, máquinas térmicas y entropía

La primera ley dice que la energía se conserva, pero no impide procesos que nunca se observan. La
**segunda ley** fija el sentido en que ocurren: el calor fluye espontáneamente de lo caliente a lo
frío, y convertir calor en trabajo tiene un límite. Esta página cubre máquinas térmicas,
refrigeradores, los ciclos de Otto y Carnot, y la **entropía**. Los procesos y el gas ideal se
tratan en [[03-primera-ley-gases-ideales]].

## Segunda ley de la termodinámica

> **Segunda ley.** El calor siempre fluye de un cuerpo caliente a uno frío, **nunca al revés** de
> forma espontánea.

Convertir energía mecánica en calor es **fácil** (por ejemplo, por rozamiento); el proceso inverso,
convertir calor en energía mecánica, solo se logra **parcialmente**. Esa asimetría es el corazón de
la segunda ley y lo que limita el rendimiento de toda máquina.

## Máquinas térmicas

Una **máquina térmica** toma calor de una fuente caliente a temperatura $T_c$, produce trabajo y
descarga el resto en una fuente fría a temperatura $T_f$. Con la convención de signos:

$$Q_c = |Q_c| > 0, \qquad Q_f = -|Q_f| < 0, \qquad W = |W| > 0$$

El calor neto en el ciclo es $Q = Q_c + Q_f = |Q_c| - |Q_f|$, y como en un ciclo $\Delta U = 0$, por
la primera ley el trabajo neto es

$$W = |Q_c| - |Q_f|$$

Se define la **eficiencia térmica** $e$ como la fracción del calor absorbido que se convierte en
trabajo:

$$e = \frac{W}{Q_c} = \frac{Q_c + Q_f}{Q_c} = 1 + \frac{Q_f}{Q_c} \qquad\Longrightarrow\qquad e = 1 - \frac{|Q_f|}{|Q_c|}, \quad 0 < e < 1$$

donde $|Q_c|$ es el calor tomado de la fuente caliente y $|Q_f|$ el descargado en la fría.

## Refrigeradores

Un **refrigerador** es una máquina térmica que funciona al revés: usando trabajo externo, extrae
calor de la fuente fría y lo entrega a la caliente. Los signos se invierten:

$$Q_c = -|Q_c| < 0, \qquad Q_f = |Q_f| > 0, \qquad W = -|W| < 0$$

El calor neto es $Q = Q_c + Q_f = -|Q_c| + |Q_f|$, y por la primera ley ($Q = W$ en el ciclo) se
obtiene el balance

$$|Q_c| = |W| + |Q_f|$$

Su desempeño se mide con el **coeficiente de rendimiento** $K$ (cuanto mayor, más eficiente el
refrigerador):

$$K = \frac{|Q_f|}{|W|} = \frac{|Q_f|}{|Q_c| - |Q_f|}, \qquad 0 < K$$

donde $|Q_f|$ es el calor extraído de la fuente fría y $|W|$ el trabajo aportado.

## Ciclo Otto (motor de 4 tiempos)

El ciclo Otto modela el motor a explosión de cuatro tiempos:

1. Una mezcla aire–gasolina entra al cilindro.
2. Se **comprime adiabáticamente** y se enciende.
3. Al quemarse la gasolina se **agrega calor** al sistema, produciendo una **explosión adiabática**.
4. Se **enfría** el gas hasta la temperatura del aire exterior, expulsando el calor.

## Ciclo de Carnot

El **ciclo de Carnot** es el de máxima eficiencia posible entre dos fuentes a $T_c$ y $T_f$. Su
eficiencia y su coeficiente de rendimiento dependen **solo de las temperaturas** de las fuentes:

$$e_{Carnot} = 1 - \frac{T_f}{T_c}, \qquad K_{Carnot} = \frac{T_f}{T_c - T_f}$$

donde $T_c$ y $T_f$ son las temperaturas **absolutas** de las fuentes caliente y fría. Ninguna
máquina real puede superar $e_{Carnot}$: si un enunciado propone una con $e > e_{Carnot}$ (o un
refrigerador con $K > K_{Carnot}$), es imposible.

## Entropía

La **entropía** $S$ es una función de estado que cuantifica la irreversibilidad. Su cambio
infinitesimal en un proceso **reversible** es

$$dS = \frac{\delta Q_{rev}}{T} \qquad\Longrightarrow\qquad \Delta S = \int_i^f \frac{\delta Q_{rev}}{T}$$

donde $\delta Q_{rev}$ es el calor intercambiado de forma reversible y $T$ la temperatura absoluta.
Para un proceso **cualquiera** vale la desigualdad

$$\Delta S \geq \int_i^f \frac{\delta Q}{T}$$

> **Principio de crecimiento de la entropía.** En cualquier proceso, la entropía del universo
> (sistema + entorno) no decrece:
> $$\Delta S_{univ} = \Delta S_{sist} + \Delta S_{ent} \geq 0$$
> La igualdad vale solo para procesos reversibles; todo proceso irreversible la aumenta.

### Entropía en procesos cíclicos

Como $S$ es función de estado, al cerrar un ciclo la entropía del sistema no cambia:

$$\Delta S_{sist} = 0$$

La del entorno, en cambio, depende de los calores intercambiados con las fuentes:

$$\Delta S_{ent} = -\frac{|Q_c|}{T_c} + \frac{|Q_f|}{T_f} \quad (\text{máquina térmica}), \qquad \Delta S_{ent} = \frac{|Q_c|}{T_c} - \frac{|Q_f|}{T_f} \quad (\text{refrigerador})$$

### Cambio de entropía por tipo de proceso

Para un gas ideal, el cambio de entropía en cada proceso:

| Proceso | $\Delta S$ |
|---|---|
| Isotérmico | $n\,R\,\ln\!\left(\dfrac{V_f}{V_i}\right)$ |
| Isocórico | $n\,c_v\,\ln\!\left(\dfrac{T_f}{T_i}\right)$ |
| Isobárico | $n\,c_p\,\ln\!\left(\dfrac{T_f}{T_i}\right)$ |
| Adiabático reversible | $0$ |
| Cambio de fase | $\pm\dfrac{m\,L}{T}$ |

Para un cambio general entre dos estados se combinan los términos de temperatura y volumen:

$$\Delta S = n\,c_v\,\ln\!\left(\frac{T_f}{T_i}\right) + n\,R\,\ln\!\left(\frac{V_f}{V_i}\right)$$

donde $n$ son los moles, $c_v$ el calor específico a volumen constante, $T$ la temperatura
absoluta, $V$ el volumen, $m$ la masa que cambia de fase y $L$ su calor latente.

**Nota.** Una adiabática **reversible** tiene $\Delta S = 0$ (es isoentrópica); una adiabática
**irreversible** tiene $\Delta S > 0$ aunque no intercambie calor.

---

## Ver también

- [[03-primera-ley-gases-ideales]] — primera ley, gas ideal y los cuatro procesos
- [[01-calorimetria]] — calor latente $L$, usado en la entropía de cambio de fase
- [[02-procesos-termicos]] — dilatación, esfuerzo térmico y conducción

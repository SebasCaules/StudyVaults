---
tags: [resuelto, unidad-7, momento-angular, guia-7]
fuente: raw/practicas/fisica1-2023-2c.pdf
unidad: 7
tipo: resuelto
actualizado: 2026-07-05
---

# Ejercicios resueltos — Guía 7 (Momento angular)

Selección de la Guía 7 tal como está resuelta en los apuntes de la cursada
2023-2C. Los ejercicios ilustran los tres usos del momento angular: fuerza central,
cambio de momento de inercia y choques contra una barra con pivote. La teoría de
apoyo está en [[01-momento-angular]] y [[02-colisiones-con-pivote]].

## 7.1 — Fuerza central (órbita)

Una masa recorre una órbita con un foco fijo en $O$. Como la fuerza es central, su
torque respecto de $O$ es nulo y el momento angular se conserva entre dos puntos de
la órbita a distancias $r_1$ y $r_2$:

$$r_1\, m v_1 = r_2\, m v_2 \;\Rightarrow\; \frac{v_2}{v_1} = \frac{r_1}{r_2}$$

La velocidad es mayor donde el radio es menor (más cerca del foco).

## 7.2 — Objeto que cae sobre un sistema que gira

Un sistema con momento de inercia $I_o$ gira con velocidad angular $\omega_0$
cuando un objeto de masa $M$ queda fijo a distancia $R$ del eje. No hay torque
externo respecto del eje, así que $L_o$ se conserva. El momento de inercia pasa de
$I_o$ a $I_o + MR^2$:

$$I_o\, \omega_0 = \big(I_o + MR^2\big)\, \omega' \;\Rightarrow\; \omega' = \frac{I_o\, \omega_0}{I_o + MR^2}$$

Al aumentar la inercia, la velocidad angular disminuye.

## 7.3 — Proyectil contra barra, choque plástico

Una barra de masa $M$ y largo $\ell$ cuelga de un pivote en su extremo superior. Un
proyectil de masa $m$ y velocidad $v_0$ impacta a distancia $d$ (dato $d = 0{,}8\,\ell$)
y **queda incrustado**. La barra sube hasta $\theta_{max} = 90^\circ$. Se busca $v_0$.

El momento de inercia de la barra respecto del pivote es $I_o = \tfrac{1}{3}M\ell^2$
y el del conjunto barra + proyectil es $I' = m d^2 + \tfrac{1}{3}M\ell^2$.

**Paso 1 — momento angular en el choque.** Se conserva $L_o$; con $v' = \omega d$:

$$m v_0\, d = \left(m d^2 + \frac{1}{3} M\ell^2\right)\omega = I'\, \omega \qquad (1)$$

**Paso 2 — conservación de energía después del choque.** El sistema sube: el centro
de masa de la barra asciende $\ell/2$ y el proyectil asciende $d$ (para
$\theta_{max} = 90^\circ$). La energía cinética rotacional se convierte en potencial:

$$\frac{1}{2} I'\, \omega^2 = M g\frac{\ell}{2} + m g\, d \;\Rightarrow\; \omega^2 = \frac{M g\ell + 2 m g\, d}{I'} \qquad (2)$$

**Cierre.** Elevando (1) al cuadrado y usando (2):

$$(m v_0\, d)^2 = I'^2\, \omega^2 = I'\,\big(M g\ell + 2 m g\, d\big) \;\Rightarrow\; v_0 = \sqrt{\frac{I'\,\big(M g\ell + 2 m g\, d\big)}{(m d)^2}}$$

## 7.4 — Proyectil contra barra, choque elástico

Misma configuración que 7.3 pero con **choque elástico**, con datos
$\theta = 180^\circ$, $\ell = 2{,}4\,\text{m}$, $d = 2\,\text{m}$, $g = 10\,\text{m/s}^2$
y $M = 5m$. Ahora se conservan $L_o$ y $K$.

De la relación elástica $v_0 + v' = \omega d$ (1) y de la conservación de $L_o$,
$m(v_0 - v')\,d = \tfrac{1}{3}M\ell^2\,\omega$, se despeja
$v_0 - v' = \dfrac{M\ell^2\,\omega}{3 m d}$ (2). Sumando (1) y (2):

$$2 v_0 = \omega\left(\frac{M\ell^2}{3 m d} + d\right) \;\Rightarrow\; v_0 = 3{,}4\,m\,\omega \qquad (3)$$

Luego, por conservación de energía después del choque (la barra sube hasta
$\theta = 180^\circ$, el centro de masa asciende $\ell$):

$$\frac{1}{3} M\ell^2\, \omega^2 = 2 M g\ell \;\Rightarrow\; \ell\, \omega^2 = 6 g \;\Rightarrow\; \omega = \sqrt{\frac{6 g}{\ell}} = 5\,\frac{\text{rad}}{\text{s}}$$

y reemplazando en (3) se obtiene $v_0 = 17\,\text{m/s}$.

## 7.6 — Radio variable sobre plataforma (fuerza central)

Una masa gira sobre una plataforma atada a un hilo que se acorta el radio de $r_0$
a $r_f$. La tensión es central, así que $L_o$ se conserva: $r_0\, m v_0 = r_f\, m v_f$.
Comparando la fuerza centrípeta antes y después, $t_0 = m\dfrac{v_0^2}{r_0}$ y
$t_f = m\dfrac{v_f^2}{r_f}$, el cociente resulta

$$\frac{t_0}{t_f} = \left(\frac{v_0}{v_f}\right)^2 \frac{r_f}{r_0} = \left(\frac{r_f}{r_0}\right)^3 = \frac{1}{8}$$

para $r_f/r_0 = 1/2$.

## 7.7 — Trabajo del hilo al acortar el radio

Mismo montaje que 7.6 con $m = 0{,}05\,\text{kg}$, $R_i = 0{,}3\,\text{m}$,
$R_f = 0{,}1\,\text{m}$ y $v_0 = 1{,}5\,\text{m/s}$. Por conservación de $L_o$,
$v_f = \dfrac{R_0\, v_0}{R_f} = 4{,}5\,\text{m/s}$. El trabajo del hilo es la variación
de energía cinética:

$$W_t = \frac{1}{2} m\big(v_f^2 - v_0^2\big) = 0{,}45\,\text{J}$$

El trabajo es positivo: al tirar del hilo hacia el centro se le entrega energía a la
masa (la fuerza tiene componente en la dirección del movimiento radial).

## Otros ejercicios de la guía

- **7.5** — Barra con pivote impactada por una partícula ($\theta = 60^\circ$): se
  combinan tres planteos (energía de la partícula tras el choque, energía de la
  barra, momento angular en el impacto) y se cierra con la ecuación de $e$; el
  resultado que figura es $e = \tfrac{1}{9}$.
- **7.8** — Barra en cruz impactada por un proyectil ($v_0 = 350\,\text{m/s}$,
  $m = 0{,}03\,\text{kg}$, $M = 8\,\text{kg}$), choque plástico: momento angular en el
  choque ($\omega \approx 6{,}56\,\text{rad/s}$) y luego energía para el ángulo
  máximo, que da $\theta_{max} \approx 55{,}3^\circ$.

---

## Ver también

- [[01-momento-angular]] — conservación de $\vec{L}$ y fuerzas centrales
- [[02-colisiones-con-pivote]] — método de los choques plástico y elástico contra la barra

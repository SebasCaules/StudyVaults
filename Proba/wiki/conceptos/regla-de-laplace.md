---
titulo: Regla de Laplace
tipo: concepto
unidad: 2
tags: [probabilidad, laplace, conteo]
fuentes: ["[[regla-de-laplace-slides]]"]
actualizado: 2026-06-06
---

# Regla de Laplace

**En breve.** Cuando todos los resultados pesan lo mismo, la probabilidad de un evento
es simplemente "casos favorables sobre casos posibles": calcular probabilidades se
vuelve un problema de **contar** ([[tecnica-conteo-combinatoria|combinatoria]]).

Cuando el [[espacio-muestral-y-eventos|espacio muestral]] $S$ es **finito** y todos
los resultados son **igualmente probables** (equiprobables):
$$ P(A) = \frac{\text{casos favorables}}{\text{casos posibles}} = \frac{|A|}{|S|}. $$
Calcular probabilidades se reduce a **contar** → ver [[tecnica-conteo-combinatoria]].

**Intuición.** Si las $|S|$ caras del experimento son indistinguibles en cuanto a su
chance, cada una vale $1/|S|$; un evento con $|A|$ de esas caras acumula $|A|/|S|$. Es
la probabilidad como "fracción del universo ocupada por $A$" — la misma imagen de área
de los [[axiomas-de-probabilidad|axiomas]], pero con todos los puntos del mismo tamaño.

> ⚠️ Solo vale si los casos son **equiprobables**. Si no lo son, hay que volver a
> los [[axiomas-de-probabilidad|axiomas]].

## Ejercicio resuelto
*Hallar la probabilidad de que la suma sea 8 al tirar un dado dos veces.*

- **Casos posibles**: $6\times 6 = 36$ (principio de multiplicación).
- **Casos favorables** (suma $=8$): $\{(2,6),(3,5),(4,4),(5,3),(6,2)\}$ → $5$.
$$ P(\text{suma}=8) = \frac{5}{36}. $$

> **Cuidado:** El error más común al aplicar Laplace es tomar como equiprobables resultados que *parecen* serlo pero no lo son. Ejemplo: en un juego con un mazo de $5$ cartas (con reposición) gano solo si las dos cartas extraídas son iguales. Uno tiende a decir "hay dos resultados, ganar o perder, así que $P(\text{ganar}) = 1/2$". Es incorrecto: ganar y perder no tienen la misma chance. Los resultados equiprobables son los **pares ordenados** de cartas — hay $25$, cada uno con probabilidad $1/25$ — y ganar abarca solo los $5$ pares iguales, así que $P(\text{ganar}) = 5/25 = 1/5$. Antes de aplicar Laplace, identificá cuál es el espacio muestral cuyos elementos son efectivamente indistinguibles por azar.

> **Cuidado:** Al contar casos favorables con el principio de multiplicación, las ramas deben corresponder a eventos **mutuamente excluyentes**; si no, se cuentan casos por duplicado. Ejemplo: para "el máximo de dos cartas extraídas (sin reposición, mazo de $5$, $20$ pares ordenados) es $\geq 4$", uno razonaría: "elijo una carta de $\{4,5\}$ ($2$ opciones) y cualquiera de las $4$ restantes ($4$ opciones), total $2 \times 4 = 8$". Pero el par formado por el $4$ y el $5$ se cuenta dos veces (con el $4$ elegido primero y con el $5$ elegido primero), así que $8$ sobrecuenta. Lo seguro es usar el complemento: $P(\max \geq 4) = 1 - P(\text{ambas} < 4) = 1 - \frac{3 \cdot 2}{20} = \frac{7}{10}$.

## Relación
Es el origen *frecuentista/combinatorio* de la [[probabilidad|probabilidad]]; los
[[axiomas-de-probabilidad|axiomas de Kolmogorov]] la generalizan a casos no
equiprobables y a $S$ infinitos. Para contar los casos, ver
[[tecnica-conteo-combinatoria]].

> **Observación.** Contar con orden o sin orden da el **mismo resultado numérico**, siempre que se use el mismo criterio en numerador y denominador. Por ejemplo, al extraer $2$ cartas de $5$ sin reposición: con orden hay $5 \times 4 = 20$ casos totales; sin orden hay $\binom{5}{2} = 10$. Si un evento tiene $6$ casos con orden y $3$ sin orden, entonces $6/20 = 3/10$ en ambos enfoques. Esto ocurre porque las $k!$ permutaciones de cada subconjunto de tamaño $k$ se cancelan entre numerador y denominador. Lo incorrecto es mezclar criterios: contar el numerador sin orden y el denominador con orden, o viceversa.

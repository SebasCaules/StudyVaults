---
tipo: herramienta
tags:
- python
- postproc
actualizado: 2026-05-06
---

# Matplotlib (postproc de gráficos)

El grupo usa Python + matplotlib para los gráficos. En TP3 está integrado al pipeline (`postprocess/plotter.py`).

## Plantillas útiles

### Curva con barras de error

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.errorbar(N_arr, J_mean, yerr=J_std, fmt='o', capsize=4, label='⟨J⟩')
ax.set_xlabel('N')
ax.set_ylabel(r'$\langle J \rangle$')
ax.legend()
fig.savefig('figures/J_vs_N.png', dpi=200, bbox_inches='tight')
```

### Variable numérica con colorbar (lo que pidió la corrección TP3)

```python
import numpy as np
from matplotlib.cm import viridis
from matplotlib.colors import Normalize
from matplotlib.cm import ScalarMappable

N_values = [50, 100, 200, 400, 800]
norm = Normalize(vmin=min(N_values), vmax=max(N_values))

fig, ax = plt.subplots()
for N in N_values:
    color = viridis(norm(N))
    ax.plot(S, J_in[N], color=color)

sm = ScalarMappable(norm=norm, cmap=viridis)
sm.set_array([])
cbar = fig.colorbar(sm, ax=ax)
cbar.set_label('N')
ax.set_xlabel('S [m]')
ax.set_ylabel(r'$J_{in}(S)$')
```

⚠️ NO usar leyenda categórica con un valor por curva cuando la variable es numérica continua. Corrección explícita TP3.

### Escala log-log y semi-log

```python
ax.set_xscale('log')
ax.set_yscale('log')      # log-log: ley de potencia → recta
# o
ax.set_yscale('log')      # semi-log: exponencial → recta
```

### Doble eje y

```python
ax2 = ax.twinx()
ax2.plot(N, rho, 'r-', label='rho')
ax2.set_ylabel('rho', color='r')
```

## Buenas prácticas

- `dpi=200` o más para entregar.
- `bbox_inches='tight'` recorta márgenes.
- Títulos en figuras (corrección TP2: "las figuras llevan títulos" — al menos label de ejes claros + caption en la presentación).
- Una figura por archivo PNG. No mezclar varios subplots si pueden ir separados.
- `r'$...$'` para LaTeX inline (símbolos griegos, subíndices).

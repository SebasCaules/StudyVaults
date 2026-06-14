---
tipo: fuente
archivo: "raw/enunciados/TP4_enunciado.pdf"
fecha_publicacion: 2026-04-27
tags:
- tp4
- dinamica-molecular
- paso-temporal
actualizado: 2026-05-06
---

# Fuente — Enunciado TP4

📄 `raw/enunciados/TP4_enunciado.pdf` (4 páginas)

## Resumen

Resolver dos sistemas con **DM regida por paso temporal** (dt fijo).

### Sistema 1 — Oscilador puntual amortiguado

Sistema con **solución analítica** para evaluar integradores. Usar parámetros y CI de **diapositiva 36 de la teórica**.

Items:
- 1.1: integrar con Gear orden 5, Beeman, Verlet original, Euler.
- 1.2: graficar analítica + numérica, calcular ECM.
- 1.3: ECM vs dt en log-log. ¿Cuál es mejor?

⚠️ En la presentación: solo **resultados**, ~2 diapositivas, < 1 minuto, **antes** del Sistema 2. Nada de intro/integradores/animaciones/conclusiones aquí.

### Sistema 2 — Scanning rate (continuación del TP3 con DM-paso-temporal)

Mismo sistema físico que TP3, pero con **fuerza elástica blanda** entre partículas:

```
Fᵢⱼ = -k · ξ · eᵢⱼ        si ξ > 0
ξ = rᵢ + rⱼ - |xᵢ - xⱼ|
k_ref = 10³ N/m
```

Items:
- 1.1: tiempo de ejecución vs N para tf=500s. **Comparar con TP3**.
- 1.2: Cfc(t) → J. **Solo el primer dt del contacto cuenta** (los contactos duran muchos dt). Guardar Cfc con resolución dt. **Comparar con TP3**.
- 1.3: perfiles radiales (igual que TP3 1.4) con paleta gradual + **colorbar**. Detalle en S∈[1.5, 5]m. Promediar capas cercanas al obstáculo. **Comparar Jᵢₙ con TP3**.
- 1.4: variar k = {10², 10³, 10⁴, (10⁵)}. Validar dt en cada caso. Comparar ⟨J⟩(N) y ⟨Jᵢₙ|S~2⟩(N). Identificar escalar característico vs k.
- 1.5 (opcional): tiempo de la primera partícula usada en alcanzar el borde, en función de k y N.

⚠️ Para todos: validar dt graficando **energía total**.

## Entregables

- Presentación oral 13 min con animaciones **embebidas** (sin link en oral).
- PDF de la presentación (con frame + link YouTube/Vimeo).
- Código zip **< 100 KB**, solo motor.
- **No hay informe** explícito.

**Fecha de entrega**: 18/05/2026, 10 hs.

## Páginas que toca

- [[tps/TP4]]
- [[conceptos/integradores]]
- [[conceptos/oscilador_amortiguado]]
- [[conceptos/dinamica_molecular_paso_temporal]]
- [[conceptos/fuerza_elastica_blanda]]
- [[conceptos/scanning_rate]]
- [[conceptos/perfiles_radiales]]

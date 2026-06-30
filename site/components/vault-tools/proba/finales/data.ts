/* ============================================================================
 * Banco de finales — agregador. Reúne los batches de ejercicios (transcriptos
 * fielmente de las resoluciones de la cátedra) y los ítems de verdadero/falso.
 * Los archivos ex-*.ts y tf.ts se generan/verifican por separado.
 * ========================================================================== */

import type { Exercise, TFItem } from "./types";
import { EX_PROB_A } from "./ex-prob-a";
import { EX_PROB_B } from "./ex-prob-b";
import { EX_EST_A } from "./ex-est-a";
import { EX_EST_B } from "./ex-est-b";
import { TF_ITEMS as TF } from "./tf";

/** Todos los ejercicios del banco, ordenados por su ordinal global. */
export const EXERCISES: Exercise[] = [
  ...EX_PROB_A,
  ...EX_PROB_B,
  ...EX_EST_A,
  ...EX_EST_B,
].sort((a, b) => a.num - b.num);

export const TF_ITEMS: TFItem[] = TF;

/**
 * Chequeos de consistencia entre respuestas de una misma prueba.
 *
 * Se ejecutan al pulsar "Siguiente" en la página que contiene alguna de las
 * preguntas de `runOn`. Si detectan algo atípico, se muestra un aviso con la
 * opción de corregir o de confirmar la respuesta: nunca bloquean, porque hay
 * casos reales poco comunes (p. ej. quien trabaja de noche).
 */

export interface CheckContext {
  /** Respuesta en texto (time_input, numeric, open_text) por `code`. */
  text: (code: string) => string | null;
  /** Etiqueta de la opción elegida (preguntas de opción) por `code`. */
  optionLabel: (code: string) => string | null;
  /** `questionOptionId` de la opción con esa etiqueta, para correcciones rápidas. */
  optionIdByLabel: (code: string, label: string) => string | null;
}

export interface IssueAction {
  label: string;
  /** Pregunta a la que se lleva al usuario; si se omite, se queda en la página actual. */
  goToCode?: string;
}

export interface ConsistencyIssue {
  title: string;
  message: string;
  /** Datos que originan el aviso, mostrados como resumen. */
  details?: { label: string; value: string }[];
  /** Corrección de un clic sugerida (p. ej. invertir AM/PM). Valores por `code`. */
  quickFix?: { label: string; answers: Record<string, string> };
  /** Acciones de "Corregir". */
  corrections: IssueAction[];
  /**
   * Identifica los valores que dispararon el aviso. Si el usuario confirma y
   * luego cambia las respuestas, el aviso vuelve a evaluarse.
   */
  signature: string;
}

export interface ConsistencyCheck {
  id: string;
  /** Códigos de pregunta cuya página dispara el chequeo. */
  runOn: string[];
  check: (ctx: CheckContext) => ConsistencyIssue | null;
}

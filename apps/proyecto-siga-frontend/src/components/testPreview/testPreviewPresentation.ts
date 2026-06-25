import { List, Clock, Calendar, LucideIcon } from 'lucide-react';

/**
 * Presentación de la metadata de la vista previa de prueba (TestPreview).
 *
 * El backend aporta los datos de dominio (testCode, title, description, questions).
 * La duración estimada y la condición de "fecha límite" son datos de presentación
 * que se resuelven aquí, keyed por `testCode`, de forma análoga a
 * `landingCardPresentation.ts` pero desacoplada de la landing pública.
 *
 * El número de preguntas mostrado prioriza el conteo real de preguntas; el
 * `questionCount` definido aquí actúa como respaldo y referencia de verificación.
 *
 * Un `testCode` desconocido degrada con un fallback genérico sin romper el render.
 */

export type TestPreviewPresentation = {
  questionCount: number;
  durationLabel: string;
  hasDueDate: boolean;
};

export const NO_DUE_DATE_LABEL = 'Sin fecha límite';

const PRESENTATION_BY_TEST_CODE: Record<string, TestPreviewPresentation> = {
  EPWORTH: { questionCount: 8, durationLabel: '3-5 min', hasDueDate: false },
  HAD: { questionCount: 14, durationLabel: '3-5 min', hasDueDate: false },
  'DASS-21': { questionCount: 21, durationLabel: '5-10 min', hasDueDate: false },
  PSQI: { questionCount: 25, durationLabel: '5-10 min', hasDueDate: false },
  MUNICH: { questionCount: 15, durationLabel: '5-10 min', hasDueDate: false },
};

const FALLBACK_PRESENTATION: TestPreviewPresentation = {
  questionCount: 0,
  durationLabel: '~5 min',
  hasDueDate: false,
};

/**
 * Resuelve la presentación de metadata para un `testCode`.
 * Normaliza a mayúsculas y degrada a un fallback seguro si el código es desconocido.
 */
export function getTestPreviewMetadata(testCode: string): TestPreviewPresentation {
  return PRESENTATION_BY_TEST_CODE[testCode.toUpperCase()] ?? FALLBACK_PRESENTATION;
}

export type TestPreviewMetadataItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

/**
 * Construye los ítems de metadata que consume el componente TestPreview a partir
 * de la presentación resuelta, el conteo real de preguntas y la fecha límite.
 *
 * - preguntas: usa el conteo real cuando está disponible; si no, el respaldo.
 * - duración: rango de la presentación.
 * - fecha límite: "Sin fecha límite" cuando la prueba no tiene plazo; en caso
 *   contrario, la fecha formateada provista por el llamador.
 */
export function buildTestPreviewMetadataItems(
  presentation: TestPreviewPresentation,
  realQuestionCount: number,
  formattedDueDate?: string | null,
): TestPreviewMetadataItem[] {
  const questionCount = realQuestionCount > 0 ? realQuestionCount : presentation.questionCount;
  const dueDateValue =
    presentation.hasDueDate && formattedDueDate ? formattedDueDate : NO_DUE_DATE_LABEL;

  return [
    { icon: List, value: String(questionCount), label: 'preguntas' },
    { icon: Clock, value: presentation.durationLabel, label: 'duración' },
    { icon: Calendar, value: dueDateValue, label: 'fecha límite' },
  ];
}

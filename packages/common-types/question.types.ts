import { QuestionOption } from "./questionsOptions.types";

export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'open_text' | 'numeric' | 'time_input';

export const OPTION_BASED_TYPES = new Set<QuestionType>(['single_choice', 'multiple_choice', 'likert']);

export const isTextBasedAnswer = (questionType?: string): boolean =>
  !OPTION_BASED_TYPES.has(questionType as QuestionType);

// `section` marca el inicio de una nueva sección del cuestionario: se dibuja
// como cabecera destacada de la tarjeta para que el cambio no pase desapercibido.
export type NoticeVariant = 'info' | 'warning' | 'section';

export interface QuestionNotice {
    text: string;
    variant?: NoticeVariant;
    // Título corto mostrado en grande (p. ej. el nombre de la sección).
    title?: string;
    // Etiqueta pequeña sobre el título (por defecto "Sección" en la variante `section`).
    label?: string;
}

export interface QuestionMetadata {
    // Agrupación en bloque (consumido por GroupedBlockRenderer vía useTestNavigation)
    group?: string;
    groupHeader?: string;

    // Pregunta de seguimiento: se muestra en la misma página que la pregunta
    // con este `code`, debajo de ella, sin numeración propia y sin diseño en bloque.
    followUpOf?: string;

    // Aviso/instrucción mostrado sobre el prompt de una pregunta individual,
    // independiente de la agrupación en bloque.
    notice?: QuestionNotice;

    // Configuración de time_input
    inputFormat?: '12h' | '24h';
    validHours?: { min: number; max: number };
    validMinutes?: { min: number; max: number };
    amPmRequired?: boolean;

    // Captura de duración en una pregunta `numeric`: en lugar de un campo libre
    // se muestran selectores de horas y minutos (evita valores como "430").
    // La respuesta se guarda en horas decimales (p. ej. "7.5").
    durationInput?: { maxHours: number; minuteStep: number };
}

export type QuestionCondition =
  // Forma clásica: se muestra salvo que la opción elegida en `dependsOn`
  // tenga la etiqueta `showWhenNot`.
  | { dependsOn: string; showWhenNot: string }
  // Se muestra cuando en CUALQUIERA de las preguntas de `anyOf` la opción
  // marcada tenga un `value` numérico mayor o igual a `showWhenValueAtLeast`.
  // (Se usa `value` porque el `scoreValue` no se expone al frontend.)
  | { anyOf: string[]; showWhenValueAtLeast: number };

export interface Question {
    questionId: string;
    code?: string;
    prompt?: string;
    questionType?: QuestionType;
    required?: boolean;
    condition?: QuestionCondition | null;
    metadata?: QuestionMetadata | null;
    questionOption: QuestionOption[];
}


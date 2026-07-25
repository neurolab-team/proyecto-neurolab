import { QuestionOption } from "./questionsOptions.types";

export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'open_text' | 'numeric' | 'time_input';

export const OPTION_BASED_TYPES = new Set<QuestionType>(['single_choice', 'multiple_choice', 'likert']);

export const isTextBasedAnswer = (questionType?: string): boolean =>
  !OPTION_BASED_TYPES.has(questionType as QuestionType);

export type NoticeVariant = 'info' | 'warning';

export interface QuestionNotice {
    text: string;
    variant?: NoticeVariant;
}

export interface QuestionMetadata {
    // Agrupación en bloque (consumido por GroupedBlockRenderer vía useTestNavigation)
    group?: string;
    groupHeader?: string;

    // Aviso/instrucción mostrado sobre el prompt de una pregunta individual,
    // independiente de la agrupación en bloque.
    notice?: QuestionNotice;

    // Configuración de time_input
    inputFormat?: '12h' | '24h';
    validHours?: { min: number; max: number };
    validMinutes?: { min: number; max: number };
    amPmRequired?: boolean;
}

export interface Question {
    questionId: string;
    code?: string;
    prompt?: string;
    questionType?: QuestionType;
    required?: boolean;
    condition?: { dependsOn: string; showWhenNot: string } | null;
    metadata?: QuestionMetadata | null;
    questionOption: QuestionOption[];
}


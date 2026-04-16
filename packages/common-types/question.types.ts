import { QuestionOption } from "./questionsOptions.types";

export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'open_text' | 'numeric' | 'time_input';

export const OPTION_BASED_TYPES = new Set<QuestionType>(['single_choice', 'multiple_choice', 'likert']);

export const isTextBasedAnswer = (questionType?: string): boolean =>
  !OPTION_BASED_TYPES.has(questionType as QuestionType);

export interface Question {
    questionId: string;
    code?: string;
    prompt?: string;
    questionType?: QuestionType;
    required?: boolean;
    condition?: { dependsOn: string; showWhenNot: string } | null;
    metadata?: { group?: string; groupHeader?: string } | null;
    questionOption: QuestionOption[];
}


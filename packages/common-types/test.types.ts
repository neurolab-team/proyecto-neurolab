import { QuestionType } from "./question.types";

export interface PrismaQuestion {
    questionId: string;
    code?: string | null;
    prompt: string;
    type: QuestionType;
    required: boolean;
    metadata?: Record<string, unknown> | null;
    condition?: Record<string, unknown> | null;
    questionOption: {
        questionOptionId: string;
        label: string;
        value?: string | null;
        scoreValue?: unknown;
    }[];
}

export interface TestWithQuestions {
    testId: string;
    title: string;
    testCode?: string | null;
    questions: PrismaQuestion[];
}

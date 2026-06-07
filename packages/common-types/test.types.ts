import { QuestionType } from "./question.types";

export interface PrismaQuestion {
    questionId: string;
    code?: string | null;
    prompt: string;
    type: QuestionType;
    required: boolean;
    metadata?: string | null;
    condition?: string | null;
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
    description?: string | null;
    testCode?: string | null;
    questions: PrismaQuestion[];
}

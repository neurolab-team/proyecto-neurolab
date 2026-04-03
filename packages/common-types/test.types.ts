import { Question } from "./question.types";

export interface TestWithQuestions {
    id: string;
    title: string;
    testCode?: string | null;
    questions: Question[];
}

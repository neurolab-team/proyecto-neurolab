import { Question } from "./question.types";

export interface TestWithQuestions {
    id: string;
    title: string;
    questions: Question[];
}

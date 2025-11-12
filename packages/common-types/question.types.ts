import { QuestionOption } from "./questionsOptions.types";

export interface Question {
    questionId: string;
    code?: string;
    prompt?: string;
    questionOption: QuestionOption[];
}


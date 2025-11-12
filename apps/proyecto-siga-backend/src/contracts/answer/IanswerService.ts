import { Answer,CreateAnswerInput, CreateManyAsnswersInput } from "@packages/common-types/answer.types";

export interface IAnswerService {

    getAnswers(): Promise<Answer[]>;
    getAnswerById(id: string): Promise<Answer | null>;
    getAnswersByAssigmentTest(assigmentId: string): Promise<Answer[]>;
    createAnswer(input: CreateAnswerInput): Promise<Answer>;
    createManyAnswers(input: CreateManyAsnswersInput): Promise<Answer[]>;
    //updateAnswer(id: string, input: UpdateAnswerInput): Promise<Answer>;
    //deleteAnswer(id: string): Promise<void>;
}
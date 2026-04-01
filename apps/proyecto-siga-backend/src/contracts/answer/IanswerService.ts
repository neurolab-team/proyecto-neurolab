import {
  Answer,
  CreateAnswerInput,
  CreateManyAnswersInput,
} from "@packages/common-types/answer.types";
import { AnswerWithDetails } from "./answer.types";

export interface IAnswerService {

    getAnswers(): Promise<Answer[]>;
    getAnswerById(id: string): Promise<Answer | null>;
    getAnswersByAssignmentTest(assignmentId: string): Promise<Answer[]>;
    createAnswer(input: CreateAnswerInput): Promise<Answer>;
    createManyAnswers(input: CreateManyAnswersInput): Promise<Answer[]>;
    getAnswersByAssignmentTestWithDetails(assignmentId: string): Promise<AnswerWithDetails[]>;
    //updateAnswer(id: string, input: UpdateAnswerInput): Promise<Answer>;
    //deleteAnswer(id: string): Promise<void>;
}

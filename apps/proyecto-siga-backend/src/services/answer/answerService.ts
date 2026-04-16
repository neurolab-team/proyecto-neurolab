import { inject, injectable } from "tsyringe";
import { IAnswerService } from "../../contracts/answer/IanswerService";
import {
  Answer,
  CreateAnswerInput,
  CreateManyAnswersInput,
} from "@packages/common-types/answer.types";
import { IAnswerRepo } from "../../contracts/answer/IanswerRepo";
import { AnswerWithDetails } from "../../contracts/answer/answer.types";

@injectable()
export class AnswerService implements IAnswerService {
  constructor(
    @inject("AnswerRepo")
    private readonly answerRepo: IAnswerRepo,
  ) {}

  async getAnswers(): Promise<Answer[]> {
    return this.answerRepo.findMany() as Promise<Answer[]>;
  }

  async getAnswerById(id: string): Promise<Answer | null> {
    return this.answerRepo.findById(id) as Promise<Answer | null>;
  }

  async getAnswersByAssignmentTest(assignmentId: string): Promise<Answer[]> {
    return this.answerRepo.findByAssignmentTest(assignmentId) as Promise<
      Answer[]
    >;
  }

  async createAnswer(input: CreateAnswerInput): Promise<Answer> {
    const answer = await this.answerRepo.create({
      assignment: {
        connect: { assignmentId: input.assignmentId },
      },
      question: {
        connect: { questionId: input.questionId },
      },
      ...(input.questionOptionId && {
        option: {
          connect: { questionOptionId: input.questionOptionId }
        }
      }),
      ...(input.textValue !== undefined && { textValue: input.textValue }),
    });
    return answer as Answer;
  }

  async createManyAnswers(input:CreateManyAnswersInput): Promise<Answer[]>{
    
    const answersData = input.answers.map(answerData => ({
    assignmentId: input.assignmentId,
    questionId: answerData.questionId,
    questionOptionId: answerData.questionOptionId,
    textValue: answerData.textValue,
  }));
  // Bulk insert using answerRepo.createMany (assumed to exist)
  const createdAnswers = await this.answerRepo.createMany(answersData);
  return createdAnswers as Answer[];
   
  }

  getAnswersByAssignmentTestWithDetails(
    assignmentId: string,
  ): Promise<AnswerWithDetails[]> {
    return this.answerRepo.findByAssignmentTestWithDetails(
      assignmentId,
    ) as Promise<AnswerWithDetails[]>;
  }
}

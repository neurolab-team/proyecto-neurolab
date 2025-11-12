import { inject, injectable } from "tsyringe";
import {
  IAnswerService,
} from "../../contracts/answer/IanswerService";
import {Answer, CreateAnswerInput, CreateManyAsnswersInput} from "@packages/common-types/answer.types";
//import prisma from "@packages/libs/prisma";
//import { BadRequest, NotFound } from "../../utils/httpError";
import { IAnswerRepo} from "../../contracts/answer/IanswerRepo";


@injectable()
export class AnswerService implements IAnswerService {
  constructor(
    @inject("AnswerRepo")
    private readonly answerRepo: IAnswerRepo
  ) {}

  async getAnswers(): Promise<Answer[]> {
    return this.answerRepo.findMany() as Promise<Answer[]>;
  }

  async getAnswerById(id: string):Promise<Answer | null> {
    return this.answerRepo.findById(id) as Promise<Answer | null>;
  }

  async getAnswersByAssigmentTest(assigmentId: string): Promise<Answer[]> {
    return this.answerRepo.findByAssigmentTest(assigmentId) as Promise<Answer[]>;
  }

  async createAnswer(input: CreateAnswerInput): Promise<Answer> {
    const answer=await this.answerRepo.create({
      assignment: {
        connect: { assignmentId: input.assignmentId }
      },
      question: {
        connect: { questionId: input.questionId }
      },
      ...(input.questionOptionId && {
        option: {
          connect: { questionOptionId: input.questionOptionId }
        }
      }),
         numericAnswer: input.numericAnswer
    });
    return answer as Answer;
  }

  async createManyAnswers(input:CreateManyAsnswersInput): Promise<Answer[]>{
    const createdAnswers:Answer[]=[];

      for (const answerData of input.answers) {
        const answer = await this.answerRepo.create({
          assignment: {
        connect: { assignmentId: input.assignmentId }
      },
      question: {
        connect: { questionId: answerData.questionId }
      },
      ...(answerData.questionOptionId && {
        option: {
          connect: { questionOptionId: answerData.questionOptionId }
        }
      }),
         numericAnswer: answerData.numericAnswer
        });
         createdAnswers.push({
          ...answer as Answer
        });
    }
    return createdAnswers;
  }


}

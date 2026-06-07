import { Prisma, answer } from "@packages/libs/prisma";
import prisma from "@packages/libs/prisma";
import { IAnswerRepo } from "../contracts/answer/IanswerRepo";
import { AnswerWithDetails, DetailedAnswer } from "../contracts/answer/answer.types";

export class AnswerRepository implements IAnswerRepo {
  async findById(id: string, tx = prisma): Promise<answer | null> {
    return tx.answer.findUnique({ where: { answerId: id } });
  }

  async findMany(tx = prisma): Promise<answer[]> {
    return tx.answer.findMany({ orderBy: { assignmentId: "desc" } });
  }
  async findByAssignmentTest(
    assignmentId: string,
    tx = prisma,
  ): Promise<answer[]> {
    return tx.answer.findMany({ where: { assignmentId } });
  }
  async create(data: Prisma.answerCreateInput, tx = prisma): Promise<answer> {
    return tx.answer.create({ data });
  }

  async createMany(
    data: Prisma.answerCreateManyInput[],
    tx = prisma,
  ): Promise<answer[]> {
    return Promise.all(
      data.map((item) => tx.answer.create({ data: item as unknown as Prisma.answerCreateInput })),
    );
  }
  async findByAssignmentTestWithDetails(
    assignmentId: string,
    tx = prisma,
  ): Promise<AnswerWithDetails[]> {
    return tx.answer.findMany({
      where: { assignmentId },
      select: {
        textValue: true,
        question: {
          select: {
            code: true,
            section: {
              select: {
                name: true,
              },
            },
          },
        },
        option: {
          select: {
            scoreValue: true,
          },
        },
      },
      orderBy: {
        question: {
          section: {
            name: "asc",
          },
        },
      },
    });
  }

  async findDetailedByAssignment(
    assignmentId: string,
    tx = prisma,
  ): Promise<DetailedAnswer[]> {
    return tx.answer.findMany({
      where: { assignmentId },
      select: {
        textValue: true,
        question: {
          select: {
            prompt: true,
            code: true,
            section: { select: { name: true } },
          },
        },
        option: {
          select: { label: true },
        },
      },
      orderBy: {
        question: { section: { name: "asc" } },
      },
    });
  }
}

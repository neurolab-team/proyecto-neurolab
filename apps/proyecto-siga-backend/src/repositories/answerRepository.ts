import { Prisma, answer } from "@prisma/client";
import prisma from "@packages/libs/prisma";
import { IAnswerRepo } from "../contracts/answer/IanswerRepo";
//import { AnswerWithDetails } from "@packages/common-types/answer.types";

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
    return tx.answer.createManyAndReturn({
      data: data,
      skipDuplicates: false,
    });
  }
  // async findByAssignmentTestWithDetails(
  //   assigmentId: string,
  //   tx = prisma,
  // ): Promise<answer[]> {
  //   return tx.answer.findMany({
  //     where: { assignmentId: assigmentId },
  //     include: {
  //       question: {
  //         include: {
  //           section: true,

  //         },
  //       },
  //       option: true,
  //     },
  //   });
  // }
  async findByAssignmentTestWithDetails(
    assignmentId: string,
    tx = prisma,
  ): Promise<any[]> {
    return tx.answer.findMany({
      where: { assignmentId },
      select: {
        question: {
          select: {
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
      },orderBy: {
        question: {
          section: {
            name: 'asc'
          }
        }
      }
    });
  }
}

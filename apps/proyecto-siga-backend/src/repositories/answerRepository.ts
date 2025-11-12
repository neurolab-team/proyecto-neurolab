import { Prisma, answer } from '@prisma/client'
import prisma from '@packages/libs/prisma'
import { IAnswerRepo } from '../contracts/answer/IanswerRepo'

export class AnswerRepository implements IAnswerRepo {
 async findById(id: string, tx = prisma): Promise<answer | null> {
    return tx.answer.findUnique({ where: { answerId: id } })
  }
  
  async findMany(tx = prisma): Promise<answer[]> {
    return tx.answer.findMany({orderBy: { assignmentId: 'desc' } })
  }
  async findByAssigmentTest(assigmentId: string, tx = prisma): Promise<answer[]> {
    return tx.answer.findMany({ where: { assignmentId:assigmentId},orderBy:{questionId: 'asc'} })
  }
    async create(data: Prisma.answerCreateInput, tx = prisma): Promise<answer> {
        return tx.answer.create({ data })
    }


}
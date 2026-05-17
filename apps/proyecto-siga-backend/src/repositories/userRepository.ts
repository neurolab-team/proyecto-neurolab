import { Prisma, user } from '@packages/libs/prisma'
import prisma from '@packages/libs/prisma'
import { IUserRepo, PsychologistLoadRecord } from '../contracts/user/IuserRepo' 

export class UserRepository implements IUserRepo {
  async findById(id: string, tx = prisma): Promise<user | null> {
    return tx.user.findUnique({ where: { userId: id } })
  }

  async findByEmail(email: string, tx = prisma): Promise<user | null> {
    return tx.user.findUnique({ where: { email } })
  }

  async findMany(tx = prisma): Promise<user[]> {
    return tx.user.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async create(data: Prisma.userCreateInput, tx = prisma): Promise<user> {
    return tx.user.create({ data })
  }

  async update(id: string, data: Prisma.userUpdateInput, tx = prisma): Promise<user> {
    return tx.user.update({ where: { userId: id }, data })
  }

  async findManyWithPsychologist(tx = prisma) {
    return tx.user.findMany({
      include: {
        assignedPsychologist: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findAssignedStudentsByPsychologistId(psychologistId: string, tx = prisma) {
    return tx.user.findMany({
      where: {
        role: 'user',
        assignedPsychologistId: psychologistId,
      },
      include: {
        assignedPsychologist: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        assignmentsTo: {
          include: {
            test: {
              select: {
                testId: true,
                title: true,
                description: true,
              },
            },
            score: true,
            answers: {
              select: {
                textValue: true,
                question: {
                  select: {
                    code: true,
                    prompt: true,
                  },
                },
                option: {
                  select: {
                    label: true,
                    value: true,
                    scoreValue: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findAssignedStudentById(psychologistId: string, studentId: string, tx = prisma) {
    return tx.user.findFirst({
      where: {
        userId: studentId,
        role: 'user',
        assignedPsychologistId: psychologistId,
      },
      include: {
        assignedPsychologist: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        assignmentsTo: {
          include: {
            test: {
              select: {
                testId: true,
                title: true,
                description: true,
              },
            },
            score: true,
            answers: {
              select: {
                textValue: true,
                question: {
                  select: {
                    code: true,
                    prompt: true,
                  },
                },
                option: {
                  select: {
                    label: true,
                    value: true,
                    scoreValue: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async findActivePsychologistsWithStudentsCount(tx = prisma): Promise<PsychologistLoadRecord[]> {
    const psychologists = await tx.user.findMany({
      where: {
        role: 'psychologist',
        isActive: true,
      },
      select: {
        userId: true,
        createdAt: true,
        _count: {
          select: {
            assignedStudents: true,
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    })

    return psychologists
      .map((psychologist) => ({
        userId: psychologist.userId,
        createdAt: psychologist.createdAt,
        studentsCount: psychologist._count.assignedStudents,
      }))
      .sort((left, right) => {
        if (left.studentsCount !== right.studentsCount) {
          return left.studentsCount - right.studentsCount
        }
        return left.createdAt.getTime() - right.createdAt.getTime()
      })
  }

  async delete(id: string, tx = prisma): Promise<void> {
    await tx.user.delete({ where: { userId: id } })
  }

  async count(where: Prisma.userWhereInput, tx = prisma): Promise<number> {
    return tx.user.count({ where })
  }
}

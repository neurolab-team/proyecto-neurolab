import { Prisma, user } from "@packages/libs/prisma";

export type UserWithAssignedPsychologistRecord = Prisma.userGetPayload<{
  include: {
    assignedPsychologist: {
      select: {
        userId: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type AssignedStudentRecord = Prisma.userGetPayload<{
  include: {
    assignedPsychologist: {
      select: {
        userId: true;
        name: true;
        email: true;
      };
    };
    assignmentsTo: {
      include: {
        test: {
          select: {
            testId: true;
            title: true;
            description: true;
          };
        };
        score: true;
        answers: {
          select: {
            textValue: true;
            question: {
              select: {
                code: true;
                prompt: true;
              };
            };
            option: {
              select: {
                label: true;
                value: true;
                scoreValue: true;
              };
            };
          };
        };
      };
    };
  };
}>; 

export type PsychologistLoadRecord = {
  userId: string;
  createdAt: Date;
  studentsCount: number;
};

export interface IUserRepo {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<user | null>;
  findByEmail(
    email: string,
    tx?: Prisma.TransactionClient
  ): Promise<user | null>;
  findMany(tx?: Prisma.TransactionClient): Promise<user[]>;
  create(
    data: Prisma.userCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<user>;
  update(
    id: string,
    data: Prisma.userUpdateInput,
    tx?: Prisma.TransactionClient
  ): Promise<user>;
  findManyWithPsychologist(
    tx?: Prisma.TransactionClient
  ): Promise<UserWithAssignedPsychologistRecord[]>;
  findAssignedStudentsByPsychologistId(
    psychologistId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AssignedStudentRecord[]>;
  findAssignedStudentById(
    psychologistId: string,
    studentId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AssignedStudentRecord | null>;
  findActivePsychologistsWithStudentsCount(
    tx?: Prisma.TransactionClient,
  ): Promise<PsychologistLoadRecord[]>;
  findFirstAdminId(tx?: Prisma.TransactionClient): Promise<string | null>;
  delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
  count(
    where: Prisma.userWhereInput,
    tx?: Prisma.TransactionClient
  ): Promise<number>;
}

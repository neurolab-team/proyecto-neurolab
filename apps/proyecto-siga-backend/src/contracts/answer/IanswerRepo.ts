import {Prisma,answer} from "@prisma/client";


export interface IAnswerRepo {
    findById(id: string, tx?: Prisma.TransactionClient): Promise<answer | null>;
    findMany(tx?: Prisma.TransactionClient): Promise<answer[]>;
    findByAssignmentTest(
        assignmentId: string,
        tx?:Prisma.TransactionClient
    ): Promise<answer[]>;
    create(
        data: Prisma.answerCreateInput,
        tx?: Prisma.TransactionClient
    ): Promise<answer>;
    createMany(
        data: Prisma.answerCreateManyInput[],
        tx?: Prisma.TransactionClient
    ):Promise<answer[]>;

    // update(
    //     id: string,
    //     data: Prisma.answerUpdateInput,
    //     tx?: Prisma.TransactionClient
    // ): Promise<answer>;
    // delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
    // count(
    //     where:Prisma.answerWhereInput,
    //     tx?: Prisma.TransactionClient
    // ): Promise<number>;


}
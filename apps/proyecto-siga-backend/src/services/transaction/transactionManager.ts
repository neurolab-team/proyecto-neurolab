import { injectable } from "tsyringe";
import { Prisma } from "@packages/libs/prisma";
import prisma from "@packages/libs/prisma";

@injectable()
export class TransactionManager {
  run<T>(
    handler: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<T> {
    return prisma.$transaction(handler, options);
  }
}

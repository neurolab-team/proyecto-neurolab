import { PrismaClient, Prisma } from "@prisma/generated";
import { PrismaMssql } from "@prisma/adapter-mssql";

export { Prisma };
export type { user, test, testSection, question, questionOption, assignment, answer, assignmentScore, studyConsent } from "@prisma/generated";

declare global {
  namespace globalThis {
    var prismadb: InstanceType<typeof PrismaClient>;
  }
}

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = globalThis.prismadb || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prismadb = prisma;

export default prisma;

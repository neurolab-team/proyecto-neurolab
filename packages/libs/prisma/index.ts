import { PrismaClient, Prisma } from "@prisma/generated";
import { PrismaPg } from "@prisma/adapter-pg";

export { Prisma };
export type { user, test, testSection, question, questionOption, assignment, answer, assignmentScore } from "@prisma/generated";

declare global {
  namespace globalThis {
    var prismadb: InstanceType<typeof PrismaClient>;
  }
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = globalThis.prismadb || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prismadb = prisma;

export default prisma;

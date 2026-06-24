import { injectable } from "tsyringe";
import { ITestRepo } from "../contracts/test/ItestRepo";
import prisma from "@packages/libs/prisma";
import { TestWithQuestions } from "@packages/common-types/test.types";
import { PublicTestCard } from "@packages/common-types/test.types";
import { PsychologistAssignableTest } from "@packages/common-types/assignment.types";
@injectable()
export class TestRepository implements ITestRepo {
  async getTestWithQuestionsById(
    testId: string,
  ): Promise<TestWithQuestions | null> {
    const testData = await prisma.test.findUnique({
      where: { testId: testId },
      select: {
        testId: true,
        title: true,
        description: true,
        testCode: true,
        questions: {
          orderBy: { code: "desc" },
          include: {
            questionOption: {
              orderBy: { value: "asc" },
            },
          },
        },
      },
    });
    return testData as TestWithQuestions | null;
  }

  async getPsychologistAssignableTests(): Promise<PsychologistAssignableTest[]> {
    return prisma.test.findMany({
      select: {
        testId: true,
        title: true,
      },
      where: {
        isPublished: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  }

  async getPublicLandingTests(): Promise<PublicTestCard[]> {
    const tests = await prisma.test.findMany({
      where: {
        audience: "user",
        isPublished: true,
        testCode: { not: null },
      },
      select: {
        testId: true,
        testCode: true,
        title: true,
        description: true,
        audience: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    // testCode no es nulo por el filtro `testCode: { not: null }`; audience es "user" por el filtro.
    return tests.map((test) => ({
      testId: test.testId,
      testCode: test.testCode as string,
      title: test.title,
      description: test.description,
      audience: "user" as const,
    }));
  }

  async existsById(testId: string): Promise<boolean> {
    const result = await prisma.test.findUnique({
      where: { testId },
      select: { testId: true },
    });
    return Boolean(result);
  }
}

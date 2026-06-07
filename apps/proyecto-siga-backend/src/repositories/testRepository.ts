import { injectable } from "tsyringe";
import { ITestRepo } from "../contracts/test/ItestRepo";
import prisma from "@packages/libs/prisma";
import { TestWithQuestions } from "@packages/common-types/test.types";
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

  async existsById(testId: string): Promise<boolean> {
    const result = await prisma.test.findUnique({
      where: { testId },
      select: { testId: true },
    });
    return Boolean(result);
  }
}

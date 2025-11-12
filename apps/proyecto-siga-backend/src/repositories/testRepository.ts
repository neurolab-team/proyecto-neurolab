import { injectable } from "tsyringe";
import { ITestRepo } from "../contracts/test/ItestRepo";
import prisma from "@packages/libs/prisma";
import { TestWithQuestions } from "@packages/common-types/test.types";
@injectable()
export class TestRepository implements ITestRepo {
  async getTestWithQuestionsById(
    testId: string,
  ): Promise<TestWithQuestions | null> {
    const testData = await prisma.test.findUnique({
      where: { testId: testId },
      include: {
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
}

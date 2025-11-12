import {TestWithQuestions} from "@packages/common-types/test.types";
export interface ITestRepo {
    getTestWithQuestionsById(testId: string): Promise<TestWithQuestions | null>;
}


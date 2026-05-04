import {TestWithQuestions} from "@packages/common-types/test.types";
import { PsychologistAssignableTest } from "@packages/common-types/assignment.types";
export interface ITestRepo {
    getTestWithQuestionsById(testId: string): Promise<TestWithQuestions | null>;
    getPsychologistAssignableTests(): Promise<PsychologistAssignableTest[]>;
    existsById(testId: string): Promise<boolean>;
}

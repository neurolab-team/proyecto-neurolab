import {TestWithQuestions} from "@packages/common-types/test.types";
import { PublicTestCard } from "@packages/common-types/test.types";
import { PsychologistAssignableTest } from "@packages/common-types/assignment.types";
export interface ITestRepo {
    getTestWithQuestionsById(testId: string): Promise<TestWithQuestions | null>;
    getPsychologistAssignableTests(): Promise<PsychologistAssignableTest[]>;
    getPublicLandingTests(): Promise<PublicTestCard[]>;
    existsById(testId: string): Promise<boolean>;
}

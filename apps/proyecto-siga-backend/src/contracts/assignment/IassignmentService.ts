import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import {
  AssignmentWithTestsDataResponse,
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
  PsychologistAssignableTest,
} from "@packages/common-types/assignment.types";
import { assignment, Prisma } from "@packages/libs/prisma";
import { StudyConsentDecision } from "@packages/common-types/consent.types";
import { AssignmentConsentInput } from "@packages/common-schemas/assignment.schemas";

export interface IAssignmentService {
    getAssignmentById(assignmentId:string): Promise<TestDataResponse | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
    assignInitialTestsToUser(userId:string, tx?:Prisma.TransactionClient): Promise<void>;
    markAssignmentAsCompleted(assignmentId:string): Promise<assignment | null>;
    checkAndTriggerUsabilitySurvey(userId: string): Promise<void>;
    markAssignmentAsReviewed(
      psychologistId: string,
      assignmentId: string,
    ): Promise<assignment | null>;
    submitConsent(
      assignmentId: string,
      userId: string,
      input: AssignmentConsentInput,
    ): Promise<StudyConsentDecision>;
    requireAcceptedConsent(assignmentId: string, userId: string): Promise<void>;
    getPsychologistAssignableTests(): Promise<PsychologistAssignableTest[]>;
    bulkAssignByPsychologist(
      psychologistId: string,
      input: BulkAssignPsychologistTestInput,
    ): Promise<BulkAssignPsychologistTestResult>;
}

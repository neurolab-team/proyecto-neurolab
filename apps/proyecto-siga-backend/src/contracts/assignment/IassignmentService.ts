import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import {
  AssignmentWithTestsDataResponse,
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
  PsychologistAssignableTest,
} from "@packages/common-types/assignment.tyhttps://github.com/neurolab-team/proyecto-neurolab/pull/32/conflict?name=apps%252Fproyecto-siga-backend%252Fsrc%252Fcontracts%252Fassignment%252FIassignmentService.ts&ancestor_oid=1aef3822622a193668337e84b423b5cd2bd75e3d&base_oid=e74d7b5a52902060d74370aab8171964372bfcd7&head_oid=12404d3de6a5585886da763e282a16a8740ca9e3pes";
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

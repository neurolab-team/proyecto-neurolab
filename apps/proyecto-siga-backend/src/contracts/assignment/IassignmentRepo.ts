import { Assignment, AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { PsychologistRecentActivity } from "@packages/common-types/psychologist.types";
import { assignment, Prisma } from "@prisma/client";
import {
  DashboardPriorityCaseRecord,
  DashboardStatsRow,
  PsychologistAssignmentRecord,
} from "./assignment.types";

export interface IAssignmentRepo {
    getAssignmentForId(assignmentId: string): Promise<Assignment | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
    getAssignmentsByPsychologistId(psychologistId: string): Promise<PsychologistAssignmentRecord[]>;
    getDashboardStats(psychologistId: string): Promise<DashboardStatsRow>;
    getDashboardPriorityCases(psychologistId: string): Promise<DashboardPriorityCaseRecord[]>;
    getDashboardRecentActivity(
      psychologistId: string,
    ): Promise<PsychologistRecentActivity[]>;
    getPsychologistAssignmentById(
      psychologistId: string,
      assignmentId: string
    ): Promise<PsychologistAssignmentRecord | null>;
    assignInitialTestsToUser(data:Prisma.assignmentCreateInput, tx?:Prisma.TransactionClient): Promise<assignment>;
    updateAssignmentStatus(assignmentId:string,data:Prisma.assignmentUpdateInput ): Promise<assignment>; // Implementar tx
    getTestCodeByAssignmentId(assignmentId: string): Promise<string | null>;
    markAssignmentAsReviewed(
      assignmentId: string,
      reviewedAt: Date,
      tx?: Prisma.TransactionClient
    ): Promise<assignment>;
}

import { BasicUserReference, UserType } from "./user.types";
import {
  PsychologistCaseStatus,
  PsychologistPriority,
} from "./psychologist-core.types";

export type PsychologistAssignmentResult = {
  totalScore: number | null;
  percentile: number | null;
  interpretation: string | null;
};

export type PsychologistStudentAssignment = {
  assignmentId: string;
  status: string;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  attentionLevel: PsychologistPriority | "none";
  test: {
    testId: string;
    title: string;
    description?: string | null;
  };
  result: PsychologistAssignmentResult | null;
};

export type PsychologistStudentSummary = {
  studentId: string;
  name: string;
  email: string;
  userNumber: string;
  userType: UserType;
  gender?: string | null;
  age: number | null;
  assignedAt: string | null;
  lastActivityAt: string | null;
  followUpAt: string | null;
  caseStatus: PsychologistCaseStatus;
  priority: PsychologistPriority;
  assignedTestsCount: number;
  completedTestsCount: number;
  pendingTestsCount: number;
  latestTestTitle: string | null;
  latestInterpretation: string | null;
  attentionLabel: string;
  hasCriticalResults: boolean;
  hasPendingReview: boolean;
};

export type PsychologistTimelineEvent = {
  date: string;
  label: string;
  type: "case" | "assignment" | "result" | "review" | "follow_up";
};

export type PsychologistStudentProfile = PsychologistStudentSummary & {
  assignedPsychologist: BasicUserReference | null;
  insights: string[];
  assignments: PsychologistStudentAssignment[];
  timeline: PsychologistTimelineEvent[];
};

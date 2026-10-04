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
  semester: string;
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

export type PsychologistResultsStatusFilter =
  | "all"
  | "assigned"
  | "in_progress"
  | "completed"
  | "expired"
  | "pending_review";

export type PsychologistStudentResultsFilters = {
  search?: string;
  testId?: string;
  status?: PsychologistResultsStatusFilter;
  priority?: PsychologistPriority | "all";
  caseStatus?: PsychologistCaseStatus | "all";
  detailLevel?: "assignment" | "question";
  fromDate?: string;
  toDate?: string;
  onlyWithInterpretation?: boolean;
  limit?: number;
};

export type PsychologistFollowUpLevel =
  | "stable"
  | "in_progress"
  | "follow_up"
  | "critical";

export type PsychologistStudentResultExportRow = {
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string;
  userType: UserType;
  semester: string;
  testId: string;
  testTitle: string;
  assignmentStatus: string;
  caseStatus: PsychologistCaseStatus;
  priority: PsychologistPriority;
  attentionLevel: PsychologistPriority | "none";
  assignedAt: string;
  completedAt: string | null;
  reviewedAt: string | null;
  totalScore: number | null;
  percentile: number | null;
  interpretation: string | null;
  followUpScore: number;
  followUpLevel: PsychologistFollowUpLevel;
  followUpReason: string;
  questionCode: string | null;
  questionPrompt: string | null;
  questionOptionLabel: string | null;
  questionOptionValue: string | null;
  questionTextValue: string | null;
  questionScoreValue: number | null;
};

export type PsychologistStudentResultFilterOption = {
  value: string;
  label: string;
  count: number;
};

export type PsychologistStudentResultsResponse = {
  rows: PsychologistStudentResultExportRow[];
  totals: {
    totalRows: number;
    uniqueStudents: number;
    highPriorityRows: number;
    pendingReviewRows: number;
    criticalRows: number;
  };
  availableTests: PsychologistStudentResultFilterOption[];
};

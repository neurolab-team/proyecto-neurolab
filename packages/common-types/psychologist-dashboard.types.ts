import { PsychologistPriority } from "./psychologist-core.types";

export type PsychologistPriorityCase = {
  studentId: string;
  studentName: string;
  testTitle: string | null;
  status: string;
  priority: PsychologistPriority;
  reason: string;
  interpretation: string | null;
  completedAt: string | null;
};

export type PsychologistRecentActivity = {
  studentId: string;
  studentName: string;
  label: string;
  occurredAt: string;
  type: "assignment" | "result" | "review";
};

export type PsychologistDashboardStats = {
  assignedStudents: number;
  pendingReview: number;
  completedToday: number;
  criticalCases: number;
  followUpsPending: number;
};

export type PsychologistDashboardFeed = {
  priorityCases: PsychologistPriorityCase[];
  recentActivity: PsychologistRecentActivity[];
};

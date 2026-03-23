import { Prisma } from "@prisma/client";

export type PsychologistAssignmentRecord = Prisma.assignmentGetPayload<{
  include: {
    assignedTo: {
      select: {
        userId: true;
        name: true;
        email: true;
        followUpAt: true;
      };
    };
    test: {
      select: {
        testId: true;
        title: true;
      };
    };
    score: true;
  };
}>;

export type DashboardStatsRow = {
  assignedStudents: number;
  pendingReview: number;
  completedToday: number;
  criticalCases: number;
  followUpsPending: number;
};

export type DashboardPriorityCaseRecord = Prisma.assignmentGetPayload<{
  select: {
    assignmentId: true;
    status: true;
    completedAt: true;
    reviewedAt: true;
    createdAt: true;
    assignedTo: {
      select: {
        userId: true;
        name: true;
        email: true;
      };
    };
    test: {
      select: {
        title: true;
      };
    };
    score: {
      select: {
        interpretation: true;
        attentionLevel: true;
      };
    };
  };
}>;

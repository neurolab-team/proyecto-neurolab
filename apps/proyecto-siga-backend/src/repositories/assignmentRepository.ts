import prisma from "@packages/libs/prisma";
import {
  Assignment,
  AssignmentWithTestsDataResponse,
} from "@packages/common-types/assignment.types";
import { PsychologistRecentActivity } from "@packages/common-types/psychologist.types";
import { assignment, Prisma } from "@packages/libs/prisma";
import {
  DashboardPriorityCaseRecord,
  DashboardStatsRow,
  PsychologistAssignmentRecord,
} from "../contracts/assignment/assignment.types";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";

const dashboardPriorityCaseSelect = {
  assignmentId: true,
  status: true,
  completedAt: true,
  reviewedAt: true,
  createdAt: true,
  assignedTo: {
    select: {
      userId: true,
      name: true,
      email: true,
    },
  },
  test: {
    select: {
      title: true,
    },
  },
  score: {
    select: {
      interpretation: true,
      attentionLevel: true,
    },
  },
} satisfies Prisma.assignmentSelect;

const dashboardActivitySelect = {
  assignedTo: {
    select: {
      userId: true,
      name: true,
      email: true,
    },
  },
  test: {
    select: {
      title: true,
    },
  },
  createdAt: true,
  completedAt: true,
  reviewedAt: true,
} satisfies Prisma.assignmentSelect;

const criticalScoreWhere = {
  OR: [
    {
      attentionLevel: "high",
    },
    {
      interpretation: {
        contains: "sever",
      },
    },
  ],
} satisfies Prisma.assignmentScoreWhereInput;

export class AssignmentRepository implements IAssignmentRepo {
  updateAssignmentStatus(
    assignmentId: string,
    data: Prisma.assignmentUpdateInput,
  ): Promise<assignment> {
    const { status } = data;
    return prisma.assignment.update({
      where: { assignmentId },
      data: { status },
    });
  }

  assignInitialTestsToUser(
    data: Prisma.assignmentCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<assignment> {
    const prismaClient = tx || prisma;
    return prismaClient.assignment.create({
      data,
    });
  }

  async getAssignmentsWithTestsByUserId(
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[] | null> {
    const assignment = await prisma.assignment.findMany({
      where: {
        assignedToId: userId,
      },
      select: {
        test: {
          select: {
            testId: true,
            testCode: true,
            title: true,
            description: true,
            _count: {
              select: { questions: true },
            },
          },
        },
        dueAt: true,
        startedAt: true,
        assignmentId: true,
        status: true,
      },
    });

    return assignment.map((asgmnt) => ({
      assignmentId: asgmnt.assignmentId,
      dueAt: asgmnt.dueAt || null,
      startedAt: asgmnt.startedAt || null,
      status: asgmnt.status,
      test: {
        testId: asgmnt.test.testId,
        testCode: asgmnt.test.testCode ?? null,
        title: asgmnt.test.title,
        description: asgmnt.test.description ?? null,
        questionCount: asgmnt.test._count.questions,
      },
    }));
  }

  getAssignmentsByPsychologistId(
    psychologistId: string,
  ): Promise<PsychologistAssignmentRecord[]> {
    return prisma.assignment.findMany({
      where: {
        assignedTo: {
          assignedPsychologistId: psychologistId,
        },
      },
      include: {
        assignedTo: {
          select: {
            userId: true,
            name: true,
            email: true,
            followUpAt: true,
          },
        },
        test: {
          select: {
            testId: true,
            title: true,
          },
        },
        score: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDashboardStats(psychologistId: string): Promise<DashboardStatsRow> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      assignedStudents,
      pendingReview,
      completedToday,
      criticalCases,
      followUpsPending,
    ] = await Promise.all([
      prisma.user.count({
        where: { assignedPsychologistId: psychologistId },
      }),
      prisma.assignment.count({
        where: {
          assignedTo: { assignedPsychologistId: psychologistId },
          status: "completed",
          reviewedAt: null,
        },
      }),
      prisma.assignment.count({
        where: {
          assignedTo: { assignedPsychologistId: psychologistId },
          completedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      prisma.user.count({
        where: {
          assignedPsychologistId: psychologistId,
          assignmentsTo: {
            some: {
              score: criticalScoreWhere,
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          assignedPsychologistId: psychologistId,
          followUpAt: { lte: new Date() },
        },
      }),
    ]);

    return {
      assignedStudents,
      pendingReview,
      completedToday,
      criticalCases,
      followUpsPending,
    };
  }

  async getDashboardPriorityCases(
    psychologistId: string,
  ): Promise<DashboardPriorityCaseRecord[]> {
    const [criticalCases, operationalCases] = await Promise.all([
      prisma.assignment.findMany({
        where: {
          assignedTo: { assignedPsychologistId: psychologistId },
          score: criticalScoreWhere,
        },
        select: dashboardPriorityCaseSelect,
        orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.assignment.findMany({
        where: {
          assignedTo: { assignedPsychologistId: psychologistId },
          OR: [
            { status: "completed", reviewedAt: null },
            { status: "expired" },
            { status: "in_progress" },
          ],
        },
        select: dashboardPriorityCaseSelect,
        orderBy: { createdAt: "desc" },
        take: 16,
      }),
    ]);

    const uniqueRecords = new Map<string, DashboardPriorityCaseRecord>();

    [...criticalCases, ...operationalCases].forEach((record) => {
      if (!uniqueRecords.has(record.assignmentId)) {
        uniqueRecords.set(record.assignmentId, record);
      }
    });

    return [...uniqueRecords.values()];
  }

  async getDashboardRecentActivity(
    psychologistId: string,
  ): Promise<PsychologistRecentActivity[]> {
    const [assignedRecords, completedRecords, reviewedRecords] =
      await Promise.all([
        prisma.assignment.findMany({
          where: {
            assignedTo: { assignedPsychologistId: psychologistId },
          },
          select: dashboardActivitySelect,
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.assignment.findMany({
          where: {
            assignedTo: { assignedPsychologistId: psychologistId },
            completedAt: { not: null },
          },
          select: dashboardActivitySelect,
          orderBy: { completedAt: "desc" },
          take: 10,
        }),
        prisma.assignment.findMany({
          where: {
            assignedTo: { assignedPsychologistId: psychologistId },
            reviewedAt: { not: null },
          },
          select: dashboardActivitySelect,
          orderBy: { reviewedAt: "desc" },
          take: 10,
        }),
      ]);

    const activities: PsychologistRecentActivity[] = [
      ...assignedRecords.map((record) => ({
        studentId: record.assignedTo.userId,
        studentName: record.assignedTo.name || record.assignedTo.email,
        label: `${record.test.title} fue asignada`,
        occurredAt: record.createdAt.toISOString(),
        type: "assignment" as const,
      })),
      ...completedRecords
        .filter((record) => !!record.completedAt)
        .map((record) => ({
          studentId: record.assignedTo.userId,
          studentName: record.assignedTo.name || record.assignedTo.email,
          label: `${record.test.title} fue completada`,
          occurredAt: record.completedAt!.toISOString(),
          type: "result" as const,
        })),
      ...reviewedRecords
        .filter((record) => !!record.reviewedAt)
        .map((record) => ({
          studentId: record.assignedTo.userId,
          studentName: record.assignedTo.name || record.assignedTo.email,
          label: `${record.test.title} fue revisada`,
          occurredAt: record.reviewedAt!.toISOString(),
          type: "review" as const,
        })),
    ];

    return activities
      .sort(
        (left, right) =>
          new Date(right.occurredAt).getTime() -
          new Date(left.occurredAt).getTime(),
      )
      .slice(0, 10);
  }

  getPsychologistAssignmentById(
    psychologistId: string,
    assignmentId: string,
  ): Promise<PsychologistAssignmentRecord | null> {
    return prisma.assignment.findFirst({
      where: {
        assignmentId,
        assignedTo: {
          assignedPsychologistId: psychologistId,
        },
      },
      include: {
        assignedTo: {
          select: {
            userId: true,
            name: true,
            email: true,
            followUpAt: true,
          },
        },
        test: {
          select: {
            testId: true,
            title: true,
          },
        },
        score: true,
      },
    });
  }

  getAssignmentForId(assignmentId: string): Promise<Assignment | null> {
    return prisma.assignment.findFirst({
      select: {
        assignmentId: true,
        testId: true,
        assignedToId: true,
        status: true,
      },
      where: {
        assignmentId,
      },
    });
  }

  async getTestCodeByAssignmentId(
    assignmentId: string,
  ): Promise<string | null> {
    const result = await prisma.assignment.findUnique({
      where: { assignmentId },
      select: { test: { select: { testCode: true } } },
    });
    return result?.test?.testCode ?? null;
  }
  markAssignmentAsReviewed(
    assignmentId: string,
    reviewedAt: Date,
    tx: Prisma.TransactionClient = prisma,
  ): Promise<assignment> {
    return tx.assignment.update({
      where: { assignmentId },
      data: { reviewedAt },
    });
  }

  async findAuthorizedStudentIdsForPsychologist(
    psychologistId: string,
    studentIds: string[],
    tx: Prisma.TransactionClient = prisma,
  ): Promise<string[]> {
    const students = await tx.user.findMany({
      where: {
        userId: { in: studentIds },
        role: "user",
        isActive: true,
        assignedPsychologistId: psychologistId,
      },
      select: { userId: true },
    });

    return students.map((student) => student.userId);
  }

  async findExistingAssignmentStudentIds(
    testId: string,
    studentIds: string[],
    tx: Prisma.TransactionClient = prisma,
  ): Promise<string[]> {
    const assignments = await tx.assignment.findMany({
      where: {
        assignedToId: { in: studentIds },
        testId,
      },
      select: {
        assignedToId: true,
      },
    });

    return assignments.map((assignment) => assignment.assignedToId);
  }

  async createManyPsychologistAssignments(
    psychologistId: string,
    testId: string,
    studentIds: string[],
    dueAt?: string | null,
    tx: Prisma.TransactionClient = prisma,
  ): Promise<number> {
    if (studentIds.length === 0) {
      return 0;
    }

    const result = await tx.assignment.createMany({
      data: studentIds.map((studentId) => ({
        assignedById: psychologistId,
        assignedToId: studentId,
        testId,
        status: "assigned",
        dueAt: dueAt ? new Date(dueAt) : null,
      })),
    });

    return result.count;
  }
}

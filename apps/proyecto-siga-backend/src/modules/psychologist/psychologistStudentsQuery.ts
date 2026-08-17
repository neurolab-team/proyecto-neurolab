import { inject, injectable } from "tsyringe";
import {
  PsychologistStudentResultFilterOption,
  PsychologistStudentResultExportRow,
  PsychologistStudentResultsFilters,
  PsychologistStudentResultsResponse,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
  PsychologistPriority,
} from "@packages/common-types/psychologist.types";
import { UserType } from "@packages/common-types/user.types";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { getAssignmentActivityDate, resolveAttentionLevel } from "./case.rules";
import {
  buildStudentProfile,
  buildStudentSummary,
} from "./student-summary.mapper";

type AssignmentRecord = Awaited<
  ReturnType<IUserRepo["findAssignedStudentsByPsychologistId"]>
>[number]["assignmentsTo"][number];

type FollowUpMetrics = {
  score: number;
  level: "stable" | "in_progress" | "follow_up" | "critical";
  reason: string;
};

function decimalToNumber(value?: { toNumber(): number } | null): number | null {
  if (!value || typeof value.toNumber !== "function") return null;
  return value.toNumber();
}

function daysFromNow(value?: Date | null): number {
  if (!value) return 0;
  const now = new Date();
  const diff = now.getTime() - value.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function mapFollowUpLevel(score: number): FollowUpMetrics["level"] {
  if (score >= 80) return "critical";
  if (score >= 60) return "follow_up";
  if (score >= 35) return "in_progress";
  return "stable";
}

function attentionWeight(level: "high" | "medium" | "low" | "none" | "critic"): number {
  switch (level) {
    case "critic":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function calculateFollowUpMetrics(
  followUpAt: Date | null,
  assignments: AssignmentRecord[],
): FollowUpMetrics {
  const overdueDays = followUpAt ? daysFromNow(followUpAt) : 0;
  const overduePoints =
    overdueDays <= 0
      ? 0
      : overdueDays <= 3
        ? 15
        : overdueDays <= 7
          ? 25
          : 35;

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "completed",
  );
  const pendingReviewCount = completedAssignments.filter(
    (assignment) => !assignment.reviewedAt,
  ).length;
  const pendingReviewRate =
    completedAssignments.length === 0
      ? 0
      : (pendingReviewCount / completedAssignments.length) * 100;
  const pendingReviewPoints =
    pendingReviewRate === 0
      ? 0
      : pendingReviewRate <= 25
        ? 8
        : pendingReviewRate <= 50
          ? 15
          : pendingReviewRate <= 75
            ? 20
            : 25;

  const latestActivity = [...assignments].sort(
    (left, right) =>
      getAssignmentActivityDate(right).getTime() -
      getAssignmentActivityDate(left).getTime(),
  )[0];
  const inactivityDays = latestActivity
    ? daysFromNow(getAssignmentActivityDate(latestActivity))
    : 0;
  const expiredCount = assignments.filter(
    (assignment) => assignment.status === "expired",
  ).length;

  let adherencePoints =
    inactivityDays <= 7
      ? 0
      : inactivityDays <= 14
        ? 8
        : inactivityDays <= 21
          ? 14
          : 20;
  if (expiredCount >= 2) {
    adherencePoints = Math.min(20, adherencePoints + 5);
  }

  const scoredAssignments = assignments
    .filter((assignment) => Boolean(assignment.score))
    .sort(
      (left, right) =>
        getAssignmentActivityDate(right).getTime() -
        getAssignmentActivityDate(left).getTime(),
    );

  const trendPoints = (() => {
    if (scoredAssignments.length < 2) return 5;
    const current = attentionWeight(resolveAttentionLevel(scoredAssignments[0].score));
    const previous = attentionWeight(resolveAttentionLevel(scoredAssignments[1].score));

    if (current > previous) return 20;
    if (current === previous && current > 0) return 12;
    if (current === previous) return 5;
    return 0;
  })();

  const totalScore = Math.min(
    100,
    overduePoints + pendingReviewPoints + adherencePoints + trendPoints,
  );

  const reasons = [
    {
      points: overduePoints,
      label:
        overduePoints > 0
          ? `Seguimiento vencido hace ${overdueDays} día${overdueDays === 1 ? "" : "s"}`
          : "",
    },
    {
      points: pendingReviewPoints,
      label:
        pendingReviewPoints > 0
          ? `${pendingReviewCount} prueba${pendingReviewCount === 1 ? "" : "s"} pendiente${pendingReviewCount === 1 ? "" : "s"} de revisión`
          : "",
    },
    {
      points: adherencePoints,
      label:
        adherencePoints > 0
          ? `Inactividad de ${inactivityDays} día${inactivityDays === 1 ? "" : "s"}${
              expiredCount >= 2 ? " y múltiples pruebas vencidas" : ""
            }`
          : "",
    },
    {
      points: trendPoints,
      label:
        trendPoints >= 20
          ? "Tendencia clínica en empeoramiento reciente"
          : trendPoints >= 12
            ? "Tendencia clínica sostenida con alertas"
            : trendPoints > 0
              ? "Tendencia clínica estable"
              : "",
    },
  ].sort((left, right) => right.points - left.points);

  const mainReason = reasons.find((entry) => entry.points > 0)?.label;

  return {
    score: totalScore,
    level: mapFollowUpLevel(totalScore),
    reason: mainReason || "Sin señales clínicas de seguimiento inmediato",
  };
}

@injectable()
export class PsychologistStudentsQueryService {
  constructor(
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
  ) {}

  async getPsychologistStudents(
    psychologistId: string,
  ): Promise<PsychologistStudentSummary[]> {
    const students =
      await this.userRepo.findAssignedStudentsByPsychologistId(psychologistId);

    return students.map((student) => buildStudentSummary(student));
  }

  async getPsychologistStudentById(
    psychologistId: string,
    studentId: string,
  ): Promise<PsychologistStudentProfile | null> {
    const student = await this.userRepo.findAssignedStudentById(
      psychologistId,
      studentId,
    );

    return student ? buildStudentProfile(student) : null;
  }

  async getPsychologistStudentResults(
    psychologistId: string,
    filters: PsychologistStudentResultsFilters,
  ): Promise<PsychologistStudentResultsResponse> {
    const toDate = filters.toDate ? new Date(filters.toDate) : null;
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const normalizedFilters = {
      search: (filters.search || "").trim().toLowerCase(),
      testId: filters.testId && filters.testId !== "all" ? filters.testId : null,
      status: filters.status || "completed",
      priority: filters.priority || "all",
      caseStatus: filters.caseStatus || "all",
      detailLevel: filters.detailLevel || "assignment",
      fromDate: filters.fromDate ? new Date(filters.fromDate) : null,
      toDate,
      onlyWithInterpretation: Boolean(filters.onlyWithInterpretation),
      limit: Math.max(1, Math.min(filters.limit ?? 5000, 5000)),
    };

    const students =
      await this.userRepo.findAssignedStudentsByPsychologistId(psychologistId);

    const assignmentRows = students.flatMap((student) => {
      const summary = buildStudentSummary(student);
      const followUpMetrics = calculateFollowUpMetrics(
        student.followUpAt,
        student.assignmentsTo,
      );

      return student.assignmentsTo.map((assignment) => {
        const result = assignment.score;

        return {
          assignmentId: assignment.assignmentId,
          studentId: student.userId,
          studentName: student.name || student.email,
          studentEmail: student.email,
          studentCode: student.userNumber,
          userType: student.userType as UserType,
          testId: assignment.test.testId,
          testTitle: assignment.test.title,
          assignmentStatus: assignment.status,
          caseStatus: summary.caseStatus,
          priority: summary.priority,
          attentionLevel: (result?.attentionLevel || "none") as PsychologistPriority | "none",
          assignedAt: assignment.createdAt.toISOString(),
          completedAt: assignment.completedAt?.toISOString() || null,
          reviewedAt: assignment.reviewedAt?.toISOString() || null,
          totalScore:
            typeof result?.totalScore?.toNumber === "function"
              ? result.totalScore.toNumber()
              : null,
          percentile: decimalToNumber(result?.percentile),
          interpretation: result?.interpretation || null,
          followUpScore: followUpMetrics.score,
          followUpLevel: followUpMetrics.level,
          followUpReason: followUpMetrics.reason,
          questionCode: null,
          questionPrompt: null,
          questionOptionLabel: null,
          questionOptionValue: null,
          questionTextValue: null,
          questionScoreValue: null,
        } satisfies PsychologistStudentResultExportRow;
      });
    });

    const availableTestsMap = new Map<string, PsychologistStudentResultFilterOption>();

    assignmentRows.forEach((row) => {
      const current = availableTestsMap.get(row.testId);
      if (current) {
        current.count += 1;
        return;
      }

      availableTestsMap.set(row.testId, {
        value: row.testId,
        label: row.testTitle,
        count: 1,
      });
    });

    const availableTests = [...availableTestsMap.values()].sort((left, right) =>
      left.label.localeCompare(right.label),
    );

    const filteredAssignmentRows = assignmentRows
      .filter((row) => {
        if (normalizedFilters.search.length > 0) {
          const matchesSearch =
            row.studentName.toLowerCase().includes(normalizedFilters.search) ||
            row.studentEmail.toLowerCase().includes(normalizedFilters.search) ||
            row.studentCode.toLowerCase().includes(normalizedFilters.search) ||
            row.testTitle.toLowerCase().includes(normalizedFilters.search);

          if (!matchesSearch) return false;
        }

        if (normalizedFilters.testId && row.testId !== normalizedFilters.testId) {
          return false;
        }

        if (normalizedFilters.priority !== "all" && row.priority !== normalizedFilters.priority) {
          return false;
        }

        if (
          normalizedFilters.caseStatus !== "all" &&
          row.caseStatus !== normalizedFilters.caseStatus
        ) {
          return false;
        }

        if (normalizedFilters.status === "pending_review") {
          if (!(row.assignmentStatus === "completed" && !row.reviewedAt)) {
            return false;
          }
        } else if (
          normalizedFilters.status !== "all" &&
          row.assignmentStatus !== normalizedFilters.status
        ) {
          return false;
        }

        if (normalizedFilters.onlyWithInterpretation && !row.interpretation) {
          return false;
        }

        const rowDate = row.completedAt || row.assignedAt;
        if (normalizedFilters.fromDate && new Date(rowDate) < normalizedFilters.fromDate) {
          return false;
        }

        if (normalizedFilters.toDate && new Date(rowDate) > normalizedFilters.toDate) {
          return false;
        }

        return true;
      })
      .sort(
        (left, right) =>
          new Date(right.completedAt || right.assignedAt).getTime() -
          new Date(left.completedAt || left.assignedAt).getTime(),
      );

    const detailedRows =
      normalizedFilters.detailLevel === "question"
        ? filteredAssignmentRows.flatMap((row) => {
            const student = students.find((item) => item.userId === row.studentId);
            const assignment = student?.assignmentsTo.find(
              (item) => item.assignmentId === row.assignmentId,
            );
            const answers = assignment?.answers || [];

            if (answers.length === 0) {
              return [row];
            }

            return answers.map((answer) => ({
              ...row,
              questionCode: answer.question?.code || null,
              questionPrompt: answer.question?.prompt || null,
              questionOptionLabel: answer.option?.label || null,
              questionOptionValue: answer.option?.value || null,
              questionTextValue: answer.textValue || null,
              questionScoreValue: decimalToNumber(answer.option?.scoreValue),
            }));
          })
        : filteredAssignmentRows;

    const rows = detailedRows.slice(0, normalizedFilters.limit);

    const uniqueStudents = new Set(rows.map((row) => row.studentId));

    return {
      rows,
      totals: {
        totalRows: rows.length,
        uniqueStudents: uniqueStudents.size,
        highPriorityRows: rows.filter((row) => row.priority === "high").length,
        pendingReviewRows: rows.filter(
          (row) => row.assignmentStatus === "completed" && !row.reviewedAt,
        ).length,
        criticalRows: rows.filter((row) => row.caseStatus === "critical").length,
      },
      availableTests,
    };
  }
}

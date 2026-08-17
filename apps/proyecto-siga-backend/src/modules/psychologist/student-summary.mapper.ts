import {
  PsychologistStudentAssignment,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
  PsychologistTimelineEvent,
} from "@packages/common-types/psychologist.types";
import { UserType } from "@packages/common-types/user.types";
import { AssignedStudentRecord } from "../../contracts/user/IuserRepo";
import {
  getAssignmentActivityDate,
  getAttentionLabel,
  getCaseStatus,
  getStudentPriority,
  isDateReached,
  isCriticalScore,
  resolveAttentionLevel,
} from "./case.rules";
import { mapBasicUserReference } from "../users/user.mapper";
import { calculateAge } from "@packages/common-schemas/age";


function toDateString(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function decimalToNumber(
  value?: { toNumber(): number } | number | null,
): number | null {
  if (value === null || value === undefined) return null;
  return typeof value === "number" ? value : value.toNumber();
}

export function buildAssignmentSummary(
  assignment: AssignedStudentRecord["assignmentsTo"][number],
): PsychologistStudentAssignment {
  return {
    assignmentId: assignment.assignmentId,
    status: assignment.status,
    dueAt: toDateString(assignment.dueAt),
    startedAt: toDateString(assignment.startedAt),
    completedAt: toDateString(assignment.completedAt),
    reviewedAt: toDateString(assignment.reviewedAt),
    createdAt: assignment.createdAt.toISOString(),
    attentionLevel: resolveAttentionLevel(assignment.score),
    test: {
      testId: assignment.test.testId,
      title: assignment.test.title,
      description: assignment.test.description,
    },
    result: assignment.score
      ? {
          totalScore: decimalToNumber(assignment.score.totalScore),
          percentile: decimalToNumber(assignment.score.percentile),
          interpretation: assignment.score.interpretation || null,
        }
      : null,
  };
}

function buildStudentInsights(
  record: AssignedStudentRecord,
  assignments: PsychologistStudentAssignment[],
  hasCriticalResults: boolean,
  hasPendingReview: boolean,
): string[] {
  const insights: string[] = [];
  const alteredAssignments = assignments.filter((assignment) =>
    ["high", "medium"].includes(assignment.attentionLevel),
  );
  const overdueAssignments = assignments.filter(
    (assignment) => assignment.status === "expired",
  );
  const activeAssignments = assignments.filter((assignment) =>
    ["assigned", "in_progress"].includes(assignment.status),
  );

  if (hasCriticalResults) {
    insights.push(
      "El estudiante presenta al menos un resultado severo o de alta prioridad clinica.",
    );
  }

  if (alteredAssignments.length > 1) {
    insights.push(
      "Se observan multiples evaluaciones con resultados alterados que ameritan lectura integral del caso.",
    );
  }

  if (hasPendingReview) {
    insights.push(
      "Tiene pruebas completadas pendientes de revision por parte del psicologo responsable.",
    );
  }

  if (overdueAssignments.length > 0) {
    insights.push(
      "Mantiene pruebas vencidas o incompletas que afectan la continuidad del seguimiento.",
    );
  }

  if (isDateReached(record.followUpAt)) {
    insights.push(
      "Tiene seguimiento vencido o programado para una fecha que ya requiere accion.",
    );
  }

  if (!hasCriticalResults && !hasPendingReview && activeAssignments.length > 0) {
    insights.push(
      "El caso sigue en evaluacion activa y todavia no concentra alertas clinicas mayores.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      "No se identifican alertas clinicas inmediatas con la informacion disponible hasta ahora.",
    );
  }

  return insights;
}

function buildTimeline(
  record: AssignedStudentRecord,
  assignments: PsychologistStudentAssignment[],
): PsychologistTimelineEvent[] {
  const events: PsychologistTimelineEvent[] = [];

  if (record.assignedPsychologistAt) {
    events.push({
      date: record.assignedPsychologistAt.toISOString(),
      label: "Asignado al psicologo responsable",
      type: "case",
    });
  }

  if (record.followUpAt) {
    events.push({
      date: record.followUpAt.toISOString(),
      label: "Seguimiento programado",
      type: "follow_up",
    });
  }

  assignments.forEach((assignment) => {
    events.push({
      date: assignment.createdAt,
      label: `${assignment.test.title} fue asignada`,
      type: "assignment",
    });

    if (assignment.completedAt) {
      events.push({
        date: assignment.completedAt,
        label: `${assignment.test.title} fue completada`,
        type: "result",
      });
    }

    if (assignment.reviewedAt) {
      events.push({
        date: assignment.reviewedAt,
        label: `${assignment.test.title} fue revisada`,
        type: "review",
      });
    }
  });

  return events.sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
}

export function buildStudentSummary(
  record: AssignedStudentRecord,
): PsychologistStudentSummary {
  const assignments = [...record.assignmentsTo].sort(
    (left, right) =>
      getAssignmentActivityDate(right).getTime() -
      getAssignmentActivityDate(left).getTime(),
  );

  const latestAssignment = assignments[0] || null;
  const latestResult = assignments.find((assignment) => assignment.score) || null;
  const completedTestsCount = assignments.filter(
    (assignment) => assignment.status === "completed",
  ).length;
  const pendingTestsCount = assignments.filter(
    (assignment) => assignment.status !== "completed",
  ).length;
  const hasPendingReview = assignments.some(
    (assignment) => assignment.status === "completed" && !assignment.reviewedAt,
  );
  const hasCriticalResults = assignments.some((assignment) =>
    isCriticalScore(assignment.score),
  );
  const hasCriticResults = assignments.some(
    (assignment) => resolveAttentionLevel(assignment.score) === "critic",
  );
  const hasCompletedAssignments = assignments.some(
    (assignment) => assignment.status === "completed",
  );
  const hasActiveAssignments = assignments.some((assignment) =>
    ["assigned", "in_progress", "expired"].includes(assignment.status),
  );
  const caseStatus = getCaseStatus({
    hasCompletedAssignments,
    hasActiveAssignments,
    hasCriticalResults,
    hasPendingReview,
    followUpAt: record.followUpAt,
  });
  const priority = getStudentPriority({
    hasCriticalResults,
    hasPendingReview,
    followUpAt: record.followUpAt,
    hasCriticResults,
  });

  return {
    studentId: record.userId,
    name: record.name || "",
    email: record.email,
    userNumber: record.userNumber,
    userType: record.userType as UserType,
    gender: record.gender,
    age: calculateAge(record.birthDate),
    assignedAt: toDateString(record.assignedPsychologistAt),
    lastActivityAt: latestAssignment
      ? toDateString(getAssignmentActivityDate(latestAssignment))
      : null,
    followUpAt: toDateString(record.followUpAt),
    caseStatus,
    priority,
    assignedTestsCount: assignments.length,
    completedTestsCount,
    pendingTestsCount,
    latestTestTitle: latestAssignment?.test.title || null,
    latestInterpretation: latestResult?.score?.interpretation || null,
    attentionLabel: getAttentionLabel({
      caseStatus,
      hasCriticalResults,
      hasPendingReview,
      followUpAt: record.followUpAt,
    }),
    hasCriticalResults,
    hasPendingReview,
  };
}

export function buildStudentProfile(
  record: AssignedStudentRecord,
): PsychologistStudentProfile {
  const summary = buildStudentSummary(record);
  const assignments = [...record.assignmentsTo]
    .sort(
      (left, right) =>
        getAssignmentActivityDate(right).getTime() -
        getAssignmentActivityDate(left).getTime(),
    )
    .map((assignment) => buildAssignmentSummary(assignment));

  return {
    ...summary,
    assignedPsychologist: mapBasicUserReference(record.assignedPsychologist),
    insights: buildStudentInsights(
      record,
      assignments,
      summary.hasCriticalResults,
      summary.hasPendingReview,
    ),
    assignments,
    timeline: buildTimeline(record, assignments),
  };
}

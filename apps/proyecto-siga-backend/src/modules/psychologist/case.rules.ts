import {
  PsychologistCaseStatus,
  PsychologistPriority,
} from "@packages/common-types/psychologist.types";
import {
  AssignedStudentRecord,
} from "../../contracts/user/IuserRepo";

type AssignmentLike = Pick<
  AssignedStudentRecord["assignmentsTo"][number],
  "reviewedAt" | "completedAt" | "startedAt" | "dueAt" | "createdAt" | "status"
> & {
  score?: {
    attentionLevel?: string | null;
    interpretation?: string | null;
  } | null;
};

type ScoreLike = AssignmentLike["score"];
type AssignmentActivityLike = {
  reviewedAt?: Date | null;
  completedAt?: Date | null;
  startedAt?: Date | null;
  dueAt?: Date | null;
  createdAt: Date;
};
type AssignmentPriorityLike = Pick<
  AssignmentLike,
  "status" | "reviewedAt"
> & {
  score?: ScoreLike;
};

export function getAttentionLevel(
  score?: ScoreLike,
): PsychologistPriority | "none" {
  if (score?.attentionLevel) {
    return score.attentionLevel as PsychologistPriority | "none";
  }

  return "none";
}

export function resolveAttentionLevel(
  score?: ScoreLike,
): PsychologistPriority | "none" {
  return getAttentionLevel(score);
}

export function isCriticalScore(score?: ScoreLike): boolean {
  const level = resolveAttentionLevel(score);
  return level === "critic" || level === "high";
}

export function isDateReached(date?: Date | null): boolean {
  return !!date && date <= new Date();
}

export function getAssignmentActivityDate(
  assignment: AssignmentActivityLike,
): Date {
  return (
    assignment.reviewedAt ||
    assignment.completedAt ||
    assignment.startedAt ||
    assignment.dueAt ||
    assignment.createdAt
  );
}

export function getStudentPriority(params: {
  hasCriticalResults: boolean;
  hasPendingReview: boolean;
  followUpAt?: Date | null;
  hasCriticResults?: boolean;
}): PsychologistPriority {
  if (params.hasCriticResults) return "critic";
  if (params.hasCriticalResults) return "high";
  if (params.hasPendingReview) return "medium";
  if (isDateReached(params.followUpAt)) return "medium";
  return "low";
}

export function getCaseStatus(params: {
  hasCompletedAssignments: boolean;
  hasActiveAssignments: boolean;
  hasCriticalResults: boolean;
  hasPendingReview: boolean;
  followUpAt?: Date | null;
}): PsychologistCaseStatus {
  if (params.hasCriticalResults) return "critical";
  if (params.hasPendingReview) return "pending_review";
  if (isDateReached(params.followUpAt)) return "follow_up";
  if (!params.hasCompletedAssignments && !params.hasActiveAssignments) {
    return "new";
  }
  if (!params.hasCompletedAssignments || params.hasActiveAssignments) {
    return "in_progress";
  }
  return "stable";
}

export function getAttentionLabel(params: {
  caseStatus: PsychologistCaseStatus;
  hasCriticalResults: boolean;
  hasPendingReview: boolean;
  followUpAt?: Date | null;
}): string {
  if (params.hasCriticalResults) return "Atencion prioritaria";
  if (params.hasPendingReview) return "Revision pendiente";
  if (isDateReached(params.followUpAt)) return "Seguimiento pendiente";

  switch (params.caseStatus) {
    case "new":
      return "Caso nuevo";
    case "in_progress":
      return "En evaluacion";
    case "stable":
      return "Caso estable";
    case "follow_up":
      return "Seguimiento pendiente";
    default:
      return "En observacion";
  }
}

export function getPriorityWeight(
  priority: PsychologistPriority | "none",
): number {
  switch (priority) {
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

export function getAssignmentPriority(
  assignment: AssignmentPriorityLike,
): PsychologistPriority {
  const attention = resolveAttentionLevel(assignment.score);

  if (attention === "critic") {
    return "critic";
  }

  if (attention === "high") {
    return "high";
  }

  if (assignment.status === "completed" && !assignment.reviewedAt) {
    return "medium";
  }

  if (assignment.status === "expired") {
    return "medium";
  }

  return "low";
}

export function getPriorityReason(
  assignment: AssignmentPriorityLike,
): string {
  const attention = resolveAttentionLevel(assignment.score);

  if (attention === "critic") {
    return "Resultado extremadamente severo - atencion inmediata";
  }

  if (attention === "high") {
    return "Resultado critico o severo";
  }

  if (assignment.status === "completed" && !assignment.reviewedAt) {
    return "Pendiente de revision clinica";
  }

  if (assignment.status === "expired") {
    return "Prueba vencida o incompleta";
  }

  if (assignment.status === "in_progress") {
    return "Prueba en progreso";
  }

  return "Caso activo";
}

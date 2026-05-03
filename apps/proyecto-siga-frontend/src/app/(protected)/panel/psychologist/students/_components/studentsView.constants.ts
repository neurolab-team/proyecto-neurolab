import {
  PsychologistCaseStatus,
  PsychologistPriority,
} from "@packages/common-types/psychologist.types";

export const caseStatusLabel: Record<PsychologistCaseStatus, string> = {
  new: "Caso nuevo",
  in_progress: "En evaluación",
  pending_review: "Pendiente de revisión",
  critical: "Crítico",
  stable: "Estable",
  follow_up: "Seguimiento",
};

export const priorityLabel: Record<PsychologistPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export const statusLabel: Record<string, string> = {
  assigned: "Asignada",
  in_progress: "En progreso",
  completed: "Completada",
  expired: "Vencida",
};

export const priorityBadge: Record<PsychologistPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

export const caseStatusBadge: Record<PsychologistCaseStatus, string> = {
  critical: "bg-rose-100 text-rose-700",
  pending_review: "bg-amber-100 text-amber-700",
  follow_up: "bg-sky-100 text-sky-700",
  in_progress: "bg-blue-100 text-blue-700",
  new: "bg-violet-100 text-violet-700",
  stable: "bg-emerald-100 text-emerald-700",
};

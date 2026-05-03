import { PsychologistPriority } from "@packages/common-types/psychologist.types";

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
  pending_review: "Pendiente de revisión",
};

export const caseStatusLabel: Record<string, string> = {
  new: "Caso nuevo",
  in_progress: "En evaluación",
  pending_review: "Pendiente de revisión",
  critical: "Crítico",
  stable: "Estable",
  follow_up: "Seguimiento",
};

export const attentionLevelLabel: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
  none: "Sin alerta",
};

export const userTypeLabel: Record<string, string> = {
  itmStudent: "Estudiante ITM",
  itmEmployee: "Empleado ITM",
  external: "Externo",
};

export const followUpLevelLabel: Record<string, string> = {
  stable: "Estable",
  in_progress: "En evaluación",
  follow_up: "Seguimiento",
  critical: "Crítico",
};

import { PsychologistStudentResultExportRow } from "@packages/common-types/psychologist.types";
import {
  attentionLevelLabel,
  caseStatusLabel,
  followUpLevelLabel,
  priorityLabel,
  statusLabel,
  userTypeLabel,
} from "./exports.constants";

function formatCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function createResultsCsv(rows: PsychologistStudentResultExportRow[]): string {
  const header = [
    "Estudiante",
    "Correo",
    "Código",
    "Tipo usuario",
    "Prueba",
    "Estado prueba",
    "Estado caso",
    "Prioridad",
    "Nivel de atención",
    "Fecha asignación",
    "Fecha completada",
    "Fecha revisión",
    "Puntaje total",
    "Percentil",
    "Interpretación",
    "Follow-up score",
    "Nivel follow-up",
    "Razón follow-up",
    "Pregunta código",
    "Pregunta",
    "Opción label",
    "Opción value",
    "Respuesta texto",
    "Score opción",
  ];

  const body = rows.map((row) =>
    [
      row.studentName,
      row.studentEmail,
      row.studentCode,
      userTypeLabel[row.userType] || row.userType,
      row.testTitle,
      statusLabel[row.assignmentStatus] || row.assignmentStatus,
      caseStatusLabel[row.caseStatus] || row.caseStatus,
      priorityLabel[row.priority] || row.priority,
      attentionLevelLabel[row.attentionLevel] || row.attentionLevel,
      row.assignedAt,
      row.completedAt,
      row.reviewedAt,
      row.totalScore,
      row.percentile,
      row.interpretation,
      row.followUpScore,
      followUpLevelLabel[row.followUpLevel] || row.followUpLevel,
      row.followUpReason,
      row.questionCode,
      row.questionPrompt,
      row.questionOptionLabel,
      row.questionOptionValue,
      row.questionTextValue,
      row.questionScoreValue,
    ]
      .map((cell) => formatCsvCell(cell))
      .join(","),
  );

  return [header.join(","), ...body].join("\n");
}

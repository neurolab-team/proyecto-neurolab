import {
  PsychologistStudentAssignment,
  PsychologistStudentProfile,
} from "@packages/common-types/psychologist.types";
import { AssignmentCard } from "./AssignmentCard";
import { EmptyState } from "./EmptyState";
import { StatPill } from "./StatPill";
import { caseStatusBadge, caseStatusLabel } from "./studentsView.constants";
import { formatDateLabel, formatDistanceLabel } from "./studentsView.formatters";

type StudentDetailPanelProps = {
  loadingDetail: boolean;
  studentDetail: PsychologistStudentProfile | undefined;
  isReviewPending: boolean;
  reviewMutationAssignmentId: string | undefined;
  onReviewAssignment: (assignmentId: string) => void;
};

export function StudentDetailPanel({
  loadingDetail,
  studentDetail,
  isReviewPending,
  reviewMutationAssignmentId,
  onReviewAssignment,
}: StudentDetailPanelProps) {
  if (loadingDetail) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="py-20 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
          <p className="mt-4 text-slate-500">Cargando resumen del caso...</p>
        </div>
      </div>
    );
  }

  if (!studentDetail) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <EmptyState message="Selecciona un estudiante para ver su resumen clínico." />
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="space-y-8">
        <section className="rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-[#102D69] to-[#0D4A8C] p-6 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold">{studentDetail.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    caseStatusBadge[studentDetail.caseStatus]
                  }`}
                >
                  {caseStatusLabel[studentDetail.caseStatus]}
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                {studentDetail.userNumber} · {studentDetail.email}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                {studentDetail.attentionLabel}. Psicólogo responsable: {" "}
                {studentDetail.assignedPsychologist?.name || "Sin asignar"}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatPill
                label="Tipo de usuario"
                value={
                  studentDetail.userType === "itmStudent"
                    ? "Estudiante ITM"
                    : studentDetail.userType === "itmEmployee"
                      ? "Empleado ITM"
                      : "Externo"
                }
              />
              <StatPill label="Edad" value={studentDetail.age ?? "Sin dato"} />
              <StatPill label="Asignado" value={formatDateLabel(studentDetail.assignedAt)} />
              <StatPill
                label="Seguimiento"
                value={formatDateLabel(studentDetail.followUpAt, "No programado")}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatPill label="Pruebas asignadas" value={studentDetail.assignedTestsCount} />
          <StatPill label="Pruebas completadas" value={studentDetail.completedTestsCount} />
          <StatPill label="Pendientes" value={studentDetail.pendingTestsCount} />
          <StatPill label="Última actividad" value={formatDistanceLabel(studentDetail.lastActivityAt)} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-[#102D69]">Insight global</h3>
            <div className="mt-4 space-y-3">
              {studentDetail.insights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-[#102D69]">Línea de tiempo</h3>
            <div className="mt-4 space-y-4">
              {studentDetail.timeline.slice(0, 8).map((event) => (
                <div
                  key={`${event.type}-${event.date}-${event.label}`}
                  className="rounded-[1.25rem] border border-slate-200 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-slate-800">{event.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {formatDateLabel(event.date)} · {formatDistanceLabel(event.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#102D69]">Resultados por prueba</h3>
              <p className="mt-2 text-sm text-slate-500">
                Cada tarjeta resume estado, resultado e intervención mínima disponible.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {studentDetail.assignments.map((assignment: PsychologistStudentAssignment) => (
              <AssignmentCard
                key={assignment.assignmentId}
                assignment={assignment}
                isReviewing={
                  isReviewPending && reviewMutationAssignmentId === assignment.assignmentId
                }
                onReview={() => onReviewAssignment(assignment.assignmentId)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

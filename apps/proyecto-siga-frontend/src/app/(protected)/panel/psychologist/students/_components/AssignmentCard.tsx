import { useRouter } from "next/navigation";
import { PsychologistStudentAssignment } from "@packages/common-types/psychologist.types";
import { formatDateLabel } from "./studentsView.formatters";
import { statusLabel } from "./studentsView.constants";

type AssignmentCardProps = {
  assignment: PsychologistStudentAssignment;
  isReviewing: boolean;
  onReview: () => void;
};

export function AssignmentCard({ assignment, isReviewing, onReview }: AssignmentCardProps) {
  const router = useRouter();
  const attentionClass =
    assignment.attentionLevel === "high"
      ? "bg-rose-100 text-rose-700"
      : assignment.attentionLevel === "medium"
        ? "bg-amber-100 text-amber-700"
        : assignment.attentionLevel === "low"
          ? "bg-sky-100 text-sky-700"
          : "bg-slate-100 text-slate-700";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-bold text-slate-900">{assignment.test.title}</h4>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabel[assignment.status] || assignment.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${attentionClass}`}>
              {assignment.attentionLevel === "none"
                ? "Sin alerta"
                : `Atención ${assignment.attentionLevel === "high"
                    ? "alta"
                    : assignment.attentionLevel === "medium"
                      ? "media"
                      : "baja"}`}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
            <p>Asignada: {formatDateLabel(assignment.createdAt)}</p>
            <p>Inicio: {formatDateLabel(assignment.startedAt, "No iniciada")}</p>
            <p>Completada: {formatDateLabel(assignment.completedAt, "Pendiente")}</p>
            <p>Revisada: {formatDateLabel(assignment.reviewedAt, "Pendiente")}</p>
          </div>
        </div>

        {assignment.status === "completed" && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                router.push(`/test/results/${assignment.assignmentId}`);
              }}
              className="rounded-xl bg-[#00A0B7] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#008a9e]"
            >
              Ver Resultados
            </button>
            {!assignment.reviewedAt && (
              <button
                onClick={onReview}
                disabled={isReviewing}
                className="rounded-xl bg-[#102D69] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0D4A8C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isReviewing ? "Guardando..." : "Marcar revisada"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Puntaje total</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.result?.totalScore ?? "Sin calcular"}</p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Percentil</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.result?.percentile ?? "No disponible"}</p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretación</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{assignment.result?.interpretation || "Pendiente de resultado"}</p>
        </div>
      </div>
    </div>
  );
}

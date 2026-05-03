import { PsychologistStudentSummary } from "@packages/common-types/psychologist.types";
import { EmptyState } from "./EmptyState";
import { caseStatusBadge, caseStatusLabel, priorityBadge, priorityLabel } from "./studentsView.constants";
import { formatDistanceLabel } from "./studentsView.formatters";

type StudentsListPanelProps = {
  isLoading: boolean;
  students: PsychologistStudentSummary[];
  selectedStudentId: string | null;
  selectedStudentIds: string[];
  onSelectStudent: (studentId: string) => void;
  onToggleStudentSelection: (studentId: string) => void;
};

export function StudentsListPanel({
  isLoading,
  students,
  selectedStudentId,
  selectedStudentIds,
  onSelectStudent,
  onToggleStudentSelection,
}: StudentsListPanelProps) {
  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-bold text-[#102D69]">Estudiantes</h2>
          <p className="text-sm text-slate-500">{students.length} visibles</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
          <p className="mt-4 text-slate-500">Cargando estudiantes...</p>
        </div>
      ) : students.length === 0 ? (
        <EmptyState message="No hay estudiantes asignados con esos filtros." />
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const isSelected = student.studentId === selectedStudentId;
            return (
              <button
                key={student.studentId}
                onClick={() => onSelectStudent(student.studentId)}
                className={`w-full rounded-[1.5rem] border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#0D4A8C] bg-[#F2F7FF] shadow-sm"
                    : "border-slate-200 hover:border-[#0D4A8C] hover:bg-slate-50"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <label
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.studentId)}
                      onChange={() => onToggleStudentSelection(student.studentId)}
                      className="h-4 w-4 rounded border-slate-300 text-[#00A0B7] focus:ring-[#00A0B7]"
                    />
                    Seleccionar
                  </label>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{student.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      priorityBadge[student.priority]
                    }`}
                  >
                    {priorityLabel[student.priority]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      caseStatusBadge[student.caseStatus]
                    }`}
                  >
                    {caseStatusLabel[student.caseStatus]}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {student.completedTestsCount}/{student.assignedTestsCount} pruebas
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>Última actividad: {formatDistanceLabel(student.lastActivityAt)}</p>
                  <p>Resultado relevante: {student.latestInterpretation || "Sin resultado aún"}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

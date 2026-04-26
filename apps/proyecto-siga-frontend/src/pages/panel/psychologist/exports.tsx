import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import PsychologistLayout from "../../../components/psychologist/PsychologistLayout";
import { usersService } from "../../../services/users/users";
import { notify } from "../../../libs/toastService";
import {
  PsychologistPriority,
  PsychologistStudentResultExportRow,
  PsychologistStudentResultsFilters,
} from "@packages/common-types/psychologist.types";

const priorityLabel: Record<PsychologistPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const statusLabel: Record<string, string> = {
  assigned: "Asignada",
  in_progress: "En progreso",
  completed: "Completada",
  expired: "Vencida",
  pending_review: "Pendiente de revisión",
};

const caseStatusLabel: Record<string, string> = {
  new: "Caso nuevo",
  in_progress: "En evaluación",
  pending_review: "Pendiente de revisión",
  critical: "Crítico",
  stable: "Estable",
  follow_up: "Seguimiento",
};

const attentionLevelLabel: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
  none: "Sin alerta",
};

const userTypeLabel: Record<string, string> = {
  itmStudent: "Estudiante ITM",
  itmEmployee: "Empleado ITM",
  external: "Externo",
};

const followUpLevelLabel: Record<string, string> = {
  stable: "Estable",
  in_progress: "En evaluación",
  follow_up: "Seguimiento",
  critical: "Crítico",
};

function formatCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function createResultsCsv(rows: PsychologistStudentResultExportRow[]): string {
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

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}

export default function PsychologistExportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<PsychologistStudentResultsFilters>({
    status: "completed",
    priority: "all",
    caseStatus: "all",
    detailLevel: "assignment",
    onlyWithInterpretation: true,
    limit: 5000,
  });

  const { data: exportResults, isLoading, isFetching } = useQuery({
    queryKey: ["psychologist-export-results", filters],
    queryFn: () => usersService.getPsychologistStudentResults(filters),
  });

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);

      const exportPayload = await usersService.getPsychologistStudentResults({
        ...filters,
        detailLevel: "question",
      });
      const rows = exportPayload.rows || [];

      if (rows.length === 0) {
        notify.error("No hay resultados para exportar con los filtros actuales.");
        return;
      }

      const csv = createResultsCsv(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const stamp = format(new Date(), "yyyyMMdd-HHmm");

      anchor.href = url;
      anchor.setAttribute("download", `resultados-psicologo-${stamp}.csv`);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      notify.success("Exportación generada correctamente.");
    } catch {
      notify.error("No fue posible generar la exportación detallada.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PsychologistLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0D4A8C]">
            Exportación clínica
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#102D69]">
            Resultados de estudiantes asociados
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Filtra resultados por prueba, estado y prioridad para análisis clínico
            y exportación en CSV.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#102D69]">
                Filtros y vista previa
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Esta vista muestra registros agregados. La exportación CSV se
                genera con detalle por pregunta (label y value de opción).
              </p>
            </div>
            <button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="rounded-xl bg-[#102D69] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4A8C] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isExporting ? "Generando CSV..." : "Exportar CSV"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value }))
              }
              placeholder="Buscar por estudiante, correo, código o prueba"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            />

            <select
              value={filters.testId || "all"}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, testId: event.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="all">Todas las pruebas</option>
              {(exportResults?.availableTests || []).map((testOption) => (
                <option key={testOption.value} value={testOption.value}>
                  {testOption.label} ({testOption.count})
                </option>
              ))}
            </select>

            <select
              value={filters.status || "completed"}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value as PsychologistStudentResultsFilters["status"],
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="completed">Completadas</option>
              <option value="pending_review">Pendientes de revisión</option>
              <option value="in_progress">En progreso</option>
              <option value="assigned">Asignadas</option>
              <option value="expired">Vencidas</option>
              <option value="all">Todas</option>
            </select>

            <select
              value={filters.priority || "all"}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: event.target.value as PsychologistStudentResultsFilters["priority"],
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>

            <select
              value={filters.caseStatus || "all"}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  caseStatus: event.target.value as PsychologistStudentResultsFilters["caseStatus"],
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="all">Todos los estados del caso</option>
              <option value="critical">Crítico</option>
              <option value="pending_review">Pendiente de revisión</option>
              <option value="in_progress">En evaluación</option>
              <option value="follow_up">Seguimiento</option>
              <option value="stable">Estable</option>
              <option value="new">Caso nuevo</option>
            </select>

            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, fromDate: event.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            />

            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, toDate: event.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            />

            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(filters.onlyWithInterpretation)}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    onlyWithInterpretation: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-[#00A0B7] focus:ring-[#00A0B7]"
              />
              Solo con interpretación
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatPill
              label="Registros filtrados"
              value={exportResults?.totals.totalRows ?? 0}
            />
            <StatPill
              label="Estudiantes únicos"
              value={exportResults?.totals.uniqueStudents ?? 0}
            />
            <StatPill
              label="Prioridad alta"
              value={exportResults?.totals.highPriorityRows ?? 0}
            />
            <StatPill
              label="Pendientes revisión"
              value={exportResults?.totals.pendingReviewRows ?? 0}
            />
            <StatPill
              label="Registros críticos"
              value={exportResults?.totals.criticalRows ?? 0}
            />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-500">Cargando resultados filtrados...</p>
              </div>
            ) : (exportResults?.rows.length || 0) === 0 ? (
              <EmptyState message="No hay resultados para los filtros seleccionados." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Estudiante</th>
                      <th className="px-4 py-3">Prueba</th>
                      <th className="px-4 py-3">Puntaje</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Prioridad</th>
                      <th className="px-4 py-3">Interpretación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {exportResults?.rows.slice(0, 25).map((row) => (
                      <tr key={row.assignmentId}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{row.studentName}</p>
                          <p className="text-xs text-slate-500">{row.studentCode}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{row.testTitle}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.totalScore ?? "Sin cálculo"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {statusLabel[row.assignmentStatus] || row.assignmentStatus}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {priorityLabel[row.priority] || row.priority}
                        </td>
                        <td className="max-w-sm px-4 py-3 text-slate-700">
                          {row.interpretation || "Sin interpretación"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Vista previa de los primeros 25 registros.
            {isFetching ? " Actualizando filtros..." : ""}
          </p>
        </section>
      </div>
    </PsychologistLayout>
  );
}

PsychologistExportsPage.auth = "psychologist";

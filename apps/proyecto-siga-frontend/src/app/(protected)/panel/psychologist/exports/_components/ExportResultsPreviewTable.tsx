import { PsychologistStudentResultExportRow } from "@packages/common-types/psychologist.types";
import { EmptyState } from "./EmptyState";
import { priorityLabel, statusLabel } from "./exports.constants";

type ExportResultsPreviewTableProps = {
  isLoading: boolean;
  rows: PsychologistStudentResultExportRow[];
};

export function ExportResultsPreviewTable({ isLoading, rows }: ExportResultsPreviewTableProps) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200">
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
          <p className="mt-4 text-slate-500">Cargando resultados filtrados...</p>
        </div>
      ) : rows.length === 0 ? (
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
              {rows.slice(0, 25).map((row) => (
                <tr key={row.assignmentId}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.studentName}</p>
                    <p className="text-xs text-slate-500">{row.studentCode}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.testTitle}</td>
                  <td className="px-4 py-3 text-slate-700">{row.totalScore ?? "Sin cálculo"}</td>
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
  );
}

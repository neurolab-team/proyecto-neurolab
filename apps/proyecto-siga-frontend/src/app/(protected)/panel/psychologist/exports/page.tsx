"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import PsychologistLayout from "../_components/PsychologistLayout";
import { usersService } from "@/services/users/users";
import { notify } from "@/libs/toastService";
import {
  PsychologistStudentResultsFilters,
} from "@packages/common-types/psychologist.types";
import { createResultsCsv } from "./_components/exports.csv";
import { ExportResultsFilters } from "./_components/ExportResultsFilters";
import { ExportResultsPreviewTable } from "./_components/ExportResultsPreviewTable";
import { StatPill } from "./_components/StatPill";

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

          <ExportResultsFilters
            filters={filters}
            availableTests={exportResults?.availableTests || []}
            onFiltersChange={setFilters}
          />

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

          <ExportResultsPreviewTable
            isLoading={isLoading}
            rows={exportResults?.rows || []}
          />

          <p className="mt-3 text-xs text-slate-500">
            Vista previa de los primeros 25 registros.
            {isFetching ? " Actualizando filtros..." : ""}
          </p>
        </section>
      </div>
    </PsychologistLayout>
  );
}

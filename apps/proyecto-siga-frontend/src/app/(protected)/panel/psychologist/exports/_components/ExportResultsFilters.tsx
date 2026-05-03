import { PsychologistStudentResultsFilters } from "@packages/common-types/psychologist.types";

type TestOption = {
  value: string;
  label: string;
  count: number;
};

type ExportResultsFiltersProps = {
  filters: PsychologistStudentResultsFilters;
  availableTests: TestOption[];
  onFiltersChange: (updater: (prev: PsychologistStudentResultsFilters) => PsychologistStudentResultsFilters) => void;
};

export function ExportResultsFilters({
  filters,
  availableTests,
  onFiltersChange,
}: ExportResultsFiltersProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <input
        type="text"
        value={filters.search || ""}
        onChange={(event) =>
          onFiltersChange((prev) => ({ ...prev, search: event.target.value }))
        }
        placeholder="Buscar por estudiante, correo, código o prueba"
        className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
      />

      <select
        value={filters.testId || "all"}
        onChange={(event) =>
          onFiltersChange((prev) => ({ ...prev, testId: event.target.value }))
        }
        className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
      >
        <option value="all">Todas las pruebas</option>
        {availableTests.map((testOption) => (
          <option key={testOption.value} value={testOption.value}>
            {testOption.label} ({testOption.count})
          </option>
        ))}
      </select>

      <select
        value={filters.status || "completed"}
        onChange={(event) =>
          onFiltersChange((prev) => ({
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
          onFiltersChange((prev) => ({
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
          onFiltersChange((prev) => ({
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
          onFiltersChange((prev) => ({ ...prev, fromDate: event.target.value }))
        }
        className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
      />

      <input
        type="date"
        value={filters.toDate || ""}
        onChange={(event) =>
          onFiltersChange((prev) => ({ ...prev, toDate: event.target.value }))
        }
        className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
      />

      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(filters.onlyWithInterpretation)}
          onChange={(event) =>
            onFiltersChange((prev) => ({
              ...prev,
              onlyWithInterpretation: event.target.checked,
            }))
          }
          className="h-4 w-4 rounded border-slate-300 text-[#00A0B7] focus:ring-[#00A0B7]"
        />
        Solo con interpretación
      </label>
    </div>
  );
}

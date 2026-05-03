type AssignableTest = {
  testId: string;
  title: string;
};

type BulkAssignSectionProps = {
  selectedStudentCount: number;
  selectedTestId: string;
  bulkDueAt: string;
  assignableTests: AssignableTest[];
  visibleStudentsCount: number;
  canSubmitBulkAssign: boolean;
  isAssigning: boolean;
  onSelectedTestChange: (value: string) => void;
  onBulkDueAtChange: (value: string) => void;
  onToggleAllVisibleStudents: () => void;
  onSubmit: () => void;
};

export function BulkAssignSection({
  selectedStudentCount,
  selectedTestId,
  bulkDueAt,
  assignableTests,
  visibleStudentsCount,
  canSubmitBulkAssign,
  isAssigning,
  onSelectedTestChange,
  onBulkDueAtChange,
  onToggleAllVisibleStudents,
  onSubmit,
}: BulkAssignSectionProps) {
  return (
    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#102D69]">Asignación masiva</h2>
          <p className="mt-2 text-sm text-slate-600">
            Selecciona una prueba y asígnala a múltiples estudiantes visibles en el listado.
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {selectedStudentCount} estudiante(s) seleccionado(s)
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <select
          value={selectedTestId}
          onChange={(event) => onSelectedTestChange(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        >
          <option value="">Selecciona una prueba</option>
          {assignableTests.map((test) => (
            <option key={test.testId} value={test.testId}>
              {test.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={bulkDueAt}
          onChange={(event) => onBulkDueAtChange(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        />

        <button
          onClick={onToggleAllVisibleStudents}
          type="button"
          className="rounded-xl border border-[#102D69] px-4 py-3 text-sm font-semibold text-[#102D69] transition-all hover:bg-[#102D69] hover:text-white"
        >
          Seleccionar visibles ({visibleStudentsCount})
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmitBulkAssign || isAssigning}
          className="rounded-xl bg-[#102D69] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0D4A8C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAssigning ? "Asignando..." : "Asignar prueba"}
        </button>
      </div>
    </section>
  );
}

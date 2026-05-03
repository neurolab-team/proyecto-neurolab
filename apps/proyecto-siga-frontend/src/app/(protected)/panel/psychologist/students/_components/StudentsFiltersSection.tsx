type StudentsFiltersSectionProps = {
  search: string;
  userTypeFilter: string;
  caseStatusFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onUserTypeChange: (value: string) => void;
  onCaseStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
};

export function StudentsFiltersSection({
  search,
  userTypeFilter,
  caseStatusFilter,
  priorityFilter,
  onSearchChange,
  onUserTypeChange,
  onCaseStatusChange,
  onPriorityChange,
}: StudentsFiltersSectionProps) {
  return (
    <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, correo o identificación"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        />

        <select
          value={userTypeFilter}
          onChange={(event) => onUserTypeChange(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        >
          <option value="all">Todos los tipos</option>
          <option value="itmStudent">Estudiante ITM</option>
          <option value="itmEmployee">Empleado ITM</option>
          <option value="external">Externo</option>
        </select>

        <select
          value={caseStatusFilter}
          onChange={(event) => onCaseStatusChange(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        >
          <option value="all">Todos los estados</option>
          <option value="critical">Crítico</option>
          <option value="pending_review">Pendiente de revisión</option>
          <option value="in_progress">En evaluación</option>
          <option value="follow_up">Seguimiento</option>
          <option value="stable">Estable</option>
          <option value="new">Caso nuevo</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>
    </section>
  );
}

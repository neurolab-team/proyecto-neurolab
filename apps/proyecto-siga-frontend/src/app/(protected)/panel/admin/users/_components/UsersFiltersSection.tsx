type UsersFiltersSectionProps = {
  emailFilter: string;
  verificationFilter: "all" | "verified" | "pending";
  assignmentFilter: "all" | "assigned" | "unassigned";
  onEmailFilterChange: (value: string) => void;
  onVerificationFilterChange: (value: "all" | "verified" | "pending") => void;
  onAssignmentFilterChange: (value: "all" | "assigned" | "unassigned") => void;
};

export function UsersFiltersSection({
  emailFilter,
  verificationFilter,
  assignmentFilter,
  onEmailFilterChange,
  onVerificationFilterChange,
  onAssignmentFilterChange,
}: UsersFiltersSectionProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Buscar por correo electrónico
      </label>
      <input
        type="text"
        placeholder="usuario@correo.com"
        value={emailFilter}
        onChange={(event) => onEmailFilterChange(event.target.value)}
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-[#00A0B7] focus:ring-2 focus:ring-[#00A0B7]"
      />

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Estado de verificación de correo
        </label>
        <select
          value={verificationFilter}
          onChange={(event) =>
            onVerificationFilterChange(
              event.target.value as "all" | "verified" | "pending",
            )
          }
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-[#00A0B7] focus:ring-2 focus:ring-[#00A0B7]"
        >
          <option value="all">Todos</option>
          <option value="verified">Verificados</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Estado de asignación psicológica
        </label>
        <select
          value={assignmentFilter}
          onChange={(event) =>
            onAssignmentFilterChange(
              event.target.value as "all" | "assigned" | "unassigned",
            )
          }
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-[#00A0B7] focus:ring-2 focus:ring-[#00A0B7]"
        >
          <option value="all">Todos</option>
          <option value="unassigned">Sin psicólogo</option>
          <option value="assigned">Con psicólogo</option>
        </select>
      </div>
    </div>
  );
}

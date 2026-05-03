import { User, UserRole } from "@packages/common-types/user.types";

type UsersTableProps = {
  users: User[];
  psychologists: User[];
  isUpdatingRole: boolean;
  isAssigningPsychologist: boolean;
  getRoleBadgeColor: (role: string) => string;
  onUpdateRole: (payload: { userId: string; role: UserRole }) => void;
  onAssignPsychologist: (payload: { userId: string; psychologistId: string | null }) => void;
};

export function UsersTable({
  users,
  psychologists,
  isUpdatingRole,
  isAssigningPsychologist,
  getRoleBadgeColor,
  onUpdateRole,
  onAssignPsychologist,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Nombre</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Correo</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Identificación</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Tipo</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Rol</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Psicólogo asignado</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Estado</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-700">Correo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((currentUser) => (
            <tr
              key={currentUser.userId}
              className="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-4 py-4">{currentUser.name}</td>
              <td className="px-4 py-4 text-gray-600">{currentUser.email}</td>
              <td className="px-4 py-4 text-gray-600">{currentUser.userNumber}</td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">
                  {currentUser.userType === "itmStudent"
                    ? "Estudiante ITM"
                    : currentUser.userType === "itmEmployee"
                      ? "Empleado ITM"
                      : "Externo"}
                </span>
              </td>
              <td className="px-4 py-4">
                {currentUser.role === "user" ? (
                  <span
                    className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold ${getRoleBadgeColor(
                      currentUser.role,
                    )}`}
                  >
                    Usuario
                  </span>
                ) : (
                  <select
                    value={currentUser.role}
                    onChange={(event) =>
                      onUpdateRole({
                        userId: currentUser.userId,
                        role: event.target.value as UserRole,
                      })
                    }
                    disabled={isUpdatingRole}
                    className={`cursor-pointer rounded-lg border-0 px-3 py-1 text-sm font-semibold ${getRoleBadgeColor(
                      currentUser.role,
                    )}`}
                  >
                    <option value="psychologist">Psicólogo</option>
                    <option value="admin">Administrador</option>
                  </select>
                )}
              </td>
              <td className="px-4 py-4">
                {currentUser.role === "user" ? (
                  <select
                    value={currentUser.assignedPsychologistId ?? ""}
                    onChange={(event) =>
                      onAssignPsychologist({
                        userId: currentUser.userId,
                        psychologistId:
                          event.target.value.trim().length > 0
                            ? event.target.value
                            : null,
                      })
                    }
                    disabled={isAssigningPsychologist}
                    className="w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="">Sin asignar</option>
                    {psychologists.map((psychologist) => (
                      <option key={psychologist.userId} value={psychologist.userId}>
                        {psychologist.name || psychologist.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm text-slate-400">No aplica</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                    currentUser.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentUser.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                    currentUser.verifiedEmail
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {currentUser.verifiedEmail ? "Verificado" : "Pendiente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No se encontraron usuarios con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}

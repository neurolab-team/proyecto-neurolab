import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/compat/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../hooks/useAuth";
import { usersService } from "../../../services/users/users";
import { User, UserRole } from "@packages/common-types/user.types";

const AdminUsersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [emailFilter, setEmailFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "pending"
  >("all");
  const [assignmentFilter, setAssignmentFilter] = useState<
    "all" | "assigned" | "unassigned"
  >("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!router?.isReady) return;
    const queryFilter =
      typeof router.query.assignment === "string"
        ? router.query.assignment
        : "all";

    if (queryFilter === "assigned" || queryFilter === "unassigned") {
      setAssignmentFilter(queryFilter);
      return;
    }

    setAssignmentFilter("all");
  }, [router?.isReady, router?.query.assignment]);

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled: !!user,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      usersService.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const assignPsychologistMutation = useMutation({
    mutationFn: ({
      userId,
      psychologistId,
    }: {
      userId: string;
      psychologistId: string | null;
    }) =>
      usersService.assignPsychologist(userId, { psychologistId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users: User[] = usersData?.data || [];
  const psychologists = users.filter(
    (currentUser) => currentUser.role === "psychologist" && currentUser.isActive,
  );
  const filteredUsers = users.filter((currentUser) =>
    currentUser.email.toLowerCase().includes(emailFilter.toLowerCase()),
  );

  const finalFilteredUsers = filteredUsers.filter((currentUser) => {
    if (verificationFilter === "verified") return currentUser.verifiedEmail;
    if (verificationFilter === "pending") return !currentUser.verifiedEmail;
    return true;
  });

  const assignmentFilteredUsers = finalFilteredUsers.filter((currentUser) => {
    if (assignmentFilter === "all") return true;
    if (currentUser.role !== "user") return false;

    if (assignmentFilter === "assigned") {
      return Boolean(currentUser.assignedPsychologistId);
    }

    return !currentUser.assignedPsychologistId;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "psychologist":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <Link href="/panel/admin/" className="transition-colors hover:text-[#0D4A8C]">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span className="text-[#0D4A8C]">Usuarios</span>
                </div>

                <h1 className="mt-3 text-4xl font-bold text-[#102D69]">
                  Usuarios
                </h1>
                <p className="mt-2 text-slate-600">
                  Vista general de usuarios de la plataforma. Desde aquí dejamos
                  centralizado el listado que antes estaba en el dashboard.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar por correo electrónico
              </label>
              <input
                type="text"
                placeholder="usuario@correo.com"
                value={emailFilter}
                onChange={(event) => setEmailFilter(event.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-[#00A0B7] focus:ring-2 focus:ring-[#00A0B7]"
              />

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estado de verificación de correo
                </label>
                <select
                  value={verificationFilter}
                  onChange={(event) =>
                    setVerificationFilter(
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
                    setAssignmentFilter(
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

            {loadingUsers ? (
              <div className="py-12 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-600">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Nombre
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Correo
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Identificación
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Tipo
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Rol
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Psicólogo asignado
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Estado
                      </th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700">
                        Correo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentFilteredUsers.map((currentUser) => (
                      <tr
                        key={currentUser.userId}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">{currentUser.name}</td>
                        <td className="px-4 py-4 text-gray-600">
                          {currentUser.email}
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {currentUser.userNumber}
                        </td>
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
                                updateRoleMutation.mutate({
                                  userId: currentUser.userId,
                                  role: event.target.value as UserRole,
                                })
                              }
                              disabled={updateRoleMutation.isPending}
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
                                assignPsychologistMutation.mutate({
                                  userId: currentUser.userId,
                                  psychologistId:
                                    event.target.value.trim().length > 0
                                      ? event.target.value
                                      : null,
                                })
                              }
                              disabled={assignPsychologistMutation.isPending}
                              className="w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                            >
                              <option value="">Sin asignar</option>
                              {psychologists.map((psychologist) => (
                                <option
                                  key={psychologist.userId}
                                  value={psychologist.userId}
                                >
                                  {psychologist.name || psychologist.email}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No aplica
                            </span>
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

                {assignmentFilteredUsers.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">
                      No se encontraron usuarios con los filtros aplicados
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-slate-600">
              Total de usuarios: {assignmentFilteredUsers.length}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

AdminUsersPage.auth = "admin";
export default AdminUsersPage;

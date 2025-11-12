"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RegisterModal from "../components/RegisterModal";
import { useAuth } from "../hooks/useAuth";
import { usersService } from "../services/users/users";

type User = {
  userId: string;
  userNumber: string;
  email: string;
  name: string;
  role: string;
  userType: string;
  isActive: boolean;
  verifiedEmail: boolean;
};

export default function AdminPanel() {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();
  const [emailFilter, setEmailFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(accessToken!),
    enabled: !!accessToken && user?.role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      usersService.updateRole(accessToken!, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading || !user || user.role !== "admin") {
    return null;
  }

  const users: User[] = usersData?.data || [];
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(emailFilter.toLowerCase()),
  );

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#102D69] mb-2">
                  Panel de Administración
                </h1>
                <p className="text-gray-600">Gestión de usuarios del sistema</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Crear Usuario</span>
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Filtrar por correo electrónico..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
              />
            </div>

            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A0B7]"></div>
                <p className="mt-4 text-gray-600">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Nombre
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Correo
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Identificación
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Tipo
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Rol
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.userId}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">{u.name}</td>
                        <td className="py-4 px-4 text-gray-600">{u.email}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {u.userNumber}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {u.userType === "itmStudent"
                              ? "Estudiante ITM"
                              : u.userType === "itmEmployee"
                                ? "Empleado ITM"
                                : "Externo"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateRoleMutation.mutate({
                                userId: u.userId,
                                role: e.target.value,
                              })
                            }
                            disabled={updateRoleMutation.isPending}
                            className={`px-3 py-1 rounded-lg font-semibold text-sm ${getRoleBadgeColor(
                              u.role,
                            )} border-0 cursor-pointer`}
                          >
                            <option value="user">Usuario</option>
                            <option value="psychologist">Psicólogo</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                              u.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron usuarios con ese correo
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              Total de usuarios: {filteredUsers.length}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <RegisterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isAdminMode={true}
        accessToken={accessToken!}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />
    </div>
  );
}

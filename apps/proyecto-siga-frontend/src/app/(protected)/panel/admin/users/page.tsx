"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UsersFiltersSection } from "./_components/UsersFiltersSection";
import { UsersTable } from "./_components/UsersTable";
import { useAdminUsersPage } from "./_hooks/useAdminUsersPage";

const AdminUsersPage = () => {
  const {
    emailFilter,
    setEmailFilter,
    verificationFilter,
    setVerificationFilter,
    assignmentFilter,
    setAssignmentFilter,
    loadingUsers,
    assignmentFilteredUsers,
    psychologists,
    getRoleBadgeColor,
    isUpdatingRole,
    isAssigningPsychologist,
    updateRole,
    assignPsychologist,
  } = useAdminUsersPage();

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
            <UsersFiltersSection
              emailFilter={emailFilter}
              verificationFilter={verificationFilter}
              assignmentFilter={assignmentFilter}
              onEmailFilterChange={setEmailFilter}
              onVerificationFilterChange={setVerificationFilter}
              onAssignmentFilterChange={setAssignmentFilter}
            />

            {loadingUsers ? (
              <div className="py-12 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-600">Cargando usuarios...</p>
              </div>
            ) : (
              <UsersTable
                users={assignmentFilteredUsers}
                psychologists={psychologists}
                isUpdatingRole={isUpdatingRole}
                isAssigningPsychologist={isAssigningPsychologist}
                getRoleBadgeColor={getRoleBadgeColor}
                onUpdateRole={updateRole}
                onAssignPsychologist={assignPsychologist}
              />
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

export default AdminUsersPage;

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAssignedTests } from "./_hooks/useAssignedTests";
import { createLocalStorageProgress } from "@/libs/testProgressStorage";

type AssignedTest = {
  testId: string;
  assignmentId: string;
  title: string;
  description?: string | null;
  status: "in_progress" | "completed" | "assigned" | "expired";
  dueDate: string;
  startDate: string | null;
};

const AssignmentTestPanel = () => {
  const [testTitleFilter, setTestTitleFilter] = useState("");
  const { tests, isLoading, isError } = useAssignedTests();
  const savedIds = useMemo(() => {
    const ids = new Set<string>();

    for (const t of tests) {
      const saved = createLocalStorageProgress(t.assignmentId).load();
      if (saved && Object.keys(saved.answers).length > 0) {
        ids.add(t.assignmentId);
      }
    }

    return ids;
  }, [tests]);

  const hasProgress = (assignmentId: string) => savedIds.has(assignmentId);

  const filteredTests = tests.filter((test: AssignedTest) =>
    (test.title || "").toLowerCase().includes(testTitleFilter.toLowerCase()),
  );

  const getStatusBadge = (status: AssignedTest["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: AssignedTest["status"]) => {
    switch (status) {
      case "completed":
        return "Completada";
      case "in_progress":
        return "En Progreso";
      case "assigned":
        return "Asignada";
      case "expired":
        return "Vencida";
      default:
        return "Desconocido";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#102D69] mb-2">
                  Mis Pruebas Asignadas
                </h1>
                <p className="text-gray-600">
                  Pruebas pendientes y completadas.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Filtrar por nombre de prueba..."
                value={testTitleFilter}
                onChange={(e) => setTestTitleFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A0B7]"></div>
                <p className="mt-4 text-gray-600">Cargando pruebas...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 font-semibold">
                  Hubo un error al cargar tus pruebas. Intenta recargar la
                  página.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Nombre de la Prueba
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Estado
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Fecha de Comienzo
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Fecha de Vencimiento
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test: AssignedTest) => (
                      <tr
                        key={test.assignmentId}
                        data-testid={test.testId}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-800">{test.title}</span>
                          {test.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{test.description}</p>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusBadge(test.status)}`}
                          >
                            {getStatusText(test.status)}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(test.startDate)}
                        </td>

                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(test.dueDate)}
                        </td>

                        <td className="py-4 px-4">
                          {["assigned", "in_progress"].includes(
                            test.status,
                          ) && (
                            <Link href={
                              hasProgress(test.assignmentId)
                                ? `/test/${test.assignmentId}`
                                : `/test/${test.assignmentId}/preview`
                            } passHref>
                              <button className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white px-4 py-2 rounded-lg font-bold hover:shadow-md transition-all duration-300">
                                {test.status === "assigned"
                                  ? (hasProgress(test.assignmentId) ? "Continuar Prueba" : "Comenzar Prueba")
                                  : "Continuar Prueba"}
                              </button>
                            </Link>
                          )}
                          {test.status === "completed" && (
                            <Link href={`/test/results/${test.assignmentId}`} passHref>
                              <button className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white px-4 py-2 rounded-lg font-bold hover:shadow-md transition-all duration-300">
                                Ver Resultados
                              </button>
                            </Link>
                          )}
                          {test.status === "expired" && (
                            <span className="text-red-500 font-medium text-sm">
                              No disponible
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredTests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron pruebas con ese nombre.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              Total de pruebas: {filteredTests.length}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssignmentTestPanel;

"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAssignedTests } from "./_hooks/useAssignedTests";
import { getTestResumePath, hasLocalProgress } from "@/libs/testProgressStorage";

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

  const actionButtonClasses =
    "bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white px-3 py-2.5 rounded-lg font-bold hover:shadow-md transition-all duration-300 w-full sm:w-auto";

  const renderAction = (test: AssignedTest) => {
    if (["assigned", "in_progress"].includes(test.status)) {
      return (
        <Link
          href={getTestResumePath(test.assignmentId)}
          passHref
          className="block w-full sm:w-auto"
        >
          <button className={actionButtonClasses}>
            {hasLocalProgress(test.assignmentId) ||
            test.status === "in_progress"
              ? "Continua Cuestionario"
              : "Comenzar Cuestionario"}
          </button>
        </Link>
      );
    }

    if (test.status === "completed") {
      return (
        <Link
          href={`/test/results/${test.assignmentId}`}
          passHref
          className="block w-full sm:w-auto"
        >
          <button className={actionButtonClasses}>Ver Resultados</button>
        </Link>
      );
    }

    if (test.status === "expired") {
      return (
        <span className="text-red-500 font-medium text-sm">No disponible</span>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102D69] mb-1 sm:mb-2">
                  Mi valoración del sueño
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Cuestionarios pendientes y completados.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar cuestionario..."
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
              <>
                {/* Móvil / tablet: tarjetas */}
                <ul className="flex flex-col gap-4 lg:hidden">
                  {filteredTests.map((test: AssignedTest) => (
                    <li
                      key={test.assignmentId}
                      data-testid={`${test.testId}-card`}
                      className="rounded-2xl border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 break-words">
                            {test.title}
                          </p>
                          {test.description && (
                            <p className="text-xs text-gray-500 mt-1 break-words">
                              {test.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(test.status)}`}
                        >
                          {getStatusText(test.status)}
                        </span>
                      </div>

                      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Comienzo
                          </dt>
                          <dd className="text-gray-700">
                            {formatDate(test.startDate)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Vencimiento
                          </dt>
                          <dd className="text-gray-700">
                            {formatDate(test.dueDate)}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4">{renderAction(test)}</div>
                    </li>
                  ))}
                </ul>

                {/* Escritorio: tabla */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Cuestionario
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Estado
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Fecha de Inicio
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Fecha de Limite
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
                            <span className="font-medium text-gray-800">
                              {test.title}
                            </span>
                            {test.description && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {test.description}
                              </p>
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

                          <td className="py-4 px-4">{renderAction(test)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredTests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron pruebas con ese nombre.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 text-sm text-gray-600">
              Total de cuestionarios: {filteredTests.length}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssignmentTestPanel;

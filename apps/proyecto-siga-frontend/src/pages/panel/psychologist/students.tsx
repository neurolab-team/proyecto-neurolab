import { useEffect, useState } from "react";
import { useRouter } from "next/compat/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import PsychologistLayout from "../../../components/psychologist/PsychologistLayout";
import { usersService } from "../../../services/users/users";
import { assignmentService } from "../../../services/assignment/assignment";
import { notify } from "../../../libs/toastService";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import {
  PsychologistCaseStatus,
  PsychologistPriority,
  PsychologistStudentAssignment,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
} from "@packages/common-types/psychologist.types";

const caseStatusLabel: Record<PsychologistCaseStatus, string> = {
  new: "Caso nuevo",
  in_progress: "En evaluación",
  pending_review: "Pendiente de revisión",
  critical: "Crítico",
  stable: "Estable",
  follow_up: "Seguimiento",
};

const priorityLabel: Record<PsychologistPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const statusLabel: Record<string, string> = {
  assigned: "Asignada",
  in_progress: "En progreso",
  completed: "Completada",
  expired: "Vencida",
};

const priorityBadge: Record<PsychologistPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

const caseStatusBadge: Record<PsychologistCaseStatus, string> = {
  critical: "bg-rose-100 text-rose-700",
  pending_review: "bg-amber-100 text-amber-700",
  follow_up: "bg-sky-100 text-sky-700",
  in_progress: "bg-blue-100 text-blue-700",
  new: "bg-violet-100 text-violet-700",
  stable: "bg-emerald-100 text-emerald-700",
};

function formatDateLabel(value?: string | null, fallback = "Sin fecha") {
  if (!value) return fallback;
  return format(new Date(value), "d 'de' MMM yyyy", { locale: es });
}

function formatDistanceLabel(value?: string | null, fallback = "Sin actividad") {
  if (!value) return fallback;
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: es,
  });
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}

export default function PsychologistStudentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [caseStatusFilter, setCaseStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: students = [], isLoading } = useQuery<
    PsychologistStudentSummary[]
  >({
    queryKey: ["psychologist-students"],
    queryFn: () => usersService.getPsychologistStudents(),
  });

  useEffect(() => {
    if (!router?.isReady) return;
    const nextPriority =
      typeof router.query.priority === "string" ? router.query.priority : "all";
    setPriorityFilter(nextPriority);
  }, [router?.isReady, router?.query.priority]);

  const filteredStudents = students.filter((student) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      student.name.toLowerCase().includes(normalizedSearch) ||
      student.email.toLowerCase().includes(normalizedSearch) ||
      student.userNumber.toLowerCase().includes(normalizedSearch);

    const matchesUserType =
      userTypeFilter === "all" || student.userType === userTypeFilter;
    const matchesCaseStatus =
      caseStatusFilter === "all" || student.caseStatus === caseStatusFilter;
    const matchesPriority =
      priorityFilter === "all" || student.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesUserType &&
      matchesCaseStatus &&
      matchesPriority
    );
  });

  const selectedStudentId =
    typeof router?.query.studentId === "string"
      ? router.query.studentId
      : filteredStudents[0]?.studentId || null;

  useEffect(() => {
    if (!router?.isReady || filteredStudents.length === 0) return;
    const currentStudentId =
      typeof router.query.studentId === "string" ? router.query.studentId : null;
    const existsInFiltered = filteredStudents.some(
      (student) => student.studentId === currentStudentId,
    );

    if (!currentStudentId || !existsInFiltered) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            studentId: filteredStudents[0].studentId,
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [filteredStudents, router]);

  const { data: studentDetail, isLoading: loadingDetail } =
    useQuery<PsychologistStudentProfile>({
      queryKey: ["psychologist-student", selectedStudentId],
      queryFn: () => usersService.getPsychologistStudentById(selectedStudentId!),
      enabled: !!selectedStudentId,
    });

  const reviewMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      assignmentService.markAssignmentAsReviewed(assignmentId),
    onSuccess: () => {
      notify.success("Prueba marcada como revisada.");
      queryClient.invalidateQueries({ queryKey: ["psychologist-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["psychologist-students"] });
      if (selectedStudentId) {
        queryClient.invalidateQueries({
          queryKey: ["psychologist-student", selectedStudentId],
        });
      }
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "No fue posible marcar la prueba como revisada.",
      );
      notify.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  const handleSelectStudent = (studentId: string) => {
    if (!router) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          studentId,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <PsychologistLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0D4A8C]">
            Mis estudiantes
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#102D69]">
            Resumen psicológico del estudiante
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Esta vista consolida contexto, resultados e hitos recientes por
            estudiante para que no tengas que navegar entre pruebas aisladas.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, correo o identificación"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            />

            <select
              value={userTypeFilter}
              onChange={(event) => setUserTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="all">Todos los tipos</option>
              <option value="itmStudent">Estudiante ITM</option>
              <option value="itmEmployee">Empleado ITM</option>
              <option value="external">Externo</option>
            </select>

            <select
              value={caseStatusFilter}
              onChange={(event) => setCaseStatusFilter(event.target.value)}
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
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00A0B7] focus:outline-none focus:ring-2 focus:ring-[#00A0B7]/20"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-[2rem] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-bold text-[#102D69]">
                  Estudiantes
                </h2>
                <p className="text-sm text-slate-500">
                  {filteredStudents.length} visibles
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-500">Cargando estudiantes...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <EmptyState message="No hay estudiantes asignados con esos filtros." />
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => {
                  const isSelected = student.studentId === selectedStudentId;
                  return (
                    <button
                      key={student.studentId}
                      onClick={() => handleSelectStudent(student.studentId)}
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition-all ${
                        isSelected
                          ? "border-[#0D4A8C] bg-[#F2F7FF] shadow-sm"
                          : "border-slate-200 hover:border-[#0D4A8C] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {student.email}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            priorityBadge[student.priority]
                          }`}
                        >
                          {priorityLabel[student.priority]}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            caseStatusBadge[student.caseStatus]
                          }`}
                        >
                          {caseStatusLabel[student.caseStatus]}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {student.completedTestsCount}/{student.assignedTestsCount} pruebas
                        </span>
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p>Última actividad: {formatDistanceLabel(student.lastActivityAt)}</p>
                        <p>
                          Resultado relevante:{" "}
                          {student.latestInterpretation || "Sin resultado aún"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            {loadingDetail ? (
              <div className="py-20 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-500">Cargando resumen del caso...</p>
              </div>
            ) : !studentDetail ? (
              <EmptyState message="Selecciona un estudiante para ver su resumen clínico." />
            ) : (
              <div className="space-y-8">
                <section className="rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-[#102D69] to-[#0D4A8C] p-6 text-white">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-bold">{studentDetail.name}</h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            caseStatusBadge[studentDetail.caseStatus]
                          }`}
                        >
                          {caseStatusLabel[studentDetail.caseStatus]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-blue-100">
                        {studentDetail.userNumber} · {studentDetail.email}
                      </p>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                        {studentDetail.attentionLabel}. Psicólogo responsable:{" "}
                        {studentDetail.assignedPsychologist?.name || "Sin asignar"}.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <StatPill
                        label="Tipo de usuario"
                        value={
                          studentDetail.userType === "itmStudent"
                            ? "Estudiante ITM"
                            : studentDetail.userType === "itmEmployee"
                              ? "Empleado ITM"
                              : "Externo"
                        }
                      />
                      <StatPill
                        label="Edad"
                        value={studentDetail.age ?? "Sin dato"}
                      />
                      <StatPill
                        label="Asignado"
                        value={formatDateLabel(studentDetail.assignedAt)}
                      />
                      <StatPill
                        label="Seguimiento"
                        value={formatDateLabel(
                          studentDetail.followUpAt,
                          "No programado",
                        )}
                      />
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatPill
                    label="Pruebas asignadas"
                    value={studentDetail.assignedTestsCount}
                  />
                  <StatPill
                    label="Pruebas completadas"
                    value={studentDetail.completedTestsCount}
                  />
                  <StatPill
                    label="Pendientes"
                    value={studentDetail.pendingTestsCount}
                  />
                  <StatPill
                    label="Última actividad"
                    value={formatDistanceLabel(studentDetail.lastActivityAt)}
                  />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.75rem] border border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-[#102D69]">
                      Insight global
                    </h3>
                    <div className="mt-4 space-y-3">
                      {studentDetail.insights.map((insight) => (
                        <div
                          key={insight}
                          className="rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                        >
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-[#102D69]">
                      Línea de tiempo
                    </h3>
                    <div className="mt-4 space-y-4">
                      {studentDetail.timeline.slice(0, 8).map((event) => (
                        <div
                          key={`${event.type}-${event.date}-${event.label}`}
                          className="rounded-[1.25rem] border border-slate-200 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {event.label}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                            {formatDateLabel(event.date)} · {formatDistanceLabel(event.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#102D69]">
                        Resultados por prueba
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Cada tarjeta resume estado, resultado e intervención mínima disponible.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {studentDetail.assignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.assignmentId}
                        assignment={assignment}
                        isReviewing={
                          reviewMutation.isPending &&
                          reviewMutation.variables === assignment.assignmentId
                        }
                        onReview={() =>
                          reviewMutation.mutate(assignment.assignmentId)
                        }
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      </div>
    </PsychologistLayout>
  );
}

function AssignmentCard({
  assignment,
  isReviewing,
  onReview,
}: {
  assignment: PsychologistStudentAssignment;
  isReviewing: boolean;
  onReview: () => void;
}) {
  const router = useRouter();
  const attentionClass =
    assignment.attentionLevel === "high"
      ? "bg-rose-100 text-rose-700"
      : assignment.attentionLevel === "medium"
        ? "bg-amber-100 text-amber-700"
        : assignment.attentionLevel === "low"
          ? "bg-sky-100 text-sky-700"
          : "bg-slate-100 text-slate-700";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-bold text-slate-900">
              {assignment.test.title}
            </h4>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabel[assignment.status] || assignment.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${attentionClass}`}>
              {assignment.attentionLevel === "none"
                ? "Sin alerta"
                : `Atención ${assignment.attentionLevel === "high"
                    ? "alta"
                    : assignment.attentionLevel === "medium"
                      ? "media"
                      : "baja"}`}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
            <p>Asignada: {formatDateLabel(assignment.createdAt)}</p>
            <p>Inicio: {formatDateLabel(assignment.startedAt, "No iniciada")}</p>
            <p>Completada: {formatDateLabel(assignment.completedAt, "Pendiente")}</p>
            <p>Revisada: {formatDateLabel(assignment.reviewedAt, "Pendiente")}</p>
          </div>
        </div>

        {assignment.status === "completed" && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (router) {
                  router.push(`/test/results/${assignment.assignmentId}`);
                  return;
                }

                if (typeof window !== "undefined") {
                  window.location.assign(`/test/results/${assignment.assignmentId}`);
                }
              }}
              className="rounded-xl bg-[#00A0B7] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#008a9e]"
            >
              Ver Resultados
            </button>
            {!assignment.reviewedAt && (
              <button
                onClick={onReview}
                disabled={isReviewing}
                className="rounded-xl bg-[#102D69] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0D4A8C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isReviewing ? "Guardando..." : "Marcar revisada"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Puntaje total
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {assignment.result?.totalScore ?? "Sin calcular"}
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Percentil
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {assignment.result?.percentile ?? "No disponible"}
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Interpretación
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {assignment.result?.interpretation || "Pendiente de resultado"}
          </p>
        </div>
      </div>
    </div>
  );
}

PsychologistStudentsPage.auth = "psychologist";

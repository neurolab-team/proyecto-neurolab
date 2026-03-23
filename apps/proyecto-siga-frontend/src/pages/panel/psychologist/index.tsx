import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import PsychologistLayout from "../../../components/psychologist/PsychologistLayout";
import { useAuth } from "../../../hooks/useAuth";
import { assignmentService } from "../../../services/assignment/assignment";
import {
  PsychologistDashboardStats,
  PsychologistDashboardFeed,
} from "@packages/common-types/psychologist.types";

type StatCardProps = {
  label: string;
  value: number;
  accentClassName: string;
};

function StatCard({ label, value, accentClassName }: StatCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-4 h-2 w-16 rounded-full ${accentClassName}`} />
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      {message}
    </div>
  );
}

function formatDateDistance(value?: string | null) {
  if (!value) return "Sin fecha";

  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: es,
  });
}

function PsychologistHome() {
  const { user } = useAuth();

  const { data: stats, isLoading: loadingStats } = useQuery<PsychologistDashboardStats>({
    queryKey: ["psychologist-dashboard-stats"],
    queryFn: () => assignmentService.getDashboardStats(),
    enabled: !!user,
  });

  const { data: feed, isLoading: loadingFeed } = useQuery<PsychologistDashboardFeed>({
    queryKey: ["psychologist-dashboard-feed"],
    queryFn: () => assignmentService.getDashboardFeed(),
    enabled: !!user,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#102D69] via-[#0D4A8C] to-[#00A0B7] px-8 py-10 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">
          Mi Panel Clínico
        </p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Bienvenido, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
          Este espacio prioriza casos, resultados recientes y pendientes de
          revisión para que tu jornada empiece por lo más importante.
        </p>
      </section>

      <section className="mt-8">
        {loadingStats ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
            <p className="mt-4 text-slate-600">Cargando panel clínico...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Estudiantes asignados"
              value={stats?.assignedStudents ?? 0}
              accentClassName="bg-[#102D69]"
            />
            <StatCard
              label="Pendientes de revisión"
              value={stats?.pendingReview ?? 0}
              accentClassName="bg-amber-400"
            />
            <StatCard
              label="Completadas hoy"
              value={stats?.completedToday ?? 0}
              accentClassName="bg-emerald-400"
            />
            <StatCard
              label="Casos con alerta"
              value={stats?.criticalCases ?? 0}
              accentClassName="bg-rose-400"
            />
            <StatCard
              label="Seguimientos pendientes"
              value={stats?.followUpsPending ?? 0}
              accentClassName="bg-sky-400"
            />
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#102D69]">
                Casos que requieren atención
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Prioridad clínica y operativa para empezar la jornada.
              </p>
            </div>
            <Link
              href="/panel/psychologist/students"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0D4A8C] hover:text-[#0D4A8C]"
            >
              Ver estudiantes
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loadingFeed ? (
              <div className="py-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
              </div>
            ) : !feed?.priorityCases.length ? (
              <EmptyCard message="No hay casos priorizados en este momento." />
            ) : (
              feed.priorityCases.map((item) => (
                <Link
                  key={`${item.studentId}-${item.testTitle}-${item.reason}`}
                  href={`/panel/psychologist/students?studentId=${item.studentId}`}
                  className="block rounded-[1.5rem] border border-slate-200 p-5 transition-all hover:border-[#0D4A8C] hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {item.studentName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.testTitle || "Caso clínico"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        item.priority === "high"
                          ? "bg-rose-100 text-rose-700"
                          : item.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.priority === "high"
                        ? "Alta"
                        : item.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-700">
                    {item.reason}
                  </p>
                  {item.interpretation && (
                    <p className="mt-2 text-sm text-slate-500">
                      Interpretación: {item.interpretation}
                    </p>
                  )}
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                    {item.completedAt
                      ? `Completada ${formatDateDistance(item.completedAt)}`
                      : "Sin resultado reciente"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#102D69]">
              Actividad reciente
            </h2>
            <div className="mt-6 space-y-4">
              {loadingFeed ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                </div>
              ) : !feed?.recentActivity.length ? (
                <EmptyCard message="Todavía no hay actividad reciente para mostrar." />
              ) : (
                feed.recentActivity.map((item) => (
                  <Link
                    key={`${item.studentId}-${item.occurredAt}-${item.label}`}
                    href={`/panel/psychologist/students?studentId=${item.studentId}`}
                    className="block rounded-[1.5rem] border border-slate-200 p-4 transition-all hover:border-[#0D4A8C] hover:shadow-md"
                  >
                    <p className="font-semibold text-slate-900">
                      {item.studentName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                      {formatDateDistance(item.occurredAt)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#102D69]">
              Accesos rápidos
            </h2>
            <div className="mt-6 grid gap-3">
              <Link
                href="/panel/psychologist/students"
                className="rounded-[1.25rem] border border-slate-200 px-4 py-4 text-left transition-all hover:border-[#0D4A8C] hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">
                  Ver mis estudiantes
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Accede al resumen clínico consolidado por estudiante.
                </p>
              </Link>
              <Link
                href="/panel/psychologist/students?priority=high"
                className="rounded-[1.25rem] border border-slate-200 px-4 py-4 text-left transition-all hover:border-[#0D4A8C] hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">
                  Ver casos críticos
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Filtra rápidamente los estudiantes con alertas severas.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

PsychologistHome.auth = "psychologist";

export default function PsychologistHomePage() {
  return (
    <PsychologistLayout>
      <PsychologistHome />
    </PsychologistLayout>
  );
}

PsychologistHomePage.auth = "psychologist";

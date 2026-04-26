import Link from "next/link";
import { useRouter } from "next/compat/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../hooks/useAuth";
import { useModal } from "../../../hooks/useModal";
import { usersService } from "../../../services/users/users";
import { User } from "@packages/common-types/user.types";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  accentClassName: string;
};

type QuickActionCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
};

const adminSections = [
  { label: "Dashboard", status: "Activo ahora" },
  { label: "Usuarios", status: "Disponible ahora" },
  { label: "Psicólogos", status: "Siguiente paso" },
  { label: "Asignaciones", status: "Siguiente paso" },
];

function StatCard({
  label,
  value,
  description,
  accentClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-4 h-2 w-16 rounded-full ${accentClassName}`} />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  ctaLabel,
  onClick,
  disabled = false,
}: QuickActionCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-xl font-bold text-[#102D69]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          disabled
            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
            : "bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white hover:shadow-lg"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

const AdminPanel = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled: !!user,
  });

  const users: User[] = usersData?.data || [];
  const psychologistsCount = users.filter(
    (currentUser) => currentUser.role === "psychologist",
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#102D69] via-[#0D4A8C] to-[#00A0B7] px-8 py-10 text-white shadow-2xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">
                Panel Admin
              </p>
              <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Dashboard de administración
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
                Esta vista ahora funciona como entrada principal del panel. La
                gestión detallada de usuarios, psicólogos y asignaciones la
                iremos separando paso a paso en sus propias pantallas.
              </p>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102D69]">
                  Navegación del panel
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  En este primer paso dejamos activo el Dashboard y visibles las
                  siguientes áreas sin adelantar todavía sus implementaciones.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {adminSections.map((section) => (
                  <div
                    key={section.label}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      section.label === "Dashboard" || section.label === "Usuarios"
                        ? "border-[#00A0B7] bg-cyan-50 text-[#0D4A8C]"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {section.label} · {section.status}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Link
                href="/panel/admin/users"
                className="inline-flex rounded-xl border border-[#00A0B7] px-4 py-3 text-sm font-semibold text-[#0D4A8C] transition-all hover:bg-cyan-50"
              >
                Ir a la vista de usuarios
              </Link>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#102D69]">
                Resumen general
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Mostramos primero las métricas que hoy sí salen del contrato
                actual. Las de asignación se dejan visibles, pero marcadas como
                pendientes para no inventar relaciones nuevas sin tu permiso.
              </p>
            </div>

            {loadingUsers ? (
              <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
                <p className="mt-4 text-slate-600">Cargando resumen...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Total de usuarios"
                  value={users.length}
                  description="Cantidad total de cuentas registradas en la plataforma."
                  accentClassName="bg-[#102D69]"
                />
                <StatCard
                  label="Total de psicólogos"
                  value={psychologistsCount}
                  description="Usuarios que actualmente tienen rol de psicólogo."
                  accentClassName="bg-[#00A0B7]"
                />
                <StatCard
                  label="Usuarios sin asignación"
                  value="Pendiente"
                  description="Este indicador queda listo para conectarse cuando definamos la asignación administrativa."
                  accentClassName="bg-amber-400"
                />
                <StatCard
                  label="Evaluaciones pendientes"
                  value="Pendiente"
                  description="La métrica queda reservada hasta definir la fuente exacta para este dashboard."
                  accentClassName="bg-rose-400"
                />
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#102D69]">
                Accesos rápidos
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Dejé disponible solo la acción que ya existe hoy. Las demás
                quedan visibles como parte del flujo nuevo que vamos a construir
                después contigo.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <QuickActionCard
                title="Crear usuario"
                description="Abre el flujo actual de creación de usuarios desde administración."
                ctaLabel="Crear usuario"
                onClick={() =>
                  openModal("register", {
                    isAdminMode: true,
                    onSuccess: () => {
                      void queryClient.invalidateQueries({
                        queryKey: ["users"],
                      });
                    },
                  })
                }
              />
              <QuickActionCard
                title="Asignar psicólogo"
                description="Lleva directo al listado de usuarios filtrado por estudiantes sin psicólogo para asignación rápida."
                ctaLabel="Ir a asignaciones"
                onClick={() => {
                  if (router) {
                    router.push("/panel/admin/users?assignment=unassigned");
                    return;
                  }

                  if (typeof window !== "undefined") {
                    window.location.assign("/panel/admin/users?assignment=unassigned");
                  }
                }}
              />
              <QuickActionCard
                title="Ver usuarios sin asignar"
                description="Queda reservado para la siguiente iteración, junto con la métrica del dashboard."
                ctaLabel="Próximo paso"
                disabled
              />
              <QuickActionCard
                title="Ver reportes"
                description="Lo dejamos visible desde ya, pero sin abrir una ruta nueva hasta que la definamos contigo."
                ctaLabel="Próximo paso"
                disabled
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

AdminPanel.auth = "admin";

export default AdminPanel;

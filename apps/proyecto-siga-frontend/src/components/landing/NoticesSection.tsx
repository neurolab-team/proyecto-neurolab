import Link from "next/link";
import { FileText, Users, Leaf, ArrowRight, type LucideIcon } from "lucide-react";
import { COLORS, NOTICE_LINKS, SUPPORT } from "./landingContent";

function IconBadge({ icon: Icon, bg, color }: { icon: LucideIcon; bg: string; color: string }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bg }}
    >
      <Icon size={20} strokeWidth={1.75} style={{ color }} aria-hidden="true" />
    </div>
  );
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold underline underline-offset-2 hover:opacity-80"
      style={{ color: COLORS.primary }}
    >
      {children}
    </Link>
  );
}

export default function NoticesSection() {
  return (
    <section className="w-full px-6 pt-16 pb-16" style={{ backgroundColor: COLORS.surface }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-8">
            <IconBadge icon={FileText} bg="#E3ECF9" color={COLORS.primary} />
            <div className="text-base text-slate-600 leading-relaxed">
              <h2 className="mb-2 text-2xl font-bold" style={{ color: COLORS.ink }}>
                No es un examen ni un diagnóstico
              </h2>
              <p>
                Tus resultados son orientativos y están pensados para ayudarte a comprender mejor
                tus hábitos de sueño.
              </p>
              <p className="mt-2">
                Si tienes inquietudes sobre tu sueño, habla con un profesional de la salud.
              </p>
            </div>
          </div>

          <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-8">
            <IconBadge icon={Users} bg="#E3ECF9" color={COLORS.primary} />
            <div className="text-base text-slate-600 leading-relaxed">
              <h2 className="mb-2 text-2xl font-bold" style={{ color: COLORS.ink }}>
                Sobre el proyecto
              </h2>
              <p>
                NeuroLab es un proyecto académico y no comercial de la Institución Universitaria
                ITM.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                <InlineLink href={NOTICE_LINKS.informedConsent}>Consentimiento informado</InlineLink>
                <InlineLink href={NOTICE_LINKS.dataPolicy}>Tratamiento de datos</InlineLink>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col lg:flex-row lg:items-center gap-6 rounded-2xl border p-8"
          style={{ backgroundColor: "#FBF4EF", borderColor: "#F0E2D8" }}
        >
          <div className="flex flex-1 gap-5">
            <IconBadge icon={Leaf} bg="#F8E2D3" color="#C2652A" />
            <div className="text-base text-slate-600 leading-relaxed">
              <h2 className="mb-2 text-2xl font-bold" style={{ color: COLORS.ink }}>
                ¿Necesitas apoyo?
              </h2>
              <p>
                Si estás atravesando una situación que te preocupa, acércate a Enfermería del ITM (
                {SUPPORT.nursingHours}), donde te atenderán profesionales en Psicología, o escribe a{" "}
                <a
                  href={`mailto:${SUPPORT.email}`}
                  className="font-semibold underline underline-offset-2 hover:opacity-80"
                  style={{ color: COLORS.primary }}
                >
                  {SUPPORT.email}
                </a>
                .
              </p>
              <p className="mt-2">
                En caso de emergencia, llama a la línea{" "}
                <strong style={{ color: COLORS.ink }}>{SUPPORT.emergencyLine}</strong>.
              </p>
            </div>
          </div>
          <Link
            href={NOTICE_LINKS.careRoutes}
            className="self-start lg:self-center shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold transition-all hover:bg-blue-50"
            style={{ color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` }}
          >
            Ver rutas de atención del ITM <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

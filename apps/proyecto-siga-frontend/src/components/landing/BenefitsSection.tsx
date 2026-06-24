import LandingSection from "./LandingSection";
import { COLORS, BENEFITS } from "./landingContent";
import { ArrowRight} from "lucide-react";

export default function BenefitsSection() {
  return (
    <LandingSection id="info" background="surface">
      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <h2
          className="text-4xl lg:text-5xl font-extrabold leading-tight"
          style={{ color: COLORS.ink }}
        >
          Una conversación contigo mism@, con respaldo profesional
        </h2>
        <div>
          <p className="text-base text-slate-600 leading-relaxed mb-5">
            No es un examen ni un diagnóstico. Son escalas reconocidas que ayudan al
            equipo de psicología a entender cómo estás y a acompañarte mejor. Tú
            respondes; ell@s leen e interpretan contigo.
          </p>
          <a
            href="#empezar"
            className="inline-flex items-center gap-1 text-sm font-bold hover:underline"
            style={{ color: COLORS.primary }}
          >
            Conoce al equipo de Permanencia  <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BENEFITS.map(({ icon: Icon, iconBg, title, description }) => (
          <div key={title} className="bg-white rounded-2xl p-8 shadow-sm">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: iconBg }}
            >
              <Icon size={22} color="white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.ink }}>
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}

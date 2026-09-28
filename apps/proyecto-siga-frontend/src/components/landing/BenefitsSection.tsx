import LandingSection from "./LandingSection";
import { COLORS} from "./landingContent";
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
          Una conversación contigo mism@, basada en instrumentos reconocidos
        </h2>
        <div>
          <p className="text-base text-slate-600 leading-relaxed mb-5">
            No es un examen ni un diagnóstico. Son escalas reconocidas que ayudan al
            equipo de psicología a entender cómo estás y a acompañarte mejor. Tú
            respondes; ell@s leen e interpretan contigo.
          </p>
        </div>
      </div>
    </LandingSection>
  );
}

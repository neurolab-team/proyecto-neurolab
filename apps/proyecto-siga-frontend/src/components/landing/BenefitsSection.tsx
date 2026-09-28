import LandingSection from "./LandingSection";
import { COLORS} from "./landingContent";

export default function BenefitsSection() {
  return (
    <LandingSection id="info" background="surface">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <h2
          className="text-4xl lg:text-5xl font-extrabold leading-tight"
          style={{ color: COLORS.ink }}
        >
          Una herramienta para conocer mejor tu sueño
        </h2>
        <div>
          <p className="text-base text-slate-600 leading-relaxed mb-5">
            No es un examen ni un diagnóstico. Sus resultados son orientativos y están pensados para ayudarte a
            comprender mejor tus hábitos de sueño
          </p>
        </div>
      </div>
    </LandingSection>
  );
}

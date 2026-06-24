import LandingSection from "./LandingSection";
import { COLORS, STEPS } from "./landingContent";

function StepDot({ color, filled }: { color: string; filled: boolean }) {
  if (filled) {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    );
  }
  return (
    <div
      className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
      style={{ borderColor: color }}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

export default function StepsSection() {
  return (
    <LandingSection id="como-funciona" background="white" className="space-y-16">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <h2
          className="text-4xl lg:text-5xl font-extrabold leading-tight"
          style={{ color: COLORS.primary }}
        >
          Cómo funciona
        </h2>
        <p className="text-base text-slate-500 leading-relaxed pt-2">
          Tres pasos simples, sin complicaciones. Desde que recibes una prueba
          hasta que conversas tus resultados con un profesional.
        </p>
      </div>

      {/* Steps timeline */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Dashed connecting line (desktop only) */}
        <div className="hidden md:block absolute top-3 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] border-t-2 border-dashed border-slate-300" />

        {STEPS.map((step) => (
          <div key={step.number} className="flex flex-col gap-4">
            <StepDot color={step.dotColor} filled={step.dotFilled} />
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: step.dotColor }}
              >
                {step.number}
              </p>
              <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.ink }}>
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: step.descriptionColor ?? "#64748b" }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}

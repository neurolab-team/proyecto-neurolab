import LandingSection from "./LandingSection";
import { COLORS, STEPS } from "./landingContent";

export default function StepsSection() {
  return (
    <LandingSection id="como-funciona" background="white" className="space-y-12">
      <h2
        className="text-4xl lg:text-5xl font-extrabold leading-tight"
        style={{ color: COLORS.ink }}
      >
        Cómo funciona
      </h2>

      {/* Steps timeline */}
      <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Línea punteada entre los centros del primer y último círculo (solo desktop) */}
        <div
          aria-hidden
          className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] border-t-2 border-dotted border-slate-300"
        />

        {STEPS.map((step, index) => (
          <li key={step.title} className="relative flex flex-col items-center text-center gap-4">
            {/* El ring blanco abre un hueco en la línea alrededor de cada círculo */}
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ring-8 ring-white"
              style={{ backgroundColor: COLORS.primary }}
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.ink }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 max-w-[16rem] mx-auto">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}

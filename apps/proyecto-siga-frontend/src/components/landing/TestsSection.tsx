import LandingSection from "./LandingSection";
import TestCardsSection from "./TestCardsSection";
import { COLORS } from "./landingContent";

export default function TestsSection() {
  return (
    <LandingSection id="pruebas" background="white">
      <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.ink }}>
        Conoce los aspectos de tu sueño que puedes valorar
      </h2>
      <p className="text-gray-600 mb-8">
        Completa los cuestionarios disponibles para conocer mejor tus patrones de sueño, cronotipo y somnolencia diurna.      </p>
      <TestCardsSection />
    </LandingSection>
  );
}

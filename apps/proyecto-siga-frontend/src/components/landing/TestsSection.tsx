import LandingSection from "./LandingSection";
import TestCardsSection from "./TestCardsSection";
import { COLORS } from "./landingContent";

export default function TestsSection() {
  return (
    <LandingSection id="pruebas" background="white">
      <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.ink }}>
        Pruebas disponibles
      </h2>
      <p className="text-gray-600 mb-8">
        Explora las autoevaluaciones disponibles. Inicia sesión para resolver una prueba.
      </p>
      <TestCardsSection />
    </LandingSection>
  );
}

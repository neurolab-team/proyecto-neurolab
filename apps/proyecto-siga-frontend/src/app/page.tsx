import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import TestsSection from "@/components/landing/TestsSection";
import StepsSection from "@/components/landing/StepsSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import QuickAccessTestsSection from "@/components/quickAccess/QuickAccessTestsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC]">
        {/* Embudo de conversión: gancho -> contenido estrella -> cómo -> garantías -> CTA */}

        {/* 1. Hero — gancho + CTA (estado diferenciado con/sin sesión) */}
        <HeroSection />

        {/* 2. Acceso rápido a pruebas pendientes (solo autenticados) */}
        <QuickAccessTestsSection />

        {/* 3. Pruebas disponibles — el contenido más valioso, arriba del pliegue */}
        <TestsSection />

        {/* 4. Cómo funciona — 3 pasos */}
        <StepsSection />

        {/* 5. Beneficios / garantías — resuelve objeciones (confidencialidad, validez) */}
        <BenefitsSection />

        {/* 6. CTA final — cierre */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}

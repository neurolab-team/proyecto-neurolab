"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import NoticesSection from "@/components/landing/NoticesSection";
import TestsSection from "@/components/landing/TestsSection";
import StepsSection from "@/components/landing/StepsSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

export default function PublicLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC]">
        <HeroSection />
        <TestsSection />
        <NoticesSection />
        <StepsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}

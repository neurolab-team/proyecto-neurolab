"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import NoticesSection from "@/components/landing/NoticesSection";
import QuickAccessTestsSection from "@/components/quickAccess/QuickAccessTestsSection";

export default function UserHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC]">
        <HeroSection />
        <NoticesSection />
        <QuickAccessTestsSection />
      </main>
      <Footer />
    </div>
  );
}

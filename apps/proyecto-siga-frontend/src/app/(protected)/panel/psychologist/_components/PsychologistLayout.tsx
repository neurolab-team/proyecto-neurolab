"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const navItems = [
  {
    label: "Inicio",
    href: "/panel/psychologist",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    disabled: false,
  },
  {
    label: "Mis estudiantes",
    href: "/panel/psychologist/students",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    disabled: false,
  },
  {
    label: "Exportación",
    href: "/panel/psychologist/exports",
    icon: "M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16",
    disabled: false,
  },
];

export default function PsychologistLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 shadow-sm">
          <div className="px-6 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Panel Clínico
            </p>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    if (item.disabled) return;

                    router.push(item.href);
                  }}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive ? "bg-[#102D69] text-white" : ""}
                    ${!isActive && !item.disabled ? "text-slate-600 hover:bg-slate-100" : ""}
                    ${item.disabled ? "text-slate-300 cursor-not-allowed" : ""}
                  `}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs text-slate-300">Próximo</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

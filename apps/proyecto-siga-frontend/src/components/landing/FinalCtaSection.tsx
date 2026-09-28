"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { COLORS } from "./landingContent";

export default function FinalCtaSection() {
  const { openModal } = useModal();

  return (
    <section id="empezar" className="w-full bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-3xl px-8 py-16 flex flex-col items-center text-center gap-6"
          style={{ backgroundColor: COLORS.ctaBg }}
        >
          <Sparkles size={28} className="text-white opacity-90" aria-hidden="true" />

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            ¿List@ para empezar?
          </h2>

          <p className="text-base text-blue-100 max-w-md leading-relaxed">
            Inicia sesión con tu cuenta institucional
          </p>

          <button
            type="button"
            onClick={() => openModal("login")}
            className="flex items-center gap-3 bg-white font-bold text-sm px-8 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg"
            style={{ color: COLORS.ctaBg }}
          >
            Iniciar sesión <ArrowRight size={16} aria-hidden="true" />
          </button>

          <p className="text-xs text-blue-200">
            ¿Problemas para entrar?{" "}
            <a href="#" className="underline hover:text-white transition-colors">
              Escríbele a Neurolab
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

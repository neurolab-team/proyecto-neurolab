"use client";

import { useEffect, useState } from "react";
import {
  Bed,
  Check,
  Clock,
  Coffee,
  Dumbbell,
  LucideIcon,
  Moon,
  RotateCcw,
  Smartphone,
  Sun,
  Thermometer,
  Timer,
  UtensilsCrossed,
} from "lucide-react";

/**
 * Paleta institucional de la app (tailwind.config.js + hex usados en el resto de vistas).
 */
const PALETTE = {
  primaryDark: "#102D69", // primary-dark
  primaryMid: "#0D4A8C",
  primaryLight: "#00A0B7", // primary-light
  success: "#10B981",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F7FB",
  border: "#E2E8F0",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
} as const;

type Recommendation = {
  id: number;
  title: string;
  icon: LucideIcon;
  category: string;
};

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    title:
      "Mantén horarios fijos para dormir y despertar, incluso los fines de semana.",
    icon: Clock,
    category: "Rutina",
  },
  {
    id: 2,
    title:
      "Evita cafeína, energizantes y nicotina al menos 6 horas antes de dormir.",
    icon: Coffee,
    category: "Sustancias",
  },
  {
    id: 3,
    title:
      "Reduce el uso de pantallas (celular, computador) en la hora previa a dormir.",
    icon: Smartphone,
    category: "Estímulos",
  },
  {
    id: 4,
    title:
      "Busca luz natural en la mañana; ayuda a regular tu reloj biológico.",
    icon: Sun,
    category: "Ritmo circadiano",
  },
  {
    id: 5,
    title: "Evita siestas largas o después de las 4 p.m.",
    icon: Moon,
    category: "Rutina",
  },
  {
    id: 6,
    title: "Haz actividad física regular, pero no justo antes de acostarte.",
    icon: Dumbbell,
    category: "Actividad física",
  },
  {
    id: 7,
    title: "Evita comidas pesadas y alcohol cerca de la hora de dormir.",
    icon: UtensilsCrossed,
    category: "Alimentación",
  },
  {
    id: 8,
    title:
      "Mantén tu habitación oscura, silenciosa y a una temperatura fresca.",
    icon: Thermometer,
    category: "Ambiente",
  },
  {
    id: 9,
    title: "Usa la cama solo para dormir, no para estudiar o trabajar.",
    icon: Bed,
    category: "Ambiente",
  },
  {
    id: 10,
    title:
      "Si no logras dormir en 20-30 min, levántate y realiza una actividad relajante.",
    icon: Timer,
    category: "Manejo del insomnio",
  },
];

export default function SleepHygieneDecalogue() {
  const [applied, setApplied] = useState<number[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [resetHovered, setResetHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = (id: number) => {
    setApplied((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const total = RECOMMENDATIONS.length;
  const completed = applied.length;
  const percent = (completed / total) * 100;

  return (
    <section
      aria-labelledby="sleep-decalogue-title"
      className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-6"
      style={{ lineHeight: 1.6, color: PALETTE.textPrimary }}
    >
      {/* Header */}
      <header className="mb-6">
        <h2
          id="sleep-decalogue-title"
          className="text-2xl sm:text-3xl font-bold text-primary-dark"
        >
          Decálogo de higiene del sueño
        </h2>
        <p className="mt-2 text-sm" style={{ color: PALETTE.textMuted }}>
          Recomendaciones generales, basadas en pautas de higiene del sueño de
          uso extendido
        </p>
      </header>

      {/* Progress */}
      <div
        className="mb-8 rounded-xl p-4"
        style={{
          backgroundColor: PALETTE.surfaceMuted,
          border: `1px solid ${PALETTE.border}`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium" style={{ color: PALETTE.textPrimary }}>
            <span className="font-bold" style={{ color: PALETTE.primaryLight }}>
              {completed}/{total}
            </span>{" "}
            hábitos aplicados
          </p>
          <button
            type="button"
            onClick={() => setApplied([])}
            onMouseEnter={() => setResetHovered(true)}
            onMouseLeave={() => setResetHovered(false)}
            disabled={completed === 0}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                resetHovered && completed > 0
                  ? PALETTE.primaryDark
                  : PALETTE.surface,
              border: `1px solid ${PALETTE.primaryDark}`,
              color:
                resetHovered && completed > 0 ? "#FFFFFF" : PALETTE.primaryDark,
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reiniciar
          </button>
        </div>

        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed}
          aria-label="Hábitos aplicados"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${PALETTE.primaryDark}, ${PALETTE.primaryLight})`,
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <ul
        className="grid list-none gap-4 p-0"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))" }}
      >
        {RECOMMENDATIONS.map((item, index) => {
          const Icon = item.icon;
          const isApplied = applied.includes(item.id);
          const isHovered = hoveredId === item.id;
          const scale = isApplied ? 1.015 : 1;
          const restingTransform = isHovered
            ? `translateY(-4px) scale(${scale})`
            : `scale(${scale})`;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                aria-pressed={isApplied}
                className="flex h-full w-full items-start gap-4 rounded-xl p-5 text-left transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: isApplied
                    ? "rgba(16,185,129,0.08)"
                    : isHovered
                      ? PALETTE.surface
                      : PALETTE.surfaceMuted,
                  border: `1px solid ${
                    isApplied
                      ? PALETTE.success
                      : isHovered
                        ? PALETTE.primaryLight
                        : PALETTE.border
                  }`,
                  boxShadow: isApplied
                    ? "0 4px 14px rgba(16,185,129,0.15)"
                    : isHovered
                      ? "0 10px 20px rgba(16,45,105,0.12)"
                      : "0 1px 2px rgba(16,45,105,0.05)",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? restingTransform : "translateY(12px)",
                  transitionDelay: mounted ? "0ms" : `${index * 60}ms`,
                  transitionProperty:
                    "opacity, transform, background-color, border-color, box-shadow",
                  lineHeight: 1.6,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ["--tw-ring-color" as any]: PALETTE.primaryLight,
                }}
              >
                {/* Number badge */}
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white transition-colors duration-200"
                  style={{
                    backgroundColor: isApplied
                      ? PALETTE.success
                      : PALETTE.primaryDark,
                  }}
                  aria-hidden="true"
                >
                  {isApplied ? <Check size={18} strokeWidth={3} /> : item.id}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Icon
                      size={16}
                      aria-hidden="true"
                      style={{
                        color: isApplied
                          ? PALETTE.success
                          : PALETTE.primaryLight,
                      }}
                    />
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: PALETTE.textMuted }}
                    >
                      {item.category}
                    </span>
                  </span>
                  <span
                    className="mt-2 block text-sm transition-colors duration-200"
                    style={{
                      color: isApplied
                        ? PALETTE.primaryMid
                        : PALETTE.textPrimary,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="mt-2 block text-[11px] font-semibold"
                    style={{
                      color: isApplied ? PALETTE.success : PALETTE.textMuted,
                    }}
                  >
                    {isApplied ? "Aplicado" : "Marcar como aplicado"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

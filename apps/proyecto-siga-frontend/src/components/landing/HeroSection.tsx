"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { useLandingTests } from "./useLandingTests";
import { COLORS, HERO, HERO_CARDS, TRUST_BADGES, type HeroCard } from "./landingContent";

const CARD_BASE = "rounded-2xl border px-6 py-5 flex items-center justify-between gap-6";

function SleepyIcon({ color }: { color: string }) {
  return (
    <span className="font-bold leading-none select-none" style={{ color }} aria-hidden="true">
      <span className="text-sm">z</span>
      <span className="text-[11px] align-super">z</span>
      <span className="text-[9px] align-super">z</span>
    </span>
  );
}

function PreviewCard({ card }: { card: HeroCard }) {
  const Icon = card.icon;
  return (
    <div
      className={CARD_BASE}
      style={{ backgroundColor: card.bgColor, borderColor: card.borderColor }}
    >
      <div>
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: card.accentColor }}
        >
          {card.label}
        </span>
        <p className="mt-2 text-lg lg:text-xl font-bold leading-snug" style={{ color: COLORS.ink }}>
          {card.tagline}
        </p>
      </div>
      <div className="shrink-0">
        {Icon ? (
          <Icon size={28} strokeWidth={1.75} style={{ color: card.accentColor }} aria-hidden="true" />
        ) : (
          <SleepyIcon color={card.accentColor} />
        )}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className={`${CARD_BASE} bg-slate-100 border-slate-200 animate-pulse`}>
      <div className="w-full">
        <div className="h-2 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
        <div className="mt-2 h-5 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 px-4 py-3 text-center">
      <p className="text-xs sm:text-sm text-slate-600">{label}</p>
      <p className="mt-0.5 text-base sm:text-xl font-bold" style={{ color: COLORS.ink }}>
        {value}
      </p>
    </div>
  );
}

export default function HeroSection() {
  const { user, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();
  const { tests, isLoading: testsLoading } = useLandingTests();
  const router = useRouter();

  const previewCards = tests
    .map((t) => HERO_CARDS[t.testCode.toUpperCase()])
    .filter((c): c is HeroCard => Boolean(c));
  const isAuthenticated = !authLoading && Boolean(user);

  return (
    <section className="w-full px-6 py-16 lg:py-20" style={{ backgroundColor: COLORS.surface }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <p
            className="text-[13px] font-bold uppercase tracking-widest mb-5"
            style={{ color: COLORS.primary }}
          >
            {HERO.eyebrow}
          </p>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-[560px]">
            <span style={{ color: COLORS.ink }}>{HERO.titleLine1}</span>{" "}
            <span style={{ color: COLORS.green }}>{HERO.titleLine2}</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-6 max-w-[600px]">
            {HERO.description}
          </p>

          <div className="mb-8 flex max-w-[600px] divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white">
            <Stat label="Instrumentos" value={testsLoading ? "–" : previewCards.length} />
            <Stat label="Tiempo aproximado total" value={HERO.estimatedTime} />
            <Stat label="Participación" value={HERO.participation} />
          </div>

          <div className="mb-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push("/panel/assignmentTest")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-7 py-3.5 rounded-full font-bold text-base transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                Continúa con tus pruebas <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-base text-white transition-all shadow-md hover:shadow-lg"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Crear cuenta
                </button>
                <button
                  type="button"
                  onClick={() => openModal("login")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-base bg-white transition-all hover:bg-blue-50"
                  style={{ color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` }}
                >
                  Iniciar sesión
                </button>
              </>
            )}
            <a
              href="#como-funciona"
              className="sm:ml-2 text-center text-base font-medium underline underline-offset-2 hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              ¿Cómo funciona?
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-slate-600">
            {TRUST_BADGES.map(({ icon: Icon, label, link }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon size={15} aria-hidden="true" /> {label}
                {link && (
                  <>
                    <span className="text-slate-400">·</span>
                    <Link
                      href={link.href}
                      className="underline underline-offset-2 hover:opacity-80"
                      style={{ color: COLORS.primary }}
                    >
                      {link.label}
                    </Link>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {testsLoading
            ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
            : previewCards.map((card) => <PreviewCard key={card.label} card={card} />)}
        </div>
      </div>
    </section>
  );
}

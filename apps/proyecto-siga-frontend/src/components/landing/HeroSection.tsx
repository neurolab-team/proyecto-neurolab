"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { useLandingTests } from "./useLandingTests";
import { getCardPresentation } from "./landingCardPresentation";
import { PublicTestCard } from "@packages/common-types/test.types";
import { COLORS, HERO, TRUST_BADGES } from "./landingContent";

const CARD_POSITIONS = [
  "absolute top-10 left-0 w-[54%] z-20",
  "absolute top-[140px] right-0 w-[50%] z-10",
  "absolute bottom-0 left-4 w-[62%] z-30",
] as const;

const SHOW_WAVE = [true, false, true];

function WaveDecoration({ color }: { color: string }) {
  return (
    <svg
      className="absolute bottom-4 right-2 opacity-25 pointer-events-none"
      width="90"
      height="70"
      viewBox="0 0 90 70"
      fill="none"
      aria-hidden="true"
    >
      <path d="M55 0 Q35 18 55 36 Q75 54 55 72" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M67 0 Q47 18 67 36 Q87 54 67 72" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M79 0 Q59 18 79 36 Q99 54 79 72" stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function renderTagline(tagline: string, highlight: string, color: string) {
  const idx = tagline.indexOf(highlight);
  if (idx === -1) return <span>{tagline}</span>;
  return (
    <>
      {tagline.slice(0, idx)}
      <span style={{ color }}>{highlight}</span>
      {tagline.slice(idx + highlight.length)}
    </>
  );
}

function PreviewCard({
  test,
  position,
  showWave,
}: {
  test: PublicTestCard;
  position: string;
  showWave: boolean;
}) {
  const p = getCardPresentation(test.testCode);
  return (
    <div
      className={`${position} rounded-2xl p-5 shadow-lg overflow-hidden ring-2 ring-white`}
      style={{ backgroundColor: p.bgColor }}
    >
      {showWave && <WaveDecoration color={p.accentColor} />}
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: p.accentColor }}
      >
        {p.categoryLabel}
      </span>
      <p className="mt-2 text-xl font-bold leading-snug" style={{ color: COLORS.ink }}>
        {renderTagline(p.tagline, p.highlightWord, p.accentColor)}
      </p>
      <p className="mt-7 text-xs text-slate-400">{p.scaleName}</p>
    </div>
  );
}

function CardSkeleton({ position }: { position: string }) {
  return (
    <div className={`${position} rounded-2xl bg-slate-100 p-5 shadow animate-pulse ring-2 ring-white`}>
      <div className="h-2 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-5 w-1/2 rounded bg-slate-200" />
      <div className="mt-8 h-2 w-20 rounded bg-slate-200" />
    </div>
  );
}

export default function HeroSection() {
  const { user, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();
  const { tests, isLoading: testsLoading } = useLandingTests();
  const router = useRouter();

  const previewTests = tests.slice(0, 3);
  const isAuthenticated = !authLoading && Boolean(user);

  return (
    <section className="w-full px-6 py-20" style={{ backgroundColor: COLORS.surface }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy + CTAs */}
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ color: COLORS.primary }}
          >
            {HERO.eyebrow}
          </p>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span style={{ color: COLORS.ink }}>{HERO.titleLine1}</span>
            <br />
            <span style={{ color: COLORS.green }}>{HERO.titleLine2}</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-[440px]">
            {HERO.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push("/panel/assignmentTest")}
                className="flex items-center gap-2 text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                Continúa con tus pruebas <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openModal("login")}
                className="flex items-center gap-2 text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                Iniciar sesión <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
            <a
              href="#como-funciona"
              className="flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: COLORS.primary }}
            >
              ¿Cómo funciona? <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            {TRUST_BADGES.map(({ icon: Icon, label }, i) => (
              <span key={label} className="flex items-center gap-3">
                {i > 0 && <span className="text-slate-300">·</span>}
                <span className="flex items-center gap-1">
                  <Icon size={14} aria-hidden="true" /> {label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: floating preview cards */}
        <div className="relative h-[460px]">
          <div className="absolute top-0 left-[38%] z-40">
            <Sparkles size={26} style={{ color: COLORS.ink }} aria-hidden="true" />
          </div>

          {testsLoading
            ? CARD_POSITIONS.map((pos, i) => <CardSkeleton key={i} position={pos} />)
            : previewTests.map((test, i) => (
                <PreviewCard
                  key={test.testId}
                  test={test}
                  position={CARD_POSITIONS[i]}
                  showWave={SHOW_WAVE[i]}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

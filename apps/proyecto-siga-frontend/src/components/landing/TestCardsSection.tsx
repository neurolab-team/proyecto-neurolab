"use client";

import { useLandingTests } from "./useLandingTests";
import TestCard from "./TestCard";

function CardSkeleton() {
  return (
    <div className="h-[220px] animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
    </div>
  );
}

export default function TestCardsSection() {
  const { tests, isLoading, hasError, refetch } = useLandingTests();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="text-sm font-medium text-red-700">
          No pudimos cargar las pruebas en este momento.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-[#001d4e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#002a6e]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-500">
          Por ahora no hay instrumentos de valoracion. Vuelve pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {tests.map((test) => (
        <TestCard key={test.testId} test={test} />
      ))}
    </div>
  );
}

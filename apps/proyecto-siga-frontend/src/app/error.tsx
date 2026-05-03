"use client";
import Link from "next/link";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-6">
      <section className="max-w-lg w-full rounded-2xl bg-white p-10 shadow-sm border border-slate-200 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Error 500
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#102D69]">
          Ocurrió un error inesperado
        </h1>
        <p className="mt-4 text-slate-600">
          Estamos trabajando para solucionarlo. Por favor intenta de nuevo en unos minutos.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-xl border border-[#102D69] px-5 py-3 text-[#102D69] font-semibold"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#102D69] px-5 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}

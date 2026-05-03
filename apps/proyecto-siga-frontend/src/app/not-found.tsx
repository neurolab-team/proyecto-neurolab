import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-6">
      <section className="max-w-lg w-full rounded-2xl bg-white p-10 shadow-sm border border-slate-200 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#102D69]">Página no encontrada</h1>
        <p className="mt-4 text-slate-600">
          La ruta que intentaste abrir no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex mt-8 rounded-xl bg-[#102D69] px-5 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}

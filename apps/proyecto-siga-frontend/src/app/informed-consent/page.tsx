import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InformedConsentContent from "@/components/consent/InformedConsentContent";
import {
  INFORMED_CONSENT_SUBTITLE,
  INFORMED_CONSENT_TITLE,
} from "@/libs/informedConsent";

export const metadata = {
  title: INFORMED_CONSENT_TITLE,
};

/**
 * Versión pública y de solo lectura del consentimiento informado que se
 * muestra en el test preview. Aquí no se acepta ni se rechaza: la decisión
 * se toma dentro del test, por asignación.
 */
export default function InformedConsentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00A0B7] mb-1">
              {INFORMED_CONSENT_TITLE}
            </p>
            <h1 className="text-3xl font-bold text-[#102D69]">
              {INFORMED_CONSENT_SUBTITLE}
            </h1>

            <div className="mt-8 flex flex-col gap-4 text-slate-700 leading-relaxed">
              <InformedConsentContent />
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-5 py-3 text-sm font-semibold text-white"
              >
                Volver al inicio
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

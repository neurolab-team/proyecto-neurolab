import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-[#102D69]">
              Sistema de Evaluación Psicológica
            </h1>
            <p className="text-2xl text-[#00A0B7] mb-12">
              Instituto Tecnológico Metropolitano
            </p>

            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-lg text-gray-600 leading-relaxed">
                Plataforma integral para la gestión y aplicación de evaluaciones
                psicológicas, diseñada para facilitar el proceso de evaluación y
                seguimiento de estudiantes y usuarios.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gradient-to-br from-[#102D69] to-[#00A0B7] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">
                Fácil de Usar
              </h3>
              <p className="text-blue-50 text-center">
                Interfaz intuitiva diseñada para facilitar la aplicación de
                evaluaciones
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#102D69] to-[#00A0B7] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Seguro</h3>
              <p className="text-blue-50 text-center">
                Protección de datos y privacidad garantizada en todo momento
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#102D69] to-[#00A0B7] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Resultados</h3>
              <p className="text-blue-50 text-center">
                Análisis detallado y reportes completos de las evaluaciones
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

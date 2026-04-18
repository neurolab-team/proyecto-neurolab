import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F8FAFC]">

        <div className="max-w-7xl mx-auto px-6 py-20">
          {/*Seccion 1*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold mb-6 text-[#001d4e] leading-tight">
                Sistema de Autoevaluación
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Plataforma digital diseñada para la aplicación, gestión y análisis de pruebas psicológicas,
                facilitando el seguimiento y evaluación de usuarios de manera eficiente.
              </p>

              <div className="flex gap-4 mt-10">

                {/* BOTÓN PRINCIPAL */}
                <a
                  href="#carrusel"
                  className="text-white bg-[#001d4e] px-5 py-2 rounded-md text-sm font-medium transition hover:bg-[#002a6e]"
                >
                  Explorar
                </a>

                {/* BOTÓN SECUNDARIO */}
                <a
                  href="#features"
                  className="text-[#001d4e] px-5 py-2 text-sm font-medium transition hover:underline"
                >
                  Características
                </a>

                {/* BOTÓN SECUNDARIO */}
                <a
                  href="#info"
                  className="text-[#001d4e] px-5 py-2 text-sm font-medium transition hover:underline"
                >
                  Información
                </a>

              </div>

            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-md h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                Imagen aquí
              </div>
            </div>
          </div>
        </div>

        {/*Seccion 2*/}
        <section id="carrusel" className="bg-[#EFF1F2] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="w-full">
              {/*Carrusel */}
              <Carousel />
            </div>
          </div>
        </section>

        {/*Seccion 3*/}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-[#001d4e] mb-4">
                  Características
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta 1 */}
        <div className="flip-card h-[250px] sm:h-[300px] lg:h-[300px]">
          <div className="flip-card-inner">
            {/* Frente */}
            <div className="flip-card-front bg-gradient-to-br from-[#001d4e] to-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Autoevaluación</h3>
              <p className="text-blue-50 text-center">Análisis detallado y reportes completos de las evaluaciones</p>
            </div>
            {/* Reverso */}
            <div className="flip-card-back bg-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl flex flex-col justify-center items-center">

              <h4 className="text-base font-semibold text-blue-50 text-center">Salud Mental</h4>
              <p className="text-sm text-gray-300 text-center">
                DASS-21, PHQ-9, GAD-7, PSS-10, WHO-5, CBI, C-SSRS
              </p>

              <h4 className="text-base font-semibold text-blue-50 text-center">Sueño & Ritmos Circadianos</h4>
              <p className="text-sm text-gray-300 text-center">
                ESS, PSQI, MEQ-RS
              </p>

              <h4 className="ttext-base font-semibold text-blue-50 text-center">Funcionamiento Cognitivo</h4>
              <p className="text-sm text-gray-300 text-center">
                Stroop, TMT, N-Back, Go/No-Go
              </p>

              <h4 className="text-base font-semibold text-blue-50 text-center">Factores académicos y pedagógicos</h4>
              <p className="text-sm text-gray-300 text-center">
                Motivación, hábitos de estudio y vocación
              </p>

            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="flip-card h-[250px] sm:h-[300px] lg:h-[300px]">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-gradient-to-br from-[#001d4e] to-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Seguro</h3>
              <p className="text-blue-50 text-center">Protección de datos y privacidad garantizada en todo momento</p>
            </div>
            <div className="flip-card-back bg-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl flex flex-col justify-center items-center">
              <p className="text-blue-50 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam at dicta enim eos temporibus natus laboriosam, maiores dolore eligendi similique harum rem? Expedita ea quisquam et autem molestiae reprehenderit cumque?</p>
            </div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="flip-card h-[250px] sm:h-[300px] lg:h-[300px]">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-gradient-to-br from-[#001d4e] to-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Resultados</h3>
              <p className="text-blue-50 text-center">Análisis detallado y reportes completos de las evaluaciones</p>
            </div>
            <div className="flip-card-back bg-[#2a4d8f] rounded-2xl p-8 text-white shadow-xl flex flex-col justify-center items-center">
              <p className="text-blue-50 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi a mollitia suscipit praesentium autem error qui assumenda! Corporis voluptatem eum beatae placeat voluptate qui numquam unde amet sed! Expedita, quam!</p>
            </div>
          </div>
        </div>
      </div>

    </div>
        {/*Seccion 4*/}
        <section id="info" className="bg-[#EFF1F2] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="w-full max-w-md h-[320px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                  Imagen aquí
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-[#001d4e] mb-4">
                  Información
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Nuestra plataforma permite gestionar evaluaciones psicológicas de manera
                  eficiente, brindando herramientas para el seguimiento y análisis de resultados.
                  <br /><br />
                  Está diseñada para instituciones educativas y profesionales de la salud mental,
                  facilitando procesos organizados, seguros y confiables.
                  <br /><br />
                  Además, ofrece reportes claros y visuales que apoyan la toma de decisiones,
                  mejorando la experiencia tanto para evaluadores como para usuarios.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

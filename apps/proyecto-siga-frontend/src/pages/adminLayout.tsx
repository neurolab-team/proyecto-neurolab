import Footer from "../components/Footer";

export default function AdminPanelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-[#102D69]">
              Panel de Administración
            </h1>
            <p className="text-2xl text-[#00A0B7] mb-12">
              Gestión y Configuración del Sistema
            </p>
            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-lg text-gray-600 leading-relaxed">
                Desde este panel, los administradores pueden gestionar usuarios,
                configurar evaluaciones y supervisar el rendimiento del sistema.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

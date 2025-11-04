export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-center">
          <p className="text-blue-100 text-xs">
            &copy; {new Date().getFullYear()} Instituto Tecnológico Metropolitano. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

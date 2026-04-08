export default function Footer() {
  return (
    <footer className="bg-[#001d4e] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-center">
          <p className="text-blue-100 text-xs">
            &copy; {new Date().getFullYear()} Institución Universitaria ITM - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

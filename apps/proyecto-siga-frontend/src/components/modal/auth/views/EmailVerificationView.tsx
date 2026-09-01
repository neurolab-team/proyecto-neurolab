interface EmailVerificationViewProps {
  onResend: () => void;
  isResending: boolean;
  canResend: boolean;
  resendMessage: string | null;
  onClose: () => void;
}

const PRIMARY_BUTTON =
  "bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white rounded-lg font-bold hover:shadow-lg transition-all";

/**
 * Pantalla para cuentas con el correo sin verificar. Ofrece reenviar el correo
 * de verificación y cerrar la modal.
 */
export default function EmailVerificationView({
  onResend,
  isResending,
  canResend,
  resendMessage,
  onClose,
}: EmailVerificationViewProps) {
  return (
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[#102D69] mb-2">
        Correo sin verificar
      </h3>
      <p className="text-gray-600 mb-4">
        No has verificado tu correo electrónico.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Te enviamos un correo con un enlace de verificación. Si no lo
        encuentras, puedes solicitar uno nuevo.
      </p>
      <button
        onClick={onResend}
        disabled={isResending || !canResend}
        className={`w-full ${PRIMARY_BUTTON} py-3 disabled:opacity-50 mb-3`}
      >
        {isResending
          ? "Reenviando..."
          : "¿Volver a enviar correo de verificación?"}
      </button>
      {resendMessage && (
        <p className="mb-3 text-sm text-slate-600">{resendMessage}</p>
      )}
      <button onClick={onClose} className={`${PRIMARY_BUTTON} px-6 py-3`}>
        Cerrar
      </button>
    </div>
  );
}

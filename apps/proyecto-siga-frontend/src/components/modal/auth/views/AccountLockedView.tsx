import AuthMessagePanel from "./AuthMessagePanel";

interface AccountLockedViewProps {
  message: string | null;
  onAcknowledge: () => void;
}

/**
 * Pantalla mostrada cuando el backend bloquea temporalmente los intentos de
 * login (429) por exceso de intentos fallidos. Se distingue a propósito de
 * "Credenciales inválidas": aquí el problema no es la contraseña, sino que la
 * cuenta quedó bloqueada por un rato tras varios intentos.
 */
export default function AccountLockedView({
  message,
  onAcknowledge,
}: AccountLockedViewProps) {
  return (
    <AuthMessagePanel
      icon="warning"
      title="Cuenta Bloqueada Temporalmente"
      buttons={[{ label: "Entendido", onClick: onAcknowledge }]}
    >
      <p className="text-gray-600 mb-4">
        {message ||
          "Detectamos demasiados intentos fallidos de inicio de sesión. Tu cuenta quedó bloqueada temporalmente."}
      </p>
      <p className="text-sm text-gray-500">
        Espera unos minutos y vuelve a intentarlo.
      </p>
    </AuthMessagePanel>
  );
}

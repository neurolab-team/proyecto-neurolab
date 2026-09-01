import AuthMessagePanel from "./AuthMessagePanel";

interface InactiveViewProps {
  onAcknowledge: () => void;
}

/** Pantalla para cuentas desactivadas. */
export default function InactiveView({ onAcknowledge }: InactiveViewProps) {
  return (
    <AuthMessagePanel
      icon="warning"
      title="Cuenta Inactiva"
      buttons={[{ label: "Entendido", onClick: onAcknowledge }]}
    >
      <p className="text-gray-600 mb-4">Tu cuenta ha sido desactivada.</p>
      <p className="text-sm text-gray-500">
        Comuníquese con el administrador para activar tu cuenta.
        <br />
        <span className="font-semibold">support@neurolab.itm.</span>
      </p>
    </AuthMessagePanel>
  );
}

import { ReactNode } from "react";

type PanelIcon = "warning" | "mail";

interface PanelButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

interface AuthMessagePanelProps {
  icon: PanelIcon;
  title: string;
  /**
   * Cuerpo del panel. Se deja como `ReactNode` porque las vistas actuales
   * mezclan párrafos, saltos de línea y texto resaltado con estructuras
   * distintas; forzar un string perdería ese formato.
   */
  children: ReactNode;
  buttons: PanelButton[];
  /** Mensaje auxiliar (p. ej. resultado del reenvío) mostrado entre botones. */
  footerMessage?: string | null;
}

const ICONS: Record<PanelIcon, ReactNode> = {
  warning: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  ),
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
};

const PRIMARY_BUTTON =
  "bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50";

/**
 * Panel centrado de "ícono + título + mensaje + botones", compartido por las
 * pantallas de estado de cuenta (inactiva, verificación de correo). No contiene
 * lógica: recibe los textos y los manejadores desde el contenedor.
 */
export default function AuthMessagePanel({
  icon,
  title,
  children,
  buttons,
  footerMessage,
}: AuthMessagePanelProps) {
  return (
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {ICONS[icon]}
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-[#102D69] mb-2">{title}</h3>

      <div className="mb-6">{children}</div>

      <div className="space-y-3">
        {buttons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.onClick}
            disabled={button.disabled}
            className={
              button.fullWidth
                ? `w-full ${PRIMARY_BUTTON}`
                : `${PRIMARY_BUTTON} px-6`
            }
          >
            {button.label}
          </button>
        ))}
      </div>

      {footerMessage && (
        <p className="mt-3 text-sm text-slate-600">{footerMessage}</p>
      )}
    </div>
  );
}

import ModalShell from "../core/ModalShell";
import {
  INFORMED_CONSENT_ACKNOWLEDGEMENT,
  INFORMED_CONSENT_CLOSING_PARAGRAPHS,
  INFORMED_CONSENT_FOLLOW_UP_ITEMS,
  INFORMED_CONSENT_FOLLOW_UP_INTRO,
  INFORMED_CONSENT_FOLLOW_UP_TITLE,
  INFORMED_CONSENT_PARAGRAPHS,
  INFORMED_CONSENT_QUESTIONNAIRES,
  INFORMED_CONSENT_SUBTITLE,
  INFORMED_CONSENT_TITLE,
} from "../../../libs/informedConsent";

interface InformedConsentModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Consentimiento informado obligatorio antes de responder una prueba.
 *
 * A diferencia de los demás modales, este no se puede cerrar con la "X" ni
 * haciendo clic afuera: el usuario debe elegir explícitamente "Acepto
 * participar" o "No acepto participar". Es una decisión, no un aviso que se
 * pueda descartar sin leer.
 */
export default function InformedConsentModal({
  isOpen,
  isSubmitting,
  onAccept,
  onDecline,
}: InformedConsentModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
      panelClassName="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-0 relative flex flex-col max-h-[85vh]"
    >
      <div className="px-8 pt-8 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#00A0B7] mb-1">
          {INFORMED_CONSENT_TITLE}
        </p>
        <h2 className="text-xl font-bold text-[#102D69]">
          {INFORMED_CONSENT_SUBTITLE}
        </h2>
      </div>

      <div className="px-8 pb-6 overflow-y-auto text-sm leading-relaxed text-gray-700 flex flex-col gap-4">
        {INFORMED_CONSENT_PARAGRAPHS.map((paragraph, i) => (
          <p key={`p-${i}`}>{paragraph}</p>
        ))}

        <div>
          <p className="mb-2">Durante la actividad responderá tres cuestionarios:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            {INFORMED_CONSENT_QUESTIONNAIRES.map((item, i) => (
              <li key={`q-${i}`}>{item}</li>
            ))}
          </ul>
        </div>

        {INFORMED_CONSENT_CLOSING_PARAGRAPHS.map((paragraph, i) => (
          <p key={`c-${i}`}>{paragraph}</p>
        ))}

        <div>
          <p className="mb-2 font-semibold text-gray-800">
            {INFORMED_CONSENT_FOLLOW_UP_TITLE}
          </p>
          <p className="mb-2">{INFORMED_CONSENT_FOLLOW_UP_INTRO}</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            {INFORMED_CONSENT_FOLLOW_UP_ITEMS.map((item, i) => (
              <li key={`f-${i}`}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="font-semibold text-gray-800">
          {INFORMED_CONSENT_ACKNOWLEDGEMENT}
        </p>
      </div>

      <div className="px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end bg-gray-50 rounded-b-xl">
        <button
          type="button"
          onClick={onDecline}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          No acepto participar
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#102D69] to-[#00A0B7] hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Acepto participar"}
        </button>
      </div>
    </ModalShell>
  );
}

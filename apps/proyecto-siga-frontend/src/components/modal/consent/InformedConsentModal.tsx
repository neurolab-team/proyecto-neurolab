import { useEffect, useState } from "react";
import ModalShell from "../core/ModalShell";
import {
  INFORMED_CONSENT_ACKNOWLEDGEMENT,
  INFORMED_CONSENT_INTRO,
  INFORMED_CONSENT_OPTIONAL_SLEEP_TIPS,
  INFORMED_CONSENT_OPTIONAL_STUDY_INVITES,
  INFORMED_CONSENT_OPTIONAL_TITLE,
  INFORMED_CONSENT_SECTIONS,
  INFORMED_CONSENT_SUBTITLE,
  INFORMED_CONSENT_TITLE,
} from "../../../libs/informedConsent";

export type ConsentOptionalAuthorizations = {
  allowsSleepTips: boolean;
  allowsStudyInvites: boolean;
};

interface InformedConsentModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onAccept: (authorizations: ConsentOptionalAuthorizations) => void;
  onDecline: () => void;
}

const CHECKBOX_CLASS =
  "mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-gray-300 text-[#102D69] focus:ring-[#2a4d8f] cursor-pointer disabled:cursor-not-allowed";

/**
 * Consentimiento informado obligatorio antes de responder las pruebas de un
 * estudio. Se responde una vez por estudio, no por prueba.
 *
 * A diferencia de los demás modales, este no se puede cerrar con la "X" ni
 * haciendo clic afuera: el usuario debe elegir explícitamente "Acepto
 * participar" o "No acepto participar". Es una decisión, no un aviso que se
 * pueda descartar sin leer.
 *
 * Las autorizaciones opcionales arrancan desmarcadas (opt-in explícito) y
 * solo se envían si acepta participar.
 */
export default function InformedConsentModal({
  isOpen,
  isSubmitting,
  onAccept,
  onDecline,
}: InformedConsentModalProps) {
  const [allowsSleepTips, setAllowsSleepTips] = useState(false);
  const [allowsStudyInvites, setAllowsStudyInvites] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAllowsSleepTips(false);
      setAllowsStudyInvites(false);
    }
  }, [isOpen]);

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
        {INFORMED_CONSENT_INTRO.map((paragraph, i) => (
          <p key={`p-${i}`}>{paragraph}</p>
        ))}

        {INFORMED_CONSENT_SECTIONS.map((section) => (
          <section key={section.title}>
            <p className="mb-2 font-semibold text-gray-800">{section.title}</p>
            {section.lead && <p className="mb-2">{section.lead}</p>}
            {section.items && (
              <ul className="list-disc pl-5 flex flex-col gap-1">
                {section.items.map((item, i) => (
                  <li key={`${section.title}-i-${i}`}>{item}</li>
                ))}
              </ul>
            )}
            {section.paragraphs?.map((paragraph, i) => (
              <p key={`${section.title}-p-${i}`} className="mt-2">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <p className="font-semibold text-gray-800">
          {INFORMED_CONSENT_ACKNOWLEDGEMENT}
        </p>

        <fieldset className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3">
          <legend className="px-1 text-sm font-semibold text-gray-800">
            {INFORMED_CONSENT_OPTIONAL_TITLE}
          </legend>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowsSleepTips}
              onChange={(e) => setAllowsSleepTips(e.target.checked)}
              disabled={isSubmitting}
              className={CHECKBOX_CLASS}
            />
            <span>{INFORMED_CONSENT_OPTIONAL_SLEEP_TIPS}</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowsStudyInvites}
              onChange={(e) => setAllowsStudyInvites(e.target.checked)}
              disabled={isSubmitting}
              className={CHECKBOX_CLASS}
            />
            <span>{INFORMED_CONSENT_OPTIONAL_STUDY_INVITES}</span>
          </label>
          <p className="text-xs text-gray-500">
            Solo se guardan si selecciona “Acepto participar”.
          </p>
        </fieldset>
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
          onClick={() => onAccept({ allowsSleepTips, allowsStudyInvites })}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#102D69] to-[#00A0B7] hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Acepto participar"}
        </button>
      </div>
    </ModalShell>
  );
}

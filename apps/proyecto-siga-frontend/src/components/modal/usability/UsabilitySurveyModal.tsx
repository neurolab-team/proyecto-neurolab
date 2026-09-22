"use client";

import { useState } from "react";
import ModalShell from "../core/ModalShell";
import { authService } from "../../../services/auth/auth";
import { notify } from "../../../libs/toastService";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import { USABILITY_SURVEY_URL } from "@packages/common-types/usabilitySurvey.types";

interface UsabilitySurveyModalProps {
  isOpen: boolean;
  onClosed: () => void;
}

/**
 * Encuesta externa de usabilidad (Google Forms), obligatoria de ver apenas
 * el usuario completa las 3 pruebas de sueño.
 *
 * No se puede cerrar con "X" ni haciendo clic afuera: solo con una de las dos
 * acciones explícitas. "Recordarme después" la cierra por esta sesión pero
 * vuelve a aparecer en el próximo inicio de sesión (el backend no borra el
 * flag hasta que el usuario hace clic en "Abrir encuesta"), como respaldo de
 * que sí o sí la vea.
 */
export default function UsabilitySurveyModal({
  isOpen,
  onClosed,
}: UsabilitySurveyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenSurvey = async () => {
    window.open(USABILITY_SURVEY_URL, "_blank", "noopener,noreferrer");

    setIsSubmitting(true);
    try {
      await authService.markUsabilitySurveyClicked();
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "No se pudo registrar que abriste la encuesta, pero puedes responderla igual.",
      );
      notify.error(Array.isArray(message) ? message.join(" ") : message);
    } finally {
      setIsSubmitting(false);
      onClosed();
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {}}
      hideCloseButton
      panelClassName="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-[#00A0B7] mb-1">
        Antes de continuar
      </p>
      <h2 className="text-xl font-bold text-[#102D69] mb-3">
        Ayúdanos a mejorar Neurolab
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Ya completaste las tres pruebas de caracterización del sueño. Nos
        gustaría conocer tu experiencia navegando el sitio, para mejorar la
        plataforma antes de que la usen más estudiantes. Es una encuesta
        corta y tus respuestas se usan de forma anónima.
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleOpenSurvey}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#102D69] to-[#00A0B7] hover:shadow-lg transition-all disabled:opacity-50"
        >
          Abrir encuesta
        </button>
        <button
          type="button"
          onClick={onClosed}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Recordarme después
        </button>
      </div>
    </ModalShell>
  );
}

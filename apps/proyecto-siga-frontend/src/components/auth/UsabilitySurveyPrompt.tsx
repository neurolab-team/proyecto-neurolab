"use client";

import { useEffect, useRef } from "react";
import { useModal } from "../../hooks/useModal";

interface UsabilitySurveyPromptProps {
  /**
   * Viene del layout protegido, calculado en el servidor a partir de la
   * sesión (`user.usabilitySurveyPending`) en cada navegación, así que
   * siempre refleja el estado real y no depende de que el `AuthContext` del
   * cliente se haya refrescado.
   */
  pending: boolean;
}

/**
 * Dispara el modal de la encuesta de usabilidad una vez por montaje de la
 * zona protegida (es decir, cada vez que el usuario entra o vuelve a
 * cargar la app) mientras `pending` sea true. No renderiza nada visible: el
 * modal en sí vive en `ModalRoot`.
 */
export default function UsabilitySurveyPrompt({ pending }: UsabilitySurveyPromptProps) {
  const { openModal, isModalOpen } = useModal();
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (pending && !hasOpenedRef.current && !isModalOpen("usabilitySurvey")) {
      hasOpenedRef.current = true;
      openModal("usabilitySurvey");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  return null;
}

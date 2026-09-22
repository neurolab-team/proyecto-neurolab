/**
 * Versión vigente del texto de consentimiento informado.
 *
 * Se comparte entre frontend y backend: el backend la guarda en
 * `assignment.consentVersion` al registrar la decisión del usuario, y el
 * frontend la usa como referencia de qué texto se le mostró. Si el texto
 * legal cambia, se sube esta versión para que las decisiones previas queden
 * trazadas contra el texto que realmente aceptaron.
 */
export const CURRENT_CONSENT_VERSION = "matelab-ii-2026-09";

export type ConsentStatus = "accepted" | "declined";

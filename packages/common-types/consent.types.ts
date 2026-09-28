/**
 * Versión vigente del texto de consentimiento informado.
 *
 * Se comparte entre frontend y backend: el backend la guarda en
 * `studyConsent.version` al registrar la decisión del usuario, y el frontend
 * la usa como referencia de qué texto se le mostró. Si el texto legal cambia,
 * se sube esta versión: las decisiones sobre versiones anteriores dejan de
 * contar como vigentes y al usuario se le vuelve a pedir el consentimiento.
 *
 * Historial:
 * - "matelab-ii-2026-09": texto inicial (se guardaba por asignación).
 * - "matelab-ii-2026-09-v2": agrega las autorizaciones opcionales de contacto.
 */
export const CURRENT_CONSENT_VERSION = "matelab-ii-2026-09-v2";

export type ConsentStatus = "accepted" | "declined";

export type ConsentSource = "user" | "migrated_from_assignment";

/**
 * Estudios que requieren consentimiento informado y las pruebas que cubre
 * cada uno. El consentimiento se da una vez por estudio, no por prueba: el
 * texto describe las 3 pruebas de sueño en conjunto.
 *
 * Las pruebas que no pertenecen a ningún estudio no exigen consentimiento.
 */
export const STUDY_TEST_CODES = {
  MATELAB_II_SLEEP: ["EPWORTH", "PSQI", "MUNICH"],
} as const satisfies Record<string, readonly string[]>;

export type StudyCode = keyof typeof STUDY_TEST_CODES;

export const getStudyCodeForTest = (
  testCode: string | null | undefined,
): StudyCode | null => {
  if (!testCode) return null;
  const entry = Object.entries(STUDY_TEST_CODES).find(([, codes]) =>
    (codes as readonly string[]).includes(testCode),
  );
  return entry ? (entry[0] as StudyCode) : null;
};

/** Decisión de consentimiento que se le expone al frontend. */
export type StudyConsentDecision = {
  status: ConsentStatus;
  allowsSleepTips: boolean;
  allowsStudyInvites: boolean;
  respondedAt: Date;
};

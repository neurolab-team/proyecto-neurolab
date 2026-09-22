/**
 * Encuesta externa (Google Forms) de usabilidad del sitio, que se le pide
 * diligenciar al usuario apenas completa las 3 pruebas de sueño del proyecto
 * MATELAB II (EPWORTH, PSQI, MUNICH).
 *
 * TODO: reemplazar por el link real cuando esté listo. Es el único cambio
 * necesario para activar el link real tanto en el correo como en el modal,
 * porque ambos importan esta misma constante.
 */
export const USABILITY_SURVEY_URL =
  "https://forms.cloud.microsoft/r/jzi2nEMG1t";

/**
 * Códigos de prueba que, al completarse las 3, disparan la encuesta de
 * usabilidad. Deben coincidir con `INITIAL_TEST_IDS` en
 * `assignmentService.ts` (las pruebas que se autoasignan al registrarse).
 */
export const USABILITY_SURVEY_TRIGGER_TEST_CODES = [
  "EPWORTH",
  "PSQI",
  "MUNICH",
] as const;

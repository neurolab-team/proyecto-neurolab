import { CURRENT_CONSENT_VERSION } from "@packages/common-types/consent.types";

/**
 * Texto de consentimiento informado mostrado antes de que el usuario pueda
 * responder las pruebas del proyecto MATELAB II - Ecopermanencia.
 *
 * Si el texto legal cambia, actualiza `CURRENT_CONSENT_VERSION` en
 * `packages/common-types/consent.types.ts` para que las decisiones previas
 * queden trazadas contra la versión que realmente se les mostró.
 */
export const INFORMED_CONSENT_VERSION = CURRENT_CONSENT_VERSION;

export const INFORMED_CONSENT_TITLE = "Consentimiento informado";

export const INFORMED_CONSENT_SUBTITLE =
  "Caracterización de hábitos y características del sueño";

export const INFORMED_CONSENT_PARAGRAPHS: string[] = [
  "Usted está invitado(a) a participar voluntariamente en esta valoración de hábitos y características del sueño, desarrollada por el ITM en el marco del proyecto MATELAB II – Ecopermanencia, bajo la responsabilidad de la Prof. Gloria Duque.",
  "Dormir bien hace parte de nuestro bienestar y puede influir en cómo nos sentimos y nos desenvolvemos durante el día. Esta valoración es una oportunidad para hacer una pausa, conocer mejor sus hábitos de sueño y reflexionar sobre sus características de descanso, especialmente durante los primeros semestres de su proceso académico.",
];

export const INFORMED_CONSENT_QUESTIONNAIRES: string[] = [
  "Índice de Calidad de Sueño de Pittsburgh (PSQI): evalúa aspectos relacionados con la calidad y características del sueño.",
  "Escala de Somnolencia de Epworth: permite identificar el nivel de somnolencia durante el día.",
  "Cuestionario de Cronotipo: permite conocer la preferencia por determinados horarios de actividad y descanso.",
];

export const INFORMED_CONSENT_CLOSING_PARAGRAPHS: string[] = [
  "La actividad tiene una duración aproximada de 10 a 17 minutos. Los resultados son de carácter descriptivo, orientador y no constituyen un diagnóstico médico ni psicológico.",
  "Su participación es voluntaria. Puede decidir no participar o retirarse en cualquier momento, sin que esto genere consecuencias académicas.",
  "Sus datos serán recolectados a través de la plataforma NEUROLAB y tratados de forma confidencial por el ITM. Serán utilizados únicamente para los fines establecidos en esta caracterización y conservados de acuerdo con la Política de Tratamiento de Datos Personales de la institución.",
  "Para resolver dudas o solicitar información adicional, puede comunicarse a: gloriaduque@itm.edu.co",
];

export const INFORMED_CONSENT_FOLLOW_UP_TITLE = "Contacto posterior";

export const INFORMED_CONSENT_FOLLOW_UP_INTRO =
  "Al aceptar participar, es posible que le escribamos a su correo institucional para:";

export const INFORMED_CONSENT_FOLLOW_UP_ITEMS: string[] = [
  "Enviarle recomendaciones generales para mejorar sus hábitos de sueño.",
  "Invitarle a otros estudios sobre el sueño, como la medición con MotionWatch (dispositivo similar a un reloj que se usa en la muñeca). Recibir la invitación no le obliga a participar; si le interesa, se le dará la información completa y se le pedirá un nuevo consentimiento.",
];

export const INFORMED_CONSENT_ACKNOWLEDGEMENT =
  'Al seleccionar "Acepto participar", usted confirma que ha leído y comprendido esta información y que autoriza voluntariamente su participación en la valoración.';

import { CURRENT_CONSENT_VERSION } from "@packages/common-types/consent.types";

/**
 * Texto de consentimiento informado mostrado antes de que el usuario pueda
 * responder las pruebas de sueño del proyecto MATELAB II - Ecopermanencia.
 *
 * Si el texto legal cambia, actualiza `CURRENT_CONSENT_VERSION` en
 * `packages/common-types/consent.types.ts` para que las decisiones previas
 * queden trazadas contra la versión que realmente se les mostró (y se le
 * vuelva a pedir el consentimiento a todos).
 */
export const INFORMED_CONSENT_VERSION = CURRENT_CONSENT_VERSION;

export const INFORMED_CONSENT_TITLE = "Consentimiento informado";

export const INFORMED_CONSENT_SUBTITLE =
  "Caracterización de hábitos y características del sueño";

export const INFORMED_CONSENT_INTRO: string[] = [
  "Usted está invitado(a) a participar voluntariamente en esta valoración de hábitos y características del sueño, desarrollada por el ITM en el marco del proyecto MATELAB II – Ecopermanencia, bajo la responsabilidad de la Profª. Gloria Duque.",
  "Dormir bien hace parte de nuestro bienestar y puede influir en cómo nos sentimos y nos desenvolvemos durante el día. Esta valoración es una oportunidad para hacer una pausa, conocer mejor sus hábitos de sueño y reflexionar sobre sus características de descanso, especialmente durante los primeros semestres de su proceso académico.",
];

export type InformedConsentSection = {
  title: string;
  lead?: string;
  items?: string[];
  paragraphs?: string[];
};

export const INFORMED_CONSENT_SECTIONS: InformedConsentSection[] = [
  {
    title: "¿En qué consiste?",
    lead: "Responderá tres cuestionarios (10 a 17 minutos aprox.):",
    items: [
      "Índice de Calidad de Sueño de Pittsburgh (PSQI): evalúa aspectos relacionados con la calidad y características del sueño.",
      "Escala de Somnolencia de Epworth: permite identificar el nivel de somnolencia durante el día.",
      "Cuestionario de Cronotipo: permite conocer la preferencia por determinados horarios de actividad y descanso.",
    ],
    paragraphs: [
      "Los resultados son descriptivos y orientadores; no constituyen un diagnóstico médico ni psicológico.",
    ],
  },
  {
    title: "Participación voluntaria",
    paragraphs: [
      "Puede no participar o retirarse en cualquier momento, sin consecuencias académicas.",
    ],
  },
  {
    title: "Contacto posterior (opcional)",
    lead: "Si lo autoriza, podremos escribirle a su correo institucional para:",
    items: [
      "Enviarle recomendaciones generales para mejorar sus hábitos de sueño.",
      "Invitarle a otros estudios sobre el sueño, como la medición con MotionWatch (dispositivo similar a un reloj que se usa en la muñeca). Recibir la invitación no le obliga a participar; si le interesa, se le dará la información completa y se le pedirá un nuevo consentimiento.",
    ],
  },
  {
    title: "Confidencialidad y datos",
    paragraphs: [
      "Sus datos se recolectan en la plataforma NeuroLab, son tratados de forma confidencial por el ITM, se usan solo para los fines aquí descritos y se conservan según la Política de Tratamiento de Datos Personales de la institución.",
      "Para resolver dudas o solicitar información adicional, puede comunicarse a: gloriaduque@itm.edu.co",
    ],
  },
];

export const INFORMED_CONSENT_ACKNOWLEDGEMENT =
  "Al seleccionar “Acepto participar”, usted confirma que ha leído y comprendido esta información y que autoriza voluntariamente su participación en la valoración.";

export const INFORMED_CONSENT_OPTIONAL_TITLE =
  "Autorizaciones opcionales (puede participar sin marcarlas)";

export const INFORMED_CONSENT_OPTIONAL_SLEEP_TIPS =
  "Autorizo recibir recomendaciones sobre mis hábitos de sueño por correo electrónico.";

export const INFORMED_CONSENT_OPTIONAL_STUDY_INVITES =
  "Autorizo recibir invitaciones a otros estudios relacionados con el sueño (por ejemplo, MotionWatch).";

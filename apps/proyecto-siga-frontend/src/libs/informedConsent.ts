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
  "Valoración de hábitos y patrones de sueño";

export const INFORMED_CONSENT_INTRO: string[] = [
  "Usted está invitado(a) a participar voluntariamente en esta valoración de hábitos y patrones de sueño, desarrollada por el ITM en el marco del proyecto MATELAB II – Ecopermanencia.",
  "Dormir bien hace parte de nuestro bienestar y puede influir en cómo nos sentimos y nos desenvolvemos durante el día. Esta valoración es una oportunidad para hacer una pausa, conocer mejor sus hábitos de sueño y reflexionar sobre su descanso, especialmente durante el proceso de adaptación a la vida universitaria.",
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
      "Índice de Calidad de Sueño de Pittsburgh (PSQI): evalúa diferentes aspectos de la calidad del sueño durante el último mes.",
      "Escala de Somnolencia de Epworth: evalúa la probabilidad de quedarse dormido en diferentes situaciones durante el día.",
      "Cuestionario de Cronotipo de Munich: recoge información sobre sus horarios de sueño para conocer aspectos relacionados con su cronotipo",
    ],
    paragraphs: [
      "Los resultados son orientativos; no constituyen un diagnóstico médico o psicológico ni sustituyen una valoración profesional.",
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
    lead: "Si lo autoriza, podremos contactarlo a través de su correo institucional para enviarle recomendaciones generales sobre hábitos de sueño o invitarlo a otros estudios relacionados. Cualquier nuevo estudio requerirá un consentimiento independiente.",
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
  "Al seleccionar “Acepto participar”, confirma que ha leído y comprendido esta información y acepta participar voluntariamente.";

export const INFORMED_CONSENT_OPTIONAL_TITLE =
  "Autorizaciones opcionales";

export const INFORMED_CONSENT_OPTIONAL_SLEEP_TIPS =
  "Autorizo recibir recomendaciones sobre mis hábitos de sueño por correo electrónico.";

export const INFORMED_CONSENT_OPTIONAL_STUDY_INVITES =
  "Autorizo recibir invitaciones a otros estudios relacionados con el sueño (por ejemplo, MotionWatch).";

import { ShieldCheck, CheckCircle2, Clock, Lock, BadgeCheck, GraduationCap, type LucideIcon } from "lucide-react";

/**
 * Contenido y tokens centralizados de la landing pública.
 *
 * Mantener aquí los textos, colores y datos de cada sección evita duplicación
 * entre componentes (DRY) y facilita re-themear o editar copy sin tocar el JSX.
 */

// --- Tokens de color (paleta de marca) ---
export const COLORS = {
  ink: "#001d4e", // azul tinta — títulos
  primary: "#1E5FA8", // azul primario — CTAs / acentos
  primaryDark: "#174d8e", // hover del primario
  ctaBg: "#2244CC", // azul del bloque CTA final
  green: "#1A6B35", // verde — acento positivo
  purple: "#7B3DA6", // morado — acento secundario
  surface: "#E8F2FB", // fondo claro azulado de secciones
} as const;

// --- Hero ---
export const HERO = {
  eyebrow: "Permanencia · ITM",
  titleLine1: "Conoce cómo estás,",
  titleLine2: "a tu ritmo.",
  description:
    "El Sistema de Autoevaluación reúne las pruebas psicológicas que te asigna Permanencia en un solo lugar. Respóndelas con calma, mira tu evolución y conversa con tu psicólog@ cuando lo necesites.",
} as const;

// --- Sellos de confianza (hero) ---
export type TrustBadge = { icon: LucideIcon; label: string };

export const TRUST_BADGES: TrustBadge[] = [
  { icon: Lock, label: "Confidencial" },
  { icon: BadgeCheck, label: "Pruebas validadas" },
  { icon: GraduationCap, label: "Gratis para estudiantes" },
];

// --- Beneficios / garantías ---
export type Benefit = {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
};

export const BENEFITS: Benefit[] = [
  {
    icon: ShieldCheck,
    iconBg: COLORS.primary,
    title: "Totalmente confidencial",
    description:
      "Solo el equipo de psicología ve tus respuestas. Tus profesores y compañeros, nunca.",
  },
  {
    icon: CheckCircle2,
    iconBg: COLORS.purple,
    title: "Pruebas validadas",
    description:
      "Escalas clínicas reconocidas (Epworth, HAD, DASS-21) adaptadas y usadas en contextos universitarios.",
  },
  {
    icon: Clock,
    iconBg: COLORS.green,
    title: "A tu propio ritmo",
    description:
      "Pausa y continúa cuando quieras. Tus respuestas se guardan automáticamente.",
  },
];

// --- Pasos (cómo funciona) ---
export type Step = {
  number: string;
  title: string;
  description: string;
  dotColor: string;
  dotFilled: boolean;
  descriptionColor?: string;
};

export const STEPS: Step[] = [
  {
    number: "PASO 01",
    title: "Recibes tu asignación",
    description: "Permanencia te asigna las pruebas según tu programa o tu solicitud.",
    dotColor: COLORS.primary,
    dotFilled: false,
  },
  {
    number: "PASO 02",
    title: "Respondes con calma",
    description: "Una pregunta a la vez, sin distracciones. Pausa y vuelve cuando quieras.",
    dotColor: COLORS.primary,
    dotFilled: false,
  },
  {
    number: "PASO 03",
    title: "Revisas y conversas",
    description: "Ves tu resultado y, si quieres, agendas con tu psicólog@.",
    descriptionColor: COLORS.green,
    dotColor: COLORS.green,
    dotFilled: true,
  },
];

import { Lock, BadgeCheck, GraduationCap, type LucideIcon } from "lucide-react";

/**
 * Contenido y tokens centralizados de la landing pública.
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
  eyebrow: "Neurolab - ITM",
  titleLine1: "Conoce cómo duermes",
  titleLine2: "a tu ritmo",
  description:
    "En este espacio encontrarás instrumentos de valoración del sueño que te ayudarán a conocer mejor tus hábitos y la forma en que estás descansando. Tómate unos minutos, responde con calma y descubre más sobre tu sueño.",
} as const;

export type TrustBadge = { icon: LucideIcon; label: string };

export const TRUST_BADGES: TrustBadge[] = [
  { icon: Lock, label: "Privado" },
  { icon: BadgeCheck, label: "Instrumentos con respaldo cientifico" },
  { icon: GraduationCap, label: "Para estudiantes ITM" },
];

export type Benefit = {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
};

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
    title: "Regístrate",
    description: "Crea tu cuenta para acceder a tu valoración del sueño.",
    dotColor: COLORS.primary,
    dotFilled: false,
  },
  {
    number: "PASO 02",
    title: "Responde",
    description: "Completa los cuestionarios sobre tus patrones de sueño, cronotipo y somnolencia diurna.",
    dotColor: COLORS.primary,
    dotFilled: false,
  },
  {
    number: "PASO 03",
    title: "Conoce",
    description: "Consulta información sobre tus patrones de sueño, tu cronotipo y tu somnolencia diurna.",
    descriptionColor: COLORS.green,
    dotColor: COLORS.green,
    dotFilled: true,
  },
];

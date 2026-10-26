import { Lock, BadgeCheck, GraduationCap, Sun, Moon, type LucideIcon } from "lucide-react";

export const COLORS = {
  ink: "#001d4e", // azul tinta — títulos
  primary: "#1E5FA8", // azul primario — CTAs / acentos
  primaryDark: "#174d8e", // hover del primario
  ctaBg: "#2244CC", // azul del bloque CTA final
  green: "#1A6B35", // verde — acento positivo
  purple: "#7B3DA6", // morado — acento secundario
  surface: "#E8F2FB", // fondo claro azulado de secciones
} as const;

export const HERO = {
  eyebrow: "Neurolab - ITM",
  titleLine1: "Conoce cómo duermes",
  titleLine2: "a tu ritmo",
  description:
    "En este espacio encontrarás instrumentos de valoración del sueño que te ayudarán a conocer mejor tus hábitos y la forma en que estás descansando. Responde con calma y descubre más sobre tu sueño.",
  estimatedTime: "12 a 25 minutos",
  participation: "Voluntaria",
} as const;

export type HeroCard = {
  label: string;
  tagline: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon | null;
};

export const HERO_CARDS: Record<string, HeroCard> = {
  MUNICH: {
    label: "MCTQ · Cronotipo",
    tagline: "Descubre tu cronotipo y tus patrones de sueño.",
    accentColor: "#9A5B13",
    bgColor: "#FEF5CF",
    borderColor: "#F5DE8A",
    icon: Sun,
  },
  EPWORTH: {
    label: "ESS · Somnolencia diurna",
    tagline: "¿Qué tan probable es que te quedes dormido en situaciones cotidianas?",
    accentColor: "#1E5FA8",
    bgColor: "#DCE8FB",
    borderColor: "#B7CEF3",
    icon: null,
  },
  PSQI: {
    label: "PSQI · Calidad del sueño",
    tagline: "¿Cómo ha sido la calidad de tu sueño durante el último mes?",
    accentColor: "#1F7A66",
    bgColor: "#E3F2EC",
    borderColor: "#BFE0D3",
    icon: Moon,
  },
};

export type TrustBadge = { icon: LucideIcon; label: string; link?: { href: string; label: string } };

export const TRUST_BADGES: TrustBadge[] = [
  {
    icon: Lock,
    label: "Datos confidenciales",
    link: { href: "/data-protection-policy", label: "Ver tratamiento de datos" },
  },
  { icon: BadgeCheck, label: "Instrumentos con respaldo científico" },
  { icon: GraduationCap, label: "Para estudiantes ITM" },
];

export type Benefit = {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    title: "Crea tu cuenta",
    description: "Regístrate para guardar tus respuestas.",
  },
  {
    title: "Lee el consentimiento",
    description: "Decide si quieres participar. Podrás consultarlo cuando quieras.",
  },
  {
    title: "Responde los 3 instrumentos",
    description: "Sobre tu cronotipo, tu somnolencia diurna y la calidad de tu sueño.",
  },
  {
    title: "Consulta tus resultados",
    description: "Información orientativa para comprender mejor tus hábitos de sueño.",
  },
];

export const NOTICE_LINKS = {
  informedConsent: "/informed-consent",
  dataPolicy: "/data-protection-policy",
  careRoutes: "#",
} as const;

export const SUPPORT = {
  email: "acercarse@itm.edu.co",
  emergencyLine: "123",
  nursingHours: "6:00 a.m. – 10:00 p.m.",
} as const;

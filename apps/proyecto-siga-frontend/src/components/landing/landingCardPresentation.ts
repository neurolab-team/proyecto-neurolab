/**
 * Presentación de las cards de la landing pública (C2: enfoque mixto).
 *
 * El backend aporta los datos de dominio (testCode, title, description). La
 * presentación visual (categoría, escala, color de acento) se resuelve aquí en
 * el frontend, keyed por `testCode`. Los colores de acento reflejan la paleta
 * usada en el `testConfigRegistry` de la zona protegida, pero se mantienen
 * desacoplados para no acoplar la landing pública a esa carpeta.
 *
 * Un `testCode` desconocido degrada con un fallback genérico sin romper el render.
 */

export type CardPresentation = {
  categoryLabel: string;
  scaleName: string;
  accentColor: string;
  bgColor: string;
  tagline: string;
  highlightWord: string;
};

const PRESENTATION_BY_TEST_CODE: Record<string, CardPresentation> = {
  EPWORTH: {
    categoryLabel: "SUEÑO Y RITMOS CIRCADIANOS",
    scaleName: "Escala de Somnolencia Diurna de Epworth (ESS)",
    accentColor: "#1E5FA8",
    bgColor: "#DBEAFE",
    tagline: "¿Cómo está tu descanso en época de estudio?",
    highlightWord: "descanso",
  },
  PSQI: {
    categoryLabel: "SUEÑO Y RITMOS CIRCADIANOS",
    scaleName: "Índice de Calidad de Sueño de Pittsburgh (PSQI)",
    accentColor: "#2B7A9C",
    bgColor: "#E0F2FE",
    tagline: "¿Cómo ha sido la calidad de tu sueño durante el último mes?",
    highlightWord: "calidad",
  },
  "DASS-21": {
    categoryLabel: "TAMIZAJE SALUD MENTAL",
    scaleName: "DASS-21",
    accentColor: "#7B3DA6",
    bgColor: "#EDE9FE",
    tagline: "¿Cuánta carga llevas este semestre?",
    highlightWord: "carga",
  },
  HAD: {
    categoryLabel: "TAMIZAJE SALUD MENTAL",
    scaleName: "Escala HAD",
    accentColor: "#1A6B35",
    bgColor: "#DCFCE7",
    tagline: "Una mirada honesta a tu estado de ánimo.",
    highlightWord: "estado de ánimo",
  },
  MUNICH: {
    categoryLabel: "SUEÑO Y RITMOS CIRCADIANOS",
    scaleName: "Cronotipo Munich (MCTQ)",
    accentColor: "#B5642E",
    bgColor: "#FEF3C7",
    tagline: "Descubre tu cronotipo y ritmo biológico.",
    highlightWord: "cronotipo",
  },
};

const FALLBACK_PRESENTATION: CardPresentation = {
  categoryLabel: "EVALUACIÓN",
  scaleName: "Prueba psicológica",
  accentColor: "#102D69",
  bgColor: "#E2E8F0",
  tagline: "Conoce más sobre tu bienestar.",
  highlightWord: "bienestar",
};

export function getCardPresentation(testCode: string): CardPresentation {
  return PRESENTATION_BY_TEST_CODE[testCode.toUpperCase()] ?? FALLBACK_PRESENTATION;
}

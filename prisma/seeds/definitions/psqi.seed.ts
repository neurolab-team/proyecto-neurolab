import { TestSeedDefinition, SeedOption } from "../types";

const FREQ_OPTIONS: SeedOption[] = [
  { label: "Ninguna vez en el último mes", value: "0", scoreValue: 0 },
  { label: "Menos de una vez a la semana", value: "1", scoreValue: 1 },
  { label: "Una o dos veces a la semana", value: "2", scoreValue: 2 },
  { label: "Tres o más veces a la semana", value: "3", scoreValue: 3 },
];

export const psqiSeed: TestSeedDefinition = {
  testId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  testCode: "PSQI",
  title: "Índice de Calidad de Sueño de Pittsburgh (PSQI)",
  description:
    "Esta es una prueba que evalúa la calidad y los patrones de sueño durante el último mes, identificando áreas de dificultad en 7 componentes.",
  sections: [
    { code: "habitos_sueno", name: "Hábitos de sueño" },
    { code: "problemas_sueno", name: "Problemas de sueño" },
    { code: "calidad_sueno", name: "Calidad del sueño" },
    { code: "medicacion", name: "Medicación" },
    { code: "disfuncion_diurna", name: "Disfunción diurna" },
    { code: "entorno", name: "Entorno / convivencia" },
    { code: "observaciones_pareja", name: "Observaciones del acompañante" },
  ],
  questions: [
    // — Hábitos de sueño —
    {
      code: "PSQI-1",
      prompt:
        "Durante el último mes, seleccione su hora habitual de acostarse (formato HH:MM AM/PM)",
      type: "time_input",
      sectionCode: "habitos_sueno",
      options: [],
      metadata: {
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "PSQI-2",
      prompt:
        "¿Cuánto tiempo habrá tardado en dormirse normalmente las noches del último mes?",
      type: "single_choice",
      sectionCode: "habitos_sueno",
      options: [
        { label: "Menos de 15 minutos", value: "0", scoreValue: 0 },
        { label: "Entre 16 y 30 minutos", value: "1", scoreValue: 1 },
        { label: "Entre 31 y 60 minutos", value: "2", scoreValue: 2 },
        { label: "Más de 60 minutos", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "PSQI-3",
      prompt:
        "Durante el último mes, seleccione su hora habitual de levantarse por la mañana (formato HH:MM AM/PM)",
      type: "time_input",
      sectionCode: "habitos_sueno",
      options: [],
      metadata: {
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "PSQI-4",
      prompt:
        "¿Cuántas horas calcula que habrá dormido verdaderamente cada noche durante el último mes?",
      type: "single_choice",
      sectionCode: "habitos_sueno",
      options: [
        { label: "Menos de 5 horas", value: "null", scoreValue: null },
        { label: "Entre 5 y 6 horas", value: "null", scoreValue: null },
        { label: "Entre 6 y 7 horas", value: "null", scoreValue: null },
        { label: "Más de 7 horas", value: "null", scoreValue: null },
      ],
    },
    {
      code: "PSQI-5",
      prompt: "¿Cuántas horas duerme exactamente?",
      type: "numeric",
      sectionCode: "habitos_sueno",
      options: [],
    },
    // — Problemas de sueño —
    {
      code: "PSQI-6.1",
      prompt: "No poder quedarse dormido en la primera media hora",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: {
        group: "PSQI-SLEEP-PROBLEMS",
        groupHeader:
          "Durante el mes pasado, ¿cuántas veces ha tenido usted problemas para dormir a causa de...?",
      },
    },
    {
      code: "PSQI-6.2",
      prompt: "Despertarse durante la noche o de madrugada",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.3",
      prompt: "Tener que levantarse para ir al baño",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.4",
      prompt: "No poder respirar bien",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.5",
      prompt: "Toser o roncar ruidosamente",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.6",
      prompt: "Sentir frío",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.7",
      prompt: "Sentir calor",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.8",
      prompt: "Tener malos sueños o pesadillas",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.9",
      prompt: "Tener dolores",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-6.10",
      prompt: "Otras razones (descripción)",
      type: "open_text",
      sectionCode: "problemas_sueno",
      options: [],
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    // — Calidad del sueño —
    {
      code: "PSQI-7",
      prompt:
        "Durante el último mes, ¿cómo calificaría en conjunto la calidad de su sueño?",
      type: "single_choice",
      sectionCode: "calidad_sueno",
      options: [
        { label: "Muy buena", value: "0", scoreValue: 0 },
        { label: "Bastante buena", value: "1", scoreValue: 1 },
        { label: "Bastante mala", value: "2", scoreValue: 2 },
        { label: "Muy mala", value: "3", scoreValue: 3 },
      ],
    },
    // — Medicación —
    {
      code: "PSQI-8",
      prompt:
        "Durante el último mes, ¿cuántas veces ha tomado medicinas (recetadas o por su cuenta) para dormir?",
      type: "single_choice",
      sectionCode: "medicacion",
      options: FREQ_OPTIONS,
    },
    // — Disfunción diurna —
    {
      code: "PSQI-9",
      prompt:
        "Durante el último mes, ¿cuántas veces ha tenido problemas para permanecer despierto mientras realizaba actividades?",
      type: "single_choice",
      sectionCode: "disfuncion_diurna",
      options: FREQ_OPTIONS,
    },
    {
      code: "PSQI-10",
      prompt:
        "Durante el último mes, ¿qué tan problemático fue mantener el entusiasmo para hacer sus actividades?",
      type: "single_choice",
      sectionCode: "disfuncion_diurna",
      options: [
        { label: "Nada problemático", value: "0", scoreValue: 0 },
        { label: "Sólo ligeramente problemático", value: "1", scoreValue: 1 },
        { label: "Moderadamente problemático", value: "2", scoreValue: 2 },
        { label: "Muy problemático", value: "3", scoreValue: 3 },
      ],
    },
    // — Entorno —
    {
      code: "PSQI-11",
      prompt: "¿Tiene usted pareja o compañero/a de habitación?",
      type: "single_choice",
      sectionCode: "entorno",
      options: [
        {
          label: "No tengo pareja ni compañero/a de habitación",
          value: "null",
          scoreValue: null,
        },
        {
          label: "Sí tengo, pero duerme en otra habitación",
          value: "null",
          scoreValue: null,
        },
        {
          label: "Sí tengo, pero duerme en la misma habitación y distinta cama",
          value: "null",
          scoreValue: null,
        },
        {
          label: "Sí tengo y duerme en la misma cama",
          value: "null",
          scoreValue: null,
        },
      ],
    },
    // — Observaciones del acompañante —
    {
      code: "PSQI-12.1",
      prompt: "Ronquidos ruidosos",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-11",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: {
        group: "PSQI-PARTNER-OBS",
        groupHeader:
          "Si usted tiene pareja o compañero/a de habitación, pregúntele si usted durante el último mes ha tenido…",
      },
    },
    {
      code: "PSQI-12.2",
      prompt: "Grandes pausas entre respiraciones mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-11",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-12.3",
      prompt: "Sacudidas o espasmos de piernas mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-11",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-12.4",
      prompt: "Episodios de desorientación o confusión mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-11",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-12.5",
      prompt: "Otros inconvenientes mientras duerme (describa)",
      type: "open_text",
      sectionCode: "observaciones_pareja",
      options: [],
      required: false,
      condition: {
        dependsOn: "PSQI-11",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
  ],
};

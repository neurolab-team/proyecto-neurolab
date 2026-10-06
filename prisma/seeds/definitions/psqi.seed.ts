import { group } from "node:console";
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
  audience: "user",
  description:
    "Cuestionario que evalúa diferentes aspectos de la calidad del sueño durante el último mes, mediante siete componentes.",
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
        "¿A qué hora se acostó normalmente por la noche? Seleccione la hora habitual en que se acuesta: /___/___/",
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
        "¿Cuánto tiempo se demoró en quedarse dormido en promedio?",
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
      prompt:"¿A qué hora se levantó habitualmente por la mañana? Seleccione la hora habitual de levantarse: /___/___/",
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
        "¿Cuántas horas durmió cada noche? (El tiempo puede ser diferente al que usted permanezca en la cama.) Seleccione las horas que crea que durmió: /___/___/",
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
      code: "PSQI-4.1",
      prompt: "¿Cuántas horas duerme exactamente?",
      type: "numeric",
      sectionCode: "habitos_sueno",
      options: [],
      metadata: {
        followUpOf: "PSQI-4",
      }
    },
    // — Problemas de sueño —
    {
      code: "PSQI-5.1",
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
      code: "PSQI-5.2",
      prompt: "Despertarse durante la noche o de madrugada",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.3",
      prompt: "Tener que levantarse para ir al baño",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.4",
      prompt: "No poder respirar bien",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.5",
      prompt: "Toser o roncar ruidosamente",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.6",
      prompt: "Sentir frío",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.7",
      prompt: "Sentir calor",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.8",
      prompt: "Tener malos sueños o pesadillas",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.9",
      prompt: "Tener dolores",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: FREQ_OPTIONS,
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
      code: "PSQI-5.10",
      prompt: "Otras razones (por favor, descríbalas)",
      type: "open_text",
      sectionCode: "problemas_sueno",
      options: [],
      metadata: { group: "PSQI-SLEEP-PROBLEMS" },
    },
    {
          code: "PSQI-6",
          prompt:
            "Durante el último mes, ¿cuántas veces ha tomado medicinas (recetadas por el medico o por su cuenta) para dormir?",
          type: "single_choice",
          sectionCode: "medicacion",
          options: FREQ_OPTIONS,
    },
    {
          code: "PSQI-7",
          prompt:
            "Durante el último mes, ¿cuántas veces ha tenido problemas para  permanecer despierto mientras conducía, comía, trabajaba, estudiaba o desarrollaba alguna otra actividad social",
          type: "single_choice",
          sectionCode: "disfuncion_diurna",
          options: [
            { label: "Nada problematico", value: "0", scoreValue: 0 },
            { label: "Sólo ligeramente problemático", value: "1", scoreValue: 1 },
            { label: "Moderadamente problemático", value: "2", scoreValue: 2 },
            { label: "Muy problemático", value: "3", scoreValue: 3 }

          ],
    },
    {
          code: "PSQI-8",
          prompt:
            "Durante el último mes, ¿qué tan problemático fue mantener el entusiasmo para realizar actividades como conducir, comer, trabajar, estudiar o alguna actividad social?",
          type: "single_choice",
          sectionCode: "disfuncion_diurna",
          options: [
            { label: "Nada problemático", value: "0", scoreValue: 0 },
            { label: "Sólo ligeramente problemático", value: "1", scoreValue: 1 },
            { label: "Moderadamente problemático", value: "2", scoreValue: 2 },
            { label: "Muy problemático", value: "3", scoreValue: 3 },
          ],
    },
    {
      code: "PSQI-9",
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
    {
      code: "PSQI-10",
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
    {
      code: "PSQI-11.1",
      prompt: "Ronquidos ruidosos",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-10",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: {
        group: "PSQI-PARTNER-OBS",
        groupHeader:
          "Si usted tiene pareja o compañero/a de habitación, pregúntele si usted durante el último mes ha tenido…",
      },
    },
    {
      code: "PSQI-11.2",
      prompt: "Grandes pausas entre respiraciones mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-10",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-11.3",
      prompt: "Sacudidas o espasmos de piernas mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-10",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-11.4",
      prompt: "Episodios de desorientación o confusión mientras duerme",
      type: "single_choice",
      sectionCode: "observaciones_pareja",
      options: FREQ_OPTIONS,
      required: false,
      condition: {
        dependsOn: "PSQI-10",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
    {
      code: "PSQI-11.5",
      prompt: "Otros inconvenientes mientras duerme (describa)",
      type: "open_text",
      sectionCode: "observaciones_pareja",
      options: [],
      required: false,
      condition: {
        dependsOn: "PSQI-10",
        showWhenNot: "No tengo pareja ni compañero/a de habitación",
      },
      metadata: { group: "PSQI-PARTNER-OBS" },
    },
  ],
};

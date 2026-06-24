import { TestSeedDefinition, SeedOption } from "../types";

const OPTIONS: SeedOption[] = [
  { label: "Nunca se ha quedado dormido", value: "0", scoreValue: 0 },
  {
    label: "Escasa probabilidad de quedarse dormido",
    value: "1",
    scoreValue: 1,
  },
  {
    label: "Moderada probabilidad de quedarse dormido",
    value: "2",
    scoreValue: 2,
  },
  { label: "Alta probabilidad de quedarse dormido", value: "3", scoreValue: 3 },
];

const GROUP_META = { group: "EPWORTH-SLEEP-PROBLEMS" };
const GROUP_HEADER_META = {
  ...GROUP_META,
  groupHeader:
    "¿Que tan probable es que usted se sienta somnoliento o se quede dormido de día, en cada una de las siguientes situaciones?",
};

export const epworthSeed: TestSeedDefinition = {
  testId: "9296e58f-68e0-5edd-92b4-f1725bf1877a",
  testCode: "EPWORTH",
  title: "Escala de Somnolencia Diurna de Epworth (ESE)",
  audience: "user",
  description:
    "Esta escala mide qué tan probable es que te quedes dormido en ocho situaciones cotidianas. Es una de las pruebas más usadas para entender hábitos de sueño y descanso. No hay respuestas correctas ni incorrectas",
  sections: [{ code: "problemas_sueno", name: "Problemas de sueño" }],
  questions: [
    {
      code: "EPWORTH-1",
      prompt: "Sentado y leyendo",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_HEADER_META,
    },
    {
      code: "EPWORTH-2",
      prompt: "Mirando television",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-3",
      prompt:
        "Sentado e inactivo en un lugar publico (cine, teatro, conferencia o reunión).",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-4",
      prompt: "Como pasajero en un carro durante una hora de marcha continua",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-5",
      prompt: "Acostado, descansando en la tarde",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-6",
      prompt: "Sentado y conversando con alguien",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-7",
      prompt: "Sentado, tranquilo, después de un almuerzo sin alcohol",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
    {
      code: "EPWORTH-8",
      prompt: "En un carro, mientras se detiene unos minutos en un trancón",
      type: "single_choice",
      sectionCode: "problemas_sueno",
      options: OPTIONS,
      metadata: GROUP_META,
    },
  ],
};

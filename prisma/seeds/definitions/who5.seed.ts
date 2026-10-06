import { TestSeedDefinition, SeedOption } from "../types";

const OPTIONS: SeedOption[] = [
  {
    label: "Todo el tiempo",
    value: "5",
    scoreValue: 5
  },
  {
    label: "La mayor parte del tiempo",
    value: "4",
    scoreValue: 4,
  },
  {
    label: "Mas de la mitad del tiempo",
    value: "3",
    scoreValue: 3,
  },
  {
      label: "Menos de la mitad del tiempo",
      value: "2",
      scoreValue: 2
  },
  {
    label: "De vez en cuando",
    value: "1",
    scoreValue: 1
  },
  {
    label: "Nunca",
    value: "0",
    scoreValue:0
  }
];
export const whoSeed: TestSeedDefinition = {
  testId: "b1f7c3a2-4d9e-5a6b-8c2f-3e7d9a1b4c60",
  testCode: "WHO5",
  title: "Índice de Bienestar de la OMS (WHO-5)",
  audience: "none",
  description:
    "Este cuestionario mide tu nivel de bienestar general durante las últimas dos semanas a partir de cinco afirmaciones sobre tu estado de ánimo, energía y descanso. Cifras mayores indican mayor bienestar. No hay respuestas correctas ni incorrectas",
  sections: [{ code: "bienestar", name: "Bienestar" }],
  questions: [
    {
      code: "WHO5-1",
      prompt: "Me he sentido alegre y de buen humor",
      type: "single_choice",
      sectionCode: "bienestar",
      options: OPTIONS,
    },
    {
          code: "WHO5-2",
          prompt: "Me he sentido tranquilo y relajado",
          type: "single_choice",
          sectionCode: "bienestar",
          options: OPTIONS,
    },
    {
          code: "WHO5-3",
          prompt: "Me he sentido activo y energico",
          type: "single_choice",
          sectionCode: "bienestar",
          options: OPTIONS,
    },
    {
          code: "WHO5-4",
          prompt: "Me he despertado fresco y descandado",
          type: "single_choice",
          sectionCode: "bienestar",
          options: OPTIONS,
    },
    {
          code: "WHO5-5",
          prompt: "Mi vida cotidiana ha estado llena de cosas que me interesan",
          type: "single_choice",
          sectionCode: "bienestar",
          options: OPTIONS,
    },
  ]
}

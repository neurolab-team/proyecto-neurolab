import { TestSeedDefinition, SeedOption } from "../types";

const OPTIONS: SeedOption[] = [
  {
    label: "Casi todos los dias",
    value: "3",
    scoreValue: 3,
  },
  {
      label: "Mas de la mitad de los dias",
      value: "2",
      scoreValue: 2
  },
  {
    label: "Varios dias",
    value: "1",
    scoreValue: 1
  },
  {
    label: "Nunca",
    value: "0",
    scoreValue:0
  }
];
export const phq9Seed: TestSeedDefinition = {
  testId: "c2a8d4b3-5e1f-5b7c-9d3a-4f8e1b2c5d70",
  testCode: "PHQ9",
  title: "Cuestionario de Salud del Paciente (PHQ-9)",
  audience: "none",
  description:
    "Este cuestionario mide la frecuencia con la que has experimentado nueve síntomas relacionados con el estado de ánimo durante los últimos días. Se usa para evaluar la presencia y gravedad de síntomas depresivos. No hay respuestas correctas ni incorrectas",
  sections: [{ code: "binestar", name: "Bienestar" }],
  questions: [
    {
      code: "PHQ9-1",
      prompt: "Poco interés o placer al hacer cosas",
      type: "single_choice",
      sectionCode: "binestar",
      options: OPTIONS,
    },
    {
          code: "PHQ9-2",
          prompt: "Sensación de poco ánimo, depresión o desesperanza",
          type: "single_choice",
          sectionCode: "binestar",
          options: OPTIONS,
    },
    {
          code: "PHQ9-3",
          prompt: "Difcultad para dormirse o permanecer dormido, o dormir demasiado",
          type: "single_choice",
          sectionCode: "binestar",
          options: OPTIONS,
    },
    {
          code: "PHQ9-4",
          prompt: "Sensación de cansancio o poca energía",
          type: "single_choice",
          sectionCode: "binestar",
          options: OPTIONS,
    },
    {
          code: "PHQ9-5",
          prompt: "Falta de apetito o comer demasiado",
          type: "single_choice",
          sectionCode: "binestar",
          options: OPTIONS,
    },
    {
              code: "PHQ9-6",
              prompt: "Sentirse mal con uno mismo, sentir que se es un fracasado,sentirse decepcionado con uno mismo o sentir que se ha decepcionado a la familia",
              type: "single_choice",
              sectionCode: "binestar",
              options: OPTIONS,
    },
    {
              code: "PHQ9-7",
              prompt: "Dificultad para concentrarse en cosas como leer el periódico o mirar la televisión",
              type: "single_choice",
              sectionCode: "binestar",
              options: OPTIONS,
    },
    {
              code: "PHQ9-8",
              prompt: "Moverse o hablar tan despacio que otras personas quizá lo noten o lo contrario: moverse tanto o estar tan inquieto que se ha ido de un lado a otro más de lo normal",
              type: "single_choice",
              sectionCode: "binestar",
              options: OPTIONS,
    },
    {
              code: "PHQ9-9",
              prompt: "Pensar que uno estaría mejor muerto o en herirse a uno mismo de alguna manera",
              type: "single_choice",
              sectionCode: "binestar",
              options: OPTIONS,
        },
  ]
}

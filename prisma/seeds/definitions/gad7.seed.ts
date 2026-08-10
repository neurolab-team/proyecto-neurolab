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
    label: "De nada",
    value: "0",
    scoreValue:0
  }
];

export const gad7Seed: TestSeedDefinition = {
  testId: "d3b9e5c4-6f2a-5c8d-af4b-5a9f2c3d6e80",
  testCode: "GAD7",
  title: "Cuestionario de Trastorno de Ansiedad Generalizada (GAD-7)",
  audience: "none",
  description:
    "Este cuestionario mide la frecuencia con la que has experimentado siete síntomas relacionados con la ansiedad durante las últimas dos semanas. Se usa para evaluar la presencia y gravedad de síntomas de ansiedad. No hay respuestas correctas ni incorrectas",
  sections: [{ code: "ansiedad", name: "Ansiedad" }],
  questions: [
    {
      code: "GAD7-1",
      prompt: "Sentirse nervioso, ansioso o nervioso",
      type: "single_choice",
      sectionCode: "ansiedad",
      options: OPTIONS,
      metadata: {
              group: "GAD-ANSIETY-PROBLEMS",
              groupHeader:
                "Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?",
      },
    },
    {
      code: "GAD7-2",
      prompt: "No poder detenerse o controlar la preocupación",
      type: "single_choice",
      sectionCode: "ansiedad",
      options: OPTIONS,
      metadata: {group: "GAD-ANSIETY-PROBLEMS",},
    },
    {
          code: "GAD7-3",
          prompt: "Preocuparse demasiado por cosas diferentes",
          type: "single_choice",
          sectionCode: "ansiedad",
          options: OPTIONS,
          metadata: {group: "GAD-ANSIETY-PROBLEMS",},
    },
    {
              code: "GAD7-4",
              prompt: "Dificultad para relajarse",
              type: "single_choice",
              sectionCode: "ansiedad",
              options: OPTIONS,
              metadata: {group: "GAD-ANSIETY-PROBLEMS",},
    },
    {
              code: "GAD7-5",
              prompt: "Ser tan inquieto que es difícil quedarse quieto",
              type: "single_choice",
              sectionCode: "ansiedad",
              options: OPTIONS,
              metadata: {group: "GAD-ANSIETY-PROBLEMS",},
    },
    {
              code: "GAD7-6",
              prompt: "Molestarse o irritarse con facilidad",
              type: "single_choice",
              sectionCode: "ansiedad",
              options: OPTIONS,
              metadata: {group: "GAD-ANSIETY-PROBLEMS",},
    },
    {
              code: "GAD7-8",
              prompt: "Sentir miedo, como si algo horrible pudiera suceder",
              type: "single_choice",
              sectionCode: "ansiedad",
              options: OPTIONS,
              metadata: {group: "GAD-ANSIETY-PROBLEMS",},
        },
  ]
};

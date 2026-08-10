import { TestSeedDefinition } from "../types";

const OPTIONS = [
  { label: "No me ha ocurrido", value: "0", scoreValue: 0 },
  {
    label: "Me ha ocurrido un poco, o durante parte del tiempo",
    value: "1",
    scoreValue: 1,
  },
  {
    label: "Me ha ocurrido bastante, o durante una buena parte del tiempo",
    value: "2",
    scoreValue: 2,
  },
  {
    label: "Me ha ocurrido mucho, o la mayor parte del tiempo",
    value: "3",
    scoreValue: 3,
  },
];

export const dass21Seed: TestSeedDefinition = {
  testId: "6996e58f-58e0-4edd-92b4-f1725bf1877d",
  testCode: "DASS-21",
  title: "Escala de Depresión, Ansiedad y Estrés (DASS-21)",
  audience: "none",
  description:
    "Esta es una prueba diseñada para medir los tres estados emocionales negativos de depresión, ansiedad y estrés.",
  sections: [
    { code: "D", name: "Depresion" },
    { code: "A", name: "Ansiedad" },
    { code: "S", name: "Estres" },
  ],
  questions: [
    {
      code: "S1",
      prompt: "Me ha costado mucho descargar la tensión",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "A1",
      prompt: "Me di cuenta que tenía la boca seca",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "D1",
      prompt: "No podía sentir ningún sentimiento positivo",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "A2",
      prompt: "Se me hizo difícil respirar",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "D2",
      prompt: "Se me hizo difícil tomar la iniciativa para hacer cosas",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "S2",
      prompt: "Reaccioné exageradamente en ciertas situaciones",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "A3",
      prompt: "Sentí que mis manos temblaban",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "S3",
      prompt: "He sentido que estaba gastando una gran cantidad de energía",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "A4",
      prompt:
        "Estaba preocupado por situaciones en las cuales podía tener pánico o en las que podría hacer el ridículo",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "D3",
      prompt: "He sentido que no había nada que me ilusionara",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "S4",
      prompt: "Me he sentido inquieto",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "S5",
      prompt: "Se me hizo difícil relajarme",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "D4",
      prompt: "Me sentí triste y deprimido",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "D5",
      prompt:
        "No toleré nada que no me permitiera continuar con lo que estaba haciendo",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "A5",
      prompt: "Sentí que estaba al punto de pánico",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "D6",
      prompt: "No me pude entusiasmar por nada",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "D7",
      prompt: "Sentí que valía muy poco como persona",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
    {
      code: "S6",
      prompt: "He tendido a sentirme enfadado con facilidad",
      type: "likert",
      sectionCode: "S",
      options: OPTIONS,
    },
    {
      code: "A6",
      prompt:
        "Sentí los latidos de mi corazón a pesar de no haber hecho ningún esfuerzo físico",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "A7",
      prompt: "Tuve miedo sin razón",
      type: "likert",
      sectionCode: "A",
      options: OPTIONS,
    },
    {
      code: "D8",
      prompt: "Sentí que la vida no tenía ningún sentido",
      type: "likert",
      sectionCode: "D",
      options: OPTIONS,
    },
  ],
};

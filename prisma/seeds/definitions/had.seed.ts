import { TestSeedDefinition } from "../types";

export const hadSeed: TestSeedDefinition = {
  testId: "7996e58f-68e0-5edd-92b4-f1725bf1877d",
  testCode: "HAD",
  title: "Escala Hospitalaria de Ansiedad y Depresión (HAD)",
  audience: "user",
  description:
    "Esta es una prueba que evalúa síntomas de ansiedad y depresión en contextos hospitalarios o de salud, ayudando a identificar malestar emocional en el paciente.",
  sections: [
    { code: "A", name: "Ansiedad" },
    { code: "D", name: "Depresion" },
  ],
  questions: [
    {
      code: "A1",
      prompt: "Me siento tenso o nervioso",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Todos los días", value: "3", scoreValue: 3 },
        { label: "Muchas veces", value: "2", scoreValue: 2 },
        { label: "A veces", value: "1", scoreValue: 1 },
        { label: "Nunca", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "D1",
      prompt: "Todavía disfruto con lo que me ha gustado hacer",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Como siempre", value: "0", scoreValue: 0 },
        { label: "No lo bastante", value: "1", scoreValue: 1 },
        { label: "Sólo un poco", value: "2", scoreValue: 2 },
        { label: "Nada", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "A2",
      prompt:
        "Tengo una sensación de miedo, como si algo horrible fuera a suceder",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Definitivamente y es muy fuerte", value: "3", scoreValue: 3 },
        { label: "Sí, pero no es muy fuerte", value: "2", scoreValue: 2 },
        { label: "Un poco, pero no me preocupa", value: "1", scoreValue: 1 },
        { label: "Nada", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "D2",
      prompt: "Puedo reirme y ver el lado positivo de las cosas",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Al igual que siempre lo hice", value: "0", scoreValue: 0 },
        { label: "No tanto ahora", value: "1", scoreValue: 1 },
        { label: "Casi nunca", value: "2", scoreValue: 2 },
        { label: "Nunca", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "A3",
      prompt: "Tengo mi mente llena de preocupaciones",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "La mayoría de las veces", value: "3", scoreValue: 3 },
        { label: "Con bastante frecuencia", value: "2", scoreValue: 2 },
        { label: "A veces, aunque no muy seguido", value: "1", scoreValue: 1 },
        { label: "Sólo en ocasiones", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "D3",
      prompt: "Me siento alegre",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Nunca", value: "3", scoreValue: 3 },
        { label: "No muy seguido", value: "2", scoreValue: 2 },
        { label: "A veces", value: "1", scoreValue: 1 },
        { label: "Casi siempre", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "A4",
      prompt: "Puedo estar sentado tranquilamente y sentirme relajado",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Siempre", value: "0", scoreValue: 0 },
        { label: "Por lo general", value: "1", scoreValue: 1 },
        { label: "No muy seguido", value: "2", scoreValue: 2 },
        { label: "Nunca", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "D4",
      prompt: "Siento como si yo cada día estuviera más lento",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Por lo general en todo momento", value: "3", scoreValue: 3 },
        { label: "Muy seguido", value: "2", scoreValue: 2 },
        { label: "A veces", value: "1", scoreValue: 1 },
        { label: "Nunca", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "A5",
      prompt:
        "Tengo una sensación extraña, como de aleteo o vacío en el estómago",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Nunca", value: "0", scoreValue: 0 },
        { label: "En ciertas ocasiones", value: "1", scoreValue: 1 },
        { label: "Con bastante frecuencia", value: "2", scoreValue: 2 },
        { label: "Muy seguido", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "D5",
      prompt: "He perdido el deseo de estar bien arreglado o presentado",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Totalmente", value: "3", scoreValue: 3 },
        { label: "No me preocupa como deberiera", value: "2", scoreValue: 2 },
        {
          label: "Podría tener un poco más de cuidado",
          value: "1",
          scoreValue: 1,
        },
        {
          label: "Me preocupo al igual que siempre",
          value: "0",
          scoreValue: 0,
        },
      ],
    },
    {
      code: "A6",
      prompt: "Me siento inquieto, como si no pudiera parar de moverme",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Mucho", value: "3", scoreValue: 3 },
        { label: "Bastante", value: "2", scoreValue: 2 },
        { label: "No mucho", value: "1", scoreValue: 1 },
        { label: "Nada", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "D6",
      prompt: "Me siento con esperanzas respecto al futuro",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Igual que siempre", value: "0", scoreValue: 0 },
        { label: "menos de lo que acostumbraba", value: "1", scoreValue: 1 },
        {
          label: "Mucho menos de lo que acostumbraba",
          value: "2",
          scoreValue: 2,
        },
        { label: "Nada", value: "3", scoreValue: 3 },
      ],
    },
    {
      code: "A7",
      prompt:
        "Presento una sensación de miedo muy intenso de un momento a otro",
      type: "single_choice",
      sectionCode: "A",
      options: [
        { label: "Muy frecuentemente", value: "3", scoreValue: 3 },
        { label: "Bastante seguido", value: "2", scoreValue: 2 },
        { label: "No muy seguido", value: "1", scoreValue: 1 },
        { label: "Nada", value: "0", scoreValue: 0 },
      ],
    },
    {
      code: "D7",
      prompt:
        "Me divierto con un buen libro, la radio o un programa de televisión",
      type: "single_choice",
      sectionCode: "D",
      options: [
        { label: "Seguido", value: "0", scoreValue: 0 },
        { label: "A veces", value: "1", scoreValue: 1 },
        { label: "No muy seguido", value: "2", scoreValue: 2 },
        { label: "Rara vez", value: "3", scoreValue: 3 },
      ],
    },
  ],
};

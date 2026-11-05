import { TestSeedDefinition } from "../types";

export const munichSeed: TestSeedDefinition = {
  testId: "c1e2d3d4-a5f6-1890-aecd-ef1234567890",
  testCode: "MUNICH",
  title: "Cuestionario de Cronotipo de Múnich (MCTQ)",
  audience: "user",
  description:
    "Conoce tus horarios habituales de sueño y vigilia y descubre tu cronotipo a partir de tus patrones de sueño.",
  sections: [
    { code: "dias_laborales", name: "Dias Laborales" },
    { code: "dias_no_laborales", name: "Dias No Laborales" },
    { code: "informacion_complementaria", name: "Informacion Complementaria" },
  ],
  questions: [
    {
      code: "MUNICH-1",
      prompt: "Me acuesto a las _____ horas",
      type: "time_input",
      sectionCode: "dias_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-2",
      prompt: "En realidad estoy listo/a para dormirme a las _____ horas",
      type: "time_input",
      sectionCode: "dias_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-3",
      prompt: "Necesito _____ minutos para conciliar el sueño",
      type: "numeric",
      sectionCode: "dias_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
      }
    },
    {
      code: "MUNICH-4",
      prompt: "Me despierto a las _____ horas",
      type: "time_input",
      sectionCode: "dias_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-5",
      prompt: "Me despierto _____",
      type: "single_choice",
      sectionCode: "dias_laborales",
      options: [
        { label: "Con despertador", value: "0", scoreValue: 0 },
        { label: "Sin despertador", value: "1", scoreValue: 1 },
      ],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
      }
    },
    {
      code: "MUNICH-6",
      prompt: "Me levanto despues de _____ minutos",
      type: "numeric",
      sectionCode: "dias_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días laborales o de estudio", text: "Responda las siguientes preguntas de acuerdo a su horario en dias laborales o estudios" },
      }
    },
    {
      code: "MUNICH-7",
      prompt: "Me acuesto a las _____ horas",
      type: "time_input",
      sectionCode: "dias_no_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-8",
      prompt: "En realidad estoy listo/a para dormirme a las _____ horas",
      type: "time_input",
      sectionCode: "dias_no_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-9",
      prompt: "Necesito _____ minutos para conciliar el sueǹo",
      type: "numeric",
      sectionCode: "dias_no_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
      }
    },
    {
      code: "MUNICH-10",
      prompt: "Me despierto a las _____ horas",
      type: "time_input",
      sectionCode: "dias_no_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-11",
      prompt: "Me despierto _____",
      type: "single_choice",
      sectionCode: "dias_no_laborales",
      options: [
        { label: "Con despertador", value: "0", scoreValue: 0 },
        { label: "Sin despertador", value: "1", scoreValue: 1 },
      ],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
      }
    },
    {
      code: "MUNICH-12",
      prompt: "Me levanto despues de  _____ minutos",
      type: "numeric",
      sectionCode: "dias_no_laborales",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Días de descanso", text: "Responda las siguientes preguntas de acuerdo a su horario en dias de descanso" },
      }
    },
    {
      code: "MUNICH-13",
      prompt: "Empiezo a trabajar o estudiar a las _____ horas",
      type: "time_input",
      sectionCode: "informacion_complementaria",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Información complementaria", text: "Responda la siguiente informacion complementaria" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },
    {
      code: "MUNICH-14",
      prompt: "Salgo de trabajar o estudiar a las _____ horas",
      type: "time_input",
      sectionCode: "informacion_complementaria",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Información complementaria", text: "Responda la siguiente informacion complementaria" },
        inputFormat: "12h",
        validHours: { min: 1, max: 12 },
        validMinutes: { min: 0, max: 59 },
        amPmRequired: true,
      },
    },

    {
      code: "MUNICH-15",
      prompt: "Tardo en llegar de mi casa al trabajo o estudio _____ horas",
      type: "numeric",
      sectionCode: "informacion_complementaria",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Información complementaria", text: "Responda la siguiente informacion complementaria" },
      }
    },
    {
      code: "MUNICH-16",
      prompt:
        "Necesito _____ horas desde que me despierto hasta que salgo de casa",
      type: "numeric",
      sectionCode: "informacion_complementaria",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Información complementaria", text: "Responda la siguiente informacion complementaria" },
      }
    },
    {
      code: "MUNICH-17",
      prompt: "Trabajo o estudio _____ dias a la semana",
      type: "numeric",
      sectionCode: "informacion_complementaria",
      options: [],
      metadata: {
        notice: { variant: "section", title: "Información complementaria", text: "Responda la siguiente informacion complementaria" },
      }
    },
  ],
};

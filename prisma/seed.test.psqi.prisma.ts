import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEST_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const TEST_CODE = "PSQI";
const TEST_TITLE = "Índice de Calidad de Sueño de Pittsburgh (PSQI)";
const TEST_DESC =
  "Instrumento que evalúa la calidad y los patrones de sueño durante el último mes, identificando áreas de dificultad en 7 componentes.";

const FREQ_OPTIONS = [
  { label: "Ninguna vez en el último mes", scoreValue: null },
  { label: "Menos de una vez a la semana", scoreValue: null },
  { label: "Una o dos veces a la semana", scoreValue: null },
  { label: "Tres o más veces a la semana", scoreValue: null },
];

type QuestionData = {
  code: string;
  prompt: string;
  type: "open_text" | "numeric" | "single_choice" | "time_input" | "multiple_choice" | "likert";
  sectionCode: string;
  options: { label: string; scoreValue: number | null }[];
  condition?: object;
  metadata?: object;
};

const questionsData: QuestionData[] = [
  // — Hábitos de sueño —
  {
    code: "PSQI-1",
    prompt: "Durante el último mes, seleccione su hora habitual de acostarse (formato HH:MM AM/PM)",
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
    prompt: "¿Cuánto tiempo habrá tardado en dormirse normalmente las noches del último mes?",
    type: "single_choice",
    sectionCode: "habitos_sueno",
    options: [
      { label: "Menos de 15 minutos", scoreValue: null },
      { label: "Entre 16 y 30 minutos", scoreValue: null },
      { label: "Entre 31 y 60 minutos", scoreValue: null },
      { label: "Más de 60 minutos", scoreValue: null },
    ],
  },
  {
    code: "PSQI-3",
    prompt: "Durante el último mes, seleccione su hora habitual de levantarse por la mañana (formato HH:MM AM/PM)",
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
    prompt: "¿Cuántas horas calcula que habrá dormido verdaderamente cada noche durante el último mes?",
    type: "single_choice",
    sectionCode: "habitos_sueno",
    options: [
      { label: "Menos de 5 horas", scoreValue: null },
      { label: "Entre 5 y 6 horas", scoreValue: null },
      { label: "Entre 6 y 7 horas", scoreValue: null },
      { label: "Más de 7 horas", scoreValue: null },
    ],
  },
  {
    code: "PSQI-5",
    prompt: "¿Cuántas horas duerme exactamente?",
    type: "numeric",
    sectionCode: "habitos_sueno",
    options: [],
  },
  // — Problemas de sueño (bloque agrupado) —
  {
    code: "PSQI-6.1",
    prompt: "No poder quedarse dormido en la primera media hora",
    type: "single_choice",
    sectionCode: "problemas_sueno",
    options: FREQ_OPTIONS,
    metadata: { group: "PSQI-SLEEP-PROBLEMS", groupHeader: "Durante el mes pasado, ¿cuántas veces ha tenido usted problemas para dormir a causa de...?" },
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
    code: "PSQI-6.11",
    prompt: "Otras razones (descripción)",
    type: "open_text",
    sectionCode: "problemas_sueno",
    options: [],
    metadata: { group: "PSQI-SLEEP-PROBLEMS" },
  },
  // — Calidad del sueño —
  {
    code: "PSQI-7",
    prompt: "Durante el último mes, ¿cómo calificaría en conjunto la calidad de su sueño?",
    type: "single_choice",
    sectionCode: "calidad_sueno",
    options: [
      { label: "Muy buena", scoreValue: null },
      { label: "Bastante buena", scoreValue: null },
      { label: "Bastante mala", scoreValue: null },
      { label: "Muy mala", scoreValue: null },
    ],
  },
  // — Medicación —
  {
    code: "PSQI-8",
    prompt: "Durante el último mes, ¿cuántas veces ha tomado medicinas (recetadas o por su cuenta) para dormir?",
    type: "single_choice",
    sectionCode: "medicacion",
    options: FREQ_OPTIONS,
  },
  // — Disfunción diurna —
  {
    code: "PSQI-9",
    prompt: "Durante el último mes, ¿cuántas veces ha tenido problemas para permanecer despierto mientras realizaba actividades?",
    type: "single_choice",
    sectionCode: "disfuncion_diurna",
    options: FREQ_OPTIONS,
  },
  {
    code: "PSQI-10",
    prompt: "Durante el último mes, ¿qué tan problemático fue mantener el entusiasmo para hacer sus actividades?",
    type: "single_choice",
    sectionCode: "disfuncion_diurna",
    options: [
      { label: "Nada problemático", scoreValue: null },
      { label: "Sólo ligeramente problemático", scoreValue: null },
      { label: "Moderadamente problemático", scoreValue: null },
      { label: "Muy problemático", scoreValue: null },
    ],
  },
  // — Entorno —
  {
    code: "PSQI-11",
    prompt: "¿Tiene usted pareja o compañero/a de habitación?",
    type: "single_choice",
    sectionCode: "entorno",
    options: [
      { label: "No tengo pareja ni compañero/a de habitación", scoreValue: null },
      { label: "Sí tengo, pero duerme en otra habitación", scoreValue: null },
      { label: "Sí tengo, pero duerme en la misma habitación y distinta cama", scoreValue: null },
      { label: "Sí tengo y duerme en la misma cama", scoreValue: null },
    ],
  },
  // — Observaciones del acompañante (bloque agrupado + condicional) —
  {
    code: "PSQI-12.1",
    prompt: "Ronquidos ruidosos",
    type: "single_choice",
    sectionCode: "observaciones_pareja",
    options: FREQ_OPTIONS,
    condition: { dependsOn: "PSQI-11", showWhenNot: "No tengo pareja ni compañero/a de habitación" },
    metadata: { group: "PSQI-PARTNER-OBS", groupHeader: "Si usted tiene pareja o compañero/a de habitación, pregúntele si usted durante el último mes ha tenido…" },
  },
  {
    code: "PSQI-12.2",
    prompt: "Grandes pausas entre respiraciones mientras duerme",
    type: "single_choice",
    sectionCode: "observaciones_pareja",
    options: FREQ_OPTIONS,
    condition: { dependsOn: "PSQI-11", showWhenNot: "No tengo pareja ni compañero/a de habitación" },
    metadata: { group: "PSQI-PARTNER-OBS" },
  },
  {
    code: "PSQI-12.3",
    prompt: "Sacudidas o espasmos de piernas mientras duerme",
    type: "single_choice",
    sectionCode: "observaciones_pareja",
    options: FREQ_OPTIONS,
    condition: { dependsOn: "PSQI-11", showWhenNot: "No tengo pareja ni compañero/a de habitación" },
    metadata: { group: "PSQI-PARTNER-OBS" },
  },
  {
    code: "PSQI-12.4",
    prompt: "Episodios de desorientación o confusión mientras duerme",
    type: "single_choice",
    sectionCode: "observaciones_pareja",
    options: FREQ_OPTIONS,
    condition: { dependsOn: "PSQI-11", showWhenNot: "No tengo pareja ni compañero/a de habitación" },
    metadata: { group: "PSQI-PARTNER-OBS" },
  },
  {
    code: "PSQI-12.5",
    prompt: "Otros inconvenientes mientras duerme (describa)",
    type: "open_text",
    sectionCode: "observaciones_pareja",
    options: [],
    condition: { dependsOn: "PSQI-11", showWhenNot: "No tengo pareja ni compañero/a de habitación" },
    metadata: { group: "PSQI-PARTNER-OBS" },
  },
];

const sectionsData = [
  { code: "habitos_sueno", name: "Hábitos de sueño" },
  { code: "problemas_sueno", name: "Problemas de sueño" },
  { code: "calidad_sueno", name: "Calidad del sueño" },
  { code: "medicacion", name: "Medicación" },
  { code: "disfuncion_diurna", name: "Disfunción diurna" },
  { code: "entorno", name: "Entorno / convivencia" },
  { code: "observaciones_pareja", name: "Observaciones del acompañante" },
];

async function main() {
  console.log("Iniciando seed del test PSQI...");
  await prisma.$transaction(async (tx) => {
    console.log("[1/5] Limpiando datos antiguos del test PSQI...");
    await tx.questionOption.deleteMany({
      where: { question: { test: { testCode: TEST_CODE } } },
    });
    await tx.question.deleteMany({ where: { test: { testCode: TEST_CODE } } });
    await tx.testSection.deleteMany({ where: { test: { testCode: TEST_CODE } } });
    await tx.test.deleteMany({
      where: { OR: [{ testId: TEST_ID }, { testCode: TEST_CODE }] },
    });

    console.log(`[2/5] Creando test: ${TEST_TITLE}`);
    const newTest = await tx.test.create({
      data: {
        testId: TEST_ID,
        testCode: TEST_CODE,
        title: TEST_TITLE,
        description: TEST_DESC,
        isPublished: true,
      },
    });

    console.log("[3/5] Creando secciones...");
    const sectionMap: Record<string, string> = {};
    for (const s of sectionsData) {
      const section = await tx.testSection.create({
        data: {
          testId: newTest.testId,
          testSectionCode: s.code,
          name: s.name,
        },
      });
      sectionMap[s.code] = section.testSectionId;
    }

    console.log(`[4/5] Creando ${questionsData.length} preguntas...`);
    for (const q of questionsData) {
      await tx.question.create({
        data: {
          testId: newTest.testId,
          testSectionId: sectionMap[q.sectionCode],
          code: q.code,
          prompt: q.prompt,
          type: q.type,
          required: !q.condition,
          condition: q.condition ?? undefined,
          metadata: q.metadata ?? undefined,
          ...(q.options.length > 0 && {
            questionOption: {
              createMany: {
                data: q.options.map((opt) => ({
                  label: opt.label,
                  value: String(opt.scoreValue),
                  scoreValue: opt.scoreValue,
                })),
              },
            },
          }),
        },
      });
    }
  });
  console.log("[5/5] ¡Test PSQI creado exitosamente!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

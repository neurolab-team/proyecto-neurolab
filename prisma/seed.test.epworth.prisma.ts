import "dotenv/config";
import { PrismaClient } from "../packages/libs/prisma/generated/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const TEST_ID = "9296e58f-68e0-5edd-92b4-f1725bf1877a";
const TEST_CODE = "EPWORTH";
const TEST_TITLE = "Escala de Somnolencia Diurna de Epworth (ESE)";
const TEST_DESC =
  "Esta prueba evalúa el nivel de somnolencia durante el día en diversas situaciones de la vida cotidian";

const FREQ_OPTIONS = [
  {
    label: "Nunca se ha quedado dormido",
    value: "0",
    scoreValue: 0,
  },
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
  {
    label: "Alta probabilidad de quedarse dormido",
    value: "3",
    scoreValue: 3,
  },
];
const questionsData = [
  {
    code: "EPWORTH-1",
    prompt: "Sentado y leyendo",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
      groupHeader:
        "¿Que tan probable es que usted se sienta somnoliento o se quede dormido de día, en cada una de las siguientes situaciones?",
    },
  },
  {
    code: "EPWORTH-2",
    prompt: "Mirando television",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-3",
    prompt:
      "Sentado e inactivo en un lugar publico (cine, teatro, conferencia o reunión).",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-4",
    prompt: "Como pasajero en un carro durante una hora de marcha continua",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-5",
    prompt: "Acostado, descansando en la tarde",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-6",
    prompt: "Sentado y conversando con alguien",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-7",
    prompt: "Sentado, tranquilo, después de un almuerzo sin alcohol ",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
  {
    code: "EPWORTH-8",
    prompt: "En un carro, mientras se detiene unos minutos en un trancón ",
    sectionCode: "problemas_sueno",
    metadata: {
      group: "EPWORTH-SLEEP-PROBLEMS",
    },
  },
];

async function main() {
  console.log(`Iniciando el sembrado (seeding) de la base de datos...`);
  await prisma.$transaction(async (tx) => {
    console.log(`[1/5] Limpiando datos antiguos del test ${TEST_ID}...`);
    await tx.questionOption.deleteMany({
      where: { question: { test: { testCode: TEST_CODE } } },
    });

    await tx.question.deleteMany({ where: { test: { testCode: TEST_CODE } } });
    await tx.testSection.deleteMany({
      where: { test: { testCode: TEST_CODE } },
    });
    await tx.test.deleteMany({
      where: { OR: [{ testId: TEST_ID }, { testCode: TEST_CODE }] },
    });

    //2. Crear el test
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

    //3. Crear las secciones
    console.log(`[3/5] Creando secciones (subescalas)...`);
    const section = await tx.testSection.create({
      data: {
        testId: newTest.testId!,
        testSectionCode: "problemas_sueno",
        name: "Problemas de sueño",
      },
    });
    //4. Crear preguntas y opciones
    console.log(
      `[4/5] Creando ${questionsData.length} preguntas con sus opciones...`,
    );

    for (const q of questionsData) {
      await tx.question.create({
        data: {
          testId: newTest.testId!,
          testSectionId: section.testSectionId,
          code: q.code,
          prompt: q.prompt,
          type: "single_choice",
          metadata: q.metadata ? JSON.stringify(q.metadata) : "",
          questionOption: {
            createMany: {
              data: FREQ_OPTIONS.map((opt) => ({
                label: opt.label,
                value: String(opt.scoreValue),
                scoreValue: opt.scoreValue,
              })),
            },
          },
        },
      });
    }
  });
  console.log(`[5/5] ¡Test Epworth creado exitosamente!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

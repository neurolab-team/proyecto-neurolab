import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEST_ID = "6996e58f-58e0-4edd-92b4-f1725bf1877d";
const TEST_CODE = "DASS-21";
const TEST_TITLE = "Escala de Depresión, Ansiedad y Estrés (DASS-21)";
const TEST_DESC =
  "Inventario de autoinforme de 21 ítems diseñado para medir los tres estados emocionales negativos de depresión, ansiedad y estrés.";

const options = [
  {
    label: "No me ha ocurrido",
    value: "0",
    scoreValue: 0,
  },
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

// D = Depresión, A = Ansiedad, S = Estrés (Stress)
const questionsData = [
  {
    code: "S1",
    prompt: "Me ha costado mucho descargar la tensión",
    sectionCode: "S",
  },
  {
    code: "A1",
    prompt: "Me di cuenta que tenía la boca seca",
    sectionCode: "A",
  },
  {
    code: "D1",
    prompt: "No podía sentir ningún sentimiento positivo",
    sectionCode: "D",
  },
  { code: "A2", prompt: "Se me hizo difícil respirar", sectionCode: "A" },
  {
    code: "D2",
    prompt: "Se me hizo difícil tomar la iniciativa para hacer cosas",
    sectionCode: "D",
  },
  {
    code: "S2",
    prompt: "Reaccioné exageradamente en ciertas situaciones",
    sectionCode: "S",
  },
  { code: "A3", prompt: "Sentí que mis manos temblaban", sectionCode: "A" },
  {
    code: "S3",
    prompt: "He sentido que estaba gastando una gran cantidad de energía",
    sectionCode: "S",
  }, // Nota: Este ítem es de Estrés, no Depresión como a veces se confunde.
  {
    code: "A4",
    prompt:
      "Estaba preocupado por situaciones en las cuales podía tener pánico o en las que podría hacer el ridículo",
    sectionCode: "A",
  },
  {
    code: "D3",
    prompt: "He sentido que no había nada que me ilusionara",
    sectionCode: "D",
  },
  { code: "S4", prompt: "Me he sentido inquieto", sectionCode: "S" },
  { code: "S5", prompt: "Se me hizo difícil relajarme", sectionCode: "S" },
  { code: "D4", prompt: "Me sentí triste y deprimido", sectionCode: "D" },
  {
    code: "D5",
    prompt:
      "No toleré nada que no me permitiera continuar con lo que estaba haciendo",
    sectionCode: "S",
  },
  {
    code: "A5",
    prompt: "Sentí que estaba al punto de pánico",
    sectionCode: "A",
  },
  { code: "D6", prompt: "No me pude entusiasmar por nada", sectionCode: "D" },
  {
    code: "D7",
    prompt: "Sentí que valía muy poco como persona",
    sectionCode: "D",
  },
  {
    code: "S6",
    prompt: "He tendido a sentirme enfadado con facilidad",
    sectionCode: "S",
  },
  {
    code: "A6",
    prompt:
      "Sentí los latidos de mi corazón a pesar de no haber hecho ningún esfuerzo físico",
    sectionCode: "A",
  },
  { code: "A7", prompt: "Tuve miedo sin razón", sectionCode: "A" },
  {
    code: "D8",
    prompt: "Sentí que la vida no tenía ningún sentido",
    sectionCode: "D",
  },
];

async function main() {
  console.log(`Iniciando el sembrado (seeding) de la base de datos...`);
  await prisma.$transaction(async (tx) => {
    console.log(`[1/5] Limpiando datos antiguos del test ${TEST_ID}...`);
    await tx.questionOption.deleteMany({
      where: { question: { test: { testCode: TEST_CODE } } }, });
    await tx.question.deleteMany({ where: { test: { testCode: TEST_CODE } } });
    await tx.testSection.deleteMany({
      where: { test: { testCode: TEST_CODE } },});
    await tx.test.deleteMany({
      where: {
        OR: [{ testId: TEST_ID }, { testCode: TEST_CODE }],},});

    // 2. CREAR EL TEST
    console.log(`[2/5] Creando test: ${TEST_TITLE}`);
    const newTest = await tx.test.create({
      data: {
        testId: TEST_ID,
        testCode: TEST_CODE,
        title: TEST_TITLE,
        description: TEST_DESC,
        isPublished: true,
        // createdByNumber: 'tu-numero-de-admin' // Opcional: vincula a un usuario admin
      },
    });

    // 3. CREAR LAS SECCIONES (SUBESCALAS)
    console.log(`[3/5] Creando secciones (subescalas)...`);
    const sectionD = await tx.testSection.create({
      data: {
        testId: newTest.testId!,
        testSectionCode: "D",
        name: "Depresion",
      },
    });
    const sectionA = await tx.testSection.create({
      data: {
        testId: newTest.testId!,
        testSectionCode: "A",
        name: "Ansiedad",
      },
    });
    const sectionS = await tx.testSection.create({
      data: {
        testId: newTest.testId!,
        testSectionCode: "S",
        name: "Estres",
      },
    });

    // Mapa para asignar fácilmente la sección a cada pregunta
    const sectionMap = {
      D: sectionD.testSectionId,
      A: sectionA.testSectionId,
      S: sectionS.testSectionId,
    };

    // 4. CREAR LAS PREGUNTAS Y SUS OPCIONES
    console.log(
      `[4/5] Creando ${questionsData.length} preguntas con sus opciones...`,
    );
    for (const q of questionsData) {
      await tx.question.create({
        data: {
          testId: newTest.testId!,
          // Asignamos el ID de la sección correcta (D, A, o S)
          testSectionId: sectionMap[q.sectionCode as "D" | "A" | "S"],
          code: q.code,
          prompt: q.prompt,

          // Anidamos la creación de las 4 opciones para ESTA pregunta
          questionOption: {
            createMany: {
              data: options.map((opt) => ({
                label: opt.label,
                value: opt.value,
                scoreValue: opt.scoreValue,
              })),
            },
          },
        },
      });
    }

    console.log(`[5/5] ¡Test DASS-21 creado exitosamente!`);
  });

  console.log(`Sembrado (seeding) finalizado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

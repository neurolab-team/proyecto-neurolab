import "dotenv/config";
import { PrismaClient } from "../../packages/libs/prisma/generated/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { SeedOption, SeedQuestion, TestSeedDefinition } from "./types";
import { readdirSync } from "fs";
import { join } from "path";

function collectSeedFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSeedFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".seed.ts")) {
      files.push(full);
    }
  }
  return files;
}

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
type ExistingOption = {
  questionOptionId: string;
  label: string;
  value: string | null;
  _count: { answers: number };
};

// Empareja cada opción del seed con una existente para actualizarla en lugar de
// recrearla, así las respuestas que apuntan a ella se conservan.
function matchOption(
  opt: SeedOption,
  seedOptions: SeedOption[],
  pool: ExistingOption[],
): ExistingOption | undefined {
  const valueIsUnique =
    seedOptions.filter((o) => o.value === opt.value).length === 1;
  return (
    pool.find((e) => e.value === opt.value && e.label === opt.label) ??
    (valueIsUnique ? pool.find((e) => e.value === opt.value) : undefined) ??
    pool.find((e) => e.label === opt.label)
  );
}

async function syncOptions(tx: Tx, questionId: string, q: SeedQuestion) {
  const pool: ExistingOption[] = await tx.questionOption.findMany({
    where: { questionId },
    select: {
      questionOptionId: true,
      label: true,
      value: true,
      _count: { select: { answers: true } },
    },
  });

  for (const opt of q.options) {
    const match = matchOption(opt, q.options, pool);
    const data = {
      label: opt.label,
      value: opt.value,
      scoreValue: opt.scoreValue,
    };
    if (match) {
      pool.splice(pool.indexOf(match), 1);
      await tx.questionOption.update({
        where: { questionOptionId: match.questionOptionId },
        data,
      });
    } else {
      await tx.questionOption.create({ data: { questionId, ...data } });
    }
  }

  for (const leftover of pool) {
    if (leftover._count.answers > 0) {
      console.warn(
        `  ⚠ ${q.code}: opción "${leftover.label}" ya no está en el seed pero tiene respuestas; se conserva`,
      );
    } else {
      await tx.questionOption.delete({
        where: { questionOptionId: leftover.questionOptionId },
      });
    }
  }
}

async function seedTest(def: TestSeedDefinition) {
  await prisma.$transaction(
    async (tx) => {
      const testData = {
        testCode: def.testCode,
        title: def.title,
        description: def.description,
        audience: def.audience,
        isPublished: true,
      };
      await tx.test.upsert({
        where: { testId: def.testId },
        update: testData,
        create: { testId: def.testId, ...testData },
      });

      const existingSections = await tx.testSection.findMany({
        where: { testId: def.testId },
      });
      const sectionMap: Record<string, string> = {};
      for (const s of def.sections) {
        const existing = existingSections.find(
          (e) => e.testSectionCode === s.code,
        );
        const section = existing
          ? await tx.testSection.update({
              where: { testSectionId: existing.testSectionId },
              data: { name: s.name },
            })
          : await tx.testSection.create({
              data: { testId: def.testId, testSectionCode: s.code, name: s.name },
            });
        sectionMap[s.code] = section.testSectionId;
      }

      const seedQuestionCodes = def.questions.map((q) => q.code);
      for (const q of def.questions) {
        const questionData = {
          testSectionId: sectionMap[q.sectionCode],
          prompt: q.prompt,
          type: q.type,
          required: q.required ?? true,
          condition: q.condition ? JSON.stringify(q.condition) : null,
          metadata: q.metadata ? JSON.stringify(q.metadata) : null,
        };
        const question = await tx.question.upsert({
          where: { testId_code: { testId: def.testId, code: q.code } },
          update: questionData,
          create: { testId: def.testId, code: q.code, ...questionData },
        });
        await syncOptions(tx, question.questionId, q);
      }

      // Preguntas que ya no están en el seed: solo se borran si nadie las respondió.
      const staleQuestions = await tx.question.findMany({
        where: {
          testId: def.testId,
          OR: [{ code: null }, { code: { notIn: seedQuestionCodes } }],
        },
        select: {
          questionId: true,
          code: true,
          _count: { select: { answers: true } },
        },
      });
      for (const stale of staleQuestions) {
        if (stale._count.answers > 0) {
          console.warn(
            `  ⚠ ${stale.code}: ya no está en el seed pero tiene respuestas; se conserva`,
          );
        } else {
          await tx.question.delete({ where: { questionId: stale.questionId } });
        }
      }

      await tx.testSection.deleteMany({
        where: {
          testId: def.testId,
          testSectionId: { notIn: Object.values(sectionMap) },
          questions: { none: {} },
        },
      });

      console.log(`✓ ${def.testCode} sincronizado exitosamente`);
    },
    { timeout: 120_000 },
  );
}

async function main() {
  const target = process.argv[2]?.toUpperCase();
  const files = collectSeedFiles(__dirname);

  if (files.length === 0) {
    console.log("No se encontraron definiciones de seeds.");
    return;
  }

  console.log(
    target
      ? `Ejecutando seed: ${target}`
      : `Ejecutando todos los seeds (${files.length})...`,
  );

  for (const file of files) {
    const mod = await import(file);
    const def: TestSeedDefinition = Object.values(mod)[0] as TestSeedDefinition;
    if (!target || def.testCode === target) {
      await seedTest(def);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

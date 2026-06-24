import "dotenv/config";
import { PrismaClient } from "../../packages/libs/prisma/generated/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { TestSeedDefinition } from "./types";
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

async function seedTest(def: TestSeedDefinition) {
  await prisma.$transaction(async (tx) => {
    await tx.questionOption.deleteMany({
      where: { question: { test: { testCode: def.testCode } } },
    });
    await tx.question.deleteMany({
      where: { test: { testCode: def.testCode } },
    });
    await tx.testSection.deleteMany({
      where: { test: { testCode: def.testCode } },
    });
    await tx.test.deleteMany({
      where: { OR: [{ testId: def.testId }, { testCode: def.testCode }] },
    });

    const newTest = await tx.test.create({
      data: {
        testId: def.testId,
        testCode: def.testCode,
        title: def.title,
        description: def.description,
        audience: def.audience,
        isPublished: true,
      },
    });

    const sectionMap: Record<string, string> = {};
    for (const s of def.sections) {
      const section = await tx.testSection.create({
        data: { testId: newTest.testId, testSectionCode: s.code, name: s.name },
      });
      sectionMap[s.code] = section.testSectionId;
    }

    for (const q of def.questions) {
      await tx.question.create({
        data: {
          testId: newTest.testId,
          testSectionId: sectionMap[q.sectionCode],
          code: q.code,
          prompt: q.prompt,
          type: q.type,
          required: q.required ?? true,
          condition: q.condition ? JSON.stringify(q.condition) : undefined,
          metadata: q.metadata ? JSON.stringify(q.metadata) : undefined,
          ...(q.options.length > 0 && {
            questionOption: {
              createMany: {
                data: q.options.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                  scoreValue: opt.scoreValue,
                })),
              },
            },
          }),
        },
      });
    }

    console.log(`✓ ${def.testCode} sembrado exitosamente`);
  });
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

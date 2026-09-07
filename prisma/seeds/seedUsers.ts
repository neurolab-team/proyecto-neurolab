import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../../packages/libs/prisma/generated/client";

export const ADMIN_SEED_USER_ID = "a0000000-0000-4000-8000-000000000001";
export const PSYCHOLOGIST_SEED_USER_ID = "b0000000-0000-4000-8000-000000000002";

type SeedUserDefinition = {
  userId: string;
  userNumber: string;
  email: string;
  name: string;
  role: "admin" | "psychologist";
  userType: "itmStudent" | "itmEmployee" | "external";
  password: string;
};

const SEED_USERS: SeedUserDefinition[] = [
  {
    userId: ADMIN_SEED_USER_ID,
    userNumber: "ADMIN-0001",
    email: "admin@gmail.com",
    name: "Administrador Neurolab",
    role: "admin",
    userType: "itmEmployee",
    password: process.env.SEED_ADMIN_PASSWORD ?? "Admin2026!",
  },
  {
    userId: PSYCHOLOGIST_SEED_USER_ID,
    userNumber: "PSICO-0001",
    email: "psicologo@gmail.com",
    name: "Psicologo Neurolab",
    role: "psychologist",
    userType: "itmEmployee",
    password: process.env.SEED_PSYCHOLOGIST_PASSWORD ?? "Psicologo2026!",
  },
];

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

function resolveSaltRounds(): number {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
}

async function seedUser(def: SeedUserDefinition) {
  const email = def.email.toLowerCase();
  const password = await bcrypt.hash(def.password, resolveSaltRounds());
  const now = new Date();

 const commonData = {
    userNumber: def.userNumber,
    name: def.name,
    role: def.role,
    userType: def.userType,
    password,
    isActive: true,
    verifiedEmail: true,
    mustChangePassword: false,
    passwordChangedAt: now,
  };

  const user = await prisma.user.upsert({
    where: { email },
    update: commonData,
    create: {
      userId: def.userId,
      email,
      ...commonData,
    },
  });

  console.log(`✓ ${user.role.padEnd(12)} ${user.email} (userId: ${user.userId})`);
}

async function main() {
  const target = process.argv[2]?.toLowerCase();
  const selected = target
    ? SEED_USERS.filter(
        (def) => def.role === target || def.email.toLowerCase() === target,
      )
    : SEED_USERS;

  if (selected.length === 0) {
    console.log(
      `No hay usuarios de seed que coincidan con "${target}". Opciones: admin, psychologist o un email.`,
    );
    return;
  }

  console.log(`Sembrando ${selected.length} usuario(s)...`);
  for (const def of selected) {
    await seedUser(def);
  }
  console.log(
    "Listo. Las contraseñas son las definidas en el seed (o SEED_ADMIN_PASSWORD / SEED_PSYCHOLOGIST_PASSWORD).",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Resolución lazy de la URL: usar process.env directo en vez del helper
    // env(), que se evalúa de forma eager al cargar el config y lanza si falta
    // DATABASE_URL. Comandos como `generate` o `validate` no necesitan la URL;
    // solo migrate/db push/runtime la consumen. Así el config carga en cualquier
    // job de CI y la URL solo se exige donde realmente se usa.
    url: process.env.DATABASE_URL,
  },
});

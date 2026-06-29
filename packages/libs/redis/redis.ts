import { createClient, RedisClientType } from "redis";

// Construye la URL de conexión a partir de las variables disponibles.
// - REDIS_URL: si está definida, tiene prioridad (URL completa).
// - REDIS_HOST: forma "host:puerto" (p. ej. "redis:6379"); si no trae puerto,
//   se asume 6379.
// El password se pasa como opción separada (no embebido en la URL) para evitar
// problemas de encoding con caracteres especiales.
function buildRedisUrl(): string {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  const host = process.env.REDIS_HOST ?? "localhost:6379";
  const hostWithPort = host.includes(":") ? host : `${host}:6379`;
  return `redis://${hostWithPort}`;
}

const redis: RedisClientType = createClient({
  url: buildRedisUrl(),
  ...(process.env.REDIS_PASSWORD
    ? { password: process.env.REDIS_PASSWORD }
    : {}),
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function connectRedis() {
  await redis.connect();
  console.log("Conectado a Redis exitosamente.");
}

connectRedis();

export default redis;

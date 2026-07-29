import  { CorsOptions } from 'cors';
import type { Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

function getAllowedOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGINS ?? '';
  const configured = fromEnv
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  if (process.env.NODE_ENV !== 'production') {
    return [...new Set([...configured, 'http://localhost:3000', 'http://127.0.0.1:3000'])];
  }

  return [...new Set(configured)];
}

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowed = allowedOrigins.includes(normalizedOrigin);

    if (allowed) {
      callback(null, true);
      return;
    }

    callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const authLimiterMessage = {
  message: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.',
};

// El backend nunca recibe tráfico directo del navegador: las peticiones llegan
// desde los route handlers de Next, que reenvían la IP real del cliente en
// X-Forwarded-For (ver apps/proyecto-siga-frontend/src/libs/server/clientIp.ts).
// Aun así, la IP NO sirve como única clave de limitación: dentro del campus
// todos los usuarios comparten la IP pública de salida, así que limitar por IP
// castigaría a toda la institución por los intentos de una sola persona.
// Por eso la clave principal es la identidad (el email del cuerpo de la
// petición) y la IP queda como limitador secundario, con umbrales holgados.
function ipKey(req: Request): string {
  const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  return `ip:${ipKeyGenerator(ip)}`;
}

function emailKey(req: Request): string | null {
  const email = (req.body as { email?: unknown } | undefined)?.email;

  if (typeof email !== 'string') return null;

  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 ? `email:${normalized}` : null;
}

// Si no hay email en el cuerpo (petición malformada) cae a la IP para no
// dejar la ruta sin ninguna protección.
function emailOrIpKey(req: Request): string {
  return emailKey(req) ?? ipKey(req);
}

// Se exportan solo para las pruebas: son la pieza que evita que los
// limitadores vuelvan a ser globales.
export const rateLimitKeys = {
  ip: ipKey,
  emailOrIp: emailOrIpKey,
};

// Los logins correctos no consumen cuota: así una jornada de uso normal nunca
// alcanza el límite, que queda reservado para intentos fallidos repetidos.
export const loginRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  keyGenerator: emailOrIpKey,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

export const registerRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 5,
  keyGenerator: emailOrIpKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

export const resendVerificationRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 4,
  keyGenerator: emailOrIpKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

// Limitador secundario por IP para las rutas de autenticación y registro.
// El umbral es alto a propósito: debe frenar un ataque automatizado desde un
// host sin bloquear a un grupo de usuarios detrás de la misma NAT.
export const authIpRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 300,
  keyGenerator: ipKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

const publicReadLimiterMessage = {
  message: 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.',
};

// Limitador suave para rutas públicas de lectura (sin auth), p. ej. GET /public/tests.
export const publicReadRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 600,
  keyGenerator: ipKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: publicReadLimiterMessage,
});

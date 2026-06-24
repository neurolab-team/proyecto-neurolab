import  { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

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

export const loginRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

export const registerRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: authLimiterMessage,
});

export const resendVerificationRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 4,
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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: publicReadLimiterMessage,
});

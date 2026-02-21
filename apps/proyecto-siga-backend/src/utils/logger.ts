import pino from 'pino';

const SECRET_KEYS = new Set([
  'password', 'passwordHash', 'accessToken', 'refreshToken',
  'authorization', 'cookie', 'cookies', 'set-cookie'
])

function redactValue(value: unknown): unknown {
  if (value == null) return value
  if (typeof value === 'string') {
    return value
      .replace(/(Authorization:\s*Bearer\s+)[^\s]+/ig, '$1<redacted>')
      .replace(/(accessToken|refreshToken)\s*[:=]\s*["']?[^"'\s]+/ig, '$1=<redacted>')
  }
  if (typeof value !== 'object') return value

  if (Array.isArray(value)) return value.map(redactValue)

  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    result[key] = SECRET_KEYS.has(key.toLowerCase()) ? '<redacted>' : redactValue(val)
  }
  return result
}

// Configuración de Pino
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  
  // Configuración de transporte para desarrollo (pino-pretty)
  transport: process.env.NODE_ENV === 'production' 
    ? undefined 
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        }
      },
  
  // Redactar valores sensibles (rutas anidadas con *)
  redact: {
    paths: [
      'password', 
      'passwordHash', 
      'accessToken', 
      'refreshToken', 
      'authorization', 
      'cookie', 
      'cookies', 
      'set-cookie',
      // Redactar en cualquier nivel de anidación
      '*.password',
      '*.passwordHash',
      '*.accessToken',
      '*.refreshToken',
      '*.authorization',
      'req.headers.authorization',
      'request.headers.authorization',
      'headers.authorization',
      'data.password',
      'data.accessToken',
      'data.refreshToken',
      'data.passwordHash'
    ],
    censor: '<redacted>'
  },
  
  // Serializers personalizados
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: redactValue(req.headers),
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: redactValue(res.getHeaders?.() || {})
    }),
    err: pino.stdSerializers.err
  }
});

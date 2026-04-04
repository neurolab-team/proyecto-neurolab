import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
        target: 'pino/file',
        options: { destination: './logs/output.log', mkdir: true, colorize: false }
    },
    {
        target: 'pino-pretty',
        options: { destination: process.stdout.fd } 
    }
  ]
})
// Configuración de Pino
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  
  // Redactar valores sensibles (rutas anidadas con *)
  redact: {
    paths: [
      'password', 
    ],
    censor: '<redacted>'
  },
  
  // Serializers personalizados
  serializers: {
    email: (value: string) => maskEmail(value),
    user: (user: { id: string; username: string; email?: string; role: string; lastLogin: Date }) => ({
      id: user.id,
      username: user.username,
      email: user.email ? maskEmail(user.email) : undefined,
      role: user.role,
      lastLogin: user.lastLogin
    }),
  }
}, transport);

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}

import "reflect-metadata";
// Carga del .env de forma explícita y como primer efecto del arranque.
// Antes esto vivía escondido en utils/sendEmail.ts con { override: true }, así
// que dependía del orden del grafo de imports y podía pisar variables reales
// inyectadas por el contenedor. Sin override, el entorno del proceso gana.
import "dotenv/config";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { router } from './routes/routes';
import { errorHandler } from './shared/errorHandler';
import { corsOptions } from './security/httpSecurity';
import container from './container';
import { IEmailProvider } from './contracts/mail/IemailProvider';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

// Resolver el proveedor de correo en el arranque valida su configuración acá
// (credenciales faltantes, EMAIL_PROVIDER inválido) en lugar de fallar recién
// al primer envío. Para desarrollo sin SMTP: EMAIL_PROVIDER=console.
const emailProvider = container.resolve<IEmailProvider>('EmailProvider');
console.log(`[email] proveedor activo: ${emailProvider.name}`);

const app = express();
app.set('trust proxy', 1);

function loadSwaggerOutput() {
  // swagger-output.json es un artefacto generado (no versionado, ver .gitignore).
  // En un proyecto recién inicializado puede no existir todavía: si falta,
  // no debe tumbar el arranque del servidor, solo se omiten las docs.
  const filePath = process.cwd() + '/packages/docs/swagger-output.json';
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    console.warn('[swagger] swagger-output.json no encontrado; /api-docs deshabilitado.');
    return null;
  }
}

// Las docs se sirven solo si están habilitadas explícitamente.
// Por defecto se habilitan fuera de producción; en prod hay que activarlas
// a propósito con ENABLE_API_DOCS=true.
const apiDocsEnabled =
  process.env.ENABLE_API_DOCS === 'true' ||
  (process.env.ENABLE_API_DOCS !== 'false' &&
    process.env.NODE_ENV !== 'production');

const swaggerOutput = apiDocsEnabled ? loadSwaggerOutput() : null;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));

app.use('/api',router)
if (swaggerOutput) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
}
app.use(errorHandler);
app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});

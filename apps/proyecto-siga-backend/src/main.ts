import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { router } from './routes/routes';
import { errorHandler } from './shared/errorHandler';
import { corsOptions } from './security/httpSecurity';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

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

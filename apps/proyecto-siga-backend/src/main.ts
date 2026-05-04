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
  const filePath = process.cwd() + '/packages/docs/swagger-output.json'
  if (!filePath) return null;
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const swaggerOutput = loadSwaggerOutput();

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

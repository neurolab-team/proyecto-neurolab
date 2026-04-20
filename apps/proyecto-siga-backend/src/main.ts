import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { router } from './routes/routes';
import { errorHandler } from './shared/errorHandler';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

function loadSwaggerOutput() {
  const filePath = process.cwd() + '/packages/docs/swagger-output.json'
  if (!filePath) return null;
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const swaggerOutput = loadSwaggerOutput();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use('/api',router)
if (swaggerOutput) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
}
app.use(errorHandler);
app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});

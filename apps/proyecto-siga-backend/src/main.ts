import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../../../packages/docs/swagger-output.json';
import { router } from './routes/routes';
import { errorHandler } from './shared/errorHandler';
import { logger } from './utils/logger';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Middleware de logging con pino-http
app.use(pinoHttp({
  logger,
  
  // Niveles de log personalizados basados en el código de estado HTTP
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 300 && res.statusCode < 400) return 'silent';
    return 'info';
  },
  
  // Mensaje de éxito personalizado con timing
  customSuccessMessage: (req, res) => {
    const responseTime = (res as any).responseTime || 0;
    return `${req.method} ${req.url} completed in ${responseTime}ms`;
  },
  
  // Personalizar attributos del log
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'duration'
  }
}));

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use('/api',router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use(errorHandler);
app.listen(port, host, () => {
    logger.info(`Server ready at http://${host}:${port}`);
});

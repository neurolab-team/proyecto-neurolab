import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../../../packages/docs/swagger-output.json';
import { router } from './routes/routes';
import { errorHandler } from './shared/errorHandler';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use('/api',router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use(errorHandler);
app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
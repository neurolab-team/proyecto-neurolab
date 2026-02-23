import { logger } from 'apps/proyecto-siga-backend/src/utils/logger';
import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on('error', (err) => {
    logger.error('Redis Client Error', err);
});

async function connectRedis() {
    await redis.connect();
    logger.info('Conectado a Redis local exitosamente.');
}

connectRedis();

export default redis;
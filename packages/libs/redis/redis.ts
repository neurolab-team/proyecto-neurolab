import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    await redis.connect();
    console.log('Conectado a Redis local exitosamente.');
}

connectRedis();

export default redis;
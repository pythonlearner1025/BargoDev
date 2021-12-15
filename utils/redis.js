import Redis from 'ioredis'
import JSONCache from 'redis-json'

const rawRedis = new Redis(6379, "127.0.0.1");
const redis = new JSONCache(rawRedis);

export default redis
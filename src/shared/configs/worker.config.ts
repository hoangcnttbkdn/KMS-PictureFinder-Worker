import Queue, { QueueOptions } from 'bull'

const queueConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASS,
  },
}

const WORKER_NAME = process.env.WORKER_NAME

export const handleQueue = new Queue(WORKER_NAME, queueConfig)

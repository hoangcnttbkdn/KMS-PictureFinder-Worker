import Queue, { QueueOptions } from 'bull'

const queueConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASS,
  },
}

const handleWorkerName = process.env.HANDLE_WORKER_NAME
export const handleQueue = new Queue(handleWorkerName, queueConfig)

const cronWorkerName = process.env.CRON_WORKER_NAME
export const cronQueue = new Queue(cronWorkerName, queueConfig)

const mailWorkerName = process.env.MAIL_WORKER_NAME
export const mailQueue = new Queue(mailWorkerName, queueConfig)

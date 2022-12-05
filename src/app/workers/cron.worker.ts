import { Job, DoneCallback } from 'bull'

import { SessionRepository } from '../repositories'
import { cronQueue, handleQueue } from '../../shared/configs/worker.config'
import { WorkerData } from '../typings/worker.typing'
import { logger } from '../../shared/providers'

class CronWorker {
  private sessionRepository: SessionRepository

  constructor() {
    this.sessionRepository = new SessionRepository()
  }

  public async addJob() {
    if ((await cronQueue.getRepeatableCount()) === 0) {
      await cronQueue.add(
        {},
        { repeat: { every: 1000 * 60 * +(process.env.CRON_CYCLE || 1) } },
      )
    }
  }

  public async initialize() {
    await cronQueue.process(async (_job: Job, done: DoneCallback) => {
      try {
        console.log('checking...')
        const waitingCount = await handleQueue.getWaitingCount()
        const notFinishedsessions =
          await this.sessionRepository.getNotFinishedSessions()
        if (waitingCount === 0 && notFinishedsessions.length > 0) {
          for (const item of notFinishedsessions) {
            const arrayLink = item.images.map((image) => ({
              id: image.code,
              url: image.url,
            }))
            const data: WorkerData = {
              arrayLink,
              sessionId: item.id,
              targetImage: item.targetImageUrl,
              email: item.email,
            }
            handleQueue.add(data)
          }
        }
        done()
      } catch (error) {
        logger.error(JSON.stringify(error))
      }
    })
  }
}

export const cronWorker = new CronWorker()

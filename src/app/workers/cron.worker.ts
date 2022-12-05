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
    // { cron: '1 * * * *' }
    if ((await cronQueue.getRepeatableCount()) === 0) {
      await cronQueue.add({}, { repeat: { every: 300000 } })
    }
  }

  public async initialize() {
    console.log('init ne`')
    await cronQueue.process(async (_job: Job, done: DoneCallback) => {
      try {
        console.log('checking...')
        const waitingCount = await handleQueue.getWaitingCount()
        const notFinishedsessions =
          await this.sessionRepository.getNotFinishedSessions()
        console.log(waitingCount)
        console.log(notFinishedsessions.length)
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
            }
            handleQueue.add(data)
          }
        }
        done()
      } catch (error) {
        console.log('catch ne`')
        logger.error(JSON.stringify(error))
      }
    })
    console.log('done init ne`')
  }
}

export const cronWorker = new CronWorker()

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
        console.log('Cron job checking...')
        const waitingJobs = await handleQueue.getWaiting()
        const waitingJobNames = waitingJobs.map((job) => +job.name)
        const notFinishedSessions =
          await this.sessionRepository.getNotFinishedSessions(waitingJobNames)
        if (notFinishedSessions.length > 0) {
          for (const item of notFinishedSessions) {
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
            handleQueue.add(item.id.toString(), data)
          }
          console.log('Add job done.')
        }
        console.log('Cron job checking done!')
        done()
      } catch (error) {
        logger.error((error as any).message)
      }
    })
  }
}

export const cronWorker = new CronWorker()

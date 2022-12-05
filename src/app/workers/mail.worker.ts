import { Job, DoneCallback } from 'bull'

import { mailQueue } from '../../shared/configs/worker.config'
import { mailService } from '../../shared/configs/mail.config'
import { logger } from '../../shared/providers'

class MailWorker {
  public async initialize() {
    await mailQueue.process(async (job: Job, done: DoneCallback) => {
      try {
        const { email, sessionId } = job.data
        const msg = {
          to: email,
          from: process.env.MAIL_USER,
          subject: 'Your request session in Picture Finder is finished',
          text: `Your request session in Picture Finder is finished. You can check it in [...link here...] ${sessionId}.`,
        }
        await mailService.sendMail(msg)
        done()
      } catch (error) {
        logger.error(JSON.stringify(error))
      }
    })
  }
}

export const mailWorker = new MailWorker()

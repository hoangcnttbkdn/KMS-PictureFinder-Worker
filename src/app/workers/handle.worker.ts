import axios from 'axios'
import FormData from 'form-data'
import { Readable } from 'stream'
import { Job, DoneCallback } from 'bull'
import { plainToInstance } from 'class-transformer'

import { ImageRepository, SessionRepository } from '../repositories'
import { handleQueue } from '../../shared/configs/worker.config'
import { WorkerData } from '../typings/worker.typing'
import { environment } from '../../shared/constants'
import { sleep, fetchImageFromUrl } from '../utils'
import { logger } from '../../shared/providers'

class HandleWorker {
  private sessionRepository: SessionRepository
  private imageRepository: ImageRepository

  constructor() {
    this.sessionRepository = new SessionRepository()
    this.imageRepository = new ImageRepository()
  }

  public async initialize() {
    await handleQueue.process(async (job: Job, done: DoneCallback) => {
      try {
        const { arrayLink, sessionId, targetImage } = plainToInstance(
          WorkerData,
          job.data,
        )
        const targetImageBuffer = await fetchImageFromUrl(targetImage)
        const listFormData = []
        let totalBytes = environment.formSizeLimit
        let data = new FormData()
        for (let i = 0; i < arrayLink.length; i++) {
          const buffer64 = await fetchImageFromUrl(arrayLink[i].url)
          data.append(
            'list_images',
            Readable.from(buffer64),
            `${arrayLink[i].id}.png`,
          )
          if (totalBytes - buffer64.length >= 0 && i !== arrayLink.length - 1) {
            totalBytes -= buffer64.length
          } else {
            data.append(
              'target_image',
              Readable.from(targetImageBuffer),
              `target.png`,
            )
            listFormData.push(data)
            totalBytes = environment.formSizeLimit
            data = new FormData()
          }
          await sleep(200)
        }
        for (const form of listFormData) {
          const rs = await axios({
            url: `${process.env.AI_API_SERVER}/face-findor`,
            method: 'POST',
            data: form,
            headers: { ...data.getHeaders() },
          })
          Object.keys(rs.data).forEach(async (key: string) => {
            const value = rs.data[key]
            const code = key.split('.')[0]
            if (value['match_face']) {
              await this.imageRepository.updateImage(code, sessionId, {
                isMatched: true,
                recognizedAt: new Date(),
                extraData: JSON.stringify({
                  numberOfFace: value['num_of_face'],
                  faceLocation: value['face_location'],
                  confident: value['confident'],
                }),
              })
            } else {
              await this.imageRepository.updateImage(code, sessionId, {
                recognizedAt: new Date(),
                extraData: JSON.stringify({
                  numberOfFace: value['num_of_face'],
                  faceLocation: value['face_location'],
                  confident: value['confident'],
                }),
              })
            }
          })
        }
        await this.sessionRepository.updateStatus(sessionId)
        logger.log(`Session ID ${sessionId} has done!`)
        done()
      } catch (error) {
        logger.error(JSON.stringify(error))
      }
    })
  }
}

export const handleWorker = new HandleWorker()

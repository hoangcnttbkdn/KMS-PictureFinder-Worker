import axios from 'axios'
import FormData from 'form-data'
import { Readable } from 'stream'
import { Job, DoneCallback } from 'bull'
import { plainToInstance } from 'class-transformer'

import { ImageRepository, SessionRepository } from '../repositories'
import { handleQueue, mailQueue } from '../../shared/configs/worker.config'
import { WorkerData } from '../typings/worker.typing'
import { environment, TypeRecognizeEnum } from '../../shared/constants'
import { sleep, fetchImageFromUrl, fetchImageFromSource } from '../utils'
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
        const { arrayLink, sessionId, targetData, email, type, typeRecognize } =
          plainToInstance(WorkerData, job.data)
        const target =
          typeRecognize === TypeRecognizeEnum.BIB
            ? targetData
            : await fetchImageFromUrl(targetData)
        const listFormData = []
        let totalBytes = environment.formSizeLimit
        let data = new FormData()
        for (let i = 0; i < arrayLink.length; i++) {
          const buffer64 = await fetchImageFromSource(arrayLink[i], type)
          data.append(
            'list_images',
            Readable.from(buffer64),
            `${arrayLink[i].id}.png`,
          )
          if (totalBytes - buffer64.length >= 0 && i !== arrayLink.length - 1) {
            totalBytes -= buffer64.length
          } else {
            if (typeRecognize === TypeRecognizeEnum.BIB) {
              data.append('bib_code', target)
            } else {
              data.append('target_image', Readable.from(target), `target.png`)
            }
            listFormData.push(data)
            totalBytes = environment.formSizeLimit
            data = new FormData()
          }
          await sleep(200)
        }
        let path = 'face-findor'
        switch (typeRecognize) {
          case TypeRecognizeEnum.BIB:
            path = `ocr-v2`
            break
          case TypeRecognizeEnum.CLOTHES:
            path = 'clothes-findor'
            break
          default:
            break
        }
        for (const form of listFormData) {
          const rs = await axios({
            url: `${process.env.AI_API_SERVER}/${path}`,
            method: 'POST',
            data: form,
            headers: { ...data.getHeaders() },
          })
          switch (typeRecognize) {
            case TypeRecognizeEnum.FACE:
              await this.handleResultFace(rs.data, sessionId)
              break
            case TypeRecognizeEnum.BIB:
              await this.handleResultBib(rs.data, sessionId)
              break
            case TypeRecognizeEnum.CLOTHES:
              await this.handleResultClothes(rs.data, sessionId)
              break
            default:
              break
          }
        }
        await this.sessionRepository.updateStatus(sessionId)
        if (email) {
          await mailQueue.add({ email, sessionId })
        }
        logger.log(`[${process.pid}] Session ID ${sessionId} has done!`)
        done()
      } catch (error) {
        logger.error(JSON.stringify(error))
        done()
      }
    })
  }

  private async handleResultFace(data: any, sessionId: number) {
    Object.keys(data).forEach(async (key: string) => {
      const value = data[key]
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

  private async handleResultBib(data: any, sessionId: number) {
    Object.keys(data).forEach(async (key: string) => {
      const value = data[key]
      const code = key.split('.')[0]
      if (value['match_bib']) {
        await this.imageRepository.updateImage(code, sessionId, {
          isMatched: true,
          recognizedAt: new Date(),
          extraData: JSON.stringify({
            confident: value['confident'],
          }),
        })
      } else {
        await this.imageRepository.updateImage(code, sessionId, {
          recognizedAt: new Date(),
          extraData: JSON.stringify({
            confident: value['confident'],
          }),
        })
      }
    })
  }

  private async handleResultClothes(data: any, sessionId: number) {
    Object.keys(data).forEach(async (key: string) => {
      const value = data[key]
      const code = key.split('.')[0]
      if (value['match_clothes']) {
        await this.imageRepository.updateImage(code, sessionId, {
          isMatched: true,
          recognizedAt: new Date(),
          extraData: JSON.stringify({
            confident: value['confident'],
          }),
        })
      } else {
        await this.imageRepository.updateImage(code, sessionId, {
          recognizedAt: new Date(),
          extraData: JSON.stringify({
            confident: value['confident'],
          }),
        })
      }
    })
  }
}

export const handleWorker = new HandleWorker()

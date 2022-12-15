import { ImageUrl } from '.'
import { SessionTypeEnum, TypeRecognizeEnum } from '../../shared/constants'

export class WorkerData {
  arrayLink: Array<ImageUrl>
  sessionId: number
  targetData: string
  type: SessionTypeEnum
  typeRecognize: TypeRecognizeEnum
  email?: string
}

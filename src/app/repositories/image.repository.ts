import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Image } from '../entities'

export class ImageRepository extends Repository<Image> {
  constructor() {
    super(Image, dataSource.manager)
  }

  public getImagesBySessionId = (sessionId: number) => {
    return this.find({
      where: {
        session: { id: sessionId },
        isMatched: true,
      },
    })
  }

  public updateImage = (
    code: string,
    sessionId: number,
    data: {
      isMatched?: boolean
      recognizedAt?: Date
      extraData?: string
      errorLogs?: string
    },
  ) => {
    return this.createQueryBuilder()
      .update()
      .set({ ...data })
      .where('code = :code')
      .andWhere('session.id = :sessionId')
      .setParameters({ code, sessionId })
      .execute()
  }
}

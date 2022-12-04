import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Session } from '../entities'

export class SessionRepository extends Repository<Session> {
  constructor() {
    super(Session, dataSource.manager)
  }

  public getSessionById = (id: number) => {
    return this.findOne({ where: { id } })
  }

  public updateStatus = (id: number) => {
    return this.createQueryBuilder()
      .update()
      .set({ isFinished: true })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }
}

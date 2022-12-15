import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Session } from '../entities'

export class SessionRepository extends Repository<Session> {
  constructor() {
    super(Session, dataSource.manager)
  }

  public updateStatus = (id: number) => {
    return this.createQueryBuilder()
      .update()
      .set({ isFinished: true })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public getNotFinishedSessions = (waitingSessionNames: number[]) => {
    const query = this.createQueryBuilder('sessions')
      .leftJoinAndSelect(
        'sessions.images',
        'images',
        'images.session_id = sessions.id and images.recognizedAt isnull',
      )
      .select([
        'sessions.id',
        'sessions.targetImageUrl',
        'sessions.bib',
        'sessions.type',
        'sessions.typeRecognize',
        'sessions.email',
        'images.code',
        'images.url',
      ])
      .where('sessions.isFinished = false')
    if (waitingSessionNames.length > 0) {
      query
        .andWhere('sessions.id NOT IN (:...waitingSessionNames)')
        .setParameters({ waitingSessionNames })
    }
    return query.getMany()
  }
}

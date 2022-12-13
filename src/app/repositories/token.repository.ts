import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Token } from '../entities'

export class TokenRepository extends Repository<Token> {
  constructor() {
    super(Token, dataSource.manager)
  }
}

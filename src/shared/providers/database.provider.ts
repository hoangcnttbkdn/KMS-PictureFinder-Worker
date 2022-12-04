import dataSource from '../configs/data-source.config'

class DatabaseProvider {
  public async initialize() {
    await dataSource.initialize()
  }
}

export const databaseProvider = new DatabaseProvider()

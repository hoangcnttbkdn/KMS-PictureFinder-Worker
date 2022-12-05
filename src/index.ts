import 'dotenv/config'
import { databaseProvider, envLoadProvider } from './shared/providers'
import { handleWorker, cronWorker } from './app/workers'

envLoadProvider.validate()
databaseProvider.initialize()
handleWorker.initialize()
cronWorker.initialize()
cronWorker.addJob()

import 'dotenv/config'
import { databaseProvider, envLoadProvider } from './shared/providers'
import { handleWorker } from './app/workers'

envLoadProvider.validate()
databaseProvider.initialize()
handleWorker.initialize()

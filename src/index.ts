import 'dotenv/config'
import cluster from 'node:cluster'
import { databaseProvider, envLoadProvider } from './shared/providers'
import { handleWorker, cronWorker, mailWorker } from './app/workers'

const initCron = async () => {
  envLoadProvider.validate()
  await databaseProvider.initialize()
  cronWorker.initialize()
  cronWorker.addJob()
}

if (cluster.isPrimary) {
  for (let i = 0; i < +(process.env.PROCESS_NUM || 2); i++) {
    cluster.fork()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cluster.on('exit', (_worker, _code, _signal) => {
    cluster.fork()
  })
} else {
  envLoadProvider.validate()
  databaseProvider.initialize()
  mailWorker.initialize()
  handleWorker.initialize()
}

if (cluster.isPrimary) {
  initCron()
}

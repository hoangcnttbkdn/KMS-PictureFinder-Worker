import { ConsoleTransportOptions } from 'winston/lib/winston/transports'
import { createLogger, format, Logger, transports } from 'winston'
import { environment } from '../constants'

class LoggerProvider {
  private location: string
  private logger: Logger

  public setLocation(locationName: string) {
    this.location = locationName
  }

  constructor() {
    const transportOptions: ConsoleTransportOptions = {}

    if (environment.env === 'local') {
      transportOptions.format = format.combine(format.prettyPrint())
    }

    this.logger = createLogger({
      transports: [new transports.Console(transportOptions)],
    })
  }

  error(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString()

    return this.logger.error({
      message,
      location: this.location,
      timestamp,
      meta,
    })
  }

  warn(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString()

    return this.logger.warn({
      message,
      location: this.location,
      timestamp,
      meta,
    })
  }

  debug(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString()

    return this.logger.debug({
      message,
      location: this.location,
      timestamp,
      meta,
    })
  }

  verbose(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString()

    return this.logger.verbose({
      message,
      location: this.location,
      timestamp,
      meta,
    })
  }

  log(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString()

    return this.logger.info({
      message,
      location: this.location,
      timestamp,
      meta,
    })
  }
}

export const logger = new LoggerProvider()

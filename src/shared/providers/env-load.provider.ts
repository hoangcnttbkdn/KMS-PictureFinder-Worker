import Joi from 'joi'
import { envSchema } from '../configs/environment.config'
import { logger } from './logger.provider'

class EnvLoadProvider {
  public validate() {
    const envVarsSchema = Joi.object(envSchema)

    const { error } = envVarsSchema.validate(process.env, {
      allowUnknown: true,
    })

    if (error) {
      logger.error(JSON.stringify(error))
    }
    logger.log(`Env load of ${process.pid} done!`)
  }
}

export const envLoadProvider = new EnvLoadProvider()

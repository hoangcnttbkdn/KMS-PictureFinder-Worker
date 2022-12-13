import Joi from 'joi'

export const envSchema = {
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production', 'staging')
    .default('development'),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_HOST: Joi.string().required(),
}

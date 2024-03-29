export const environment = {
  env: process.env.NODE_ENV,
  database: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  },
  formSizeLimit: +(process.env.FORM_SIZE_LIMIT || 2) * 1024 * 1024,
}

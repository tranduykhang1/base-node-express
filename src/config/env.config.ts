export const EnvConfig = Object.freeze({
  port: process.env.PORT!,
  apiHost: process.env.API_HOST || 'http://localhost:3030',
  mongoUri: process.env.MONGO_URI!,
  logLevel: process.env.LOG_LEVEL!,
  vectorStoreDir: process.env.VECTOR_DB_DIR!,
  fileDir: process.env.FILE_DIR!,
  openApiKey: process.env.OPEN_API_KEY!,
  googleApiKey: process.env.GOOGLE_API_KEY!
})

export const EnvConfig = Object.freeze({
  port: process.env.PORT!,
  mongoUri: process.env.MONGO_URI!,
  logLevel: process.env.LOG_LEVEL!
})

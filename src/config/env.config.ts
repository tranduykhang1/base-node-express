interface EnvConfigInterface {
  nodeEnv?: string
  port?: string
  apiHost?: string
  mongoUri?: string
  logLevel?: string
  pwSecret?: string
  redisUri?: string
  redisPort?: string
  redisHost?: string
  redisPass?: string
  isTestEnv?: string
  redisDB?: string,
  atExp?: string
  rtExp?: string
  atSecret?: string
  rtSecret?: string
}

class EnvConfig {
  private config: EnvConfigInterface = {}

  constructor() {
    this.init()
    console.log(this.config)
  }

  init() {
    this.config.nodeEnv = process.env.NODE_ENV
    this.config.port = process.env.PORT
    this.config.apiHost = process.env.API_HOST || 'http://localhost:3030'
    this.config.mongoUri = process.env.MONGO_URI
    this.config.logLevel = process.env.LOG_LEVEL
    this.config.pwSecret = process.env.PW_SECRET
    this.config.redisUri = process.env.REDIS_URI
    this.config.redisPort = process.env.REDIS_PORT
    this.config.redisHost = process.env.REDIS_HOST
    this.config.redisPass = process.env.REDIS_PASSWORD
    this.config.isTestEnv = process.env.NODE_ENV?.includes('test').toString()
    this.config.redisDB = process.env.REDIS_DB,
    this.config.atExp = process.env.AT_EXPIRE,
    this.config.rtExp = process.env.RT_EXPIRE,
    this.config.atSecret = process.env.JWT_SECRET,
    this.config.rtSecret = process.env.JWT_REFRESH_SECRET
  }

  get(key: keyof EnvConfigInterface): string {
    return this.config[key]!
  }
}

const envConfig = new EnvConfig()

export default envConfig

interface EnvConfigInterface {
  port?: string
  apiHost?: string
  mongoUri?: string
  logLevel?: string
  vectorStoreDir?: string
  fileDir?: string
  openApiKey?: string
  googleApiKey?: string
  elsUri?: string
  contractAddress?: string
  accountSecret?: string
  pwSecret?: string
}

class EnvConfig {
  private config: EnvConfigInterface = {}

  constructor() {
    this.init()
    console.log(this.config)
  }

  init() {
    this.config.port = process.env.PORT
    this.config.apiHost = process.env.API_HOST || 'http://localhost:3030'
    this.config.mongoUri = process.env.MONGO_URI
    this.config.logLevel = process.env.LOG_LEVEL
    this.config.pwSecret = process.env.PW_SECRET
  }

  get(key: keyof EnvConfigInterface): string {
    return this.config[key]!
  }
}

const envConfig = new EnvConfig()

export default envConfig

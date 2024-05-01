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
}

class EnvConfig {
  private config: EnvConfigInterface = {}

  constructor() {
    this.init()
  }

  init() {
    this.config.port = process.env.PORT
    this.config.apiHost = process.env.API_HOST || 'http://localhost:3030'
    this.config.mongoUri = process.env.MONGO_URI
    this.config.logLevel = process.env.LOG_LEVEL
    this.config.vectorStoreDir = process.env.VECTOR_DB_DIR
    this.config.fileDir = process.env.FILE_DIR
    this.config.openApiKey = process.env.OPEN_API_KEY
    this.config.googleApiKey = process.env.GOOGLE_API_KEY
    this.config.elsUri = process.env.ELASTICSEARCH_URL!
  }

  get(key: keyof EnvConfigInterface): string {
    return this.config[key]!
  }
}

const envConfig = new EnvConfig()

export default envConfig

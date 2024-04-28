interface ServerConfig {
  name: string
  isSandbox: boolean
  cors: {
    credentials: boolean
    methods: string[]
    origin: string[]
  }
  urls: {
    default: string // "/" will be redirected to this path
    static: string[]
    routers: { csrf: boolean; path: string; file: string }[]
  }
}

interface Config {
  timezone: string
  tempFolder: string
  server: ServerConfig
}

const ServerConfig: Config = Object.freeze({
  timezone: '+08:00',
  tempFolder: 'tmp',
  server: {
    name: 'interview',
    isSandbox: true,

    cors: {
      // https://github.com/expressjs/cors#configuration-options
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: []
    },
    urls: {
      default: '/',
      static: [],
      routers: [{ csrf: false, path: '/', file: '../app/router/default' }]
    }
  }
})

export default ServerConfig

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

export const ServerConfig: ServerConfig = Object.freeze({
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
    routers: [{ csrf: false, path: '/api/v1/auth', file: '../app/core/routers/auth.router' }]
  }
})

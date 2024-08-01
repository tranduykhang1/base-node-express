export class ServerConfig {
  public isConfigured = false
  public name: string
  public isSandbox: boolean
  public cors: {
    credentials: boolean
    methods: string[]
    origin: string
  }
  public urls: {
    default: string // "/" will be redirected to this path
    static: string[]
    routers: { csrf: boolean; path: string; file: string; version: number }[]
  }

  constructor() {
    this.isConfigured = true
    this.name = 'CHANGE_ME'
    this.isSandbox = true
    this.cors = {
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*'
    }
    this.urls = {
      default: '/',
      static: [],
      routers: [
        { csrf: false, path: '/api/v1/auth', file: '../app/core/routers/auth.router', version: 1 },
        { csrf: false, path: '/api/v1/users', file: '../app/core/routers/user.router', version: 1 }
      ]
    }
    Object.freeze(this)
  }
}

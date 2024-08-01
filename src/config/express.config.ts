import { json } from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import httpContext from 'express-http-context2'
import helmet from 'helmet'
import morgan from 'morgan'
import { firebaseLib } from '../app/core/services/firebase-lib.service'
import { redisServices } from '../app/core/services/redis.service'
import { mongoSetup } from '../app/db/mongo.db'
import { setupMiddlewareRouters } from './global.config'
import { ServerConfig } from './server.config'
import swaggerConfig from './swagger.config'

export class ExpressConfig {
  public app: Application
  #serverConfig: ServerConfig

  constructor() {
    this.app = express()
    this.#serverConfig = new ServerConfig()
    this.configure()
  }

  private configure() {
    if (this.#serverConfig.isConfigured) {
      this.app.use(express.urlencoded({ extended: true }))
      this.app.use(json())

      this.app.use(helmet())
      this.app.use(morgan('dev'))

      this.app.use(httpContext.middleware)

      this.app.use(cors(this.#serverConfig.cors))
      this.app.set('trust proxy', true)

      mongoSetup.connect()
      redisServices.connect()
      firebaseLib.connect()

      swaggerConfig(this.app)

      const routers = this.#serverConfig.urls.routers

      setupMiddlewareRouters(this.app, routers)
    }
  }
}

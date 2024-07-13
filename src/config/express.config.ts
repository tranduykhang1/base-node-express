import { json } from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import httpContext from 'express-http-context2'
import helmet from 'helmet'
import morgan from 'morgan'
import { mongoSetup } from '../app/db/mongo.db'
import { setupMiddlewareRouters } from './global.config'
import { ServerConfig } from './server.config'
import swaggerConfig from './swagger.config'
import { redisServices } from '../app/core/services/redis.service'

export const ExpressConfig = (): Application => {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(json())

  app.use(helmet())
  app.use(morgan('dev'))

  app.use(httpContext.middleware)

  app.use(cors(ServerConfig.cors))
  app.set('trust proxy', true)

  mongoSetup.connect()
  redisServices.connect()

  swaggerConfig(app)

  const routers = ServerConfig.urls.routers

  setupMiddlewareRouters(app, routers)

  return app
}

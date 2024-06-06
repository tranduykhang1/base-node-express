import { json } from 'body-parser'
import express, { Application } from 'express'
import httpContext from 'express-http-context2'
import helmet from 'helmet'
import morgan from 'morgan'
import { serviceContainers } from '../app/containers/service.container'
import { mongoSetup } from '../app/db/mongo.db'
import { setupMiddlewareRouters } from './global.config'
import { ServerConfig } from './server.config'
import swaggerConfig from './swagger.config'
import cors from 'cors'

export const ExpressConfig = (): Application => {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(json())

  app.use(helmet())
  app.use(morgan('dev'))

  app.use(httpContext.middleware)

  app.use(cors())
  app.set('trust proxy', true)

  swaggerConfig(app)

  const routers = ServerConfig.urls.routers

  setupMiddlewareRouters(app, routers)

  mongoSetup.connect()
  serviceContainers.redisServices.connect()

  return app
}

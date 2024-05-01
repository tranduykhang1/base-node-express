import { json } from 'body-parser'
import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { MongoSetup } from '../app/db/mongo.db'
import { setupMiddlewareRouters } from './global.config'
import ServerConfig from './server.config'
import swaggerConfig from './swagger.config'

const ExpressConfig = (): Application => {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(json())

  app.use(helmet())
  app.use(morgan('dev'))
  app.set('trust proxy', true)

  swaggerConfig(app)

  const routers = ServerConfig.server.urls.routers

  setupMiddlewareRouters(app, routers)

  new MongoSetup().connect()

  return app
}

export default ExpressConfig

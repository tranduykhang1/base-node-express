import { Application, NextFunction, Request, Response } from 'express'
import { AppLogger } from './log.config'
import { BaseHttpError } from '../common/errors/base.error'

const log = new AppLogger('App')

const setupProcessHandlers = (): void => {
  process.on('exit', () => log.info('=== Fatal Error: Application Closed ==='))

  process.on('uncaughtException', (err: Error) => log.error(`Unhandled Exception at::: ${err}`))
  process.on('unhandledRejection', (reason: unknown) => {
    if (!(reason instanceof Error) || reason.name !== 'FeatureNotEnabled') {
      log.error(`Unhandled Rejection at::: ${reason}`)
    }
  })
}

interface Route {
  file: string
  path: string
}

/* eslint-disable */
const setupMiddlewareRouters = (app: Application, routes: Route[] | undefined): void => {
  if (routes) {
    routes
      .filter((route) => route.file && route.path)
      .forEach((route) => {
        const routeModule = require(route.file)
        app.use(route.path, routeModule.router)
        log.info(`${route.file} will be public access via ${route.path}`)
        app.use(route.path, errorHandlerMiddleware)
      })
  }
}

const errorHandlerMiddleware = (err: BaseHttpError, _: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    trace: err?.data || err?.message || {}
  })
  next()
}

export { setupMiddlewareRouters, setupProcessHandlers, errorHandlerMiddleware }

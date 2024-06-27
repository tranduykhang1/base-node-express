import { Application, NextFunction, Request, Response } from 'express'
import { BaseHttpError } from '../common/errors/base.error'
import { AppLogger } from './log.config'
import envConfig from './env.config'

const log = new AppLogger('Global Configuration')

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
  version: number
}

/* eslint-disable */
const setupMiddlewareRouters = (app: Application, routes: Route[] | undefined): void => {
  if (routes) {
    routes
      .filter((route) => route.file && route.path)
      .forEach((route) => {
        const routeModule = require(route.file)
        app.use(route.path, routeModule.router)
        log.info(`ROUTE:::V${route.version}:::${route.file} will be public access via ${route.path}`)
        app.use(route.path, errorHandlerMiddleware)
      })
  }
}

const errorHandlerMiddleware = (err: BaseHttpError, _: Request, res: Response, next: NextFunction) => {
  log.error(`Error occurred at::: ${err.message}, stack: ${err.stack}`)
  if (envConfig.get('nodeEnv') === 'dev') {
    res.status(err.statusCode ?? 500).send({
      message: err.message,
      trace: err?.data ?? err?.message ?? {},
      stack: err.stack
    })
    return next()
  }
  res.status(err.statusCode ?? 500).send({
    message: err.message
  })
  return next()
}

export { errorHandlerMiddleware, setupMiddlewareRouters, setupProcessHandlers }

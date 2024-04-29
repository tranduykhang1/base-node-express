import { Application, NextFunction, Request, Response } from 'express'
import { AppLogger } from './log.config'

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
        app.use(route.path, genericSuccessMiddleware)
      })
  }
}

const setupApiHandler = (app: Application): void => {
  app.use(genericErrorMiddleware)
}

const genericSuccessMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!('status' in req) && !('answer' in req)) {
    res.sendStatus(404)
  } else {
    const statusCode = req.statusCode ?? 200
    const response = res.json || {}
    res.status(statusCode).json(response)
  }
  next()
}

const genericErrorMiddleware = (err: any, res: Response, next: NextFunction): void => {
  const httpStatus = err || 200
  res.status(httpStatus).json(res.json)
  next()
}

export {
  genericErrorMiddleware,
  genericSuccessMiddleware,
  setupApiHandler,
  setupMiddlewareRouters,
  setupProcessHandlers
}

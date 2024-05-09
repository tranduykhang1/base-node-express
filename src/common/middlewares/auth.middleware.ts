import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { serviceContainers } from '../../app/containers/service.container'
import { BaseHttpError } from '../errors/base.error'

class AuthMiddleware {
  isAuth(req: Request, _: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new BaseHttpError(StatusCodes.BAD_REQUEST, 'no token provide!')
    }

    try {
      const isVerified = serviceContainers.authServices.verifyToken(token)
      console.log(isVerified)

      if (isVerified) return next()

      throw new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!')
    } catch (error) {
      throw new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!')
    }
  }
}

export const authMiddleware = new AuthMiddleware()
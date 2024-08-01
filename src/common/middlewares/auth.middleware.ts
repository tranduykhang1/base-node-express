import { NextFunction, Request, Response } from 'express'
import httpContext from 'express-http-context2'
import { StatusCodes } from 'http-status-codes'
import { RefreshTokenDto } from '../../app/core/dto/auth.dto'
import { User } from '../../app/core/entities/user.entity'
import { authServices } from '../../app/core/services/auth.service'
import { redisServices } from '../../app/core/services/redis.service'
import envConfig from '../../config/env.config'
import { BaseHttpError } from '../base/base.error'
import { REDIS_KEY } from '../enums/redis.enum'
import { USER_ROLE } from '../enums/user.enum'
import { BaseValidator } from '../errors/validator.error'
import { LoginResponse } from '../responses/auth.response'

class AuthMiddleware {
  async isAuth(req: Request, _: Response, next: NextFunction): Promise<void> {
    const providedToken = req.headers.authorization?.split(' ')[1]

    if (!providedToken) {
      return next(new BaseHttpError(StatusCodes.BAD_REQUEST, 'no token provided!'))
    }

    try {
      const decodedUser = authServices.verifyToken(providedToken) as Partial<User>

      if (decodedUser) {
        const tokens = await redisServices.get<LoginResponse>(REDIS_KEY.auth + decodedUser._id!)

        if (tokens?.ip !== req?.ip) {
          return next(new BaseHttpError(StatusCodes.CONFLICT, 'login on another device!'))
        }

        if (tokens && tokens.at === providedToken) {
          httpContext.set('user', decodedUser)

          return next()
        }
        return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!'))
      }
      return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'session expired!'))
    } catch (error) {
      return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!'))
    }
  }

  async isAdmin(req: Request, _: Response, next: NextFunction): Promise<void> {
    const providedToken = req.headers.authorization?.split(' ')[1]
    if (!providedToken) {
      return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!'))
    }

    const decodedUser = authServices.verifyToken(providedToken) as Partial<User>

    if (decodedUser?.role !== USER_ROLE.admin) {
      return next(new BaseHttpError(StatusCodes.FORBIDDEN, 'forbidden_resource!'))
    }
    return next()
  }

  async refreshToken(req: Request, _: Response, next: NextFunction): Promise<void> {
    await new BaseValidator<RefreshTokenDto>().validate(req.body, RefreshTokenDto, next)

    const providedToken = req.body?.token

    if (!providedToken) {
      return next(new BaseHttpError(StatusCodes.BAD_REQUEST, 'no refresh token provided!'))
    }

    try {
      const decodedUser = authServices.verifyToken(providedToken, envConfig.get('rtSecret')) as Partial<User>

      if (decodedUser) {
        const tokens = await redisServices.get<LoginResponse>(REDIS_KEY.auth + decodedUser._id!)

        if (tokens && tokens.rt === providedToken) {
          req.body._id = decodedUser._id
          return next()
        }
      }
      return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!'))
    } catch (error) {
      return next(new BaseHttpError(StatusCodes.UNAUTHORIZED, 'unauthorized!'))
    }
  }
}

export const authMiddleware = new AuthMiddleware()

import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import BaseController from '../../../common/base/controller.response'
import { BaseHttpError } from '../../../common/errors/base.error'
import { getAuthenticatedUser } from '../../../common/requests/auth.requests'
import { AppLogger } from '../../../config/log.config'
import { serviceContainers } from '../../containers/service.container'

export class UserControllers extends BaseController {
  appLogger = new AppLogger(UserControllers.name)
  constructor() {
    super()
  }

  async getCurrentUser(_: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthenticatedUser()

      if (!user) return next(new BaseHttpError(StatusCodes.NOT_FOUND, 'user not found!'))

      return super.send(res, {
        data: user,
        message: 'success'
      })
    } catch (err) {
      return next(err)
    }
  }

  async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviceContainers.userServices.findAndCount(
        {},
        {
          limit: 10,
          offset: 0
        }
      )

      return super.send(res, {
        data,
        message: 'success'
      })
    } catch (err) {
      return next(err)
    }
  }
}

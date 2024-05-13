import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import BaseController from '../../../common/base/controller.response'
import { BaseHttpError } from '../../../common/errors/base.error'
import { getAuthenticatedUser } from '../../../common/requests/auth.requests'

export class UserControllers extends BaseController {
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
}

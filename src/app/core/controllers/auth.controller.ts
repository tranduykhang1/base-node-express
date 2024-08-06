import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseController } from '../../../common/base/controller.base'
import { BaseValidator } from '../../../common/errors/validator.error'
import { classUtil } from '../../../utils/class.util'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { authServices } from '../services/auth.service'
import { userServices } from '../services/user.service'

class AuthControllers extends BaseController {
  constructor() {
    super()
    classUtil.autoBind(this)
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await new BaseValidator<RegisterDto>().validate(req.body, RegisterDto, next)

      const data = await authServices.register(req.body)

      return this.send(
        res,
        {
          data,
          message: 'success'
        },
        StatusCodes.CREATED
      )
    } catch (err) {
      return next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      await new BaseValidator<LoginDto>().validate(req.body, LoginDto, next)

      const data = await authServices.login(req.body, req.ip)

      return this.send(res, {
        data,
        message: 'success'
      })
    } catch (err) {
      return next(err)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body._id

      const user = await userServices.findOne({ _id: userId })

      if (user) {
        const data = await authServices.refreshToken(user)

        return this.send(res, {
          data,
          message: 'success'
        })
      }
    } catch (err) {
      return next(err)
    }
  }
}

export const authControllers = new AuthControllers()

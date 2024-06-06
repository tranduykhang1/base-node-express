import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import BaseController from '../../../common/base/controller.response'
import { BaseValidator } from '../../../common/errors/validator.error'
import { serviceContainers } from '../../containers/service.container'
import { LoginDto, RegisterDto } from '../dto/auth.dto'

export class AuthControllers extends BaseController {
  constructor() {
    super()
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      await new BaseValidator<RegisterDto>().validate(req.body, RegisterDto, next)

      const data = await serviceContainers.authServices.register(req.body)

      return super.send(
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

      const data = await serviceContainers.authServices.login(req.body)

      return super.send(res, {
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

      const user = await serviceContainers.userServices.findOne({ _id: userId })

      if (user) {
        const data = await serviceContainers.authServices.refreshToken(user)

        return super.send(res, {
          data,
          message: 'success'
        })
      }
    } catch (err) {
      return next(err)
    }
  }
}

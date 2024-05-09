import { NextFunction, Request, Response } from 'express'
import { BaseValidator } from '../../../common/errors/validator.error'
import HttpResponseController from '../../../common/responses/http.response'
import { serviceContainers } from '../../containers/service.container'
import { LoginDto, RegisterDto } from '../dto/auth.dto'

export class AuthControllers extends HttpResponseController {
  constructor() {
    super()
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await new BaseValidator<RegisterDto>().validate(req.body, RegisterDto, next)

      const data = await serviceContainers.authServices.register(req.body)

      return super.send(res, {
        data,
        message: 'success'
      })
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
}

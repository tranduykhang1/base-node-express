import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseHttpError } from '../../common/error/base.error'
import HttpResponseController from '../../common/response/http.response'
import { DefaultService } from '../core/service/default.service'

export class DefaultController extends HttpResponseController {
  //   private readonly defaultService: DefaultService

  constructor(defaultService: DefaultService) {
    console.log(defaultService)
    //     this.defaultService = defaultService
    super()
  }
  async genAnswerFromPdf(req: Request<{ question: string }>, res: Response, next: NextFunction) {
    try {
      const service = new DefaultService()
      const answer = await service.genAnswer(req.body.question)
      res.locals.data = answer
      super.send(res)
    } catch (err) {
      return next(new BaseHttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong!', err))
    }
  }
}

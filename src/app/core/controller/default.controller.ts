import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseHttpError } from '../../../common/error/base.error'
import { BaseValidator } from '../../../common/error/validator.error'
import HttpResponseController from '../../../common/response/http.response'
import { GenerateAnswerDto } from '../dto/default.dto'
import { serviceContainer } from '../../container/service.container'

export class DefaultController extends HttpResponseController {
  constructor() {
    super()
  }
  async genAnswerFromPdf(req: Request<{ question: string }>, res: Response, next: NextFunction) {
    try {
      const dto: GenerateAnswerDto = new GenerateAnswerDto()

      dto.question = req.body.question

      await new BaseValidator<GenerateAnswerDto>().validate(dto, next)

      const answer = await serviceContainer.defaultService.genAnswer(req.body.question)

      super.send(res, {
        data: answer,
        message: 'Generated'
      })
    } catch (err: unknown) {
      return next(new BaseHttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong!', err))
    }
  }

  async createHash(req: Request<{ doc_name: string }>, res: Response, next: NextFunction) {
    try {
      await serviceContainer.defaultService.createHash(req.body.doc_name)
      super.send(res, {
        data: null,
        message: 'Successfully'
      })
    } catch (err) {
      return next(new BaseHttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong!', err))
    }
  }
}

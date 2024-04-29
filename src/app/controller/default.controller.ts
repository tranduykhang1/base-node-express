import { Request, Response } from 'express'
import { DefaultService } from '../core/service/default'

export class DefaultController {
  //   private readonly defaultService: DefaultService

  constructor(defaultService: DefaultService) {
    console.log(defaultService)
    //     this.defaultService = defaultService
  }
  async genAnswerFromPdf(req: Request<{ question: string }>, res: Response) {
    const service = new DefaultService()
    const answer = await service.genAnswer(req.body.question)
    res.status(200).json(answer)
  }
}

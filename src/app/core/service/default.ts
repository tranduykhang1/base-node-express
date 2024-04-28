import { NextFunction, Request, Response } from 'express'

export class DefaultService {
  hello = async (_: Request, res: Response, next: NextFunction) => {
    try {
      next(res.status(200).json('HELLO'))
    } catch (err) {
      next(err)
    }
  }
}

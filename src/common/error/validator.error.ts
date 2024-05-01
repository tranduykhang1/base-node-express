import { validate } from 'class-validator'
import { NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseHttpError } from './base.error'

export class BaseValidator<T extends object> {
  async validate(dto: T, next: NextFunction): Promise<BaseHttpError | unknown> {
    const errors = await validate(dto)
    if (errors.length) {
      return next(new BaseHttpError(StatusCodes.BAD_REQUEST, 'Validate failed!', errors))
    }
    return
  }
}

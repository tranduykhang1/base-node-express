/* eslint-disable  @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseHttpError } from './base.error'

export class BaseValidator<T extends object> {
  async validate(dto: T, dtoClass: new () => T, next: NextFunction): Promise<BaseHttpError | unknown> {
    const instance = new dtoClass()

    for (const prop of Object.keys(dto)) {
      ;(instance as any)[prop] = (dto as any)[prop]
    }

    const errors = await validate(instance)

    if (errors.length) {
      return next(new BaseHttpError(StatusCodes.BAD_REQUEST, 'Validate failed!', errors))
    }
    return
  }
}

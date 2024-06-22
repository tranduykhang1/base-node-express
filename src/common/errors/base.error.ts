import { StatusCodes } from 'http-status-codes'

export class BaseHttpError extends Error {
  public statusCode: number
  public data?: Record<string, unknown> | unknown

  constructor(statusCode: StatusCodes, message: string, data?: Record<string, unknown> | unknown) {
    super(message)
    this.name = BaseHttpError.name
    this.statusCode = statusCode
    this.data = data || {}

    Error.captureStackTrace(this, BaseHttpError)
  }
}

import { StatusCodes } from 'http-status-codes'

export class BaseHttpError extends Error {
  public statusCode: number
  public data?: Record<string, unknown> | unknown

  constructor(statusCode: StatusCodes, message: string, data?: Record<string, unknown> | unknown) {
    super(message)
    this.name = BaseHttpError.name
    this.statusCode = statusCode
    this.data = data || {}

    // Capture the stack trace, excluding the constructor call from the stack trace
    Error.captureStackTrace(this, BaseHttpError)
  }
}

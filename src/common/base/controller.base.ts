import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { HttpResponseData } from '../interfaces/response.interface'

/**
 * Base Controller
 */

export class BaseController {
  protected send<T = unknown>(res: Response, data: HttpResponseData<T>, statusCode: number = StatusCodes.OK) {
    return res.status(statusCode).json({
      message: data?.message || 'Success',
      data: data?.data || {}
    })
  }
}

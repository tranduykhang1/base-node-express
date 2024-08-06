import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { classUtil } from '../../utils/class.util'
import { HttpResponseData } from '../interfaces/response.interface'

/**
 * Base Controller
 */

export class BaseController {
  constructor() {
    classUtil.autoBind(this)
  }
  protected send<T = unknown>(res: Response, data: HttpResponseData<T>, statusCode: number = StatusCodes.OK) {
    return res.status(statusCode).json({
      message: data?.message || 'Success',
      data: data?.data || {}
    })
  }
}

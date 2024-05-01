import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { HttpResponseData } from '../interface/response.interface'

/**
 * Base Controller
 */

export default abstract class HttpResponseController {
  /**
   * Global method to send API response
   * @param res
   * @param statusCode
   */
  public send<T = unknown>(res: Response, data: HttpResponseData<T>, statusCode: number = StatusCodes.OK): void {
    res.status(statusCode).send({
      message: data?.message || 'Success',
      data: data?.data || {},
    })
  }
}

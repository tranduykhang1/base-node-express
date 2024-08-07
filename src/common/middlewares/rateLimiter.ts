import rateLimit from 'express-rate-limit'
import { StatusCodes } from 'http-status-codes'

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_, res) => {
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      status: StatusCodes.TOO_MANY_REQUESTS,
      message: 'Too many request from this IP, please try again later.'
    })
  }
})

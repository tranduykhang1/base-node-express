import express from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { authControllers } from '../controllers/auth.controller'

const router = express.Router()
/**
 * RegisterDTO
 * @typedef {object} RegisterDto
 * @property {string} email.required - The email, johndoe@demo.com
 * @property {string} password.required - The password, eg: 123123123
 * @property {string} firstName.required - The first name
 * @property {string} lastName.required - The last name
 */

/**
 * LoginDTO
 * @typedef {object} LoginDto
 * @property {string} email.required - The doc name
 * @property {string} password.required - The doc name
 */

/**
 * RefreshTokenDTO
 * @typedef {object} RefreshTokenDto
 * @property {string} token.required - The refresh token
 */

/**
 * POST /api/v1/auth/register
 * @summary Register new account
 * @tags AUTH
 * @param {RegisterDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/register', authControllers.register)

/**
 * POST /api/v1/auth/login
 * @summary Login with email/pw
 * @tags AUTH
 * @param {LoginDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/login', authControllers.login.bind(authControllers))

/**
 * POST /api/v1/auth/refresh-token
 * @summary Refresh new tokens
 * @tags AUTH
 * @param {RefreshTokenDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/refresh-token', authMiddleware.refreshToken, authControllers.refreshToken.bind(authControllers))

exports.router = router

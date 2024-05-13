import express from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { controllerContainers } from '../../containers/controller.container'

const router = express.Router()

/**
 * RegisterDTO
 * @typedef {object} RegisterDto
 * @property {string} email.required - The email
 * @property {string} password.required - The password
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
router.post('/register', controllerContainers.authControllers.register)

/**
 * POST /api/v1/auth/login
 * @summary Login with email/pw
 * @tags AUTH
 * @param {LoginDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/login', controllerContainers.authControllers.login)

/**
 * POST /api/v1/auth/refresh-token
 * @summary Refresh new tokens
 * @tags AUTH
 * @param {RefreshTokenDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/refresh-token', authMiddleware.refreshToken, controllerContainers.authControllers.refreshToken)

exports.router = router

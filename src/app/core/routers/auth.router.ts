import express from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { authControllers } from '../controllers/auth.controller'

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
 * @property {string} email.required - The user email
 * @property {string} password.required - The user password
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
 * @param {RegisterDto} request.body.required - Register DTO
 * @return {string} 200 - success response - application/json
 * @example request - default
 * {
 *   "email": "johndoe@admin.com",
 *   "password": "123123123",
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 */
router.post('/register', authControllers.register)

/**
 * POST /api/v1/auth/login
 * @summary Login with email/pw
 * @tags AUTH
 * @param {LoginDto} request.body.required - Login DTO
 * @return {object} 200 - success response - application/json
 * @example request - admin
 * {
 *   "email": "johndoe@admin.com",
 *   "password": "123123123"
 * }
 * @example request - user
 * {
 *   "email": "johndoe@gmail.com",
 *   "password": "123123123"
 * }
 */
router.post('/login', authControllers.login.bind(authControllers))

/**
 * POST /api/v1/auth/refresh-token
 * @summary Refresh new tokens
 * @tags AUTH
 * @param {RefreshTokenDto} request.body.required - Refresh Token DTO
 * @return {string} 200 - success response - application/json
 */
router.post('/refresh-token', authMiddleware.refreshToken, authControllers.refreshToken.bind(authControllers))

exports.router = router

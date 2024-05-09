import express from 'express'
import { controllerContainers } from '../../containers/controller.container'

const router = express.Router()

/**
 * A song
 * @typedef {object} RegisterDto
 * @property {string} email.required - The email
 * @property {string} password.required - The password
 * @property {string} firstName.required - The first name
 * @property {string} lastName.required - The last name
 */

/**
 * A song
 * @typedef {object} LoginDto
 * @property {string} email.required - The doc name
 * @property {string} password.required - The doc name
 */

/**
 * POST /api/v1/auth/register
 * @summary Register new account
 * @tags DEFAULT
 * @param {RegisterDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 * @security BearerAuth
 */
router.post('/register', controllerContainers.authControllers.register)

/**
 * POST /api/v1/auth/login
 * @summary Login with email/pw
 * @tags DEFAULT
 * @param {LoginDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/login', controllerContainers.authControllers.login)

exports.router = router

import express from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { userControllers } from '../controllers/user.controller'

const router = express.Router()

/**
 * GET /api/v1/users/me
 * @summary Get current user
 * @tags USER
 * @return {string} 200 - success response - application/json
 * @security BearerAuth
 */
router.get('/me', authMiddleware.isAuth, userControllers.getCurrentUser.bind(userControllers))

/**
 * GET /api/v1/users
 * @summary Get users
 * @tags USER
 * @return {string} 200 - success response - application/json
 * @security BearerAuth
 */
router.get('/', authMiddleware.isAuth, authMiddleware.isAdmin, userControllers.getAll.bind(userControllers))

exports.router = router

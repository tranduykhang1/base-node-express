import express from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.middleware'
import { controllerContainers } from '../../containers/controller.container'

const router = express.Router()

/**
 * GET /api/v1/users/me
 * @summary Get current user
 * @tags USER
 * @return {string} 200 - success response - application/json
 * @security BearerAuth
 */
router.get('/me', authMiddleware.isAuth, controllerContainers.userControllers.getCurrentUser)

exports.router = router

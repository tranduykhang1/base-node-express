import express from 'express'
import { serviceDI } from '../di/service.di'

const router = express.Router()

router.get('/hello', serviceDI.defaultService.hello)

exports.router = router

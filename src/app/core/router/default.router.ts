import express from 'express'
import { controllerDI } from '../../di/controller.di'

const router = express.Router()

/**
 * A song
 * @typedef {object} GenAnswerDto
 * @property {string} question.required - The question
 */

/**
 * POST /api/v1/gen-answer
 * @summary Post the question in the PDF file
 * @tags DEFAULT
 * @param {GenAnswerDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/gen-answer', controllerDI.defaultController.genAnswerFromPdf)

exports.router = router

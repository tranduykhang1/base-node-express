import express from 'express'
import { controllerContainer } from '../../container/controller.container'

const router = express.Router()

/**
 * A song
 * @typedef {object} GenAnswerDto
 * @property {string} question.required - The question
 */

/**
 * A song
 * @typedef {object} CreateHashDto
 * @property {string} doc_name.required - The doc name
 */

/**
 * POST /api/v1/gen-answer
 * @summary Post the question in the PDF file
 * @tags DEFAULT
 * @param {GenAnswerDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/gen-answer', controllerContainer.defaultController.genAnswerFromPdf)

/**
 * POST /api/v1/create-hash
 * @summary Create hash from document
 * @tags DEFAULT
 * @param {CreateHashDto} request.body.required - body - application/json
 * @return {string} 200 - success response - application/json
 */
router.post('/create-hash', controllerContainer.defaultController.createHash)

exports.router = router

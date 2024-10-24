import express from 'express'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/test-validation')
  .post( boardValidation.createNewBoard, (req, res) => {
    res.json({ data: req.body, message: 'Validation passed!' })
  })

export const boardRoute = Router

import Joi from 'joi'
import { BOARD_TYPES } from '~/utils/constants'
import { validationGenerator } from './generator'


const createNewCondition = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title is not allowed to be empty',
    'string.min': 'Title length must be at least 3 characters long',
    'string.max': 'Title length must be less than or equal to 50 characters long',
    'string.trim': 'Title must not have leading or trailing whitespace'
  }),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().required().valid(...Object.values(BOARD_TYPES))
})

export const boardValidation = {
  createNewBoard: validationGenerator(createNewCondition)
}

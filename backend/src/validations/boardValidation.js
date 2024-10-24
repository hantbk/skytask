import Joi from 'joi'
import { BOARD_TYPES } from '~/utils/constants'
import ApiError from '~/utils/ApiError'
import { validationGenerator } from './generator'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required ',
      'string.empty': 'Title is not allowed to be empty ',
      'string.min': 'Title length must be at least 3 characters long ',
      'string.max': 'Title length must be less than or equal to 50 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict(),
    type: Joi.string().required().valid(...Object.values(BOARD_TYPES))
  })

  try {

    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}

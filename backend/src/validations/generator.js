import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

/**
 * Middleware to validate request data (body, query, or params) using a Joi schema.
 * @param {Object} correctCondition - Joi schema for validation.
 * @param {string} [target='body'] - Part of the request to validate.
 * @returns {Function} Validation middleware.
 */
export function validationGenerator(correctCondition, target = 'body') {
  const targets = ['body', 'query', 'params']

  return async (req, res, next) => {
    try {
      if (!targets.includes(target)) {
        throw new Error(`Invalid target: ${target}. Expected 'body', 'query', or 'params'.`)
      }

      const dataToValidate = req[target]
      // abortEarly: false if has many validation errors will return all errors
      await correctCondition.validateAsync(dataToValidate, { abortEarly: false })
      // Validate successful -> Controller
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  }
}

/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Centralized error handling for backend NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {

  // If no statusCode provided then return code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // responseError control what error is returned
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  res.status(responseError.statusCode).json(responseError)
}

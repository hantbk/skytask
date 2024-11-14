import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const user = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(user)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}

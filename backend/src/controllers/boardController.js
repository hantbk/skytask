import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
    try {
        // Routing data to service layer
        const createdBoard = await boardService.createNew(req.body)

        // Return data to client
        res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
        next(error)
    }
}

const getDetails = async (req, res, next) => {
    try {
        const boardId = req.params.id

        // Routing data to service layer
        const board = await boardService.getDetails(boardId)

        // Return data to client
        res.status(StatusCodes.CREATED).json(board)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew,
    getDetails
}

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

export const boardController = {
    createNew
}

import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdCard)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
	try {
		const cardId = req.params.id
		const cardCoverFile = req.file
		const userInfo = req.jwtDecoded
		const updatedCard = await cardService.update(cardId, req.body, cardCoverFile, userInfo)

		res.status(StatusCodes.OK).json(updatedCard)
	} catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
	try {
		const cardId = req.params.id
		const userInfo = req.jwtDecoded
		await cardService.deleteItem(cardId, userInfo)
		res.status(StatusCodes.NO_CONTENT).end()
	} catch (error) { next(error) }
}

const createChecklist = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId  = req.params
		const title = req.body.title

		// Create checklist
		const updatedCard = await cardService.createChecklist(user, cardId, title)
		res.status(StatusCodes.CREATED).json(updatedCard)
	} catch (error) { next(error) }
}

export const cardController = {
	createNew,
	update,
	deleteItem,
	createChecklist
}

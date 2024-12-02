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
		const cardId = req.params
		const title = req.body.title

		// Create checklist
		const updatedCard = await cardService.createChecklist(user, cardId, title)
		res.status(StatusCodes.CREATED).json(updatedCard)
	} catch (error) { next(error) }
}

const updateChecklist = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId
		const title = req.body.title

		// Update checklist
		const updatedCard = await cardService.updateChecklist(user, cardId, checklistId, title)
		res.status(StatusCodes.OK).json(updatedCard)
	} catch (error) { next(error) }
}

const addChecklistItem = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId

		// Create checklist item
		const updatedCard = await cardService.addChecklistItem(user, cardId, checklistId, req.body.text)
		res.status(StatusCodes.CREATED).json(updatedCard)
	} catch (error) { next(error) }
}

const deleteChecklist = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId

		// Delete checklist
		const updatedCard = await cardService.deleteChecklist(user, cardId, checklistId)
		res.status(StatusCodes.OK).json(updatedCard)
	} catch (error) { next(error) }
}

const setChecklistItemCompleted = async (req, res, next) => {
	try {
		// Get params and request body
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId
		const checklistItemId = req.params.checklistItemId
		const completed = req.body.completed

		// Gọi service để cập nhật trạng thái 'completed' cho checklist item
		const updatedCard = await cardService.setChecklistItemCompleted(user, cardId, checklistId, checklistItemId, completed)

		// Trả về card đã cập nhật với trạng thái mới
		res.status(StatusCodes.OK).json(updatedCard)
	} catch (error) {
		// Xử lý lỗi
		next(error)
	}
}

const setChecklistItemText = async (req, res, next) => {
	try {
		// Get params and request body
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId
		const checklistItemId = req.params.checklistItemId
		const text = req.body.text

		// Gọi service để cập nhật trạng thái 'completed' cho checklist item
		const updatedCard = await cardService.setChecklistItemText(user, cardId, checklistId, checklistItemId, text)

		// Trả về card đã cập nhật với trạng thái mới
		res.status(StatusCodes.OK).json(updatedCard)
	} catch (error) {
		next(error)
	}
}

const deleteChecklistItem = async (req, res, next) => {
	try {
		// Get params and request body
		const user = req.jwtDecoded
		const cardId = req.params.id
		const checklistId = req.params.checklistId
		const checklistItemId = req.params.checklistItemId

		// Gọi service để xóa checklist item
		const deletedCard = await cardService.deleteChecklistItem(user, cardId, checklistId, checklistItemId)
		// Trả về card đã xóa
		res.status(StatusCodes.OK).json(deletedCard)
	} catch (error) {
		next(error)
	}
}

const addAttachment = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const { link, name } = req.body

		// Add attachment
		const updatedCard = await cardService.addAttachment(user, cardId, { link, name })

		res.status(StatusCodes.CREATED).json(updatedCard)
	} catch (error) { next(error) }
}

const updateAttachmentName = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const attachmentId = req.params.attachmentId
		const { name } = req.body
		// Update attachment name
		const updatedCard = await cardService.updateAttachmentName(user, cardId, attachmentId, name)
		res.status(StatusCodes.OK).json(updatedCard)
	}
	catch (error) { next(error) }
}

const updateAttachmentLink = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const attachmentId = req.params.attachmentId
		const { link } = req.body

		// Update attachment link
		const updatedCard = await cardService.updateAttachmentLink(user, cardId, attachmentId, link)
		res.status(StatusCodes.OK).json(updatedCard)
	}
	catch (error) { next(error) }
}

const removeAttachment = async (req, res, next) => {
	try {
		// Get params
		const user = req.jwtDecoded
		const cardId = req.params.id
		const attachmentId = req.params.attachmentId

		// Remove attachment
		const updatedCard = await cardService.removeAttachment(user, cardId, attachmentId)
		res.status(StatusCodes.OK).json(updatedCard)
	}
	catch (error) { next(error) }
}


export const cardController = {
	createNew,
	update,
	deleteItem,
	createChecklist,
	updateChecklist,
	deleteChecklist,
	addChecklistItem,
	setChecklistItemCompleted,
	setChecklistItemText,
	deleteChecklistItem,
	addAttachment,
	updateAttachmentName,
	updateAttachmentLink,
	removeAttachment
}

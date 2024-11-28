import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}

    if (cardCoverFile) {
      // Trường hợp đẩy ảnh lên Cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      // Lưu lại url của cái file ảnh vào trong database
      updatedCard = await cardModel.update(cardId, { cover: uploadResult.secure_url })
    } else if (updateData.commentToAdd) {
      // Tạo dữ liệu comment để thêm vào Database, cần bổ sung thêm những field cần thiết
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      // Trường hợp ADD hoặc REMOVE thành viên ra khỏi Card
      updatedCard = await cardModel.updateMembers(cardId, updateData.incomingMemberInfo)
    } else {
      // Các trường hợp update chung như title, description, ...
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) { throw error }
}

const deleteItem = async (cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId)
    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }

    await cardModel.deleteItem(cardId)

    await columnModel.pullCardOrderIds(targetCard)

    return true
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update,
  deleteItem
}

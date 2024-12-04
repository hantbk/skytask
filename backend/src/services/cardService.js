import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { StatusCodes } from 'http-status-codes'
import { validateCardOwners } from '~/utils/helperMethods'
import { ObjectId } from 'mongodb'
import axios from 'axios'

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
      // Các trường hợp update chung như title, description, add (remove) label ...
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


const createChecklist = async (user, cardId, title) => {
  try {
    const newChecklist = { title, items: [] };

    // Convert the cardId to an ObjectId
    const cardIdObj = new ObjectId(cardId);
    // Fetch the card, column, and board
    const card = await cardModel.findOneById(cardIdObj);
    const columnIdObj = new ObjectId(card.columnId);
    await columnModel.findOneById(columnIdObj);
    const boardIdObj = new ObjectId(card.boardId);
    await boardModel.findOneById(boardIdObj);

    const validateOwner = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);

    if (!validateOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to create checklist!');
    }

    // Add the checklist to the card
    const updatedCard = await cardModel.createChecklist(cardId, newChecklist);

    return updatedCard;
  } catch (error) {
    throw error;
  }
}

const addChecklistItem = async (user, cardId, checklistId, text) => {
  try {
    // Chuyển đổi cardId và checklistId sang ObjectId
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);

    // Lấy thông tin card, column, và board liên quan
    const card = await cardModel.findOneById(cardIdObj);
    const columnIdObj = new ObjectId(card.columnId);
    await columnModel.findOneById(columnIdObj);
    const boardIdObj = new ObjectId(card.boardId);
    await boardModel.findOneById(boardIdObj);

    // Kiểm tra quyền sở hữu
    const validateOwner = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);

    if (!validateOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to add checklist item!');
    }

    // Tạo đối tượng checklist item mới
    const newChecklistItem = {
      id: new ObjectId(),
      text,
      completed: false,
      createdAt: Date.now(),
      createdBy: user._id
    };

    // Thêm checklist item vào checklist cụ thể trong card
    const updatedCard = await cardModel.addChecklistItem(cardIdObj, checklistIdObj, newChecklistItem);

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const updateChecklist = async (user, cardId, checklistId, title) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const userIdObj = new ObjectId(user._id);

    // Get the card to ensure it's valid and retrieve related data (e.g., columnId, boardId)
    const card = await cardModel.findOneById(cardIdObj);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!');
    }
    const columnIdObj = new ObjectId(card.columnId);
    const boardIdObj = new ObjectId(card.boardId);

    // Check user permissions to modify the checklist item
    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update checklist item!');
    }

    // Update the checklist item
    const updatedCard = await cardModel.updateChecklist(cardIdObj, checklistIdObj, title);

    return updatedCard;

  } catch (error) {
    throw error;
  }
};

const deleteChecklist = async (user, cardId, checklistId) => {
  try {
    // Chuyển đổi cardId và checklistId sang ObjectId
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);

    // Lấy thông tin card, column, và board liên quan
    const card = await cardModel.findOneById(cardIdObj);
    const columnIdObj = new ObjectId(card.columnId);
    await columnModel.findOneById(columnIdObj);
    const boardIdObj = new ObjectId(card.boardId);
    await boardModel.findOneById(boardIdObj);

    // Kiểm tra quyền sở hữu
    const validateOwner = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);

    if (!validateOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete checklist item!');
    }

    // Xóa checklist khỏi card
    const updatedCard = await cardModel.deleteChecklist(cardIdObj, checklistIdObj);
    return updatedCard;

  } catch (error) {
    throw error;
  }
};

const setChecklistItemCompleted = async (user, cardId, checklistId, checklistItemId, completed) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const checklistItemIdObj = new ObjectId(checklistItemId);

    // Get the card to ensure it's valid and retrieve related data (e.g., columnId, boardId)
    const card = await cardModel.findOneById(cardIdObj);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!');
    }

    // Check user permissions to modify the checklist item
    const columnIdObj = new ObjectId(card.columnId);
    const boardIdObj = new ObjectId(card.boardId);

    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to modify this checklist item!');
    }

    // Call the model method to update the checklist item completion status
    const updatedCard = await cardModel.setChecklistItemCompleted(
      cardIdObj,
      checklistIdObj,
      checklistItemIdObj,
      completed
    );

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const setChecklistItemText = async (user, cardId, checklistId, checklistItemId, text) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const checklistItemIdObj = new ObjectId(checklistItemId);

    // Get the card to ensure it's valid and retrieve related data (e.g., columnId, boardId)
    const card = await cardModel.findOneById(cardIdObj);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!');
    }

    // Check user permissions to modify the checklist item
    const columnIdObj = new ObjectId(card.columnId);
    const boardIdObj = new ObjectId(card.boardId);

    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user);
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to modify this checklist item!')
    }
    // Call the model method to update the checklist item text
    const updatedCard = await cardModel.setChecklistItemText(cardIdObj, checklistIdObj, checklistItemIdObj, text)
    return updatedCard
  }
  catch (error) {
    throw error
  }
}

const deleteChecklistItem = async (user, cardId, checklistId, checklistItemId) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId)
    const checklistIdObj = new ObjectId(checklistId)
    const checklistItemIdObj = new ObjectId(checklistItemId)

    // Get the card to ensure it's valid and retrieve related data (e.g., columnId, boardId)
    const card = await cardModel.findOneById(cardIdObj)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }

    // Check user permissions to modify the checklist item
    const columnIdObj = new ObjectId(card.columnId)
    const boardIdObj = new ObjectId(card.boardId)

    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user)
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to modify this checklist item!')
    }

    // Call the model method to delete the checklist item
    const updatedCard = await cardModel.deleteChecklistItem(cardIdObj, checklistIdObj, checklistItemIdObj)
    return updatedCard

  } catch (error) {
    throw error
  }
}

const addAttachment = async (user, cardId, attachment) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId)

    // Get the card to ensure it's valid and retrieve related data (e.g., columnId)
    const card = await cardModel.findOneById(cardIdObj)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }

    // Check user permissions to add attachment
    const columnIdObj = new ObjectId(card.columnId)
    const boardIdObj = new ObjectId(card.boardId)
    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user)
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to add attachment!')
    }

    // Validate and normalize the link
    const validLink = new RegExp(/^https?:\/\//).test(attachment.link) ? attachment.link : `http://${attachment.link}`

    // Check if the link is accessible
    try {
      await axios.head(validLink, { timeout: 5000 }) // 5-second timeout for the request
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Provided link is not accessible!')
    }

    // Add attachment
    const newAttachment = {
      link: validLink,
      name: attachment.name
    }

    const updatedCard = await cardModel.addAttachment(cardIdObj, newAttachment)
    return updatedCard
  } catch (error) {
    throw error
  }
}

const updateAttachmentName = async (user, cardId, attachmentId, name) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId)
    const attachmentIdObj = new ObjectId(attachmentId)
    // Get the card to ensure it's valid and retrieve related data (e.g., columnId
    const card = await cardModel.findOneById(cardIdObj)

    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    // Check user permissions to update attachment
    const columnIdObj = new ObjectId(card.columnId)
    const boardIdObj = new ObjectId(card.boardId)
    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user)
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update attachment!')
    }
    // Update attachment name
    const updatedAttachment = await cardModel.updateAttachmentName(cardIdObj, attachmentIdObj, name)
    return updatedAttachment
  }
  catch (error) {
    throw error
  }
}

const updateAttachmentLink = async (user, cardId, attachmentId, link) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId)
    const attachmentIdObj = new ObjectId(attachmentId)
    // Get the card to ensure it's valid and retrieve related data (e.g., columnId
    const card = await cardModel.findOneById(cardIdObj)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    // Check user permissions to update attachment
    const columnIdObj = new ObjectId(card.columnId)
    const boardIdObj = new ObjectId(card.boardId)
    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user)
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update attachment!')
    }

    // Validate and normalize the link
    const validLink = new RegExp(/^https?:\/\//).test(link) ? link : `http://${link}`

    // Check if the link is accessible
    try {
      await axios.head(validLink, { timeout: 5000 })// 5-second timeout for the request
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Provided link is not accessible!')
    }

    // Update attachment link
    const updatedAttachment = await cardModel.updateAttachmentLink(cardIdObj, attachmentIdObj, validLink)
    return updatedAttachment
  }
  catch (error) {
    throw error
  }
}

const removeAttachment = async (user, cardId, attachmentId) => {
  try {
    // Convert the IDs to ObjectId instances
    const cardIdObj = new ObjectId(cardId)
    const attachmentIdObj = new ObjectId(attachmentId)
    // Get the card to ensure it's valid and retrieve related data (e.g., columnId and boardId)
    const card = await cardModel.findOneById(cardIdObj)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    // Check user permissions to remove attachment
    const columnIdObj = new ObjectId(card.columnId)
    const boardIdObj = new ObjectId(card.boardId)
    const isOwnerValid = await validateCardOwners(cardIdObj, columnIdObj, boardIdObj, user)
    if (!isOwnerValid) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to remove attachment!')
    }
    // Remove attachment
    const removedAttachment = await cardModel.removeAttachment(cardIdObj, attachmentIdObj)
    return removedAttachment
  }
  catch (error) {
    throw error
  }
}

export const cardService = {
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

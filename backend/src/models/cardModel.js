import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  // Dữ liệu comments của Card chúng ta sẽ học cách nhúng - embedded vào bản ghi Card luôn như dưới đây:
  comments: Joi.array().items({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userAvatar: Joi.string(),
    userDisplayName: Joi.string(),
    content: Joi.string(),
    // Chỗ này lưu ý vì dùng hàm $push để thêm comment nên không set default Date.now luôn giống hàm insertOne khi create được.
    commentedAt: Joi.date().timestamp()
  }).default([]),

  // Adding checklists field
  checklists: Joi.array().items({
    title: Joi.string().required(),
    items: Joi.array().items({
      text: Joi.string().required(),
      completed: Joi.boolean().default(false)
    }).default([]),
  }).default([]),

  attachments: Joi.array().items({
    link: Joi.string().uri().required(),
    name: Joi.string().default(null),
    date: Joi.date().default(Date.now)
  }).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),

  // Dữ liệu của label
  selectedLabels: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([])
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(String(validData.boardId)),
      columnId: new ObjectId(String(validData.columnId))
    }

    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(String(id))
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(key => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    if (updateData.columnId) updateData.columnId = new ObjectId(String(updateData.columnId))

    if (updateData.boardId) updateData.boardIs = new ObjectId(String(updateData.boardId))


    if (updateData.selectedLabels) {
      updateData.selectedLabels = updateData.selectedLabels.map(labelId => new ObjectId(String(labelId)))
    }

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(cardId)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      columnId: new ObjectId(String(columnId))
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
  * Đẩy một phần tử comment vào đầu mảng comments!
  * - Trong JS, ngược lại với push (thêm phần tử vào cuối mảng) sẽ là unshift (thêm phần tử vào đầu mảng)
  * - Nhưng trong mongodb hiện tại chỉ có $push - mặc định đẩy phần tử vào cuối mảng.
  * Dĩ nhiên cứ lưu comment mới vào cuối mảng cũng được, nhưng nay sẽ học cách để thêm phần tử vào đẩu mảng trong mongodb.
  * Vẫn dùng $push, nhưng bọc data vào Array để trong $each và chỉ định $position: 0
  * https://stackoverflow.com/a/25732817/8324172
  * https://www.mongodb.com/docs/manual/reference/operator/update/position/
*/
const unshiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $push: { comments: { $each: [commentData], $position: 0 } } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const updateMembers = async (cardId, incomingMemberInfo) => {
  try {
    let updateCondition = {}

    if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.ADD) {
      updateCondition = { $push: { memberIds: new ObjectId(String(incomingMemberInfo.userId)) } }
    }

    if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.REMOVE) {
      updateCondition = { $pull: { memberIds: new ObjectId(String(incomingMemberInfo.userId)) } }
    }

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(cardId)) },
      updateCondition,
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const deleteItem = async (cardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(String(cardId))
    })

    return result
  } catch (error) {
    throw error
  }
}

const createChecklist = async (cardId, checklistData) => {
  try {
    const cardIdObj = cardId instanceof ObjectId ? cardId : new ObjectId(cardId);

    const newChecklist = {
      _id: new ObjectId(), // Generate a new ObjectId for the checklist
      title: checklistData.title,
      items: checklistData.items || []
    };

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj },
      { $push: { checklists: newChecklist } },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const updateChecklist = async (cardId, checklistId, title) => {
  try {
    const cardIdObj = cardId instanceof ObjectId ? cardId : new ObjectId(cardId);
    const checklistIdObj = checklistId instanceof ObjectId ? checklistId : new ObjectId(checklistId);

    const updatedChecklistObj = {
      title: title,
    };
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj, 'checklists._id': checklistIdObj },
      { $set: { 'checklists.$.title': updatedChecklistObj.title, 'checklists.$.items': updatedChecklistObj.items } },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteChecklist = async (cardId, checklistId) => {
  try {
    const cardIdObj = cardId instanceof ObjectId ? cardId : new ObjectId(cardId);
    const checklistIdObj = checklistId instanceof ObjectId ? checklistId : new ObjectId(checklistId);

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj },
      { $pull: { checklists: { _id: checklistIdObj } } },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    throw error;
  }
};


const addChecklistItem = async (cardId, checklistId, checklistItem) => {
  try {
    const cardIdObj = cardId instanceof ObjectId ? cardId : new ObjectId(cardId);
    const checklistIdObj = checklistId instanceof ObjectId ? checklistId : new ObjectId(checklistId);

    const checklistItemWithId = {
      _id: checklistItem.id,
      text: checklistItem.text,
      completed: checklistItem.completed,
      createdAt: checklistItem.createdAt,
      createdBy: checklistItem.createdBy
    };

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj, 'checklists._id': checklistIdObj },
      { $push: { 'checklists.$.items': checklistItemWithId } },
      { returnDocument: 'after' }
    );

    return result
  } catch (error) {
    throw error;
  }
};


const setChecklistItemCompleted = async (cardId, checklistId, checklistItemId, completed) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const checklistItemIdObj = new ObjectId(checklistItemId);

    // Perform the update on the specific checklist item in the card
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: cardIdObj,
        'checklists._id': checklistIdObj
      },
      {
        $set: {
          'checklists.$.items.$[item].completed': completed
        }
      },
      {
        arrayFilters: [{ 'item._id': checklistItemIdObj }],
        returnDocument: 'after'
      }
    );

    return result
  } catch (error) {
    throw error;
  }
};

const setChecklistItemText = async (cardId, checklistId, checklistItemId, newText) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const checklistItemIdObj = new ObjectId(checklistItemId);

    // Perform the update on the specific checklist item in the card
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: cardIdObj,
        'checklists._id': checklistIdObj
      },
      {
        $set: {
          'checklists.$.items.$[item].text': newText
        }
      },
      {
        arrayFilters: [{ 'item._id': checklistItemIdObj }],
        returnDocument: 'after'
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

const deleteChecklistItem = async (cardId, checklistId, checklistItemId) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const checklistIdObj = new ObjectId(checklistId);
    const checklistItemIdObj = new ObjectId(checklistItemId);

    // Perform the update on the specific checklist item in the card
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: cardIdObj,
        'checklists._id': checklistIdObj
      },
      {
        $pull: {
          'checklists.$.items': { _id: checklistItemIdObj }
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  }
  catch (error) {
    throw error;
  }
}

const addAttachment = async (cardId, attachment) => {
  try {
    const cardIdObj = new ObjectId(cardId);

    const newAttachment = {
      _id: new ObjectId(),
      link: attachment.link,
      name: attachment.name || null,
      date: new Date()
    };

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj },
      { $push: { attachments: newAttachment } },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const updateAttachmentName = async (cardId, attachmentId, newName) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const attachmentIdObj = new ObjectId(attachmentId);

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: cardIdObj,
        'attachments._id': attachmentIdObj
      },
      {
        $set: { 'attachments.$.name': newName }
      },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const updateAttachmentLink = async (cardId, attachmentId, newLink) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const attachmentIdObj = new ObjectId(attachmentId);
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: cardIdObj,
        'attachments._id': attachmentIdObj
      },
      {
        $set: { 'attachments.$.link': newLink }
      },
      { returnDocument: 'after' }
    );
    return result;
  }
  catch (error) {
    throw error;
  }
};

const removeAttachment = async (cardId, attachmentId) => {
  try {
    const cardIdObj = new ObjectId(cardId);
    const attachmentIdObj = new ObjectId(attachmentId);

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: cardIdObj },
      { $pull: { attachments: { _id: attachmentIdObj } } },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  unshiftNewComment,
  updateMembers,
  deleteItem,
  createChecklist,
  deleteChecklist,
  addChecklistItem,
  setChecklistItemCompleted,
  setChecklistItemText,
  deleteChecklistItem,
  addAttachment,
  updateAttachmentName,
  removeAttachment,
  updateAttachmentLink,
  updateChecklist
}

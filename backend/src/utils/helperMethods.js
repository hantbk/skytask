import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'

export const validateCardOwners = async (cardIdObj, columnIdObj, boardIdObj, user) => {
    // Fetch card, column, and board using the provided ObjectId values
    const card = await cardModel.findOneById(cardIdObj);
    const column = await columnModel.findOneById(columnIdObj);
    const board = await boardModel.findOneById(boardIdObj);

    if (!card) {
        throw new ApiError(400, "Card không tồn tại.");
    }

    if (!column) {
        throw new ApiError(400, "Column không tồn tại.");
    }

    if (!board) {
        throw new ApiError(400, "Board không tồn tại.");
    }

    // Kiểm tra xem card._id có trong column.cardOrderIds không
    const isCardInColumn = column.cardOrderIds && column.cardOrderIds.some(item => item.equals(cardIdObj));
    if (!isCardInColumn) {
        throw new ApiError(400, "Card không tồn tại trong column.");
    }

    // Kiểm tra xem columnId có tồn tại trong board.columnOrderIds không
    const isColumnValid = board.columnOrderIds && board.columnOrderIds.some(id => id.equals(columnIdObj));
    if (!isColumnValid) {
        throw new ApiError(400, "Column không tồn tại trong board.");
    }

    // Kiểm tra xem user có thuộc board hiện tại không (trong ownerIds hoặc memberIds)
    const isUserValid = (board.ownerIds && board.ownerIds.some(id => id.equals(user._id))) ||
        (board.memberIds && board.memberIds.some(id => id.equals(user._id)));

    if (!isUserValid) {
        throw new ApiError(403, "User không phải thành viên hoặc chủ sở hữu của board này.");
    }

    return true; // Return true if all checks pass
};

export const labelsSeed = [
    { text: '', color: '#61bd4f', backColor: '#519839', selected: false },
    { text: '', color: '#f2d600', backColor: '#d9b51c', selected: false },
    { text: '', color: '#ff9f1a', backColor: '#cd8313', selected: false },
    { text: '', color: '#eb5a46', backColor: '#b04632', selected: false },
    { text: '', color: '#c377e0', backColor: '#89609e', selected: false },
    { text: '', color: '#0079bf', backColor: '#055a8c', selected: false },
];

export const createRandomHexColor = () => {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let hex = '#';

    for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * values.length);
        hex += values[index];
    }
    return hex.toString();
};
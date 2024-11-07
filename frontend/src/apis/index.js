import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Tất cả các function bên dưới không sử dụng try-catch để bắt lỗi do điều này dẫn đến dư thừa code (sử dụng try-catch quá nhiều)
 * Giải pháp: Sử dụng Interceptors
*/

// Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

// Column API
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

// Card API
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
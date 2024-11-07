import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Tất cả các function bên dưới không sử dụng try-catch để bắt lỗi do điều này dẫn đến dư thừa code (sử dụng try-catch quá nhiều)
 * Giải pháp: Sử dụng Interceptors
*/

// Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updatedData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updatedData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

// Column API
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updatedData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updatedData)
  return response.data
}

export const deleteColumnAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

// Card API
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
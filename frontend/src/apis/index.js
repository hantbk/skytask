import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Tất cả các function bên dưới không sử dụng try-catch để bắt lỗi do điều này dẫn đến dư thừa code (sử dụng try-catch quá nhiều)
 * Giải pháp: Sử dụng Interceptors (Học trong khóa nâng cao)
*/
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}

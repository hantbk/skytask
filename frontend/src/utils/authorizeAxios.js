import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
// Khởi tạo đối tượng axios (authorizedAxiosInstance) để custom và cấu hình dự án
let authorizedAxiosInstance = axios.create()

// Thời gian tối đa của request 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Chp phép gửi cookie trong request
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình interceptors cho axios instance
 * https://axios-http.com/docs/interceptors
*/
// Request Interceptors can thiệp vào request api
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptors can thiệp vào response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Chặn spam click
  interceptorLoadingElements(false)
  // Mọi Status Code nằm ngoài khoảng 2xx sẽ vào đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message

    // Sử dụng toastify để hiển thị thông báo lỗi - ngoại trừ mã 410 phục việc tự động reset token
    if (error.response.status !== 410) {
      toast.error(errorMessage)
    }
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance

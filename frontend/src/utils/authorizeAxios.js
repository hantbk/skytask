import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

/**
* Không thể import { store } from '~/redux/store' theo cách thông thường như các file jsx component
* Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
* Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
* https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/
let axiosReduxStore

export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

// Khởi tạo đối tượng axios (authorizedAxiosInstance) để custom và cấu hình dự án
let authorizedAxiosInstance = axios.create()

// Thời gian tối đa của request 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Cho phép gửi cookie trong request
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

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
let refreshTokenPromise = null


// Response Interceptors can thiệp vào response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Chặn spam click
  interceptorLoadingElements(false)

  /** Xử lý Refresh Token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
  // Lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  // Có thể bỏ _retry
  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => { return data?.accessToken })
        .catch((_error) => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
          // Thêm phần này để tránh bị gọi api logout 2 lần
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý giai đoạn cuối ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
      * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
      * Ví dụ: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
      */

      // Bước 2: return lại axios instance kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Sử dụng toastify để hiển thị thông báo lỗi - ngoại trừ mã 410 phục việc tự động reset token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance

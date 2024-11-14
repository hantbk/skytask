import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentUser: null
}

// Các hành động gọi API (bất đồng bộ) và cập nhập dữ liệu vào Redux, dùng Middleware createAsysncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Lưu ý: axios trả kết quả về qua property của nó là data
    return response.data
  }
)


//Khởi tạo một Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhập lại dữ liệu thông qua reducer (chyaj đông bộ)
// export const {  } = userSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
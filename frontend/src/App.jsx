import { Routes, Route, Navigate } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Welcome from './pages/Welcome/Welcome'
import LoginForm from './pages/Auth/LoginForm'
import RegisterForm from './pages/Auth/RegisterForm'
import AccountVerification from '~/pages/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to="boards/672a55cbb042a7b34289efd0" replace={true} />
      } />

      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/welcome' element={<Welcome />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/register' element={<RegisterForm />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

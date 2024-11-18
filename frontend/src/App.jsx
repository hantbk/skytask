import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Welcome from './pages/Welcome/Welcome'
import LoginForm from './pages/Auth/LoginForm'
import RegisterForm from './pages/Auth/RegisterForm'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'

// ProtectedRoute component for authenticated routes
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/welcome' replace={true} />
  return <Outlet />
}

// PublicRoute component for unauthenticated routes
const PublicRoute = ({ user }) => {
  if (user) return <Navigate to='/' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect root path to a default board */}
      <Route path='/' element={<Navigate to="/boards" replace={true} />} />

      {/* Protected Routes (Accessible only after login) */}
      <Route element={<ProtectedRoute user={currentUser} />}>

        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* Use Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Public Routes (Accessible only when logged out) */}
      <Route element={<PublicRoute user={currentUser} />}>
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/account/verification' element={<AccountVerification />} />
      </Route>

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

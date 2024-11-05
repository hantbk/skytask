import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId
    // Sau (khoá advanced): Sử dụng react-router-dom để lấy boardId từ URL
    const boardId = '672a464c2caf73074eb27d50'

    // Call API
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        setBoard(board)
      })
  }, [])

  return (
    <Container maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
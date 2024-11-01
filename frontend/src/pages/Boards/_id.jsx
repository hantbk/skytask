import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId
    // Sử dụng react-router-dom để lấy boardId từ URL (Học trong khóa nâng cao)
    const boardId = '671f0baf68e260189a05c45b'

    // Call API
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        setBoard(board)
        console.log(board)
      })
  }, [])

  return (
    <Container maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar />
      <BoardContent />
    </Container>
  )
}

export default Board

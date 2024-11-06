import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId
    // Sử dụng react-router-dom để lấy boardId từ URL
    const boardId = '672a55cbb042a7b34289efd0'

    // Call API
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        setBoard(board)
      })
  }, [])

  // Call API to create new column and update state
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

  }

  // Call API to create new card and update state
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
  }

  return (
    // https://stackoverflow.com/questions/64577132/how-to-get-rid-of-padding-in-material-ui-container-component
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent 
        board={board} 
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
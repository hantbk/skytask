import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId
    // Sử dụng react-router-dom để lấy boardId từ URL
    const boardId = '672a55cbb042a7b34289efd0'

    // Call API
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        board.columns.forEach(column => {
          // If  column has no cards, create a placeholder card for it
          // This is to make sure that the column always has at least one card
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          }
        })
        setBoard(board)
      })
  }, [])

  // Call API to create new column and update state
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // If column has no cards, create a placeholder card for it when F5 page
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Update state after creating new column
    // Make right state data board instead of calling fetchBoardDetailsAPI again
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)

  }

  // Call API to create new card and update state
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Update state after creating new card
    // Make right state data board instead of calling fetchBoardDetailsAPI again
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Call API to move columns and update state
  const moveColumns = async (dndOrderedColumns) => {
    // Update state after moving columns
    // Make right state data board instead of calling fetchBoardDetailsAPI again
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    // Call API to update columnOrderIds
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnIds })
  }

  return (
    // https://stackoverflow.com/questions/64577132/how-to-get-rid-of-padding-in-material-ui-container-component
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board
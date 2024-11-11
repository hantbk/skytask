import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()
  // console.log(boardId)

  useEffect(() => {

    // Call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Call API to create new column and update state


  // Call API to create new card and update state

  // Function này có nhiện vụ gọi API và xử lí kh kéo thả Column xong xuôi
  // Chỉ cần gọi API update columnOrderIds của Board
  const moveColumns = (dndOrderedColumns) => {
    // Update state after moving columns
    // Make right state data board instead of calling fetchBoardDetailsAPI again
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Goij API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyển Card trong cùng một Column
  // Gọi API update cardOrderIds của Column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update dữ liệu board
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lí phía BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds

    // Fix bug when move the last card in column to another column
    if (prevCardOrderIds[0].includes('placeholder-card')) { prevCardOrderIds = [] }

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lí xóa một column và card bên trong nó


  if (!board) {
    return <PageLoadingSpinner caption='Loading board...' />
  }

  return (
    // https://stackoverflow.com/questions/64577132/how-to-get-rid-of-padding-in-material-ui-container-component
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}


        // createNewCard={createNewCard}
        // deleteColumnDetails={deleteColumnDetails}

        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}

      />
    </Container>
  )
}

export default Board
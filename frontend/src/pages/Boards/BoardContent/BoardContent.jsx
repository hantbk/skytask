import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {

  const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    setOrderedColumns( mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm một cái column theo cardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDranOver chúng ta sẽ
    // làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo mới ra cardOrderIds mới.
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  //funtion chung cap nhat lai state trong truong hop di chuyen card
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return - cập nhập lại
      //OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // nextActiveColumn: Column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thẻ hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Cập nhập lại mảng OrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn: Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Cập nhập lại mảng OrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // neu keo card moi thuc hien set gia tri oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {


    // Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nêu kéo card ta xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại active hoặc over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    // (tránh crash trang)
    if (!active || !over) return

    // activeDraggingCardId: Là cái card đang dược kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với card đucợ kéo ở trên.
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu
    //của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vẫn đề 
    //khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc một hành động kéo một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event

    // Cầm đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì
    // (tránh crash trang)
    if (!active || !over) return
    // console.log('handleDragEnd: ', event)

      // Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: Là cái card đang dược kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với card đucợ kéo ở trên.
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết
      if (!activeColumn || !overColumn) return

      //hanh dong keo tha card giua 2 column khac nhau
      //
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      }else {
        //hanh dong keo tha card trong cung column

        // console.log('keo tha card trong cung column')
        // lay vi tri cu tu oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDragItemId.id)
        // lay vi tri moi tu active
        const newCardIndex = overColumn?.card?.findIndex(c => c._id === overCardId)
  
        //dung arrayMove vi keo card tuong tu voi logic keo column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns =>{
          // Clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return - cập nhập lại
        //OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumns)

        //tim toi cai column minh dang tha
        const targetColumn = nextColumns.find(c => c._id === overColumn._id)

        //cap nhat lai 2 gia tri moi
        targetColumn.cards = dndOrderedCards
        targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

        return nextColumns
        })
      }

    }
      
    //Xưr lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lay vi tri cu tu active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lay vi tri moi tu active
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
  
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
  
        // console.log('dndOrderedColumns: ',dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ',dndOrderedColumnsIds)
        // cái này để sau này xử lý api
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // du lieu sau khi keo thar phai tra ve null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      //Thuật toán phát hiện va chạm
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent

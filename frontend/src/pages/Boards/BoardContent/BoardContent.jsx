import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/ultis/sorts'

import { 
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
 } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react'

function BoardContent({ board }) {

  const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})

  const mouseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})

  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance: 500}})

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])


  useEffect(() => {
    setOrderedColumns( mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event

    if(!over) return

    if(active.id !== over.id) {
      // lay vi tri cu tu active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lay vi tri moi tu active
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

      // console.log('dndOrderedColumns: ',dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ',dndOrderedColumnsIds)
      // cái này để sau này xử lý api
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  )
}

export default BoardContent

import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Grid
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCardInBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI, updateCardDetailsAPI } from '~/apis'
import { updateCurrentActiveCard, selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useDispatch } from 'react-redux'

const style = {
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
}

const colors = [
  '#388E3C', '#FBC02D', '#F57C00', '#D32F2F', '#512DA8', '#1976D2',
  '#009688', '#FFA000', '#FF7043', '#9C27B0', '#3F51B5', '#8BC34A'
]

const LabelPopover = () => {
  const dispatch = useDispatch()

  const [viewMode, setViewMode] = useState('list')
  const [selectedColor, setSelectedColor] = useState('')
  const [title, setTitle] = useState('')

  const board = useSelector(selectCurrentActiveBoard)

  const card = useSelector(selectCurrentActiveCard)

  const handleAddLabel = () => {
    const newLabel = {
      text: title,
      color: selectedColor
    }
    updateBoardDetailsAPI(board._id, { labels: board.labels ? [...board.labels, newLabel] : [newLabel] })
      .then((res) => {
        dispatch(updateCurrentActiveBoard({ ...board, labels: res.labels }))
      })
  }

  const handleUpdateSeletedCard = (updatedCard) => {
    dispatch(updateCurrentActiveCard(updatedCard))

    dispatch(updateCardInBoard(updatedCard))

    updateCardDetailsAPI(updatedCard._id, updatedCard)
  }

  const renderLabelList = () => (
    <>
      <TextField
        fullWidth
        placeholder="Search labels"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <List>
        {Array.isArray(board.labels) &&
          board.labels.map((label) => (
            <ListItem
              key={label.id}
              disablePadding
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ListItemButton>
                <ListItemText
                  primary={label.text}
                  sx={{ display: 'flex', alignItems: 'center' }}
                />
              </ListItemButton>
              <Box
                sx={{
                  width: '24px',
                  height: '24px',
                  bgcolor: label.color,
                  borderRadius: '4px'
                }}
              ></Box>
              <IconButton edge="end" sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setViewMode('add')}
      >
        Add new label
      </Button>
    </>
  )

  const renderAddLabel = () => (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <IconButton onClick={() => setViewMode('list')} sx={{ color: '#000' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Add new label</Typography>
        <IconButton onClick={() => setViewMode('list')} sx={{ color: '#000' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          height: '40px',
          borderRadius: '4px',
          bgcolor: selectedColor || '#ccc',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: selectedColor ? '#fff' : '#000'
        }}
      >{title}</Box>

      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Nhập tiêu đề nhãn"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white'
          }
        }}
      />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Chọn một màu
      </Typography>
      <Grid container spacing={1}>
        {colors.map((color) => (
          <Grid item xs={3} key={color}>
            <Box
              onClick={() => setSelectedColor(color)}
              sx={{
                width: '100%',
                height: '30px',
                borderRadius: '4px',
                bgcolor: color,
                cursor: 'pointer',
                border: selectedColor === color ? '2px solid #000' : 'none'
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!title && !selectedColor}
        onClick={() => {
          handleAddLabel()
          setViewMode('list')
        }}
      >
        Tạo mới
      </Button>
    </>
  )

  return <Box sx={style}>{viewMode === 'list' ? renderLabelList() : renderAddLabel()}</Box>
}

export default LabelPopover

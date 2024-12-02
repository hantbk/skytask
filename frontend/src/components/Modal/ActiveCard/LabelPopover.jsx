import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Typography,
  Grid
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCardInBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI, updateCardDetailsAPI } from '~/apis'
import {
  updateCurrentActiveCard,
  selectCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useDispatch } from 'react-redux'

const style = {
  width: 400,
  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
  ,
  boxShadow: 24,
  p: 2,
  borderRadius: '8px'
}

const colors = [
  '#388E3C',
  '#FBC02D',
  '#F57C00',
  '#D32F2F',
  '#512DA8',
  '#1976D2',
  '#009688',
  '#FFA000',
  '#FF7043',
  '#9C27B0',
  '#3F51B5',
  '#8BC34A'
].sort()

const VIEW_MODE = {
  LIST: 'LIST',
  CREATE_LABEL: 'CREATE_LABEL',
  UPDATE_LABEL: 'UPDATE_LABEL'
}

const LabelPopover = () => {
  const dispatch = useDispatch()

  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST)
  const [selectedColor, setSelectedColor] = useState('')
  const [title, setTitle] = useState('')
  const [activeLabel, setActiveLabel] = useState({})

  const board = useSelector(selectCurrentActiveBoard)

  const activeCard = useSelector(selectCurrentActiveCard)

  const [selectedLabels, setSelectedLabels] = useState(activeCard.selectedLabels || [])
  const [searchText, setSearchText] = useState('')
  const [searchValue] = useDebounce(searchText, 500)


  const handleAddLabel = () => {
    const newLabel = {
      text: title,
      color: selectedColor
    }
    updateBoardDetailsAPI(board._id, {
      labels: board.labels ? [...board.labels, newLabel] : [newLabel]
    }).then((res) => {
      dispatch(updateCurrentActiveBoard({ ...board, labels: res.labels }))
      setViewMode(VIEW_MODE.LIST)
      setTitle('')
      setSelectedColor('')
    })
  }

  const handleUpdateLabel = () => {
    updateBoardDetailsAPI(board._id, {
      labels: board.labels.map((label) =>
        label._id === activeLabel._id ? activeLabel : label
      )
    }).then((res) => {
      dispatch(updateCurrentActiveBoard({ ...board, labels: res.labels }))
      setViewMode(VIEW_MODE.LIST)
      setActiveLabel({})
    })
  }

  const handleSelectLabel = async (labelId) => {
    const updatedLabels = Array.isArray(activeCard.selectedLabels)
      ? activeCard.selectedLabels.includes(labelId)
        ? activeCard.selectedLabels.filter((id) => id !== labelId)
        : [...activeCard.selectedLabels, labelId]
      : [labelId]
    const updatedCard = {
      selectedLabels: updatedLabels
    }
    setSelectedLabels(updatedLabels)

    const updateCardResult = await updateCardDetailsAPI(activeCard._id, updatedCard)

    dispatch(updateCurrentActiveCard(updateCardResult))
    dispatch(updateCardInBoard(updateCardResult))
  }

  const renderLabelList = () => (
    <>
      <TextField
        fullWidth
        placeholder="Search labels"
        onChange={(e) => {
          setSearchText(e.target.value)
        }}

        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <List sx={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
        {Array.isArray(board.labels) &&
          board.labels
            .filter((label) => searchValue ? label.text.toLowerCase().includes(searchValue.toLowerCase()) : true )
            .map((label, id) => (
              <ListItem
                key={id}
                disablePadding
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Checkbox
                  edge="start"
                  checked={selectedLabels.includes(label._id)}
                  onChange={() => handleSelectLabel(label._id)}
                />
                <Box
                  sx={{
                    height: '40px',
                    borderRadius: '4px',
                    bgcolor: label.color,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: label.color ? '#fff' : '#000',
                    flexGrow: 1,
                    maxWidth: '100%'
                  }}
                >
                  <Typography>{label.text}</Typography>
                </Box>
                {/* </ListItemButton> */}

                <IconButton
                  edge="end"
                  sx={{ paddingRight: '20px' }}
                  onClick={() => {
                    setActiveLabel(label)
                    setSearchText('')
                    setViewMode(VIEW_MODE.UPDATE_LABEL)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </ListItem>
            ))}
      </List>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setViewMode(VIEW_MODE.CREATE_LABEL)}
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
        <IconButton
          onClick={() => setViewMode(VIEW_MODE.LIST)}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'white' : '#33485D'
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Add new label</Typography>
        <IconButton
          onClick={() => setViewMode(VIEW_MODE.LIST)}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#white' : '#33485D'
          }}
        >
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
      >
        {title}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#33485D' : 'white'
          }
        }}
      />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Select a color
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
        disabled={!title || !selectedColor}
        onClick={() => {
          handleAddLabel()
        }}
      >
        Create new
      </Button>
    </>
  )

  const renderUpdateLabel = () => (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <IconButton
          onClick={() => setViewMode(VIEW_MODE.LIST)}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'white' : '#33485D'
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Update label</Typography>
        <IconButton
          onClick={() => setViewMode(VIEW_MODE.LIST)}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#white' : '#33485D'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          height: '40px',
          borderRadius: '4px',
          bgcolor: activeLabel.color || '#ccc',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: activeLabel.color ? '#fff' : '#000'
        }}
      >
        {activeLabel.text}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Title"
        value={activeLabel.text}
        onChange={(e) => setActiveLabel((prev) => ({ ...prev, text: e.target.value }))}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#33485D' : 'white'
          }
        }}
      />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Select a color
      </Typography>
      <Grid container spacing={1}>
        {colors.map((color) => (
          <Grid item xs={3} key={color}>
            <Box
              onClick={() => setActiveLabel((prev) => ({ ...prev, color: color }))}
              sx={{
                width: '100%',
                height: '30px',
                borderRadius: '4px',
                bgcolor: color,
                cursor: 'pointer',
                border: activeLabel.color === color ? '2px solid #000' : 'none'
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!activeLabel.text && !activeLabel.color}
        onClick={() => {
          handleUpdateLabel()
        }}
      >
        Update label
      </Button>
    </>
  )

  return (
    <Box sx={style}>
      {viewMode === VIEW_MODE.LIST ? renderLabelList() : (
        viewMode === VIEW_MODE.CREATE_LABEL ? renderAddLabel() : renderUpdateLabel(activeLabel)
      )}
    </Box>
  )
}

export default LabelPopover

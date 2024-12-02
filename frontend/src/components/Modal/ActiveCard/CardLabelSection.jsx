import { Stack, Chip, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import AddIcon from '@mui/icons-material/Add'

const CardLabelSection = ({ popoverId, handleTogglePopover }) => {

  const activeBoard = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)

  const selectedLabels = activeCard.selectedLabels || []

  return (
    <>
      <Stack
        direction="row"
        sx={{
          maxWidth: '100%',
          flexWrap: 'wrap',
          overflow: 'hidden',
          rowGap: '8px',
          gap: '4px'
        }}
      >
        {activeBoard.labels
          .filter((label) => selectedLabels.includes(label._id) )
          .map((label, index) => (
            <Chip
              key={index}
              label={label.text}
              sx={{
                backgroundColor: label.color,
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 1
              }}
            />
          ))
        }
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Stack>
    </>
  )
}

export default CardLabelSection

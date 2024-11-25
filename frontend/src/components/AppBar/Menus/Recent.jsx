import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import Typography from '@mui/material/Typography'
import ApartmentIcon from '@mui/icons-material/Apartment';

function Recent() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const theme = useTheme()
  const buttonBackgroundColor = theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'

  return (
    <Box>
      <Button
        sx={{
          color: 'white',
          backgroundColor: buttonBackgroundColor,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1c2833' : '#0d47a1'
          }
        }}
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={ <ExpandMoreIcon />}
      >
        Recent
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <ViewKanbanIcon/>
          </ListItemIcon>
          <ListItemText>TaskFlow</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' , ml: 1}}>
            HUST
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ApartmentIcon/>
          </ListItemIcon>
          <ListItemText>Kanban Templates</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>More Templates...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Recent
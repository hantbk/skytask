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
import ApartmentIcon from '@mui/icons-material/Apartment'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ArticleIcon from '@mui/icons-material/Article';
import AssistantIcon from '@mui/icons-material/Assistant';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Templates() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const theme = useTheme()
  const buttonBackgroundColor = theme.palette.mode === 'dark' ? '#2c3e50' : '#1A3636'
  const hoverBackgroundColor = theme.palette.mode === 'dark' ? '#1c2833' : '#697565'

  return (
    <Box>
      <Button
        sx={{
          color: 'white',
          backgroundColor: buttonBackgroundColor,
          '&:hover': {
            backgroundColor: hoverBackgroundColor
          }
        }}
        id="basic-button-templates"
        aria-controls={open ? 'basic-menu-templates' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Templates
      </Button>
      <Menu
        id="basic-menu-templates"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-templates'
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }
        }}
      >
        <MenuItem>
          <ListItemText>Top templates</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText>1-on-1 Meeting Agenda</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AssistantIcon />
          </ListItemIcon>
          <ListItemText>Agile Board Template | Trello</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText>Company Overview</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AutoAwesomeIcon />
          </ListItemIcon>
          <ListItemText>Design Huddle</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LocalGroceryStoreIcon />
          </ListItemIcon>
          <ListItemText>Go To Market Strategy Template</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Explore templates</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Templates
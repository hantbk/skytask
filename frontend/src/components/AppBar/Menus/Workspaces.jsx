import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'

function Workspaces() {
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
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces'
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }
        }}
      >
        <MenuItem>
          <ListItemText>Current Workspace</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <WorkspacePremiumIcon/>
          </ListItemIcon>
          <ListItemText>HUST</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Your Workspaces</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <CorporateFareIcon />
          </ListItemIcon>
          <ListItemText>HUST</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Workspaces
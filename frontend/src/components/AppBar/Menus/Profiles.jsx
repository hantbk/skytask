import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, useTheme, colors } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const theme = useTheme()
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const handleLogout = () => {
    setOpenLogoutDialog(true)
  }

  const handleConfirmLogout = () => {
    dispatch(logoutUserAPI())
    setOpenLogoutDialog(false)
  }

  const handleCancelLogout = () => {
    setOpenLogoutDialog(false)
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
            }}
            alt={currentUser?.name}
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <Link to="/settings/account" style={{ color: 'inherit' }}>
          <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} src={currentUser?.avatar} /> Account
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <Link to="/settings/account" style={{ color: 'inherit' }}>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': {
              color: 'warning.dark',
              '& .logout-icon': {
                color: 'warning.dark'
              }
            }
          }}
        >
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
            boxShadow: theme.shadows[5],
            backgroundColor: theme.palette.background.paper
          }
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <ExitToApp sx={{ marginRight: theme.spacing(1), fontSize: 28, color: theme.palette.warning.main }} />
          <Typography variant="h6">Log out of your account?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Are you sure you want to log out of your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleCancelLogout} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Profiles
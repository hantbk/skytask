import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'

function Starred() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Sử dụng theme từ môi trường
  const theme = useTheme()
  const buttonColor = theme.palette.mode === 'dark' ? '#2c3e50' : '#1A3636'

  return (
    <Box>
      <Button
        sx={{
          color: 'white',
          backgroundColor: buttonColor,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1c2833' : '#697565'
          }
        }}
        id="basic-button-starred"
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Starred
      </Button>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred'
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }
        }}
      >
        {/* Hình ảnh và chữ căn giữa */}
        <MenuItem>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 1,
            }}
          >
            <img
              src="https://trello.com/assets/cc47d0a8c646581ccd08.svg"
              alt="Starred Boards"
              style={{
                width: 250
              }}
            />
            <span
              style={{
                fontSize: '14px',
                lineHeight: 1.5
              }}
            >
              Star important boards to access them
            </span>
            <span
              style={{
                fontSize: '14px',
                lineHeight: 1.5
              }}
            >
               quickly and easily.
            </span>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Starred
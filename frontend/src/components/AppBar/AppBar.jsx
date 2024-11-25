import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import Profiles from './Menus/Profiles'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useMediaQuery } from '@mui/material'
import MoreMenu from './MoreMenu'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notification'


function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'))

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const searchRef = useRef(null)

  const toggleSearch = () => {
    setIsSearchOpen(true)
  }

  const handleBlur = (e) => {
    // Check if the target is outside the search input
    if (!searchRef.current.contains(e.relatedTarget)) {
      setIsSearchOpen(false)
      setSearchValue('') // Optionally clear the search value
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
        setSearchValue('') // Optionally clear the search field when clicking outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Apps Icon */}
        <Link to="/boards">
          <Tooltip title="Boards List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        {/* Logo and name container */}
        <Link to="/">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.3, md: 0.5 }, flexShrink: 0 }}>
            <SvgIcon
              component={TrelloIcon}
              fontSize="small"
              inheritViewBox
              sx={{ color: 'white', fontSize: { xs: '1rem', md: '1.5rem' } }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 'bold',
                color: 'white',
                display: 'inline-block'
              }}
            >
              TaskFlow
            </Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' }
            }}
            variant='outlined'
            startIcon={<LibraryAddIcon />}>Create</Button>
        </Box>

        {/* Show MoreMenu when on small screens */}
        {isSmallScreen && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoreMenu /> {/* Display MoreMenu component */}
            <Button
              sx={{
                color: 'white',
                border: 'none',
                '&:hover': { border: 'none' }
              }}
              variant='outlined'
              startIcon={<LibraryAddIcon />}></Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Icon */}
        {!isSearchOpen ? (
          <SearchIcon
            sx={{ color: 'white', cursor: 'pointer' }}
            onClick={toggleSearch}
          />
        ) : (
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onBlur={handleBlur}
            inputRef={searchRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    fontSize="small"
                    sx={{ color: searchValue ? 'white' : 'transparent' }}
                    onClick={() => setSearchValue('')}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: { xs: '100px', md: '120px' }, // Adjust for small screens
              maxWidth: '170px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />
        )}

        {/* Dark - Light - System Mode */}
        <ModeSelect />

        {/* Xử lí hiển thị thông báo ở đây */}
        <Notifications />

        <Tooltip title="Help">
          <HelpOutlineOutlinedIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar

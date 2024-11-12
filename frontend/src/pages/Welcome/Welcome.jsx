import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as HomeIllustration } from '~/assets/homepage/home-illustration.svg'

import { Link } from 'react-router-dom'

function Welcome() {
  return (
    <Box sx={{
      backgroundImage: 'linear-gradient(#eae6ff, #ffffff)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* App Bar */}
      <Box sx={{
        width: '100%',
        height: '73px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'fixed'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} fontSize="large" inheritViewBox sx={{ color: '#0079BF' }}/>
          <Typography variant='span' sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}
          >TaskFlow</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/login"> {/* Sử dụng Link để điều hướng đến /login */}
            <Button
              variant="text"
              sx={{
                fontSize: '1.1rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >Login</Button>
          </Link>
          <Link to="/register">
            <Button
              variant="contained"
              sx={{
                fontSize: '1.1rem',
                backgroundColor: 'rgb(56, 161, 105)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgb(46, 151, 95)'
                }
              }}
            >Sign up</Button>
          </Link>

        </Box>
      </Box>

      {/* Board */}
      <Box sx={{
        height: 'cacl(100vh - 73px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        textAlign: 'center',
        padding: '64px',
        gap: 5
      }}>
        <Box sx={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Trello helps teams move work forward.</Typography>
          <Typography variant="h5" sx={{ marginTop: '8px' }}>Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with Trello.</Typography>
        </Box>
        <Box sx={{ marginTop: '24px' }}>
          <SvgIcon component={HomeIllustration} inheritViewBox sx={{ fontSize: '40rem' }}/>
        </Box>
      </Box>
    </Box>
  )
}

export default Welcome
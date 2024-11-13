import { Box, Button, SvgIcon, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as HomeIllustration } from '~/assets/homepage/home-illustration.svg'
import { Link } from 'react-router-dom'

function Welcome() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box sx={{
      backgroundImage: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`,
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
        boxShadow: isDarkMode
          ? '0 4px 12px rgba(0, 0, 0, 0.5)'
          : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        position: 'fixed',
        backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
        borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} fontSize="large" inheritViewBox sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            TaskFlow
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/login">
            <Button
              variant="text"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: theme.palette.text.primary,
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.primary.main,
                }
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="contained"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                backgroundColor: theme.palette.success.main,
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                }
              }}
            >
              Sign up
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Board */}
      <Box sx={{
        height: 'calc(100vh - 73px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        textAlign: 'center',
        padding: { xs: '24px', md: '64px' },
        gap: { xs: 3, md: 5 }
      }}>
        {/* Left side with text */}
        <Box sx={{ textAlign: 'left', maxWidth: { xs: '100%', md: '50%' } }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: theme.palette.text.primary,
              animation: 'slideInLeft 1s ease-out forwards',
              opacity: 0,
              '@keyframes slideInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-100px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          >
            TaskFlow helps teams move work forward.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.5rem' },
              marginTop: '8px',
              color: theme.palette.text.secondary,
              animation: 'slideInLeft 1.5s ease-out forwards',
              opacity: 0,
              '@keyframes slideInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-100px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          >
            Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with TaskFlow.
          </Typography>
        </Box>

        {/* Right side with illustration */}
        <Box sx={{ marginTop: { xs: '16px', md: '24px' }, width: '100%', maxWidth: { xs: '80%', md: '50%' } }}>
          <SvgIcon
            component={HomeIllustration}
            inheritViewBox
            sx={{
              fontSize: { xs: '15rem', md: '30rem' },
              animation: 'slideInRight 1.5s ease-out forwards',
              opacity: 0,
              '@keyframes slideInRight': {
                '0%': { opacity: 0, transform: 'translateX(100px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Welcome

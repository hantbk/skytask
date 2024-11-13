import { Box, Button, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

function NotFound() {
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative', height: '100vh', backgroundColor: theme.palette.background.default }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          textAlign: 'center',
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: '30vh',
              fontWeight: 'bold',
              position: 'relative',
              margin: '-8vh 0 0',
              padding: 0,
              color: theme.palette.text.primary,
              '&::after': {
                content: '"404"',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                color: 'transparent',
                background: 'repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text'
              }
            }}
          >
            404
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: '8vh',
              fontWeight: 'bold',
              lineHeight: '10vh',
              maxWidth: '600px',
              position: 'relative',
              color: theme.palette.text.secondary,
              '&::after': {
                content: '"NOT FOUND"',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }
            }}
          >
            NOT FOUND
          </Typography>
        </Box>
        <Box sx={{ marginTop: 4 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                background: 'repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176)',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '24px',
                padding: '15px 30px',
                textDecoration: 'none',
                transition: '0.25s all ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Go Home
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default NotFound

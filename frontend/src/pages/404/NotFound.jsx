import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
          textAlign: 'center',
          gap: 1
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
              '&::after': {
                content: '"404"',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                color: 'transparent',
                background: '-webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176)',
                '-webkit-background-clip': 'text'
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
              color: '#d6d6d6',
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
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 40
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button
            sx={{
              background: '-webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176)',
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
                transform: 'scale(1.05)'
              }
            }}
          >
            Go Back
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default NotFound

import NavBar from '@/src/components/navbar'
import { Box, Container, Typography, Grid } from '@mui/material'

const WelcomeScreen = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, darkblue, white)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <NavBar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                lineHeight: '1.2'
              }}
            >
              TaskFlow helps teams move work forward.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.5rem' },
                maxWidth: { xs: '100%', md: '75%' },
                mt: 2
              }}
            >
              Collaborate, manage projects, and reach new productivity peaks. From high rises to the
              home office, the way your team works is unique - accomplish it all with Trello.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/frontend/public/homepage/home-illustration.svg"
              alt="brand logo"
              sx={{
                width: '100%',
                height: { xs: 200, sm: 300, md: 400, lg: 500 }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default WelcomeScreen

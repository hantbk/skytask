import {
  Box,
  Button,
  SvgIcon,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import { ReactComponent as HomeIllustration } from '~/assets/homepage/home-illustration.svg';
import { ReactComponent as IconSup } from '~/assets/homepage/icon-supervisor.svg';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

function Header({ isDarkMode, theme }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '73px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 2,
        boxShadow: isDarkMode
          ? '0 4px 12px rgba(0, 0, 0, 0.5)'
          : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        position: 'fixed',
        backgroundColor: isDarkMode
          ? theme.palette.background.default
          : theme.palette.background.paper,
        borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        zIndex: 10,
      }}
    >
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
              },
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
              },
            }}
          >
            Sign up
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

function FeatureCard({ title, description, color, img }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          borderTop: `5px solid ${color}`,
          boxShadow: 3,
          transition: 'transform 0.2s',
          ':hover': { transform: 'scale(1.03)' },
          position: 'relative',
        }}
      >
        <CardContent sx={{ paddingBottom: '60px' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography color="textSecondary">{description}</Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{
            width: 50,
            height: 50,
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}
          image={img}
          alt={`${title} Icon`}
        />
      </Card>
    </Grid>
  );
}

function Welcome() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const currentUser = useSelector(selectCurrentUser);
  if (currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  const featureCards = [
    {
      title: 'Supervisor',
      description: 'Monitors activity to identify project roadblocks.',
      color: 'cyan',
      img: 'https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-supervisor.svg',
    },
    {
      title: 'IT Leaders',
      description: 'Secure all leave and accommodation data in one platform, cloud-based.',
      color: 'red',
      img: 'https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-team-builder.svg',
    },
    {
      title: 'Administrators',
      description: 'Automate the handling of daily leave of absence and accommodation tasks.',
      color: 'orange',
      img: 'https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-karma.svg',
    },
    {
      title: 'HR Leaders',
      description: 'Bring leave of absence and accommodation 100% in-house to own the end-to-end employee experience.',
      color: 'blue',
      img: 'https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-calculator.svg',
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header isDarkMode={isDarkMode} theme={theme} />
      <Box
        sx={{
          height: 'calc(100vh - 73px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          textAlign: 'center',
          padding: { xs: '24px', md: '64px' },
          gap: { xs: 3, md: 5 },
        }}
      >
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
            <Box sx={{
              marginTop: { xs: '16px', md: '24px' },
              alignItems: 'center',
              justifyContent: 'flex-end',
              display: 'flex',
              gap: 2
            }}>
              <Button
                variant="contained"
                sx={{
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  paddingX: 3,
                  paddingY: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  },
                  boxShadow: isDarkMode
                    ? '0px 4px 12px rgba(255, 255, 255, 0.2)'
                    : '0px 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Get Started Now
                </Link>
              </Button>
            </Box>
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
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          fontFamily: 'Poppins, sans-serif',
          color: '#1c1c1c',
          padding: '24px 0',
        }}
      >
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {featureCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#1c1c1c',
          color: '#ffffff',
          paddingY: 4,
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Find Us
              </Typography>
              <Typography variant="body2">
                Hanoi University of Science and Technology, 1 Dai Co Viet, Hai Ba Trung, Hanoi
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">Phone: +84 1234567890</Typography>
              <Typography variant="body2">Email: [info@hust.edu.vn](mailto:info@hust.edu.vn)</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom></Typography>
              <Typography variant="body2">Copyright 2022 Hanoi University of Science and Technology</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}

export default Welcome;

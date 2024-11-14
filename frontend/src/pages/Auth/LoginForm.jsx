import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as IconLeft } from '~/assets/login/left.svg'
import { ReactComponent as IconRight } from '~/assets/login/right.svg'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const theme = useTheme()

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '40px 0px',
          gap: 0.5
        }}>
          <SvgIcon component={TrelloIcon} fontSize="large" inheritViewBox sx={{ color: theme.palette.primary.main }} />
          <Typography variant='span' sx={{ fontSize: '2rem', fontWeight: 'bold', color: theme.palette.text.primary }}>
            TaskFlow
          </Typography>
        </Box>
        <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
          {verifiedEmail &&
            <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
              Your email&nbsp;
              <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
              &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
            </Alert>
          }
          {registeredEmail &&
            <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
              An email has been sent to&nbsp;
              <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
              <br />Please check and verify your account before logging in!
            </Alert>
          }
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <SvgIcon
            component={IconLeft}
            inheritViewBox
            sx={{
              width: '30%',
              position: 'absolute',
              bottom: '5%',
              left: '5%',
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              verticalAlign: 'middle',
              borderStyle: 'none',
              animation: 'slideInLeft 2s ease-out forwards',
              opacity: 0,
              '@keyframes slideInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-100px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          />
          <SvgIcon
            component={IconRight}
            inheritViewBox
            sx={{
              width: '30%',
              position: 'absolute',
              bottom: '5%',
              right: '5%',
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              verticalAlign: 'middle',
              borderStyle: 'none',
              animation: 'slideInRight 2s ease-out forwards',
              opacity: 0,
              '@keyframes slideInRight': {
                '0%': { opacity: 0, transform: 'translateX(100px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          />
          {/* Form Login */}
          <Box sx={{
            width: '350px',
            // maxWidth: '500px',
            padding: '25px 40px',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxSizing: 'border-box',
            borderColor: theme.palette.divider,
            borderRadius: '8px',
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            zIndex: 1
            // '@media (max-width: 1366px)': {
            //   width: '60%'
            // },
            // '@media (min-width: 1367px)': {
            //   width: '100%'
            // }
          }}>

            <Typography
              variant='h6'
              sx={{
                marginTop: '20px',
                marginBottom: '25px',
                textAlign: 'center',
                color: theme.palette.text.primary
              }}>
              Log in to Taskflow
            </Typography>

            <Box>
              <TextField
                label="Enter Email"
                variant="outlined"
                fullWidth
                autoFocus
                margin="normal"
                type="text"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
                sx={{ backgroundColor: theme.palette.background.default }}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>

            <Box>
              <TextField
                label="Enter Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                sx={{ backgroundColor: theme.palette.background.default }}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                fontWeight: 'bold',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Sign In
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Typography variant="body1">
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => (e.target.style.color = theme.palette.primary.dark)}
                  onMouseLeave={(e) => (e.target.style.color = theme.palette.primary.main)}
                >
                  Sign up for an account
                </Link>
              </Typography>
            </Box>

          </Box>

        </Box>

      </Box>
    </form>
  )
}

export default LoginForm

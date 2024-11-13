import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as IconLeftSignUp } from '~/assets/register/sign-up-left.svg'
import { ReactComponent as IconRightSignUp } from '~/assets/register/sign-up-right.svg'
import TextField from '@mui/material/TextField'
import { Link } from 'react-router-dom'
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

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const theme = useTheme()

  const submitRegister = (data) => {
    console.log('submit Register: ', data)
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
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

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <SvgIcon
            component={IconLeftSignUp}
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
            component={IconRightSignUp}
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
          {/* Form Register */}
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
              Sign up for your account
            </Typography>

            <Box>
              <TextField
                label="Enter Email"
                variant="outlined"
                fullWidth
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
                label="Create Password"
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

            <Box>
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                error={!!errors['password_confirmation']}
                {...register('password_confirmation', {
                  validate: (value) => {
                    if (value === watch('password')) return true
                    return 'Password Confirmation does not match!'
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
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
              Sign Up
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'underline',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => (e.target.style.color = theme.palette.primary.dark)}
                  onMouseLeave={(e) => (e.target.style.color = theme.palette.primary.main)}
                >
                  Log in
                </Link>
              </Typography>
            </Box>

          </Box>

        </Box>

      </Box>
    </form>
  )
}

export default RegisterForm
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

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const submitRegister = (data) => {
    console.log('submit Register: ', data)
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '40px 0px',
          gap: 0.5
        }}>
          <SvgIcon component={TrelloIcon} fontSize="large" inheritViewBox sx={{ color: '#0079BF' }} />
          <Typography variant='span' sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
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
              borderStyle: 'none'
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
              borderStyle: 'none'
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
            borderColor: '#ccc',
            borderRadius: '8px',
            boxShadow: 'rgb(0 0 0 / 10%) 0 0 10px',
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
                textAlign: 'center'
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
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
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
              />
              <FieldErrorAlert errors={errors} fieldName={'password'}/>
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
              <FieldErrorAlert errors={errors} fieldName={'password_confirmation'}/>
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2, mb: 2, fontWeight: 'bold', backgroundColor: '#0079BF' }}
            >
              Sign Up
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>Already have an account? Log in.</Link>
            </Box>

          </Box>

        </Box>

      </Box>
    </form>
  )
}

export default RegisterForm
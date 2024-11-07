import { AppBar, Toolbar, IconButton, Button, Typography, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { Logout as LogoutIcon } from '@mui/icons-material'
import Link from 'next/link'
import PropTypes from 'prop-types'

const NavBar = ({ bg }) => {
  const user = useSelector((state) => state.user)

  const logout = async () => {
    const URL = '/api/logout'

    const response = await fetch(URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({})
    })

    const responseInJson = await response.json()

    if (responseInJson.message === 'success') {
      window.location.href = `${window.location.origin}/login`
    }
  }

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <IconButton color="error" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      )
    }

    return (
      <>
        <Button color="primary" component={Link} href="/login">
          Log in
        </Button>
        <Button variant="contained" color="success" component={Link} href="/signup">
          Sign up
        </Button>
      </>
    )
  }

  return (
    <AppBar position="static" style={{ backgroundColor: bg || 'default' }}>
      <Toolbar>
        <Box component="img" src="/frontend/public/taskflow-logo.png" alt="brand logo" sx={{ height: 40, mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TaskFlow
        </Typography>
        {renderButtons()}
      </Toolbar>
    </AppBar>
  )
}

NavBar.propTypes = {
  bg: PropTypes.string
}

export default NavBar

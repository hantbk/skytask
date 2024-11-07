import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider, useTheme } from '@mui/material/styles'
import theme from './theme'

// react-toastify configuration
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ToastContainer wrapper component
function ThemedToastContainer() {
  const theme = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme = {theme.palette.mode === 'dark' ? 'dark' : 'colored'}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ThemedToastContainer />
  </CssVarsProvider>
);

import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider, useTheme } from '@mui/material/styles'
import theme from './theme'
import { ConfirmProvider } from 'material-ui-confirm'

// react-toastify configuration
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// ToastContainer wrapper component
// eslint-disable-next-line react-refresh/only-export-components
function ThemedToastContainer() {
  const theme = useTheme()

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme={theme.palette.mode === 'dark' ? 'dark' : 'colored'}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        dialogProps: { maxWidth: 'xs' },
        buttonOrder: ['confirm', 'cancel'],
        cancellationButtonProps: { color: 'inherit' },
        confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
      }}>
        <CssBaseline />
        <App />
      </ConfirmProvider>
      <ThemedToastContainer />
    </CssVarsProvider>
  </Provider>
)

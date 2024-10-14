import { createTheme } from '@mui/material/styles'
import { experimental_extendTheme as extendTheme} from '@mui/material/styles'
import { teal, deepOrange, orange, cyan } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        decondary: deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  }
  // ...other properties
})

export default theme
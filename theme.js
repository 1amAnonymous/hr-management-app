// theme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enabling dark mode
    primary: {
      main: '#90caf9', // Light blue color for primary button
    },
    secondary: {
      main: '#f48fb1', // Light pink color for secondary buttons
    },
    background: {
      default: '#121212', // Dark background color
      paper: '#1d1d1d', // Paper background color (for cards, etc.)
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default darkTheme;

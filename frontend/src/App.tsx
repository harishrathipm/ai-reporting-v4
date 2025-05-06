import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import Chat from './components/Chat';
import Navbar from './components/Navbar';
import { RoleProvider } from './state/RoleContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <Navbar />
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Chat />
          </Box>
        </Container>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;

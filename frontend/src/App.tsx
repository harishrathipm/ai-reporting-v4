import React, { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  Container, 
  Box, 
  Typography, 
  Alert
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import QueryInput from './components/QueryInput';
import ResultVisualization from './components/ResultVisualization';
import { queryService } from './services/query.service';
import { QueryResponse } from './types';

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
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await queryService.sendQuery({ query });
      setResult(response);
    } catch (err) {
      console.error('Error submitting query:', err);
      setError('Failed to process your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            AI-Powered Data Analysis
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Ask questions about your data in plain English
          </Typography>
          
          <QueryInput onSubmit={handleSubmitQuery} isLoading={loading} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <ResultVisualization result={result} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
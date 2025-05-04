import React, { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  Container, 
  Box, 
  Typography, 
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import QueryInput from './components/QueryInput';
import ResultVisualization from './components/ResultVisualization';
import Chat from './components/Chat';
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

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Dynamic Reporting AI
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Ask questions about your data in plain English
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
            <Tabs value={tabValue} onChange={handleChangeTab} aria-label="interface tabs">
              <Tab label="Chat Interface" />
              <Tab label="Query Interface" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Chat />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <QueryInput onSubmit={handleSubmitQuery} isLoading={loading} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <ResultVisualization result={result} />
          </TabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
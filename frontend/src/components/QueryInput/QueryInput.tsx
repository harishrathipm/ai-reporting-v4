import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface QueryInputProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await onSubmit(query);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ask a question about your data
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What were our top-selling products last month?"
            disabled={isLoading}
            multiline
            rows={2}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isLoading || !query.trim()}
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ height: '56px' }}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default QueryInput;
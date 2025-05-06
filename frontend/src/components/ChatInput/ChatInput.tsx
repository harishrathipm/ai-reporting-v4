import SendIcon from '@mui/icons-material/Send';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      await onSubmit(message);
      setMessage(''); // Clear input after submission
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ask a question about your data
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g., What were our top-selling products last month?"
            disabled={isLoading}
            multiline
            rows={2}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !message.trim()}
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ChatInput;

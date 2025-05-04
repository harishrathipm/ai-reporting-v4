import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';
import QueryInput from '../QueryInput';
import { Message, Conversation } from '../../types';
import { queryService } from '../../services/query.service';

interface ChatProps {
  conversationId?: string;
}

const Chat: React.FC<ChatProps> = ({ conversationId: initialConversationId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);

  // Load conversation if conversationId is provided
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        const conversation = await queryService.getConversation(conversationId);
        setMessages(conversation.messages);
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Failed to load conversation history.');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  const handleSubmitQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add user message immediately for better UX
      const userMessage: Message = {
        role: 'user',
        content: query,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Send query to backend
      const response = await queryService.sendQuery({ 
        query, 
        conversationId 
      });
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.result,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Save conversation ID if this is a new conversation
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }
    } catch (err) {
      console.error('Error submitting query:', err);
      setError('Failed to process your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Conversation {conversationId ? `#${conversationId.substring(0, 8)}...` : ''}
      </Typography>
      
      {/* Chat history */}
      <Box 
        sx={{ 
          mb: 3, 
          maxHeight: '400px', 
          overflowY: 'auto',
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 1
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No messages yet. Start by asking a question.
          </Typography>
        ) : (
          <List>
            {messages.map((message, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  mb: 1,
                  p: 1,
                  backgroundColor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  borderRadius: 1,
                  maxWidth: '80%',
                  ml: message.role === 'user' ? 'auto' : 0,
                  mr: message.role === 'assistant' ? 'auto' : 0,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </Typography>
                  <Typography>{message.content}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Query input */}
      <QueryInput onSubmit={handleSubmitQuery} isLoading={loading} />
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default Chat;
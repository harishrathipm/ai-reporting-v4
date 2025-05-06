import { Box, CircularProgress, Divider, List, ListItem, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { queryService } from '../../services/query.service';
import { useRole } from '../../state/RoleContext';
import { Message } from '../../types';
import ChatInput from '../ChatInput';

interface ChatProps {
  conversationId?: string;
}

const Chat: React.FC<ChatProps> = ({ conversationId: initialConversationId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);

  // Use the shared role context instead of local state
  const { selectedRole } = useRole();

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

  // Save conversation ID to localStorage when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('currentConversationId', conversationId);
    }
  }, [conversationId]);

  // Load conversation ID from localStorage on component mount
  useEffect(() => {
    if (!initialConversationId) {
      const savedConversationId = localStorage.getItem('currentConversationId');
      if (savedConversationId) {
        setConversationId(savedConversationId);
      }
    }
  }, [initialConversationId]);

  const handleSubmitMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      // Add user message immediately for better UX
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Send message to backend with selected role and conversation ID
      const response = await queryService.sendChat(message, selectedRole, conversationId);

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.result,
        timestamp: new Date().toISOString(),
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Save conversation ID if this is a new conversation
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }
    } catch (err) {
      console.error('Error submitting message:', err);
      setError('Failed to process your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    setConversationId(undefined);
    setMessages([]);
    localStorage.removeItem('currentConversationId');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {conversationId
            ? `Conversation #${conversationId.substring(0, 8)}...`
            : 'New Conversation'}
        </Typography>
        {conversationId && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={startNewConversation}
            >
              Start New Conversation
            </Typography>
          </Box>
        )}
      </Box>

      {/* Chat history */}
      <Box sx={{ mb: 3, height: 400, overflow: 'auto', bgcolor: 'grey.50', borderRadius: 1, p: 2 }}>
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
                  bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  borderRadius: 1,
                  maxWidth: '80%',
                  ml: message.role === 'user' ? 'auto' : 0,
                  mr: message.role === 'assistant' ? 'auto' : 0,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                    {message.role === 'assistant' && selectedRole && ` (as ${selectedRole})`}
                  </Typography>
                  <Typography>{message.content}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Chat input */}
      <ChatInput onSubmit={handleSubmitMessage} isLoading={loading} />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default Chat;

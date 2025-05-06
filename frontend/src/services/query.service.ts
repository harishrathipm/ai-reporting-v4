import { ChatResponse, Conversation } from '../types';
import api from './api';

export const queryService = {
  // Keeping this method in case we need conversation retrieval for chat history
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/chat/conversation/${conversationId}`);
    return response.data;
  },

  // Method to fetch available roles
  getRoles: async (): Promise<string[]> => {
    const response = await api.get<{ roles: string[] }>('/roles');
    return response.data.roles;
  },

  // Method for chat with role support
  sendChat: async (
    query: string,
    role?: string,
    conversationId?: string
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', {
      query,
      role,
      conversationId,
    });
    return response.data;
  },
};

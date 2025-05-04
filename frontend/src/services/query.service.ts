import api from './api';
import { QueryRequest, QueryResponse, Conversation } from '../types';

export const queryService = {
  sendQuery: async (queryRequest: QueryRequest): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/query', queryRequest);
    return response.data;
  },
  
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/query/conversation/${conversationId}`);
    return response.data;
  }
};
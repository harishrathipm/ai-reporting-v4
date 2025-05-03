import api from './api';
import { QueryRequest, QueryResponse } from '../types';

export const queryService = {
  sendQuery: async (queryRequest: QueryRequest): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/query', queryRequest);
    return response.data;
  }
};
export interface QueryRequest {
  query: string;
  userId?: string;
  context?: Record<string, any>;
}

export interface QueryResponse {
  query: string;
  result: any;
  status: string;
  metadata?: Record<string, any>;
  visualization?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
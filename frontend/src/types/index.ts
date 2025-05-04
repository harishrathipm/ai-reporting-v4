// Define the structure of our env.json file
export interface EnvConfig {
  apiUrl: string;
}

export interface Message {
  role: string;  // "user" or "assistant"
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  metadata?: Record<string, any>;
}

export interface QueryRequest {
  query: string;
  userId?: string;
  context?: Record<string, any>;
  conversationId?: string;
}

export interface QueryResponse {
  query: string;
  result: any;
  status: string;
  metadata?: Record<string, any>;
  visualization?: Record<string, any>;
  conversation_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
// Define the structure of our env.json file
export interface EnvConfig {
  apiUrl: string;
}

export interface Message {
  role: string; // "user" or "assistant"
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  metadata?: Record<string, any>;
}

// Renamed from QueryRequest to ChatRequest for clarity
export interface ChatRequest {
  query: string;
  role?: string;
  conversationId?: string;
}

// Renamed from QueryResponse to ChatResponse for clarity
export interface ChatResponse {
  query: string;
  result: any;
  metadata?: Record<string, any>;
  conversation_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

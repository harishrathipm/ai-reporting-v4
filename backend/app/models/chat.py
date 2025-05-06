from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    query: str
    role: Optional[str] = None
    conversationId: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    query: str
    result: str
    conversation_id: str
    metadata: Optional[Dict[str, Any]] = None

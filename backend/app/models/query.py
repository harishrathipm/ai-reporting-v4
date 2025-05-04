from pydantic import BaseModel
from typing import Any, Optional, Dict, List


class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None


class Conversation(BaseModel):
    id: str
    messages: List[Message]
    metadata: Optional[Dict[str, Any]] = None


class QueryResponse(BaseModel):
    query: str
    result: Any
    status: str
    metadata: Optional[Dict[str, Any]] = None
    visualization: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

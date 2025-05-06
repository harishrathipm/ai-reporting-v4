"""
Chat Router - API endpoints for chat functionality.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.models.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.services.conversation_store import ConversationStore
from app.services.roles_service import RolesService
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

# Create router
router = APIRouter(
    prefix="/api",
    tags=["chat"],
)

# Dependency to get ChatService instance
def get_chat_service():
    return ChatService()

# Dependency to get ConversationStore instance
def get_conversation_store():
    return ConversationStore()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, chat_service: ChatService = Depends(get_chat_service)):
    """
    Process a chat request.

    Args:
        request: ChatRequest with query and optional role
        chat_service: ChatService instance

    Returns:
        ChatResponse: The response from the LLM
    """
    logger.info("API endpoint called: POST /chat")

    # Validate role if provided
    if request.role and not RolesService.is_valid_role(request.role):
        logger.warning(f"Invalid role provided: {request.role}")
        raise HTTPException(status_code=400, detail=f"Invalid role: {request.role}")

    try:
        # Process the chat request
        response_data = await chat_service.process_chat(
            query=request.query,
            role=request.role,
            conversation_id=request.conversationId
        )

        # Convert to response model
        return ChatResponse(**response_data)

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@router.get("/chat/conversation/{conversation_id}")
async def get_conversation(conversation_id: str, conversation_store: ConversationStore = Depends(get_conversation_store)):
    """
    Get the messages in a conversation.

    Args:
        conversation_id: The ID of the conversation to retrieve
        conversation_store: ConversationStore instance

    Returns:
        Dict containing conversation ID and messages
    """
    logger.info(f"API endpoint called: GET /chat/conversation/{conversation_id}")

    try:
        messages = conversation_store.get_conversation(conversation_id)

        if not messages:
            logger.warning(f"Conversation not found: {conversation_id}")
            raise HTTPException(status_code=404, detail=f"Conversation not found: {conversation_id}")

        return {
            "id": conversation_id,
            "messages": messages
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error retrieving conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")

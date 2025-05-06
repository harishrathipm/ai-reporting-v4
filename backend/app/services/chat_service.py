"""
Chat Service - Handles chat functionality and conversation management.
"""
from typing import Dict, Any, List, Optional
from uuid import uuid4
from app.services.llm_service import LLMService
from app.services.conversation_store import ConversationStore
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

class ChatService:
    """
    Service for handling chat functionality and conversation management.
    Delegates LLM interactions to the LLMService.
    """

    def __init__(self, llm_service: Optional[LLMService] = None):
        """
        Initialize the chat service.

        Args:
            llm_service: An optional LLMService instance. If not provided, a new one will be created.
        """
        self.llm_service = llm_service or LLMService()
        self.conversation_store = ConversationStore()
        logger.info("Chat service initialized")

    async def process_chat(self,
                     query: str,
                     role: Optional[str] = None,
                     conversation_id: Optional[str] = None,
                     conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Process a chat request.

        Args:
            query: The user's query
            role: Optional role to contextualize the response
            conversation_id: Optional ID for an existing conversation
            conversation_history: Optional list of previous messages in the conversation

        Returns:
            A dictionary containing the response data
        """
        # Generate a conversation ID if not provided
        conversation_id = conversation_id or str(uuid4())

        # Log the chat request
        logger.info(f"Processing chat request - Role: {role or 'None'}, Query: {query}")

        try:
            # Store the user message in the conversation history
            self.conversation_store.add_message(conversation_id, "user", query)

            # Get conversation history from the store
            history = self.conversation_store.get_conversation_messages_for_llm(conversation_id)

            # Generate response using LLM service with the full conversation history
            response_text = self.llm_service.generate_response(
                query=query,
                role=role,
                conversation_history=history
            )

            # Store the assistant's response in the conversation history
            self.conversation_store.add_message(conversation_id, "assistant", response_text)

            # Construct response data
            response_data = {
                "query": query,
                "result": response_text,
                "conversation_id": conversation_id,
                "metadata": {
                    "role": role,
                    "provider": self.llm_service.provider
                }
            }

            logger.info(f"Chat response generated successfully for conversation {conversation_id}")
            return response_data

        except Exception as e:
            logger.error(f"Error in chat service: {str(e)}")
            raise

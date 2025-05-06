"""
Conversation Store - Manages conversation history persistence.
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
import threading
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

class ConversationStore:
    """
    Simple in-memory store for conversation history.

    In a production environment, this would be replaced with a proper database.
    """
    _instance = None
    _lock = threading.Lock()

    # Properly define the conversations attribute as a class attribute
    conversations: Dict[str, List[Dict[str, Any]]] = {}

    def __new__(cls):
        """Singleton pattern to ensure only one conversation store exists."""
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(ConversationStore, cls).__new__(cls)
                # Initialize the conversations dictionary
                cls._instance.conversations = {}
                logger.info("Conversation store initialized")
            return cls._instance

    def add_message(self, conversation_id: str, role: str, content: str) -> None:
        """
        Add a message to a conversation's history.

        Args:
            conversation_id: The ID of the conversation
            role: The role of the message sender ("user" or "assistant")
            content: The message content
        """
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []

        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        self.conversations[conversation_id].append(message)
        logger.debug(f"Added message to conversation {conversation_id}")

    def get_conversation(self, conversation_id: str) -> Optional[List[Dict[str, Any]]]:
        """
        Get all messages for a conversation.

        Args:
            conversation_id: The ID of the conversation

        Returns:
            List of messages in the conversation, or None if not found
        """
        return self.conversations.get(conversation_id)

    def get_conversation_messages_for_llm(self, conversation_id: str) -> Optional[List[Dict[str, str]]]:
        """
        Get conversation messages in a format suitable for the LLM service.
        Simplifies the format to just role and content fields.

        Args:
            conversation_id: The ID of the conversation

        Returns:
            List of simplified messages or None if not found
        """
        messages = self.get_conversation(conversation_id)
        if not messages:
            return None

        # Return just the role and content for the LLM
        return [{"role": msg["role"], "content": msg["content"]} for msg in messages]

    def get_all_conversations(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get all stored conversations.

        Returns:
            Dictionary of all conversations
        """
        return self.conversations

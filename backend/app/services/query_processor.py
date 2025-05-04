import uuid
import datetime
from typing import Dict, List, Optional
from app.models.query import QueryRequest, QueryResponse, Conversation, Message
from app.services.llm_service import llm_service
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)


class QueryProcessorService:
    """
    Service for processing natural language queries and managing conversations.
    """

    def __init__(self) -> None:
        # In-memory storage for conversations
        # In a production environment, this would be stored in a database
        self.conversations: Dict[str, Conversation] = {}
        logger.info("QueryProcessorService initialized")

    async def process_query(self, request: QueryRequest) -> QueryResponse:
        """
        Process a natural language query and return results.

        Args:
            request: The query request containing the query text and optional context

        Returns:
            A response containing the query result and metadata
        """
        # Create or retrieve conversation
        conversation_id: str = request.conversation_id or str(uuid.uuid4())
        logger.info(f"Processing query for conversation: {conversation_id}")
        logger.debug(
            f"Query text: {request.query[:100]}{'...' if len(request.query) > 100 else ''}"
        )

        # Add user message to conversation
        self._add_message_to_conversation(
            conversation_id=conversation_id, role="user", content=request.query
        )

        # Process the query using the LLM service
        start_time: datetime.datetime = datetime.datetime.now()
        logger.debug(f"Query processing started at: {start_time.isoformat()}")

        # Get conversation history for context (up to 10 most recent messages)
        conversation: Optional[Conversation] = self.conversations.get(conversation_id)
        context: str = ""
        if conversation and len(conversation.messages) > 1:
            # Format previous messages as context
            previous_messages: List[Message] = conversation.messages[
                :-1
            ]  # All except the most recent user message
            context = "Previous conversation:\n"
            for msg in previous_messages[-10:]:  # Last 10 messages
                context += f"{msg.role.capitalize()}: {msg.content}\n"
            context += "\n"
            logger.debug(
                f"Including conversation context with {len(previous_messages[-10:])} previous messages"
            )

        # Generate response using LLM
        prompt: str = (
            f"{context}User query: {request.query}\nPlease provide a helpful response."
        )
        result: str = await llm_service.generate_response(prompt)

        end_time: datetime.datetime = datetime.datetime.now()
        execution_time: float = (end_time - start_time).total_seconds()
        logger.info(f"Query processed in {execution_time:.2f} seconds")

        # Add assistant message to conversation
        self._add_message_to_conversation(
            conversation_id=conversation_id, role="assistant", content=result
        )

        # Create response
        response: QueryResponse = QueryResponse(
            query=request.query,
            result=result,
            status="success",
            conversation_id=conversation_id,
            metadata={
                "execution_time": f"{execution_time:.2f}s",
                "llm_provider": llm_service.provider,
                "message_count": len(self.conversations[conversation_id].messages),
            },
        )

        logger.debug(f"Response metadata: {response.metadata}")
        return response

    def _add_message_to_conversation(
        self, conversation_id: str, role: str, content: str
    ) -> None:
        """
        Add a message to a conversation, creating the conversation if it doesn't exist.

        Args:
            conversation_id: The ID of the conversation
            role: The role of the message sender ("user" or "assistant")
            content: The content of the message
        """
        timestamp: str = datetime.datetime.now().isoformat()

        if conversation_id not in self.conversations:
            # Create new conversation
            logger.info(f"Creating new conversation: {conversation_id}")
            self.conversations[conversation_id] = Conversation(
                id=conversation_id, messages=[], metadata={"created_at": timestamp}
            )

        # Add message to conversation
        logger.debug(f"Adding {role} message to conversation {conversation_id}")
        message: Message = Message(role=role, content=content, timestamp=timestamp)
        self.conversations[conversation_id].messages.append(message)

    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """
        Get a conversation by ID.

        Args:
            conversation_id: The ID of the conversation

        Returns:
            The conversation if found, None otherwise
        """
        logger.debug(f"Retrieving conversation: {conversation_id}")
        conversation: Optional[Conversation] = self.conversations.get(conversation_id)
        if not conversation:
            logger.warning(f"Conversation not found: {conversation_id}")
        return conversation


# Create a singleton instance
logger.debug("Creating QueryProcessorService singleton instance")
query_processor: QueryProcessorService = QueryProcessorService()

"""
LLM Service - Handles interactions with language models.
"""
from typing import List, Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from app.config import settings
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

class LLMService:
    """
    Service for interactions with Language Models.
    Abstracts away the specifics of different LLM providers.
    """

    def __init__(self):
        """Initialize the LLM service with the configured provider."""
        self.provider = settings.llm_provider.lower()
        self.llm = self._initialize_llm()
        logger.info(f"LLM Service initialized with provider: {self.provider}")

    def _initialize_llm(self) -> Any:
        """
        Initialize the LLM client based on the configured provider.

        Returns:
            An instance of the appropriate LLM client

        Raises:
            ValueError: If the configured LLM provider is not supported
        """
        if self.provider == "openai":
            logger.info(f"Initializing OpenAI LLM with model: {settings.openai_model_name}")
            return ChatOpenAI(model=settings.openai_model_name)
        else:
            logger.error(f"Unsupported LLM provider: {self.provider}")
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    def generate_response(self,
                          query: str,
                          role: Optional[str] = None,
                          conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Generate a response using the LLM based on the query and optional role.

        Args:
            query: The user's query
            role: Optional role to contextualize the response
            conversation_history: Optional list of previous messages in the conversation

        Returns:
            The generated response text

        Raises:
            Exception: If there's an error generating the response
        """
        try:
            # Create messages for LangChain
            messages: List[BaseMessage] = []

            # Add system message with role context if provided
            if role:
                system_prompt = f"You are a {role}. Answer the user's question from this perspective."
                messages.append(SystemMessage(content=system_prompt))
                logger.info(f"Using role-based system prompt for {role}")

            # Add conversation history if provided
            if conversation_history:
                for message in conversation_history:
                    if message["role"] == "user":
                        messages.append(HumanMessage(content=message["content"]))
                    elif message["role"] == "assistant":
                        messages.append(AIMessage(content=message["content"]))

            # Add the user's query
            messages.append(HumanMessage(content=query))

            # Generate response from LLM
            logger.info(f"Sending request to {self.provider} LLM")
            response = self.llm.invoke(messages)
            logger.info("Received response from LLM")

            return response.content

        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}")
            raise

from langchain_openai import ChatOpenAI
from langchain_community.llms import HuggingFaceEndpoint
from langchain.schema import HumanMessage
from app.config import settings
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)


class LLMService:
    """
    Service for interacting with different LLM providers through LangChain.
    Currently supports OpenAI and Gemma models.
    """

    def __init__(self):
        """Initialize the LLM service with the configured provider"""
        self.provider = settings.llm_provider
        logger.info(f"Initializing LLM service with provider: {self.provider}")
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the LLM based on the configured provider"""
        if self.provider == "openai":
            if not settings.openai_api_key:
                logger.warning(
                    "OpenAI API key not provided. Some functionality may not work."
                )

            logger.debug(
                f"Creating OpenAI chat model with model: {settings.openai_model_name}"
            )
            return ChatOpenAI(
                api_key=settings.openai_api_key,
                model_name=settings.openai_model_name,
                temperature=0.7,
            )

        elif self.provider == "gemma":
            if not settings.gemma_api_key:
                logger.warning(
                    "Gemma API key not provided. Some functionality may not work."
                )

            logger.debug(
                f"Creating Gemma model with model: {settings.gemma_model_name}"
            )
            return HuggingFaceEndpoint(
                endpoint_url=f"https://api-inference.huggingface.co/models/google/{settings.gemma_model_name}",
                huggingfacehub_api_token=settings.gemma_api_key,
                temperature=0.7,
                max_new_tokens=512,
            )

        else:
            error_msg = f"Unsupported LLM provider: {self.provider}"
            logger.error(error_msg)
            raise ValueError(error_msg)

    async def generate_response(self, query: str) -> str:
        """
        Generate a response for the given query using the configured LLM.

        Args:
            query: The user's query

        Returns:
            The generated response text
        """
        try:
            logger.info(f"Generating response using {self.provider}")
            logger.debug(f"Query: {query[:100]}{'...' if len(query) > 100 else ''}")

            if self.provider == "openai":
                messages = [HumanMessage(content=query)]
                response = await self.llm.ainvoke(messages)
                result = response.content
                logger.debug(f"Response generated (length: {len(result)})")
                return result

            elif self.provider == "gemma":
                response = await self.llm.agenerate([query])
                result = response.generations[0][0].text
                logger.debug(f"Response generated (length: {len(result)})")
                return result

            else:
                error_msg = f"Error: Unsupported LLM provider {self.provider}"
                logger.error(error_msg)
                return error_msg

        except Exception as e:
            error_msg = f"Error generating LLM response: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return f"I encountered an error processing your query: {str(e)}"


# Create a singleton instance
logger.debug("Creating LLMService singleton instance")
llm_service = LLMService()

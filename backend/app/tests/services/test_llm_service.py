import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.services.llm_service import LLMService
from app.config import settings


@pytest.mark.asyncio
async def test_llm_service_init_openai():
    """Test LLMService initialization with OpenAI provider"""
    with patch("app.services.llm_service.ChatOpenAI") as mock_openai:
        with patch("app.services.llm_service.settings") as mock_settings:
            # Configure mock settings
            mock_settings.llm_provider = "openai"
            mock_settings.openai_api_key = "test-key"
            mock_settings.openai_model_name = "gpt-3.5-turbo"
            
            # Initialize service
            service = LLMService()
            
            # Verify correct provider was selected
            assert service.provider == "openai"
            
            # Verify OpenAI was initialized with correct parameters
            mock_openai.assert_called_once_with(
                api_key="test-key",
                model_name="gpt-3.5-turbo",
                temperature=0.7
            )


@pytest.mark.asyncio
async def test_llm_service_init_gemma():
    """Test LLMService initialization with Gemma provider"""
    with patch("app.services.llm_service.HuggingFaceEndpoint") as mock_hf:
        with patch("app.services.llm_service.settings") as mock_settings:
            # Configure mock settings
            mock_settings.llm_provider = "gemma"
            mock_settings.gemma_api_key = "test-gemma-key"
            mock_settings.gemma_model_name = "gemma-7b-it"
            
            # Initialize service
            service = LLMService()
            
            # Verify correct provider was selected
            assert service.provider == "gemma"
            
            # Verify Hugging Face endpoint was initialized with correct parameters
            mock_hf.assert_called_once_with(
                endpoint_url="https://api-inference.huggingface.co/models/google/gemma-7b-it",
                huggingfacehub_api_token="test-gemma-key",
                temperature=0.7,
                max_new_tokens=512
            )


@pytest.mark.asyncio
async def test_llm_service_init_unsupported():
    """Test LLMService initialization with unsupported provider"""
    with patch("app.services.llm_service.settings") as mock_settings:
        # Configure mock settings
        mock_settings.llm_provider = "unsupported-provider"
        
        # Verify exception is raised
        with pytest.raises(ValueError) as excinfo:
            LLMService()
        
        assert "Unsupported LLM provider" in str(excinfo.value)


@pytest.mark.asyncio
async def test_generate_response_openai():
    """Test response generation with OpenAI"""
    with patch("app.services.llm_service.ChatOpenAI") as mock_openai:
        with patch("app.services.llm_service.settings") as mock_settings:
            # Configure mock settings
            mock_settings.llm_provider = "openai"
            mock_settings.openai_api_key = "test-key"
            mock_settings.openai_model_name = "gpt-3.5-turbo"
            
            # Configure mock response
            mock_llm = AsyncMock()
            mock_response = MagicMock()
            mock_response.content = "This is a test response"
            mock_llm.ainvoke.return_value = mock_response
            mock_openai.return_value = mock_llm
            
            # Initialize service and generate response
            service = LLMService()
            response = await service.generate_response("What is the meaning of life?")
            
            # Verify response
            assert response == "This is a test response"
            mock_llm.ainvoke.assert_called_once()


@pytest.mark.asyncio
async def test_generate_response_gemma():
    """Test response generation with Gemma"""
    with patch("app.services.llm_service.HuggingFaceEndpoint") as mock_hf:
        with patch("app.services.llm_service.settings") as mock_settings:
            # Configure mock settings
            mock_settings.llm_provider = "gemma"
            mock_settings.gemma_api_key = "test-gemma-key"
            mock_settings.gemma_model_name = "gemma-7b-it"
            
            # Configure mock response
            mock_llm = AsyncMock()
            mock_generations = [[MagicMock(text="This is a test response from Gemma")]]
            mock_response = MagicMock(generations=mock_generations)
            mock_llm.agenerate.return_value = mock_response
            mock_hf.return_value = mock_llm
            
            # Initialize service and generate response
            service = LLMService()
            response = await service.generate_response("What is the meaning of life?")
            
            # Verify response
            assert response == "This is a test response from Gemma"
            mock_llm.agenerate.assert_called_once()


@pytest.mark.asyncio
async def test_generate_response_exception():
    """Test error handling in response generation"""
    with patch("app.services.llm_service.ChatOpenAI") as mock_openai:
        with patch("app.services.llm_service.settings") as mock_settings:
            # Configure mock settings
            mock_settings.llm_provider = "openai"
            mock_settings.openai_api_key = "test-key"
            mock_settings.openai_model_name = "gpt-3.5-turbo"
            
            # Configure mock to raise exception
            mock_llm = AsyncMock()
            mock_llm.ainvoke.side_effect = Exception("Test error")
            mock_openai.return_value = mock_llm
            
            # Initialize service and generate response
            service = LLMService()
            response = await service.generate_response("What is the meaning of life?")
            
            # Verify error message is returned
            assert "I encountered an error processing your query: Test error" == response
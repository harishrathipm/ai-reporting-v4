import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi import HTTPException
from app.routers.query import process_query, get_conversation
from app.models.query import QueryRequest, Conversation, Message


@pytest.mark.asyncio
async def test_process_query_success():
    """Test successful query processing"""
    # Mock data
    request = QueryRequest(query="Test query")
    mock_response = MagicMock(
        query="Test query",
        result="Test result",
        status="success",
        conversation_id="test-convo-id",
        metadata={"execution_time": "0.5s"}
    )
    
    # Set up mock
    with patch("app.routers.query.query_processor") as mock_processor:
        mock_processor.process_query = AsyncMock(return_value=mock_response)
        
        # Call the route function
        response = await process_query(request)
        
        # Verify the response
        assert response == mock_response
        mock_processor.process_query.assert_called_once_with(request)


@pytest.mark.asyncio
async def test_process_query_exception():
    """Test error handling in query processing"""
    # Mock data
    request = QueryRequest(query="Test query")
    
    # Set up mock to raise exception
    with patch("app.routers.query.query_processor") as mock_processor:
        mock_processor.process_query = AsyncMock(side_effect=Exception("Test error"))
        
        # Call the route function and expect exception
        with pytest.raises(HTTPException) as exc_info:
            await process_query(request)
        
        # Verify exception details
        assert exc_info.value.status_code == 500
        assert "Error processing query: Test error" in exc_info.value.detail


@pytest.mark.asyncio
async def test_get_conversation_success():
    """Test successful conversation retrieval"""
    # Mock data
    conversation_id = "test-convo-id"
    mock_conversation = Conversation(
        id=conversation_id,
        messages=[
            Message(role="user", content="Hello", timestamp="2025-05-04T12:00:00"),
            Message(role="assistant", content="Hi there", timestamp="2025-05-04T12:00:01")
        ],
        metadata={"created_at": "2025-05-04T12:00:00"}
    )
    
    # Set up mock
    with patch("app.routers.query.query_processor") as mock_processor:
        mock_processor.get_conversation.return_value = mock_conversation
        
        # Call the route function
        response = await get_conversation(conversation_id)
        
        # Verify the response
        assert response == mock_conversation
        assert len(response.messages) == 2
        mock_processor.get_conversation.assert_called_once_with(conversation_id)


@pytest.mark.asyncio
async def test_get_conversation_not_found():
    """Test error handling when conversation is not found"""
    # Mock data
    conversation_id = "nonexistent-id"
    
    # Set up mock to return None (conversation not found)
    with patch("app.routers.query.query_processor") as mock_processor:
        mock_processor.get_conversation.return_value = None
        
        # Call the route function and expect exception
        with pytest.raises(HTTPException) as exc_info:
            await get_conversation(conversation_id)
        
        # Verify exception details
        assert exc_info.value.status_code == 404
        assert f"Conversation {conversation_id} not found" in exc_info.value.detail
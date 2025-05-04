import pytest
from app.services.query_processor import QueryProcessorService
from app.models.query import QueryRequest


@pytest.mark.asyncio
async def test_query_processor_init():
    """Test that QueryProcessorService initializes correctly."""
    processor = QueryProcessorService()
    assert processor.conversations == {}


@pytest.mark.asyncio
async def test_process_query():
    """Test basic query processing functionality."""
    processor = QueryProcessorService()

    # Process a simple query
    request = QueryRequest(query="What is the total revenue?")
    response = await processor.process_query(request)

    # Verify response
    assert response.query == "What is the total revenue?"
    assert response.result is not None and response.result != ""
    assert response.status == "success"
    assert response.conversation_id is not None

    # Verify conversation was created
    conversation_id = response.conversation_id
    assert conversation_id in processor.conversations
    assert len(processor.conversations[conversation_id].messages) == 2

    # Verify messages
    messages = processor.conversations[conversation_id].messages
    assert messages[0].role == "user"
    assert messages[0].content == "What is the total revenue?"
    assert messages[1].role == "assistant"
    assert messages[1].content == response.result


@pytest.mark.asyncio
async def test_conversation_continuity():
    """Test that conversations maintain state across multiple queries."""
    processor = QueryProcessorService()

    # First query creates conversation
    request1 = QueryRequest(query="What is the total revenue?")
    response1 = await processor.process_query(request1)
    conversation_id = response1.conversation_id

    # Second query continues conversation
    request2 = QueryRequest(
        query="Break it down by quarter", conversation_id=conversation_id
    )
    response2 = await processor.process_query(request2)

    # Verify conversation continued
    assert response2.conversation_id == conversation_id
    assert (
        len(processor.conversations[conversation_id].messages) == 4
    )  # 2 messages per query (user + assistant)

    # Verify message sequence
    messages = processor.conversations[conversation_id].messages
    assert messages[0].content == "What is the total revenue?"
    assert messages[1].content == response1.result
    assert messages[2].content == "Break it down by quarter"
    assert messages[3].content == response2.result


@pytest.mark.asyncio
async def test_get_conversation():
    """Test retrieving a conversation by ID."""
    processor = QueryProcessorService()

    # Create conversation via query
    request = QueryRequest(query="What is the total revenue?")
    response = await processor.process_query(request)
    conversation_id = response.conversation_id

    # Retrieve conversation
    conversation = processor.get_conversation(conversation_id)

    # Verify conversation data
    assert conversation is not None
    assert conversation.id == conversation_id
    assert len(conversation.messages) == 2

    # Non-existent conversation should return None
    non_existent = processor.get_conversation("non-existent-id")
    assert non_existent is None

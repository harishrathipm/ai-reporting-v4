from fastapi import APIRouter, HTTPException, Path
from app.models.query import QueryRequest, QueryResponse, Conversation
from app.services.query_processor import query_processor
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

router = APIRouter(prefix="/api/query", tags=["query"])


@router.post("/", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a natural language query and return results
    """
    try:
        logger.info(f"Received query request: {request.query[:50]}...")
        # Use the query processor service to handle the query
        response = await query_processor.process_query(request)
        logger.info(f"Query processed successfully, returning response")
        return response
    except Exception as e:
        error_msg = f"Error processing query: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)


@router.get("/conversation/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str = Path(
        ..., description="The ID of the conversation to retrieve"
    )
):
    """
    Get the history of a conversation by ID
    """
    logger.info(f"Retrieving conversation: {conversation_id}")
    conversation = query_processor.get_conversation(conversation_id)
    if not conversation:
        logger.warning(f"Conversation not found: {conversation_id}")
        raise HTTPException(
            status_code=404, detail=f"Conversation {conversation_id} not found"
        )
    logger.info(f"Returning conversation with {len(conversation.messages)} messages")
    return conversation

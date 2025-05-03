from fastapi import APIRouter, HTTPException
from app.models.query import QueryRequest, QueryResponse

router = APIRouter(prefix="/api/query", tags=["query"])

@router.post("/", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a natural language query and return results
    """
    try:
        # Simple demo response for the Hello World version
        # In a real implementation, this would use LangChain to process the query
        return QueryResponse(
            query=request.query,
            result=f"Hello World! I processed your query: '{request.query}'",
            status="success",
            metadata={
                "execution_time": "0.1s",
                "data_sources": ["demo_source"]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
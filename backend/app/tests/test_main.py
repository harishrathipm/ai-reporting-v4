import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from app.main import app
from fastapi.middleware.cors import CORSMiddleware


@pytest.fixture
def client():
    """Create a test client for the FastAPI app"""
    return TestClient(app)


def test_root_endpoint(client):
    """Test the root endpoint returns correct information"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "name": "Dynamic Reporting AI", 
        "version": "0.1.0", 
        "status": "operational"
    }


def test_health_check_endpoint(client):
    """Test the health check endpoint returns healthy status"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_cors_middleware():
    """Test CORS middleware is properly configured in the application"""
    # Check that CORS middleware is in the app middleware
    cors_middleware_exists = False
    for middleware in app.user_middleware:
        if middleware.cls.__name__ == "CORSMiddleware":
            cors_middleware_exists = True
            break
    
    assert cors_middleware_exists, "CORS middleware not found in the application"
    
    # Test CORS by making a preflight request
    client = TestClient(app)
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    response = client.options("/api/query/", headers=headers)
    
    # Verify CORS headers in response
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"
    assert "POST" in response.headers["access-control-allow-methods"]


@pytest.mark.asyncio
async def test_log_requests_middleware():
    """Test the logging middleware"""
    # Mock request and response
    mock_request = MagicMock()
    mock_request.method = "GET"
    mock_request.url.path = "/test"
    mock_request.client.host = "127.0.0.1"
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    
    # Mock call_next function
    async def mock_call_next(_):
        return mock_response
    
    # Import middleware function
    from app.main import log_requests
    
    # Execute middleware with mocks
    with patch("app.main.time.time") as mock_time:
        # Set up mock time to first return 0, then 1 (to simulate 1 second elapsed)
        mock_time.side_effect = [0, 1]
        
        # Call the middleware
        response = await log_requests(mock_request, mock_call_next)
        
        # Verify the response is passed through
        assert response == mock_response


def test_app_includes_query_router():
    """Test that the query router is included in the app"""
    router_names = [route.name for route in app.routes]
    # Check for the route functions from the query router
    assert "process_query" in router_names
    assert "get_conversation" in router_names
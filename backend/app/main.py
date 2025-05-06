import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)


# Define lifespan context manager (new approach)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Application startup complete")
    yield
    # Shutdown logic
    logger.info("Application shutdown complete")


# Create FastAPI app with lifespan handler
app = FastAPI(
    title="Dynamic Reporting AI",
    description="AI-powered Virtual Data Analyst",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Log the request
    logger.info(f"Request: {request.method} {request.url.path}")
    logger.debug(f"Client: {request.client.host if request.client else 'Unknown'}")

    # Process the request
    response = await call_next(request)

    # Log the response
    process_time = (time.time() - start_time) * 1000
    logger.info(f"Response: {response.status_code} - Took {process_time:.2f}ms")

    return response


@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"name": "Dynamic Reporting AI", "version": "0.1.0", "status": "operational"}


@app.get("/api/health")
async def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}

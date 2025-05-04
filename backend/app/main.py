from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import query
from app.utils.logging_utils import get_logger
import time

# Get module-specific logger
logger = get_logger(__name__)

app = FastAPI(
    title="Dynamic Reporting AI",
    description="AI-powered Virtual Data Analyst",
    version="0.1.0",
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


# Include routers
app.include_router(query.router)


@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"name": "Dynamic Reporting AI", "version": "0.1.0", "status": "operational"}


@app.get("/api/health")
async def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}


# Log application startup
@app.on_event("startup")
async def startup_event():
    logger.info("Application startup complete")


# Log application shutdown
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown complete")

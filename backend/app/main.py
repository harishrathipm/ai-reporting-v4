from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import query

app = FastAPI(
    title="Dynamic Reporting AI",
    description="AI-powered Virtual Data Analyst",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query.router)

@app.get("/")
async def root():
    return {
        "name": "Dynamic Reporting AI",
        "version": "0.1.0",
        "status": "operational"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
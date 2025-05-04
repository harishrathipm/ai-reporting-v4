import os
from pathlib import Path
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

# Find .env file location
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"

# Load environment variables from .env file
try:
    from dotenv import load_dotenv

    if env_path.exists():
        logger.info(f"Loading environment from: {env_path}")
        load_dotenv(dotenv_path=env_path)
    else:
        logger.warning(
            f".env file not found at {env_path}, using environment variables only"
        )
except ImportError:
    logger.warning("python-dotenv not installed, using environment variables only")


class Settings:
    """Application settings loaded from environment variables with fallbacks to default values."""

    # API settings
    api_title: str = "Dynamic Reporting AI"
    api_description: str = "AI-powered Virtual Data Analyst"
    api_version: str = "0.1.0"

    # LLM settings
    llm_provider: str = os.getenv("LLM_PROVIDER", "openai")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model_name: str = os.getenv("OPENAI_MODEL_NAME", "gpt-3.5-turbo")
    gemma_api_key: str = os.getenv("GEMMA_API_KEY", "")
    gemma_model_name: str = os.getenv("GEMMA_MODEL_NAME", "gemma-7b-it")

    # Database settings
    mongodb_uri: str = os.getenv(
        "MONGODB_URI", "mongodb://localhost:27017/ai_reporting"
    )
    sql_connection_string: str = os.getenv(
        "SQL_CONNECTION_STRING",
        "postgresql://postgres:postgres@localhost:5432/ai_reporting",
    )

    # Logging settings
    log_level: str = os.getenv("LOG_LEVEL", "INFO")


# Create settings instance
settings = Settings()


# Log loaded settings (without showing sensitive values)
def _get_safe_settings():
    """Get settings without sensitive values for logging"""
    safe_settings = {}
    for key, value in vars(settings).items():
        if any(
            sensitive in key for sensitive in ["key", "password", "secret", "token"]
        ):
            safe_settings[key] = "***" if value else "not set"
        else:
            safe_settings[key] = value
    return safe_settings


logger.debug(f"Settings loaded: {_get_safe_settings()}")

"""
Logging utilities for the application using loguru.
"""

import os
import sys
from pathlib import Path
from loguru import logger

# Get the absolute path to the logs directory
logs_dir = Path(__file__).parent.parent / "logs"
logs_dir.mkdir(exist_ok=True)

# Define log level from environment variable or use INFO as default
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

# Remove default handler
logger.remove()

# Add console handler
logger.add(
    sys.stdout,
    level=LOG_LEVEL,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
)

# Add file handler with rotation
logger.add(
    logs_dir / "app_{time:YYYY-MM-DD}.log",
    rotation="00:00",  # Rotate at midnight
    retention="30 days",  # Keep logs for 30 days
    compression="zip",  # Compress rotated logs
    level=LOG_LEVEL,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    encoding="utf-8",
)

# Log startup information
logger.info(f"Logging initialized with level: {LOG_LEVEL}")
logger.info(f"Logs will be written to: {logs_dir.absolute()}")
logger.info(
    "Log rotation configured: daily rotation, 30 days retention, with compression"
)


def get_logger(name: str):
    """
    Get a contextualized logger with the given name.

    Args:
        name: The name of the module (typically __name__)

    Returns:
        A logger instance bound with the given context
    """
    return logger.bind(name=name)

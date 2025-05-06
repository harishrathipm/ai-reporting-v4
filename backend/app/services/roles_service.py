"""
Roles Service - Handles role management and access.
"""
from typing import List
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

class RolesService:
    """
    Service for handling roles and access control.
    Currently uses hardcoded roles as per requirements, but could be extended
    to load from database or external service.
    """

    # Define available roles (hardcoded for now as per requirements)
    AVAILABLE_ROLES = ["Executive", "DataAnalyst"]

    @classmethod
    def get_available_roles(cls) -> List[str]:
        """
        Get the list of available roles.

        Returns:
            List of available role names
        """
        logger.info(f"Returning {len(cls.AVAILABLE_ROLES)} available roles")
        return cls.AVAILABLE_ROLES

    @classmethod
    def is_valid_role(cls, role: str) -> bool:
        """
        Check if a role is valid.

        Args:
            role: The role name to check

        Returns:
            True if the role is valid, False otherwise
        """
        is_valid = role in cls.AVAILABLE_ROLES
        if not is_valid:
            logger.warning(f"Invalid role requested: {role}")
        return is_valid

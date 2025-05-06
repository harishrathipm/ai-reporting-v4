"""
Roles Router - API endpoints for role-related functionality.
"""
from fastapi import APIRouter, Depends
from app.models.roles import RolesResponse
from app.services.roles_service import RolesService
from app.utils.logging_utils import get_logger

# Get module-specific logger
logger = get_logger(__name__)

# Create router
router = APIRouter(
    prefix="/api",
    tags=["roles"],
)

@router.get("/roles", response_model=RolesResponse)
async def get_roles():
    """
    Get the list of available roles.

    Returns:
        RolesResponse: The list of available roles.
    """
    logger.info("API endpoint called: GET /roles")
    roles = RolesService.get_available_roles()
    return RolesResponse(roles=roles)

from pydantic import BaseModel
from typing import List

class RolesResponse(BaseModel):
    """Response model for the roles endpoint."""
    roles: List[str]

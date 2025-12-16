from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class DeleteAccount(BaseModel):
    password: str
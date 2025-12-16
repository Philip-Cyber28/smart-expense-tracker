from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExpenseBase(BaseModel):
    title : str
    amount: float
    date: Optional[datetime] = None

class ExpenseCreate(ExpenseBase):
    category_id : int

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None

class ExpenseResponse(ExpenseBase):
    id: int
    title: str
    amount: float
    category: str
    date: Optional[datetime] = None

    class Config:
        from_attributes = True
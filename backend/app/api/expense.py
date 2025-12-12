from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List,Optional

from app.db.database import SessionLocal
from app.models.models import Expense, User
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.services.dependencies import get_current_user

router = APIRouter(tags=["Expenses"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE EXPENSE
@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_expense = Expense(
        title = expense.title,
        amount = expense.amount,
        category_id = expense.category_id,
        user_id = current_user.id
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

# GET EXPENSE
@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    category_id: Optional[int] = None
):
    query = db.query(Expense).filter(Expense.user_id == current_user.id)

    if category_id:
        query = query.filter(Expense.category_id == category_id)
    
    return query.all()

# UPDATE EXPENSE
@router.put("/{expense_id}", response_model = ExpenseResponse)
def update_expense(
    expense_id: int,
    data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if data.title: expense.title = data.title
    if data.amount: expense.amount = data.amount
    if data.category_id: expense.category_id = data.category_id
    if data.date: expense.date = data.date

    db.commit()
    db.refresh(expense)
    return expense

# DELETE EXPENSE
@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()

    return{"message": "Expense deleted successfully"}


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import User
from app.schemas.user import UserUpdate, DeleteAccount
from app.services.dependencies import get_current_user
from app.services.auth import verify_password

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.put("/me")
def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.username:
        user.username = data.username
    if data.email:
        user.email = data.email

    db.commit()
    return {"message": "Profile updated"}

# DELETE ACCOUNT
@router.post("/delete")
def delete_account(
    data: DeleteAccount,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    db.delete(user)
    db.commit()
    return {"message": "Account deleted successfully"}

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import  Session
from app.schemas import auth as schemas
from app.models.models import User
from app.db.database import SessionLocal
from app.services import auth as auth_service
from app.schemas.auth import UserOut
from app.services.dependencies import get_current_user, get_db

router = APIRouter(tags=["Authentication"])

#USER REGISTER
@router.post("/register")
def register(user: schemas.UserCreate, response: Response, db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code =400, detail="Username already exists")
    
    hashed_password =auth_service.hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth_service.create_access_token({"sub": str(new_user.id)})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=3600 * 24 * 7
    )
    return {"message": "Registration successful"}

#USER LOGIN
@router.post("/login")
def login(user: schemas.UserLogin, response: Response, db : Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not auth_service.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth_service.create_access_token({"sub": str(db_user.id)})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=3600 * 24 * 7
    )

    return {"message": "Login successful"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
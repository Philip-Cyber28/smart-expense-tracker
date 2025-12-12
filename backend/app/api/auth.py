from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import  Session
from app.schemas import auth as schemas
from app.models.models import User
from app.db.database import SessionLocal
from app.services import auth as auth_service

router = APIRouter(tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

#USER REGISTER
@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code =400, detail="Username already exists")
    hashed_password =auth_service.hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = auth_service.create_access_token({"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

#USER LOGIN
@router.post("/login" , response_model=schemas.Token)
def login(user: schemas.UserLogin, db : Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not auth_service.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth_service.create_access_token({"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
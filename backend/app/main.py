from fastapi import FastAPI, Depends
from app.api import auth
from app.services.dependencies import get_current_user
from app.api import expense

app = FastAPI(
    title="Smart Tracker Expense API",
    description="API for managing personal expenses",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(expense.router, prefix="/expenses")

@app.get("/")
def read_root():
    return {"message": "Smart expense tracker is working"} 

@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello,{current_user}"}
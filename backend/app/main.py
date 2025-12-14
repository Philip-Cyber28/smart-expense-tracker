from fastapi import FastAPI, Depends
from app.api import auth, expense, ocr
from app.services.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Tracker Expense API",
    description="API for managing personal expenses",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # In case you use different port
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(expense.router, prefix="/expenses")
app.include_router(ocr.router)

@app.get("/")
def read_root():
    return {"message": "Smart expense tracker is working"} 

@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello,{current_user}"}
    